class UserModel {
  final String uid;
  final String phoneNumber;
  final String? displayName;
  final String? email;
  final String? profileImageUrl;
  final String? deliveryAddress;
  final double? lat;
  final double? lng;

  const UserModel({
    required this.uid,
    required this.phoneNumber,
    this.displayName,
    this.email,
    this.profileImageUrl,
    this.deliveryAddress,
    this.lat,
    this.lng,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        uid: json['uid'],
        phoneNumber: json['phone_number'],
        displayName: json['display_name'],
        email: json['email'],
        profileImageUrl: json['profile_image_url'],
        deliveryAddress: json['delivery_address'],
        lat: json['lat'] != null ? (json['lat'] as num).toDouble() : null,
        lng: json['lng'] != null ? (json['lng'] as num).toDouble() : null,
      );

  UserModel copyWith({
    String? displayName,
    String? email,
    String? profileImageUrl,
    String? deliveryAddress,
    double? lat,
    double? lng,
  }) =>
      UserModel(
        uid: uid,
        phoneNumber: phoneNumber,
        displayName: displayName ?? this.displayName,
        email: email ?? this.email,
        profileImageUrl: profileImageUrl ?? this.profileImageUrl,
        deliveryAddress: deliveryAddress ?? this.deliveryAddress,
        lat: lat ?? this.lat,
        lng: lng ?? this.lng,
      );
}
