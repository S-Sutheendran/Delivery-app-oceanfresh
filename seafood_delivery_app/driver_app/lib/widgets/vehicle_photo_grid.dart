import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/onboarding_provider.dart';

class VehiclePhotoGrid extends StatelessWidget {
  final void Function(String side) onPickPhoto;

  const VehiclePhotoGrid({super.key, required this.onPickPhoto});

  static const _sides = [
    _SideInfo('front', 'Front', Icons.arrow_upward_rounded),
    _SideInfo('back',  'Back',  Icons.arrow_downward_rounded),
    _SideInfo('left',  'Left',  Icons.arrow_back_rounded),
    _SideInfo('right', 'Right', Icons.arrow_forward_rounded),
  ];

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.2,
      children: _sides.map((s) => _PhotoSlot(info: s, onPick: onPickPhoto)).toList(),
    );
  }
}

class _PhotoSlot extends StatelessWidget {
  final _SideInfo info;
  final void Function(String side) onPick;
  const _PhotoSlot({required this.info, required this.onPick});

  @override
  Widget build(BuildContext context) {
    final ob = context.watch<OnboardingProvider>();
    final file     = ob.vehiclePhotoFile(info.side);
    final url      = ob.vehiclePhotoUrl(info.side);
    final uploaded = ob.isPhotoUploaded(info.side);
    final uploading = ob.isUploading(info.side);

    return GestureDetector(
      onTap: () => onPick(info.side),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: uploaded ? DriverTheme.success.withValues(alpha: 0.05) : DriverTheme.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: uploaded ? DriverTheme.success : DriverTheme.divider,
            width: uploaded ? 2 : 1,
            style: uploaded ? BorderStyle.solid : BorderStyle.solid,
          ),
        ),
        child: uploading
            ? const Center(
                child: CircularProgressIndicator(strokeWidth: 2.5, color: DriverTheme.primary))
            : file != null
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(13),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.file(file, fit: BoxFit.cover),
                        if (uploaded)
                          Positioned(
                            top: 6, right: 6,
                            child: Container(
                              padding: const EdgeInsets.all(3),
                              decoration: const BoxDecoration(
                                  color: DriverTheme.success, shape: BoxShape.circle),
                              child: const Icon(Icons.check, color: Colors.white, size: 12),
                            ),
                          ),
                        Positioned(
                          bottom: 6, left: 6,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: Colors.black54,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(info.label,
                                style: const TextStyle(
                                    color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
                          ),
                        ),
                      ],
                    ),
                  )
                : Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 40, height: 40,
                        decoration: BoxDecoration(
                          color: DriverTheme.primary.withValues(alpha: 0.08),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(info.icon, color: DriverTheme.primary, size: 20),
                      ),
                      const SizedBox(height: 6),
                      Text(info.label,
                          style: const TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w600, color: DriverTheme.textPrimary)),
                      const SizedBox(height: 2),
                      const Text('Tap to add',
                          style: TextStyle(fontSize: 10, color: DriverTheme.textHint)),
                      const SizedBox(height: 4),
                      Container(
                        width: 6, height: 6,
                        decoration: BoxDecoration(
                          color: DriverTheme.error.withValues(alpha: 0.6),
                          shape: BoxShape.circle,
                        ),
                      ),
                    ],
                  ),
      ),
    );
  }
}

class _SideInfo {
  final String side, label;
  final IconData icon;
  const _SideInfo(this.side, this.label, this.icon);
}
