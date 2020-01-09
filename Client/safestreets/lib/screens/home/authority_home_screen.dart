import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:safestreets/screens/home/home_screen_presenter.dart';

class AuthorityHomeScreen extends StatefulWidget {

  @override
  State<StatefulWidget> createState() => AuthorityHomeScreenState();
}

class AuthorityHomeScreenState extends State<AuthorityHomeScreen>
  implements HomeScreenContract {

  TextStyle style = TextStyle(fontFamily: 'Montserrat', fontSize: 20.0);

  final scaffoldKey = new GlobalKey<ScaffoldState>();
  HomeScreenPresenter _presenter;

  var logger = Logger();

  AuthorityHomeScreenState() {
    _presenter = new HomeScreenPresenter(this);
  }

  void _showSnackBar(String text, bool error) {
    Color color = error ? Colors.red : Colors.green;

    final snackBar = new SnackBar(
      content: new Text(text),
      duration: new Duration(seconds: 2),
      backgroundColor: color,
      action: new SnackBarAction(label: "Ok", onPressed: (){
        print("Press Ok on SnackBar");
      }),
    );
    scaffoldKey.currentState.showSnackBar(snackBar);
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text("SafeStreets for Authorities"),
        actions: <Widget>[
          new IconButton(
              icon: new Icon(Icons.exit_to_app),
              onPressed: () {
                // Navigate back to the first screen by popping the current route
                // off the stack.
                _presenter.doLogout();
                Navigator.pushReplacementNamed(context, '/');
              })
        ],),
      body: new Center(
        child: new Text("Welcome to authority home!"),
      ),

    );
  }

  @override
  void onDataRetrievalError(String errorTxt) {
    // TODO: implement onDataRetrievalError
  }

  @override
  void onLogoutSuccess() {
    // TODO: implement onLogoutSuccess
  }

}