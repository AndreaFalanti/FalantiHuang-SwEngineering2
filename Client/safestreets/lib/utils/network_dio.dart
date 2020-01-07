import 'dart:async';
import 'dart:convert';
import 'package:logger/logger.dart';

import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';

class NetworkUtil {
  // next three lines makes this class a Singleton
  static NetworkUtil _instance = new NetworkUtil.internal();
  NetworkUtil.internal();
  factory NetworkUtil() => _instance;

  final JsonDecoder _decoder = new JsonDecoder();
  final JsonEncoder _encoder = new JsonEncoder();

  Dio _dio = new Dio()..interceptors.add(CookieManager(CookieJar()));

  var logger = Logger();

  Future<dynamic> get(String url) {
    return _dio.get(url).then((Response response) {
      logger.d("get to: " + url);
      final int statusCode = response.statusCode;

      logger.d("get body: " + response.data.toString());
      logger.d(statusCode);
      if (statusCode < 200 || statusCode > 400 || json == null) {
        throw new Exception("Error while fetching data");
      }

      return response.data;
    });
  }

  Future<dynamic> post(String url, {Map body, headers, encoding}) {

    Map<String,String> postHeaders = {};

    logger.d("post to: " + url);
    logger.d("post body: "+body.toString());

    postHeaders["Content-Type"] = headers["Content-Type"];
    logger.d("headers: "+postHeaders.toString());
    Options optionData = new Options(
      headers: postHeaders
    );

    return _dio
        .post(url, data: _encoder.convert(body), options: optionData)
        .then((Response response) {
      final String res = response.data;
      final int statusCode = response.statusCode;

      logger.d("post response body: "+res);
      logger.d(statusCode);
      logger.d("cookie: "+response.headers["set-cookie"].toString());

      if (statusCode < 200 || statusCode > 400 || json == null) {
        throw new Exception("Error while fetching data");
      }
      if (statusCode == 400) {
        throw new Exception(statusCode);
      }
      // return something only if some data is expected
      return (res.length == 0) ? null : _decoder.convert(res);
    });
  }
}