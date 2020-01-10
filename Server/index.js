'use strict';

let {setupDataLayer} = require("./other/service/DataLayer");

let fs = require('fs'),
    path = require('path'),
    http = require('http');

require('dotenv').config({path: path.join(__dirname, '.env')});

let express = require('express');
let app = express();
let oasTools = require('oas-tools');
let jsyaml = require('js-yaml');
let serverPort = process.env.PORT || 8080;
let bodyParser = require('body-parser');
let _ = require('lodash');
let multer = require('multer');
let upload = multer({dest: path.join(__dirname, '/tmp')});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));
app.use(express.json({limit: '50mb'}));
app.use(upload.fields([{name: 'photo', maxCount: 1}, {name: 'photo_files'}]));

let dirToOther = path.join(__dirname, 'other');     // points "Other" folder

let cookieSession = require("cookie-session");
let cookieParser = require("cookie-parser");
let serveStatic = require("serve-static");

// swaggerRouter configuration
let options = {
    swaggerUi: path.join(dirToOther, '/swagger.json'),
    controllers: path.join(dirToOther, './controllers'),
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

let options_object = {
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
let spec = fs.readFileSync(path.join(dirToOther, 'api/swagger.yaml'), 'utf8');
let swaggerDoc = jsyaml.safeLoad(spec);

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

    app.use(function (req, res, next) {
        _.extend(req.body, req.files);
        next();
    });

    // This avoids jest tests to throw errors for port already in use (a port is not required in tests, so no problem)
    // See also: https://blog.campvanilla.com/jest-expressjs-and-the-eaddrinuse-error-bac39356c33a
    if (process.env.NODE_ENV !== 'test') {
        // Start the server
        setupDataLayer().then(() =>
            http.createServer(app).listen(serverPort, function () {
                console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
                console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
            })
        );
    }

});

module.exports = {app, swaggerDoc};
