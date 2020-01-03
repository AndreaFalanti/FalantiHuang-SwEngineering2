class User {
  String _email;
  String _firstName;
  String _lastName;
  String _password;
  String _orgName;
  String _orgCity;
  String _orgType;
  User(this._email, this._password);

  User.map(dynamic obj) {
    this._email = obj["email"];
    this._firstName = obj["firstname"];
    this._lastName = obj["lastname"];
    this._password = obj["password"];
    if (obj["org_name"] != null) {
      this._orgName = obj["org_name"];
      this._orgCity = obj["org_city"];
      this._orgType = obj["org_type"];
    }
  }

  String get email => _email;
  String get firstName => _firstName;
  String get lastName => _lastName;
  String get password => _password;
  String get orgName => _orgName;
  String get orgCity => _orgCity;
  String get orgType => _orgType;

  Map<String, dynamic> toMap() {
    var map = new Map<String, dynamic>();
    map["email"] = _email;
    map["firstname"] = _firstName;
    map["lastname"] = _lastName;
    map["password"] = _password;
    if (_orgName != null) {
      map["org_name"] = _orgName;
      map["org_city"] = _orgCity;
      map["org_type"] = _orgType;
    }
    return map;
  }
}