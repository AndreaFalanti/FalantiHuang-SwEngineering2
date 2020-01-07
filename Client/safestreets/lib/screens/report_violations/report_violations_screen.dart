import 'dart:io';
import 'dart:ui';
import 'package:logger/logger.dart';


import 'package:flutter/material.dart';
import 'package:safestreets/screens/report_violations/report_violations_screen_presenter.dart';

class ReportViolationScreen extends StatefulWidget {

  @override
  State<StatefulWidget> createState() => new ReportViolationScreenState();
}

class ReportViolationScreenState extends State<ReportViolationScreen>
  implements ReportViolationScreenContract {

  TextStyle style = TextStyle(fontFamily: 'Monserrat', fontSize: 20.0);

  final scaffoldKey = new GlobalKey<ScaffoldState>();
  ReportTrafficViolationPresenter _presenter;

  var logger = Logger();

  ReportViolationScreenState() {
    _presenter = new ReportTrafficViolationPresenter(this);
  }


  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        title: Text("Report a violation"),
      ),
    );
  }

  @override
  void onReportError(String errorTxt) {
    // TODO: implement onReportError
  }

  @override
  void onSendFirstPhotoSuccess() {
    // TODO: implement onSendFirstPhotoSuccess
  }

  @override
  void onSendReportSuccess() {
    // TODO: implement onSendReportSuccess
  }

}