import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:logger/logger.dart';

import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';

class NetworkUtil {
  // next three lines makes this class a Singleton
  static NetworkUtil _instance = new NetworkUtil.internal();
  NetworkUtil.internal() {
//    var appDir = getLibraryDirectory() .then((dir) {
//      //var docDir = new Directory( dir.path +);
//      dir.list().listen((FileSystemEntity entity) {
//        logger.d(entity.path);
//      });
//    });

    getApplicationDocumentsDirectory().then((Directory dir) {
      String appPath = dir.path;
      logger.d(appPath);
      _cookieJar = new PersistCookieJar(dir: appPath+"/cookies/");
      _dio.interceptors.add(CookieManager(_cookieJar));
    });

  }
  factory NetworkUtil() => _instance;

  final JsonDecoder _decoder = new JsonDecoder();
  final JsonEncoder _encoder = new JsonEncoder();

  Dio _dio = new Dio();
  CookieJar _cookieJar;

  var logger = Logger();

  Future<dynamic> get(String url) {
    logger.d("before get to url: " + url);
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

    logger.d("post to: " + url);
    logger.d("post body: "+body.toString());

    return _dio
        .post(
        url,
        data: (body != null)
            ? _encoder.convert(body)
            : null,)
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

  Future<dynamic> postPhotoFormData(String url, {Map files}) {

    logger.d("FORM DATA post to: " + url);
    logger.d("FORM DATA post files: "+files.cast().toString());

    FormData formData = FormData.fromMap(files.cast());

    logger.d("FORM DATA : "+formData.fields.toString());
    logger.d("FORM DATA : "+formData.files.toString());

    return _dio
        .post(url, data: formData)
        .then((Response response) {
          logger.d("INSIDE:"+response.data.toString());
      final String res = response.data.toString();
      final int statusCode = response.statusCode;

      logger.d("FORM DATA post response body: "+res);
      logger.d(statusCode);

      if (statusCode < 200 || statusCode > 400 || json == null) {

        throw new Exception("Error while fetching data");
      }
      if (statusCode == 400) {
        throw new Exception(statusCode);
      }

      // return something only if some data is expected
      return (res.length == 0) ? null : response.data;
    });
  }

  Future<dynamic> postReportFormData(String url, {Map fields, files}) {

    logger.d("FORM DATA post to: " + url);
    logger.d("FORM DATA post fields: "+fields.toString());
    logger.d("FORM DATA post files: "+files.toString());

    FormData formData = FormData.fromMap(fields.cast());
    List<MapEntry<String,MultipartFile>> multipartFiles = new List<MapEntry<String,MultipartFile>>();
    for(MultipartFile file in files[files.keys.first]) {
      multipartFiles.add(MapEntry<String, MultipartFile>(files.keys.first, file));
    }
    logger.d("MULTIPARTFILES: " + multipartFiles.toString());
    formData.files.addAll(multipartFiles);

    logger.d("FORM DATA fields update: "+formData.fields.toString());
    logger.d("FORM DATA files update: "+formData.files.toString());

    return _dio
        .post(url, data: formData)
        .then((Response response) {
      logger.d("INSIDE:"+response.data.toString());
      final String res = response.data.toString();
      final int statusCode = response.statusCode;

      logger.d("FORM DATA post response body: "+res);
      logger.d(statusCode);

      if (statusCode < 200 || statusCode > 400 || json == null) {

        throw new Exception("Error while fetching data");
      }
      if (statusCode == 400) {
        throw new Exception(statusCode);
      }

      // return something only if some data is expected
      return (res.length == 0) ? null : response.data;
    });
  }
}