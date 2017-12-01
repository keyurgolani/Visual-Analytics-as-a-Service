module.exports = function(app){

  var express = require('express');
	var router = express.Router();

  router.post('/addUser', function(req, res) {
    // Uploaded files:
    console.log(req.userinfo);
    var userinfo = JSON.parse(req.userinfo);
    connection.connect();

    connection.query('INSERT INTO USERPROFILE SET ?', req.params, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
    });

    connection.end();

    res.send(200);

  });

  return router;
}
