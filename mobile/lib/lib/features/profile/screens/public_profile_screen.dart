import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../widgets/app_loader.dart';
import '../../../widgets/blog_card.dart';
import '../controllers/profile_controller.dart';

class PublicProfileScreen extends StatefulWidget {
  const PublicProfileScreen({super.key});

  @override
  State<PublicProfileScreen> createState() => _PublicProfileScreenState();
}

class _PublicProfileScreenState extends State<PublicProfileScreen> {
  @override
  void initState() {
    super.initState();
    final slug = (Get.parameters['slug'] ?? '').toString();
    if (slug.isNotEmpty) {
      Get.find<ProfileController>().fetchPublicBySlug(slug);
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = Get.find<ProfileController>();
    return Scaffold(
      appBar: AppBar(title: const Text('Creator page')),
      body: Obx(() {
        if (profile.isLoading.value && profile.publicProfile.value == null) {
          return const AppLoader(message: 'Loading creator page');
        }

        final user = profile.publicProfile.value;
        if (user == null) {
          return const Center(child: Text('Creator page not found'));
        }

        return ListView(
          padding: const EdgeInsets.all(12),
          children: [
            ListTile(
              leading: CircleAvatar(backgroundImage: user.profilePicture != null ? NetworkImage(user.profilePicture!) : null),
              title: Text(user.siteName ?? user.name),
              subtitle: Text(user.bio ?? 'No bio'),
            ),
            const SizedBox(height: 12),
            Text('Posts', style: Theme.of(context).textTheme.titleMedium),
            ...profile.publicPosts.map(
              (b) => BlogCard(
                blog: b,
                onTap: () => Get.toNamed('/blog/${b.id}'),
              ),
            ),
          ],
        );
      }),
    );
  }
}
