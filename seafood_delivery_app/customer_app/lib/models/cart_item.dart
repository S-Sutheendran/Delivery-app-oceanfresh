import 'product.dart';

class CartItem {
  final Product product;
  int quantity;

  CartItem({required this.product, this.quantity = 1});

  double get total => product.price * quantity;

  CartItem copyWith({int? quantity}) =>
      CartItem(product: product, quantity: quantity ?? this.quantity);

  Map<String, dynamic> toJson() => {
        'product_id': product.id,
        'product_name': product.name,
        'price': product.price,
        'quantity': quantity,
        'image_url': product.imageUrl,
        'unit': product.unit,
      };
}
