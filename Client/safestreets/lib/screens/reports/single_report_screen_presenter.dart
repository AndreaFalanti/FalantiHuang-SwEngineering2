import 'package:logger/logger.dart';
import 'package:safestreets/data/rest_ds.dart';
import 'package:safestreets/models/report.dart';

abstract class SingleReportsScreenContract {
  void onGetSingleReportSuccess(Report report);
  void onGetSingleReportError(String errorTxt);
}

class SingleReportsScreenPresenter {
  SingleReportsScreenContract _view;
  RestDatasource api = new RestDatasource();
  SingleReportsScreenPresenter(this._view);
  var logger = Logger();

  doGetSingleReport(int reportId) {
    return api.getSingleReport(reportId)
        .then((res) {
      _view.onGetSingleReportSuccess(res);
      return res;
    }).catchError((Object error) => _view.onGetSingleReportError(error.toString().split(":").last));
  }
}
