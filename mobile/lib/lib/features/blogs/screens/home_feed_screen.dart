import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../widgets/app_loader.dart';
import '../../../widgets/blog_card.dart';
import '../../auth/controllers/auth_controller.dart';
import '../controllers/blog_controller.dart';

class HomeFeedScreen extends StatefulWidget {
  const HomeFeedScreen({super.key});

  @override
  State<HomeFeedScreen> createState() => _HomeFeedScreenState();
}

class _HomeFeedScreenState extends State<HomeFeedScreen> {
  final _searchCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();

  @override
  void initState() {
    super.initState();
    final blog = Get.find<BlogController>();
    _scrollCtrl.addListener(() {
      if (_scrollCtrl.position.pixels >= _scrollCtrl.position.maxScrollExtent - 200) {
        blog.fetchFeed();
      }
    });
    // Load initial feed
    Future.microtask(() => blog.fetchFeed(refresh: true));
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = Get.find<AuthController>();
    final blog = Get.find<BlogController>();

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.explore, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Explore Feed', style: TextStyle(fontSize: 18)),
                Text(
                  'Discover posts from all authors',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.normal),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () => Get.toNamed('/bookmarks'),
            icon: const Icon(Icons.bookmarks_outlined),
            tooltip: 'Bookmarks',
          ),
          IconButton(
            onPressed: () => Get.toNamed('/profile'),
            icon: const Icon(Icons.person_outline),
            tooltip: 'Profile',
          ),
          PopupMenuButton<String>(
            onSelected: (value) async {
              if (value == 'dashboard') {
                Get.toNamed('/dashboard');
              } else if (value == 'logout') {
                await auth.logout();
              }
            },
            itemBuilder: (_) => const [
              PopupMenuItem(
                value: 'dashboard',
                child: Row(
                  children: [
                    Icon(Icons.dashboard_outlined),
                    SizedBox(width: 12),
                    Text('Dashboard'),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout),
                    SizedBox(width: 12),
                    Text('Logout'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Get.toNamed('/blog-editor'),
        icon: const Icon(Icons.edit),
        label: const Text('Write'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search Bar
            Padding(
              padding: const EdgeInsets.all(16),
              child: TextField(
                controller: _searchCtrl,
                textInputAction: TextInputAction.search,
                onSubmitted: (value) {
                  blog.searchBlogs(value);
                },
                decoration: InputDecoration(
                  hintText: 'Search posts by title or tag...',
                  prefixIcon: const Icon(Icons.search),
                  suffixIcon: _searchCtrl.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear),
                          onPressed: () {
                            _searchCtrl.clear();
                            blog.searchBlogs('');
                            setState(() {});
                          },
                        )
                      : null,
                ),
                onChanged: (_) => setState(() {}),
              ),
            ),
            
            // Feed Content
            Expanded(
              child: Obx(() {
                if (blog.isLoading.value && blog.blogs.isEmpty) {
                  return const AppLoader(message: 'Loading posts...');
                }
                if (blog.blogs.isEmpty) {
                  return Center(
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
                          'No posts found',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                color: Colors.grey[600],
                              ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _searchCtrl.text.isNotEmpty
                              ? 'Try adjusting your search'
                              : 'Be the first to write!',
                          style: TextStyle(color: Colors.grey[500]),
                        ),
                        const SizedBox(height: 24),
                        FilledButton.icon(
                          onPressed: () => Get.toNamed('/blog-editor'),
                          icon: const Icon(Icons.add),
                          label: const Text('Create Post'),
                        ),
                      ],
                    ),
                  );
                }
                return RefreshIndicator(
                  onRefresh: () => blog.fetchFeed(refresh: true),
                  child: ListView.builder(
                    controller: _scrollCtrl,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: blog.blogs.length + (blog.isPaginationLoading.value ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index >= blog.blogs.length) {
                        return const Padding(
                          padding: EdgeInsets.all(16),
                          child: Center(child: CircularProgressIndicator()),
                        );
                      }
                      final item = blog.blogs[index];
                      return BlogCard(
                        blog: item,
                        onTap: () => Get.toNamed('/blog/${item.id}'),
                        onLike: () => blog.likeUnlike(item.id),
                      );
                    },
                  ),
                );
              }),
            ),
          ],
        ),
      ),
    );
  }
}
