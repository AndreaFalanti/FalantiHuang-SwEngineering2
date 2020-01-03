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

  HomeScreenPresenter _presenter;

  CitizenHomeScreenState() {
    _presenter = new HomeScreenPresenter(this);
  }

  @override
  Widget build(BuildContext context) {

    var reportTVBtn = Card(
      elevation: 15.0,
      shape: RoundedRectangleBorder(
          side: BorderSide(
              color: Colors.grey,
              width: 2),
          borderRadius: BorderRadius.circular(20.0)
      ),
      child: new InkWell(
        onTap: () {
          _presenter.doGetUserReports();
        },
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20.0),
          child: Container(
              height: 220,
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
          _presenter.doGetUserReports();
        },
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20.0),
          child: Container(
              height: 220,
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
          _presenter.doGetUserReports();
        },
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20.0),
          child: Container(
            height: 220,
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
      body: new Center(
        child: Column(
          children: <Widget>[
            SizedBox(height: 10,),
            reportTVBtn,
            SizedBox(height: 10,),
            analyzeDataBtn,
            SizedBox(height: 10,),
            userReportsBtn
          ],
        )
      ),

    );
  }

  @override
  void onDataAnalysisRetrievalSuccess() {
    // TODO: implement onDataAnalysisRetrievalSuccess
  }

  @override
  void onDataRetrievalError(String errorTxt) {
    // TODO: implement onDataRetrievalError
  }

  @override
  void onGetUserReportsSuccess() {
    // TODO: implement onGetUserReportsSuccess
  }

  @override
  void onLogoutSuccess() {
    // TODO: implement onLogoutSuccess
  }

}