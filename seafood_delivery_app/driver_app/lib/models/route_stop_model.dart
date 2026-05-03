import 'package:latlong2/latlong.dart';

class RouteStop {
  final int orderId;
  final int sequence;
  final String deliveryAddress;
  final LatLng location;
  final double distanceFromPrevMeters;
  final String status;
  final double total;

  const RouteStop({
    required this.orderId,
    required this.sequence,
    required this.deliveryAddress,
    required this.location,
    required this.distanceFromPrevMeters,
    required this.status,
    required this.total,
  });

  String get distanceLabel {
    if (distanceFromPrevMeters >= 1000) {
      return '${(distanceFromPrevMeters / 1000).toStringAsFixed(1)} km';
    }
    return '${distanceFromPrevMeters.toInt()} m';
  }

  bool get isCompleted => status == 'delivered';
  bool get isActive => status == 'in_transit' || status == 'picked_up';

  factory RouteStop.fromJson(Map<String, dynamic> json) => RouteStop(
        orderId: json['order_id'] as int,
        sequence: json['sequence'] as int,
        deliveryAddress: json['delivery_address'] as String? ?? '',
        location: LatLng(
          (json['delivery_lat'] as num).toDouble(),
          (json['delivery_lng'] as num).toDouble(),
        ),
        distanceFromPrevMeters:
            (json['distance_from_prev_m'] as num?)?.toDouble() ?? 0,
        status: json['status'] as String,
        total: (json['total'] as num?)?.toDouble() ?? 0,
      );
}
