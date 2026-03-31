class UserModel {
  UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.bio,
    this.profilePicture,
    this.siteName,
    this.siteSlug,
  });

  final String id;
  final String name;
  final String email;
  final String? bio;
  final String? profilePicture;
  final String? siteName;
  final String? siteSlug;

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: (json['_id'] ?? json['id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      email: (json['email'] ?? '').toString(),
      bio: json['bio']?.toString(),
      profilePicture: json['profilePicture']?.toString(),
      siteName: json['siteName']?.toString(),
      siteSlug: json['siteSlug']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'bio': bio,
      'profilePicture': profilePicture,
      'siteName': siteName,
      'siteSlug': siteSlug,
    };
  }
}
