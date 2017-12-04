module.exports = function(app){

  var express = require('express');
	var router = express.Router();

  var moment = require('moment');

  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : '35.197.92.72',
    user     : 'root',
    password : 'V1nayaka',
    database : 'VAAAS'
  });
  connection.connect({debug: true});
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

              res.send(results[0]);
            });
          });
        });
      }
    });

  });

  router.post('/login', function(req, res) {
    // Uploaded files:
    console.log(req.body);
    const { user_name, password} = req.body;
    const params1 = {
      user_name,
      password
    };

    connection.query('SELECT COUNT(*) AS cnt FROM USERACCOUNT WHERE user_name = ? AND password = ?', [user_name, password], function (error, results, fields) {
      if (error) throw error;
      console.log(results[0].cnt);
      if(results[0].cnt === 0){
        res.status(400).send("Account does not exist or password does not matched");
      }else{
        connection.query('UPDATE USERACCOUNT SET last_login = ?', moment().format('YYYY-MM-DD HH:mm:ss'), function (error, results, fields) {
          if (error) throw error;
          connection.query('SELECT * FROM USERACCOUNT A, USERPROFILE B WHERE A.user_id = B.user_id AND A.user_name = ?', user_name, function (error, results, fields) {
            if (error) throw error;

            res.send(results[0]);
          });
        });
      }
    });

  });

  router.post('/FBlogin', function(req, res) {
    const { user_name, email_id, password, first_name, last_name, facebook_key} = req.body;
    const params1 = {
      user_name,
      email_id,
      password,
      account_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    connection.query('SELECT COUNT(*) AS cnt FROM USERACCOUNT WHERE email_id = ? AND user_name = ?', [email_id, user_name], function (error, results, fields) {
      if (error) throw error;
      console.log(results[0].cnt);
      if(results[0].cnt === 0){
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

              res.send(results[0]);
            });
          });
        });
      }else{
        connection.query('UPDATE USERACCOUNT SET last_login = ?', moment().format('YYYY-MM-DD HH:mm:ss'), function (error, results, fields) {
          if (error) throw error;
          connection.query('SELECT * FROM USERACCOUNT A, USERPROFILE B WHERE A.user_id = B.user_id AND A.user_name = ?', user_name, function (error, results, fields) {
            if (error) throw error;

            res.send(results[0]);
          });
        });
      }
    });

  });

  router.post('/updateScript', function(req, res) {
    // Uploaded files:
    const { user_id, script } = req.body;
    const params = [
      script, user_id

    ];

    connection.query('UPDATE USERPROFILE SET script = ? WHERE user_id = ? ', params, function (error, results, fields) {
      if (error) throw error;
      res.status(200).send("");
    });

  });
  return router;
}
