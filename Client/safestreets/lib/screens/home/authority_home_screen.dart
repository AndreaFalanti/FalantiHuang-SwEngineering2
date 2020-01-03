import 'package:flutter/material.dart';

class AuthorityHomeScreen extends StatelessWidget {

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
                //TODO logout
                Navigator.pushReplacementNamed(context, '/');
              })
        ],),
      body: new Center(
        child: new Text("Welcome to authority home!"),
      ),

    );
  }

}