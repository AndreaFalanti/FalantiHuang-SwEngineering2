import 'dart:io';
import 'dart:ui';
import 'package:logger/logger.dart';


import 'package:flutter/material.dart';
import 'package:safestreets/auth.dart';
import 'package:safestreets/models/user.dart';
import 'package:safestreets/screens/login/login_screen_presenter.dart';

class LoginScreen extends StatefulWidget {

  @override
  State<StatefulWidget> createState() => new LoginScreenState();
}

class LoginScreenState extends State<LoginScreen>
    implements LoginScreenContract, AuthStateListener {

  BuildContext _ctx;
  TextStyle style = TextStyle(fontFamily: 'Montserrat', fontSize: 20.0);

  bool _isLoading = false;
  final formKey = new GlobalKey<FormState>();
  final scaffoldKey = new GlobalKey<ScaffoldState>();
  String _password, _email;

  LoginScreenPresenter _presenter;

  var logger = Logger();

  LoginScreenState() {
    _presenter = new LoginScreenPresenter(this);
    var authStateProvider = new AuthStateProvider();
    authStateProvider.subscribe(this);
  }

  void _submit() {
    final form = formKey.currentState;

    if (form.validate()) {
      setState(() => _isLoading = true);
      form.save();
      _presenter.doLogin(_email, _password);
    }
  }

  void _showSnackBar(String text, bool error) {
    Color color = error ? Colors.red : Colors.green;

    final snackBar = new SnackBar(
      content: new Text(text),
      duration: new Duration(seconds: 3),
      backgroundColor: color,
      action: new SnackBarAction(label: "Ok", onPressed: (){
        print("Press Ok on SnackBar");
      }),
    );

    scaffoldKey.currentState.showSnackBar(snackBar);
  }

  @override
  Widget build(BuildContext context) {
    _ctx = context;

    var loginBtn = Material( // widget to add shadow(elevation) to the button
      elevation: 15.0,
      borderRadius: BorderRadius.circular(30.0),
      color: Colors.lightBlue,
      child: MaterialButton(
        minWidth: MediaQuery.of(context).size.width/3,
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        onPressed: _submit,
        child: Text("Login",
            textAlign: TextAlign.center,
            style: style.copyWith(
                color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );

    var citizenSignUpBtn = Material( // widget to add shadow(elevation) to the button
      elevation: 15.0,
      borderRadius: BorderRadius.circular(30.0),
      color: Colors.indigo,
      child: MaterialButton(
        minWidth: 230.0,
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        onPressed: () {
          Navigator.pushNamed(context, '/citizen_signup');
        },
        child: Text("Register as citizen",
            textAlign: TextAlign.center,
            style: style.copyWith(
                color: Colors.white, fontWeight: FontWeight.normal)),
      ),
    );

    var authSignUpBtn = Material( // widget to add shadow(elevation) to the button
      elevation: 15.0,
      borderRadius: BorderRadius.circular(30.0),
      color: Colors.indigo,
      child: MaterialButton(
        minWidth: 230.0,
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        onPressed: () {
          Navigator.pushNamed(context, '/authority_signup');
        },
        child: Text("Register as authority",
            textAlign: TextAlign.center,
            style: style.copyWith(
                color: Colors.white, fontWeight: FontWeight.normal)),
      ),
    );

    final emailField = new Padding(
      padding: EdgeInsets.fromLTRB(20.0, 30.0, 20.0, 15.0),
      child: new TextFormField(
        onSaved: (val) => _email = val,
        validator: (val) {
          final regExp = RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
          return !regExp.hasMatch(val)
              ? "Email is not valid"
              : null;
        },
        decoration: InputDecoration(
            filled: true,
            fillColor: Colors.lightBlue.withOpacity(0.2),
            contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
            hintText: "Email",
            border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
      ),
    );

    final passwordField = new Padding(
      padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
      child: new TextFormField(
        obscureText: true,
        onSaved: (val) => _password = val,
        validator: (val) {
          return val.length < 6
              ? "Password must have at least 6 chars"
              : null;
        },
        decoration: InputDecoration(
            filled: true,
            fillColor: Colors.lightBlue.withOpacity(0.2),
            contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
            hintText: "Password",
            border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
      ),
    );

    var loginForm = new Column(
      children: <Widget>[
        SizedBox(height: 10),
        new Form(
          key: formKey,
          child: new Column(
            children: <Widget>[
              emailField,
              passwordField
            ],
          ),
        ),
        _isLoading ? new CircularProgressIndicator() : loginBtn,
        SizedBox(height: 20,),
        new Center(
          child: Text("Don't have an account?"),
        ),
        SizedBox(height: 20,),
        citizenSignUpBtn,
        SizedBox(height: 20,),
        authSignUpBtn
      ],
      crossAxisAlignment: CrossAxisAlignment.center,
    );

    return new Scaffold(
      appBar: null,
      key: scaffoldKey,
      backgroundColor: Colors.lightBlue,
      body: new Container(
        child: new Center(
          child: new ClipRect(
            child: new BackdropFilter(
              filter: new ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0),
              child: new Container(
                height: 700.0,
                child: new Column(
                  children: <Widget>[
                    SizedBox(
                      height: 100.0,
                      child: Image(
                        image: AssetImage('assets/images/logo.png'),
                      ),
                    ),
                    SizedBox(height: 10),
                    Text("SafeStreets", style: TextStyle(fontFamily: 'Montserrat', color: Colors.white,fontSize: 30.0, fontWeight: FontWeight.w600)),
                    SizedBox(height: 10),
                    new Material(
                      elevation: 10.0,
                      borderRadius: BorderRadius.circular(20.0),
                      child: new Container(
                        child: loginForm,
                        height: 480.0,
                        width: 300.0,
                      ),
                    )
                  ],
                ),
              )
            ),
          ),
        ),
      ),
    );
  }

  @override
  onAuthStateChanged(AuthState state) {

    if(state == AuthState.LOGGED_IN)
      Navigator.of(_ctx).pushReplacementNamed("/home");
  }

  @override
  void onLoginError(String errorTxt) {
    logger.d("Login error");
    String errorMsg = errorTxt;
    String errorCode = 400.toString();
    if (errorTxt.contains(errorCode)) {
      errorMsg = "Invalid login";
    }
    _showSnackBar(errorMsg, true);
    setState(() => _isLoading = false);
  }

  @override
  void onLoginSuccess(User user) async {
    String orgName = (user.orgName == null) ? "" : user.orgName;
    logger.d("login success: "+user.firstName + " " + user.lastName + "\nOrgName: " + orgName);

    _showSnackBar(user.firstName + " " + user.lastName
        + " your login was successful!", false);

    setState(() => _isLoading = false);
    if (user.orgName == null) {
      Navigator.pushReplacementNamed(context, '/citizen_home');
    } else {
      Navigator.pushReplacementNamed(context, '/authority_home');
    }

//    var db = new DatabaseHelper();
//    await db.saveUser(user);
//    var authStateProvider = new AuthStateProvider();
//    authStateProvider.notify(AuthState.LOGGED_IN);
  }
}