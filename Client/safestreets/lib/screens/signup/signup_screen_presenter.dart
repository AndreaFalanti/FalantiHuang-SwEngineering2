import 'package:safestreets/data/rest_ds.dart';

abstract class SignupScreenContract {
  void onSignUpSuccess();
  void onSignUpError(String errorTxt);
}

class SignUpScreenPresenter {
  SignupScreenContract _view;
  RestDatasource api = new RestDatasource();
  SignUpScreenPresenter(this._view);

  doSignUpCitizen(String firstName, String lastName, String email, String password, String confirmPassword) {
    api.signUpCitizen(firstName, lastName, email, password, confirmPassword)
        .then((dynamic res) {
      _view.onSignUpSuccess();
    }).catchError((Object error) => _view.onSignUpError(error.toString().split(":").last));
  }

  doSignUpAuthority(String firstName, String lastName, String email, String password, String confirmPassword) {
    api.signUpAuthority(firstName, lastName, email, password, confirmPassword)
        .then((dynamic res) {
      _view.onSignUpSuccess();
    }).catchError((Object error) => _view.onSignUpError(error.toString().split(":").last));
  }
}