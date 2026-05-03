class DeliveryTag {
  final String key;
  final String label;
  final String emoji;

  const DeliveryTag({required this.key, required this.label, required this.emoji});

  factory DeliveryTag.fromJson(Map<String, dynamic> j) => DeliveryTag(
        key: j['key'] as String,
        label: j['label'] as String,
        emoji: j['emoji'] as String,
      );
}

class PendingReviewOrder {
  final int orderId;
  final double total;
  final int itemCount;
  final String? deliveredAt;
  final bool reviewRequested;

  const PendingReviewOrder({
    required this.orderId,
    required this.total,
    required this.itemCount,
    this.deliveredAt,
    required this.reviewRequested,
  });

  factory PendingReviewOrder.fromJson(Map<String, dynamic> j) => PendingReviewOrder(
        orderId: j['order_id'] as int,
        total: (j['total'] as num).toDouble(),
        itemCount: j['item_count'] as int,
        deliveredAt: j['delivered_at'] as String?,
        reviewRequested: j['review_requested'] == true,
      );
}

class UserOrder {
  final int orderId;
  final String status;
  final double total;
  final int itemCount;
  final String? createdAt;
  final String? deliveredAt;
  final bool canReview;
  final bool isReviewed;

  const UserOrder({
    required this.orderId,
    required this.status,
    required this.total,
    required this.itemCount,
    this.createdAt,
    this.deliveredAt,
    required this.canReview,
    required this.isReviewed,
  });

  factory UserOrder.fromJson(Map<String, dynamic> j) => UserOrder(
        orderId: j['order_id'] as int,
        status: j['status'] as String,
        total: (j['total'] as num).toDouble(),
        itemCount: j['item_count'] as int,
        createdAt: j['created_at'] as String?,
        deliveredAt: j['delivered_at'] as String?,
        canReview: j['can_review'] == true,
        isReviewed: j['is_reviewed'] == true,
      );
}

class OrderReview {
  final int deliveryRating;
  final List<String> deliveryTags;
  final String? comment;
  final String createdAt;

  const OrderReview({
    required this.deliveryRating,
    required this.deliveryTags,
    this.comment,
    required this.createdAt,
  });

  factory OrderReview.fromJson(Map<String, dynamic> j) => OrderReview(
        deliveryRating: j['delivery_rating'] as int,
        deliveryTags: List<String>.from(j['delivery_tags'] ?? []),
        comment: j['comment'] as String?,
        createdAt: j['created_at'] as String,
      );
}
