import 'package:flutter/material.dart';
import 'package:safestreets/screens/home/home_screen.dart';
import 'package:safestreets/screens/login/login_screen.dart';
import 'package:safestreets/screens/signup/authority_signup_screen.dart';
import 'package:safestreets/screens/signup/citizen_signup_screen.dart';

final routes = {
  '/' :          (BuildContext context) => new LoginScreen(),
  '/login':         (BuildContext context) => new LoginScreen(),
  '/home':         (BuildContext context) => new HomeScreen(),
  '/citizen_signup':   (BuildContext context) => new CitizenSignUpScreen(),
  '/authority_signup':   (BuildContext context) => new AuthoritySignUpScreen(),
};