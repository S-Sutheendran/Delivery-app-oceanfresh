import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../models/assigned_order_model.dart';

class OrderCard extends StatelessWidget {
  final AssignedOrder order;
  final int? sequenceNumber;
  final String? distanceLabel;
  final VoidCallback onStart;

  const OrderCard({
    super.key,
    required this.order,
    required this.onStart,
    this.sequenceNumber,
    this.distanceLabel,
  });

  Color get _statusColor {
    switch (order.status) {
      case 'assigned':   return DriverTheme.warning;
      case 'picked_up':  return DriverTheme.accent;
      case 'in_transit': return DriverTheme.primary;
      case 'delivered':  return DriverTheme.success;
      default:           return DriverTheme.textSecondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1565C0), Color(0xFF1E88E5)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: DriverTheme.buttonShadow,
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top row
            Row(
              children: [
                Container(
                  width: 38, height: 38,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: sequenceNumber != null
                        ? Text('$sequenceNumber',
                            style: const TextStyle(
                                color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16))
                        : const Icon(Icons.shopping_basket_rounded,
                            color: Colors.white, size: 20),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Order #${order.orderId}',
                        style: const TextStyle(
                            color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15)),
                    Text('${order.itemCount} items · ₹${order.total.toStringAsFixed(0)}',
                        style: const TextStyle(color: Colors.white70, fontSize: 12)),
                  ]),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    order.status.replaceAll('_', ' ').toUpperCase(),
                    style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Address
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.location_on_outlined, color: Colors.white70, size: 16),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    order.deliveryAddress,
                    style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.4),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),

            if (distanceLabel != null) ...[
              const SizedBox(height: 8),
              Row(children: [
                const Icon(Icons.route_rounded, color: Colors.white70, size: 16),
                const SizedBox(width: 6),
                Text('$distanceLabel from previous stop',
                    style: const TextStyle(color: Colors.white70, fontSize: 12)),
              ]),
            ],

            const Spacer(),

            // CTA
            SizedBox(
              width: double.infinity,
              child: TextButton(
                onPressed: onStart,
                style: TextButton.styleFrom(
                  backgroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      order.status == 'assigned'
                          ? Icons.navigation_rounded
                          : Icons.local_shipping_rounded,
                      color: DriverTheme.primary,
                      size: 18,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      order.status == 'assigned' ? 'Start Delivery' : 'View Details',
                      style: const TextStyle(
                          color: DriverTheme.primary,
                          fontWeight: FontWeight.w700,
                          fontSize: 14),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
