import 'package:flutter/material.dart';
import 'package:safestreets/screens/home/authority_home_screen.dart';
import 'package:safestreets/screens/home/citizen_home_screen.dart';
import 'package:safestreets/screens/login/login_screen.dart';
import 'package:safestreets/screens/report_violations/report_violations_screen.dart';
import 'package:safestreets/screens/user_reports/user_reports_screen.dart';
import 'package:safestreets/screens/signup/authority_signup_screen.dart';
import 'package:safestreets/screens/signup/citizen_signup_screen.dart';

final routes = {
  '/' :          (BuildContext context) => new LoginScreen(),
  '/login':         (BuildContext context) => new LoginScreen(),
  '/citizen_home':         (BuildContext context) => new CitizenHomeScreen(),
  '/citizen_home/report_violations': (BuildContext context) => new ReportViolationScreen(),
  '/citizen_home/user_reports': (BuildContext context) => new UserReportsScreen(),
  '/authority_home':   (BuildContext context) => new AuthorityHomeScreen(),
  '/citizen_signup':   (BuildContext context) => new CitizenSignUpScreen(),
  '/authority_signup':   (BuildContext context) => new AuthoritySignUpScreen(),
};