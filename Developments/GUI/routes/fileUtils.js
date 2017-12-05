module.exports = function(app){
  const fs = require('fs');
  const fileUpload = require('express-fileupload');
  const lodash = require('lodash');
  var express = require('express');
	var router = express.Router();

  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'V1nayaka',
    database : 'VAAAS'
  });
  connection.connect({debug: true});

  // default options
  app.use(fileUpload());

  router.post('/file_upload', function(req, res) {
    // Uploaded files:

    if (!req.files)
      return res.status(400).send('No files were uploaded.');

  //console.log("file: ",req.files.data_files);
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.upload;


    // Use the mv() method to place the file somewhere on your server
  console.log('./' + req.files.upload.name)
    file.mv('../../api/datasets/' + req.files.upload.name, function(err) {
      if (err)
        return res.status(500).send(err);

      res.send('File uploaded!');
    });

  });


  router.get('/get_file_list', function(req, res) {
    // Uploaded files:
  res.contentType('application/json');
    const testFolder = '../../api/datasets/';

    fs.readdir(testFolder, (err, files) => {

      let _p = new Promise((resolve, reject) => {
        let _files = [], k = 0;
        files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item)).forEach(file => {


          connection.query('SELECT dataset_id FROM DATASETS WHERE filename = ?', file, function (error, results, fields) {
            if (error) throw error;

            //res.send(results[0]);
            k++;
            console.log(file, results, lodash.isEmpty(results));
            if(!lodash.isEmpty(results)){
              _files.push({name: file, dataset_id: results[0].dataset_id});
            }

            if(k === files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item)).length){
              resolve(_files);
            }

          });

        });

      });

      _p.then((_files) => {
        console.log("read" + _files);
          res.send(JSON.stringify(_files));
      })


    })

  });

  router.get('/get_file/:file_name', function(req, res) {
    // Uploaded files:

  //  console.log(req.params.file_name);
    //var file = ;
    var file_name = req.params.file_name;
    res.download('../../api/datasets/'+ encodeURIComponent(file_name), file_name, function(err) {
      if(err){
        res.status(500).send(err)
      }else{

      }
    });
  });

  return router;
}
