module.exports = function(app){
  const fs = require('fs');
  const fileUpload = require('express-fileupload');
  var express = require('express');
	var router = express.Router();

  // default options
  app.use(fileUpload());

  router.post('/file_upload', function(req, res) {
    // Uploaded files:

    if (!req.files)
      return res.status(400).send('No files were uploaded.');

  //console.log("file: ",req.files.data_files);
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.data_files;


    // Use the mv() method to place the file somewhere on your server
  console.log('./uploads/' + req.files.data_files.name)
    file.mv('./uploads/' + req.files.data_files.name, function(err) {
      if (err)
        return res.status(500).send(err);

      res.send('File uploaded!');
    });

  });


  router.get('/get_file_list', function(req, res) {
    // Uploaded files:
  res.contentType('application/json');
    const testFolder = './uploads/';

  fs.readdir(testFolder, (err, files) => {
    let _files = [];
    files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item)).forEach(file => {
      _files.push({name: file});
    });

    res.send(JSON.stringify(_files));


  })
  });

  router.get('/get_file/:file_name', function(req, res) {
    // Uploaded files:

  //  console.log(req.params.file_name);
    //var file = ;
    var file_name = req.params.file_name;
    res.download('./uploads/'+ file_name, file_name, function(err) {
      if(err){
        res.status(500).send(err)
      }else{

      }
    });
  });

  return router;
}
