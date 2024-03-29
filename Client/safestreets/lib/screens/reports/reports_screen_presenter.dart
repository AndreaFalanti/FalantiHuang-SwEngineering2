import 'package:logger/logger.dart';
import 'package:safestreets/data/rest_ds.dart';
import 'package:safestreets/models/report.dart';

abstract class ReportsScreenContract {
  void onGetUserReportsSuccess();
  void onDataRetrievalError(String errorTxt);
}

class ReportsScreenPresenter {
  ReportsScreenContract _view;
  RestDatasource api = new RestDatasource();
  ReportsScreenPresenter(this._view);
  var logger = Logger();

  doGetUserReports(List<Report> reports) {
    return api.getUserReports()
        .then((res) {
      _view.onGetUserReportsSuccess();
      reports.clear();
      reports.addAll(res);
      return res;
    }).catchError((Object error) => _view.onDataRetrievalError(error.toString().split(":").last));
  }
}