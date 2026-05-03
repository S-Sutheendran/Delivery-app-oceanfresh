import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'driver_api_service.dart';

class FcmService {
  static final _messaging = FirebaseMessaging.instance;

  static Future<void> init() async {
    await _messaging.requestPermission(alert: true, badge: true, sound: true);

    final token = await _messaging.getToken();
    if (token != null) await _saveToken(token);

    _messaging.onTokenRefresh.listen(_saveToken);

    FirebaseMessaging.onMessage.listen(_handleForeground);
    FirebaseMessaging.onMessageOpenedApp.listen(_handleTap);
  }

  static Future<void> _saveToken(String token) async {
    try {
      await DriverApiService.updateFcmToken(token);
    } catch (e) {
      debugPrint('FCM token save failed: $e');
    }
  }

  static void _handleForeground(RemoteMessage message) {
    debugPrint('FCM foreground: ${message.data}');
    // Handled by the provider/notifier layer listening to streams
  }

  static void _handleTap(RemoteMessage message) {
    debugPrint('FCM tapped: ${message.data}');
    // Navigation handled by the app shell
  }

  /// Subscribe to admin-pushed order assignment notifications.
  static Future<void> subscribeToOrderTopic(int orderId) =>
      _messaging.subscribeToTopic('order_$orderId');

  static Future<void> unsubscribeFromOrderTopic(int orderId) =>
      _messaging.unsubscribeFromTopic('order_$orderId');
}
