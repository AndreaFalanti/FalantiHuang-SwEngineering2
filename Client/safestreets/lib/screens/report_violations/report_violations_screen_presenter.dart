import 'package:safestreets/data/rest_ds.dart';
import 'package:safestreets/models/user.dart';

abstract class ReportViolationScreenContract {
  void onSendFirstPhotoSuccess();
  void onSendReportSuccess();
  void onReportError(String errorTxt);
}

class ReportTrafficViolationPresenter {
  ReportViolationScreenContract _view;
  RestDatasource api = new RestDatasource();
  ReportTrafficViolationPresenter(this._view);

  doSendFirstPhoto() {

  }

  doSendReport(String email, String password) {
    api.login(email, password)
        .then((User user) {
      _view.onSendReportSuccess();
    }).catchError((Object error) => _view.onReportError(error.toString()));
  }
}