import '../../../core/constants/api_endpoints.dart';
import '../../../core/services/api_service.dart';
import '../../../models/comment_model.dart';

class CommentService {
  final ApiService _api = ApiService.instance;

  Future<List<CommentModel>> fetchComments(String blogId) async {
    final data = await _api.get('${ApiEndpoints.blogs}/$blogId/comments') as Map<String, dynamic>;
    final root = (data['data'] is Map<String, dynamic>)
        ? data['data'] as Map<String, dynamic>
        : data;
    final items = (root['comments'] ?? root['data'] ?? <dynamic>[]) as List<dynamic>;
    return items.map((e) => CommentModel.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<CommentModel> addComment(String blogId, String content) async {
    final data = await _api.post('${ApiEndpoints.blogs}/$blogId/comments', data: {
      'content': content,
    }) as Map<String, dynamic>;
    final root = (data['data'] is Map<String, dynamic>)
        ? data['data'] as Map<String, dynamic>
        : data;
    return CommentModel.fromJson((root['comment'] ?? root) as Map<String, dynamic>);
  }

  Future<void> deleteComment(String blogId, String commentId) async {
    await _api.delete('${ApiEndpoints.blogs}/$blogId/comments/$commentId');
  }
}
