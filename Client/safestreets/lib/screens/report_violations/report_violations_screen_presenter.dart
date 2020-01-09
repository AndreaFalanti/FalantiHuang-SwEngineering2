import 'dart:io';

import 'package:safestreets/data/rest_ds.dart';
import 'package:safestreets/models/user.dart';

abstract class ReportViolationScreenContract {
  void onSendFirstPhotoSuccess(String licensePlate);
  void onSendReportSuccess();
  void onReportError(String errorTxt);
}

class ReportTrafficViolationPresenter {
  ReportViolationScreenContract _view;
  RestDatasource api = new RestDatasource();
  ReportTrafficViolationPresenter(this._view);

  doSendFirstPhoto(String photoPath) {
    api.sendFirstPhoto(photoPath)
        .then((res) {
          try {
            _view.onSendFirstPhotoSuccess(res["license_plate"]);
          } catch (error) {
            throw Exception("No license plate detected");
      }
    }).catchError((Object error) => _view.onReportError(error.toString().split(":").last));
  }

  doSendReport(double lat, double long, String violationType, String licensePlate, List<String> filePaths, String optDesc) {
    api.sendReport(lat, long, violationType, licensePlate, filePaths, optDesc)
        .then((res) {
      _view.onSendReportSuccess();
    }).catchError((Object error) => _view.onReportError(error.toString()));
  }
}