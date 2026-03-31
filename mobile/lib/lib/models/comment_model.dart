import 'user_model.dart';

class CommentModel {
  CommentModel({
    required this.id,
    required this.blogId,
    required this.content,
    required this.user,
    this.createdAt,
  });

  final String id;
  final String blogId;
  final String content;
  final UserModel user;
  final String? createdAt;

  factory CommentModel.fromJson(Map<String, dynamic> json) {
    return CommentModel(
      id: (json['_id'] ?? json['id'] ?? '').toString(),
      blogId: (json['blog'] ?? json['blogId'] ?? '').toString(),
      content: (json['content'] ?? '').toString(),
      user: UserModel.fromJson((json['user'] ?? <String, dynamic>{}) as Map<String, dynamic>),
      createdAt: json['createdAt']?.toString(),
    );
  }
}
