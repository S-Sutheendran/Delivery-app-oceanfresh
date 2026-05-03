import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../models/route_stop_model.dart';

class RouteStopTile extends StatelessWidget {
  final RouteStop stop;
  final bool isActive;

  const RouteStopTile({super.key, required this.stop, this.isActive = false});

  @override
  Widget build(BuildContext context) {
    final color = stop.isCompleted
        ? DriverTheme.success
        : isActive
            ? DriverTheme.primary
            : DriverTheme.textSecondary;

    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          // Sequence circle
          Container(
            width: 28, height: 28,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              shape: BoxShape.circle,
              border: Border.all(color: color, width: 1.5),
            ),
            child: Center(
              child: stop.isCompleted
                  ? Icon(Icons.check, size: 14, color: color)
                  : Text('${stop.sequence}',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: color)),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  stop.deliveryAddress,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                    color: stop.isCompleted ? DriverTheme.textSecondary : DriverTheme.textPrimary,
                    decoration: stop.isCompleted ? TextDecoration.lineThrough : null,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(width: 6),
          Text(
            stop.distanceLabel,
            style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}
