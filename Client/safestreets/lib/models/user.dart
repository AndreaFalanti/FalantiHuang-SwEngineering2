import 'package:logger/logger.dart';

class User {
  String _email;
  String _firstName;
  String _lastName;
  String _orgName;
  String _orgCity;
  String _orgType;

  User.map(dynamic obj) {
    try {
      this._email = obj["email"];
      this._firstName = obj["firstname"];
      this._lastName = obj["lastname"];
      if (obj["org_name"] != null) {
        this._orgName = obj["org_name"];
        this._orgCity = obj["org_city"];
        this._orgType = obj["org_type"];
      }
    } catch (error) {
      //Logger().e(error.toString());
    }
  }

  String get email => _email;
  String get firstName => _firstName;
  String get lastName => _lastName;
  String get orgName => _orgName;
  String get orgCity => _orgCity;
  String get orgType => _orgType;

  Map<String, dynamic> toMap() {
    var map = new Map<String, dynamic>();
    map["email"] = _email;
    map["firstname"] = _firstName;
    map["lastname"] = _lastName;
    if (_orgName != null) {
      map["org_name"] = _orgName;
      map["org_city"] = _orgCity;
      map["org_type"] = _orgType;
    }
    return map;
  }

  @override
  String toString() {
    return toMap().toString();
  }
}