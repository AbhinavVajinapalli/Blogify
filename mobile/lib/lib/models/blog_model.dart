import 'user_model.dart';

class BlogModel {
  BlogModel({
    required this.id,
    required this.title,
    required this.content,
    required this.author,
    required this.tags,
    this.imageUrl,
    this.likes = 0,
    this.views = 0,
    this.commentsCount = 0,
    this.createdAt,
    this.updatedAt,
    this.isLiked = false,
    this.isBookmarked = false,
  });

  final String id;
  final String title;
  final String content;
  final UserModel author;
  final List<String> tags;
  final String? imageUrl;
  final int likes;
  final int views;
  final int commentsCount;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final bool isLiked;
  final bool isBookmarked;

  // Getters for compatibility
  int get likesCount => likes;

  factory BlogModel.fromJson(Map<String, dynamic> json) {
    final likesRaw = json['likesCount'] ?? json['likes'] ?? 0;
    final bookmarkRaw = json['bookmarks'];
    final viewsRaw = json['viewCount'] ?? json['views'] ?? 0;
    final commentsRaw = json['commentsCount'] ?? json['comments'] ?? 0;

    final likesCount = likesRaw is List<dynamic>
      ? likesRaw.length
      : (likesRaw is int ? likesRaw : int.tryParse(likesRaw.toString()) ?? 0);

    final bookmarkCount = bookmarkRaw is List<dynamic>
      ? bookmarkRaw.length
      : (bookmarkRaw is int ? bookmarkRaw : int.tryParse((bookmarkRaw ?? 0).toString()) ?? 0);

    final commentsCountValue = commentsRaw is List<dynamic>
      ? commentsRaw.length
      : (commentsRaw is int ? commentsRaw : int.tryParse(commentsRaw.toString()) ?? 0);

    return BlogModel(
      id: (json['_id'] ?? json['id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      content: (json['content'] ?? '').toString(),
      author: UserModel.fromJson((json['author'] ?? <String, dynamic>{}) as Map<String, dynamic>),
      tags: (json['tags'] as List<dynamic>? ?? <dynamic>[]).map((e) => e.toString()).toList(),
      imageUrl: json['imageUrl']?.toString(),
      likes: likesCount,
      views: viewsRaw is int ? viewsRaw : int.tryParse(viewsRaw.toString()) ?? 0,
      commentsCount: commentsCountValue,
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt'].toString()) : null,
      updatedAt: json['updatedAt'] != null ? DateTime.tryParse(json['updatedAt'].toString()) : null,
      isLiked: (json['isLiked'] ?? false) as bool,
      isBookmarked: (json['isBookmarked'] ?? (bookmarkCount > 0)) as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'content': content,
      'tags': tags,
      'imageUrl': imageUrl,
    };
  }
}
