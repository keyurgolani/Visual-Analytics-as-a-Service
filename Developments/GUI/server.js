/**
 * Created by changmatthew on 6/13/16.
 */
// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
const fs = require('fs');
var net = require('net');
const http = require('http');
const https = require('https');

const http_port = 80;

if (app.get('env') == 'development') {
// This will change in production since we'll be using the dist folder
// This covers serving up the index page
    /*app.use(express.static(__dirname + '/dist'));                 // set the static files location /public/img will be /img for users


    app.get('/!*', function (req, res) {
        res.sendFile("index.html", { root: __dirname + '/dist' });
    });*/

    app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
    app.use('/bower_components', express.static(__dirname + '/bower_components'));
    app.get('/*', function (req, res) {
        res.sendFile("index.html", { root: __dirname + '/app' });
    });
}

/**
 * Production Settings
 */
if(app.get('env') == 'production') {
    app.use(express.static(__dirname + '/dist'));                 // set the static files location /public/img will be /img for users


    app.get('/*', function (req, res) {
        res.sendFile("index.html", { root: __dirname + '/dist' });
    });


}


// configuration =================


app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// Error handling
// Handle 404


// listen (start app with node server.js) ======================================
app.listen(http_port);

console.log("CMPE295 Frontend App Listening on Port "+http_port);
