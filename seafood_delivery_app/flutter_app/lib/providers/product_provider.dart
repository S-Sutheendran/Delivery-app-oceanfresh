import 'package:flutter/foundation.dart' hide Category;
import '../models/product.dart';
import '../models/category.dart';
import '../services/api_service.dart';

enum LoadState { idle, loading, loaded, error }

class ProductProvider extends ChangeNotifier {
  List<Product> _allProducts = [];
  List<Product> _filteredProducts = [];
  List<Category> _categories = Category.defaults;
  LoadState _state = LoadState.idle;
  String? _errorMessage;
  String _searchQuery = '';
  String? _selectedCategoryId;
  String _sortBy = 'popular'; // popular | price_asc | price_desc | rating
  double _maxPrice = 5000;
  double _minRating = 0;
  bool _inStockOnly = false;

  List<Product> get allProducts => _allProducts;
  List<Product> get filteredProducts => _filteredProducts;
  List<Category> get categories => _categories;
  LoadState get state => _state;
  String? get errorMessage => _errorMessage;
  String get searchQuery => _searchQuery;
  String? get selectedCategoryId => _selectedCategoryId;
  String get sortBy => _sortBy;
  double get maxPrice => _maxPrice;
  double get minRating => _minRating;
  bool get inStockOnly => _inStockOnly;

  List<Product> get bestSellers =>
      _allProducts.where((p) => p.isBestSeller).toList();

  List<Product> get topRated =>
      _allProducts.where((p) => p.isTopRated).toList();

  List<Product> get seasonal =>
      _allProducts.where((p) => p.isSeasonal).toList();

  Future<void> loadProducts() async {
    _state = LoadState.loading;
    notifyListeners();
    try {
      _allProducts = await ApiService.fetchProducts();
      _applyFilters();
      _state = LoadState.loaded;
    } catch (e) {
      _errorMessage = e.toString();
      _state = LoadState.error;
    }
    notifyListeners();
  }

  Future<void> loadCategories() async {
    try {
      _categories = await ApiService.fetchCategories();
      notifyListeners();
    } catch (_) {
      // keep defaults
    }
  }

  void search(String query) {
    _searchQuery = query;
    _applyFilters();
    notifyListeners();
  }

  void selectCategory(String? categoryId) {
    _selectedCategoryId = categoryId;
    _applyFilters();
    notifyListeners();
  }

  void applyFilters({
    String? sortBy,
    double? maxPrice,
    double? minRating,
    bool? inStockOnly,
  }) {
    if (sortBy != null) _sortBy = sortBy;
    if (maxPrice != null) _maxPrice = maxPrice;
    if (minRating != null) _minRating = minRating;
    if (inStockOnly != null) _inStockOnly = inStockOnly;
    _applyFilters();
    notifyListeners();
  }

  void resetFilters() {
    _searchQuery = '';
    _selectedCategoryId = null;
    _sortBy = 'popular';
    _maxPrice = 5000;
    _minRating = 0;
    _inStockOnly = false;
    _applyFilters();
    notifyListeners();
  }

  void _applyFilters() {
    var list = List<Product>.from(_allProducts);

    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      list = list
          .where((p) =>
              p.name.toLowerCase().contains(q) ||
              p.description.toLowerCase().contains(q) ||
              p.categoryName.toLowerCase().contains(q) ||
              p.tags.any((t) => t.toLowerCase().contains(q)))
          .toList();
    }

    if (_selectedCategoryId != null) {
      list = list.where((p) => p.categoryId == _selectedCategoryId).toList();
    }

    if (_inStockOnly) {
      list = list.where((p) => p.inStock).toList();
    }

    list = list.where((p) => p.price <= _maxPrice).toList();
    list = list.where((p) => p.rating >= _minRating).toList();

    switch (_sortBy) {
      case 'price_asc':
        list.sort((a, b) => a.price.compareTo(b.price));
      case 'price_desc':
        list.sort((a, b) => b.price.compareTo(a.price));
      case 'rating':
        list.sort((a, b) => b.rating.compareTo(a.rating));
      default: // popular
        list.sort((a, b) => b.reviewCount.compareTo(a.reviewCount));
    }

    _filteredProducts = list;
  }

  List<Product> getByCategory(String categoryId) =>
      _allProducts.where((p) => p.categoryId == categoryId).toList();
}
