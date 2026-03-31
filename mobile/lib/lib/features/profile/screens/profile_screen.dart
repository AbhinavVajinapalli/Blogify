import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../blogs/controllers/blog_controller.dart';
import '../../../widgets/app_loader.dart';
import '../../../widgets/blog_card.dart';
import '../../auth/controllers/auth_controller.dart';
import '../controllers/profile_controller.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    Get.find<ProfileController>().fetchProfile();
  }

  @override
  Widget build(BuildContext context) {
    final profile = Get.find<ProfileController>();
    final auth = Get.find<AuthController>();
    
    return Scaffold(
      body: Obx(() {
        if (profile.isLoading.value && profile.profile.value == null) {
          return const AppLoader(message: 'Loading profile');
        }
        final user = profile.profile.value;
        if (user == null) {
          return const Center(child: Text('Profile not found'));
        }
        
        return CustomScrollView(
          slivers: [
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
                  child: SafeArea(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircleAvatar(
                          radius: 50,
                          backgroundColor: Colors.white,
                          backgroundImage: user.profilePicture != null
                              ? NetworkImage(user.profilePicture!)
                              : null,
                          child: user.profilePicture == null
                              ? Icon(Icons.person, size: 50, color: Theme.of(context).colorScheme.primary)
                              : null,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          user.name,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        if (user.bio != null && user.bio!.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 8),
                            child: Text(
                              user.bio!,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.9),
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
              actions: [
                IconButton(
                  onPressed: () => Get.toNamed('/settings'),
                  icon: const Icon(Icons.settings_outlined),
                  tooltip: 'Settings',
                ),
              ],
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Stats Row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _StatCard(
                          label: 'Posts',
                          value: '${profile.myPosts.length}',
                          icon: Icons.article,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                        _StatCard(
                          label: 'Likes',
                          value: '${profile.myPosts.fold<int>(0, (sum, post) => sum + post.likesCount)}',
                          icon: Icons.favorite,
                          color: Colors.red,
                        ),
                        _StatCard(
                          label: 'Comments',
                          value: '${profile.myPosts.fold<int>(0, (sum, post) => sum + post.commentsCount)}',
                          icon: Icons.comment,
                          color: Colors.blue,
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Public Site Link
                    if (user.siteSlug != null && user.siteSlug!.isNotEmpty)
                      Card(
                        child: ListTile(
                          leading: Icon(Icons.public, color: Theme.of(context).colorScheme.primary),
                          title: const Text('Public Site'),
                          subtitle: Text('/${user.siteSlug}'),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                          onTap: () => Get.toNamed('/public/${user.siteSlug}'),
                        ),
                      ),
                    
                    const SizedBox(height: 24),
                    
                    // My Posts Section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'My Posts',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        if (profile.myPosts.isNotEmpty)
                          TextButton.icon(
                            onPressed: () => Get.toNamed('/dashboard'),
                            icon: const Icon(Icons.edit),
                            label: const Text('Manage'),
                          ),
                      ],
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
            
            // Posts List
            if (profile.myPosts.isEmpty)
              SliverToBoxAdapter(
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(40),
                    child: Column(
                      children: [
                        Icon(
                          Icons.article_outlined,
                          size: 80,
                          color: Colors.grey[300],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No posts yet',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Start writing your first blog post',
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
                  ),
                ),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final post = profile.myPosts[index];
                      return BlogCard(
                        blog: post,
                        onTap: () => Get.toNamed('/blog/${post.id}'),
                        showDelete: true,
                        onDelete: () async {
                          await Get.find<BlogController>().removeBlog(post.id);
                          profile.myPosts.removeWhere((e) => e.id == post.id);
                        },
                      );
                    },
                    childCount: profile.myPosts.length,
                  ),
                ),
              ),
            
            const SliverToBoxAdapter(child: SizedBox(height: 24)),
          ],
        );
      }),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(icon, color: color, size: 28),
              const SizedBox(height: 8),
              Text(
                value,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
