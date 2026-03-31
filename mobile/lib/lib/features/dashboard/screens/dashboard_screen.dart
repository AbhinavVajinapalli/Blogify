import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../blogs/controllers/blog_controller.dart';
import '../../blogs/screens/create_edit_blog_screen.dart';
import '../../auth/controllers/auth_controller.dart';
import 'settings_screen.dart';
import '../controllers/dashboard_controller.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final dashboard = Get.find<DashboardController>();
    final blog = Get.find<BlogController>();
    final auth = Get.find<AuthController>();

    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Dashboard', style: TextStyle(fontSize: 18)),
            Text(
              'Manage your content',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.normal),
            ),
          ],
        ),
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () => Get.toNamed('/home'),
            icon: const Icon(Icons.explore_outlined),
            tooltip: 'Explore Feed',
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            UserAccountsDrawerHeader(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Theme.of(context).colorScheme.primary,
                    Theme.of(context).colorScheme.secondary,
                  ],
                ),
              ),
              accountName: Text(auth.user.value?.name ?? 'User'),
              accountEmail: Text(auth.user.value?.email ?? ''),
              currentAccountPicture: CircleAvatar(
                backgroundColor: Colors.white,
                backgroundImage: auth.user.value?.profilePicture != null
                    ? NetworkImage(auth.user.value!.profilePicture!)
                    : null,
                child: auth.user.value?.profilePicture == null
                    ? Icon(Icons.person, color: Theme.of(context).colorScheme.primary)
                    : null,
              ),
            ),
            ListTile(
              leading: const Icon(Icons.feed_outlined),
              title: const Text('Explore Feed'),
              subtitle: const Text('Discover all posts'),
              onTap: () {
                Navigator.pop(context);
                Get.toNamed('/home');
              },
            ),
            ListTile(
              leading: const Icon(Icons.add_box_outlined),
              title: const Text('Create Post'),
              onTap: () {
                Navigator.pop(context);
                dashboard.setSection(0);
              },
            ),
            ListTile(
              leading: const Icon(Icons.article_outlined),
              title: const Text('My Posts'),
              subtitle: const Text('Manage your content'),
              onTap: () {
                Navigator.pop(context);
                dashboard.setSection(1);
              },
            ),
            ListTile(
              leading: const Icon(Icons.person_outline),
              title: const Text('My Profile'),
              onTap: () {
                Navigator.pop(context);
                Get.toNamed('/profile');
              },
            ),
            ListTile(
              leading: const Icon(Icons.bookmarks_outlined),
              title: const Text('Bookmarks'),
              onTap: () {
                Navigator.pop(context);
                Get.toNamed('/bookmarks');
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.settings_outlined),
              title: const Text('Settings'),
              onTap: () {
                Navigator.pop(context);
                dashboard.setSection(2);
              },
            ),
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Logout'),
              onTap: () async {
                Navigator.pop(context);
                await auth.logout();
              },
            ),
          ],
        ),
      ),
      body: Obx(() {
        final idx = dashboard.selectedIndex.value;
        if (idx == 0) {
          return const CreateEditBlogScreen();
        }
        if (idx == 1) {
          return RefreshIndicator(
            onRefresh: () => blog.fetchFeed(refresh: true),
            child: Obx(() {
              final userBlogs = blog.blogs.where((b) => b.author.id == auth.user.value?.id).toList();
              
              if (userBlogs.isEmpty) {
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
                        'No posts yet',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Colors.grey[600],
                            ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Create your first blog post',
                        style: TextStyle(color: Colors.grey[500]),
                      ),
                      const SizedBox(height: 24),
                      FilledButton.icon(
                        onPressed: () => dashboard.setSection(0),
                        icon: const Icon(Icons.add),
                        label: const Text('Create Post'),
                      ),
                    ],
                  ),
                );
              }
              
              return ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Your Posts',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        Text(
                          '${userBlogs.length} ${userBlogs.length == 1 ? 'post' : 'posts'}',
                          style: TextStyle(color: Colors.grey[600]),
                        ),
                      ],
                    ),
                  ),
                  ...userBlogs.map(
                    (item) => Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: InkWell(
                        onTap: () => Get.toNamed('/blog/${item.id}'),
                        borderRadius: BorderRadius.circular(12),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      item.title,
                                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                            fontWeight: FontWeight.bold,
                                          ),
                                    ),
                                  ),
                                  PopupMenuButton<String>(
                                    onSelected: (value) {
                                      if (value == 'edit') {
                                        Get.toNamed('/blog-editor', arguments: item);
                                      } else if (value == 'delete') {
                                        Get.dialog(
                                          AlertDialog(
                                            title: const Text('Delete Post'),
                                            content: const Text('Are you sure you want to delete this post?'),
                                            actions: [
                                              TextButton(
                                                onPressed: () => Get.back(),
                                                child: const Text('Cancel'),
                                              ),
                                              FilledButton(
                                                onPressed: () {
                                                  blog.removeBlog(item.id);
                                                  Get.back();
                                                },
                                                child: const Text('Delete'),
                                              ),
                                            ],
                                          ),
                                        );
                                      }
                                    },
                                    itemBuilder: (_) => [
                                      const PopupMenuItem(value: 'edit', child: Text('Edit')),
                                      const PopupMenuItem(value: 'delete', child: Text('Delete')),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                item.content,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(color: Colors.grey[600]),
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  Icon(Icons.favorite_border, size: 16, color: Colors.grey[500]),
                                  const SizedBox(width: 4),
                                  Text('${item.likesCount}', style: TextStyle(color: Colors.grey[600])),
                                  const SizedBox(width: 16),
                                  Icon(Icons.comment_outlined, size: 16, color: Colors.grey[500]),
                                  const SizedBox(width: 4),
                                  Text('${item.commentsCount}', style: TextStyle(color: Colors.grey[600])),
                                  const Spacer(),
                                  if (item.tags.isNotEmpty)
                                    Chip(
                                      label: Text(item.tags.first),
                                      labelStyle: const TextStyle(fontSize: 12),
                                      visualDensity: VisualDensity.compact,
                                    ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              );
            }),
          );
        }
        return const SettingsScreen();
      }),
      bottomNavigationBar: Obx(
        () => NavigationBar(
          selectedIndex: dashboard.selectedIndex.value,
          onDestinationSelected: dashboard.setSection,
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.add_box_outlined),
              selectedIcon: Icon(Icons.add_box),
              label: 'Create',
            ),
            NavigationDestination(
              icon: Icon(Icons.article_outlined),
              selectedIcon: Icon(Icons.article),
              label: 'Posts',
            ),
            NavigationDestination(
              icon: Icon(Icons.settings_outlined),
              selectedIcon: Icon(Icons.settings),
              label: 'Settings',
            ),
          ],
        ),
      ),
    );
  }
}
