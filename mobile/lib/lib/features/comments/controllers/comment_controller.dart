import 'package:get/get.dart';

import '../../../models/comment_model.dart';
import '../services/comment_service.dart';

class CommentController extends GetxController {
  final CommentService _service = CommentService();

  final RxList<CommentModel> comments = <CommentModel>[].obs;
  final RxBool isLoading = false.obs;

  Future<void> fetchComments(String blogId) async {
    isLoading.value = true;
    try {
      comments.value = await _service.fetchComments(blogId);
    } catch (e) {
      Get.snackbar('Comments', e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> addComment(String blogId, String content) async {
    try {
      final comment = await _service.addComment(blogId, content);
      comments.insert(0, comment);
    } catch (e) {
      Get.snackbar('Comment failed', e.toString());
    }
  }

  Future<void> deleteComment(String blogId, String commentId) async {
    try {
      await _service.deleteComment(blogId, commentId);
      comments.removeWhere((c) => c.id == commentId);
    } catch (e) {
      Get.snackbar('Delete failed', e.toString());
    }
  }
}
