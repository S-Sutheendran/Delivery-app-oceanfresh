import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product.dart';
import '../models/category.dart';

class ApiService {
  static const String _baseUrl = 'http://localhost:8000/api/v1';

  static final _client = http.Client();

  static Future<List<Product>> fetchProducts({
    String? categoryId,
    String? search,
    String sortBy = 'popular',
    int page = 1,
    int limit = 50,
  }) async {
    final params = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
      'sort_by': sortBy,
    };
    if (categoryId != null) params['category_id'] = categoryId;
    if (search != null && search.isNotEmpty) params['search'] = search;

    final uri = Uri.parse('$_baseUrl/products').replace(queryParameters: params);
    final response = await _client.get(uri);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      return data.map((j) => Product.fromJson(j)).toList();
    }
    throw Exception('Failed to load products: ${response.statusCode}');
  }

  static Future<Product> fetchProductById(int id) async {
    final response = await _client.get(Uri.parse('$_baseUrl/products/$id'));
    if (response.statusCode == 200) {
      return Product.fromJson(jsonDecode(response.body));
    }
    throw Exception('Product not found');
  }

  static Future<List<Category>> fetchCategories() async {
    final response = await _client.get(Uri.parse('$_baseUrl/categories'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      return data.map((j) => Category.fromJson(j)).toList();
    }
    throw Exception('Failed to load categories');
  }

  static Future<bool> checkWhatsAppAvailability(String phone) async {
    try {
      final response = await _client
          .get(Uri.parse('$_baseUrl/auth/check-whatsapp?phone=${Uri.encodeComponent(phone)}'))
          .timeout(const Duration(seconds: 10));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['whatsapp_available'] == true;
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  static Future<Map<String, dynamic>> sendWhatsAppOtp(String phone) async {
    final response = await _client.post(
      Uri.parse('$_baseUrl/auth/send-whatsapp-otp'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phone': phone}),
    );
    if (response.statusCode == 200) return jsonDecode(response.body);
    throw Exception('Failed to send WhatsApp OTP');
  }

  static Future<bool> verifyWhatsAppOtp({
    required String token,
    required String otp,
  }) async {
    final response = await _client.post(
      Uri.parse('$_baseUrl/auth/verify-whatsapp-otp'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'token': token, 'otp': otp}),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body)['verified'] == true;
    }
    return false;
  }

  static Future<Map<String, dynamic>> placeOrder({
    required List<Map<String, dynamic>> items,
    required String address,
    required String userId,
    required double total,
  }) async {
    final response = await _client.post(
      Uri.parse('$_baseUrl/orders'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'user_id': userId,
        'items': items,
        'delivery_address': address,
        'total': total,
      }),
    );
    if (response.statusCode == 201) return jsonDecode(response.body);
    throw Exception('Failed to place order');
  }
}
