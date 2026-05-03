import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/constants.dart';
import '../../providers/onboarding_provider.dart';

class Step2VehicleDetails extends StatefulWidget {
  const Step2VehicleDetails({super.key});
  @override
  State<Step2VehicleDetails> createState() => _Step2State();
}

class _Step2State extends State<Step2VehicleDetails> {
  final _form = GlobalKey<FormState>();
  late final TextEditingController _makeCtrl, _modelCtrl, _plateCtrl, _colorCtrl,
      _licenseCtrl, _rcCtrl, _licExpCtrl, _rcExpCtrl;
  String _vehicleType = 'Bike';
  int? _year;

  @override
  void initState() {
    super.initState();
    final ob = context.read<OnboardingProvider>();
    _vehicleType = ob.vehicleType;
    _year        = ob.year;
    _makeCtrl    = TextEditingController(text: ob.make);
    _modelCtrl   = TextEditingController(text: ob.model);
    _plateCtrl   = TextEditingController(text: ob.plateNumber);
    _colorCtrl   = TextEditingController(text: ob.color);
    _licenseCtrl = TextEditingController(text: ob.licenseNumber);
    _rcCtrl      = TextEditingController(text: ob.rcNumber);
    _licExpCtrl  = TextEditingController(text: ob.licenseExpiry);
    _rcExpCtrl   = TextEditingController(text: ob.rcExpiry);
  }

  @override
  void dispose() {
    for (final c in [_makeCtrl, _modelCtrl, _plateCtrl, _colorCtrl, _licenseCtrl, _rcCtrl, _licExpCtrl, _rcExpCtrl]) {
      c.dispose();
    }
    super.dispose();
  }

  void _next() async {
    if (!_form.currentState!.validate()) return;
    final ob = context.read<OnboardingProvider>();
    ob.vehicleType    = _vehicleType;
    ob.year           = _year;
    ob.make           = _makeCtrl.text.trim();
    ob.model          = _modelCtrl.text.trim();
    ob.plateNumber    = _plateCtrl.text.trim();
    ob.color          = _colorCtrl.text.trim();
    ob.licenseNumber  = _licenseCtrl.text.trim();
    ob.rcNumber       = _rcCtrl.text.trim();
    ob.licenseExpiry  = _licExpCtrl.text.trim();
    ob.rcExpiry       = _rcExpCtrl.text.trim();
    await ob.saveVehicleDetails();
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
            const Text('Vehicle Type', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
            const SizedBox(height: 10),
            Wrap(
              spacing: 10,
              children: AppConstants.vehicleTypes.map((t) {
                final selected = t == _vehicleType;
                return ChoiceChip(
                  label: Text(t),
                  selected: selected,
                  onSelected: (_) => setState(() => _vehicleType = t),
                  selectedColor: DriverTheme.primary,
                  labelStyle: TextStyle(
                    color: selected ? Colors.white : DriverTheme.textPrimary,
                    fontWeight: FontWeight.w500,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),
            Row(children: [
              Expanded(child: _field(_makeCtrl, 'Make *', validator: _req)),
              const SizedBox(width: 12),
              Expanded(child: _field(_modelCtrl, 'Model *', validator: _req)),
            ]),
            Row(children: [
              Expanded(
                child: TextFormField(
                  initialValue: _year?.toString(),
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Year'),
                  onChanged: (v) => _year = int.tryParse(v),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(child: _field(_colorCtrl, 'Color')),
            ]),
            const SizedBox(height: 4),
            _field(_plateCtrl, 'Plate Number *', validator: _req),
            const Divider(height: 32),
            const Text('License & Registration', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            _field(_licenseCtrl, 'Driving License Number'),
            Row(children: [
              Expanded(child: _field(_licExpCtrl, 'License Expiry (MM/YYYY)')),
              const SizedBox(width: 12),
              Expanded(child: _field(_rcCtrl, 'RC Number')),
            ]),
            _field(_rcExpCtrl, 'RC Expiry (MM/YYYY)'),
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

  String? _req(String? v) => v == null || v.trim().isEmpty ? 'Required' : null;

  Widget _field(
    TextEditingController ctrl,
    String label, {
    String? Function(String?)? validator,
    TextInputType keyboardType = TextInputType.text,
  }) =>
      Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: TextFormField(
          controller: ctrl,
          keyboardType: keyboardType,
          validator: validator,
          decoration: InputDecoration(labelText: label),
        ),
      );
}
