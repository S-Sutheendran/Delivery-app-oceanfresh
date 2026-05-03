import 'package:flutter/foundation.dart';
import '../models/cart_item.dart';
import '../models/product.dart';

class CartProvider extends ChangeNotifier {
  final Map<int, CartItem> _items = {};

  Map<int, CartItem> get items => Map.unmodifiable(_items);

  int get itemCount => _items.values.fold(0, (sum, item) => sum + item.quantity);

  double get subtotal =>
      _items.values.fold(0.0, (sum, item) => sum + item.total);

  double get deliveryFee => subtotal > 0 ? (subtotal >= 500 ? 0 : 49) : 0;

  double get total => subtotal + deliveryFee;

  bool get isFreeDelivery => subtotal >= 500;

  bool containsProduct(int productId) => _items.containsKey(productId);

  int quantityOf(int productId) => _items[productId]?.quantity ?? 0;

  void addItem(Product product) {
    if (_items.containsKey(product.id)) {
      _items[product.id]!.quantity++;
    } else {
      _items[product.id] = CartItem(product: product, quantity: 1);
    }
    notifyListeners();
  }

  void removeItem(Product product) {
    if (!_items.containsKey(product.id)) return;
    if (_items[product.id]!.quantity <= 1) {
      _items.remove(product.id);
    } else {
      _items[product.id]!.quantity--;
    }
    notifyListeners();
  }

  void deleteItem(int productId) {
    _items.remove(productId);
    notifyListeners();
  }

  void setQuantity(int productId, int qty) {
    if (qty <= 0) {
      _items.remove(productId);
    } else if (_items.containsKey(productId)) {
      _items[productId]!.quantity = qty;
    }
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
  }

  List<CartItem> get itemList => _items.values.toList();
}
