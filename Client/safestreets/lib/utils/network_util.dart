import 'dart:async';
import 'dart:convert';
import 'package:logger/logger.dart';

import 'package:http/http.dart' as http;

@deprecated
class NetworkUtil {
  // next three lines makes this class a Singleton
  static NetworkUtil _instance = new NetworkUtil.internal();
  NetworkUtil.internal();
  factory NetworkUtil() => _instance;

  final JsonDecoder _decoder = new JsonDecoder();
  final JsonEncoder _encoder = new JsonEncoder();

  Map<String,String> cookie = {};

  var logger = Logger();

  void updateCookie(http.Response response) {
    String rawCookie = response.headers['set-cookie'];
    if (rawCookie != null) {
      int session_end = rawCookie.indexOf(';');
      int session_sig_start = rawCookie.indexOf("session.sig");
      int session_sig_end = rawCookie.indexOf(";", session_sig_start);
      String session = (session_end == -1) ? rawCookie
          : rawCookie.substring(0, session_end);
      String session_sig = (session_end == -1 || session_sig_start == -1) ? ""
          : rawCookie.substring(session_sig_start, session_sig_end);
      //String session_sig =
      cookie["cookie"] = session + "; " + session_sig;
      logger.d(cookie);
    }
  }

  Future<dynamic> get(String url) {
    return http.get(url, headers: cookie).then((http.Response response) {
      logger.d("get to: " + url);
      final String res = response.body;
      final int statusCode = response.statusCode;

      updateCookie(response);
      logger.d("get body: " + res);
      logger.d(statusCode);
      if (statusCode < 200 || statusCode > 400 || json == null) {
        throw new Exception("Error while fetching data");
      }
      logger.d("Get decode: "+_decoder.convert(res).runtimeType.toString());
      return _decoder.convert(res);
    });
  }

  Future<dynamic> post(String url, {Map body, headers, encoding}) {

    Map<String,String> postHeaders = {};

    logger.d("post to: " + url);
    logger.d("post body: "+body.toString());

    logger.d("saved cookie: "+cookie.toString());
    if (headers == null) {
      postHeaders["cookie"] = cookie["cookie"];
    } else {
      postHeaders["Content-Type"] = headers["Content-Type"];
    }
    logger.d("headers: "+postHeaders.toString());
    return http
        .post(url, body: _encoder.convert(body), headers: postHeaders, encoding: encoding)
        .then((http.Response response) {
      final String res = response.body;
      final int statusCode = response.statusCode;

      logger.d("post response body: "+res);
      logger.d(statusCode);
      logger.d("cookie: "+response.headers["set-cookie"].toString());

      updateCookie(response);

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