class City {
  int _id;
  String _name;
  String _region;
  City(this._id);

  int get id => _id;
  String get name => _name;
  String get region => _region;

  City.map(dynamic obj) {
    this._id = obj["id"];
    this._name = obj["name"];
    this._region = obj["region"];
  }

  Map<String, dynamic> toMap() {
    var map = new Map<String, dynamic>();
    map["id"] = _id;
    map["name"] = _name;
    map["region"] = _region;
    return map;
  }


}