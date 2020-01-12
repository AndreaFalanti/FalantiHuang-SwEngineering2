import 'dart:io';
import 'dart:ui';
import 'package:logger/logger.dart';


import 'package:flutter/material.dart';
import 'package:safestreets/screens/reports/single_report_screen_presenter.dart';
import 'package:safestreets/models/report.dart';
import 'package:safestreets/utils/enum_util.dart';
import 'package:safestreets/widgtes/carousel.dart';

class UserSingleReportScreen extends StatefulWidget {
  final int reportId;

  UserSingleReportScreen({Key key, @required this.reportId,}) : super(key: key);

  @override
  State<StatefulWidget> createState() => new UserSingleReportScreenState();
}

class UserSingleReportScreenState extends State<UserSingleReportScreen>
    implements SingleReportsScreenContract {

  TextStyle style = TextStyle(fontFamily: 'Monserrat', fontSize: 20.0);

  final scaffoldKey = new GlobalKey<ScaffoldState>();
  Report _report;
  SingleReportsScreenPresenter _presenter;

  var logger = Logger();

  UserSingleReportScreenState() {
    _presenter = new SingleReportsScreenPresenter(this);
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

  Widget _reportRow(String firstText, String secondText) {
    return Row(
      children: <Widget>[
        Text(firstText,style: style.copyWith(fontSize: 16.0, fontWeight: FontWeight.bold),),
        Spacer(),
        Text(secondText!=null?secondText:"")
      ],
    );
  }

  Widget _buildReport() {
    return Container(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        children: <Widget>[
          CarouselWithIndicator(photos: _report.photos, fromNetwork: true,),
          SizedBox(height: 20,),
          Container(
            padding: const EdgeInsets.all(10.0),
            child: Column(
              children: <Widget>[
                _reportRow("Date:", _report.formattedTimestamp()),
                SizedBox(height: 10,),
                _reportRow("License plate:", _report.licensePlate),
                SizedBox(height: 10,),
                _reportRow("City:", _report.city),
                SizedBox(height: 10,),
                _reportRow("Place:", _report.place),
                SizedBox(height: 10,),
                _reportRow("Report status", enumToString(_report.reportStatus)),
                SizedBox(height: 10,)
              ],
            ),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
        key: scaffoldKey,
        appBar: AppBar(
          title: Text("Report ${widget.reportId}"),
        ),
        body: FutureBuilder<Report> (
          future: _presenter.doGetSingleReport(widget.reportId),
          builder: (context, snapshot) {
            logger.d("Snapshot: "+snapshot.toString());
            if (snapshot.hasData) {
              logger.d(snapshot.data.toString());
              return _buildReport();
            } else if (snapshot.hasError) {
              return Text("${snapshot.error}");
            }
            // By default, show a loading spinner.
            return CircularProgressIndicator();
          },
        )
    );
  }

  @override
  void onGetSingleReportSuccess(Report report) {
    _showSnackBar("Retrieved single report!", false);
    logger.d("Updating the report data: " + report.toString());
    _report = report;
  }

  @override
  void onGetSingleReportError(String errorTxt) {
    String errorMsg = errorTxt;
    String errorCode = 400.toString();
    if (errorTxt.contains(errorCode)) {
      errorMsg = "Invalid operation";
    }
    _showSnackBar(errorMsg, true);
    Navigator.pop(context);
  }

}