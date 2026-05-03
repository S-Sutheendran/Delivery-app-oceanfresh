import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config/constants.dart';
import 'secure_storage_service.dart';

class DriverApiService {
  static const String _base = AppConstants.baseUrl;

  static Future<Map<String, String>> _authHeaders() async {
    final token = await SecureStorageService.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<T> _get<T>(String path) async {
    final res = await http.get(
      Uri.parse('$_base$path'),
      headers: await _authHeaders(),
    );
    _assertOk(res);
    return jsonDecode(res.body) as T;
  }

  static Future<T> _post<T>(String path, Map<String, dynamic> body) async {
    final res = await http.post(
      Uri.parse('$_base$path'),
      headers: await _authHeaders(),
      body: jsonEncode(body),
    );
    _assertOk(res);
    return jsonDecode(res.body) as T;
  }

  static Future<T> _patch<T>(String path, Map<String, dynamic> body) async {
    final res = await http.patch(
      Uri.parse('$_base$path'),
      headers: await _authHeaders(),
      body: jsonEncode(body),
    );
    _assertOk(res);
    return jsonDecode(res.body) as T;
  }

  static void _assertOk(http.Response res) {
    if (res.statusCode >= 400) {
      String detail = res.body;
      try {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        detail = decoded['detail']?.toString() ?? res.body;
      } catch (_) {}
      throw Exception('API error ${res.statusCode}: $detail');
    }
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  static Future<Map<String, dynamic>> registerDriver({
    required String phone,
    String? firebaseUid,
  }) =>
      _post('/drivers/register', {'phone_number': phone, 'firebase_uid': firebaseUid});

  // ── OTP (shared with customer auth) ──────────────────────────────────────

  static Future<void> sendOtp(String phone) async {
    await _post('/auth/send-whatsapp-otp', {'phone': phone});
  }

  static Future<Map<String, dynamic>> verifyOtp(String phone, String otp) =>
      _post('/auth/verify-whatsapp-otp', {'phone': phone, 'otp': otp});

  // ── Profile ───────────────────────────────────────────────────────────────

  static Future<Map<String, dynamic>> getProfile() => _get('/drivers/me');

  static Future<void> savePersonalDetails({
    required String fullName,
    String? dob,
    String? email,
    String? emergencyContact,
  }) =>
      _patch('/drivers/me/personal', {
        'full_name': fullName,
        if (dob != null) 'dob': dob,
        if (email != null) 'email': email,
        if (emergencyContact != null) 'emergency_contact': emergencyContact,
      });

  static Future<void> saveVehicleDetails({
    required String vehicleType,
    required String make,
    required String model,
    required String plateNumber,
    int? year,
    String? color,
    String? licenseNumber,
    String? rcNumber,
    String? licenseExpiry,
    String? rcExpiry,
  }) =>
      _patch('/drivers/me/vehicle', {
        'vehicle_type': vehicleType.toLowerCase(),
        'make': make,
        'model': model,
        'plate_number': plateNumber,
        if (year != null) 'year': year,
        if (color != null) 'color': color,
        if (licenseNumber != null) 'license_number': licenseNumber,
        if (rcNumber != null) 'rc_number': rcNumber,
        if (licenseExpiry != null) 'license_expiry': licenseExpiry,
        if (rcExpiry != null) 'rc_expiry': rcExpiry,
      });

  static Future<void> saveDocumentMeta({
    required String docType,
    String? docNumber,
    String? expiryDate,
  }) =>
      _patch('/drivers/me/documents', {
        'doc_type': docType,
        if (docNumber != null) 'doc_number': docNumber,
        if (expiryDate != null) 'expiry_date': expiryDate,
      });

  static Future<String> uploadDocument(File file, String docType) =>
      _multipartUpload('/drivers/me/upload-document', file, {'doc_type': docType})
          .then((r) => r['file_url'] as String);

  static Future<String> uploadVehiclePhoto(File file, String side) =>
      _multipartUpload('/drivers/me/upload-vehicle-photo', file, {'side': side})
          .then((r) => r['file_url'] as String);

  static Future<void> submitOnboarding() => _post('/drivers/me/submit-onboarding', {});

  static Future<void> updateFcmToken(String token) =>
      _patch('/drivers/me/fcm-token', {'fcm_token': token});

  static Future<void> setAvailability(bool isOnline) =>
      _patch('/drivers/me/availability', {'is_online': isOnline});

  // ── Orders ────────────────────────────────────────────────────────────────

  static Future<Map<String, dynamic>> getAssignedOrders() =>
      _get('/driver-orders/assigned');

  static Future<Map<String, dynamic>> getOptimizedRoute(double lat, double lng) =>
      _get('/driver-orders/optimized-route?driver_lat=$lat&driver_lng=$lng');

  static Future<void> updateOrderStatus(int orderId, String status) =>
      _patch('/driver-orders/$orderId/status', {'status': status});

  static Future<String> uploadDeliveryPhoto(int orderId, File photo) =>
      _multipartUpload('/driver-orders/$orderId/delivery-photo', photo, {})
          .then((r) => r['photo_url'] as String);

  // ── Reviews ──────────────────────────────────────────────────────────────

  static Future<void> requestReview(int orderId) async {
    final driverId = await SecureStorageService.getDriverId();
    if (driverId == null) throw Exception('Not authenticated');
    await _post('/reviews/request/$orderId?driver_id=$driverId', {});
  }

  static Future<Map<String, dynamic>> getReviewStats() async {
    final driverId = await SecureStorageService.getDriverId();
    if (driverId == null) throw Exception('Not authenticated');
    return _get('/reviews/my-stats?driver_id=$driverId');
  }

  // ── Location ─────────────────────────────────────────────────────────────

  static Future<void> pingLocation(int orderId, double lat, double lng) =>
      _post('/driver-location/ping', {
        'order_id': orderId,
        'lat': lat,
        'lng': lng,
      });

  // ── Multipart helper ──────────────────────────────────────────────────────

  static Future<Map<String, dynamic>> _multipartUpload(
    String path,
    File file,
    Map<String, String> fields,
  ) async {
    final token = await SecureStorageService.getToken();
    final request = http.MultipartRequest('POST', Uri.parse('$_base$path'));
    if (token != null) request.headers['Authorization'] = 'Bearer $token';
    fields.forEach((k, v) => request.fields[k] = v);
    request.files.add(await http.MultipartFile.fromPath('file', file.path));
    final streamed = await request.send();
    final res = await http.Response.fromStream(streamed);
    _assertOk(res);
    return jsonDecode(res.body) as Map<String, dynamic>;
  }
}
