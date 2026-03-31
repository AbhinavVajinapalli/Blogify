import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'app.dart';
import 'core/services/storage_service.dart';
import 'features/auth/controllers/auth_controller.dart';
import 'features/blogs/controllers/blog_controller.dart';
import 'features/bookmarks/controllers/bookmark_controller.dart';
import 'features/comments/controllers/comment_controller.dart';
import 'features/dashboard/controllers/dashboard_controller.dart';
import 'features/profile/controllers/profile_controller.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await StorageService.init();

  Get.put(AuthController(), permanent: true);
  Get.put(BlogController(), permanent: true);
  Get.put(ProfileController(), permanent: true);
  Get.put(CommentController(), permanent: true);
  Get.put(BookmarkController(), permanent: true);
  Get.put(DashboardController(), permanent: true);

  runApp(const BlogifyApp());
}
