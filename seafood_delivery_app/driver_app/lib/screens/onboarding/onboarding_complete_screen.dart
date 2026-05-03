import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/app_routes.dart';
import '../../providers/auth_provider.dart';

class OnboardingCompleteScreen extends StatelessWidget {
  const OnboardingCompleteScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: DriverTheme.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: DriverTheme.warning.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.hourglass_top_rounded, size: 52, color: DriverTheme.warning),
              ),
              const SizedBox(height: 28),
              const Text(
                'Application Submitted!',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 14),
              const Text(
                'Your documents are under review.\nYou will receive a notification once your account is approved, usually within 24–48 hours.',
                style: TextStyle(fontSize: 14, color: DriverTheme.textSecondary, height: 1.6),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: DriverTheme.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: DriverTheme.divider),
                ),
                child: Column(
                  children: const [
                    _CheckItem('Documents submitted', true),
                    SizedBox(height: 12),
                    _CheckItem('Under review by team', false),
                    SizedBox(height: 12),
                    _CheckItem('Account activation', false),
                  ],
                ),
              ),
              const SizedBox(height: 40),
              OutlinedButton(
                onPressed: () async {
                  await context.read<AuthProvider>().signOut();
                  if (context.mounted) {
                    Navigator.pushNamedAndRemoveUntil(
                        context, AppRoutes.phoneAuth, (_) => false);
                  }
                },
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 52),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('Sign Out'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CheckItem extends StatelessWidget {
  final String label;
  final bool done;
  const _CheckItem(this.label, this.done);

  @override
  Widget build(BuildContext context) => Row(
        children: [
          Container(
            width: 24, height: 24,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: done ? DriverTheme.success : DriverTheme.divider,
            ),
            child: Icon(
              done ? Icons.check : Icons.circle,
              size: done ? 14 : 8,
              color: done ? Colors.white : DriverTheme.textHint,
            ),
          ),
          const SizedBox(width: 12),
          Text(label, style: TextStyle(
            fontSize: 14,
            fontWeight: done ? FontWeight.w500 : FontWeight.w400,
            color: done ? DriverTheme.textPrimary : DriverTheme.textSecondary,
          )),
        ],
      );
}
