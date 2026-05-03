import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/app_routes.dart';
import '../../providers/auth_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final driver = context.watch<AuthProvider>().driver!;
    final vehicle = driver.vehicle;

    return Scaffold(
      backgroundColor: DriverTheme.background,
      appBar: AppBar(
        title: const Text('My Profile'),
        backgroundColor: DriverTheme.primary,
        foregroundColor: Colors.white,
        actions: [
          TextButton(
            onPressed: () async {
              await context.read<AuthProvider>().signOut();
              if (context.mounted) {
                Navigator.pushNamedAndRemoveUntil(
                    context, AppRoutes.phoneAuth, (_) => false);
              }
            },
            child: const Text('Sign Out', style: TextStyle(color: Colors.white70)),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Avatar
          Center(
            child: Column(
              children: [
                Container(
                  width: 80, height: 80,
                  decoration: BoxDecoration(
                    color: DriverTheme.primary.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.person, size: 44, color: DriverTheme.primary),
                ),
                const SizedBox(height: 12),
                Text(driver.fullName ?? 'Driver',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                Text(driver.phoneNumber,
                    style: const TextStyle(color: DriverTheme.textSecondary, fontSize: 13)),
                const SizedBox(height: 8),
                _StatusBadge(driver.onboardingStatus),
              ],
            ),
          ),
          const SizedBox(height: 28),

          // Personal info
          _Section('Personal Info', [
            _InfoRow(Icons.email_outlined, 'Email', driver.email ?? '—'),
            _InfoRow(Icons.cake_outlined, 'Date of Birth', driver.dob ?? '—'),
            _InfoRow(Icons.emergency_outlined, 'Emergency Contact',
                driver.emergencyContact ?? '—'),
          ]),
          const SizedBox(height: 16),

          // Vehicle info
          if (vehicle != null)
            _Section('Vehicle', [
              _InfoRow(Icons.directions_bike_outlined, 'Type',
                  vehicle.vehicleType?.toUpperCase() ?? '—'),
              _InfoRow(Icons.directions_car_outlined, 'Vehicle',
                  '${vehicle.make ?? ''} ${vehicle.model ?? ''}'.trim()),
              _InfoRow(Icons.confirmation_number_outlined, 'Plate', vehicle.plateNumber ?? '—'),
            ]),
          const SizedBox(height: 16),

          // Document status
          _Section('Document Status', [
            _DocStatusRow('Government ID', driver.documents['govt_id']),
            _DocStatusRow('Driving License', driver.documents['license_copy']),
            _DocStatusRow('RC Certificate', driver.documents['rc_copy']),
          ]),
          const SizedBox(height: 16),

          // Reviews shortcut
          GestureDetector(
            onTap: () => Navigator.pushNamed(context, AppRoutes.myReviews),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: DriverTheme.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: DriverTheme.divider),
              ),
              child: Row(
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFC107).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.star_rounded,
                        color: Color(0xFFFFC107), size: 22),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('My Reviews',
                            style: TextStyle(
                                fontWeight: FontWeight.w700, fontSize: 14)),
                        SizedBox(height: 2),
                        Text('View ratings and feedback from customers',
                            style: TextStyle(
                                fontSize: 12,
                                color: DriverTheme.textSecondary)),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right_rounded,
                      color: DriverTheme.textSecondary),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}

class _Section extends StatelessWidget {
  final String title;
  final List<Widget> children;
  const _Section(this.title, this.children);

  @override
  Widget build(BuildContext context) => Container(
        decoration: BoxDecoration(
          color: DriverTheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: DriverTheme.divider),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 6),
              child: Text(title,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700,
                      color: DriverTheme.textSecondary)),
            ),
            const Divider(height: 1, color: DriverTheme.divider),
            ...children,
          ],
        ),
      );
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const _InfoRow(this.icon, this.label, this.value);

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(children: [
          Icon(icon, size: 18, color: DriverTheme.textSecondary),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(label, style: const TextStyle(fontSize: 11, color: DriverTheme.textSecondary)),
              Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
            ]),
          ),
        ]),
      );
}

class _DocStatusRow extends StatelessWidget {
  final String label;
  final dynamic docInfo;
  const _DocStatusRow(this.label, this.docInfo);

  @override
  Widget build(BuildContext context) {
    final uploaded = docInfo?.fileUrl != null;
    final verified = docInfo?.verified == true;
    Color color = verified ? DriverTheme.success : uploaded ? DriverTheme.warning : DriverTheme.error;
    String status = verified ? 'Verified' : uploaded ? 'Uploaded' : 'Missing';

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(children: [
        Icon(Icons.description_outlined, size: 18, color: DriverTheme.textSecondary),
        const SizedBox(width: 12),
        Expanded(child: Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500))),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(status, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w600)),
        ),
      ]),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;
  const _StatusBadge(this.status);

  @override
  Widget build(BuildContext context) {
    final isApproved = status == 'approved';
    final isPending  = status == 'pending_review';
    Color c = isApproved ? DriverTheme.success : isPending ? DriverTheme.warning : DriverTheme.error;
    String label = isApproved ? '✓ Approved' : isPending ? '⏳ Under Review' : status.replaceAll('_', ' ');
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
      decoration: BoxDecoration(
        color: c.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: c.withValues(alpha: 0.3)),
      ),
      child: Text(label, style: TextStyle(color: c, fontSize: 12, fontWeight: FontWeight.w600)),
    );
  }
}
