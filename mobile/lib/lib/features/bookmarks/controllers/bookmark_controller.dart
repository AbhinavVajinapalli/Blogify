import 'package:get/get.dart';

import '../../../models/blog_model.dart';
import '../services/bookmark_service.dart';

class BookmarkController extends GetxController {
  final BookmarkService _service = BookmarkService();

  final RxList<BlogModel> bookmarks = <BlogModel>[].obs;
  final RxBool isLoading = false.obs;

  Future<void> fetchBookmarks() async {
    isLoading.value = true;
    try {
      bookmarks.value = await _service.fetchBookmarks();
    } catch (e) {
      Get.snackbar('Bookmarks', e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> toggle(String blogId) async {
    try {
      await _service.toggleBookmark(blogId);
      await fetchBookmarks();
    } catch (e) {
      Get.snackbar('Bookmark failed', e.toString());
    }
  }
}
