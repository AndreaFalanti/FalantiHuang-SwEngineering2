import 'package:flutter_test/flutter_test.dart';
import 'package:safestreets/utils/enum_util.dart';
import 'package:safestreets/models/report.dart';

void main() {
  group('Enum', (){
    test('enum object to string', () {
      expect(enumToString(ReportStatus.pending), 'pending');
      expect(enumToString(ReportStatus.invalidated), 'invalidated');
      expect(enumToString(ReportStatus.validated), 'validated');

      expect(enumToString(ViolationType.bike_lane_parking), 'bike_lane_parking');
    });

    test('enum object from string', () {
      expect(enumFromString('double_parking', ViolationType.values), ViolationType.double_parking);
      expect(enumFromString('invalid_handicap_parking', ViolationType.values), ViolationType.invalid_handicap_parking);
      expect(enumFromString('bike_lane_parking', ViolationType.values), ViolationType.bike_lane_parking);
      expect(enumFromString('red_zone_parking', ViolationType.values), ViolationType.red_zone_parking);
      expect(enumFromString('parking_disk_violation', ViolationType.values), ViolationType.parking_disk_violation);
      expect(enumFromString('other', ViolationType.values), ViolationType.other);
    });

    test('enum values to list of string', () {
      Set<String> expectedSet = [ReportStatus.pending, ReportStatus.invalidated, ReportStatus.validated].map((val) => enumToString(val)).toSet();
      expect(enumValues(ReportStatus.values).toSet(), expectedSet);
      expectedSet = [ViolationType.double_parking, ViolationType.invalid_handicap_parking, ViolationType.bike_lane_parking, ViolationType.red_zone_parking, ViolationType.parking_disk_violation, ViolationType.other].map((val) => enumToString(val)).toSet();
      expect(enumValues(ViolationType.values), expectedSet);
    });
  });



}