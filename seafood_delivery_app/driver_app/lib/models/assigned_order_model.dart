class AssignedOrder {
  final int orderId;
  final String status;
  final String deliveryAddress;
  final double? deliveryLat;
  final double? deliveryLng;
  final double total;
  final int itemCount;
  final List<OrderItemSummary> items;
  final String? deliveryPhotoUrl;
  final String? driverAssignedAt;
  final String? pickedUpAt;
  final String? deliveredAt;

  const AssignedOrder({
    required this.orderId,
    required this.status,
    required this.deliveryAddress,
    required this.total,
    required this.itemCount,
    required this.items,
    this.deliveryLat,
    this.deliveryLng,
    this.deliveryPhotoUrl,
    this.driverAssignedAt,
    this.pickedUpAt,
    this.deliveredAt,
  });

  bool get hasCoordinates => deliveryLat != null && deliveryLng != null;
  bool get photoUploaded => deliveryPhotoUrl != null;

  factory AssignedOrder.fromJson(Map<String, dynamic> json) => AssignedOrder(
        orderId: json['order_id'] as int,
        status: json['status'] as String,
        deliveryAddress: json['delivery_address'] as String? ?? 'Address not set',
        deliveryLat: (json['delivery_lat'] as num?)?.toDouble(),
        deliveryLng: (json['delivery_lng'] as num?)?.toDouble(),
        total: (json['total'] as num?)?.toDouble() ?? 0,
        itemCount: json['item_count'] as int? ?? 0,
        items: (json['items'] as List<dynamic>? ?? [])
            .map((e) => OrderItemSummary.fromJson(e as Map<String, dynamic>))
            .toList(),
        deliveryPhotoUrl: json['delivery_photo_url'] as String?,
        driverAssignedAt: json['driver_assigned_at'] as String?,
        pickedUpAt: json['picked_up_at'] as String?,
        deliveredAt: json['delivered_at'] as String?,
      );
}

class OrderItemSummary {
  final String name;
  final int quantity;
  final double unitPrice;

  const OrderItemSummary({
    required this.name,
    required this.quantity,
    required this.unitPrice,
  });

  factory OrderItemSummary.fromJson(Map<String, dynamic> json) => OrderItemSummary(
        name: json['name'] as String,
        quantity: json['quantity'] as int,
        unitPrice: (json['unit_price'] as num).toDouble(),
      );
}
