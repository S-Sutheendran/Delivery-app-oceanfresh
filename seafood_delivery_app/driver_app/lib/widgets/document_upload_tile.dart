import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/onboarding_provider.dart';

class DocumentUploadTile extends StatelessWidget {
  final String label;
  final String subtitle;
  final IconData icon;
  final String docType;
  final VoidCallback onPick;

  const DocumentUploadTile({
    super.key,
    required this.label,
    required this.subtitle,
    required this.icon,
    required this.docType,
    required this.onPick,
  });

  @override
  Widget build(BuildContext context) {
    final ob = context.watch<OnboardingProvider>();
    final uploaded  = ob.isDocUploaded(docType);
    final uploading = ob.isUploading(docType);

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: DriverTheme.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: uploaded ? DriverTheme.success : DriverTheme.divider,
          width: uploaded ? 1.5 : 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: uploaded
                  ? DriverTheme.success.withValues(alpha: 0.1)
                  : DriverTheme.primary.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              uploaded ? Icons.check_circle_rounded : icon,
              size: 22,
              color: uploaded ? DriverTheme.success : DriverTheme.primary,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                Text(uploaded ? 'Uploaded successfully' : subtitle,
                    style: TextStyle(
                      fontSize: 11,
                      color: uploaded ? DriverTheme.success : DriverTheme.textSecondary,
                    )),
              ],
            ),
          ),
          const SizedBox(width: 8),
          if (uploading)
            const SizedBox(
              width: 24, height: 24,
              child: CircularProgressIndicator(strokeWidth: 2.5, color: DriverTheme.primary),
            )
          else
            GestureDetector(
              onTap: onPick,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                decoration: BoxDecoration(
                  color: uploaded ? DriverTheme.divider : DriverTheme.primary,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  uploaded ? 'Replace' : 'Upload',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: uploaded ? DriverTheme.textSecondary : Colors.white,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
