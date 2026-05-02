import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/app_routes.dart';
import '../../providers/cart_provider.dart';
import '../../providers/product_provider.dart';
import '../../widgets/home/product_carousel.dart';
import '../../widgets/home/category_carousel.dart';
import '../../widgets/home/home_footer.dart';
import '../../widgets/shared/search_filter_bar.dart';
import '../../widgets/shared/whatsapp_fab.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ScrollController _scrollController = ScrollController();
  bool _isScrolled = false;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadData());
  }

  void _onScroll() {
    final scrolled = _scrollController.offset > 60;
    if (scrolled != _isScrolled) setState(() => _isScrolled = scrolled);
  }

  Future<void> _loadData() async {
    final provider = context.read<ProductProvider>();
    await Future.wait([
      provider.loadProducts(),
      provider.loadCategories(),
    ]);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Stack(
        children: [
          CustomScrollView(
            controller: _scrollController,
            physics: const BouncingScrollPhysics(),
            slivers: [
              _buildSliverHeader(),
              SliverToBoxAdapter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 16),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: SearchFilterBar(),
                    ),
                    const SizedBox(height: 20),
                    _buildBannerSection(),
                    const SizedBox(height: 24),
                    _buildSectionHeader('ðŸ”¥ Best Sellers', 'bestsellers'),
                    const SizedBox(height: 12),
                    Consumer<ProductProvider>(
                      builder: (_, p, __) => ProductCarousel(
                        products: p.bestSellers,
                        isLoading: p.state == LoadState.loading,
                      ),
                    ),
                    const SizedBox(height: 24),
                    _buildSectionHeader('ðŸ—‚ï¸ Shop by Category', null),
                    const SizedBox(height: 12),
                    Consumer<ProductProvider>(
                      builder: (_, p, __) =>
                          CategoryCarousel(categories: p.categories),
                    ),
                    const SizedBox(height: 24),
                    _buildSectionHeader('â­ Top Rated', 'toprated'),
                    const SizedBox(height: 12),
                    Consumer<ProductProvider>(
                      builder: (_, p, __) => ProductCarousel(
                        products: p.topRated,
                        isLoading: p.state == LoadState.loading,
                      ),
                    ),
                    const SizedBox(height: 24),
                    _buildSectionHeader('ðŸŒ¿ Seasonal Picks', 'seasonal'),
                    const SizedBox(height: 12),
                    Consumer<ProductProvider>(
                      builder: (_, p, __) => ProductCarousel(
                        products: p.seasonal,
                        isLoading: p.state == LoadState.loading,
                        cardColor: const Color(0xFFFFF3E0),
                      ),
                    ),
                    const SizedBox(height: 28),
                    const HomeFooter(),
                    const SizedBox(height: 80),
                  ],
                ),
              ),
            ],
          ),
          const Positioned(
            right: 20,
            bottom: 90,
            child: WhatsAppFab(),
          ),
        ],
      ),
    );
  }

  Widget _buildSliverHeader() {
    return SliverAppBar(
      expandedHeight: 110,
      floating: true,
      pinned: true,
      snap: false,
      elevation: _isScrolled ? 4 : 0,
      backgroundColor: AppTheme.primary,
      automaticallyImplyLeading: false,
      flexibleSpace: FlexibleSpaceBar(
        collapseMode: CollapseMode.pin,
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [AppTheme.primaryDark, AppTheme.primary],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Row(
                    children: [
                      Expanded(child: _buildAddressSection()),
                      _buildCartIcon(),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      title: _isScrolled
          ? Row(
              children: [
                const Icon(Icons.location_on, size: 16, color: Colors.white70),
                const SizedBox(width: 4),
                const Expanded(
                  child: Text(
                    '123 Ocean Drive, Mumbai',
                    style: TextStyle(fontSize: 13, color: Colors.white70),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            )
          : null,
      actions: [
        if (_isScrolled) _buildCartIcon(),
        if (_isScrolled) const SizedBox(width: 8),
      ],
    );
  }

  Widget _buildAddressSection() {
    return GestureDetector(
      onTap: () {
        // Open address picker
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: const [
              Icon(Icons.location_on, color: Colors.white70, size: 14),
              SizedBox(width: 4),
              Text(
                'Delivering to',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 11,
                  fontWeight: FontWeight.w400,
                ),
              ),
              SizedBox(width: 4),
              Icon(Icons.keyboard_arrow_down_rounded,
                  color: Colors.white70, size: 16),
            ],
          ),
          const SizedBox(height: 2),
          const Text(
            '123 Ocean Drive, Mumbai',
            style: TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildCartIcon() {
    return Consumer<CartProvider>(
      builder: (_, cart, __) => GestureDetector(
        onTap: () => Navigator.pushNamed(context, AppRoutes.cart),
        child: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              const Icon(Icons.shopping_basket_rounded,
                  color: Colors.white, size: 24),
              if (cart.itemCount > 0)
                Positioned(
                  top: -6,
                  right: -6,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: AppTheme.secondary,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      cart.itemCount > 99 ? '99+' : cart.itemCount.toString(),
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.w700),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBannerSection() {
    return SizedBox(
      height: 150,
      child: PageView(
        children: [
          _bannerCard(
            gradient: const LinearGradient(
              colors: [Color(0xFF00838F), Color(0xFF006064)],
            ),
            title: 'Fresh Catch\nToday!',
            subtitle: 'Up to 30% off on Fish',
            emoji: 'ðŸŸ',
          ),
          _bannerCard(
            gradient: const LinearGradient(
              colors: [Color(0xFFFF6B35), Color(0xFFFF8A65)],
            ),
            title: 'Premium\nLobster',
            subtitle: 'Direct from the coast',
            emoji: 'ðŸ¦ž',
          ),
          _bannerCard(
            gradient: const LinearGradient(
              colors: [Color(0xFF1565C0), Color(0xFF1976D2)],
            ),
            title: 'Free Delivery\nOver â‚¹500',
            subtitle: 'Order now & save',
            emoji: 'ðŸš€',
          ),
        ],
      ),
    );
  }

  Widget _bannerCard({
    required LinearGradient gradient,
    required String title,
    required String subtitle,
    required String emoji,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        gradient: gradient,
        borderRadius: BorderRadius.circular(20),
        boxShadow: AppShadows.strong,
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    subtitle,
                    style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 13,
                        fontWeight: FontWeight.w400),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'Shop Now â†’',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.primary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Text(emoji, style: const TextStyle(fontSize: 64)),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, String? filterType) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w700,
                  fontSize: 17,
                ),
          ),
          if (filterType != null)
            GestureDetector(
              onTap: () => Navigator.pushNamed(
                context,
                AppRoutes.productList,
                arguments: {'filterType': filterType, 'categoryName': title},
              ),
              child: Row(
                children: const [
                  Text(
                    'View All',
                    style: TextStyle(
                      color: AppTheme.primary,
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                  SizedBox(width: 2),
                  Icon(Icons.arrow_forward_ios_rounded,
                      size: 12, color: AppTheme.primary),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
