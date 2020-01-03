import 'package:safestreets/data/rest_ds.dart';
import 'package:safestreets/models/user.dart';

abstract class HomeScreenContract {
  /*
  This class must send the following requests to the server.
  1. Report Traffic Violation
  2. Analyze Data
  3. Analyze Personal Data
   */
  void onGetUserReportsSuccess();
  void onDataAnalysisRetrievalSuccess();
  void onLogoutSuccess();
  void onDataRetrievalError(String errorTxt);
}

class HomeScreenPresenter {
  HomeScreenContract _view;
  RestDatasource api = new RestDatasource();
  HomeScreenPresenter(this._view);

  doGetUserReports() {
    api.getUserReports()
        .then((res) {
          _view.onGetUserReportsSuccess();
    }).catchError((Object error) => _view.onDataRetrievalError(error.toString()));
  }

  doDataAnalysisRetrieval() {

  }

  doLogout() {
    api.logout()
        .then((res) {
          _view.onLogoutSuccess();
    }).catchError((Object error) => _view.onDataRetrievalError(error.toString()));
  }
}