import 'package:get/get.dart';

import '../../../models/blog_model.dart';
import '../../../models/user_model.dart';
import '../../auth/controllers/auth_controller.dart';
import '../services/profile_service.dart';

class ProfileController extends GetxController {
  final ProfileService _service = ProfileService();

  final Rxn<UserModel> profile = Rxn<UserModel>();
  final Rxn<UserModel> publicProfile = Rxn<UserModel>();
  final RxList<BlogModel> myPosts = <BlogModel>[].obs;
  final RxList<BlogModel> publicPosts = <BlogModel>[].obs;
  final RxBool isLoading = false.obs;

  Future<void> fetchProfile() async {
    isLoading.value = true;
    try {
      profile.value = await _service.fetchMe();
      myPosts.value = await _service.fetchMyPosts();
    } catch (e) {
      Get.snackbar('Profile', e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> updateProfile(Map<String, dynamic> payload) async {
    isLoading.value = true;
    try {
      final updated = await _service.updateProfile(payload);
      profile.value = updated;
      final auth = Get.find<AuthController>();
      auth.user.value = updated;
      Get.snackbar('Success', 'Profile updated');
    } catch (e) {
      Get.snackbar('Update failed', e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> deleteAccount() async {
    isLoading.value = true;
    try {
      await _service.deleteAccount();
      await Get.find<AuthController>().logout();
      Get.snackbar('Account', 'Account deleted');
    } catch (e) {
      Get.snackbar('Delete failed', e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> fetchPublicBySlug(String slug) async {
    isLoading.value = true;
    try {
      final data = await _service.fetchPublicBySlug(slug);
      publicProfile.value = UserModel.fromJson((data['profile'] ?? data['user'] ?? <String, dynamic>{}) as Map<String, dynamic>);
      final items = (data['blogs'] ?? <dynamic>[]) as List<dynamic>;
      publicPosts.value = items.map((e) => BlogModel.fromJson(e as Map<String, dynamic>)).toList();
    } catch (e) {
      Get.snackbar('Public profile', e.toString());
    } finally {
      isLoading.value = false;
    }
  }
}
