import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../services/driver_api_service.dart';

class DriverReviewsScreen extends StatefulWidget {
  const DriverReviewsScreen({super.key});

  @override
  State<DriverReviewsScreen> createState() => _DriverReviewsScreenState();
}

class _DriverReviewsScreenState extends State<DriverReviewsScreen> {
  Map<String, dynamic>? _stats;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final data = await DriverApiService.getReviewStats();
      setState(() {
        _stats = data;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: DriverTheme.background,
      appBar: AppBar(
        title: const Text('My Reviews',
            style: TextStyle(fontWeight: FontWeight.w700)),
        backgroundColor: DriverTheme.primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: _loading
          ? const Center(
              child: CircularProgressIndicator(color: DriverTheme.primary))
          : _error != null
              ? _buildError()
              : RefreshIndicator(
                  onRefresh: _load,
                  color: DriverTheme.primary,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        _buildSummaryCard(),
                        const SizedBox(height: 16),
                        _buildBreakdownCard(),
                        const SizedBox(height: 16),
                        _buildTopTagsCard(),
                        const SizedBox(height: 16),
                        _buildRecentReviews(),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildError() => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 48, color: Colors.grey),
            const SizedBox(height: 12),
            Text(_error!, style: const TextStyle(color: Colors.grey)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _load,
              style:
                  ElevatedButton.styleFrom(backgroundColor: DriverTheme.primary),
              child:
                  const Text('Retry', style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      );

  Widget _buildSummaryCard() {
    final avg = (_stats?['average_rating'] as num?)?.toDouble() ?? 0.0;
    final total = _stats?['total_reviews'] as int? ?? 0;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [DriverTheme.primary, DriverTheme.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
              color: DriverTheme.primary.withValues(alpha: 0.3),
              blurRadius: 12,
              offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        children: [
          Text(
            avg == 0 ? '--' : avg.toStringAsFixed(1),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 56,
              fontWeight: FontWeight.w800,
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(5, (i) {
              final filled = i < avg.round();
              return Icon(
                filled ? Icons.star_rounded : Icons.star_outline_rounded,
                color: Colors.white,
                size: 22,
              );
            }),
          ),
          const SizedBox(height: 8),
          Text(
            '$total review${total != 1 ? 's' : ''}',
            style: const TextStyle(
                color: Colors.white70,
                fontSize: 14,
                fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _buildBreakdownCard() {
    final breakdown = _stats?['rating_breakdown'] as Map? ?? {};
    final total = _stats?['total_reviews'] as int? ?? 1;
    return _card(
      title: 'Rating Breakdown',
      child: Column(
        children: List.generate(5, (i) {
          final star = 5 - i;
          final count = breakdown[star.toString()] as int? ?? 0;
          final pct = total > 0 ? count / total : 0.0;
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 5),
            child: Row(
              children: [
                Text('$star',
                    style: const TextStyle(
                        fontSize: 13, fontWeight: FontWeight.w600)),
                const SizedBox(width: 4),
                const Icon(Icons.star_rounded,
                    size: 14, color: Color(0xFFFFC107)),
                const SizedBox(width: 8),
                Expanded(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: pct,
                      minHeight: 8,
                      backgroundColor: Colors.grey.shade100,
                      valueColor: const AlwaysStoppedAnimation(
                          DriverTheme.primary),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                SizedBox(
                  width: 28,
                  child: Text(
                    '$count',
                    textAlign: TextAlign.end,
                    style: const TextStyle(
                        fontSize: 12, color: Colors.grey),
                  ),
                ),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget _buildTopTagsCard() {
    final tags = (_stats?['top_tags'] as List?) ?? [];
    if (tags.isEmpty) return const SizedBox.shrink();
    return _card(
      title: 'Top Compliments',
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: tags.map((t) {
          final emoji = t['emoji'] as String? ?? '';
          final label = t['label'] as String? ?? '';
          final count = t['count'] as int? ?? 0;
          return Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: DriverTheme.primary.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                  color: DriverTheme.primary.withValues(alpha: 0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(emoji, style: const TextStyle(fontSize: 14)),
                const SizedBox(width: 5),
                Text(
                  label,
                  style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: DriverTheme.primary),
                ),
                const SizedBox(width: 5),
                Text(
                  '×$count',
                  style: const TextStyle(
                      fontSize: 11,
                      color: Colors.grey,
                      fontWeight: FontWeight.w500),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildRecentReviews() {
    final recent = (_stats?['recent_reviews'] as List?) ?? [];
    if (recent.isEmpty) return const SizedBox.shrink();
    return _card(
      title: 'Recent Reviews',
      child: Column(
        children: recent.asMap().entries.map((entry) {
          final i = entry.key;
          final r = entry.value as Map;
          final rating = r['delivery_rating'] as int? ?? 0;
          final comment = r['comment'] as String?;
          final tags = (r['delivery_tags'] as List?)
                  ?.map((t) => t.toString())
                  .toList() ??
              [];
          return Column(
            children: [
              if (i > 0)
                const Divider(height: 20),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: List.generate(
                      5,
                      (si) => Icon(
                        si < rating
                            ? Icons.star_rounded
                            : Icons.star_outline_rounded,
                        size: 14,
                        color: const Color(0xFFFFC107),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (comment != null && comment.isNotEmpty)
                          Text(
                            '"$comment"',
                            style: const TextStyle(
                                fontSize: 13,
                                color: Colors.black87,
                                fontStyle: FontStyle.italic),
                          ),
                        if (tags.isNotEmpty) ...[
                          const SizedBox(height: 4),
                          Wrap(
                            spacing: 4,
                            children: tags
                                .take(3)
                                .map((t) => Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 7, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: Colors.grey.shade100,
                                        borderRadius:
                                            BorderRadius.circular(8),
                                      ),
                                      child: Text(t,
                                          style: const TextStyle(
                                              fontSize: 10)),
                                    ))
                                .toList(),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _card({required String title, required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 8,
              offset: const Offset(0, 2))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 14),
          child,
        ],
      ),
    );
  }
}
