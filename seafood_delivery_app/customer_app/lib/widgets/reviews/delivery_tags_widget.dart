import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/review_model.dart';

class DeliveryTagsWidget extends StatelessWidget {
  final List<DeliveryTag> tags;
  final Set<String> selected;
  final ValueChanged<String> onToggle;

  const DeliveryTagsWidget({
    super.key,
    required this.tags,
    required this.selected,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: tags.map((tag) {
        final isSelected = selected.contains(tag.key);
        return GestureDetector(
          onTap: () => onToggle(tag.key),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: isSelected ? AppTheme.primary : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isSelected ? AppTheme.primary : Colors.grey.shade300,
                width: isSelected ? 1.5 : 1,
              ),
              boxShadow: isSelected ? AppShadows.soft : [],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(tag.emoji, style: const TextStyle(fontSize: 14)),
                const SizedBox(width: 5),
                Text(
                  tag.label,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: isSelected ? Colors.white : AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
