class Category {
  final String id;
  final String name;
  final String emoji;
  final String imageUrl;
  final int productCount;
  final String? description;

  const Category({
    required this.id,
    required this.name,
    required this.emoji,
    required this.imageUrl,
    this.productCount = 0,
    this.description,
  });

  factory Category.fromJson(Map<String, dynamic> json) => Category(
        id: json['id'].toString(),
        name: json['name'],
        emoji: json['emoji'] ?? '🐟',
        imageUrl: json['image_url'] ?? '',
        productCount: json['product_count'] ?? 0,
        description: json['description'],
      );

  // Static list used for local display while API loads
  static List<Category> get defaults => const [
        Category(id: '1', name: 'Fish', emoji: '🐟', imageUrl: 'https://picsum.photos/seed/fish/120/120', productCount: 30),
        Category(id: '2', name: 'Shrimp', emoji: '🦐', imageUrl: 'https://picsum.photos/seed/shrimp/120/120', productCount: 20),
        Category(id: '3', name: 'Crab', emoji: '🦀', imageUrl: 'https://picsum.photos/seed/crab/120/120', productCount: 15),
        Category(id: '4', name: 'Lobster', emoji: '🦞', imageUrl: 'https://picsum.photos/seed/lobster/120/120', productCount: 10),
        Category(id: '5', name: 'Squid', emoji: '🦑', imageUrl: 'https://picsum.photos/seed/squid/120/120', productCount: 10),
        Category(id: '6', name: 'Oysters', emoji: '🦪', imageUrl: 'https://picsum.photos/seed/oysters/120/120', productCount: 10),
        Category(id: '7', name: 'Smoked', emoji: '🔥', imageUrl: 'https://picsum.photos/seed/smoked/120/120', productCount: 8),
        Category(id: '8', name: 'Frozen', emoji: '❄️', imageUrl: 'https://picsum.photos/seed/frozen/120/120', productCount: 12),
        Category(id: '9', name: 'Ready-to-Cook', emoji: '🍳', imageUrl: 'https://picsum.photos/seed/readycook/120/120', productCount: 6),
      ];
}
