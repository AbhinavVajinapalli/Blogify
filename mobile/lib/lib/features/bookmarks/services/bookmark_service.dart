import '../../../core/constants/api_endpoints.dart';
import '../../../core/services/api_service.dart';
import '../../../models/blog_model.dart';

class BookmarkService {
  final ApiService _api = ApiService.instance;

  Future<void> toggleBookmark(String blogId) async {
    await _api.patch('${ApiEndpoints.blogs}/$blogId/bookmark');
  }

  Future<List<BlogModel>> fetchBookmarks() async {
    try {
      final data = await _api.get(ApiEndpoints.bookmarks) as Map<String, dynamic>;
      final root = (data['data'] is Map<String, dynamic>)
          ? data['data'] as Map<String, dynamic>
          : data;
      final items = (root['bookmarks'] ?? root['data'] ?? <dynamic>[]) as List<dynamic>;
      return items.map((e) => BlogModel.fromJson(e as Map<String, dynamic>)).toList();
    } on ApiException catch (e) {
      if (e.statusCode == 404) {
        return <BlogModel>[];
      }
      rethrow;
    }
  }
}
