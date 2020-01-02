import 'package:flutter/material.dart';

class NameTextField extends StatefulWidget{
  String hint, storeName;

  NameTextField(this.hint, this.storeName);

  @override
  State<StatefulWidget> createState() => NameTextFieldState();
}

class NameTextFieldState extends State<NameTextField> {
  @override
  Widget build(BuildContext context) {
    return new Padding(
      padding: EdgeInsets.fromLTRB(20.0, 20.0, 20.0, 10.0),
      child: new TextFormField(
        onSaved: (val) => widget.storeName = val,
        validator: (val) {
          return val.length < 1
              ? "This field must not be empty"
              : null;
        },
        decoration: InputDecoration(
            filled: true,
            fillColor: Colors.lightBlue.withOpacity(0.2),
            contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
            hintText: widget.hint,
            border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
      ),
    );
  }

}
class EmailTextField {
  EmailTextField(String hint) {

  }
}

class PasswordTextField {
  PasswordTextField(String hint) {

  }
}

class ConfirmPasswordTextField{ConfirmPasswordTextField(String hint, String storePassword, GlobalKey<FormFieldState> passKey) {
    new Padding(
      padding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
      child: new TextFormField(
        obscureText: true,
        onSaved: (val) => storePassword = val,
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
  }
}