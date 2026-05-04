import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/onboarding_provider.dart';

class Step3DocumentDetails extends StatelessWidget {
  const Step3DocumentDetails({super.key});

  @override
  Widget build(BuildContext context) {
    final ob = context.watch<OnboardingProvider>();
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'In the next step you will upload scanned copies of these documents.\n'
            'Optionally provide the numbers now.',
            style: TextStyle(fontSize: 13, color: DriverTheme.textSecondary),
          ),
          const SizedBox(height: 24),
          _DocMetaCard(
            title: 'Government ID',
            subtitle: 'Aadhaar / PAN / Passport / Voter ID',
            icon: Icons.badge_outlined,
            docType: 'govt_id',
          ),
          const SizedBox(height: 12),
          _DocMetaCard(
            title: 'Driving License Copy',
            subtitle: 'Clear scan of front and back',
            icon: Icons.credit_card_outlined,
            docType: 'license_copy',
          ),
          const SizedBox(height: 12),
          _DocMetaCard(
            title: 'RC (Registration Certificate)',
            subtitle: 'Vehicle registration certificate',
            icon: Icons.directions_car_outlined,
            docType: 'rc_copy',
          ),
          const SizedBox(height: 32),
          ElevatedButton(
            onPressed: ob.loading ? null : () => ob.goToStep(3),
            child: const Text('Continue to Uploads'),
          ),
        ],
      ),
    );
  }
}

class _DocMetaCard extends StatefulWidget {
  final String title, subtitle, docType;
  final IconData icon;

  const _DocMetaCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.docType,
  });

  @override
  State<_DocMetaCard> createState() => _DocMetaCardState();
}

class _DocMetaCardState extends State<_DocMetaCard> {
  final _numberCtrl = TextEditingController();
  final _expiryCtrl = TextEditingController();

  @override
  void dispose() {
    _numberCtrl.dispose();
    _expiryCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: DriverTheme.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: DriverTheme.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: DriverTheme.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(widget.icon, size: 20, color: DriverTheme.primary),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.title,
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                    Text(widget.subtitle,
                        style: const TextStyle(fontSize: 12, color: DriverTheme.textSecondary)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _numberCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Document Number (optional)',
                    isDense: true,
                    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                  onChanged: (v) => context.read<OnboardingProvider>().saveDocumentMeta(
                        type: widget.docType,
                        number: v,
                      ),
                ),
              ),
              const SizedBox(width: 10),
              SizedBox(
                width: 130,
                child: TextFormField(
                  controller: _expiryCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Expiry (MM/YYYY)',
                    isDense: true,
                    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

extension on OnboardingProvider {
  void saveDocumentMeta({required String type, required String number}) {
    // No-op local update — meta is saved with the full PATCH in step4 submit
  }
}
