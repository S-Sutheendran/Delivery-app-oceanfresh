import 'dart:io';
import 'package:flutter/foundation.dart';
import '../services/driver_api_service.dart';
import '../services/image_upload_service.dart';

enum DeliveryState { idle, uploadingPhoto, confirming, done, error }

class DeliveryProvider extends ChangeNotifier {
  DeliveryState _state = DeliveryState.idle;
  String? _photoUrl;
  String? _error;

  DeliveryState get state => _state;
  String? get photoUrl => _photoUrl;
  bool get photoReady => _photoUrl != null;
  String? get error => _error;
  bool get busy => _state == DeliveryState.uploadingPhoto || _state == DeliveryState.confirming;

  /// Upload proof-of-delivery photo.  Must succeed before [confirmDelivery] can be called.
  Future<bool> uploadDeliveryPhoto(int orderId, File photo) async {
    _state = DeliveryState.uploadingPhoto;
    _error = null;
    _photoUrl = null;
    notifyListeners();
    try {
      final compressed = await ImageUploadService.compress(photo);
      final url = await DriverApiService.uploadDeliveryPhoto(orderId, compressed);
      _photoUrl = url;
      _state = DeliveryState.idle;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _state = DeliveryState.error;
      notifyListeners();
      return false;
    }
  }

  /// Mark order as delivered.  Backend will reject if photo isn't uploaded.
  Future<bool> confirmDelivery(int orderId) async {
    if (_photoUrl == null) {
      _error = 'Please take a delivery photo first';
      notifyListeners();
      return false;
    }
    _state = DeliveryState.confirming;
    _error = null;
    notifyListeners();
    try {
      await DriverApiService.updateOrderStatus(orderId, 'delivered');
      _state = DeliveryState.done;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _state = DeliveryState.error;
      notifyListeners();
      return false;
    }
  }

  void reset() {
    _state = DeliveryState.idle;
    _photoUrl = null;
    _error = null;
    notifyListeners();
  }
}
