import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/review_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/review_provider.dart';
import '../reviews/review_sheet.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadOrders());
  }

  void _loadOrders() {
    final uid = context.read<AuthProvider>().user?.uid;
    if (uid != null) {
      context.read<ReviewProvider>().loadOrders(uid);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text(
          'My Orders',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Consumer<ReviewProvider>(
        builder: (_, provider, __) {
          if (provider.state == ReviewLoadState.loading) {
            return const Center(
              child: CircularProgressIndicator(color: AppTheme.primary),
            );
          }
          if (provider.state == ReviewLoadState.error) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.error_outline,
                      size: 48, color: Colors.grey),
                  const SizedBox(height: 12),
                  Text(provider.error ?? 'Failed to load orders',
                      style: const TextStyle(color: AppTheme.textSecondary)),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _loadOrders,
                    style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary),
                    child: const Text('Retry',
                        style: TextStyle(color: Colors.white)),
                  ),
                ],
              ),
            );
          }
          if (provider.orders.isEmpty) {
            return const Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('🐟', style: TextStyle(fontSize: 48)),
                  SizedBox(height: 12),
                  Text('No orders yet',
                      style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.textPrimary)),
                  SizedBox(height: 6),
                  Text('Your order history will appear here',
                      style: TextStyle(color: AppTheme.textSecondary)),
                ],
              ),
            );
          }
          return RefreshIndicator(
            color: AppTheme.primary,
            onRefresh: _loadOrders,
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: provider.orders.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (_, i) =>
                  _OrderCard(order: provider.orders[i]),
            ),
          );
        },
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final UserOrder order;

  const _OrderCard({required this.order});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadows.soft,
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Order #${order.orderId}',
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                ),
                _StatusChip(status: order.status),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.shopping_bag_outlined,
                    size: 14, color: AppTheme.textSecondary),
                const SizedBox(width: 4),
                Text(
                  '${order.itemCount} item${order.itemCount != 1 ? 's' : ''}',
                  style: const TextStyle(
                      fontSize: 13, color: AppTheme.textSecondary),
                ),
                const SizedBox(width: 12),
                const Icon(Icons.currency_rupee,
                    size: 14, color: AppTheme.textSecondary),
                Text(
                  order.total.toStringAsFixed(0),
                  style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary),
                ),
              ],
            ),
            if (order.deliveredAt != null) ...[
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.check_circle_outline,
                      size: 14, color: Colors.green),
                  const SizedBox(width: 4),
                  Text(
                    'Delivered ${_formatDate(order.deliveredAt!)}',
                    style: const TextStyle(
                        fontSize: 12, color: AppTheme.textSecondary),
                  ),
                ],
              ),
            ],
            if (order.canReview || order.isReviewed) ...[
              const SizedBox(height: 12),
              const Divider(height: 1),
              const SizedBox(height: 12),
              if (order.canReview)
                SizedBox(
                  width: double.infinity,
                  height: 40,
                  child: ElevatedButton.icon(
                    onPressed: () => _openReview(context),
                    icon: const Icon(Icons.star_rounded,
                        size: 18, color: Colors.white),
                    label: const Text(
                      'Rate this Order',
                      style: TextStyle(
                          fontWeight: FontWeight.w700, color: Colors.white),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFFC107),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10)),
                      elevation: 0,
                    ),
                  ),
                ),
              if (order.isReviewed)
                Row(
                  children: const [
                    Icon(Icons.verified_rounded,
                        size: 16, color: Colors.green),
                    SizedBox(width: 6),
                    Text(
                      'You reviewed this order',
                      style: TextStyle(
                          fontSize: 13,
                          color: Colors.green,
                          fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
            ],
          ],
        ),
      ),
    );
  }

  Future<void> _openReview(BuildContext context) async {
    final uid = context.read<AuthProvider>().user?.uid;
    if (uid == null) return;

    final submitted = await ReviewSheet.show(
      context,
      orderId: order.orderId,
      firebaseUid: uid,
    );
    if (submitted == true && context.mounted) {
      context.read<ReviewProvider>().loadOrders(uid);
    }
  }

  String _formatDate(String isoDate) {
    try {
      final dt = DateTime.parse(isoDate).toLocal();
      final now = DateTime.now();
      final diff = now.difference(dt);
      if (diff.inDays == 0) return 'today';
      if (diff.inDays == 1) return 'yesterday';
      return '${diff.inDays} days ago';
    } catch (_) {
      return '';
    }
  }
}

class _StatusChip extends StatelessWidget {
  final String status;
  const _StatusChip({required this.status});

  @override
  Widget build(BuildContext context) {
    final (color, bg, label) = _statusStyle(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }

  (Color, Color, String) _statusStyle(String status) {
    switch (status) {
      case 'delivered':
        return (Colors.green.shade700, Colors.green.shade50, 'Delivered');
      case 'cancelled':
        return (Colors.red.shade700, Colors.red.shade50, 'Cancelled');
      case 'in_transit':
        return (AppTheme.primary, AppTheme.primary.withValues(alpha: 0.1),
            'In Transit');
      case 'picked_up':
        return (Colors.orange.shade700, Colors.orange.shade50, 'Picked Up');
      case 'assigned':
        return (Colors.blue.shade700, Colors.blue.shade50, 'Assigned');
      case 'confirmed':
        return (AppTheme.primary, AppTheme.primary.withValues(alpha: 0.1),
            'Confirmed');
      default:
        return (Colors.grey.shade700, Colors.grey.shade100, 'Pending');
    }
  }
}
