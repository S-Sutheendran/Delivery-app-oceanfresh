import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

enum AuthState { initial, loading, otpSent, authenticated, error }

class AuthProvider extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  AuthState _state = AuthState.initial;
  UserModel? _user;
  String? _verificationId;
  String? _errorMessage;
  bool _isWhatsAppOtp = false;
  String? _customOtpToken; // token for WhatsApp OTP flow

  AuthState get state => _state;
  UserModel? get user => _user;
  String? get verificationId => _verificationId;
  String? get errorMessage => _errorMessage;
  bool get isWhatsAppOtp => _isWhatsAppOtp;
  bool get isAuthenticated => _state == AuthState.authenticated;

  Future<void> sendOtp({
    required String phoneNumber,
    required String countryCode,
  }) async {
    _setState(AuthState.loading);
    final fullPhone = '$countryCode$phoneNumber';

    try {
      // Check WhatsApp availability from backend
      final whatsappAvailable = await ApiService.checkWhatsAppAvailability(fullPhone);
      _isWhatsAppOtp = whatsappAvailable;

      if (whatsappAvailable) {
        await _sendWhatsAppOtp(fullPhone);
      } else {
        await _sendSmsOtp(fullPhone);
      }
    } catch (e) {
      _errorMessage = e.toString();
      _setState(AuthState.error);
    }
  }

  Future<void> _sendWhatsAppOtp(String phone) async {
    final result = await ApiService.sendWhatsAppOtp(phone);
    _customOtpToken = result['token'];
    _verificationId = result['token'];
    _setState(AuthState.otpSent);
  }

  Future<void> _sendSmsOtp(String phone) async {
    await _auth.verifyPhoneNumber(
      phoneNumber: phone,
      timeout: const Duration(seconds: 60),
      verificationCompleted: (PhoneAuthCredential credential) async {
        await _signInWithCredential(credential);
      },
      verificationFailed: (FirebaseAuthException e) {
        _errorMessage = e.message ?? 'Verification failed';
        _setState(AuthState.error);
      },
      codeSent: (String vId, int? resendToken) {
        _verificationId = vId;
        _setState(AuthState.otpSent);
      },
      codeAutoRetrievalTimeout: (String vId) {
        _verificationId = vId;
      },
    );
  }

  Future<bool> verifyOtp(String otp) async {
    _setState(AuthState.loading);
    try {
      if (_isWhatsAppOtp) {
        return await _verifyWhatsAppOtp(otp);
      } else {
        return await _verifyFirebaseOtp(otp);
      }
    } catch (e) {
      _errorMessage = e.toString();
      _setState(AuthState.error);
      return false;
    }
  }

  Future<bool> _verifyWhatsAppOtp(String otp) async {
    final success = await ApiService.verifyWhatsAppOtp(
      token: _customOtpToken!,
      otp: otp,
    );
    if (success) {
      final firebaseUser = _auth.currentUser;
      _user = UserModel(
        uid: firebaseUser?.uid ?? DateTime.now().millisecondsSinceEpoch.toString(),
        phoneNumber: firebaseUser?.phoneNumber ?? '',
      );
      _setState(AuthState.authenticated);
    } else {
      _errorMessage = 'Invalid OTP. Please try again.';
      _setState(AuthState.error);
    }
    return success;
  }

  Future<bool> _verifyFirebaseOtp(String otp) async {
    if (_verificationId == null) return false;
    final credential = PhoneAuthProvider.credential(
      verificationId: _verificationId!,
      smsCode: otp,
    );
    return await _signInWithCredential(credential);
  }

  Future<bool> _signInWithCredential(PhoneAuthCredential credential) async {
    final result = await _auth.signInWithCredential(credential);
    if (result.user != null) {
      _user = UserModel(
        uid: result.user!.uid,
        phoneNumber: result.user!.phoneNumber ?? '',
      );
      _setState(AuthState.authenticated);
      return true;
    }
    return false;
  }

  Future<void> signOut() async {
    await _auth.signOut();
    _user = null;
    _verificationId = null;
    _customOtpToken = null;
    _setState(AuthState.initial);
  }

  void resetError() {
    if (_state == AuthState.error) _setState(AuthState.initial);
  }

  void _setState(AuthState s) {
    _state = s;
    notifyListeners();
  }
}
