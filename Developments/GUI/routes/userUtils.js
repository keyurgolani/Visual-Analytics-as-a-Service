module.exports = function(app){

  var express = require('express');
	var router = express.Router();

  var moment = require('moment');

  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : '35.197.92.72',
    user     : 'root',
    password : 'vaaas',
    database : 'VAAAS'
  });
  connection.connect();
  router.post('/addUser', function(req, res) {
    // Uploaded files:
    console.log(req.body);
    const { user_name, email_id, password, first_name, last_name} = req.body;
    const params1 = {
      user_name,
      email_id,
      password,
      account_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    //var userinfo = JSON.parse(req.body);


    connection.query('SELECT COUNT(*) AS cnt FROM USERACCOUNT WHERE user_name = ?', user_name, function (error, results, fields) {
      if (error) throw error;
      console.log(results[0].cnt);
      if(results[0].cnt !== 0){
        res.status(400).send("User ID is already there");
      }else{
        connection.query('INSERT INTO USERACCOUNT SET ?', params1, function (error, results, fields) {
          if (error) throw error;
          const seq = results.insertId;
          const params2 = {
            user_id: results.insertId,
            first_name,
            last_name
          };
          console.log(results.insertId)

          connection.query('INSERT INTO USERPROFILE SET ?', params2, function (error, results, fields) {
            if (error) throw error;
            connection.query('SELECT * FROM USERACCOUNT A, USERPROFILE B WHERE A.user_id = B.user_id AND A.user_id = ?', seq, function (error, results, fields) {
              if (error) throw error;

              res.send(results);
            });
          });
        });
      }
    });

  });
  return router;
}
