import 'package:logger/logger.dart';
import 'package:safestreets/models/user.dart';
import 'package:safestreets/utils/enum_util.dart';

class Report {
  int _id;
  String _timestamp;
  String _licensePlate;
  List<String> _photos;
  ReportStatus _reportStatus;
  String _violationType;
  double _latitude;
  double _longitude;
  String _place;
  String _city;
  User _submitter;
  User _supervisor;

  int get id => _id;
  String get timestamp => _timestamp;
  String get licensePlate => _licensePlate;
  List<String> get photos => _photos;
  ReportStatus get reportStatus => _reportStatus;
  String get violationType => _violationType;
  double get latitude => _latitude;
  double get longitude => _longitude;
  String get place => _place;
  String get city => _city;
  User get submitter => _submitter;
  User get supervisor => _supervisor;

  Report.map(dynamic obj) {
    this._id = obj["id"];
    this._timestamp = obj["timestamp"];
    this._licensePlate = obj["license_plate"];
    try {
      this._photos = obj["photos"].cast<String>();
    } catch (error) {
      // for possible emty photos field
      Logger().d(error.toString());
    }
    this._reportStatus = enumFromString<ReportStatus>(
        obj["report_status"].toString().toLowerCase(), ReportStatus.values);
    this._violationType = obj["violation_type"];
    this._latitude = double.parse(obj["latitude"]);
    this._longitude = double.parse(obj["longitude"]);
    this._place = obj["place"];
    this._city = obj["city"];
    try {
      //Logger().d("Trying to map submitter");
      this._submitter = new User.map(obj["submitter"]);
      //Logger().d("Mapped submitter successfully: ${_submitter.firstName}");
      this._supervisor = new User.map(obj["supervisor"]);
    } catch (error) {
      Logger().e(error.toString());
    }
  }

  Map<String, dynamic> toMap() {
    var map = new Map<String, dynamic>();
    map["id"] = _id;
    map["timestamp"] = _timestamp;
    map["license_plate"] = _licensePlate;
    map["photos"] = _photos;
    map["report_status"] = _reportStatus;
    map["violation_type"] = _violationType;
    map["latitude"] = _latitude;
    map["longitude"] = _longitude;
    map["place"] = _place;
    map["city"] = _city;
    map["submitter"] = _submitter;
    map["supervisor"] = _supervisor;

    return map;
  }

  String formattedTimestamp() {
    int tIndex = timestamp.indexOf("T");
    int dotIndex = timestamp.indexOf(".");
    String day = timestamp.substring(0, tIndex);
    String hour = timestamp.substring(tIndex+1, dotIndex);

    return day + " " + hour;
  }

  @override
  toString() {
    return this.toMap().toString();
  }

  

}

enum ReportStatus {
  pending,
  validated,
  invalidated,
}

enum ViolationType {
  double_parking,
  invalid_handicap_parking,
  bike_lane_parking,
  red_zone_parking,
  parking_disk_violation,
  other
}
