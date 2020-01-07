import 'dart:io';
import 'dart:ui';
import 'package:logger/logger.dart';


import 'package:flutter/material.dart';
import 'package:safestreets/screens/report_violations/report_violations_screen_presenter.dart';
import 'package:safestreets/widgtes/carousel.dart';

class ReportViolationScreen extends StatefulWidget {

  @override
  State<StatefulWidget> createState() => new ReportViolationScreenState();
}

class ReportViolationScreenState extends State<ReportViolationScreen>
  implements ReportViolationScreenContract {

  TextStyle style = TextStyle(fontFamily: 'Monserrat', fontSize: 20.0);

  final scaffoldKey = new GlobalKey<ScaffoldState>();
  ReportTrafficViolationPresenter _presenter;
  bool _isFirstPhotoValid = false;

  var logger = Logger();

  ReportViolationScreenState() {
    _presenter = new ReportTrafficViolationPresenter(this);
  }

  void _onTakePhoto() {
    print("Take photo");
  }

  @override
  Widget build(BuildContext context) {

    var takePhoto = Container(
        alignment: Alignment.topCenter,
        margin: EdgeInsets.all(20.0),
        child: ClipRRect(
          borderRadius: BorderRadius.all(Radius.circular(10.0)),
          child: Container(
            height: 200,
            width: 300,
            color: Colors.grey,
            child: IconButton(
                icon: Icon(
                  Icons.add_a_photo,
                  color: Colors.black,
                  size: 100,
                ),
                onPressed: _onTakePhoto)
          )
        ),
    );

    var photos = _isFirstPhotoValid
        ? CarouselWithIndicator(photos: null)
        : takePhoto;

    return Scaffold(
      appBar: AppBar(
        title: Text("Report a violation"),
      ),
      body: photos,
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