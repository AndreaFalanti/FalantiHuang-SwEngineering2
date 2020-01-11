import 'package:logger/logger.dart';
import 'package:safestreets/data/rest_ds.dart';
import 'package:safestreets/models/city.dart';
import 'package:safestreets/models/report.dart';

abstract class FilterScreenContract {
  void onGetFilterReportsSuccess(List<Report> reports);
  void onGetFilterReportsError(String errorTxt);
  void onGetCitiesSuccess(List<City> cities);
  void onGetCitiesError(errorTxt);
}

class FilterScreenPresenter {
  FilterScreenContract _view;
  RestDatasource api = new RestDatasource();
  FilterScreenPresenter(this._view);

  var logger  = Logger();

  doGetFilterReports(String from, String to, String violationType, String city) {
    api.getFilterReports(from, to, violationType, city)
        .then((List<Report> reports) {
          logger.d("Filter reports: " + reports.toString());
          _view.onGetFilterReportsSuccess(reports);
        }).catchError((Object error) => _view.onGetFilterReportsError(error.toString().split(":").last));
  }

  doGetCities() {
    api.getCities()
        .then((cities) {
          _view.onGetCitiesSuccess(cities);
    }).catchError((Object error) => _view.onGetCitiesError(error.toString().split(":").last));
  }
}