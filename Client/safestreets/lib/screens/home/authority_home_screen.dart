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

    var authorityReportsBtn = Card(
      elevation: 15.0,
      shape: RoundedRectangleBorder(
          side: BorderSide(
              color: Colors.lightGreen,
              width: 2),
          borderRadius: BorderRadius.circular(20.0)
      ),
      child: new InkWell(
        onTap: () {
          Navigator.pushNamed(context, '/authority_home/reports');
          //_presenter.doGetUserReports();
        },
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20.0),
          child: Container(
              height: 200,
              width: 350,
              child: Scaffold(
                  appBar: AppBar(
                    backgroundColor: Colors.lightGreen,
                    title: Text("Validate reports",
                        textAlign: TextAlign.center,
                        style: style.copyWith(
                            color: Colors.white, fontWeight: FontWeight.w600)
                    ),
                  ),
                  body: Center(
                    child: Icon(Icons.subject, size: 100,),
                  )
              )
          ),
        ),
      ),
    );

    var analyzeDataBtn = Card(
      elevation: 15.0,
      shape: RoundedRectangleBorder(
          side: BorderSide(
              color: Colors.red,
              width: 2),
          borderRadius: BorderRadius.circular(20.0)
      ),
      child: new InkWell(
        onTap: () {
          Navigator.pushNamed(context, '/filter');
        },
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20.0),
          child: Container(
              height: 200,
              width: 350,
              child: Scaffold(
                  appBar: AppBar(
                    backgroundColor: Colors.red,
                    title: Text("Analyze data",
                        textAlign: TextAlign.center,
                        style: style.copyWith(
                            color: Colors.white, fontWeight: FontWeight.w600)
                    ),
                  ),
                  body: Center(
                    child: Icon(Icons.insert_chart, size: 100,),
                  )
              )
          ),
        ),
      ),
    );

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
      body: Center(
        child: Container(
            width: 350,
            child: ListView(
              children: <Widget>[
                SizedBox(height: 10,),
                authorityReportsBtn,
                SizedBox(height: 10,),
                analyzeDataBtn
              ],
            )
        ),
      )

    );
  }

  @override
  void onDataRetrievalError(String errorTxt) {
    String errorMsg = errorTxt;
    String errorCode = 400.toString();
    if (errorTxt.contains(errorCode)) {
      errorMsg = "Invalid operation";
    }
    _showSnackBar(errorMsg, true);
  }

  @override
  void onLogoutSuccess() {
    _showSnackBar("Your logout was successful!", false);
  }

}