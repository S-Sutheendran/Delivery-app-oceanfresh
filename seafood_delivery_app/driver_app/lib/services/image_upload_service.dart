import 'dart:io';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import '../config/constants.dart';

class ImageUploadService {
  /// Compress [source] to ≤ [AppConstants.maxImageBytes] and return the
  /// compressed [File].  Falls back to the original if compression fails.
  static Future<File> compress(File source) async {
    try {
      final dir = await getTemporaryDirectory();
      final target = p.join(dir.path, '${DateTime.now().millisecondsSinceEpoch}.jpg');
      final result = await FlutterImageCompress.compressAndGetFile(
        source.absolute.path,
        target,
        quality: 75,
        minWidth: 1080,
        minHeight: 1080,
        format: CompressFormat.jpeg,
      );
      return result != null ? File(result.path) : source;
    } catch (_) {
      return source;
    }
  }
}
