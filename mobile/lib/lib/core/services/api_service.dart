import 'package:dio/dio.dart';

import '../constants/app_constants.dart';
import 'storage_service.dart';

class ApiService {
  ApiService._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConstants.baseUrl,
        connectTimeout: const Duration(seconds: 20),
        receiveTimeout: const Duration(seconds: 20),
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final token = StorageService.token;
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) {
          handler.next(error);
        },
      ),
    );
  }

  static final ApiService instance = ApiService._internal();
  late final Dio _dio;

  Future<dynamic> get(String path, {Map<String, dynamic>? query}) async {
    try {
      final res = await _dio.get(path, queryParameters: query);
      return res.data;
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<dynamic> post(String path, {dynamic data}) async {
    try {
      final res = await _dio.post(path, data: data);
      return res.data;
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<dynamic> put(String path, {dynamic data}) async {
    try {
      final res = await _dio.put(path, data: data);
      return res.data;
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<dynamic> patch(String path, {dynamic data}) async {
    try {
      final res = await _dio.patch(path, data: data);
      return res.data;
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }

  Future<dynamic> delete(String path, {dynamic data}) async {
    try {
      final res = await _dio.delete(path, data: data);
      return res.data;
    } on DioException catch (e) {
      throw ApiException.fromDio(e);
    }
  }
}

class ApiException implements Exception {
  ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  factory ApiException.fromDio(DioException e) {
    final rawMessage = (e.message ?? '').toLowerCase();
    if (e.type == DioExceptionType.connectionError &&
        (rawMessage.contains('xmlhttprequest') || rawMessage.contains('network layer'))) {
      return ApiException(
        'Request blocked by CORS/network policy. Backend must allow your app origin in CORS settings.',
        statusCode: e.response?.statusCode,
      );
    }

    final data = e.response?.data;
    final message = data is Map<String, dynamic>
        ? (data['message']?.toString() ?? 'Request failed')
        : e.message ?? 'Request failed';
    return ApiException(message, statusCode: e.response?.statusCode);
  }

  @override
  String toString() => message;
}
