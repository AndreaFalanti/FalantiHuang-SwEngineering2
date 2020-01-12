import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:logger/logger.dart';
import 'package:safestreets/config.dart';

List<T> map<T>(List list, Function handler) {
  List<T> result = [];
  for (var i = 0; i < list.length; i++) {
    result.add(handler(i, list[i]));
  }

  return result;
}

class CarouselWithIndicator extends StatefulWidget {
  final List photos;
  final bool fromNetwork;

  CarouselWithIndicator({Key key, @required this.photos, @required this.fromNetwork}) : super(key: key);
  @override
  _CarouselWithIndicatorState createState() => _CarouselWithIndicatorState();
}

class _CarouselWithIndicatorState extends State<CarouselWithIndicator> {
  var logger = Logger();
  int _current = 0;

  String imgPath = HOST;


  @override
  Widget build(BuildContext context) {
    var imgList = widget.photos;
    logger.d("carousel imglist: "+imgList.toString());
    List images = map<Widget>(
      imgList,
          (index, img) {
        return Container(
          margin: EdgeInsets.all(5.0),
          child: ClipRRect(
            borderRadius: BorderRadius.all(Radius.circular(5.0)),
            child: Stack(children: <Widget>[
              widget.fromNetwork
                  ? Image.network(imgPath+img, fit: BoxFit.cover, width: 1000.0,)
                  : Image.file(img, fit: BoxFit.cover, width: 1000.0)
            ]),
          ),
        );
      },
    ).toList();

    return Column(children: [
      CarouselSlider(
        items: images,
        autoPlay: false,
        enlargeCenterPage: true,
        aspectRatio: 2.0,
        onPageChanged: (index) {
          setState(() {
            _current = index;
          });
        },
      ),
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: map<Widget>(
          imgList,
              (index, url) {
            return Container(
              width: 8.0,
              height: 8.0,
              margin: EdgeInsets.symmetric(vertical: 10.0, horizontal: 2.0),
              decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _current == index
                      ? Color.fromRGBO(0, 0, 0, 0.9)
                      : Color.fromRGBO(0, 0, 0, 0.4)),
            );
          },
        ),
      ),
    ]);
  }
}