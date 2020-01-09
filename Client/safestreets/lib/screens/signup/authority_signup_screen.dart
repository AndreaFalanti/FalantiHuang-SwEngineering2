import 'dart:ui';
import 'package:logger/logger.dart';


import 'package:flutter/material.dart';
import 'package:safestreets/screens/signup/signup_screen_presenter.dart';

class AuthoritySignUpScreen extends StatefulWidget {

  @override
  State<StatefulWidget> createState() => new AuthoritySignUpScreenState();
}

class AuthoritySignUpScreenState extends State<AuthoritySignUpScreen>
    implements SignupScreenContract {
  BuildContext _ctx;
  TextStyle style = TextStyle(fontFamily: 'Montserrat', fontSize: 20.0);

  bool _isLoading = false;
  final formKey = new GlobalKey<FormState>();
  final scaffoldKey = new GlobalKey<ScaffoldState>();
  final passKey = GlobalKey<FormFieldState>();
  String _firstName, _lastName, _email, _password, _confirmPassword;
  bool _termIsChecked = false;

  SignUpScreenPresenter _presenter;

  var logger = Logger();

  AuthoritySignUpScreenState() {
    _presenter = new SignUpScreenPresenter(this);
  }

  void _showSnackBar(String text, bool error) {
    Color color = error ? Colors.red : Colors.green;

    final snackBar = new SnackBar(
      content: new Text(text),
      duration: new Duration(seconds: 5),
      backgroundColor: color,
      action: new SnackBarAction(label: "Ok", onPressed: (){
        if (!error) {
          Navigator.pop(context);
        }
      }),
    );

    scaffoldKey.currentState.showSnackBar(snackBar);
  }

  void _submit() {
    final form = formKey.currentState;

    if (form.validate()) {

      form.save();
      if (_termIsChecked) {
        setState(() => _isLoading = true);
        _presenter.doSignUp(
            _firstName, _lastName, _email, _password, _confirmPassword);
      } else {
        _showSnackBar("You must agree to terms of SafeStreets if you want to "
            "to use the app", true);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    _ctx = context;

    final firstNameField = new Padding(
      padding: EdgeInsets.fromLTRB(20.0, 20.0, 20.0, 10.0),
      child: new TextFormField(
        onSaved: (val) => _firstName = val,
        validator: (val) {
          return val.length < 1
              ? "This field must not be empty"
              : null;
        },
        decoration: InputDecoration(
            filled: true,
            fillColor: Colors.lightBlue.withOpacity(0.2),
            contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
            hintText: "First Name",
            border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
      ),
    );

    final lastNameField = new Padding(
      padding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
      child: new TextFormField(
        onSaved: (val) => _lastName = val,
        validator: (val) {
          return val.length < 1
              ? "This field must not be empty"
              : null;
        },
        decoration: InputDecoration(
            filled: true,
            fillColor: Colors.lightBlue.withOpacity(0.2),
            contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
            hintText: "Last Name",
            border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
      ),
    );

    final emailField = new Padding(
      padding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
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
            hintText: "PEC Email",
            border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
      ),
    );

    final passwordField = new Padding(
      padding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
      child: new TextFormField(
        key: passKey,
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

    final confirmPasswordField = new Padding(
      padding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
      child: new TextFormField(
        obscureText: true,
        onSaved: (val) => _confirmPassword = val,
        validator: (val) {
          var password = passKey.currentState.value;
          return !(val.compareTo(password) == 0)
              ? "Password does not match"
              : null;
        },
        decoration: InputDecoration(
            filled: true,
            fillColor: Colors.lightBlue.withOpacity(0.2),
            contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
            hintText: "Confirm password",
            border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
      ),
    );

    final termsCheckBox = new Row(children: <Widget>[
      Checkbox(
          value: _termIsChecked,
          onChanged:(bool value) {
            setState(() {
              _termIsChecked = value;
            });
          }),
      Text("I agree to the SafeStreets Terms\n of Service and Privacy Policy")
    ],);

    final signUpBtn = Material( // widget to add shadow(elevation) to the button
      elevation: 15.0,
      borderRadius: BorderRadius.circular(30.0),
      color: Colors.lightBlue,
      child: MaterialButton(
        minWidth: MediaQuery.of(context).size.width/3,
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        onPressed: _submit,
        child: Text("Sign Up",
            textAlign: TextAlign.center,
            style: style.copyWith(
                color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );

    var signUpForm = new Column(
      children: <Widget>[
        SizedBox(height: 10),
        new Form(
          key: formKey,
          child: new Column(
            children: <Widget>[
              firstNameField,
              lastNameField,
              emailField,
              passwordField,
              confirmPasswordField
            ],
          ),
        ),
        SizedBox(height: 10.0,),
        termsCheckBox,
        SizedBox(height: 10.0,),
        _isLoading ? new CircularProgressIndicator() : signUpBtn,
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
                  height: 800.0,
                  width: 300.0,
                  child: new ListView(
                    children: <Widget>[
                      SizedBox(
                        height: 100.0,
                        child: Image(
                          image: AssetImage('assets/images/logo.png'),
                        ),
                      ),
                      Container(
                        alignment: Alignment.center,
                        child: Text("SafeStreets", style: TextStyle(fontFamily: 'Montserrat', color: Colors.white,fontSize: 30.0, fontWeight: FontWeight.w600)),
                      ),
                      SizedBox(height: 10,),
                      new Material(
                        elevation: 5.0,
                        borderRadius: BorderRadius.circular(20.0),
                        child: new Container(
                          child: signUpForm,
                          height: 600.0,
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
  void onSignUpError(String errorTxt) {
    logger.d("Signup error");
    String errorMsg = errorTxt;
    String errorCode = 400.toString();
    if (errorTxt.contains(errorCode)) {
      errorMsg = "Email already taken";
    }
    _showSnackBar(errorMsg, true);
    setState(() => _isLoading = false);
  }

  @override
  void onSignUpSuccess() {
    logger.d("Sign up success: " + _firstName + " " + _lastName);

    _showSnackBar(_firstName + " " + _lastName
        + " your signup was successful!", false);
    setState(() => _isLoading = false);

  }

}