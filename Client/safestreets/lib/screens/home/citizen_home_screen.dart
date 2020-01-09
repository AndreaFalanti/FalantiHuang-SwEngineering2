import 'dart:io';
import 'dart:ui';
import 'package:logger/logger.dart';

import 'package:flutter/material.dart';
import 'package:safestreets/screens/home/home_screen_presenter.dart';

class CitizenHomeScreen extends StatefulWidget {

  @override
  State<StatefulWidget> createState() => new CitizenHomeScreenState();
}

class CitizenHomeScreenState extends State<CitizenHomeScreen>
  implements HomeScreenContract {

  TextStyle style = TextStyle(fontFamily: 'Montserrat', fontSize: 20.0);

  final scaffoldKey = new GlobalKey<ScaffoldState>();
  HomeScreenPresenter _presenter;

  var logger = Logger();

  CitizenHomeScreenState() {
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

    var reportViolationsBtn = Card(
      elevation: 15.0,
      shape: RoundedRectangleBorder(
          side: BorderSide(
              color: Colors.grey,
              width: 2),
          borderRadius: BorderRadius.circular(20.0)
      ),
      child: new InkWell(
        onTap: () {
          Navigator.pushNamed(context, '/citizen_home/report_violations');
        },
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20.0),
          child: Container(
              height: 200,
              width: 350,
              child: Scaffold(
                  appBar: AppBar(
                    backgroundColor: Colors.grey,
                    title: Text("Report traffic violations",
                        textAlign: TextAlign.center,
                        style: style.copyWith(
                            color: Colors.white, fontWeight: FontWeight.w600)
                    ),
                  ),
                  body: Center(
                    child: Icon(Icons.cancel, size: 100,),
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
          // TODO push screen
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

    var userReportsBtn = Card(
      elevation: 15.0,
      shape: RoundedRectangleBorder(
          side: BorderSide(
            color: Colors.lightGreen,
            width: 2),
          borderRadius: BorderRadius.circular(20.0)
      ),
      child: new InkWell(
        onTap: () {
          Navigator.pushNamed(context, '/citizen_home/user_reports');
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
                title: Text("Analyze personal reports",
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


    return new Scaffold(
      key: scaffoldKey,
      appBar: new AppBar(
        title: new Text("SafeStreets for Citizen"),
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
              reportViolationsBtn,
              SizedBox(height: 10,),
              analyzeDataBtn,
              SizedBox(height: 10,),
              userReportsBtn
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