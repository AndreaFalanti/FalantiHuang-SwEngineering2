import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:logger/logger.dart';
import 'package:safestreets/models/report.dart';
import 'package:charts_flutter/flutter.dart' as charts;

class ChartsScreen extends StatefulWidget {
  final List<Report> reports;

  ChartsScreen({Key key, @required this.reports}) : super(key: key);

  @override
  _ChartsScreenState createState() => _ChartsScreenState();
}

class _ChartsScreenState extends State<ChartsScreen> {

  List<charts.Series<_ReportsByDate, DateTime>> _dateSeriesList;
  List<charts.Series<_ReportsByCity, String>> _citySeriesList;
  List<charts.Series<_ReportsByViolationType, String>> _violationSeriesList;
  bool animate = true;

  var logger = Logger();

  void getReportsByDate() {

    Set<DateTime> dates = widget.reports
        .map((report) =>
          DateTime.parse(report.formattedTimestamp().split(" ").first+" 00:00:00"))
        .toSet();
    logger.d("Dates: $dates");

    var groupedReports = dates
        .map((date) =>
            widget.reports
                .where((report) =>
                    DateTime.parse(report.formattedTimestamp().split(" ").first+" 00:00:00").compareTo(date) == 0)
                .toList())
        .toList();

    var timeSeriesData = new List<_ReportsByDate>();
    for (List<Report> reports in groupedReports) {
      timeSeriesData.add(new _ReportsByDate(DateTime.parse(reports.first.formattedTimestamp().split(" ").first+" 00:00:00"), reports.length));
    }
    logger.d("Time Series: $timeSeriesData");

    _dateSeriesList.add(
      charts.Series(
        domainFn: (_ReportsByDate _reportsByDate, _) => _reportsByDate.time,
        measureFn: (_ReportsByDate _reportsByDate, _) => _reportsByDate.quantity,
        id: 'Reports by date',
        data: timeSeriesData,
        fillPatternFn: (_, __) => charts.FillPatternType.solid,
        fillColorFn: (_ReportsByDate _reportsByDate, _) =>
            charts.ColorUtil.fromDartColor(Colors.green),
      ),
    );
  }

  void getReportsByCity() {

    Set<String> cities = widget.reports.map((report) => report.city).toSet();
    logger.d("cities: $cities");

    var groupedReports = cities
        .map((city) =>
        widget.reports
            .where((report) => report.city.compareTo(city) == 0).toList())
        .toList();

    var timeSeriesData = new List<_ReportsByCity>();
    for (List<Report> reports in groupedReports) {
      timeSeriesData.add(new _ReportsByCity(reports.first.city, reports.length));
    }
    logger.d("City Series: $timeSeriesData");

    _citySeriesList.add(
      charts.Series(
        domainFn: (_ReportsByCity _reportsByCity, _) => _reportsByCity.city,
        measureFn: (_ReportsByCity _reportsByCity, _) => _reportsByCity.quantity,
        id: 'Reports by city',
        data: timeSeriesData,
        labelAccessorFn: (_ReportsByCity row, _) => '${row.quantity}',
        fillPatternFn: (_, __) => charts.FillPatternType.solid,
      ),
    );
  }

  void getReportsByViolationType() {

    Set<String> violationTypes = widget.reports.map((report) => report.violationType).toSet();
    logger.d("Violation types: $violationTypes");

    var groupedReports = violationTypes
        .map((violationType) =>
        widget.reports
            .where((report) => report.violationType.compareTo(violationType) == 0).toList())
        .toList();

    var timeSeriesData = new List<_ReportsByViolationType>();
    for (List<Report> reports in groupedReports) {
      timeSeriesData.add(new _ReportsByViolationType(reports.first.violationType.replaceAll("_", " "), reports.length));
    }
    logger.d("City Series: $timeSeriesData");

    _violationSeriesList.add(
      charts.Series(
        domainFn: (_ReportsByViolationType _reportsByViolationType, _) => _reportsByViolationType.violationType,
        measureFn: (_ReportsByViolationType _reportsByViolationType, _) => _reportsByViolationType.quantity,
        id: 'Reports by city',
        data: timeSeriesData,
        labelAccessorFn: (_ReportsByViolationType row, _) => '${row.quantity}',
        fillPatternFn: (_, __) => charts.FillPatternType.solid,
      ),
    );
  }


  @override
  void initState() {
    super.initState();
    _dateSeriesList = new List<charts.Series<_ReportsByDate, DateTime>>();
    _citySeriesList = new List<charts.Series<_ReportsByCity, String>>();
    _violationSeriesList = new List<charts.Series<_ReportsByViolationType, String>>();
    getReportsByDate();
    getReportsByCity();
    getReportsByViolationType();
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
                                      desiredMaxRows: 2,
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
                                      desiredMaxRows: 2,
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

class _ReportsByDate {
  DateTime time;
  int quantity;

  _ReportsByDate(this.time, this.quantity);
}

class _ReportsByViolationType {
  String violationType;
  int quantity;

  _ReportsByViolationType(this.violationType, this.quantity);
}

class _ReportsByCity {
  String city;
  int quantity;

  _ReportsByCity(this.city, this.quantity);
}

