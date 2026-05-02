import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/app_routes.dart';
import '../../models/product.dart';
import '../../providers/cart_provider.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;
  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int _qty = 1;

  Product get p => widget.product;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final cart = context.read<CartProvider>();
      final existing = cart.quantityOf(p.id);
      if (existing > 0) setState(() => _qty = existing);
    });
  }

  void _addToCart() {
    final cart = context.read<CartProvider>();
    cart.setQuantity(p.id, 0); // reset
    for (var i = 0; i < _qty; i++) {
      cart.addItem(p);
    }
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white, size: 18),
            const SizedBox(width: 8),
            Text('${p.name} added to cart!'),
          ],
        ),
        action: SnackBarAction(
          label: 'View Cart',
          textColor: AppTheme.accent,
          onPressed: () => Navigator.pushNamed(context, AppRoutes.cart),
        ),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.all(8),
          child: CircleAvatar(
            backgroundColor: Colors.white,
            child: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded,
                  size: 18, color: AppTheme.textPrimary),
              onPressed: () => Navigator.pop(context),
            ),
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.all(8),
            child: CircleAvatar(
              backgroundColor: Colors.white,
              child: Consumer<CartProvider>(
                builder: (_, cart, __) => Stack(
                  clipBehavior: Clip.none,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.shopping_basket_rounded,
                          size: 20, color: AppTheme.textPrimary),
                      onPressed: () =>
                          Navigator.pushNamed(context, AppRoutes.cart),
                    ),
                    if (cart.itemCount > 0)
                      Positioned(
                        top: 4,
                        right: 4,
                        child: Container(
                          width: 14,
                          height: 14,
                          decoration: const BoxDecoration(
                            color: AppTheme.secondary,
                            shape: BoxShape.circle,
                          ),
                          child: Text(
                            cart.itemCount.toString(),
                            style: const TextStyle(
                                fontSize: 8,
                                color: Colors.white,
                                fontWeight: FontWeight.w700),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildProductImage(),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildBadges(),
                        const SizedBox(height: 10),
                        _buildNameAndRating(),
                        const SizedBox(height: 12),
                        _buildPriceSection(),
                        const SizedBox(height: 16),
                        _buildInfoChips(),
                        const SizedBox(height: 20),
                        _buildDescription(),
                        if (p.cookingTip != null) ...[
                          const SizedBox(height: 16),
                          _buildCookingTip(),
                        ],
                        const SizedBox(height: 80),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          _buildBottomBar(),
        ],
      ),
    );
  }

  Widget _buildProductImage() {
    return Hero(
      tag: 'product-${p.id}',
      child: Container(
        height: 300,
        width: double.infinity,
        color: Colors.white,
        child: CachedNetworkImage(
          imageUrl: p.imageUrl,
          fit: BoxFit.cover,
          placeholder: (_, __) => Container(color: AppTheme.shimmerBase),
          errorWidget: (_, __, ___) => Container(
            color: AppTheme.shimmerBase,
            child: const Center(
              child: Text('ðŸŸ', style: TextStyle(fontSize: 80)),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBadges() {
    return Wrap(
      spacing: 8,
      children: [
        if (p.isBestSeller) _badge('ðŸ”¥ Best Seller', AppTheme.secondary),
        if (p.isTopRated) _badge('â­ Top Rated', const Color(0xFFF57C00)),
        if (p.isSeasonal) _badge('ðŸŒ¿ Seasonal', const Color(0xFF2E7D32)),
        if (p.hasDiscount)
          _badge('-${p.discountPercent.toInt()}% OFF', AppTheme.error),
      ],
    );
  }

  Widget _badge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        text,
        style: TextStyle(
            color: color, fontSize: 11, fontWeight: FontWeight.w600),
      ),
    );
  }

  Widget _buildNameAndRating() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Text(
            p.name,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w700,
                  height: 1.2,
                ),
          ),
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Row(
              children: [
                const Icon(Icons.star_rounded,
                    color: AppTheme.starColor, size: 18),
                const SizedBox(width: 3),
                Text(
                  p.rating.toStringAsFixed(1),
                  style: const TextStyle(
                      fontWeight: FontWeight.w700, fontSize: 15),
                ),
              ],
            ),
            Text(
              '${p.reviewCount} reviews',
              style: Theme.of(context)
                  .textTheme
                  .bodySmall
                  ?.copyWith(color: AppTheme.textSecondary),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildPriceSection() {
    return Row(
      children: [
        Text(
          'â‚¹${p.price.toStringAsFixed(0)}',
          style: TextStyle(
            fontSize: 26,
            fontWeight: FontWeight.w700,
            color: AppTheme.primary,
          ),
        ),
        Text(
          ' / ${p.unit}',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppTheme.textSecondary,
              ),
        ),
        if (p.hasDiscount) ...[
          const SizedBox(width: 10),
          Text(
            'â‚¹${p.originalPrice!.toStringAsFixed(0)}',
            style: const TextStyle(
              fontSize: 16,
              color: AppTheme.textHint,
              decoration: TextDecoration.lineThrough,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildInfoChips() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        if (p.origin != null)
          _infoChip(Icons.location_on_outlined, p.origin!),
        _infoChip(Icons.category_outlined, p.categoryName),
        _infoChip(
          p.inStock ? Icons.check_circle_outline : Icons.cancel_outlined,
          p.inStock ? 'In Stock' : 'Out of Stock',
          color: p.inStock ? AppTheme.success : AppTheme.error,
        ),
      ],
    );
  }

  Widget _infoChip(IconData icon, String label, {Color? color}) {
    final c = color ?? AppTheme.textSecondary;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: c.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: c.withValues(alpha: 0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: c),
          const SizedBox(width: 4),
          Text(label,
              style: TextStyle(
                  fontSize: 12, color: c, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildDescription() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'About this product',
          style: Theme.of(context)
              .textTheme
              .titleMedium
              ?.copyWith(fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 8),
        Text(
          p.description,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppTheme.textSecondary,
                height: 1.6,
              ),
        ),
      ],
    );
  }

  Widget _buildCookingTip() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF8E1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFFFECB3)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('ðŸ‘¨â€ðŸ³', style: TextStyle(fontSize: 20)),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Chef\'s Tip',
                  style: TextStyle(
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFF57C00)),
                ),
                const SizedBox(height: 4),
                Text(
                  p.cookingTip!,
                  style: const TextStyle(
                      color: Color(0xFF795548), fontSize: 13, height: 1.5),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar() {
    return Container(
      padding: EdgeInsets.fromLTRB(
          20, 16, 20, 16 + MediaQuery.of(context).padding.bottom),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 20,
              offset: const Offset(0, -4)),
        ],
      ),
      child: Row(
        children: [
          _buildQtySelector(),
          const SizedBox(width: 16),
          Expanded(
            child: SizedBox(
              height: 52,
              child: ElevatedButton(
                onPressed: p.inStock ? _addToCart : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.add_shopping_cart_rounded, size: 18),
                    const SizedBox(width: 8),
                    Text(
                      p.inStock
                          ? 'Add to Cart â€¢ â‚¹${(p.price * _qty).toStringAsFixed(0)}'
                          : 'Out of Stock',
                      style: const TextStyle(
                          fontSize: 15, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQtySelector() {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: AppTheme.divider, width: 1.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _qtyBtn(Icons.remove_rounded, () {
            if (_qty > 1) setState(() => _qty--);
          }),
          SizedBox(
            width: 36,
            child: Center(
              child: Text(
                '$_qty',
                style: const TextStyle(
                    fontSize: 16, fontWeight: FontWeight.w700),
              ),
            ),
          ),
          _qtyBtn(Icons.add_rounded, () => setState(() => _qty++)),
        ],
      ),
    );
  }

  Widget _qtyBtn(IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: AppTheme.primary.withValues(alpha: 0.07),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, size: 18, color: AppTheme.primary),
      ),
    );
  }
}
