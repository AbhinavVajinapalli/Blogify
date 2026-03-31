import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../models/blog_model.dart';
import '../../../models/user_model.dart';
import '../../../widgets/blog_card.dart';
import '../../blogs/controllers/blog_controller.dart';

class UserBlogScreen extends StatefulWidget {
  const UserBlogScreen({super.key});

  @override
  State<UserBlogScreen> createState() => _UserBlogScreenState();
}

class _UserBlogScreenState extends State<UserBlogScreen> {
  final BlogController _blogController = Get.find<BlogController>();
  UserModel? _user;
  List<BlogModel> _userBlogs = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserBlog();
  }

  void _loadUserBlog() async {
    // Get user ID from route parameters
    final userId = Get.parameters['userId'];
    final userName = Get.parameters['userName'];
    
    if (userId == null) {
      Get.back();
      return;
    }

    setState(() => _isLoading = true);

    // Load all blogs and filter by user
    await _blogController.fetchFeed(refresh: true);
    
    final userPosts = _blogController.blogs.where((blog) => blog.author.id == userId).toList();
    
    setState(() {
      _userBlogs = userPosts;
      if (userPosts.isNotEmpty) {
        _user = userPosts.first.author;
      } else if (userName != null) {
        // Create a placeholder user object if no posts found
        _user = UserModel(id: userId, name: userName, email: '');
      }
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Header
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.secondary,
                    ],
                  ),
                ),
                child: _isLoading
                    ? const Center(child: CircularProgressIndicator(color: Colors.white))
                    : Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CircleAvatar(
                            radius: 40,
                            backgroundColor: Colors.white,
                            child: Text(
                              _user?.name.substring(0, 1).toUpperCase() ?? '?',
                              style: TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            _user?.name ?? 'User',
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${_userBlogs.length} ${_userBlogs.length == 1 ? 'Post' : 'Posts'}',
                            style: const TextStyle(
                              fontSize: 14,
                              color: Colors.white70,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
          ),

          // Posts
          if (_isLoading)
            const SliverFillRemaining(
              child: Center(child: CircularProgressIndicator()),
            )
          else if (_userBlogs.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.article_outlined,
                      size: 80,
                      color: Colors.grey[300],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No posts yet',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            color: Colors.grey[600],
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${_user?.name ?? 'This user'} hasn\'t published any posts',
                      style: TextStyle(color: Colors.grey[500]),
                    ),
                  ],
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: BlogCard(blog: _userBlogs[index]),
                    );
                  },
                  childCount: _userBlogs.length,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
