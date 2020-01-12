import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong/latlong.dart';
import 'package:logger/logger.dart';
import 'package:safestreets/models/report.dart';

import 'charts.dart';
import 'map_layer_options/scale_layer_plugin_option.dart';
import 'map_layer_options/zoombuttons_plugin_option.dart';

class MapScreen extends StatefulWidget {
  final String cityName;
  final List<Report> reports;

  MapScreen({Key key, this.cityName, @required this.reports}): super(key: key);

  @override
  _MapScreenState createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {

  final Geolocator geolocator = Geolocator()..forceAndroidLocationManager;
  Position _currentPosition;
  List<Marker> _markers;
  final scaffoldKey = new GlobalKey<ScaffoldState>();

  var logger = Logger();

  @override
  void initState() {
    super.initState();
    _getCityLocation(widget.cityName);

    _markers = widget.reports.map((report) =>
    new Marker(
      width: 80.0,
      height: 80.0,
      point: new LatLng(report.latitude, report.longitude),
      builder: (ctx) =>
          IconButton(
            icon: Icon(
              Icons.location_on,
              color: Colors.redAccent,
              size: 50,
            ),
            onPressed: () => print("marker pressed"),
            tooltip: "Date: ${report.formattedTimestamp()}\nViolation type: ${report.violationType.replaceAll("_", " ")}",)
    ),
    ).toList();
  }

  void _showSnackBar(String text) {
    Color color = Colors.grey;

    final snackBar = new SnackBar(
      content: new Text(text),
      duration: new Duration(seconds: 2),
      backgroundColor: color,
      action: new SnackBarAction(label: "Ok", onPressed: (){
        print("Press Ok on SnackBar");
      }),
    );
    scaffoldKey.currentState.showSnackBar(snackBar);
  }

  _getCityLocation(String cityName) async {
    try {
      List<Placemark> p = await geolocator.placemarkFromAddress(cityName);

      Placemark place = p[0];
      logger.d("Setting city location");

      setState(() {
        _currentPosition = place.position;
      });
    } catch (e) {
      logger.e(e);
    }
  }

  @override
  Widget build(BuildContext context) {


    var scalePlugin = new ScaleLayerPluginOption(
      lineColor: Colors.blue,
      lineWidth: 2,
      textStyle: TextStyle(color: Colors.blue, fontSize: 12),
      padding: EdgeInsets.all(10),
    );

    var zoomPlugin = new ZoomButtonsPluginOption(
        minZoom: 4,
        maxZoom: 19,
        mini: true,
        padding: 10,
        alignment: Alignment.bottomRight);

    logger.d(zoomPlugin.rebuild);
    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        title: Text("Map"),
        actions: <Widget>[
          IconButton(
              icon: Icon(Icons.insert_chart),
              onPressed: () {
                Navigator.push(context,
                    MaterialPageRoute(
                      builder: (context) => ChartsScreen(reports: widget.reports,),
                    )
                );
              }),
          IconButton(
              icon: Icon(Icons.info_outline),
              onPressed: () {
                _showSnackBar("Long press on a marker for more information");
              }),
        ],
      ),
      body: Center(
        child: Container(
          child: _currentPosition==null
              ? Text("Retrieving city location ...")
              : new FlutterMap(
            options: new MapOptions(
                center: new LatLng(_currentPosition.latitude, _currentPosition.longitude),
                zoom: 13.0,
                minZoom: 4,
                maxZoom: 19,
                plugins: [
                  ZoomButtonsPlugin(),
                  ScaleLayerPlugin()
                ]
            ),
            layers: [
              new TileLayerOptions(
                  urlTemplate:
                  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                  subdomains: ['a', 'b', 'c'],
                  keepBuffer: 6,
                  backgroundColor: Colors.white,
                  tileSize: 256),
              zoomPlugin,
              scalePlugin,
              new MarkerLayerOptions(
                markers: _markers
              )
            ],
          ),
        ),
      )
    );
  }
}
