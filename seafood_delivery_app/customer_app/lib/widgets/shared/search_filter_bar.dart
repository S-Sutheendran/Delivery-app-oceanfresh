import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/product_provider.dart';

class SearchFilterBar extends StatefulWidget {
  const SearchFilterBar({super.key});

  @override
  State<SearchFilterBar> createState() => _SearchFilterBarState();
}

class _SearchFilterBarState extends State<SearchFilterBar> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Container(
            height: 48,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              boxShadow: AppShadows.card,
            ),
            child: TextField(
              controller: _controller,
              onChanged: (v) =>
                  context.read<ProductProvider>().search(v),
              decoration: const InputDecoration(
                hintText: 'Search for seafood...',
                prefixIcon: Icon(Icons.search_rounded,
                    color: AppTheme.textHint, size: 22),
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                contentPadding:
                    EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        GestureDetector(
          onTap: () => _showFilterSheet(context),
          child: Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppTheme.primary,
              borderRadius: BorderRadius.circular(14),
              boxShadow: AppShadows.strong,
            ),
            child: const Icon(Icons.tune_rounded,
                color: Colors.white, size: 22),
          ),
        ),
      ],
    );
  }

  void _showFilterSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const _FilterSheet(),
    );
  }
}

class _FilterSheet extends StatefulWidget {
  const _FilterSheet();

  @override
  State<_FilterSheet> createState() => _FilterSheetState();
}

class _FilterSheetState extends State<_FilterSheet> {
  double _maxPrice = 1000;
  double _minRating = 0;
  bool _inStockOnly = false;
  String _sortBy = 'popular';

  @override
  void initState() {
    super.initState();
    final p = context.read<ProductProvider>();
    _maxPrice = p.maxPrice;
    _minRating = p.minRating;
    _inStockOnly = p.inStockOnly;
    _sortBy = p.sortBy;
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.65,
      maxChildSize: 0.9,
      minChildSize: 0.4,
      builder: (_, scroll) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            const SizedBox(height: 12),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                  color: AppTheme.divider,
                  borderRadius: BorderRadius.circular(2)),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Filters',
                      style: TextStyle(
                          fontSize: 18, fontWeight: FontWeight.w700)),
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _maxPrice = 5000;
                        _minRating = 0;
                        _inStockOnly = false;
                        _sortBy = 'popular';
                      });
                    },
                    child: const Text('Reset All'),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                controller: scroll,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _sectionTitle('Max Price: â‚¹${_maxPrice.toInt()}'),
                  Slider(
                    value: _maxPrice,
                    min: 100,
                    max: 5000,
                    divisions: 49,
                    activeColor: AppTheme.primary,
                    onChanged: (v) => setState(() => _maxPrice = v),
                  ),
                  const SizedBox(height: 12),
                  _sectionTitle('Minimum Rating'),
                  _ratingSelector(),
                  const SizedBox(height: 16),
                  SwitchListTile.adaptive(
                    value: _inStockOnly,
                    onChanged: (v) => setState(() => _inStockOnly = v),
                    title: const Text('In Stock Only',
                        style: TextStyle(fontWeight: FontWeight.w500)),
                    activeColor: AppTheme.primary,
                    contentPadding: EdgeInsets.zero,
                  ),
                  const SizedBox(height: 12),
                  _sectionTitle('Sort By'),
                  ...[
                    ('popular', 'Most Popular'),
                    ('price_asc', 'Price: Low to High'),
                    ('price_desc', 'Price: High to Low'),
                    ('rating', 'Highest Rated'),
                  ].map(
                    (e) => RadioListTile<String>(
                      value: e.$1,
                      groupValue: _sortBy,
                      onChanged: (v) => setState(() => _sortBy = v!),
                      title: Text(e.$2),
                      activeColor: AppTheme.primary,
                      contentPadding: EdgeInsets.zero,
                      dense: true,
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
            Padding(
              padding: EdgeInsets.fromLTRB(
                  20, 8, 20, 16 + MediaQuery.of(context).padding.bottom),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () {
                    context.read<ProductProvider>().applyFilters(
                          maxPrice: _maxPrice,
                          minRating: _minRating,
                          inStockOnly: _inStockOnly,
                          sortBy: _sortBy,
                        );
                    Navigator.pop(context);
                  },
                  child: const Text('Apply Filters'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _sectionTitle(String t) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Text(t,
            style: const TextStyle(
                fontWeight: FontWeight.w600, fontSize: 14)),
      );

  Widget _ratingSelector() {
    return Row(
      children: [0.0, 3.0, 3.5, 4.0, 4.5].map((r) {
        final selected = _minRating == r;
        return Padding(
          padding: const EdgeInsets.only(right: 8),
          child: GestureDetector(
            onTap: () => setState(() => _minRating = r),
            child: Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: selected
                    ? AppTheme.primary
                    : AppTheme.primary.withValues(alpha: 0.07),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                r == 0 ? 'All' : '${r}+â­',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color:
                      selected ? Colors.white : AppTheme.primary,
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
