import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/constants.dart';
import '../../providers/onboarding_provider.dart';
import 'step1_personal_details.dart';
import 'step2_vehicle_details.dart';
import 'step3_document_details.dart';
import 'step4_photo_uploads.dart';

class OnboardingShell extends StatelessWidget {
  const OnboardingShell({super.key});

  static const _steps = [
    Step1PersonalDetails(),
    Step2VehicleDetails(),
    Step3DocumentDetails(),
    Step4PhotoUploads(),
  ];

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => OnboardingProvider(),
      child: const _OnboardingBody(),
    );
  }
}

class _OnboardingBody extends StatelessWidget {
  const _OnboardingBody();

  @override
  Widget build(BuildContext context) {
    final ob = context.watch<OnboardingProvider>();
    final step = ob.currentStep;
    final labels = AppConstants.onboardingSteps;

    return Scaffold(
      backgroundColor: DriverTheme.background,
      appBar: AppBar(
        backgroundColor: DriverTheme.background,
        elevation: 0,
        foregroundColor: DriverTheme.textPrimary,
        title: Text(labels[step]),
        leading: step > 0
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
                onPressed: () => ob.goToStep(step - 1),
              )
            : null,
      ),
      body: Column(
        children: [
          // Progress bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              children: List.generate(labels.length, (i) {
                final active = i == step;
                final done = i < step;
                return Expanded(
                  child: Container(
                    height: 4,
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    decoration: BoxDecoration(
                      color: done
                          ? DriverTheme.success
                          : active
                              ? DriverTheme.primary
                              : DriverTheme.divider,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                );
              }),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
            child: Row(
              children: [
                Text('Step ${step + 1} of ${labels.length}',
                    style: const TextStyle(fontSize: 12, color: DriverTheme.textSecondary)),
                const Spacer(),
                Text(labels[step],
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: DriverTheme.primary)),
              ],
            ),
          ),
          const Divider(height: 1, color: DriverTheme.divider),
          Expanded(child: OnboardingShell._steps[step]),
        ],
      ),
    );
  }
}
