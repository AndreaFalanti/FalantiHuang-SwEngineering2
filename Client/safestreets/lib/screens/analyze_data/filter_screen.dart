import 'dart:io';
import 'dart:ui';
import 'package:dropdownfield/dropdownfield.dart';
import 'package:flutter_datetime_picker/flutter_datetime_picker.dart';
import 'package:logger/logger.dart';

import 'package:flutter/material.dart';
import 'package:safestreets/models/city.dart';
import 'package:safestreets/models/report.dart';
import 'package:safestreets/screens/analyze_data/filter_screen_presenter.dart';
import 'package:safestreets/utils/enum_util.dart';

class FilterScreen extends StatefulWidget {
  @override
  _FilterScreenState createState() => _FilterScreenState();
}

class _FilterScreenState extends State<FilterScreen>
  implements FilterScreenContract{

  TextStyle style = TextStyle(fontFamily: 'Monserrat', fontSize: 18.0);

  final scaffoldKey = new GlobalKey<ScaffoldState>();
  final formKey = new GlobalKey<FormState>();

  String _from ="", _to= "";
  String _violationType;
  String _city;
  List<City> _cities;
  DateTime _fromDateConstraint;
  bool _isRetrievingReports = false;
  TextEditingController _fromController = new TextEditingController();
  TextEditingController _toController = new TextEditingController();
  FilterScreenPresenter _presenter;

  _FilterScreenState() {
    _presenter = new FilterScreenPresenter(this);
  }

  @override
  void initState() {
    super.initState();
    _presenter.doGetCities();

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

  var logger = Logger();

  void _applyFilters() {
    _isRetrievingReports = true;
    formKey.currentState.save();
    logger.d("apply filters: $_from, $_to, $_violationType, $_city");
    _presenter.doGetFilterReports(
        _from,
        _to,
        _violationType,
        _city!=""
            ? _cities.firstWhere((city) => city.name.compareTo(_city)==0).id.toString()
            : ""
    );
  }

  @override
  Widget build(BuildContext context) {

    if (_from != null) {
      logger.d("From: "+_from+"\n$_fromDateConstraint");
    }

    var fromField = Container(
      child: new Padding(
          padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              SizedBox(height: 30,
                  child: Text("From", style: TextStyle(fontWeight: FontWeight.bold),)),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  IconButton(
                    onPressed: () {
                      DatePicker.showDatePicker(context,
                          showTitleActions: true,
                          maxTime: DateTime.now(),
                          onChanged: (date) {
                            print('change $date');

                          },
                          onConfirm: (date) {
                            print('confirm $date');
                            setState(() {
                              _fromDateConstraint = date;
                              _from = "${date.year}-${date.month}-${date.day}";
                              _fromController.text = _from;
                            });
                          },
                          currentTime: DateTime.now(),
                          locale: LocaleType.it);
                    },
                    icon: Icon(Icons.date_range, size: 30,),
                  ),
                  Container(
                    width: 200,
                    child: TextFormField(
                      controller: _fromController,
                      enabled: false,
                      decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.grey.withOpacity(0.2),
                          contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
                          hintText: "Choose a starting date",
                          border:
                          OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
                      //_from != null ? _from : "",
                    ),
                  ),
                  IconButton(
                    onPressed: () => setState(() {
                      _fromDateConstraint = null;
                      _from = "";
                      _fromController.text = _from;
                    }),
                    icon: Icon(Icons.clear),
                  )
                ],
              )

            ],
          )
      ),
    );

    var toField = Container(
      child: new Padding(
          padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              SizedBox(height: 30,
                  child: Text("To", style: TextStyle(fontWeight: FontWeight.bold),)),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  IconButton(
                    onPressed: () {
                      DatePicker.showDatePicker(context,
                          showTitleActions: true,
                          minTime: _fromDateConstraint,
                          maxTime: DateTime.now(),
                          onChanged: (date) {
                            print('change $date');

                          },
                          onConfirm: (date) {
                            print('confirm $date');
                            setState(() {
                              _to = "${date.year}-${date.month}-${date.day}";
                              _toController.text = _to;
                            });
                          },
                          currentTime: DateTime.now(),
                          locale: LocaleType.it);
                    },
                    icon: Icon(Icons.date_range, size: 30,),
                  ),
                  Container(
                    width: 200,
                    child: TextFormField(
                      controller: _toController,
                      enabled: false,
                      decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.grey.withOpacity(0.2),
                          contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
                          hintText: "Choose a final date",
                          border:
                          OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
                      //_from != null ? _from : "",
                    ),
                  ),
                  IconButton(
                    onPressed: () => setState(() {
                      _to = "";
                      _toController.text = _to;
                    }),
                    icon: Icon(Icons.clear),
                  )
                ],
              )
            ],
          )
      ),
    );

    var violationTypeMenu = Container(
      child: new Padding(
          padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              SizedBox(height: 30,
                  child: Text("Violation Type", style: TextStyle(fontWeight: FontWeight.bold),)),
              DropDownField(
                  textStyle: style,
                  value: _violationType,
                  strict: true,
                  items: enumValues(ViolationType.values).map((val) => val.replaceAll("_", " ")).toList(),
                  setter: (dynamic newValue) {
                    logger.d("running setter for violation type");
                    _violationType = newValue.toString().replaceAll(" ", "_");
                  }
              )
            ],
          )
      ),
    );

    var cityMenu = Container(
      child: new Padding(
          padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              SizedBox(height: 30,
                  child: Text("City", style: TextStyle(fontWeight: FontWeight.bold),)),
              DropDownField(
                  textStyle: style,
                  value: _city,
                  strict: true,
                  items: (_cities == null)
                      ? null
                      : _cities.map((city) => city.name).toList(),
                  setter: (dynamic newValue) {
                    _city = newValue;
                  }
              )
            ],
          )
      ),
    );

    var applyFilterBtn = Material( // widget to add shadow(elevation) to the button
      elevation: 15.0,
      borderRadius: BorderRadius.circular(30.0),
      color: Colors.lightBlue,
      child: MaterialButton(
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        onPressed: _applyFilters,
        child: Text("Apply filter",
            textAlign: TextAlign.center,
            style: style.copyWith(
                color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );

    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        title: Text("Choose the filters"),
      ),
      body: Container(
          padding: EdgeInsets.all(8.0),
          alignment: Alignment.center,
          child: ListView(
            children: <Widget>[
              Form(
                key: formKey,
                child: Column(
                  children: <Widget>[
                    fromField,
                    toField,
                    violationTypeMenu,
                    cityMenu,
                    _isRetrievingReports ? CircularProgressIndicator : applyFilterBtn
                  ],
                ),
              )
            ],
          ),
      )
    );
  }

  @override
  void onGetFilterReportsSuccess() {
    String msg = "Got filter reports successfully!";
    logger.d(msg);
    _showSnackBar(msg, false);
  }

  @override
  void onGetFilterReportsError(String errorTxt) {
    String msg = "Unable to retrieve reports!";
    logger.d(msg);
    _showSnackBar(msg, true);
    setState(() {
      _isRetrievingReports = false;
    });
  }

  @override
  void onGetCitiesSuccess(List<City> cities) {
    String msg = "Got cities successfully!";
    logger.d(msg);
    _showSnackBar(msg, false);
    logger.d("Cities: $cities");

    setState(() => _cities = cities);
  }

  @override
  void onGetCitiesError(errorTxt) {
    String msg = "Unable to retrieve cities!";
    logger.d(msg);
    _showSnackBar(msg, true);
  }



}
