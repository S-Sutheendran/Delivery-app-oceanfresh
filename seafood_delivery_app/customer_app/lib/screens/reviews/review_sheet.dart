import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/review_model.dart';
import '../../providers/review_provider.dart';
import '../../widgets/reviews/star_rating_widget.dart';
import '../../widgets/reviews/delivery_tags_widget.dart';
import '../../widgets/reviews/product_rating_card.dart';

/// Call via [ReviewSheet.show] — returns true if review was submitted.
class ReviewSheet extends StatefulWidget {
  final int orderId;
  final String firebaseUid;
  final List<_OrderProduct> products;

  const ReviewSheet._({
    required this.orderId,
    required this.firebaseUid,
    required this.products,
  });

  static Future<bool?> show(
    BuildContext context, {
    required int orderId,
    required String firebaseUid,
    List<Map<String, dynamic>> products = const [],
  }) {
    return showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ReviewSheet._(
        orderId: orderId,
        firebaseUid: firebaseUid,
        products: products
            .map((p) => _OrderProduct(
                  id: p['product_id'] as int,
                  name: p['name'] as String? ?? 'Product',
                  imageUrl: p['image_url'] as String?,
                ))
            .toList(),
      ),
    );
  }

  @override
  State<ReviewSheet> createState() => _ReviewSheetState();
}

class _ReviewSheetState extends State<ReviewSheet> {
  int _deliveryRating = 0;
  final Set<String> _selectedTags = {};
  final Map<int, int> _productRatings = {};
  final TextEditingController _commentCtrl = TextEditingController();
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    for (final p in widget.products) {
      _productRatings[p.id] = 0;
    }
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ReviewProvider>().loadTags();
    });
  }

  @override
  void dispose() {
    _commentCtrl.dispose();
    super.dispose();
  }

  bool get _canSubmit =>
      _deliveryRating > 0 &&
      _productRatings.values.every((r) => r > 0);

  Future<void> _submit() async {
    if (!_canSubmit || _submitting) return;
    setState(() => _submitting = true);

    final productRatings = _productRatings.entries
        .map((e) => {'product_id': e.key, 'rating': e.value})
        .toList();

    final ok = await context.read<ReviewProvider>().submitReview(
          orderId: widget.orderId,
          firebaseUid: widget.firebaseUid,
          deliveryRating: _deliveryRating,
          deliveryTags: _selectedTags.toList(),
          comment: _commentCtrl.text.trim().isEmpty
              ? null
              : _commentCtrl.text.trim(),
          productRatings: productRatings,
        );

    if (mounted) {
      if (ok) {
        Navigator.pop(context, true);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Thank you for your review!'),
            backgroundColor: AppTheme.primary,
          ),
        );
      } else {
        setState(() => _submitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to submit review. Please try again.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.75,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (_, scrollCtrl) => Container(
        decoration: const BoxDecoration(
          color: AppTheme.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            _buildHandle(),
            Expanded(
              child: SingleChildScrollView(
                controller: scrollCtrl,
                padding: EdgeInsets.only(
                  left: 20,
                  right: 20,
                  bottom: MediaQuery.of(context).viewInsets.bottom + 20,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildTitle(),
                    const SizedBox(height: 24),
                    _buildDeliverySection(),
                    const SizedBox(height: 20),
                    _buildTagsSection(),
                    if (widget.products.isNotEmpty) ...[
                      const SizedBox(height: 20),
                      _buildProductsSection(),
                    ],
                    const SizedBox(height: 20),
                    _buildCommentField(),
                    const SizedBox(height: 24),
                    _buildSubmitButton(),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHandle() => Center(
        child: Container(
          margin: const EdgeInsets.only(top: 12, bottom: 4),
          width: 40,
          height: 4,
          decoration: BoxDecoration(
            color: Colors.grey.shade300,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
      );

  Widget _buildTitle() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 8),
          const Text(
            'How was your order?',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Order #${widget.orderId}',
            style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
          ),
        ],
      );

  Widget _buildDeliverySection() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Delivery Experience',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          Center(
            child: StarRatingWidget(
              rating: _deliveryRating,
              size: 40,
              onChanged: (r) => setState(() => _deliveryRating = r),
            ),
          ),
          const SizedBox(height: 6),
          Center(
            child: Text(
              _deliveryRating == 0
                  ? 'Tap to rate'
                  : _ratingLabel(_deliveryRating),
              style: TextStyle(
                fontSize: 13,
                color: _deliveryRating == 0
                    ? Colors.grey.shade400
                    : AppTheme.primary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      );

  Widget _buildTagsSection() => Consumer<ReviewProvider>(
        builder: (_, provider, __) {
          if (provider.tags.isEmpty) return const SizedBox.shrink();
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'What did you like?',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 12),
              DeliveryTagsWidget(
                tags: provider.tags,
                selected: _selectedTags,
                onToggle: (key) => setState(() {
                  if (_selectedTags.contains(key)) {
                    _selectedTags.remove(key);
                  } else {
                    _selectedTags.add(key);
                  }
                }),
              ),
            ],
          );
        },
      );

  Widget _buildProductsSection() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Rate Products',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          ...widget.products.map((p) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: ProductRatingCard(
                  productName: p.name,
                  imageUrl: p.imageUrl,
                  rating: _productRatings[p.id] ?? 0,
                  onRatingChanged: (r) =>
                      setState(() => _productRatings[p.id] = r),
                ),
              )),
        ],
      );

  Widget _buildCommentField() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Leave a comment (optional)',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _commentCtrl,
            maxLines: 3,
            textCapitalization: TextCapitalization.sentences,
            decoration: InputDecoration(
              hintText: 'Tell us more about your experience...',
              hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 13),
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey.shade200),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey.shade200),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide:
                    const BorderSide(color: AppTheme.primary, width: 1.5),
              ),
              contentPadding: const EdgeInsets.all(14),
            ),
          ),
        ],
      );

  Widget _buildSubmitButton() => SizedBox(
        width: double.infinity,
        height: 52,
        child: ElevatedButton(
          onPressed: _canSubmit && !_submitting ? _submit : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.primary,
            disabledBackgroundColor: Colors.grey.shade200,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            elevation: _canSubmit ? 2 : 0,
          ),
          child: _submitting
              ? const SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                      color: Colors.white, strokeWidth: 2.5),
                )
              : const Text(
                  'Submit Review',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
        ),
      );

  String _ratingLabel(int r) {
    switch (r) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Great';
      case 5:
        return 'Excellent!';
      default:
        return '';
    }
  }
}

class _OrderProduct {
  final int id;
  final String name;
  final String? imageUrl;
  const _OrderProduct({required this.id, required this.name, this.imageUrl});
}
