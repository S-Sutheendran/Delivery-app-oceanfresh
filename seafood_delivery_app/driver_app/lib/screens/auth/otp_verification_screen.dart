import 'dart:async';
import 'package:flutter/material.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/app_routes.dart';
import '../../providers/auth_provider.dart';

class OtpVerificationScreen extends StatefulWidget {
  const OtpVerificationScreen({super.key});
  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final _otpCtrl = TextEditingController();
  int _secondsLeft = 30;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _secondsLeft = 30;
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (_secondsLeft > 0) {
        setState(() => _secondsLeft--);
      } else {
        _timer?.cancel();
      }
    });
  }

  Future<void> _verify(String otp) async {
    if (otp.length < 6) return;
    final auth = context.read<AuthProvider>();
    final ok = await auth.verifyOtp(otp);
    if (!mounted) return;
    if (ok) {
      final driver = auth.driver!;
      if (driver.needsOnboarding) {
        Navigator.pushReplacementNamed(context, AppRoutes.onboarding);
      } else if (driver.isPendingReview) {
        Navigator.pushReplacementNamed(context, AppRoutes.onboardingDone);
      } else {
        Navigator.pushReplacementNamed(context, AppRoutes.home);
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(auth.error ?? 'Invalid OTP'), backgroundColor: DriverTheme.error),
      );
      _otpCtrl.clear();
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _otpCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final phone = context.read<AuthProvider>().phone ?? '';
    return Scaffold(
      backgroundColor: DriverTheme.background,
      appBar: AppBar(
        backgroundColor: DriverTheme.background,
        elevation: 0,
        foregroundColor: DriverTheme.textPrimary,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Verify OTP',
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            Text('Enter the 6-digit code sent to $phone',
                style: TextStyle(color: DriverTheme.textSecondary, fontSize: 14)),
            const SizedBox(height: 40),
            PinCodeTextField(
              appContext: context,
              length: 6,
              controller: _otpCtrl,
              keyboardType: TextInputType.number,
              animationType: AnimationType.fade,
              pinTheme: PinTheme(
                shape: PinCodeFieldShape.box,
                borderRadius: BorderRadius.circular(12),
                fieldHeight: 54,
                fieldWidth: 46,
                activeFillColor: DriverTheme.surface,
                inactiveFillColor: DriverTheme.surface,
                selectedFillColor: DriverTheme.surface,
                activeColor: DriverTheme.primary,
                inactiveColor: DriverTheme.divider,
                selectedColor: DriverTheme.primary,
              ),
              enableActiveFill: true,
              onCompleted: _verify,
              onChanged: (_) {},
            ),
            const SizedBox(height: 28),
            Consumer<AuthProvider>(
              builder: (_, auth, __) => ElevatedButton(
                onPressed: auth.state == AuthState.loading
                    ? null
                    : () => _verify(_otpCtrl.text),
                style: ElevatedButton.styleFrom(
                  backgroundColor: DriverTheme.primary,
                  minimumSize: const Size(double.infinity, 52),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: auth.state == AuthState.loading
                    ? const SizedBox(width: 22, height: 22,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                    : const Text('Verify',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white)),
              ),
            ),
            const SizedBox(height: 20),
            Center(
              child: _secondsLeft > 0
                  ? Text('Resend OTP in $_secondsLeft s',
                      style: TextStyle(color: DriverTheme.textSecondary, fontSize: 13))
                  : TextButton(
                      onPressed: () {
                        context.read<AuthProvider>().sendOtp(phone);
                        _startTimer();
                      },
                      child: const Text('Resend OTP',
                          style: TextStyle(color: DriverTheme.primary, fontWeight: FontWeight.w600)),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
