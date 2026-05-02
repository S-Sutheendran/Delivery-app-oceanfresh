import 'dart:async';
import 'package:flutter/material.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/app_routes.dart';
import '../../providers/auth_provider.dart';

class OtpVerificationScreen extends StatefulWidget {
  final String phoneNumber;
  final String countryCode;
  final String verificationId;
  final bool isWhatsApp;

  const OtpVerificationScreen({
    super.key,
    required this.phoneNumber,
    required this.countryCode,
    required this.verificationId,
    required this.isWhatsApp,
  });

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen>
    with SingleTickerProviderStateMixin {
  final _otpController = TextEditingController();
  late AnimationController _animController;
  late Animation<double> _scaleAnim;

  int _resendSeconds = 30;
  Timer? _resendTimer;
  bool _canResend = false;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 500));
    _scaleAnim = CurvedAnimation(parent: _animController, curve: Curves.elasticOut);
    _animController.forward();
    _startResendTimer();
  }

  void _startResendTimer() {
    _resendSeconds = 30;
    _canResend = false;
    _resendTimer?.cancel();
    _resendTimer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_resendSeconds == 0) {
        t.cancel();
        setState(() => _canResend = true);
      } else {
        setState(() => _resendSeconds--);
      }
    });
  }

  @override
  void dispose() {
    _otpController.dispose();
    _resendTimer?.cancel();
    _animController.dispose();
    super.dispose();
  }

  Future<void> _onVerify(String otp) async {
    if (otp.length != 6) return;
    FocusScope.of(context).unfocus();

    final auth = context.read<AuthProvider>();
    final success = await auth.verifyOtp(otp);

    if (!mounted) return;
    if (success) {
      Navigator.pushNamedAndRemoveUntil(
          context, AppRoutes.home, (route) => false);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Invalid OTP. Please try again.'),
          backgroundColor: AppTheme.error,
        ),
      );
      _otpController.clear();
    }
  }

  Future<void> _onResend() async {
    if (!_canResend) return;
    final auth = context.read<AuthProvider>();
    await auth.sendOtp(
      phoneNumber: widget.phoneNumber,
      countryCode: widget.countryCode,
    );
    _startResendTimer();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: AppTheme.textPrimary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 16),
              ScaleTransition(
                scale: _scaleAnim,
                child: _buildOtpIcon(),
              ),
              const SizedBox(height: 28),
              _buildTitle(),
              const SizedBox(height: 36),
              _buildOtpField(),
              const SizedBox(height: 32),
              _buildVerifyButton(),
              const SizedBox(height: 20),
              _buildResendSection(),
              const SizedBox(height: 28),
              _buildMethodSwitchInfo(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOtpIcon() {
    return Container(
      width: 88,
      height: 88,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: widget.isWhatsApp
              ? [AppTheme.whatsappGreen, const Color(0xFF128C7E)]
              : [AppTheme.primary, AppTheme.accent],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: (widget.isWhatsApp
                    ? AppTheme.whatsappGreen
                    : AppTheme.primary)
                .withValues(alpha: 0.35),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Icon(
        widget.isWhatsApp
            ? Icons.chat_bubble_rounded
            : Icons.sms_rounded,
        color: Colors.white,
        size: 40,
      ),
    );
  }

  Widget _buildTitle() {
    return Column(
      children: [
        Text(
          widget.isWhatsApp ? 'WhatsApp OTP' : 'SMS OTP',
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
        ),
        const SizedBox(height: 10),
        RichText(
          textAlign: TextAlign.center,
          text: TextSpan(
            style: Theme.of(context)
                .textTheme
                .bodyMedium
                ?.copyWith(color: AppTheme.textSecondary, height: 1.5),
            children: [
              TextSpan(
                text: widget.isWhatsApp
                    ? 'We sent a 6-digit code via WhatsApp to\n'
                    : 'We sent a 6-digit code via SMS to\n',
              ),
              TextSpan(
                text: '${widget.countryCode} ${widget.phoneNumber}',
                style: const TextStyle(
                    color: AppTheme.primary, fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildOtpField() {
    return PinCodeTextField(
      appContext: context,
      length: 6,
      controller: _otpController,
      keyboardType: TextInputType.number,
      animationType: AnimationType.scale,
      pinTheme: PinTheme(
        shape: PinCodeFieldShape.box,
        borderRadius: BorderRadius.circular(12),
        fieldHeight: 58,
        fieldWidth: 48,
        activeFillColor: Colors.white,
        inactiveFillColor: Colors.white,
        selectedFillColor: Colors.white,
        activeColor: AppTheme.primary,
        inactiveColor: AppTheme.divider,
        selectedColor: AppTheme.primary,
        borderWidth: 2,
      ),
      enableActiveFill: true,
      textStyle: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.w700,
            color: AppTheme.textPrimary,
          ),
      onCompleted: _onVerify,
      onChanged: (_) {},
      boxShadows: [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.04),
          blurRadius: 6,
          offset: const Offset(0, 2),
        ),
      ],
    );
  }

  Widget _buildVerifyButton() {
    return Consumer<AuthProvider>(
      builder: (_, auth, __) => SizedBox(
        width: double.infinity,
        height: 54,
        child: ElevatedButton(
          onPressed: auth.state == AuthState.loading
              ? null
              : () => _onVerify(_otpController.text),
          style: ElevatedButton.styleFrom(
            backgroundColor: widget.isWhatsApp
                ? AppTheme.whatsappGreen
                : AppTheme.primary,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14)),
            elevation: 4,
          ),
          child: auth.state == AuthState.loading
              ? const SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                      color: Colors.white, strokeWidth: 2.5),
                )
              : const Text(
                  'Verify & Continue',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
        ),
      ),
    );
  }

  Widget _buildResendSection() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          "Didn't receive OTP? ",
          style: Theme.of(context)
              .textTheme
              .bodyMedium
              ?.copyWith(color: AppTheme.textSecondary),
        ),
        _canResend
            ? GestureDetector(
                onTap: _onResend,
                child: const Text(
                  'Resend',
                  style: TextStyle(
                    color: AppTheme.primary,
                    fontWeight: FontWeight.w600,
                    decoration: TextDecoration.underline,
                  ),
                ),
              )
            : Text(
                'Resend in ${_resendSeconds}s',
                style: const TextStyle(
                  color: AppTheme.textHint,
                  fontWeight: FontWeight.w500,
                ),
              ),
      ],
    );
  }

  Widget _buildMethodSwitchInfo() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: widget.isWhatsApp
            ? AppTheme.whatsappGreen.withValues(alpha: 0.08)
            : AppTheme.primary.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: widget.isWhatsApp
              ? AppTheme.whatsappGreen.withValues(alpha: 0.3)
              : AppTheme.primary.withValues(alpha: 0.2),
        ),
      ),
      child: Row(
        children: [
          Icon(
            widget.isWhatsApp
                ? Icons.chat_bubble_outline_rounded
                : Icons.sms_outlined,
            size: 18,
            color: widget.isWhatsApp
                ? AppTheme.whatsappGreen
                : AppTheme.primary,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              widget.isWhatsApp
                  ? 'OTP sent via WhatsApp. Check your WhatsApp messages.'
                  : 'OTP sent via SMS. Check your messages.',
              style: TextStyle(
                fontSize: 12,
                color: widget.isWhatsApp
                    ? AppTheme.whatsappGreen
                    : AppTheme.primary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
