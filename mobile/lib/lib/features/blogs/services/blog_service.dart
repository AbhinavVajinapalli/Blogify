import '../../../core/constants/api_endpoints.dart';
import '../../../core/services/api_service.dart';
import '../../../models/blog_model.dart';

class BlogService {
  final ApiService _api = ApiService.instance;

  Future<List<BlogModel>> fetchBlogs({int page = 1, int limit = 10, String? search}) async {
    final data = await _api.get(ApiEndpoints.blogs, query: {
      'page': page,
      'limit': limit,
      if (search != null && search.isNotEmpty) 'search': search,
    }) as Map<String, dynamic>;

    final root = (data['data'] is Map<String, dynamic>)
        ? data['data'] as Map<String, dynamic>
        : data;
    final items = (root['blogs'] ?? root['data'] ?? <dynamic>[]) as List<dynamic>;
    return items.map((e) => BlogModel.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<BlogModel> fetchBlogById(String id) async {
    final data = await _api.get('${ApiEndpoints.blogs}/$id') as Map<String, dynamic>;
    final root = (data['data'] is Map<String, dynamic>)
        ? data['data'] as Map<String, dynamic>
        : data;
    return BlogModel.fromJson((root['blog'] ?? root) as Map<String, dynamic>);
  }

  Future<BlogModel> createBlog(Map<String, dynamic> payload) async {
    final data = await _api.post(ApiEndpoints.blogs, data: payload) as Map<String, dynamic>;
    final root = (data['data'] is Map<String, dynamic>)
        ? data['data'] as Map<String, dynamic>
        : data;
    return BlogModel.fromJson((root['blog'] ?? root) as Map<String, dynamic>);
  }

  Future<BlogModel> updateBlog(String id, Map<String, dynamic> payload) async {
    final data = await _api.put('${ApiEndpoints.blogs}/$id', data: payload) as Map<String, dynamic>;
    final root = (data['data'] is Map<String, dynamic>)
        ? data['data'] as Map<String, dynamic>
        : data;
    return BlogModel.fromJson((root['blog'] ?? root) as Map<String, dynamic>);
  }

  Future<void> deleteBlog(String id) async {
    await _api.delete('${ApiEndpoints.blogs}/$id');
  }

  Future<void> toggleLike(String id) async {
    await _api.patch('${ApiEndpoints.blogs}/$id/like');
  }

  Future<void> incrementView(String id) async {
    try {
      await _api.patch('${ApiEndpoints.blogs}/$id/view');
    } on ApiException catch (e) {
      if (e.statusCode == 404) {
        return;
      }
      rethrow;
    }
  }
}
