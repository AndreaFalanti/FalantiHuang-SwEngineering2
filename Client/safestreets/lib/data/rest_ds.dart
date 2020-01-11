import 'dart:async';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:logger/logger.dart';
import 'package:safestreets/models/city.dart';

//import 'package:safestreets/utils/network_util.dart';
import 'package:safestreets/utils/network_dio.dart';
import 'package:safestreets/models/user.dart';
import 'package:safestreets/models/report.dart';
import 'package:safestreets/config.dart';

class RestDatasource {
  NetworkUtil _netUtil = new NetworkUtil();
  static final LOGIN_URL = BASE_URL + "/users/login";
  static final LOGOUT_URL = BASE_URL + "/users/logout";
  static final DATA_URL = BASE_URL + "/users/data";
  static final CITIES_URL = BASE_URL + "/cities";
  static final USER_REPORTS_URL = BASE_URL + "/users/reports";
  static final CITIZEN_SIGNUP_URL = BASE_URL + "/users/register/citizen";
  static final AUTHORITY_SIGNUP_URL = BASE_URL + "/users/register/authority";
  static final PHOTO_UPLOAD_URL = BASE_URL + "/reports/photo_upload";
  static final REPORT_SUBMIT_URL = BASE_URL + "/reports/submit";

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
    logger.d("Start get user data");
    return _netUtil.get(DATA_URL)
        .then((user) {
          logger.d("GetUserData: "+user.toString());
          var usr = new User.map(user);
          return usr;
        });
  }

  Future<List<City>> getCities() {
    logger.d("Start get cities");
    return _netUtil.get(CITIES_URL)
        .then((cities) {
          logger.d("Cities: "+cities.toString());
          List<City> cityList = new List();
          for (dynamic city in cities) {
            //logger.d(report["id"]);
            logger.d("Mapping cities");
            cityList.add(new City.map(city));
          }

          cityList.sort((c1,c2) => c1.id - c2.id);

          return cityList;
    });
  }

  Future<List<Report>> getUserReports() {
    return _netUtil.get(USER_REPORTS_URL)
        .then((reports) {
          logger.d("Got user reports!");
          List<Report> reportList = new List();
          for (dynamic report in reports) {
            //logger.d(report["id"]);
            reportList.add(new Report.map(report));
          }
          // sort list of dictionaries of reports
          reportList.sort((r1,r2) => r1.id - r2.id);
          reportList.sort((r1,r2) => r1.reportStatus.index - r2.reportStatus.index);
//          for (Report report in reportList) {
//            print(report.toMap());
//          }
          return reportList;
        });
  }

  Future<List<Report>> getFilterReports(String from, String to, String violationType, String city) {
    String path = BASE_URL+"/reports";
    path = (from != "") ? path + "?from=$from": path;
    path = (to != "")
        ? (path.compareTo(BASE_URL+"/report") != 0) ? path + "&to=$to" : path+"?to=$to"
        : path;
    path = (violationType != "")
        ? (path.compareTo(BASE_URL+"/reports") != 0) ? path + "&type=$violationType" : path+"?type=$violationType"
        : path;
    path = (city != "")
        ? (path.compareTo(BASE_URL+"/reports") != 0) ? path + "&city=$city" : path+"?city=$city"
        : path;
    logger.d("filter url: $path");
    return _netUtil.get(path)
        .then((reports) {
            logger.d("Got filter reports!");
            List<Report> reportList = new List();
            for (dynamic report in reports) {
              //logger.d(report["id"]);
              logger.d("Mapping reports");
              reportList.add(new Report.map(report));
            }

            return reportList;
        });
  }

  Future<Report> getSingleReport(int reportId) {
    return _netUtil.get(BASE_URL+"/reports/"+reportId.toString())
        .then((report) {
          return new Report.map(report);
        });
  }

  Future<dynamic> sendFirstPhoto(String photoPath) {
    File imgFile = new File(photoPath);
    logger.d("path of image:" + imgFile.path);
    logger.d("SEND FIRST PHOTO: " + photoPath.split("/").last);

    return MultipartFile.fromFile(photoPath, filename: photoPath.split("/").last).then((photoName) {
      logger.d("opened file: "+photoName.toString());
      return _netUtil.postPhotoFormData(PHOTO_UPLOAD_URL,
          files: {
            "photo": photoName,
          })
          .then((dynamic res) {
            logger.d("MultipartFile res: " + res["license_plate"]);
        return res;
      });
    });
  }

  Future<dynamic> sendReport(double lat, double long, String violationType, String licensePlate, List<String> filePaths, String optDesc) {
    return _netUtil.postReportFormData(REPORT_SUBMIT_URL,
      fields: {
        "latitude": lat,
        "longitude": long,
        "violation_type": violationType,
        "license_plate": licensePlate,
        "desc": optDesc
      },
      files: {
        "photo_files": filePaths
            .map((filePath) =>
        MultipartFile.fromFileSync(filePath, filename: filePath.split("/").last))
            .toList(),
      }
    ).then((res) {

    });
  }

  Future<dynamic> updateReportStatus(int reportId, String newReportStatus) {
    return _netUtil.post(BASE_URL+"/reports/"+reportId.toString()+"/set_status",
        body: {
          "status": newReportStatus,
        },
        headers: JSON_CONTENT)
        .then((res) {
          return res;
        });
  }

}