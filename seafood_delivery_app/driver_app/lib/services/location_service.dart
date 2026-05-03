import 'dart:async';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';
import '../config/constants.dart';

typedef OnLocationUpdate = void Function(LatLng position);

class LocationService {
  StreamSubscription<Position>? _subscription;

  Future<LatLng?> getCurrentPosition() async {
    if (!await _ensurePermission()) return null;
    try {
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );
      return LatLng(pos.latitude, pos.longitude);
    } catch (_) {
      return null;
    }
  }

  /// Start streaming location updates.  Fires [onUpdate] each time the
  /// driver moves [distanceFilter] metres.  Must call [stop] when done.
  Future<bool> start(OnLocationUpdate onUpdate) async {
    if (!await _ensurePermission()) return false;
    _subscription?.cancel();
    const settings = LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: AppConstants.locationDistanceFilterMeters ~/ 1,
    );
    _subscription = Geolocator.getPositionStream(locationSettings: settings).listen(
      (pos) => onUpdate(LatLng(pos.latitude, pos.longitude)),
    );
    return true;
  }

  void stop() {
    _subscription?.cancel();
    _subscription = null;
  }

  static Future<bool> _ensurePermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return false;

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return false;
    }
    if (permission == LocationPermission.deniedForever) return false;
    return true;
  }
}
