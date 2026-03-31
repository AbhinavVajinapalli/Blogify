import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../models/blog_model.dart';
import '../controllers/blog_controller.dart';

class CreateEditBlogScreen extends StatefulWidget {
  const CreateEditBlogScreen({super.key});

  @override
  State<CreateEditBlogScreen> createState() => _CreateEditBlogScreenState();
}

class _CreateEditBlogScreenState extends State<CreateEditBlogScreen> {
  final _titleCtrl = TextEditingController();
  final _contentCtrl = TextEditingController();
  final _tagsCtrl = TextEditingController();
  final _imageCtrl = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  BlogModel? editing;

  @override
  void initState() {
    super.initState();
    final arg = Get.arguments;
    if (arg is BlogModel) {
      editing = arg;
      _titleCtrl.text = arg.title;
      _contentCtrl.text = arg.content;
      _tagsCtrl.text = arg.tags.join(', ');
      _imageCtrl.text = arg.imageUrl ?? '';
    }
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _contentCtrl.dispose();
    _tagsCtrl.dispose();
    _imageCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final blog = Get.find<BlogController>();
    return Scaffold(
      appBar: AppBar(title: Text(editing == null ? 'Create post' : 'Edit post')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                TextFormField(
                  controller: _titleCtrl,
                  decoration: const InputDecoration(labelText: 'Title'),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Title required' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _contentCtrl,
                  maxLines: 8,
                  decoration: const InputDecoration(labelText: 'Content'),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Content required' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _tagsCtrl,
                  decoration: const InputDecoration(labelText: 'Tags (comma separated)'),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _imageCtrl,
                  decoration: const InputDecoration(labelText: 'Image URL'),
                ),
                const SizedBox(height: 20),
                Obx(
                  () => SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: blog.isLoading.value
                          ? null
                          : () {
                              if (!_formKey.currentState!.validate()) {
                                return;
                              }
                              blog.saveBlog(
                                id: editing?.id,
                                payload: {
                                  'title': _titleCtrl.text.trim(),
                                  'content': _contentCtrl.text.trim(),
                                  'tags': _tagsCtrl.text
                                      .split(',')
                                      .map((e) => e.trim())
                                      .where((e) => e.isNotEmpty)
                                      .toList(),
                                  'imageUrl': _imageCtrl.text.trim().isEmpty ? null : _imageCtrl.text.trim(),
                                },
                              );
                            },
                      child: blog.isLoading.value
                          ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2))
                          : Text(editing == null ? 'Publish' : 'Save changes'),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
