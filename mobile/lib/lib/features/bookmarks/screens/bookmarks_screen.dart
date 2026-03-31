import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../widgets/app_loader.dart';
import '../../../widgets/blog_card.dart';
import '../controllers/bookmark_controller.dart';

class BookmarksScreen extends StatefulWidget {
  const BookmarksScreen({super.key});

  @override
  State<BookmarksScreen> createState() => _BookmarksScreenState();
}

class _BookmarksScreenState extends State<BookmarksScreen> {
  @override
  void initState() {
    super.initState();
    Get.find<BookmarkController>().fetchBookmarks();
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<BookmarkController>();
    return Scaffold(
      appBar: AppBar(title: const Text('Bookmarks')),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const AppLoader(message: 'Loading bookmarks');
        }
        if (controller.bookmarks.isEmpty) {
          return const Center(child: Text('No bookmarks yet'));
        }
        return ListView.builder(
          padding: const EdgeInsets.all(12),
          itemCount: controller.bookmarks.length,
          itemBuilder: (_, i) {
            final item = controller.bookmarks[i];
            return BlogCard(
              blog: item,
              onTap: () => Get.toNamed('/blog/${item.id}'),
              onLike: () => controller.toggle(item.id),
            );
          },
        );
      }),
    );
  }
}
