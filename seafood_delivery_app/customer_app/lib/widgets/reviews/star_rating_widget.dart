import 'package:flutter/material.dart';
import '../../config/theme.dart';

class StarRatingWidget extends StatelessWidget {
  final int rating;
  final double size;
  final ValueChanged<int>? onChanged;

  const StarRatingWidget({
    super.key,
    required this.rating,
    this.size = 32,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (i) {
        final filled = i < rating;
        return GestureDetector(
          onTap: onChanged != null ? () => onChanged!(i + 1) : null,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2),
            child: Icon(
              filled ? Icons.star_rounded : Icons.star_outline_rounded,
              size: size,
              color: filled ? const Color(0xFFFFC107) : Colors.grey.shade300,
            ),
          ),
        );
      }),
    );
  }
}

class StarRatingReadOnly extends StatelessWidget {
  final double rating;
  final double size;

  const StarRatingReadOnly({super.key, required this.rating, this.size = 14});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(Icons.star_rounded, size: size, color: AppTheme.secondary),
        const SizedBox(width: 2),
        Text(
          rating.toStringAsFixed(1),
          style: TextStyle(
            fontSize: size - 2,
            fontWeight: FontWeight.w600,
            color: AppTheme.textPrimary,
          ),
        ),
      ],
    );
  }
}
