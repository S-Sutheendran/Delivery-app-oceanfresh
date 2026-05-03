import 'dart:io';
import 'package:flutter/foundation.dart';
import '../services/driver_api_service.dart';
import '../services/image_upload_service.dart';

enum OnboardingStep { personal, vehicle, documents, photos }

class OnboardingProvider extends ChangeNotifier {
  int _currentStep = 0;
  bool _loading = false;
  String? _error;

  // Step 1 — Personal
  String fullName = '';
  String dob = '';
  String email = '';
  String emergencyContact = '';

  // Step 2 — Vehicle
  String vehicleType = 'Bike';
  String make = '';
  String model = '';
  String color = '';
  int? year;
  String plateNumber = '';
  String licenseNumber = '';
  String rcNumber = '';
  String licenseExpiry = '';
  String rcExpiry = '';

  // Step 3 — Document numbers (meta, saved before upload)
  // (stored in vehicle fields above, uploaded separately)

  // Step 4 — Uploads
  final Map<String, File?> _docFiles = {
    'govt_id': null,
    'license_copy': null,
    'rc_copy': null,
  };
  final Map<String, String?> _docUrls = {
    'govt_id': null,
    'license_copy': null,
    'rc_copy': null,
  };

  final Map<String, File?> _vehiclePhotoFiles = {
    'front': null,
    'back': null,
    'left': null,
    'right': null,
  };
  final Map<String, String?> _vehiclePhotoUrls = {
    'front': null,
    'back': null,
    'left': null,
    'right': null,
  };

  final Map<String, bool> _uploading = {};

  int get currentStep => _currentStep;
  bool get loading => _loading;
  String? get error => _error;

  File? docFile(String type) => _docFiles[type];
  String? docUrl(String type) => _docUrls[type];
  bool isDocUploaded(String type) => _docUrls[type] != null;

  File? vehiclePhotoFile(String side) => _vehiclePhotoFiles[side];
  String? vehiclePhotoUrl(String side) => _vehiclePhotoUrls[side];
  bool isPhotoUploaded(String side) => _vehiclePhotoUrls[side] != null;
  bool isUploading(String key) => _uploading[key] == true;

  bool get allDocsUploaded =>
      _docUrls.values.every((url) => url != null);
  bool get allPhotosUploaded =>
      _vehiclePhotoUrls.values.every((url) => url != null);
  bool get step4Complete => allDocsUploaded && allPhotosUploaded;

  void goToStep(int step) {
    _currentStep = step;
    _error = null;
    notifyListeners();
  }

  Future<bool> savePersonalDetails() async {
    if (fullName.trim().isEmpty) {
      _error = 'Full name is required';
      notifyListeners();
      return false;
    }
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      await DriverApiService.savePersonalDetails(
        fullName: fullName.trim(),
        dob: dob.isNotEmpty ? dob : null,
        email: email.isNotEmpty ? email : null,
        emergencyContact: emergencyContact.isNotEmpty ? emergencyContact : null,
      );
      _currentStep = 1;
      _loading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> saveVehicleDetails() async {
    if (make.isEmpty || model.isEmpty || plateNumber.isEmpty) {
      _error = 'Make, model and plate number are required';
      notifyListeners();
      return false;
    }
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      await DriverApiService.saveVehicleDetails(
        vehicleType: vehicleType,
        make: make,
        model: model,
        plateNumber: plateNumber,
        year: year,
        color: color.isNotEmpty ? color : null,
        licenseNumber: licenseNumber.isNotEmpty ? licenseNumber : null,
        rcNumber: rcNumber.isNotEmpty ? rcNumber : null,
        licenseExpiry: licenseExpiry.isNotEmpty ? licenseExpiry : null,
        rcExpiry: rcExpiry.isNotEmpty ? rcExpiry : null,
      );
      _currentStep = 2;
      _loading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  void setDocFile(String type, File file) {
    _docFiles[type] = file;
    notifyListeners();
  }

  void setVehiclePhotoFile(String side, File file) {
    _vehiclePhotoFiles[side] = file;
    notifyListeners();
  }

  Future<bool> uploadDoc(String type) async {
    final file = _docFiles[type];
    if (file == null) return false;
    _uploading[type] = true;
    notifyListeners();
    try {
      final compressed = await ImageUploadService.compress(file);
      final url = await DriverApiService.uploadDocument(compressed, type);
      _docUrls[type] = url;
      _uploading[type] = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _uploading[type] = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> uploadVehiclePhoto(String side) async {
    final file = _vehiclePhotoFiles[side];
    if (file == null) return false;
    _uploading[side] = true;
    notifyListeners();
    try {
      final compressed = await ImageUploadService.compress(file);
      final url = await DriverApiService.uploadVehiclePhoto(compressed, side);
      _vehiclePhotoUrls[side] = url;
      _uploading[side] = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _uploading[side] = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> submitOnboarding() async {
    if (!step4Complete) {
      _error = 'Please upload all required documents and photos';
      notifyListeners();
      return false;
    }
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      await DriverApiService.submitOnboarding();
      _loading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _loading = false;
      notifyListeners();
      return false;
    }
  }
}
