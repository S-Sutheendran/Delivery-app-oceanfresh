import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../config/app_routes.dart';
import '../../config/theme.dart';
import '../../providers/onboarding_provider.dart';
import '../../widgets/document_upload_tile.dart';
import '../../widgets/vehicle_photo_grid.dart';

class Step4PhotoUploads extends StatelessWidget {
  const Step4PhotoUploads({super.key});

  Future<File?> _pickImage(ImageSource source) async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: source, imageQuality: 80);
    if (picked == null) return null;
    return File(picked.path);
  }

  void _showPickerSheet(BuildContext context, void Function(File) onPicked) {
    showModalBottomSheet(
      context: context,
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt_outlined),
              title: const Text('Take Photo'),
              onTap: () async {
                Navigator.pop(context);
                final f = await _pickImage(ImageSource.camera);
                if (f != null) onPicked(f);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library_outlined),
              title: const Text('Choose from Gallery'),
              onTap: () async {
                Navigator.pop(context);
                final f = await _pickImage(ImageSource.gallery);
                if (f != null) onPicked(f);
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ob = context.watch<OnboardingProvider>();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Vehicle Photos ──────────────────────────────────────────────
          const Text('Vehicle Photos',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          const Text('4 mandatory photos — front, back, left & right side',
              style: TextStyle(fontSize: 12, color: DriverTheme.textSecondary)),
          const SizedBox(height: 16),
          VehiclePhotoGrid(
            onPickPhoto: (side) => _showPickerSheet(context, (file) async {
              ob.setVehiclePhotoFile(side, file);
              await ob.uploadVehiclePhoto(side);
              if (context.mounted && ob.error != null) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(ob.error!), backgroundColor: DriverTheme.error),
                );
              }
            }),
          ),
          const SizedBox(height: 28),

          // ── Document Uploads ────────────────────────────────────────────
          const Text('Document Uploads',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          const Text('Upload clear scans or photos of each document',
              style: TextStyle(fontSize: 12, color: DriverTheme.textSecondary)),
          const SizedBox(height: 16),
          DocumentUploadTile(
            label: 'Government ID',
            subtitle: 'Aadhaar / PAN / Passport',
            icon: Icons.badge_outlined,
            docType: 'govt_id',
            onPick: () => _showPickerSheet(context, (file) async {
              ob.setDocFile('govt_id', file);
              await ob.uploadDoc('govt_id');
            }),
          ),
          const SizedBox(height: 10),
          DocumentUploadTile(
            label: 'Driving License Copy',
            subtitle: 'Front and back scan',
            icon: Icons.credit_card_outlined,
            docType: 'license_copy',
            onPick: () => _showPickerSheet(context, (file) async {
              ob.setDocFile('license_copy', file);
              await ob.uploadDoc('license_copy');
            }),
          ),
          const SizedBox(height: 10),
          DocumentUploadTile(
            label: 'RC Certificate',
            subtitle: 'Vehicle registration certificate',
            icon: Icons.directions_car_outlined,
            docType: 'rc_copy',
            onPick: () => _showPickerSheet(context, (file) async {
              ob.setDocFile('rc_copy', file);
              await ob.uploadDoc('rc_copy');
            }),
          ),
          const SizedBox(height: 32),

          if (ob.error != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Text(ob.error!, style: const TextStyle(color: DriverTheme.error, fontSize: 13)),
            ),

          ElevatedButton(
            onPressed: ob.step4Complete && !ob.loading ? () => _submit(context, ob) : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: ob.step4Complete ? DriverTheme.primary : DriverTheme.divider,
            ),
            child: ob.loading
                ? const SizedBox(width: 22, height: 22,
                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                : Text(
                    ob.step4Complete ? 'Submit Application' : 'Upload all files to continue',
                    style: TextStyle(
                      color: ob.step4Complete ? Colors.white : DriverTheme.textSecondary,
                    ),
                  ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Future<void> _submit(BuildContext context, OnboardingProvider ob) async {
    final ok = await ob.submitOnboarding();
    if (context.mounted) {
      if (ok) {
        Navigator.pushReplacementNamed(context, AppRoutes.onboardingDone);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(ob.error ?? 'Submission failed'), backgroundColor: DriverTheme.error),
        );
      }
    }
  }
}
