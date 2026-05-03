import 'package:flutter/foundation.dart';
import 'package:latlong2/latlong.dart';
import '../models/assigned_order_model.dart';
import '../models/route_stop_model.dart';
import '../services/driver_api_service.dart';
import '../services/route_optimizer.dart';

enum OrderLoadState { idle, loading, loaded, error }

class OrderProvider extends ChangeNotifier {
  List<AssignedOrder> _orders = [];
  List<RouteStop> _optimizedRoute = [];
  OrderLoadState _state = OrderLoadState.idle;
  String? _error;
  int _activeOrderIndex = 0;

  List<AssignedOrder> get orders => _orders;
  List<RouteStop> get optimizedRoute => _optimizedRoute;
  OrderLoadState get state => _state;
  String? get error => _error;
  bool get hasOrders => _orders.isNotEmpty;

  AssignedOrder? get currentOrder =>
      _orders.isEmpty ? null : _orders[_activeOrderIndex.clamp(0, _orders.length - 1)];

  Future<void> loadOrders() async {
    _state = OrderLoadState.loading;
    notifyListeners();
    try {
      final data = await DriverApiService.getAssignedOrders();
      _orders = (data['orders'] as List<dynamic>)
          .map((e) => AssignedOrder.fromJson(e as Map<String, dynamic>))
          .toList();
      _state = OrderLoadState.loaded;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _state = OrderLoadState.error;
    }
    notifyListeners();
  }

  /// Compute and cache the optimised delivery route from driver's current position.
  void optimizeRoute(LatLng driverPosition) {
    _optimizedRoute = RouteOptimizer.optimize(
      driverPosition: driverPosition,
      orders: _orders,
    );
    notifyListeners();
  }

  /// Called after a delivery is confirmed — removes completed order and re-optimises.
  void markDelivered(int orderId, LatLng driverPosition) {
    _orders.removeWhere((o) => o.orderId == orderId);
    if (_activeOrderIndex >= _orders.length && _activeOrderIndex > 0) {
      _activeOrderIndex--;
    }
    _optimizedRoute = RouteOptimizer.reOptimize(
      driverPosition: driverPosition,
      remainingOrders: _orders,
    );
    notifyListeners();
  }

  void setActiveIndex(int index) {
    _activeOrderIndex = index;
    notifyListeners();
  }

  /// Update the photo URL for an order after it's uploaded (local cache update).
  void setPhotoUrl(int orderId, String url) {
    final idx = _orders.indexWhere((o) => o.orderId == orderId);
    if (idx != -1) {
      final o = _orders[idx];
      _orders[idx] = AssignedOrder(
        orderId: o.orderId,
        status: o.status,
        deliveryAddress: o.deliveryAddress,
        deliveryLat: o.deliveryLat,
        deliveryLng: o.deliveryLng,
        total: o.total,
        itemCount: o.itemCount,
        items: o.items,
        deliveryPhotoUrl: url,
        driverAssignedAt: o.driverAssignedAt,
        pickedUpAt: o.pickedUpAt,
        deliveredAt: o.deliveredAt,
      );
      notifyListeners();
    }
  }

  void updateOrderStatus(int orderId, String newStatus) {
    final idx = _orders.indexWhere((o) => o.orderId == orderId);
    if (idx != -1) {
      final o = _orders[idx];
      _orders[idx] = AssignedOrder(
        orderId: o.orderId,
        status: newStatus,
        deliveryAddress: o.deliveryAddress,
        deliveryLat: o.deliveryLat,
        deliveryLng: o.deliveryLng,
        total: o.total,
        itemCount: o.itemCount,
        items: o.items,
        deliveryPhotoUrl: o.deliveryPhotoUrl,
        driverAssignedAt: o.driverAssignedAt,
        pickedUpAt: o.pickedUpAt,
      );
      notifyListeners();
    }
  }
}
