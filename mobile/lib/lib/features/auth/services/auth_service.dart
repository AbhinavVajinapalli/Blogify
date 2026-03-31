import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../../../core/constants/api_endpoints.dart';
import '../../../core/services/api_service.dart';
import '../../../models/user_model.dart';
import 'google_oauth_web.dart' if (dart.library.io) 'google_oauth_stub.dart';

class AuthService {
  final ApiService _api = ApiService.instance;
  static const String _defaultWebClientId =
      '611469724829-1bsfbegjfvv7rm18u61fcjeprip5gdgv.apps.googleusercontent.com';
  static const String _webClientId = String.fromEnvironment(
    'GOOGLE_WEB_CLIENT_ID',
    defaultValue: _defaultWebClientId,
  );

  late final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: <String>['email', 'profile'],
    clientId: kIsWeb ? _webClientId : null,
    // Disable serverClientId on web to avoid COOP issues
    serverClientId: kIsWeb ? null : _webClientId,
  );

  Future<Map<String, dynamic>> login({required String email, required String password}) async {
    final data = await _api.post(ApiEndpoints.login, data: {
      'email': email,
      'password': password,
    }) as Map<String, dynamic>;
    return data;
  }

  Future<Map<String, dynamic>> signup({required String name, required String email, required String password}) async {
    final data = await _api.post(ApiEndpoints.signup, data: {
      'name': name,
      'email': email,
      'password': password,
    }) as Map<String, dynamic>;
    return data;
  }

  Future<Map<String, dynamic>> googleLogin() async {
    if (kIsWeb) {
      // On web, use redirect-based flow to avoid COOP/popup issues
      // This will redirect the entire page to Google
      GoogleOAuthWeb.signInWithRedirect();
      
      // This function won't return as the page will redirect
      // The actual login completion happens in handleGoogleRedirect()
      throw ApiException('Redirecting to Google...');
    }

    // Mobile implementation
    if (_webClientId.isEmpty) {
      throw ApiException(
        'Google login is not configured. Please check your configuration.',
      );
    }

    final account = await _googleSignIn.signIn();
    if (account == null) {
      throw ApiException('Google sign-in cancelled');
    }

    final auth = await account.authentication;
    final idToken = auth.idToken;
    final accessToken = auth.accessToken;

    final attempts = <Map<String, String>>[];
    if (idToken != null && idToken.isNotEmpty) {
      attempts.add({'idToken': idToken});
      attempts.add({'token': idToken});
      attempts.add({'id_token': idToken});
    }

    if (accessToken != null && accessToken.isNotEmpty) {
      attempts.add({'accessToken': accessToken});
      attempts.add({'token': accessToken});
      attempts.add({'access_token': accessToken});
    }

    if (attempts.isEmpty) {
      throw ApiException('Google token not found');
    }

    ApiException? lastApiError;
    for (final payload in attempts) {
      try {
        final data = await _api.post(ApiEndpoints.google, data: payload) as Map<String, dynamic>;
        return data;
      } on ApiException catch (e) {
        lastApiError = e;
        if (e.statusCode != null && e.statusCode! >= 500) {
          rethrow;
        }
      }
    }

    throw lastApiError ?? ApiException('Google authentication failed');
  }

  /// Handle Google OAuth redirect (web only)
  /// Call this on app startup to check if we returned from Google OAuth
  Future<Map<String, dynamic>?> handleGoogleRedirect() async {
    if (!kIsWeb) return null;

    final tokens = GoogleOAuthWeb.checkForRedirectResponse();
    if (tokens == null) return null;

    // We have tokens from Google redirect, authenticate with backend
    final attempts = <Map<String, String>>[];
    final idToken = tokens['idToken'];
    final accessToken = tokens['accessToken'];

    if (idToken != null && idToken.isNotEmpty) {
      attempts.add({'idToken': idToken});
      attempts.add({'token': idToken});
      attempts.add({'id_token': idToken});
    }

    if (accessToken != null && accessToken.isNotEmpty) {
      attempts.add({'accessToken': accessToken});
      attempts.add({'token': accessToken});
      attempts.add({'access_token': accessToken});
    }

    if (attempts.isEmpty) {
      throw ApiException('No valid Google tokens available');
    }

    ApiException? lastApiError;
    for (final payload in attempts) {
      try {
        final data = await _api.post(ApiEndpoints.google, data: payload) as Map<String, dynamic>;
        return data;
      } on ApiException catch (e) {
        lastApiError = e;
        if (e.statusCode != null && e.statusCode! >= 500) {
          rethrow;
        }
      }
    }

    throw lastApiError ?? ApiException('Google authentication failed');
  }

  Future<UserModel> fetchCurrentUser() async {
    final data = await _api.get(ApiEndpoints.me) as Map<String, dynamic>;
    final root = (data['data'] is Map<String, dynamic>)
        ? data['data'] as Map<String, dynamic>
        : data;
    return UserModel.fromJson((root['user'] ?? root) as Map<String, dynamic>);
  }
}
