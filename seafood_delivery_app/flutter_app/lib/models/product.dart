class Product {
  final int id;
  final String name;
  final String description;
  final double price;
  final double? originalPrice;
  final String imageUrl;
  final String categoryId;
  final String categoryName;
  final double rating;
  final int reviewCount;
  final bool isBestSeller;
  final bool isTopRated;
  final bool isSeasonal;
  final bool inStock;
  final String unit;       // e.g. "per kg", "per piece", "500g pack"
  final String? origin;
  final String? cookingTip;
  final List<String> tags;
  final int stockQuantity;

  const Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    this.originalPrice,
    required this.imageUrl,
    required this.categoryId,
    required this.categoryName,
    required this.rating,
    required this.reviewCount,
    this.isBestSeller = false,
    this.isTopRated = false,
    this.isSeasonal = false,
    this.inStock = true,
    this.unit = 'per kg',
    this.origin,
    this.cookingTip,
    this.tags = const [],
    this.stockQuantity = 100,
  });

  double get discountPercent =>
      originalPrice != null && originalPrice! > price
          ? ((originalPrice! - price) / originalPrice! * 100).roundToDouble()
          : 0;

  bool get hasDiscount => discountPercent > 0;

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id: json['id'],
        name: json['name'],
        description: json['description'],
        price: (json['price'] as num).toDouble(),
        originalPrice: json['original_price'] != null
            ? (json['original_price'] as num).toDouble()
            : null,
        imageUrl: json['image_url'],
        categoryId: json['category_id'].toString(),
        categoryName: json['category_name'] ?? '',
        rating: (json['rating'] as num).toDouble(),
        reviewCount: json['review_count'] ?? 0,
        isBestSeller: json['is_best_seller'] ?? false,
        isTopRated: json['is_top_rated'] ?? false,
        isSeasonal: json['is_seasonal'] ?? false,
        inStock: json['in_stock'] ?? true,
        unit: json['unit'] ?? 'per kg',
        origin: json['origin'],
        cookingTip: json['cooking_tip'],
        tags: List<String>.from(json['tags'] ?? []),
        stockQuantity: json['stock_quantity'] ?? 100,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'price': price,
        'original_price': originalPrice,
        'image_url': imageUrl,
        'category_id': categoryId,
        'category_name': categoryName,
        'rating': rating,
        'review_count': reviewCount,
        'is_best_seller': isBestSeller,
        'is_top_rated': isTopRated,
        'is_seasonal': isSeasonal,
        'in_stock': inStock,
        'unit': unit,
        'origin': origin,
        'cooking_tip': cookingTip,
        'tags': tags,
        'stock_quantity': stockQuantity,
      };
}
