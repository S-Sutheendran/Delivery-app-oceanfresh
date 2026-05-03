import 'package:flutter/foundation.dart';
import 'package:latlong2/latlong.dart';
import '../config/constants.dart';
import '../services/driver_api_service.dart';
import '../services/location_service.dart';
import '../services/route_optimizer.dart';

class LocationProvider extends ChangeNotifier {
  final LocationService _locationService = LocationService();

  LatLng? _position;
  bool _tracking = false;
  int? _activeOrderId;
  bool _proximityAlerted = false;
  LatLng? _deliveryTarget;

  LatLng? get position => _position;
  bool get isTracking => _tracking;
  bool get hasPosition => _position != null;
  bool get withinProximity => _proximityAlerted;

  Future<void> fetchCurrentPosition() async {
    final pos = await _locationService.getCurrentPosition();
    if (pos != null) {
      _position = pos;
      notifyListeners();
    }
  }

  /// Start tracking for a specific delivery order.
  Future<void> startTracking(int orderId, {LatLng? deliveryTarget}) async {
    _activeOrderId = orderId;
    _deliveryTarget = deliveryTarget;
    _proximityAlerted = false;
    _tracking = await _locationService.start(_onUpdate);
    notifyListeners();
  }

  void stopTracking() {
    _locationService.stop();
    _tracking = false;
    _activeOrderId = null;
    _deliveryTarget = null;
    notifyListeners();
  }

  void _onUpdate(LatLng pos) async {
    _position = pos;
    notifyListeners();

    // Ping backend with new position
    if (_activeOrderId != null) {
      try {
        await DriverApiService.pingLocation(_activeOrderId!, pos.latitude, pos.longitude);
      } catch (_) {}
    }

    // Local proximity check (for in-app banner)
    if (_deliveryTarget != null && !_proximityAlerted) {
      final within = RouteOptimizer.isWithinProximity(
        pos,
        _deliveryTarget!,
        AppConstants.proximityThresholdMeters,
      );
      if (within) {
        _proximityAlerted = true;
        notifyListeners();
      }
    }
  }

  void updateDeliveryTarget(LatLng target) {
    _deliveryTarget = target;
    _proximityAlerted = false;
    notifyListeners();
  }
}
