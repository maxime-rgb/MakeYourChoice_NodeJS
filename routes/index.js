var express = require('express');
var app = express();
var router = express.Router();
var cors = require('cors')
const mysql = require('mysql');




const corsOption= {
  origin: 'http://localhost:3001',
  optionSuccessStatus: 200
}



router.get('/', cors(corsOption), function (req, res) {

  const db = mysql.createConnection({

    host: "127.0.0.1",
    user: "root",
    password: "",
    database : 'make_your_choice'
  });
  
  db.connect()
  db.query('SELECT * FROM Users, Surveys, Answers', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
    res.json(results)
  });

  db.query("INSERT INTO Surveys (Title, Question) VALUES ('?','?')",
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
 
  });
  





})



module.exports = router;


