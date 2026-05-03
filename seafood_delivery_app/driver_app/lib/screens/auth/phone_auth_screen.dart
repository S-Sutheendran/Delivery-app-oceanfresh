import 'package:flutter/material.dart';
import 'package:country_code_picker/country_code_picker.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/app_routes.dart';
import '../../providers/auth_provider.dart';

class PhoneAuthScreen extends StatefulWidget {
  const PhoneAuthScreen({super.key});
  @override
  State<PhoneAuthScreen> createState() => _PhoneAuthScreenState();
}

class _PhoneAuthScreenState extends State<PhoneAuthScreen> {
  final _phoneCtrl = TextEditingController();
  final _form = GlobalKey<FormState>();
  String _dialCode = '+91';

  @override
  void dispose() {
    _phoneCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_form.currentState!.validate()) return;
    final phone = '$_dialCode${_phoneCtrl.text.trim()}';
    context.read<AuthProvider>().sendOtp(phone).then((_) {
      if (!mounted) return;
      final auth = context.read<AuthProvider>();
      if (auth.state == AuthState.otpSent) {
        Navigator.pushNamed(context, AppRoutes.otpVerify);
      } else if (auth.state == AuthState.error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(auth.error ?? 'Failed to send OTP'), backgroundColor: DriverTheme.error),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: DriverTheme.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _form,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 40),
                // Header icon
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: DriverTheme.primary,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.delivery_dining_rounded, size: 38, color: Colors.white),
                ),
                const SizedBox(height: 28),
                const Text(
                  'Welcome,\nDelivery Partner',
                  style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700, height: 1.3),
                ),
                const SizedBox(height: 8),
                Text(
                  'Enter your mobile number to get started',
                  style: TextStyle(fontSize: 14, color: DriverTheme.textSecondary),
                ),
                const SizedBox(height: 40),
                // Phone input row
                Container(
                  decoration: BoxDecoration(
                    color: DriverTheme.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: DriverTheme.divider),
                  ),
                  child: Row(
                    children: [
                      CountryCodePicker(
                        onChanged: (code) => setState(() => _dialCode = code.dialCode ?? '+91'),
                        initialSelection: 'IN',
                        favorite: const ['IN', 'US', 'GB', 'AE'],
                        showFlagDialog: true,
                        comparator: (a, b) => a.dialCode!.compareTo(b.dialCode!),
                        textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                      ),
                      Container(width: 1, height: 28, color: DriverTheme.divider),
                      Expanded(
                        child: TextFormField(
                          controller: _phoneCtrl,
                          keyboardType: TextInputType.phone,
                          decoration: const InputDecoration(
                            border: InputBorder.none,
                            hintText: 'Phone number',
                            contentPadding: EdgeInsets.symmetric(horizontal: 14),
                          ),
                          validator: (v) {
                            if (v == null || v.trim().length < 7) return 'Enter a valid phone number';
                            return null;
                          },
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 28),
                Consumer<AuthProvider>(
                  builder: (_, auth, __) => ElevatedButton(
                    onPressed: auth.state == AuthState.loading ? null : _submit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: DriverTheme.primary,
                      minimumSize: const Size(double.infinity, 52),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: auth.state == AuthState.loading
                        ? const SizedBox(width: 22, height: 22,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                        : const Text('Send OTP',
                            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white)),
                  ),
                ),
                const SizedBox(height: 32),
                // Info chips
                Row(
                  children: [
                    _chip(Icons.whatsapp, 'WhatsApp OTP'),
                    const SizedBox(width: 10),
                    _chip(Icons.sms_outlined, 'SMS fallback'),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _chip(IconData icon, String label) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: DriverTheme.primary.withValues(alpha: 0.07),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 15, color: DriverTheme.primary),
            const SizedBox(width: 5),
            Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: DriverTheme.primary)),
          ],
        ),
      );
}
