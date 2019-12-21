'use strict';

let {setupDataLayer} = require("./other/service/DataLayer");

var fs = require('fs'),
    path = require('path'),
    http = require('http');

require('dotenv').config({path: path.join(__dirname, '.env')});
console.log(path.join(__dirname, '.env'));

var express = require('express');
var app = express();
var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
var serverPort = process.env.PORT || 8080;

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
var spec = fs.readFileSync(path.join(dirToOther,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Add cookies to responses
app.use(cookieParser());
app.use(cookieSession({name: "session", keys: ["id", "accountType"]}));

// Initialize the Swagger middleware
oasTools.initializeMiddleware(swaggerDoc,  app,function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  app.use(serveStatic(path.join(__dirname, "public")));

  // Start the server
  setupDataLayer().then(
      http.createServer(app).listen(serverPort, function () {
        console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
      })
  );
});
