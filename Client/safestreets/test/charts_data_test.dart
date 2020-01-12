import 'package:flutter_test/flutter_test.dart';
import 'package:safestreets/models/report.dart';
import 'package:safestreets/screens/analyze_data/charts.dart';

void main() {
  group('Charts data', () {
    test('reports by date', () {
      Map expectedMap = {
        "id": 1,
        "timestamp": "2020-01-01T00:00:00.000Z",
        "license_plate": "license_plate",
        "photos": [""],
        "report_status": "validated",
        "violation_type": "double_parking",
        "latitude": "0.0",
        "longitude": "0.0",
        "place": "place",
        "city": "Milano",
        "submitter": null,
        "supervisor": null,
      };
      List<Report> reports = [new Report.map(expectedMap), new Report.map(expectedMap)];

      List<ReportsByDate> reportsByDate = ReportsByDate.getReportsByDate(reports);

      expect(reportsByDate.length, 1);
      expect(reportsByDate[0].quantity, 2);
      expect(reportsByDate[0].time, DateTime.parse("2020-01-01 00:00:00"));
    });

    test('reports by city', () {
      Map expectedMap = {
        "id": 1,
        "timestamp": "2020-01-01T00:00:00.000Z",
        "license_plate": "license_plate",
        "photos": [""],
        "report_status": "validated",
        "violation_type": "double_parking",
        "latitude": "0.0",
        "longitude": "0.0",
        "place": "place",
        "city": "Milano",
        "submitter": null,
        "supervisor": null,
      };
      List<Report> reports = [new Report.map(expectedMap), new Report.map(expectedMap)];

      List<ReportsByCity> reportsByCity = ReportsByCity.getReportsByCity(reports);

      expect(reportsByCity.length, 1);
      expect(reportsByCity[0].quantity, 2);
      expect(reportsByCity[0].city, "Milano");

    });

    test('reports by violation type', () {
      Map expectedMap = {
        "id": 1,
        "timestamp": "2020-01-01T00:00:00.000Z",
        "license_plate": "license_plate",
        "photos": [""],
        "report_status": "validated",
        "violation_type": "double_parking",
        "latitude": "0.0",
        "longitude": "0.0",
        "place": "place",
        "city": "Milano",
        "submitter": null,
        "supervisor": null,
      };
      List<Report> reports = [new Report.map(expectedMap), new Report.map(expectedMap)];

      List<ReportsByViolationType> reportsByViolationType = ReportsByViolationType.getReportsByViolationType(reports);

      expect(reportsByViolationType.length, 1);
      expect(reportsByViolationType[0].quantity, 2);
      expect(reportsByViolationType[0].violationType, "double parking");

    });

    test('list of reports with different time', () {
      Map expectedMap1 = {
        "id": 1,
        "timestamp": "2020-01-01T00:00:00.000Z",
        "license_plate": "license_plate",
        "photos": [""],
        "report_status": "validated",
        "violation_type": "double_parking",
        "latitude": "0.0",
        "longitude": "0.0",
        "place": "place",
        "city": "Milano",
        "submitter": null,
        "supervisor": null,
      };

      Map expectedMap2 = {
        "id": 1,
        "timestamp": "2020-01-02T00:00:00.000Z",
        "license_plate": "license_plate",
        "photos": [""],
        "report_status": "validated",
        "violation_type": "double_parking",
        "latitude": "0.0",
        "longitude": "0.0",
        "place": "place",
        "city": "Milano",
        "submitter": null,
        "supervisor": null,
      };
      List<Report> reports = [new Report.map(expectedMap1), new Report.map(expectedMap2)];

      List<ReportsByDate> reportsByDate = ReportsByDate.getReportsByDate(reports);

      expect(reportsByDate.length, 2);
      expect(reportsByDate[0].quantity, 1);
      expect(reportsByDate[0].time, DateTime.parse("2020-01-01 00:00:00"));
      expect(reportsByDate[1].quantity, 1);
      expect(reportsByDate[1].time, DateTime.parse("2020-01-02 00:00:00"));
    });

    test('list of reports with different cities', () {
      Map expectedMap1 = {
        "id": 1,
        "timestamp": "2020-01-01T00:00:00.000Z",
        "license_plate": "license_plate",
        "photos": [""],
        "report_status": "validated",
        "violation_type": "double_parking",
        "latitude": "0.0",
        "longitude": "0.0",
        "place": "place",
        "city": "Milano",
        "submitter": null,
        "supervisor": null,
      };

      Map expectedMap2 = {
        "id": 1,
        "timestamp": "2020-01-02T00:00:00.000Z",
        "license_plate": "license_plate",
        "photos": [""],
        "report_status": "validated",
        "violation_type": "double_parking",
        "latitude": "0.0",
        "longitude": "0.0",
        "place": "place",
        "city": "Roma",
        "submitter": null,
        "supervisor": null,
      };
      List<Report> reports = [new Report.map(expectedMap1), new Report.map(expectedMap2)];

      List<ReportsByCity> reportsByCity = ReportsByCity.getReportsByCity(reports);

      expect(reportsByCity.length, 2);
      expect(reportsByCity[0].quantity, 1);
      expect(reportsByCity[0].city, "Milano");
      expect(reportsByCity[1].quantity, 1);
      expect(reportsByCity[1].city, "Roma");

    });

    test('list of reports with different violation types', () {
      Map expectedMap1 = {
        "id": 1,
        "timestamp": "2020-01-01T00:00:00.000Z",
        "license_plate": "license_plate",
        "photos": [""],
        "report_status": "validated",
        "violation_type": "double_parking",
        "latitude": "0.0",
        "longitude": "0.0",
        "place": "place",
        "city": "Milano",
        "submitter": null,
        "supervisor": null,
      };

      Map expectedMap2 = {
        "id": 1,
        "timestamp": "2020-01-02T00:00:00.000Z",
        "license_plate": "license_plate",
        "photos": [""],
        "report_status": "validated",
        "violation_type": "bike_lane_parking",
        "latitude": "0.0",
        "longitude": "0.0",
        "place": "place",
        "city": "Milano",
        "submitter": null,
        "supervisor": null,
      };
      List<Report> reports = [new Report.map(expectedMap1), new Report.map(expectedMap2)];

      List<ReportsByViolationType> reportsByViolationType = ReportsByViolationType.getReportsByViolationType(reports);

      expect(reportsByViolationType.length, 2);
      expect(reportsByViolationType[0].quantity, 1);
      expect(reportsByViolationType[0].violationType, "double parking");
      expect(reportsByViolationType[1].quantity, 1);
      expect(reportsByViolationType[1].violationType, "bike lane parking");

    });

  });
}