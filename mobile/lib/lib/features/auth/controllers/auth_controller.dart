import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../core/services/storage_service.dart';
import '../../../models/user_model.dart';
import '../services/auth_service.dart';

class AuthController extends GetxController {
  final AuthService _service = AuthService();

  final RxBool isLoading = false.obs;
  final RxBool isInitializing = false.obs;
  final Rxn<UserModel> user = Rxn<UserModel>();

  bool get isLoggedIn => StorageService.token != null && StorageService.token!.isNotEmpty;

  @override
  void onInit() {
    super.onInit();
    _checkGoogleRedirect();
    restoreSession();
  }

  /// Check if we returned from Google OAuth redirect
  Future<void> _checkGoogleRedirect() async {
    try {
      final data = await _service.handleGoogleRedirect();
      if (data != null) {
        // We have successful Google auth data
        final session = _extractSessionData(data);
        final token = (session['token'] ?? '').toString();
        final userJson = (session['user'] ?? <String, dynamic>{}) as Map<String, dynamic>;
        
        if (token.isNotEmpty) {
          await StorageService.saveToken(token);
          user.value = UserModel.fromJson(userJson);
          
          // Navigate to dashboard after successful Google sign-in
          Future.delayed(const Duration(milliseconds: 500), () {
            Get.offAllNamed('/dashboard');
            Get.snackbar(
              'Success',
              'Google login successful',
              snackPosition: SnackPosition.BOTTOM,
              backgroundColor: Colors.green.withOpacity(0.9),
              colorText: Colors.white,
            );
          });
        }
      }
    } catch (e) {
      // If Google auth failed, show error
      Get.snackbar(
        'Google Login Failed',
        _friendlyError(e),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.withOpacity(0.9),
        colorText: Colors.white,
        duration: const Duration(seconds: 6),
      );
    }
  }

  Future<void> restoreSession() async {
    if (!isLoggedIn) {
      return;
    }
    isInitializing.value = true;
    try {
      user.value = await _service.fetchCurrentUser();
    } catch (_) {
      await logout(redirect: false);
    } finally {
      isInitializing.value = false;
    }
  }

  Future<void> login(String email, String password) async {
    isLoading.value = true;
    try {
      final data = await _service.login(email: email, password: password);
      final session = _extractSessionData(data);
      final token = (session['token'] ?? '').toString();
      final userJson = (session['user'] ?? <String, dynamic>{}) as Map<String, dynamic>;
      if (token.isEmpty) {
        throw Exception('Invalid login response');
      }
      await StorageService.saveToken(token);
      user.value = UserModel.fromJson(userJson);
      Get.offAllNamed('/dashboard');
      Get.snackbar(
        'Success',
        'Logged in successfully',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.green.withOpacity(0.9),
        colorText: Colors.white,
      );
    } catch (e) {
      Get.snackbar(
        'Login Failed',
        _friendlyError(e),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.withOpacity(0.9),
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> signup(String name, String email, String password) async {
    isLoading.value = true;
    try {
      final data = await _service.signup(name: name, email: email, password: password);
      final session = _extractSessionData(data);
      final token = (session['token'] ?? '').toString();
      final userJson = (session['user'] ?? <String, dynamic>{}) as Map<String, dynamic>;
      if (token.isEmpty) {
        throw Exception('Invalid signup response');
      }
      await StorageService.saveToken(token);
      user.value = UserModel.fromJson(userJson);
      Get.offAllNamed('/dashboard');
      Get.snackbar(
        'Success',
        'Account created successfully',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.green.withOpacity(0.9),
        colorText: Colors.white,
      );
    } catch (e) {
      Get.snackbar(
        'Signup Failed',
        _friendlyError(e),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.withOpacity(0.9),
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> signInWithGoogle() async {
    isLoading.value = true;
    try {
      // On web, this will redirect to Google
      // On mobile, it will use the popup flow
      await _service.googleLogin();
      
      // This code won't execute on web (page redirects)
      // Only reaches here on mobile
      final data = await _service.googleLogin();
      final session = _extractSessionData(data);
      final token = (session['token'] ?? '').toString();
      final userJson = (session['user'] ?? <String, dynamic>{}) as Map<String, dynamic>;
      if (token.isEmpty) {
        throw Exception('Invalid Google auth response');
      }
      await StorageService.saveToken(token);
      user.value = UserModel.fromJson(userJson);
      Get.offAllNamed('/dashboard');
      Get.snackbar(
        'Success',
        'Google login successful',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.green.withOpacity(0.9),
        colorText: Colors.white,
      );
    } catch (e) {
      final errorMsg = _friendlyError(e);
      
      // Don't show error if we're redirecting
      if (errorMsg.contains('Redirecting')) {
        return;
      }
      
      // Show more detailed error for Google sign-in issues
      String title = 'Google Login Failed';
      String message = errorMsg;
      
      if (errorMsg.contains('cancelled')) {
        title = 'Sign-in Cancelled';
        message = 'You closed the Google sign-in window. Please try again and complete the sign-in process.';
      } else if (errorMsg.contains('popup') || errorMsg.contains('blocked')) {
        title = 'Popup Blocked';
        message = 'Please allow popups for this site and try again.';
      } else if (errorMsg.contains('Network') || errorMsg.contains('CORS')) {
        message = 'Network error. Please check your internet connection and try again.';
      }
      
      Get.snackbar(
        title,
        message,
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.withOpacity(0.9),
        colorText: Colors.white,
        duration: const Duration(seconds: 6),
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> logout({bool redirect = true}) async {
    await StorageService.clearToken();
    user.value = null;
    if (redirect) {
      Get.offAllNamed('/login');
    }
  }

  Map<String, dynamic> _extractSessionData(Map<String, dynamic> response) {
    final data = response['data'];
    if (data is Map<String, dynamic>) {
      return data;
    }
    return response;
  }

  String _friendlyError(Object error) {
    final text = error.toString();
    
    // Google-specific errors
    if (text.contains('unknown_reason') || text.contains('Error retrieving a token')) {
      return 'Google authentication failed. Please ensure your Google account is properly configured and try again.';
    }
    if (text.contains('popup_closed')) {
      return 'Sign-in was cancelled. Please try again and complete the sign-in process.';
    }
    if (text.contains('popup_blocked')) {
      return 'Popup was blocked. Please allow popups for this site and try again.';
    }
    if (text.contains('ClientException') || text.contains('Google sign-in cancelled')) {
      return 'Google sign-in was cancelled or failed. Please try again.';
    }
    if (text.contains('network') || text.contains('Network')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    if (text.contains('401') || text.contains('Unauthorized')) {
      return 'Invalid email or password. Please try again.';
    }
    if (text.contains('404') || text.contains('Not found')) {
      return 'Service not available. Please try again later.';
    }
    if (text.contains('500') || text.contains('Server error')) {
      return 'Server error. Please try again later.';
    }
    
    // Extract clean error message
    final normalized = text.startsWith('Exception: ') ? text.substring(11) : text;
    final firstLine = normalized.split('\n').first.trim();
    return firstLine.isEmpty ? 'Something went wrong. Please try again.' : firstLine;
  }
}
