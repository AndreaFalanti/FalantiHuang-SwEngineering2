import 'package:safestreets/screens/reports/single_report_screen_presenter.dart';

abstract class AuthoritySingleReportsScreenContract extends SingleReportsScreenContract{
  void onUpdateReportStatusSuccess();
  void onUpdateReportStatusError(String errorTxt);
}

class AuthoritySingleReportsScreenPresenter extends SingleReportsScreenPresenter{
  AuthoritySingleReportsScreenContract _view;

  AuthoritySingleReportsScreenPresenter(this._view) : super(_view);

  doUpdateReportStatus(int reportId, String newReportStatus) {
    return api.updateReportStatus(reportId, newReportStatus)
        .then((res) {
          logger.d("update report was successful: " + res.toString());
          _view.onUpdateReportStatusSuccess();
        }).catchError((Object error) => _view.onUpdateReportStatusError(error.toString().split(":").last));;
  }
}
