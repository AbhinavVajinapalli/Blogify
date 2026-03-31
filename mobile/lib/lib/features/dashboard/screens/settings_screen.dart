import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../profile/controllers/profile_controller.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _nameCtrl = TextEditingController();
  final _bioCtrl = TextEditingController();
  final _pictureCtrl = TextEditingController();
  final _siteNameCtrl = TextEditingController();
  final _slugCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    final profile = Get.find<ProfileController>();
    profile.fetchProfile().then((_) {
      final user = profile.profile.value;
      if (user == null) {
        return;
      }
      _nameCtrl.text = user.name;
      _bioCtrl.text = user.bio ?? '';
      _pictureCtrl.text = user.profilePicture ?? '';
      _siteNameCtrl.text = user.siteName ?? '';
      _slugCtrl.text = user.siteSlug ?? '';
      setState(() {});
    });
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _bioCtrl.dispose();
    _pictureCtrl.dispose();
    _siteNameCtrl.dispose();
    _slugCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final profile = Get.find<ProfileController>();

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Profile settings', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              TextField(controller: _nameCtrl, decoration: const InputDecoration(labelText: 'Name')),
              const SizedBox(height: 10),
              TextField(controller: _bioCtrl, decoration: const InputDecoration(labelText: 'Bio')),
              const SizedBox(height: 10),
              TextField(controller: _pictureCtrl, decoration: const InputDecoration(labelText: 'Profile picture URL')),
              const SizedBox(height: 10),
              TextField(controller: _siteNameCtrl, decoration: const InputDecoration(labelText: 'Site name')),
              const SizedBox(height: 10),
              TextField(controller: _slugCtrl, decoration: const InputDecoration(labelText: 'Site slug')),
              const SizedBox(height: 16),
              Obx(
                () => FilledButton(
                  onPressed: profile.isLoading.value
                      ? null
                      : () => profile.updateProfile({
                            'name': _nameCtrl.text.trim(),
                            'bio': _bioCtrl.text.trim(),
                            'profilePicture': _pictureCtrl.text.trim(),
                            'siteName': _siteNameCtrl.text.trim(),
                            'siteSlug': _slugCtrl.text.trim(),
                          }),
                  child: profile.isLoading.value
                      ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2))
                      : const Text('Save settings'),
                ),
              ),
              const SizedBox(height: 28),
              Text('Danger zone', style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.red)),
              const SizedBox(height: 8),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
                onPressed: () => _confirmDelete(context, profile),
                icon: const Icon(Icons.delete_forever_outlined),
                label: const Text('Delete account'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _confirmDelete(BuildContext context, ProfileController profile) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete account?'),
        content: const Text('This action is permanent and cannot be undone.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete')),
        ],
      ),
    );

    if (confirmed == true) {
      await profile.deleteAccount();
    }
  }
}
