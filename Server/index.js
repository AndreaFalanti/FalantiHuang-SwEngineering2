'use strict';

let {setupDataLayer} = require("./other/service/DataLayer");

var fs = require('fs'),
    path = require('path'),
    http = require('http');

require('dotenv').config({path: path.join(__dirname, '.env')});

var express = require('express');
var app = express();
var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
var serverPort = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var _ = require('lodash');
var multer = require('multer');
var upload = multer({dest: path.join(__dirname, '/tmp')});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));
app.use(express.json({limit: '50mb'}));
/*app.use(upload.array('photo_files'));
app.use(upload.single('photo'));*/
app.use(upload.fields([{name: 'photo', maxCount: 1}, {name: 'photo_files'}]));



let dirToOther = path.join(__dirname, 'other');     // points "Other" folder

let cookieSession = require("cookie-session");
let cookieParser = require("cookie-parser");
let serveStatic = require("serve-static");

// swaggerRouter configuration
var options = {
    swaggerUi: path.join(dirToOther, '/swagger.json'),
    controllers: path.join(dirToOther, './controllers'),
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

var options_object = {
    controllers: path.join(dirToOther, './controllers'),
    checkControllers: true,
    docs: {
        apiDocs: '/api-docs',
        apiDocsPrefix: '',
        swaggerUi: '/docs',
        swaggerUiPrefix: ''
    }
};

oasTools.configure(options_object);

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(dirToOther, 'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Add cookies to responses
app.use(cookieParser());
app.use(cookieSession({name: "session", keys: ["id", "accountType"]}));

// Initialize the Swagger middleware
oasTools.initializeMiddleware(swaggerDoc, app, function (middleware) {

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());

    app.use(serveStatic(path.join(__dirname, "public")));

    app.use(function (err, req, res, next) {
        console.log('This is the invalid field ->', err.field);
        next(err)
    });

    app.use(function (req, res, next) {
        _.extend(req.body, req.files);
        //_.extend(req.body, req.file);
        next();
    });

    /*app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

    app.use(bodyParser.raw({limit: '50mb'}));*/

    // Start the server
    setupDataLayer().then(
        http.createServer(app).listen(serverPort, function () {
            console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
            console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
        })
    );
});

module.exports = {app, swaggerDoc};
