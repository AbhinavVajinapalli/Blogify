import 'dart:html' as html;
import 'package:flutter/foundation.dart';

/// Google OAuth redirect-based authentication for Flutter web
/// This avoids popup blockers and COOP issues entirely
class GoogleOAuthWeb {
  static const String clientId =
      '611469724829-1bsfbegjfvv7rm18u61fcjeprip5gdgv.apps.googleusercontent.com';

  /// Initiate Google Sign-In with redirect flow
  /// This redirects the entire page to Google, avoiding popup issues
  static void signInWithRedirect() {
    if (!kIsWeb) {
      throw UnsupportedError('This method only works on web');
    }

    final currentUrl = html.window.location.href;
    final redirectUri = '${html.window.location.origin}/';

    // Store the current route to return to after auth
    html.window.localStorage['pre_auth_route'] = currentUrl;

    final authUrl = Uri.https('accounts.google.com', '/o/oauth2/v2/auth', {
      'client_id': clientId,
      'redirect_uri': redirectUri,
      'response_type': 'id_token token',
      'scope': 'email profile',
      'nonce': DateTime.now().millisecondsSinceEpoch.toString(),
      'state': 'google_oauth',
    });

    // Redirect to Google
    html.window.location.href = authUrl.toString();
  }

  /// Check if we just returned from Google OAuth redirect
  /// Returns the tokens if found, null otherwise
  static Map<String, String>? checkForRedirectResponse() {
    if (!kIsWeb) return null;

    final fragment = html.window.location.hash;
    if (fragment.isEmpty || !fragment.contains('id_token=')) {
      return null;
    }

    // Parse the fragment
    final params = Uri.splitQueryString(fragment.substring(1));
    final idToken = params['id_token'];
    final accessToken = params['access_token'];
    final state = params['state'];

    // Verify this is from our Google OAuth flow
    if (state != 'google_oauth' || idToken == null) {
      return null;
    }

    // Clear the hash from URL
    final pathname = html.window.location.pathname ?? '/';
    final search = html.window.location.search ?? '';
    html.window.history.replaceState(
      null,
      '',
      pathname + search,
    );

    // Clear stored route
    html.window.localStorage.remove('pre_auth_route');

    return {
      'idToken': idToken,
      if (accessToken != null) 'accessToken': accessToken,
    };
  }

  /// Clear any stored OAuth state
  static void clearState() {
    if (!kIsWeb) return;
    html.window.localStorage.remove('pre_auth_route');
  }
}
