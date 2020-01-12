import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:logger/logger.dart';
import 'package:safestreets/models/report.dart';
import 'package:charts_flutter/flutter.dart' as charts;

class ChartsScreen extends StatefulWidget {
  final List<Report> reports;

  ChartsScreen({Key key, @required this.reports}) : super(key: key);

  @override
  ChartsScreenState createState() => ChartsScreenState();
}

@visibleForTesting
class ChartsScreenState extends State<ChartsScreen> {

  List<charts.Series<ReportsByDate, DateTime>> _dateSeriesList;
  List<charts.Series<ReportsByCity, String>> _citySeriesList;
  List<charts.Series<ReportsByViolationType, String>> _violationSeriesList;
  bool animate = true;

  var logger = Logger();

  @override
  void initState() {
    super.initState();
    _dateSeriesList = new List<charts.Series<ReportsByDate, DateTime>>();
    _citySeriesList = new List<charts.Series<ReportsByCity, String>>();
    _violationSeriesList = new List<charts.Series<ReportsByViolationType, String>>();

    _dateSeriesList.add(
      charts.Series(
        domainFn: (ReportsByDate _reportsByDate, _) => _reportsByDate.time,
        measureFn: (ReportsByDate _reportsByDate, _) => _reportsByDate.quantity,
        id: 'Reports by date',
        data: ReportsByDate.getReportsByDate(widget.reports),
        fillPatternFn: (_, __) => charts.FillPatternType.solid,
        fillColorFn: (ReportsByDate _reportsByDate, _) =>
            charts.ColorUtil.fromDartColor(Colors.green),
      ),
    );
    _citySeriesList.add(
      charts.Series(
        domainFn: (ReportsByCity _reportsByCity, _) => _reportsByCity.city,
        measureFn: (ReportsByCity _reportsByCity, _) => _reportsByCity.quantity,
        id: 'Reports by city',
        data: ReportsByCity.getReportsByCity(widget.reports),
        labelAccessorFn: (ReportsByCity row, _) => '${row.quantity}',
        fillPatternFn: (_, __) => charts.FillPatternType.solid,
      ),
    );
    _violationSeriesList.add(
      charts.Series(
        domainFn: (ReportsByViolationType _reportsByViolationType, _) => _reportsByViolationType.violationType,
        measureFn: (ReportsByViolationType _reportsByViolationType, _) => _reportsByViolationType.quantity,
        id: 'Reports by city',
        data: ReportsByViolationType.getReportsByViolationType(widget.reports),
        labelAccessorFn: (ReportsByViolationType row, _) => '${row.quantity}',
        fillPatternFn: (_, __) => charts.FillPatternType.solid,
      ),
    );

  }

  @override
  Widget build(BuildContext context) {

    try {
      return DefaultTabController(
          length: 3,
          child: Scaffold(
            appBar: AppBar(
              title: Text("Data analysis"),
              bottom: TabBar(
                indicatorColor: Colors.black,
                tabs: <Widget>[
                  Tab(
                    icon: Icon(FontAwesomeIcons.solidChartBar),
                  ),
                  Tab(icon: Icon(FontAwesomeIcons.chartPie)),
                  Tab(icon: Icon(FontAwesomeIcons.chartPie)),
                ],
              ),
            ),
            body: TabBarView(
                children: [
                  Padding(
                    padding: EdgeInsets.all(20.0),
                    child: Container(
                      width: 200,
                      height: 200,
                      child: Center(
                        child: Column(
                          children: <Widget>[
                            Text(
                              'Reports by date',style: TextStyle(fontSize: 24.0,fontWeight: FontWeight.bold),),
                            Expanded(
                              child: new charts.TimeSeriesChart(
                                _dateSeriesList,
                                animate: animate,
                                // Set the default renderer to a bar renderer.
                                // This can also be one of the custom renderers of the time series chart.
                                defaultRenderer: new charts.BarRendererConfig<DateTime>(),
                                // It is recommended that default interactions be turned off if using bar
                                // renderer, because the line point highlighter is the default for time
                                // series chart.
                                defaultInteractions: false,
                                // If default interactions were removed, optionally add select nearest
                                // and the domain highlighter that are typical for bar charts.
                                //behaviors: [new charts.SelectNearest(), new charts.DomainHighlighter()],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Container(
                      child: Center(
                        child: Column(
                          children: <Widget>[
                            Text(
                              'Reports by violation type',style: TextStyle(fontSize: 24.0,fontWeight: FontWeight.bold),),
                            SizedBox(height: 10.0,),
                            Expanded(
                              child: charts.PieChart(
                                  _violationSeriesList,
                                  animate: animate,
                                  behaviors: [
                                    new charts.DatumLegend(
                                      outsideJustification: charts.OutsideJustification.endDrawArea,
                                      horizontalFirst: false,
                                      desiredMaxRows: 4,
                                      cellPadding: new EdgeInsets.only(right: 4.0, bottom: 4.0),
                                      entryTextStyle: charts.TextStyleSpec(
                                          color: charts.MaterialPalette.black,
                                          fontFamily: 'Monserrat',
                                          fontSize: 11),
                                    )
                                  ],
                                  defaultRenderer: new charts.ArcRendererConfig(
                                      arcWidth: 100,
                                      arcRendererDecorators: [
                                        new charts.ArcLabelDecorator(
                                            labelPosition: charts.ArcLabelPosition.inside
                                        )
                                      ])
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Container(
                      child: Center(
                        child: Column(
                          children: <Widget>[
                            Text(
                              'Reports by city',style: TextStyle(fontSize: 24.0,fontWeight: FontWeight.bold),),
                            SizedBox(height: 10.0,),
                            Expanded(
                              child: charts.PieChart(
                                  _citySeriesList,
                                  animate: animate,
                                  behaviors: [
                                    new charts.DatumLegend(
                                      outsideJustification: charts.OutsideJustification.endDrawArea,
                                      horizontalFirst: false,
                                      desiredMaxRows: 4,
                                      cellPadding: new EdgeInsets.only(right: 4.0, bottom: 4.0),
                                      entryTextStyle: charts.TextStyleSpec(
                                          color: charts.MaterialPalette.purple.shadeDefault,
                                          fontFamily: 'Monserrat',
                                          fontSize: 11),
                                    )
                                  ],
                                  defaultRenderer: new charts.ArcRendererConfig(
                                      arcWidth: 100,
                                      arcRendererDecorators: [
                                        new charts.ArcLabelDecorator(
                                            labelPosition: charts.ArcLabelPosition.inside)
                                      ])),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ]
            ),
          )
      );
    } catch (error) {
      logger.e(error.toString());
    }
  }
}

@visibleForTesting
class ReportsByDate {
  DateTime time;
  int quantity;

  ReportsByDate(this.time, this.quantity);

  static List<ReportsByDate> getReportsByDate(List<Report> reports) {

    Set<DateTime> dates = reports
        .map((report) =>
        DateTime.parse(report.formattedTimestamp().split(" ").first+" 00:00:00"))
        .toSet();
    Logger().d("Dates: $dates");

    var groupedReports = dates
        .map((date) =>
        reports
            .where((report) =>
        DateTime.parse(report.formattedTimestamp().split(" ").first+" 00:00:00").compareTo(date) == 0)
            .toList())
        .toList();

    var timeSeriesData = new List<ReportsByDate>();
    for (List<Report> reports in groupedReports) {
      timeSeriesData.add(new ReportsByDate(DateTime.parse(reports.first.formattedTimestamp().split(" ").first+" 00:00:00"), reports.length));
    }
    Logger().d("Time Series: $timeSeriesData");

    return timeSeriesData;
  }
}

@visibleForTesting
class ReportsByViolationType {
  String violationType;
  int quantity;

  ReportsByViolationType(this.violationType, this.quantity);

  static List<ReportsByViolationType> getReportsByViolationType(List<Report> reports) {

    Set<String> violationTypes = reports.map((report) => report.violationType).toSet();
    Logger().d("Violation types: $violationTypes");

    var groupedReports = violationTypes
        .map((violationType) =>
        reports
            .where((report) => report.violationType.compareTo(violationType) == 0).toList())
        .toList();

    var timeSeriesData = new List<ReportsByViolationType>();
    for (List<Report> reports in groupedReports) {
      timeSeriesData.add(new ReportsByViolationType(reports.first.violationType.replaceAll("_", " "), reports.length));
    }
    Logger().d("City Series: $timeSeriesData");

    return timeSeriesData;
  }
}

@visibleForTesting
class ReportsByCity {
  String city;
  int quantity;

  ReportsByCity(this.city, this.quantity);

  static List<ReportsByCity> getReportsByCity(List<Report> reports) {

    Set<String> cities = reports.map((report) => report.city).toSet();
    Logger().d("cities: $cities");

    var groupedReports = cities
        .map((city) =>
        reports
            .where((report) => report.city.compareTo(city) == 0).toList())
        .toList();

    var timeSeriesData = new List<ReportsByCity>();
    for (List<Report> reports in groupedReports) {
      timeSeriesData.add(new ReportsByCity(reports.first.city, reports.length));
    }
    Logger().d("City Series: $timeSeriesData");

    return timeSeriesData;
  }
}

