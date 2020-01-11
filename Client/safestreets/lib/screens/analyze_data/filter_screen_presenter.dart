import 'package:logger/logger.dart';
import 'package:safestreets/data/rest_ds.dart';
import 'package:safestreets/models/city.dart';

abstract class FilterScreenContract {
  void onGetFilterReportsSuccess();
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
        .then((reports) {
          logger.d("Filter reports: " + reports.toString());
          _view.onGetFilterReportsSuccess();
        }).catchError((Object error) => _view.onGetFilterReportsError(error.toString().split(":").last));
  }

  doGetCities() {
    api.getCities()
        .then((cities) {
          _view.onGetCitiesSuccess(cities);
    }).catchError((Object error) => _view.onGetCitiesError(error.toString().split(":").last));
  }
}