class AppConstants {
  // Backend base URL — update for your environment
  // Android emulator:  http://10.0.2.2:8000/api/v1
  // iOS simulator / physical device on same WiFi: http://192.168.x.x:8000/api/v1
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';

  // Distance in metres below which the "almost here" notification fires
  static const double proximityThresholdMeters = 1000.0;

  // Location update interval for active deliveries
  static const int locationUpdateIntervalSeconds = 15;

  // Minimum distance moved (metres) before sending a location ping
  static const double locationDistanceFilterMeters = 30.0;

  // Max image file size for uploads (bytes) — 1 MB
  static const int maxImageBytes = 1024 * 1024;

  // Supported vehicle types
  static const List<String> vehicleTypes = ['Bike', 'Scooter', 'Van', 'Car'];

  // Onboarding step labels
  static const List<String> onboardingSteps = [
    'Personal Details',
    'Vehicle Details',
    'Documents & License',
    'Photos & Uploads',
  ];

  // FCM notification channel ID (Android)
  static const String fcmChannelId = 'oceanfresh_driver';
  static const String fcmChannelName = 'OceanFresh Driver';
}
