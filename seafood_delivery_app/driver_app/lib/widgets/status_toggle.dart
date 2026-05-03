import 'package:flutter/material.dart';
import '../config/theme.dart';

class StatusToggle extends StatelessWidget {
  final bool isOnline;
  final ValueChanged<bool> onToggle;

  const StatusToggle({super.key, required this.isOnline, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onToggle(!isOnline),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isOnline
              ? DriverTheme.online.withValues(alpha: 0.2)
              : Colors.white.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isOnline ? DriverTheme.online : Colors.white38,
            width: 1.5,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: 8, height: 8,
              decoration: BoxDecoration(
                color: isOnline ? DriverTheme.online : Colors.white54,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              isOnline ? 'Online — Accepting Orders' : 'Offline',
              style: TextStyle(
                color: isOnline ? DriverTheme.online : Colors.white70,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(width: 8),
            Icon(
              isOnline ? Icons.toggle_on_rounded : Icons.toggle_off_rounded,
              color: isOnline ? DriverTheme.online : Colors.white54,
              size: 22,
            ),
          ],
        ),
      ),
    );
  }
}
