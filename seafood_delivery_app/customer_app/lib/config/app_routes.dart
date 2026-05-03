import 'package:flutter/material.dart';
import '../screens/auth/phone_auth_screen.dart';
import '../screens/auth/otp_verification_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/products/product_list_screen.dart';
import '../screens/products/product_detail_screen.dart';
import '../screens/cart/cart_screen.dart';
import '../screens/orders/orders_screen.dart';
import '../models/product.dart';

class AppRoutes {
  static const String phoneAuth = '/';
  static const String otpVerification = '/otp';
  static const String home = '/home';
  static const String productList = '/products';
  static const String productDetail = '/product-detail';
  static const String cart = '/cart';
  static const String orders = '/orders';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case phoneAuth:
        return _fade(const PhoneAuthScreen());
      case otpVerification:
        final args = settings.arguments as Map<String, dynamic>?;
        return _slide(OtpVerificationScreen(
          phoneNumber: args?['phoneNumber'] ?? '',
          countryCode: args?['countryCode'] ?? '+1',
          verificationId: args?['verificationId'] ?? '',
          isWhatsApp: args?['isWhatsApp'] ?? false,
        ));
      case home:
        return _fade(const HomeScreen());
      case productList:
        final args = settings.arguments as Map<String, dynamic>?;
        return _slide(ProductListScreen(
          categoryId: args?['categoryId'],
          categoryName: args?['categoryName'] ?? 'Products',
          filterType: args?['filterType'],
        ));
      case productDetail:
        final product = settings.arguments as Product;
        return _slide(ProductDetailScreen(product: product));
      case cart:
        return _slide(const CartScreen());
      case orders:
        return _slide(const OrdersScreen());
      default:
        return _fade(const PhoneAuthScreen());
    }
  }

  static PageRoute _fade(Widget page) => PageRouteBuilder(
        pageBuilder: (_, __, ___) => page,
        transitionsBuilder: (_, anim, __, child) =>
            FadeTransition(opacity: anim, child: child),
        transitionDuration: const Duration(milliseconds: 300),
      );

  static PageRoute _slide(Widget page) => PageRouteBuilder(
        pageBuilder: (_, __, ___) => page,
        transitionsBuilder: (_, anim, __, child) => SlideTransition(
          position: Tween<Offset>(begin: const Offset(1, 0), end: Offset.zero)
              .animate(CurvedAnimation(parent: anim, curve: Curves.easeOutCubic)),
          child: child,
        ),
        transitionDuration: const Duration(milliseconds: 350),
      );
}
