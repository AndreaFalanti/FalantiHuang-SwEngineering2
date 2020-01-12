import 'package:flutter_test/flutter_test.dart';
import 'package:safestreets/models/report.dart';
import 'package:safestreets/models/user.dart';

void main() {
  group('Object encoding', (){
    test('ctizen encoding', () {
      Map expectedMap = {
        "email": "example@example.com",
        "firstname": "giorno",
        "lastname": "giovanna",
      };
      User user = new User.map(expectedMap);
      expect(user.email, "example@example.com");
      expect(user.firstName, "giorno");
      expect(user.lastName, "giovanna");
      expect(user.orgName, null);
      expect(user.orgCity, null);
      expect(user.orgType, null);

      expect(user.toMap(), expectedMap);
    });

    test('authority encoding', () {
      Map expectedMap = {
        "email": "example@poliziamilano.com",
        "firstname": "giorno",
        "lastname": "giovanna",
        "org_name": "Polizia Milano",
        "org_city": "Milano",
        "org_type": "Polizia",
      };
      User user = new User.map(expectedMap);

      expect(user.email, "example@poliziamilano.com");
      expect(user.firstName, "giorno");
      expect(user.lastName, "giovanna");
      expect(user.orgName, "Polizia Milano");
      expect(user.orgCity, "Milano");
      expect(user.orgType, "Polizia");

      expect(user.toMap(), expectedMap);
    });

    test('report encoding without submitter and supervisor', (){
      Map expectedMap = {
        "id": 1,
        "timestamp": "timestamp",
        "license_plate": "license_plate",
        "photos": [""],
        "report_status": "pending",
        "violation_type": "double_parking",
        "latitude": "0.0",
        "longitude": "0.0",
        "place": "place",
        "city": "city",
        "submitter": null,
        "supervisor": null,
      };
      Report report = new Report.map(expectedMap);
      expect(report.id, 1);
      expect(report.timestamp, "timestamp");
      expect(report.licensePlate, "license_plate");
      expect(report.photos, [""]);
      expect(report.reportStatus, ReportStatus.pending);
      expect(report.latitude, 0.0);
      expect(report.longitude, 0.0);
      expect(report.place, "place");
      expect(report.city, "city");
      expect(report.submitter, isNotNull);
      expect(report.submitter.email, null);
      expect(report.submitter.firstName, null);
      expect(report.submitter.lastName, null);
      expect(report.supervisor, isNotNull);
      expect(report.supervisor.email, null);
      expect(report.supervisor.firstName, null);
      expect(report.supervisor.lastName, null);

    });

    test('report encoding with submitter and supervisor', (){
      Map expectedMap = {
        "id": 1,
        "timestamp": "timestamp",
        "license_plate": "license_plate",
        "photos": [""],
        "report_status": "pending",
        "violation_type": "double_parking",
        "latitude": "0.0",
        "longitude": "0.0",
        "place": "place",
        "city": "city",
        "submitter": {
          "email": "example@example.com",
          "firstname": "giorno",
          "lastname": "giovanna",
        },
        "supervisor": {
          "email": "example@poliziamilano.com",
          "firstname": "giorno",
          "lastname": "giovanna",
          "org_name": "Polizia Milano",
          "org_city": "Milano",
          "org_type": "Polizia",
        },
      };
      Report report = new Report.map(expectedMap);

      expect(report.id, 1);
      expect(report.timestamp, "timestamp");
      expect(report.licensePlate, "license_plate");
      expect(report.photos, [""]);
      expect(report.reportStatus, ReportStatus.pending);
      expect(report.latitude, 0.0);
      expect(report.longitude, 0.0);
      expect(report.place, "place");
      expect(report.city, "city");
      expect(report.submitter, isNotNull);
      expect(report.submitter.email, "example@example.com");
      expect(report.submitter.firstName, "giorno");
      expect(report.submitter.lastName, "giovanna");
      expect(report.submitter.orgName, null);
      expect(report.submitter.orgCity, null);
      expect(report.submitter.orgType, null);
      expect(report.supervisor, isNotNull);
      expect(report.supervisor.email, "example@poliziamilano.com");
      expect(report.supervisor.firstName, "giorno");
      expect(report.supervisor.lastName, "giovanna");
      expect(report.supervisor.orgName, "Polizia Milano");
      expect(report.supervisor.orgCity, "Milano");
      expect(report.supervisor.orgType, "Polizia");


      Map reportMap = report.toMap();
      expect(reportMap, expectedMap);
    });


  });
}