import 'package:flutter/foundation.dart';
import '../models/driver_model.dart';
import '../services/driver_api_service.dart';
import '../services/secure_storage_service.dart';

enum AuthState { initial, loading, otpSent, authenticated, unauthenticated, error }

class AuthProvider extends ChangeNotifier {
  AuthState _state = AuthState.initial;
  DriverModel? _driver;
  String? _phone;
  String? _error;

  AuthState get state => _state;
  DriverModel? get driver => _driver;
  String? get phone => _phone;
  String? get error => _error;
  bool get isAuthenticated => _state == AuthState.authenticated;

  /// Called on app start — checks stored token and loads driver profile.
  Future<bool> tryAutoLogin() async {
    final token = await SecureStorageService.getToken();
    if (token == null) {
      _state = AuthState.unauthenticated;
      notifyListeners();
      return false;
    }
    try {
      final profile = await DriverApiService.getProfile();
      _driver = DriverModel.fromJson(profile);
      _state = AuthState.authenticated;
      notifyListeners();
      return true;
    } catch (_) {
      await SecureStorageService.clearSession();
      _state = AuthState.unauthenticated;
      notifyListeners();
      return false;
    }
  }

  Future<void> sendOtp(String phone) async {
    _phone = phone;
    _state = AuthState.loading;
    _error = null;
    notifyListeners();
    try {
      await DriverApiService.sendOtp(phone);
      _state = AuthState.otpSent;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _state = AuthState.error;
    }
    notifyListeners();
  }

  Future<bool> verifyOtp(String otp) async {
    _state = AuthState.loading;
    _error = null;
    notifyListeners();
    try {
      // Step 1: verify OTP
      await DriverApiService.verifyOtp(_phone!, otp);
      // Step 2: create/fetch driver record and get JWT
      final session = await DriverApiService.registerDriver(phone: _phone!);
      await SecureStorageService.saveSession(
        token: session['access_token'] as String,
        driverId: session['driver_id'] as int,
        phone: _phone!,
      );
      // Step 3: load full profile
      final profile = await DriverApiService.getProfile();
      _driver = DriverModel.fromJson(profile);
      _state = AuthState.authenticated;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      _state = AuthState.error;
      notifyListeners();
      return false;
    }
  }

  Future<void> refreshProfile() async {
    try {
      final profile = await DriverApiService.getProfile();
      _driver = DriverModel.fromJson(profile);
      notifyListeners();
    } catch (_) {}
  }

  Future<void> toggleOnline(bool isOnline) async {
    try {
      await DriverApiService.setAvailability(isOnline);
      if (_driver != null) {
        _driver = DriverModel(
          id: _driver!.id,
          phoneNumber: _driver!.phoneNumber,
          fullName: _driver!.fullName,
          email: _driver!.email,
          dob: _driver!.dob,
          emergencyContact: _driver!.emergencyContact,
          onboardingStatus: _driver!.onboardingStatus,
          isOnline: isOnline,
          vehicle: _driver!.vehicle,
          documents: _driver!.documents,
        );
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<void> signOut() async {
    await SecureStorageService.clearSession();
    _driver = null;
    _phone = null;
    _state = AuthState.unauthenticated;
    notifyListeners();
  }
}
