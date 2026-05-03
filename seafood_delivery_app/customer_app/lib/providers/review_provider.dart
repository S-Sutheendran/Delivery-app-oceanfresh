import 'package:flutter/foundation.dart';
import '../models/review_model.dart';
import '../services/api_service.dart';

enum ReviewLoadState { idle, loading, success, error }

class ReviewProvider extends ChangeNotifier {
  ReviewLoadState _state = ReviewLoadState.idle;
  List<DeliveryTag> _tags = [];
  List<PendingReviewOrder> _pendingReviews = [];
  List<UserOrder> _orders = [];
  String? _error;

  ReviewLoadState get state => _state;
  List<DeliveryTag> get tags => _tags;
  List<PendingReviewOrder> get pendingReviews => _pendingReviews;
  List<UserOrder> get orders => _orders;
  String? get error => _error;
  bool get hasPending => _pendingReviews.isNotEmpty;

  Future<void> loadTags() async {
    if (_tags.isNotEmpty) return;
    try {
      _tags = await ApiService.fetchDeliveryTags();
      notifyListeners();
    } catch (_) {}
  }

  Future<void> loadPendingReviews(String firebaseUid) async {
    try {
      _pendingReviews = await ApiService.fetchPendingReviews(firebaseUid);
      notifyListeners();
    } catch (_) {}
  }

  Future<void> loadOrders(String firebaseUid) async {
    _state = ReviewLoadState.loading;
    _error = null;
    notifyListeners();
    try {
      _orders = await ApiService.fetchUserOrders(firebaseUid);
      _state = ReviewLoadState.success;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _state = ReviewLoadState.error;
    }
    notifyListeners();
  }

  Future<bool> submitReview({
    required int orderId,
    required String firebaseUid,
    required int deliveryRating,
    required List<String> deliveryTags,
    String? comment,
    required List<Map<String, dynamic>> productRatings,
  }) async {
    try {
      await ApiService.submitReview(
        orderId: orderId,
        firebaseUid: firebaseUid,
        deliveryRating: deliveryRating,
        deliveryTags: deliveryTags,
        comment: comment,
        productRatings: productRatings,
      );
      // Update local state so UI reflects the change immediately
      _pendingReviews.removeWhere((r) => r.orderId == orderId);
      final idx = _orders.indexWhere((o) => o.orderId == orderId);
      if (idx != -1) {
        final o = _orders[idx];
        _orders[idx] = UserOrder(
          orderId: o.orderId,
          status: o.status,
          total: o.total,
          itemCount: o.itemCount,
          createdAt: o.createdAt,
          deliveredAt: o.deliveredAt,
          canReview: false,
          isReviewed: true,
        );
      }
      notifyListeners();
      return true;
    } catch (_) {
      return false;
    }
  }
}
