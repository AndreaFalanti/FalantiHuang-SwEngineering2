import 'package:flutter/material.dart';

void _showSnackBar(GlobalKey<ScaffoldState> scaffoldKey,String text, bool error) {
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