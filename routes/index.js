const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors')
const mysql = require('mysql');
var bodyParser = require('body-parser')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const db = mysql.createConnection({

    host: "127.0.0.1",
    user: "root",
    password: "",
    database: 'make_your_choice'
});
db.connect()


module.exports = router;



