import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/onboarding_provider.dart';

class Step1PersonalDetails extends StatefulWidget {
  const Step1PersonalDetails({super.key});
  @override
  State<Step1PersonalDetails> createState() => _Step1State();
}

class _Step1State extends State<Step1PersonalDetails> {
  final _form = GlobalKey<FormState>();
  late final TextEditingController _nameCtrl;
  late final TextEditingController _dobCtrl;
  late final TextEditingController _emailCtrl;
  late final TextEditingController _emergencyCtrl;

  @override
  void initState() {
    super.initState();
    final ob = context.read<OnboardingProvider>();
    _nameCtrl      = TextEditingController(text: ob.fullName);
    _dobCtrl       = TextEditingController(text: ob.dob);
    _emailCtrl     = TextEditingController(text: ob.email);
    _emergencyCtrl = TextEditingController(text: ob.emergencyContact);
  }

  @override
  void dispose() {
    _nameCtrl.dispose(); _dobCtrl.dispose(); _emailCtrl.dispose(); _emergencyCtrl.dispose();
    super.dispose();
  }

  void _next() async {
    if (!_form.currentState!.validate()) return;
    final ob = context.read<OnboardingProvider>();
    ob.fullName        = _nameCtrl.text.trim();
    ob.dob             = _dobCtrl.text.trim();
    ob.email           = _emailCtrl.text.trim();
    ob.emergencyContact = _emergencyCtrl.text.trim();
    await ob.savePersonalDetails();
    if (mounted && ob.error != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(ob.error!), backgroundColor: DriverTheme.error),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final ob = context.watch<OnboardingProvider>();
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Form(
        key: _form,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            _field(_nameCtrl, 'Full Name *', Icons.person_outline,
                validator: (v) => v!.trim().isEmpty ? 'Required' : null),
            _field(_dobCtrl, 'Date of Birth (DD/MM/YYYY)', Icons.cake_outlined),
            _field(_emailCtrl, 'Email Address', Icons.email_outlined,
                keyboardType: TextInputType.emailAddress),
            _field(_emergencyCtrl, 'Emergency Contact Number', Icons.emergency_outlined,
                keyboardType: TextInputType.phone),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: ob.loading ? null : _next,
              child: ob.loading
                  ? const SizedBox(width: 22, height: 22,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                  : const Text('Continue'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _field(
    TextEditingController ctrl,
    String label,
    IconData icon, {
    TextInputType keyboardType = TextInputType.text,
    String? Function(String?)? validator,
  }) =>
      Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: TextFormField(
          controller: ctrl,
          keyboardType: keyboardType,
          validator: validator,
          decoration: InputDecoration(
            labelText: label,
            prefixIcon: Icon(icon, size: 20, color: DriverTheme.textSecondary),
          ),
        ),
      );
}
