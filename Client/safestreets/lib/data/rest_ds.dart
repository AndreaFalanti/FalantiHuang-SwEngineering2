import 'dart:async';
import 'package:logger/logger.dart';

import 'package:safestreets/utils/network_util.dart';
import 'package:safestreets/models/user.dart';

class RestDatasource {
  NetworkUtil _netUtil = new NetworkUtil();
  static final BASE_URL = "http://localhost:8080/v2";
  static final LOGIN_URL = BASE_URL + "/users/login";
  static final LOGOUT_URL = BASE_URL + "/users/logout";
  static final DATA_URL = BASE_URL + "/users/data";
  static final USER_REPORTS_URL = BASE_URL + "/users/reports";
  static final CITIZEN_SIGNUP_URL = BASE_URL + "/users/register/citizen";
  static final AUTHORITY_SIGNUP_URL = BASE_URL + "/users/register/authority";

  static const Map<String, String> JSON_CONTENT = {"Content-Type": "application/json"};

  var logger = Logger();


  Future<dynamic> signUpCitizen(String firstName, String lastName, String email,
      String password, String confirmPassword) {
    logger.d("User: "+firstName + " " +lastName);
    return _netUtil.post(CITIZEN_SIGNUP_URL,
        body: {
          "firstname": firstName,
          "lastname": lastName,
          "email": email,
          "password": password,
          "confirmPassword": confirmPassword
        },
        headers: JSON_CONTENT)
        .then((dynamic res) {
          logger.d("post signup:"+res.toString());
    });
  }

  Future<dynamic> signUpAuthority(String firstName, String lastName, String email,
      String password, String confirmPassword) {
    return _netUtil.post(AUTHORITY_SIGNUP_URL,
        body: {
          "firstname": firstName,
          "lastname": lastName,
          "email": email,
          "password": password,
          "confirmPassword": confirmPassword
        },
        headers: JSON_CONTENT)
        .then((dynamic res) {

    });

  }

  Future<User> login(String email, String password) {
    return _netUtil.post(LOGIN_URL,
        body: {
          "email": email,
          "password": password
        },
        headers: JSON_CONTENT)
        .then((dynamic res) {
          logger.d("post login: "+res.toString());
          return getUserData();
        });
  }

  Future<dynamic> logout() {
    return _netUtil.post(LOGOUT_URL);
  }

  Future<User> getUserData() {
    return _netUtil.get(DATA_URL)
        .then((user) {
          logger.d("GetUserData: "+user.toString());
          var usr = new User.map(user);
          return usr;
        });
  }

  Future<void> getUserReports() {
    return _netUtil.get(USER_REPORTS_URL)
        .then((reports) {
          // List of dictionaries of reports
          logger.d("Reports: "+ reports);
        });
  }
}