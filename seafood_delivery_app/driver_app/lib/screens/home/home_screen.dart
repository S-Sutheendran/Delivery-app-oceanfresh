import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../../config/theme.dart';
import '../../config/app_routes.dart';
import '../../providers/auth_provider.dart';
import '../../providers/order_provider.dart';
import '../../providers/location_provider.dart';
import '../../widgets/order_card.dart';
import '../../widgets/status_toggle.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _pageController = PageController(viewportFraction: 0.92);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final loc = context.read<LocationProvider>();
      await loc.fetchCurrentPosition();
      await context.read<OrderProvider>().loadOrders();
      if (mounted && loc.position != null) {
        context.read<OrderProvider>().optimizeRoute(loc.position!);
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _refresh() async {
    await context.read<OrderProvider>().loadOrders();
    final loc = context.read<LocationProvider>();
    if (loc.position != null) {
      context.read<OrderProvider>().optimizeRoute(loc.position!);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final driver = auth.driver!;

    return Scaffold(
      backgroundColor: DriverTheme.background,
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            // ── Header ──────────────────────────────────────────────────
            SliverAppBar(
              expandedHeight: 140,
              floating: false,
              pinned: true,
              backgroundColor: DriverTheme.primary,
              automaticallyImplyLeading: false,
              flexibleSpace: FlexibleSpaceBar(
                collapseMode: CollapseMode.pin,
                background: Container(
                  decoration: const BoxDecoration(gradient: DriverTheme.headerGradient),
                  child: SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 22,
                                backgroundColor: Colors.white.withValues(alpha: 0.2),
                                child: const Icon(Icons.person, color: Colors.white, size: 24),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Hi, ${driver.fullName?.split(' ').first ?? 'Driver'} 👋',
                                      style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 17,
                                          fontWeight: FontWeight.w600),
                                    ),
                                    Text(
                                      driver.vehicle?.plateNumber ?? driver.phoneNumber,
                                      style: const TextStyle(color: Colors.white70, fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.person_outline, color: Colors.white),
                                onPressed: () => Navigator.pushNamed(context, AppRoutes.profile),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),
                          // Online/Offline toggle
                          StatusToggle(
                            isOnline: driver.isOnline,
                            onToggle: (val) async {
                              await context.read<AuthProvider>().toggleOnline(val);
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              title: Text('OceanFresh Driver',
                  style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w600)),
              actions: [
                IconButton(
                  icon: const Icon(Icons.refresh_rounded, color: Colors.white),
                  onPressed: _refresh,
                ),
              ],
            ),

            // ── Orders Carousel / Empty State ────────────────────────────
            SliverToBoxAdapter(
              child: Consumer<OrderProvider>(
                builder: (_, orders, __) {
                  if (orders.state == OrderLoadState.loading) {
                    return const _LoadingSection();
                  }
                  if (!orders.hasOrders) {
                    return const _EmptyOrdersState();
                  }
                  return _OrdersSection(
                    pageController: _pageController,
                    orders: orders,
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OrdersSection extends StatelessWidget {
  final PageController pageController;
  final OrderProvider orders;
  const _OrdersSection({required this.pageController, required this.orders});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
          child: Row(
            children: [
              Text(
                '${orders.orders.length} Order${orders.orders.length != 1 ? 's' : ''} Assigned',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
              ),
              const Spacer(),
              if (orders.optimizedRoute.isNotEmpty)
                _RouteBadge(stopCount: orders.optimizedRoute.length),
            ],
          ),
        ),

        // Route optimized info banner
        if (orders.optimizedRoute.isNotEmpty && orders.orders.length > 1)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: DriverTheme.primary.withValues(alpha: 0.07),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  const Icon(Icons.route_rounded, size: 18, color: DriverTheme.primary),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Route optimised — visit stops in shown order for shortest distance',
                      style: const TextStyle(fontSize: 12, color: DriverTheme.primary),
                    ),
                  ),
                ],
              ),
            ),
          ),
        const SizedBox(height: 16),

        // Order carousel (uses optimised route order when available)
        SizedBox(
          height: 280,
          child: PageView.builder(
            controller: pageController,
            onPageChanged: (i) => context.read<OrderProvider>().setActiveIndex(i),
            itemCount: orders.orders.length,
            itemBuilder: (_, i) {
              final sortedOrders = orders.optimizedRoute.isNotEmpty
                  ? _sortedByRoute(orders)
                  : orders.orders;
              final order = sortedOrders[i];
              final stop = orders.optimizedRoute.length > i ? orders.optimizedRoute[i] : null;
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 6),
                child: OrderCard(
                  order: order,
                  sequenceNumber: stop?.sequence,
                  distanceLabel: stop?.distanceLabel,
                  onStart: () => Navigator.pushNamed(
                    context,
                    AppRoutes.activeDelivery,
                    arguments: order.orderId,
                  ),
                ),
              );
            },
          ),
        ),

        if (orders.orders.length > 1) ...[
          const SizedBox(height: 12),
          Center(
            child: SmoothPageIndicator(
              controller: pageController,
              count: orders.orders.length,
              effect: ExpandingDotsEffect(
                dotColor: DriverTheme.divider,
                activeDotColor: DriverTheme.primary,
                dotHeight: 7,
                dotWidth: 7,
                expansionFactor: 3,
              ),
            ),
          ),
        ],

        const SizedBox(height: 32),
      ],
    );
  }

  List<dynamic> _sortedByRoute(OrderProvider orders) {
    if (orders.optimizedRoute.isEmpty) return orders.orders;
    final byId = {for (final o in orders.orders) o.orderId: o};
    return orders.optimizedRoute
        .map((stop) => byId[stop.orderId])
        .where((o) => o != null)
        .toList();
  }
}

class _RouteBadge extends StatelessWidget {
  final int stopCount;
  const _RouteBadge({required this.stopCount});
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: DriverTheme.success,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          '$stopCount stop route',
          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
        ),
      );
}

class _EmptyOrdersState extends StatelessWidget {
  const _EmptyOrdersState();
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 32),
        child: Column(
          children: [
            const Icon(Icons.inbox_rounded, size: 64, color: DriverTheme.divider),
            const SizedBox(height: 16),
            const Text('No orders assigned yet',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            const Text(
              'Make sure you are online.\nNew orders will appear here.',
              textAlign: TextAlign.center,
              style: TextStyle(color: DriverTheme.textSecondary, fontSize: 13),
            ),
          ],
        ),
      );
}

class _LoadingSection extends StatelessWidget {
  const _LoadingSection();
  @override
  Widget build(BuildContext context) => const Padding(
        padding: EdgeInsets.symmetric(vertical: 60),
        child: Center(child: CircularProgressIndicator(color: DriverTheme.primary)),
      );
}
