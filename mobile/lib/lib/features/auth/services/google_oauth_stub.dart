/// Stub for non-web platforms
class GoogleOAuthWeb {
  static void signInWithRedirect() {
    throw UnsupportedError('Redirect flow only works on web');
  }

  static Map<String, String>? checkForRedirectResponse() {
    return null;
  }

  static void clearState() {}
}
