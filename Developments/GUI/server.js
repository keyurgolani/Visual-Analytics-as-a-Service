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
var mongoose    = require('mongoose');
const fileUpload = require('express-fileupload');

const http_port = 8080;

if (app.get('env') == 'development') {
// This will change in production since we'll be using the dist folder
// This covers serving up the index page
    /*app.use(express.static(__dirname + '/dist'));                 // set the static files location /public/img will be /img for users


    app.get('/!*', function (req, res) {
        res.sendFile("index.html", { root: __dirname + '/dist' });
    });*/

    app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
    app.use('/bower_components', express.static(__dirname + '/bower_components'));
    /*app.get('/*', function (req, res) {
        res.sendFile("index.html", { root: __dirname + '/app' });
    });*/
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

// default options
app.use(fileUpload());

app.post('/file_upload', function(req, res) {
  // Uploaded files:

  if (!req.files)
    return res.status(400).send('No files were uploaded.');

//console.log("file: ",req.files.data_files);
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let file = req.files.data_files;


  // Use the mv() method to place the file somewhere on your server
console.log(__dirname + '/uploads/' + req.files.data_files.name)
  file.mv(__dirname + '/uploads/' + req.files.data_files.name, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });

});


app.get('/get_file_list', function(req, res) {
  // Uploaded files:
res.contentType('application/json');
  const testFolder = './uploads/';

fs.readdir(testFolder, (err, files) => {
  let _files = [];
  files.forEach(file => {
    _files.push({name: file});
  });

  res.send(JSON.stringify(_files));


})
});

app.get('/get_file/:file_name', function(req, res) {
  // Uploaded files:

//  console.log(req.params.file_name);
  //var file = ;
  var file_name = req.params.file_name;
  res.download(__dirname + '/uploads/'+ file_name, file_name, function(err) {
    if(err){
      res.status(500).send(err)
    }else{

    }
  });
});


// configuration =================


app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// Error handling
// Handle 404

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

//mongoose.connect('mongodb://127.0.0.1/cmpe295');


// listen (start app with node server.js) ======================================
app.listen(http_port);

console.log("CMPE295 Frontend App Listening on Port "+http_port);
