import 'package:logger/logger.dart';

import 'package:safestreets/data/rest_ds.dart';
import 'package:safestreets/models/user.dart';

abstract class HomeScreenContract {
  /*
  This class must send the following requests to the server.
  1. Report Traffic Violation
  2. Analyze Data
  3. Analyze Personal Data
   */
//  void onReportTrafficViolation();
//  void onDataAnalysisRetrievalSuccess();
  void onLogoutSuccess();
  void onDataRetrievalError(String errorTxt);
}

class HomeScreenPresenter {
  HomeScreenContract _view;
  RestDatasource api = new RestDatasource();
  HomeScreenPresenter(this._view);

  doLogout() {
    api.logout()
        .then((res) {
          _view.onLogoutSuccess();
    }).catchError((Object error) => _view.onDataRetrievalError(error.toString().split(":").last));
  }
}