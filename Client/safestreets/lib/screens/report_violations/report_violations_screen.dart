import 'dart:io';
import 'dart:ui';
import 'package:camera/camera.dart';
import 'package:logger/logger.dart';

import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:safestreets/utils/enum_util.dart';
import 'package:safestreets/screens/photo/photo.dart';
import 'package:safestreets/screens/report_violations/report_violations_screen_presenter.dart';
import 'package:safestreets/widgtes/carousel.dart';
import 'package:dropdownfield/dropdownfield.dart';
import 'package:safestreets/models/report.dart';
import 'package:geolocator/geolocator.dart';

class ReportViolationScreen extends StatefulWidget {

  @override
  State<StatefulWidget> createState() => new ReportViolationScreenState();
}

class ReportViolationScreenState extends State<ReportViolationScreen>
  implements ReportViolationScreenContract {

  TextStyle style = TextStyle(fontFamily: 'Monserrat', fontSize: 18.0);

  final scaffoldKey = new GlobalKey<ScaffoldState>();
  final formKey = new GlobalKey<FormState>();

  ReportTrafficViolationPresenter _presenter;
  bool _isFirstPhotoValid = false;
  bool _isRetrievingLicensePlate = false;
  bool _isRetrievingGPS = true;
  bool _isSubmitting = false;
  int _oldPhotoDirLen = 0;
  var _firstCamera;
  Directory _photoDir;
  List<File> _photoFiles = new List<File>();
  var _licensePlateController = TextEditingController();
  final Geolocator geolocator = Geolocator()..forceAndroidLocationManager;
  var _locationController = TextEditingController();
  Position _currentPosition;
  String _currentAddress = "";

  String _licensePlate, _violationType, _optDesc;

  var logger = Logger();

  ReportViolationScreenState() {
    _presenter = new ReportTrafficViolationPresenter(this);
  }

  @override
  void initState() {
    super.initState();
    checkCamera();
    resetPhotoDir().then((val) => createPhotoDir());
    //_presenter.doSendFirstPhoto('/Users/andreahuang/Desktop/Client/FalantiHuang-SwEngineering2/Client/safestreets/lib/auto2.png');
    _getCurrentLocation();
  }

  void _showSnackBar(String text, bool error) {
    Color color = error ? Colors.red : Colors.green;

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

  _getCurrentLocation() {
    geolocator
        .getCurrentPosition(desiredAccuracy: LocationAccuracy.best)
        .then((Position position) {
      setState(() {
        logger.d("Setting current position: " + position.latitude.toString() + "," + position.longitude.toString());
        _currentPosition = position;
      });
      _getAddressFromLatLng();
    }).catchError((e) {
      logger.e(e);
    });
  }

  _getAddressFromLatLng() async {
    try {
      List<Placemark> p = await geolocator.placemarkFromCoordinates(
          _currentPosition.latitude, _currentPosition.longitude);

      Placemark place = p[0];
      logger.d("Setting current address");

      setState(() {
        _currentAddress =
        "${place.name}, ${place.subAdministrativeArea}, ${place.administrativeArea}";
        _locationController.text = _currentAddress;
        _isRetrievingGPS = false;
      });
    } catch (e) {
      logger.e(e);
    }
  }

  void createPhotoDir() {
    getTemporaryDirectory().then((Directory dir) {
      logger.d("creating photo dir");
      _photoDir = new Directory(dir.path+"/photos/saved");
      _photoDir.createSync(recursive: true);
    });

  }

  Future resetPhotoDir() async {
    logger.d("resetting photo dir");
    var dir = new Directory((await getTemporaryDirectory()).path +"/photos");
    try {
      dir.deleteSync(recursive: true);
    } catch (error) {
      logger.d("/photos directory not created yet");
    }
  }


  Future<void> checkCamera() async {
    // Ensure that plugin services are initialized so that `availableCameras()`
    // can be called before `runApp()`
    WidgetsFlutterBinding.ensureInitialized();

    // Obtain a list of the available cameras on the device.
    final cameras = await availableCameras();

    // Get a specific camera from the list of available cameras.
    _firstCamera = cameras.first;
    logger.d(_firstCamera);
  }

  void _onTakePhoto() {
    print("Take photo");
    Navigator.of(context).push(
        MaterialPageRoute<void>(
            builder: (BuildContext context) {
              return Scaffold(
                body: TakePictureScreen(
                  // Pass the appropriate camera to the TakePictureScreen widget.
                  camera: _firstCamera,
                ),
              );
            }
        )
    );
  }


  Future _getPhotos() {
    _photoFiles.clear();
    return _photoDir.list().toList().then((entityList) {
      for (FileSystemEntity entity in entityList) {
        File imgFile = new File(entity.path);
        logger.d(imgFile);
        _photoFiles.add(imgFile);
      }
      logger.d("num of photos: " + _photoFiles.length.toString());
    });
  }



  dynamic _printDirectory() {
    //var dir = new Directory((await getTemporaryDirectory()).path +"/photos/saved");
    if (_photoDir!=null){
      _photoDir.list().listen((FileSystemEntity entity) {
        logger.d(entity.path);
      });
    }
  }

  void _checkPhotoDirChange() async {
    if (_photoDir != null) {
      int len = (await _photoDir.list().toList()).length;
      logger.d("len: " + len.toString());
      if (_oldPhotoDirLen != len) {
        _oldPhotoDirLen = len;
        _getPhotos()
            .then((val) {
          if (!_isFirstPhotoValid ) {
            _isRetrievingLicensePlate = true;
            _presenter.doSendFirstPhoto(_photoFiles[0].path);
          } else {
            setState(() {

            });
          }
        });
      }
    }
  }

  void _submit() {
    print("Submit button was pressed");
    final form = formKey.currentState;
    List<String> photoPaths = _photoFiles.map((file) => file.path).toList();

    if (form.validate()) {
      setState(() => _isSubmitting = true);
      form.save();

      logger.d("Report form: " + _currentPosition.latitude.toString() +" "+
        _currentPosition.longitude.toString() + " "+
        _violationType.replaceAll(" ", "_") + " "+
        _licensePlate + " optDesc:" + _optDesc,);
      _presenter.doSendReport(
          _currentPosition.latitude,
          _currentPosition.longitude,
          _violationType.replaceAll(" ", "_"),
          _licensePlate,
        photoPaths,
        _optDesc
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    _printDirectory();


    final takePhoto = Container(
        alignment: Alignment.topCenter,
        margin: EdgeInsets.all(20.0),
        child: ClipRRect(
          borderRadius: BorderRadius.all(Radius.circular(10.0)),
          child: Container(
            height: 200,
            width: 300,
            color: Colors.grey,
            child: Icon(Icons.photo, size: 100,)
          )
        ),
    );

    _checkPhotoDirChange();

    logger.d("isFirtPhotoVlaid: "+_isFirstPhotoValid.toString());
    final photoDisplay = _isFirstPhotoValid
        ? CarouselWithIndicator(photos: _photoFiles, fromNetwork: false,)
        : takePhoto;

    final photoShowRoom = Container(
      alignment: Alignment.topCenter,
      height: 250,
      child: Stack(
        children: <Widget>[
          photoDisplay,
          new Align(alignment: Alignment.bottomRight,
            child: FloatingActionButton(
                child: new Icon(Icons.add_a_photo),
                onPressed: _onTakePhoto),
          )
        ],
      ),
    );


    final licencePlateField = new Padding(
      padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              SizedBox(height: 30,
                  child: Text("License plate *", style: TextStyle(fontWeight: FontWeight.bold),)),
              SizedBox(width: 10,),
              _isRetrievingLicensePlate
                  ? Container(
                      alignment: Alignment.topCenter,
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2,),)
                  : Spacer()
            ],
          ),
          TextFormField(
            controller: _licensePlateController,
            onSaved:  (val) => _licensePlate = val,
              validator: (val) {
                final regExp = RegExp(r"^[A-Z]{2}\d{3}[A-Z]{2}$");
                return !regExp.hasMatch(val)
                    ? "Incorrect license plate"
                    : null;
              },
            decoration: InputDecoration(
                filled: true,
                contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
                border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))
            )
          )
        ],
      )
    );



    final violationTypeField = new Padding(
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            SizedBox(height: 30,
                child: Text("Violation Type *", style: TextStyle(fontWeight: FontWeight.bold),)),
            DropDownField(
                textStyle: style,
                value: _violationType,
                required: true,
                strict: true,
                items: enumValues(ViolationType.values).map((val) => val.replaceAll("_", " ")).toList(),
                setter: (dynamic newValue) {
                  _violationType = newValue;
                }
            )
          ],
        )
    );

    final locationText = new Padding(
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Row(
              children: <Widget>[
                SizedBox(height: 20,
                    child: Text("Location", style: TextStyle(fontWeight: FontWeight.bold),)),
                SizedBox(width: 10,),
                _isRetrievingGPS
                    ? Container(
                        alignment: Alignment.topCenter,
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2,),)
                    : Spacer()
              ],
            ),
            SizedBox(height: 10),
            TextField(
              controller: _locationController,
              enabled: false,
              keyboardType: TextInputType.multiline,
              maxLines: null,
              decoration: InputDecoration(
                  filled: true,
                  contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
                  border:
                  OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))
              )
            )
          ],
        )
    );

    final optionalDescField = new Padding(
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            SizedBox(height: 30,
                child: Text("Optional description", style: TextStyle(fontWeight: FontWeight.bold),)),
            TextFormField(
                onSaved: (val) =>_optDesc = val,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                decoration: InputDecoration(
                    hintText: "Input here ...",
                    filled: true,
                    contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
                    border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))
                )
            )
          ],
        )
    );

    final submitBtn = Material( // widget to add shadow(elevation) to the button
      elevation: 15.0,
      borderRadius: BorderRadius.circular(30.0),
      color: Colors.lightBlue,
      child: MaterialButton(
        minWidth: MediaQuery.of(context).size.width/3,
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        onPressed: _submit,
        child: Text("Submit",
            textAlign: TextAlign.center,
            style: style.copyWith(
                color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );

    final reportForm = Container(
      padding: EdgeInsets.all(8.0),
      width: 200,
      child: new Column(
        children: <Widget>[

          new Form(
            key: formKey,
            child: new Column(
              children: <Widget>[
                licencePlateField,
                violationTypeField,
                locationText,
                optionalDescField,
                _isSubmitting ?  CircularProgressIndicator() : submitBtn,
              ],
            ),
          ),
        ],
        crossAxisAlignment: CrossAxisAlignment.start,
      ),
    );

    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        title: Text("Report a violation"),
      ),
      body: ListView(
        children: <Widget>[
          photoShowRoom,
          reportForm,
    ],
      )
    );
  }

  @override
  void onSendFirstPhotoSuccess(String licensePlate) {
    logger.d("Successful license plate retrieval:" + licensePlate);
    _showSnackBar("Successful license plate retrieval!", false);
    _licensePlateController.text = licensePlate;
    setState(() {
      _isFirstPhotoValid = true;
      _isRetrievingLicensePlate = false;
    });
  }

  @override
  void onSendFirstPhotoError(String errorTxt) {
    logger.d("Could not retrieve license plate successfully");
    String errorMsg = errorTxt;
    String errorCode = 400.toString();
    if (errorTxt.contains(errorCode)) {
      errorMsg = "Could not retrieve license plate successfully";
    }
    _showSnackBar(errorMsg, true);
    setState(() {
      logger.d("Updating state after first photo error: " + _photoDir.path);
      resetPhotoDir().then((val) => createPhotoDir());
      _isRetrievingLicensePlate = false;
    });
  }

  @override
  void onSendReportSuccess() {
    _showSnackBar("Report was sent successfully", false);
    setState(() => _isSubmitting = false);
    Future.delayed(Duration(seconds: 1), () => Navigator.pop(context));
  }

  @override
  void onSendReportError(String errorTxt) {
    logger.d("Could not send report successfully");
    String errorMsg = errorTxt;
    String errorCode = 400.toString();
    if (errorTxt.contains(errorCode)) {
      errorMsg = "Could not send report successfully";
    }
    _showSnackBar(errorMsg, true);
    setState(() {
      _isSubmitting = false;
    });
  }

}

