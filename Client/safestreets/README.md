# SafeStreets

A Flutter application for SafeStreets.

## Setup

* Make sure the server is running, if not run ```npm start``` in the server folder.
* If you are using Android Studio or IntelliJ open "Edit Configurations..." from the Run menu and add ```--enable-software-rendering``` to Additional arguments field.
* Go to pubsec.yaml and run "Packages get" or run `flutter pub get` from the terminal

Now you can run the application successfully.

### Note
It is a known issue that on iOS platform if you connect via wifi to the server, it may throw the
following exception: ```Error connecting to the service protocol: failed to connect to http://127.0.0.1:1024/1Ud8x9tp8qY=/```.
However, it should be still able to connect successfully, otherwise use hotspot connection.
