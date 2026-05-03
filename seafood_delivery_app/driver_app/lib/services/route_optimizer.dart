import 'dart:math';
import 'package:latlong2/latlong.dart';
import '../models/assigned_order_model.dart';
import '../models/route_stop_model.dart';

/// Client-side Nearest-Neighbor route optimizer.
///
/// Given the driver's current GPS position and a list of delivery orders,
/// returns a new list sorted so the driver always moves to the
/// closest unvisited stop first.  Pure Dart — no network call needed.
class RouteOptimizer {
  /// Returns the optimised list of [RouteStop]s for the given orders.
  static List<RouteStop> optimize({
    required LatLng driverPosition,
    required List<AssignedOrder> orders,
  }) {
    if (orders.isEmpty) return [];

    final unvisited = orders.where((o) => o.hasCoordinates).toList();
    final result = <RouteStop>[];
    LatLng current = driverPosition;

    while (unvisited.isNotEmpty) {
      AssignedOrder nearest = unvisited.reduce(
        (a, b) => _dist(current, LatLng(a.deliveryLat!, a.deliveryLng!)) <=
                _dist(current, LatLng(b.deliveryLat!, b.deliveryLng!))
            ? a
            : b,
      );
      final dest = LatLng(nearest.deliveryLat!, nearest.deliveryLng!);
      final dist = _dist(current, dest);
      result.add(RouteStop(
        orderId: nearest.orderId,
        sequence: result.length + 1,
        deliveryAddress: nearest.deliveryAddress,
        location: dest,
        distanceFromPrevMeters: dist,
        status: nearest.status,
        total: nearest.total,
      ));
      unvisited.remove(nearest);
      current = dest;
    }
    return result;
  }

  /// Re-runs after a delivery is completed — removes that stop and re-sequences.
  static List<RouteStop> reOptimize({
    required LatLng driverPosition,
    required List<AssignedOrder> remainingOrders,
  }) =>
      optimize(driverPosition: driverPosition, orders: remainingOrders);

  /// Haversine great-circle distance in metres.
  static double _dist(LatLng a, LatLng b) {
    const R = 6371000.0;
    final dLat = _rad(b.latitude - a.latitude);
    final dLng = _rad(b.longitude - a.longitude);
    final lat1 = _rad(a.latitude);
    final lat2 = _rad(b.latitude);
    final x = sin(dLat / 2) * sin(dLat / 2) +
        cos(lat1) * cos(lat2) * sin(dLng / 2) * sin(dLng / 2);
    return 2 * R * atan2(sqrt(x), sqrt(1 - x));
  }

  static double _rad(double deg) => deg * pi / 180;

  /// Returns distance in metres between driver and a specific order's address.
  static double distanceTo(LatLng driver, AssignedOrder order) {
    if (!order.hasCoordinates) return double.infinity;
    return _dist(driver, LatLng(order.deliveryLat!, order.deliveryLng!));
  }

  /// Returns true if driver is within [thresholdMeters] of [destination].
  static bool isWithinProximity(LatLng driver, LatLng destination, double thresholdMeters) =>
      _dist(driver, destination) <= thresholdMeters;
}
