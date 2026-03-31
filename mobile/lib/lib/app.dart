import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'features/auth/controllers/auth_controller.dart';
import 'features/auth/screens/landing_screen.dart';
import 'features/auth/screens/login_screen.dart';
import 'features/auth/screens/signup_screen.dart';
import 'features/blogs/screens/blog_details_screen.dart';
import 'features/blogs/screens/create_edit_blog_screen.dart';
import 'features/blogs/screens/home_feed_screen.dart';
import 'features/bookmarks/screens/bookmarks_screen.dart';
import 'features/dashboard/screens/dashboard_screen.dart';
import 'features/dashboard/screens/settings_screen.dart';
import 'features/profile/screens/profile_screen.dart';
import 'features/profile/screens/public_profile_screen.dart';
import 'features/profile/screens/user_blog_screen.dart';

class BlogifyApp extends StatelessWidget {
  const BlogifyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = Get.find<AuthController>();
    
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Blogify',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF7C3AED),
          brightness: Brightness.light,
          primary: const Color(0xFF7C3AED),
          secondary: const Color(0xFF6366F1),
        ),
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          centerTitle: false,
          elevation: 0,
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF7C3AED), width: 2),
          ),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            backgroundColor: const Color(0xFF7C3AED),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF7C3AED),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ),
      initialRoute: authController.isLoggedIn ? '/home' : '/landing',
      getPages: [
        GetPage(name: '/landing', page: () => const LandingScreen()),
        GetPage(name: '/login', page: () => const LoginScreen()),
        GetPage(name: '/signup', page: () => const SignupScreen()),
        GetPage(name: '/home', page: () => const HomeFeedScreen(), middlewares: [AuthGuardMiddleware()]),
        GetPage(name: '/blog/:id', page: () => const BlogDetailsScreen()),
        GetPage(name: '/blog-editor', page: () => const CreateEditBlogScreen()),
        GetPage(name: '/profile', page: () => const ProfileScreen()),
        GetPage(name: '/public/:slug', page: () => const PublicProfileScreen()),
        GetPage(name: '/user-blog/:userId', page: () => const UserBlogScreen()),
        GetPage(name: '/dashboard', page: () => const DashboardScreen(), middlewares: [AuthGuardMiddleware()]),
        GetPage(name: '/settings', page: () => const SettingsScreen(), middlewares: [AuthGuardMiddleware()]),
        GetPage(name: '/bookmarks', page: () => const BookmarksScreen(), middlewares: [AuthGuardMiddleware()]),
      ],
    );
  }
}

class AuthGuardMiddleware extends GetMiddleware {
  @override
  RouteSettings? redirect(String? route) {
    final auth = Get.find<AuthController>();
    return auth.isLoggedIn ? null : const RouteSettings(name: '/login');
  }
}
