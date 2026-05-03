import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  static const _keyToken    = 'driver_access_token';
  static const _keyDriverId = 'driver_id';
  static const _keyPhone    = 'driver_phone';

  static Future<void> saveSession({
    required String token,
    required int driverId,
    required String phone,
  }) async {
    await Future.wait([
      _storage.write(key: _keyToken,    value: token),
      _storage.write(key: _keyDriverId, value: driverId.toString()),
      _storage.write(key: _keyPhone,    value: phone),
    ]);
  }

  static Future<String?> getToken()    => _storage.read(key: _keyToken);
  static Future<String?> getDriverId() => _storage.read(key: _keyDriverId);
  static Future<String?> getPhone()    => _storage.read(key: _keyPhone);

  static Future<void> clearSession() => _storage.deleteAll();
}
