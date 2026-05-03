import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:latlong2/latlong.dart' as latlong2;
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/app_routes.dart';
import '../../providers/delivery_provider.dart';
import '../../providers/order_provider.dart';
import '../../providers/location_provider.dart';
import '../../services/driver_api_service.dart';

class DeliveryPhotoScreen extends StatefulWidget {
  final int orderId;
  const DeliveryPhotoScreen({super.key, required this.orderId});
  @override
  State<DeliveryPhotoScreen> createState() => _DeliveryPhotoScreenState();
}

class _DeliveryPhotoScreenState extends State<DeliveryPhotoScreen> {
  File? _photo;
  bool _confirming = false;
  bool _delivered = false;
  bool _requestingReview = false;
  bool _reviewRequested = false;

  Future<void> _capturePhoto() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 80,
      preferredCameraDevice: CameraDevice.rear,
    );
    if (picked == null) return;
    setState(() => _photo = File(picked.path));
  }

  Future<void> _uploadAndConfirm() async {
    if (_photo == null) return;
    setState(() => _confirming = true);
    final delivery = context.read<DeliveryProvider>();

    final uploaded = await delivery.uploadDeliveryPhoto(widget.orderId, _photo!);
    if (!mounted) return;
    if (!uploaded) {
      setState(() => _confirming = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(delivery.error ?? 'Upload failed'),
            backgroundColor: DriverTheme.error),
      );
      return;
    }

    final confirmed = await delivery.confirmDelivery(widget.orderId);
    if (!mounted) return;
    setState(() => _confirming = false);

    if (confirmed) {
      final loc = context.read<LocationProvider>().position;
      context.read<OrderProvider>().markDelivered(
            widget.orderId,
            loc ?? const latlong2.LatLng(0, 0),
          );
      context.read<DeliveryProvider>().reset();
      setState(() => _delivered = true);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Delivery confirmed! Great job 🎉'),
          backgroundColor: DriverTheme.success,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(delivery.error ?? 'Confirmation failed'),
          backgroundColor: DriverTheme.error,
        ),
      );
    }
  }

  Future<void> _requestReview() async {
    setState(() => _requestingReview = true);
    try {
      await DriverApiService.requestReview(widget.orderId);
      if (mounted) setState(() => _reviewRequested = true);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Could not send review request'),
              backgroundColor: DriverTheme.error),
        );
      }
    } finally {
      if (mounted) setState(() => _requestingReview = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: DriverTheme.background,
      appBar: AppBar(
        title: const Text('Delivery Confirmation'),
        backgroundColor: DriverTheme.primary,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: _delivered ? _buildDeliveredState() : _buildPhotoCapture(),
      ),
    );
  }

  Widget _buildDeliveredState() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 90,
          height: 90,
          decoration: const BoxDecoration(
            color: DriverTheme.success,
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.check_rounded, color: Colors.white, size: 50),
        ),
        const SizedBox(height: 20),
        const Text(
          'Delivery Complete!',
          style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: DriverTheme.textPrimary),
        ),
        const SizedBox(height: 8),
        Text(
          'Order #${widget.orderId} delivered successfully.',
          style: const TextStyle(fontSize: 14, color: DriverTheme.textSecondary),
        ),
        const SizedBox(height: 32),
        if (_reviewRequested)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: DriverTheme.success.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                  color: DriverTheme.success.withValues(alpha: 0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Icon(Icons.mark_email_read_rounded,
                    color: DriverTheme.success, size: 20),
                SizedBox(width: 8),
                Text('Review request sent to customer!',
                    style: TextStyle(
                        color: DriverTheme.success,
                        fontWeight: FontWeight.w600)),
              ],
            ),
          )
        else
          ElevatedButton.icon(
            onPressed: _requestingReview ? null : _requestReview,
            icon: _requestingReview
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                        color: Colors.white, strokeWidth: 2))
                : const Icon(Icons.star_outline_rounded),
            label:
                Text(_requestingReview ? 'Sending...' : 'Ask for a Review'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFFC107),
              minimumSize: const Size(double.infinity, 52),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14)),
            ),
          ),
        const SizedBox(height: 16),
        OutlinedButton(
          onPressed: () => Navigator.of(context)
              .popUntil((r) => r.settings.name == AppRoutes.home),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14)),
            side: const BorderSide(color: DriverTheme.primary),
          ),
          child: const Text('Back to Home',
              style: TextStyle(color: DriverTheme.primary)),
        ),
      ],
    );
  }

  Widget _buildPhotoCapture() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: DriverTheme.warning.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
            border:
                Border.all(color: DriverTheme.warning.withValues(alpha: 0.3)),
          ),
          child: Row(
            children: const [
              Icon(Icons.info_outline, color: DriverTheme.warning, size: 22),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Take a photo of the delivered package at the customer\'s door. This is required to complete the delivery.',
                  style: TextStyle(
                      fontSize: 13,
                      color: DriverTheme.textPrimary,
                      height: 1.4),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 28),
        Expanded(
          child: GestureDetector(
            onTap: _photo == null ? _capturePhoto : null,
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: _photo == null ? DriverTheme.surface : null,
                borderRadius: BorderRadius.circular(20),
                border: _photo == null
                    ? Border.all(
                        color: DriverTheme.divider,
                        width: 2,
                        style: BorderStyle.solid)
                    : null,
              ),
              clipBehavior: Clip.antiAlias,
              child: _photo == null
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: DriverTheme.primary.withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.camera_alt_rounded,
                              size: 40, color: DriverTheme.primary),
                        ),
                        const SizedBox(height: 16),
                        const Text('Tap to take photo',
                            style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600)),
                        const SizedBox(height: 6),
                        const Text('Photo must be taken with camera',
                            style: TextStyle(
                                fontSize: 12,
                                color: DriverTheme.textSecondary)),
                      ],
                    )
                  : Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.file(_photo!, fit: BoxFit.cover),
                        Positioned(
                          bottom: 12,
                          right: 12,
                          child: GestureDetector(
                            onTap: _capturePhoto,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 8),
                              decoration: BoxDecoration(
                                color: Colors.black54,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: const [
                                  Icon(Icons.replay,
                                      color: Colors.white, size: 16),
                                  SizedBox(width: 6),
                                  Text('Retake',
                                      style: TextStyle(
                                          color: Colors.white, fontSize: 13)),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
            ),
          ),
        ),
        const SizedBox(height: 24),
        if (_photo == null)
          ElevatedButton.icon(
            onPressed: _capturePhoto,
            icon: const Icon(Icons.camera_alt_rounded),
            label: const Text('Open Camera'),
            style: ElevatedButton.styleFrom(
              backgroundColor: DriverTheme.primary,
              minimumSize: const Size(double.infinity, 52),
            ),
          ),
        if (_photo != null)
          ElevatedButton.icon(
            onPressed: _confirming ? null : _uploadAndConfirm,
            icon: _confirming
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                        color: Colors.white, strokeWidth: 2))
                : const Icon(Icons.check_circle_rounded),
            label:
                Text(_confirming ? 'Confirming...' : 'Confirm Delivery'),
            style: ElevatedButton.styleFrom(
              backgroundColor: DriverTheme.success,
              minimumSize: const Size(double.infinity, 52),
            ),
          ),
      ],
    );
  }
}
