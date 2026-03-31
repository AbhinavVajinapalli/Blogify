import 'package:get/get.dart';

import '../../../core/constants/app_constants.dart';
import '../../../models/blog_model.dart';
import '../services/blog_service.dart';

class BlogController extends GetxController {
  final BlogService _service = BlogService();

  final RxList<BlogModel> blogs = <BlogModel>[].obs;
  final Rxn<BlogModel> selectedBlog = Rxn<BlogModel>();
  final RxBool isLoading = false.obs;
  final RxBool isPaginationLoading = false.obs;
  final RxBool hasMore = true.obs;
  final RxInt page = 1.obs;
  final RxString query = ''.obs;

  @override
  void onInit() {
    super.onInit();
    fetchFeed(refresh: true);
  }

  Future<void> fetchFeed({bool refresh = false}) async {
    if (refresh) {
      page.value = 1;
      hasMore.value = true;
      blogs.clear();
    }

    if (!hasMore.value || isPaginationLoading.value) {
      return;
    }

    if (page.value == 1) {
      isLoading.value = true;
    } else {
      isPaginationLoading.value = true;
    }

    try {
      final items = await _service.fetchBlogs(
        page: page.value,
        limit: AppConstants.defaultPageSize,
        search: query.value,
      );
      blogs.addAll(items);
      hasMore.value = items.length == AppConstants.defaultPageSize;
      page.value++;
    } catch (e) {
      Get.snackbar('Error', e.toString());
    } finally {
      isLoading.value = false;
      isPaginationLoading.value = false;
    }
  }

  Future<void> searchBlogs(String value) async {
    query.value = value.trim();
    await fetchFeed(refresh: true);
  }

  Future<void> fetchDetails(String blogId) async {
    isLoading.value = true;
    try {
      selectedBlog.value = await _service.fetchBlogById(blogId);
      await _service.incrementView(blogId);
    } catch (e) {
      Get.snackbar('Error', e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> saveBlog({String? id, required Map<String, dynamic> payload}) async {
    isLoading.value = true;
    try {
      if (id == null || id.isEmpty) {
        final created = await _service.createBlog(payload);
        blogs.insert(0, created);
      } else {
        final updated = await _service.updateBlog(id, payload);
        final index = blogs.indexWhere((b) => b.id == id);
        if (index != -1) {
          blogs[index] = updated;
        }
      }
      Get.back();
      Get.snackbar('Success', 'Post saved');
    } catch (e) {
      Get.snackbar('Error', e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> removeBlog(String id) async {
    try {
      await _service.deleteBlog(id);
      blogs.removeWhere((b) => b.id == id);
      Get.snackbar('Success', 'Post deleted');
    } catch (e) {
      Get.snackbar('Delete failed', e.toString());
    }
  }

  Future<void> likeUnlike(String id) async {
    try {
      await _service.toggleLike(id);
      await fetchDetails(id);
    } catch (e) {
      Get.snackbar('Error', e.toString());
    }
  }
}
