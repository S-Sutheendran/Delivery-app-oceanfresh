import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/app_routes.dart';
import '../../models/assigned_order_model.dart';
import '../../providers/order_provider.dart';
import '../../providers/location_provider.dart';
import '../../providers/delivery_provider.dart';
import '../../services/driver_api_service.dart';
import '../../widgets/route_stop_tile.dart';

class ActiveDeliveryScreen extends StatefulWidget {
  const ActiveDeliveryScreen({super.key});
  @override
  State<ActiveDeliveryScreen> createState() => _ActiveDeliveryScreenState();
}

class _ActiveDeliveryScreenState extends State<ActiveDeliveryScreen> {
  final _mapController = MapController();
  late int _orderId;
  AssignedOrder? _order;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _orderId = ModalRoute.of(context)!.settings.arguments as int;
    final orders = context.read<OrderProvider>();
    _order = orders.orders.firstWhere(
      (o) => o.orderId == _orderId,
      orElse: () => orders.orders.first,
    );
    _startTracking();
  }

  void _startTracking() {
    final order = _order;
    if (order == null || !order.hasCoordinates) return;
    context.read<LocationProvider>().startTracking(
          _orderId,
          deliveryTarget: LatLng(order.deliveryLat!, order.deliveryLng!),
        );
  }

  @override
  void dispose() {
    context.read<LocationProvider>().stopTracking();
    super.dispose();
  }

  Future<void> _markPickedUp() async {
    try {
      await DriverApiService.updateOrderStatus(_orderId, 'picked_up');
      context.read<OrderProvider>().updateOrderStatus(_orderId, 'picked_up');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Order marked as picked up'), backgroundColor: DriverTheme.success),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: DriverTheme.error),
        );
      }
    }
  }

  void _goToDeliveryPhoto() {
    Navigator.pushNamed(context, AppRoutes.deliveryPhoto, arguments: _orderId);
  }

  @override
  Widget build(BuildContext context) {
    final order = _order;
    if (order == null) return const Scaffold(body: Center(child: Text('Order not found')));

    return Scaffold(
      backgroundColor: DriverTheme.background,
      body: Stack(
        children: [
          // ── Full-screen Map ────────────────────────────────────────────
          Consumer2<LocationProvider, OrderProvider>(
            builder: (_, loc, orders, __) {
              final driverPos = loc.position ?? const LatLng(13.0827, 80.2707);
              final deliveryPos = order.hasCoordinates
                  ? LatLng(order.deliveryLat!, order.deliveryLng!)
                  : null;
              return FlutterMap(
                mapController: _mapController,
                options: MapOptions(
                  initialCenter: driverPos,
                  initialZoom: 14,
                ),
                children: [
                  TileLayer(
                    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'com.example.oceanfresh_driver',
                  ),
                  MarkerLayer(markers: [
                    // Driver marker
                    Marker(
                      point: driverPos,
                      width: 40,
                      height: 40,
                      child: Container(
                        decoration: BoxDecoration(
                          color: DriverTheme.primary,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 3),
                          boxShadow: DriverTheme.cardShadow,
                        ),
                        child: const Icon(Icons.delivery_dining, color: Colors.white, size: 20),
                      ),
                    ),
                    // Delivery destination marker
                    if (deliveryPos != null)
                      Marker(
                        point: deliveryPos,
                        width: 40,
                        height: 40,
                        child: Container(
                          decoration: BoxDecoration(
                            color: DriverTheme.secondary,
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 3),
                            boxShadow: DriverTheme.cardShadow,
                          ),
                          child: const Icon(Icons.location_on, color: Colors.white, size: 20),
                        ),
                      ),
                    // All other route stops
                    ...orders.optimizedRoute
                        .where((s) => s.orderId != _orderId && s.location != null)
                        .map((s) => Marker(
                              point: s.location,
                              width: 30,
                              height: 30,
                              child: Container(
                                decoration: BoxDecoration(
                                  color: DriverTheme.accent,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: Colors.white, width: 2),
                                ),
                                child: Center(
                                  child: Text(
                                    '${s.sequence}',
                                    style: const TextStyle(
                                        color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700),
                                  ),
                                ),
                              ),
                            )),
                  ]),
                ],
              );
            },
          ),

          // ── Back button ────────────────────────────────────────────────
          Positioned(
            top: MediaQuery.of(context).padding.top + 8,
            left: 12,
            child: _MapButton(
              icon: Icons.arrow_back_ios_new_rounded,
              onTap: () => Navigator.pop(context),
            ),
          ),

          // ── Centre on driver button ────────────────────────────────────
          Positioned(
            top: MediaQuery.of(context).padding.top + 8,
            right: 12,
            child: _MapButton(
              icon: Icons.my_location_rounded,
              onTap: () {
                final pos = context.read<LocationProvider>().position;
                if (pos != null) _mapController.move(pos, 15);
              },
            ),
          ),

          // ── Proximity Banner ───────────────────────────────────────────
          Consumer<LocationProvider>(
            builder: (_, loc, __) => loc.withinProximity
                ? Positioned(
                    top: MediaQuery.of(context).padding.top + 60,
                    left: 16, right: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: DriverTheme.success,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: DriverTheme.cardShadow,
                      ),
                      child: Row(children: [
                        const Icon(Icons.location_on, color: Colors.white, size: 18),
                        const SizedBox(width: 8),
                        const Text('You are within 1 km of the delivery location!',
                            style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
                      ]),
                    ),
                  )
                : const SizedBox.shrink(),
          ),

          // ── Bottom Sheet ────────────────────────────────────────────────
          DraggableScrollableSheet(
            initialChildSize: 0.38,
            minChildSize: 0.20,
            maxChildSize: 0.75,
            builder: (_, scrollCtrl) => Container(
              decoration: const BoxDecoration(
                color: DriverTheme.surface,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, -4))],
              ),
              child: ListView(
                controller: scrollCtrl,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                children: [
                  Center(
                    child: Container(
                      width: 36, height: 4,
                      decoration: BoxDecoration(
                        color: DriverTheme.divider,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Order header
                  Row(children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: DriverTheme.primary.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.shopping_basket_rounded,
                          color: DriverTheme.primary, size: 22),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text('Order #${order.orderId}',
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                        Text('${order.itemCount} items · ₹${order.total.toStringAsFixed(0)}',
                            style: const TextStyle(color: DriverTheme.textSecondary, fontSize: 13)),
                      ]),
                    ),
                    _StatusChip(order.status),
                  ]),
                  const SizedBox(height: 14),

                  // Address
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.location_on_outlined, size: 18, color: DriverTheme.secondary),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(order.deliveryAddress,
                            style: const TextStyle(fontSize: 13, height: 1.4)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Route stops
                  Consumer<OrderProvider>(
                    builder: (_, orders, __) => orders.optimizedRoute.length > 1
                        ? Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Route Stops',
                                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                              const SizedBox(height: 8),
                              ...orders.optimizedRoute.map((stop) => RouteStopTile(
                                    stop: stop,
                                    isActive: stop.orderId == _orderId,
                                  )),
                              const SizedBox(height: 12),
                            ],
                          )
                        : const SizedBox.shrink(),
                  ),

                  // Items list
                  ...order.items.map((item) => Padding(
                        padding: const EdgeInsets.only(bottom: 6),
                        child: Row(children: [
                          const Icon(Icons.circle, size: 6, color: DriverTheme.textSecondary),
                          const SizedBox(width: 8),
                          Text('${item.quantity}× ${item.name}',
                              style: const TextStyle(fontSize: 13)),
                          const Spacer(),
                          Text('₹${(item.quantity * item.unitPrice).toStringAsFixed(0)}',
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                        ]),
                      )),

                  const SizedBox(height: 20),
                  const Divider(color: DriverTheme.divider),
                  const SizedBox(height: 16),

                  // Action buttons
                  if (order.status == 'assigned')
                    ElevatedButton.icon(
                      onPressed: _markPickedUp,
                      icon: const Icon(Icons.check_circle_outline),
                      label: const Text('Mark as Picked Up'),
                      style: ElevatedButton.styleFrom(backgroundColor: DriverTheme.accent),
                    ),

                  if (order.status == 'picked_up' || order.status == 'in_transit') ...[
                    ElevatedButton.icon(
                      onPressed: _goToDeliveryPhoto,
                      icon: const Icon(Icons.camera_alt_rounded),
                      label: const Text('Delivered — Take Photo'),
                      style: ElevatedButton.styleFrom(backgroundColor: DriverTheme.success),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MapButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  const _MapButton({required this.icon, required this.onTap});
  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: Container(
          width: 42, height: 42,
          decoration: BoxDecoration(
            color: DriverTheme.surface,
            shape: BoxShape.circle,
            boxShadow: DriverTheme.cardShadow,
          ),
          child: Icon(icon, size: 20, color: DriverTheme.textPrimary),
        ),
      );
}

class _StatusChip extends StatelessWidget {
  final String status;
  const _StatusChip(this.status);

  Color get _color {
    switch (status) {
      case 'assigned':   return DriverTheme.warning;
      case 'picked_up':  return DriverTheme.accent;
      case 'in_transit': return DriverTheme.primary;
      case 'delivered':  return DriverTheme.success;
      default:           return DriverTheme.textSecondary;
    }
  }

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: _color.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Text(
          status.replaceAll('_', ' ').toUpperCase(),
          style: TextStyle(color: _color, fontSize: 10, fontWeight: FontWeight.w700),
        ),
      );
}
