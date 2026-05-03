class DriverModel {
  final int id;
  final String phoneNumber;
  final String? fullName;
  final String? email;
  final String? dob;
  final String? emergencyContact;
  final String onboardingStatus;
  final bool isOnline;
  final VehicleInfo? vehicle;
  final Map<String, DocumentInfo> documents;

  const DriverModel({
    required this.id,
    required this.phoneNumber,
    required this.onboardingStatus,
    required this.isOnline,
    this.fullName,
    this.email,
    this.dob,
    this.emergencyContact,
    this.vehicle,
    this.documents = const {},
  });

  bool get isApproved => onboardingStatus == 'approved';
  bool get isPendingReview => onboardingStatus == 'pending_review';
  bool get needsOnboarding => onboardingStatus != 'approved' && onboardingStatus != 'pending_review';

  factory DriverModel.fromJson(Map<String, dynamic> json) => DriverModel(
        id: json['id'] as int,
        phoneNumber: json['phone_number'] as String,
        fullName: json['full_name'] as String?,
        email: json['email'] as String?,
        dob: json['dob'] as String?,
        emergencyContact: json['emergency_contact'] as String?,
        onboardingStatus: json['onboarding_status'] as String,
        isOnline: json['is_online'] as bool? ?? false,
        vehicle: json['vehicle'] != null
            ? VehicleInfo.fromJson(json['vehicle'] as Map<String, dynamic>)
            : null,
        documents: (json['documents'] as Map<String, dynamic>? ?? {}).map(
          (k, v) => MapEntry(k, DocumentInfo.fromJson(v as Map<String, dynamic>)),
        ),
      );
}

class VehicleInfo {
  final String? vehicleType;
  final String? make;
  final String? model;
  final String? plateNumber;
  final String? photoFrontUrl;
  final String? photoBackUrl;
  final String? photoLeftUrl;
  final String? photoRightUrl;

  const VehicleInfo({
    this.vehicleType,
    this.make,
    this.model,
    this.plateNumber,
    this.photoFrontUrl,
    this.photoBackUrl,
    this.photoLeftUrl,
    this.photoRightUrl,
  });

  bool get allPhotosUploaded =>
      photoFrontUrl != null &&
      photoBackUrl != null &&
      photoLeftUrl != null &&
      photoRightUrl != null;

  factory VehicleInfo.fromJson(Map<String, dynamic> json) => VehicleInfo(
        vehicleType: json['vehicle_type'] as String?,
        make: json['make'] as String?,
        model: json['model'] as String?,
        plateNumber: json['plate_number'] as String?,
        photoFrontUrl: json['photo_front_url'] as String?,
        photoBackUrl: json['photo_back_url'] as String?,
        photoLeftUrl: json['photo_left_url'] as String?,
        photoRightUrl: json['photo_right_url'] as String?,
      );
}

class DocumentInfo {
  final String? fileUrl;
  final bool verified;

  const DocumentInfo({this.fileUrl, this.verified = false});

  factory DocumentInfo.fromJson(Map<String, dynamic> json) => DocumentInfo(
        fileUrl: json['file_url'] as String?,
        verified: json['verified'] as bool? ?? false,
      );
}
