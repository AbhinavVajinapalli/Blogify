import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../widgets/app_loader.dart';
import '../../comments/controllers/comment_controller.dart';
import '../controllers/blog_controller.dart';

class BlogDetailsScreen extends StatefulWidget {
  const BlogDetailsScreen({super.key});

  @override
  State<BlogDetailsScreen> createState() => _BlogDetailsScreenState();
}

class _BlogDetailsScreenState extends State<BlogDetailsScreen> {
  final _commentCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    final id = (Get.parameters['id'] ?? '').toString();
    if (id.isNotEmpty) {
      Get.find<BlogController>().fetchDetails(id);
      Get.find<CommentController>().fetchComments(id);
    }
  }

  @override
  void dispose() {
    _commentCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final blog = Get.find<BlogController>();
    final comments = Get.find<CommentController>();
    final id = (Get.parameters['id'] ?? '').toString();

    return Scaffold(
      appBar: AppBar(title: const Text('Blog details')),
      body: Obx(() {
        if (blog.isLoading.value || blog.selectedBlog.value == null) {
          return const AppLoader(message: 'Loading article');
        }
        final item = blog.selectedBlog.value!;
        return SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              final horizontal = constraints.maxWidth > 700 ? 32.0 : 16.0;
              return SingleChildScrollView(
                padding: EdgeInsets.symmetric(horizontal: horizontal, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item.title, style: Theme.of(context).textTheme.headlineSmall),
                    const SizedBox(height: 8),
                    Text('By ${item.author.name} · ${item.views} views'),
                    const SizedBox(height: 16),
                    Text(item.content),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 8,
                      children: item.tags.map((e) => Chip(label: Text(e))).toList(),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        OutlinedButton.icon(
                          onPressed: () => blog.likeUnlike(item.id),
                          icon: Icon(item.isLiked ? Icons.favorite : Icons.favorite_border),
                          label: Text('Like (${item.likes})'),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton.icon(
                          onPressed: () => Get.toNamed('/blog-editor', arguments: item),
                          icon: const Icon(Icons.edit_outlined),
                          label: const Text('Edit'),
                        ),
                      ],
                    ),
                    const Divider(height: 32),
                    Text('Comments', style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _commentCtrl,
                            decoration: const InputDecoration(hintText: 'Add a comment'),
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            final text = _commentCtrl.text.trim();
                            if (text.isNotEmpty) {
                              comments.addComment(id, text);
                              _commentCtrl.clear();
                            }
                          },
                          icon: const Icon(Icons.send),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Obx(
                      () => Column(
                        children: comments.comments
                            .map(
                              (c) => ListTile(
                                title: Text(c.user.name),
                                subtitle: Text(c.content),
                                trailing: IconButton(
                                  onPressed: () => comments.deleteComment(id, c.id),
                                  icon: const Icon(Icons.delete_outline),
                                ),
                              ),
                            )
                            .toList(),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        );
      }),
    );
  }
}
