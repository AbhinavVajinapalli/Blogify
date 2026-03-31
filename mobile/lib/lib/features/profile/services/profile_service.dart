import '../../../core/constants/api_endpoints.dart';
import '../../../core/services/api_service.dart';
import '../../../models/blog_model.dart';
import '../../../models/user_model.dart';

class ProfileService {
  final ApiService _api = ApiService.instance;

  Future<UserModel> fetchMe() async {
    final data = await _api.get(ApiEndpoints.me) as Map<String, dynamic>;
    final root = (data['data'] is Map<String, dynamic>)
        ? data['data'] as Map<String, dynamic>
        : data;
    return UserModel.fromJson((root['user'] ?? root) as Map<String, dynamic>);
  }

  Future<UserModel> updateProfile(Map<String, dynamic> payload) async {
    final data = await _api.patch(ApiEndpoints.me, data: payload) as Map<String, dynamic>;
    final root = (data['data'] is Map<String, dynamic>)
        ? data['data'] as Map<String, dynamic>
        : data;
    return UserModel.fromJson((root['user'] ?? root) as Map<String, dynamic>);
  }

  Future<void> deleteAccount() async {
    await _api.delete(ApiEndpoints.me);
  }

  Future<UserModel> fetchPublicByUserId(String userId) async {
    final blogs = await _fetchBlogs(limit: 100);
    final match = blogs.where((b) => b.author.id == userId).toList();
    if (match.isEmpty) {
      throw ApiException('Public profile not found');
    }
    return match.first.author;
  }

  Future<Map<String, dynamic>> fetchPublicBySlug(String slug) async {
    final blogs = await _fetchBlogs(limit: 100);
    final match = blogs.where((b) => (b.author.siteSlug ?? '').toLowerCase() == slug.toLowerCase()).toList();
    if (match.isEmpty) {
      throw ApiException('Public site not found for slug "$slug"');
    }
    return {
      'profile': match.first.author.toJson(),
      'blogs': match
          .map(
            (e) => {
              '_id': e.id,
              'title': e.title,
              'content': e.content,
              'tags': e.tags,
              'imageUrl': e.imageUrl,
              'author': {
                '_id': e.author.id,
                'name': e.author.name,
                'email': e.author.email,
                'bio': e.author.bio,
                'profilePicture': e.author.profilePicture,
                'siteName': e.author.siteName,
                'siteSlug': e.author.siteSlug,
              },
              'likes': e.likes,
              'viewCount': e.views,
              'createdAt': e.createdAt,
              'updatedAt': e.updatedAt,
            },
          )
          .toList(),
    };
  }

  Future<List<BlogModel>> fetchMyPosts() async {
    final me = await fetchMe();
    final blogs = await _fetchBlogs(limit: 100);
    return blogs.where((b) => b.author.id == me.id).toList();
  }

  Future<List<BlogModel>> _fetchBlogs({int page = 1, int limit = 20}) async {
    final data = await _api.get(ApiEndpoints.blogs, query: {
      'page': page,
      'limit': limit,
    }) as Map<String, dynamic>;
    final root = (data['data'] is Map<String, dynamic>)
        ? data['data'] as Map<String, dynamic>
        : data;
    final items = (root['blogs'] ?? root['data'] ?? <dynamic>[]) as List<dynamic>;
    return items.map((e) => BlogModel.fromJson(e as Map<String, dynamic>)).toList();
  }
}
