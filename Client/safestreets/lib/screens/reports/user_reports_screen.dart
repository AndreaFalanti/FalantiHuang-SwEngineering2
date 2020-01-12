import 'dart:io';
import 'dart:ui';
import 'package:logger/logger.dart';


import 'package:flutter/material.dart';
import 'package:safestreets/screens/reports/reports_screen_presenter.dart';
import 'package:safestreets/models/report.dart';
import 'package:safestreets/screens/reports/user_single_report_screen.dart';

class UserReportsScreen extends StatefulWidget {

  @override
  State<StatefulWidget> createState() => new UserReportsScreenState();
}

class UserReportsScreenState extends State<UserReportsScreen>
    implements ReportsScreenContract {

  TextStyle style = TextStyle(fontFamily: 'Monserrat', fontSize: 20.0);

  final scaffoldKey = new GlobalKey<ScaffoldState>();
  final _reports = List<Report>();
  ReportsScreenPresenter _presenter;

  var logger = Logger();

  UserReportsScreenState() {
    _presenter = new ReportsScreenPresenter(this);
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
  void onDataRetrievalError(String errorTxt) {
    String errorMsg = errorTxt;
    String errorCode = 400.toString();
    if (errorTxt.contains(errorCode)) {
      errorMsg = "Invalid operation";
    }
    _showSnackBar(errorMsg, true);
    Navigator.pop(context);
  }

  @override
  void onGetUserReportsSuccess() {
    //_showSnackBar("Retrieved reports successfully", false);
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        title: Text("My reports"),
      ),
      body: Center(
        child: FutureBuilder<List<Report>> (
          future: _presenter.doGetUserReports(_reports),
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              logger.d(_reports.toString());
              return _buildReports();
            } else if (snapshot.hasError) {
              return Text("${snapshot.error}");
            }
            // By default, show a loading spinner.
            return CircularProgressIndicator();
          },
        ),
      )
    );
  }

  Widget _buildListRow(Report report) {

    return ListTile(
      title: Text(
        "ReportID: "+ report.id.toString() + "\nDate: " +
            report.formattedTimestamp(),
        style: style,
      ),
      trailing: Icon(
        Icons.brightness_1,
        color: (report.reportStatus == ReportStatus.pending)
            ? Colors.orange
            : (report.reportStatus == ReportStatus.invalidated)
                ? Colors.redAccent
                : Colors.green,
      ),
      onTap: () => _pushReportScreen(report),
    );
  }

  Widget _buildReports() {
    print("reports: " + _reports.length.toString());
    return ListView.separated(
        padding: const EdgeInsets.all(16.0),
        itemBuilder: (context, i) {
          return _buildListRow(_reports[i]);
        },
        separatorBuilder: (BuildContext context, int index) => const Divider(),
        itemCount: _reports.length);
  }

  void _pushReportScreen(Report report) {

    Navigator.of(context).push(
        MaterialPageRoute<void>(
            builder: (BuildContext context) => UserSingleReportScreen(reportId: report.id)
        )
    );
  }

}