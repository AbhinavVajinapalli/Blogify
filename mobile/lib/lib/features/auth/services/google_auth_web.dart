import 'dart:html' as html;
import 'dart:js_util' as js_util;
import 'package:flutter/foundation.dart';

/// Alternative Google Sign-In implementation for Flutter Web
/// Uses the Google Identity Services (GIS) JavaScript library directly
/// to avoid popup blocker and COOP issues with google_sign_in package
class GoogleAuthWeb {
  static const String clientId =
      '611469724829-1bsfbegjfvv7rm18u61fcjeprip5gdgv.apps.googleusercontent.com';

  /// Initialize Google Sign-In button
  /// This creates a native Google Sign-In button that handles the OAuth flow
  static Future<Map<String, dynamic>?> signInWithPopup() async {
    if (!kIsWeb) {
      throw UnsupportedError('This method only works on web');
    }

    try {
      // Load Google Identity Services script if not already loaded
      await _loadGoogleScript();

      // Create a hidden container for the button
      final container = html.document.getElementById('g_id_signin_container');
      if (container != null) {
        container.remove();
      }

      final newContainer = html.DivElement()
        ..id = 'g_id_signin_container'
        ..style.position = 'fixed'
        ..style.top = '-9999px'
        ..style.left = '-9999px';

      html.document.body?.append(newContainer);

      // Create a promise to handle the callback
      final completer = Future<Map<String, dynamic>?>.delayed(
        const Duration(seconds: 30),
        () => null,
      );

      // Initialize Google Sign-In
      final google = js_util.getProperty(html.window, 'google');
      final accounts = js_util.getProperty(google, 'accounts');
      final id = js_util.getProperty(accounts, 'id');

      // Initialize with callback
      js_util.callMethod(
        id,
        'initialize',
        [
          js_util.jsify({
            'client_id': clientId,
            'callback': (response) {
              final credential = js_util.getProperty(response, 'credential');
              if (credential != null) {
                // Return the credential
                return {'idToken': credential};
              }
            },
            'ux_mode': 'popup',
            'auto_select': false,
          }),
        ],
      );

      // Trigger the sign-in popup
      js_util.callMethod(
        id,
        'prompt',
        [
          (notification) {
            final status = js_util.getProperty(notification, 'getMomentType');
            if (kDebugMode) {
              print('Google Sign-In status: $status');
            }
          }
        ],
      );

      return completer;
    } catch (e) {
      if (kDebugMode) {
        print('Google Sign-In error: $e');
      }
      return null;
    }
  }

  /// Load Google Identity Services script
  static Future<void> _loadGoogleScript() async {
    // Check if already loaded
    if (html.document.querySelector('script[src*="accounts.google.com"]') !=
        null) {
      return;
    }

    final script = html.ScriptElement()
      ..src = 'https://accounts.google.com/gsi/client'
      ..async = true
      ..defer = true;

    html.document.head?.append(script);

    // Wait for script to load
    await script.onLoad.first;
  }

  /// Alternative: Use redirect flow instead of popup
  static void signInWithRedirect() {
    if (!kIsWeb) {
      throw UnsupportedError('This method only works on web');
    }

    final currentUrl = html.window.location.href;
    final redirectUri =
        '${html.window.location.origin}${html.window.location.pathname}';

    final authUrl = Uri.https('accounts.google.com', '/o/oauth2/v2/auth', {
      'client_id': clientId,
      'redirect_uri': redirectUri,
      'response_type': 'token id_token',
      'scope': 'email profile',
      'nonce': DateTime.now().millisecondsSinceEpoch.toString(),
      'state': currentUrl,
    });

    html.window.location.href = authUrl.toString();
  }

  /// Parse token from URL after redirect
  static Map<String, String>? parseRedirectResponse() {
    if (!kIsWeb) return null;

    final fragment = html.window.location.hash;
    if (fragment.isEmpty || !fragment.contains('id_token=')) {
      return null;
    }

    final params = Uri.splitQueryString(fragment.substring(1));
    final idToken = params['id_token'];
    final accessToken = params['access_token'];

    if (idToken != null) {
      // Clear the hash from URL
      html.window.history.replaceState(
        null,
        '',
        html.window.location.pathname + html.window.location.search,
      );

      return {
        'idToken': idToken,
        if (accessToken != null) 'accessToken': accessToken,
      };
    }

    return null;
  }
}
