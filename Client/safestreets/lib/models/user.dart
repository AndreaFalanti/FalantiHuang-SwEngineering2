class User {
  String _email;
  String _firstname;
  String _lastname;
  String _password;
  User(this._email, this._password);

  User.map(dynamic obj) {
    this._email = obj["email"];
    this._firstname = obj["firstname"];
    this._lastname = obj["lastname"];
    this._password = obj["password"];
  }

  String get email => _email;
  String get firstname => _firstname;
  String get lastname => _lastname;
  String get password => _password;

  Map<String, dynamic> toMap() {
    var map = new Map<String, dynamic>();
    map["email"] = _email;
    map["firstname"] = _firstname;
    map["lastname"] = _lastname;
    map["password"] = _password;

    return map;
  }
}