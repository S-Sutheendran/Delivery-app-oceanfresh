import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/app_routes.dart';
import '../../providers/product_provider.dart';
import '../../providers/cart_provider.dart';
import '../../widgets/products/product_card.dart';
import '../../widgets/shared/search_filter_bar.dart';
import '../../widgets/shared/whatsapp_fab.dart';

class ProductListScreen extends StatefulWidget {
  final String? categoryId;
  final String categoryName;
  final String? filterType;

  const ProductListScreen({
    super.key,
    this.categoryId,
    required this.categoryName,
    this.filterType,
  });

  @override
  State<ProductListScreen> createState() => _ProductListScreenState();
}

class _ProductListScreenState extends State<ProductListScreen> {
  bool _isGrid = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final p = context.read<ProductProvider>();
      if (widget.categoryId != null) {
        p.selectCategory(widget.categoryId);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text(widget.categoryName),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () {
            context.read<ProductProvider>().selectCategory(null);
            Navigator.pop(context);
          },
        ),
        actions: [
          IconButton(
            icon: Icon(_isGrid ? Icons.view_list_rounded : Icons.grid_view_rounded),
            onPressed: () => setState(() => _isGrid = !_isGrid),
          ),
          _CartHeaderIcon(),
          const SizedBox(width: 8),
        ],
      ),
      body: Stack(
        children: [
          Column(
            children: [
              const Padding(
                padding: EdgeInsets.fromLTRB(16, 12, 16, 8),
                child: SearchFilterBar(),
              ),
              Expanded(
                child: Consumer<ProductProvider>(
                  builder: (_, provider, __) {
                    if (provider.state == LoadState.loading) {
                      return _buildLoading();
                    }
                    if (provider.state == LoadState.error) {
                      return _buildError(provider.errorMessage);
                    }

                    final products = _getProducts(provider);
                    if (products.isEmpty) return _buildEmpty();

                    return Column(
                      children: [
                        _buildResultsHeader(products.length),
                        Expanded(
                          child: _isGrid
                              ? _buildGrid(products)
                              : _buildList(products),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ],
          ),
          const Positioned(right: 20, bottom: 20, child: WhatsAppFab()),
        ],
      ),
    );
  }

  dynamic _getProducts(ProductProvider p) {
    if (widget.filterType == 'bestsellers') return p.bestSellers;
    if (widget.filterType == 'toprated') return p.topRated;
    if (widget.filterType == 'seasonal') return p.seasonal;
    return p.filteredProducts;
  }

  Widget _buildResultsHeader(int count) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Text(
            '$count items found',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: AppTheme.textSecondary,
                  fontWeight: FontWeight.w500,
                ),
          ),
          const Spacer(),
          Consumer<ProductProvider>(
            builder: (_, p, __) => _SortChip(
              current: p.sortBy,
              onChanged: (v) => p.applyFilters(sortBy: v),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGrid(List products) {
    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.72,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: products.length,
      itemBuilder: (ctx, i) => ProductCard(
        product: products[i],
        onTap: () => Navigator.pushNamed(ctx, AppRoutes.productDetail,
            arguments: products[i]),
      ),
    );
  }

  Widget _buildList(List products) {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
      itemCount: products.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (ctx, i) => ProductCard(
        product: products[i],
        listMode: true,
        onTap: () => Navigator.pushNamed(ctx, AppRoutes.productDetail,
            arguments: products[i]),
      ),
    );
  }

  Widget _buildLoading() {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.72,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: 6,
      itemBuilder: (_, __) => _ShimmerCard(),
    );
  }

  Widget _buildEmpty() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('ðŸŸ', style: TextStyle(fontSize: 60)),
          const SizedBox(height: 16),
          Text(
            'No products found',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(color: AppTheme.textSecondary),
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () => context.read<ProductProvider>().resetFilters(),
            child: const Text('Clear filters'),
          ),
        ],
      ),
    );
  }

  Widget _buildError(String? msg) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 48, color: AppTheme.error),
          const SizedBox(height: 12),
          Text(msg ?? 'Something went wrong'),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: context.read<ProductProvider>().loadProducts,
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }
}

class _CartHeaderIcon extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<CartProvider>(
      builder: (_, cart, __) => IconButton(
        icon: Stack(
          clipBehavior: Clip.none,
          children: [
            const Icon(Icons.shopping_basket_rounded),
            if (cart.itemCount > 0)
              Positioned(
                top: -4,
                right: -4,
                child: Container(
                  padding: const EdgeInsets.all(3),
                  decoration: const BoxDecoration(
                    color: AppTheme.secondary,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    cart.itemCount.toString(),
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 9,
                        fontWeight: FontWeight.w700),
                  ),
                ),
              ),
          ],
        ),
        onPressed: () => Navigator.pushNamed(context, AppRoutes.cart),
      ),
    );
  }
}

class _SortChip extends StatelessWidget {
  final String current;
  final ValueChanged<String> onChanged;

  const _SortChip({required this.current, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _showSortSheet(context),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: AppTheme.primary.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.primary.withValues(alpha: 0.2)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.sort_rounded, size: 14, color: AppTheme.primary),
            const SizedBox(width: 4),
            Text(
              _label(current),
              style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.primary),
            ),
          ],
        ),
      ),
    );
  }

  String _label(String sort) {
    switch (sort) {
      case 'price_asc': return 'Price â†‘';
      case 'price_desc': return 'Price â†“';
      case 'rating': return 'Rating';
      default: return 'Popular';
    }
  }

  void _showSortSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 12),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppTheme.divider,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),
          const Text('Sort By',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          ...[
            ('popular', 'Most Popular'),
            ('price_asc', 'Price: Low to High'),
            ('price_desc', 'Price: High to Low'),
            ('rating', 'Highest Rated'),
          ].map(
            (e) => ListTile(
              title: Text(e.$2),
              trailing:
                  current == e.$1 ? const Icon(Icons.check, color: AppTheme.primary) : null,
              onTap: () {
                onChanged(e.$1);
                Navigator.pop(context);
              },
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _ShimmerCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 3,
            child: Container(
              decoration: BoxDecoration(
                color: AppTheme.shimmerBase,
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(16)),
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                      height: 12, color: AppTheme.shimmerBase,
                      margin: const EdgeInsets.only(right: 40)),
                  const SizedBox(height: 6),
                  Container(
                      height: 10,
                      width: 60,
                      color: AppTheme.shimmerBase),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
