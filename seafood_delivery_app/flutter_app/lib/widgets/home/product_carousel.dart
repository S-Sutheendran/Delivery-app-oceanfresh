import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../config/app_routes.dart';
import '../../models/product.dart';
import '../products/product_card.dart';

class ProductCarousel extends StatelessWidget {
  final List<Product> products;
  final bool isLoading;
  final Color? cardColor;

  const ProductCarousel({
    super.key,
    required this.products,
    this.isLoading = false,
    this.cardColor,
  });

  @override
  Widget build(BuildContext context) {
    if (isLoading) return _buildShimmer();
    if (products.isEmpty) return _buildEmpty(context);

    return SizedBox(
      height: 250,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: products.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (ctx, i) => SizedBox(
          width: 165,
          child: ProductCard(
            product: products[i],
            onTap: () => Navigator.pushNamed(
              ctx,
              AppRoutes.productDetail,
              arguments: products[i],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildShimmer() {
    return SizedBox(
      height: 250,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: 4,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (_, __) => _ShimmerProductCard(),
      ),
    );
  }

  Widget _buildEmpty(BuildContext context) {
    return SizedBox(
      height: 120,
      child: Center(
        child: Text(
          'No products available',
          style: Theme.of(context)
              .textTheme
              .bodySmall
              ?.copyWith(color: AppTheme.textHint),
        ),
      ),
    );
  }
}

class _ShimmerProductCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 165,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Expanded(
            flex: 3,
            child: Container(
              decoration: const BoxDecoration(
                color: AppTheme.shimmerBase,
                borderRadius:
                    BorderRadius.vertical(top: Radius.circular(16)),
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Container(
                      height: 12,
                      decoration: BoxDecoration(
                          color: AppTheme.shimmerBase,
                          borderRadius: BorderRadius.circular(4)),
                      margin: const EdgeInsets.only(right: 30)),
                  Container(
                      height: 10,
                      width: 50,
                      decoration: BoxDecoration(
                          color: AppTheme.shimmerBase,
                          borderRadius: BorderRadius.circular(4))),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                          height: 14,
                          width: 60,
                          decoration: BoxDecoration(
                              color: AppTheme.shimmerBase,
                              borderRadius: BorderRadius.circular(4))),
                      Container(
                          width: 30,
                          height: 30,
                          decoration: BoxDecoration(
                              color: AppTheme.shimmerBase,
                              borderRadius: BorderRadius.circular(8))),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
