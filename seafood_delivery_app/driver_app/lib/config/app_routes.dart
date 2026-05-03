import 'package:flutter/material.dart';
import '../screens/auth/splash_screen.dart';
import '../screens/auth/phone_auth_screen.dart';
import '../screens/auth/otp_verification_screen.dart';
import '../screens/onboarding/onboarding_shell.dart';
import '../screens/onboarding/onboarding_complete_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/delivery/active_delivery_screen.dart';
import '../screens/delivery/delivery_photo_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/reviews/driver_reviews_screen.dart';

class AppRoutes {
  static const String splash            = '/';
  static const String phoneAuth         = '/auth/phone';
  static const String otpVerify         = '/auth/otp';
  static const String onboarding        = '/onboarding';
  static const String onboardingDone    = '/onboarding/done';
  static const String home              = '/home';
  static const String activeDelivery    = '/delivery/active';
  static const String deliveryPhoto     = '/delivery/photo';
  static const String profile           = '/profile';
  static const String myReviews         = '/reviews';

  static Map<String, WidgetBuilder> get routes => {
    splash:         (_) => const SplashScreen(),
    phoneAuth:      (_) => const PhoneAuthScreen(),
    otpVerify:      (_) => const OtpVerificationScreen(),
    onboarding:     (_) => const OnboardingShell(),
    onboardingDone: (_) => const OnboardingCompleteScreen(),
    home:           (_) => const HomeScreen(),
    profile:        (_) => const ProfileScreen(),
    myReviews:      (_) => const DriverReviewsScreen(),
  };

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case activeDelivery:
        return _slide(const ActiveDeliveryScreen());
      case deliveryPhoto:
        final orderId = settings.arguments as int;
        return _slide(DeliveryPhotoScreen(orderId: orderId));
      default:
        return MaterialPageRoute(
          builder: (_) => const SplashScreen(),
          settings: settings,
        );
    }
  }

  static PageRouteBuilder _slide(Widget page) => PageRouteBuilder(
        pageBuilder: (_, a, __) => page,
        transitionsBuilder: (_, animation, __, child) => SlideTransition(
          position: Tween(begin: const Offset(1, 0), end: Offset.zero)
              .animate(CurvedAnimation(parent: animation, curve: Curves.easeOutCubic)),
          child: child,
        ),
        transitionDuration: const Duration(milliseconds: 300),
      );
}
