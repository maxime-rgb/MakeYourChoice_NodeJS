const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configure the app to use bodyParser()
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

router.post('/register', function (req, res) {
    const FirstName = req.body.FirstName
    const LastName = req.body.LastName
    const Mail = req.body.Mail
    const Password = req.body.Password
    db.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };

    function insert() {

        db.query(
            "INSERT INTO Users (LastName, FirstName, Mail, Password) VALUES (:lastname,:firstname,:mail,:password)",
            { lastname: LastName, firstname: FirstName, mail: Mail, password: Password },
            (err, result) => {
                if (err) {
                    res.json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur' })
                }
                res.json({
                    id: result.insertId,
                    FirstName: req.body.FirstName,
                    LastName: req.body.LastName,
                    Mail: req.body.Mail,
                    Password: req.body.Password,
                })
            }
        );
    }
    db.query("SELECT * From Users Where Mail = :mail", { mail: Mail }, (err, result) => {
        if (err) {
            res.json({ message: "SQL Error" })
        }
        if (result.length == 0) {
            insert()
        } else {
            res.json({ message: "L'utilisateur existe déja" })
        }
    })
});

router.post('/login', function (req, res) {
    console.log(req.body);
    const Mail = req.body.Mail
    const Password = req.body.Password
    db.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };

    db.query("SELECT * From Users Where Mail = :mail AND Password = :password", { mail: Mail, password: Password }, (err, result) => {
        if (err) {
            res.json({ message: "SQL Error" })
        }
        if (result.length == 0) {
            res.json({ message: "L'utilisateur n'existe pas" })
        } else {
            console.log(result[0].id);
            res.json({
                id: result[0].Id,
                FirstName: result[0].FirstName,
                LastName: result[0].LastName,
                Mail: result[0].Mail,
                Password: result[0].Password
            })
        }
    })
});


router.put('/Profil/:id', (req, res) => {

    const id = parseInt(req.params.id)
    const FirstName = req.body.FirstName
    const LastName = req.body.LastName
    const Password = req.body.Password


    db.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };
    selectUser(id, false)

    function update() {


        db.query(
            "UPDATE Users SET LastName = :lastname, FirstName = :firstname, Password =:password WHERE id = :id",
            { id: id, lastname: LastName, firstname: FirstName, password: Password },
            (err, result) => {
                if (err) {
                    res.json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
                    return;
                }
                selectUser(id, true)
            }
        );
    }

    function selectUser(id, response) {

        db.query("SELECT * From Users Where id = :id", { id: id }, (err, result) => {
            if (err) {
                res.json({ message: "SQL Error" })
            }
            if (result.length == 0) {
                res.json({ message: "L'utilisateur n'éxiste pas" })
            } else {
                if (response) {
                    res.json({
                        id: result[0].id,
                        FirstName: result[0].FirstName,
                        LastName: result[0].LastName,
                        Password: result[0].Password,
                        Mail: result[0].Mail,
                    })
                } else {
                    update()
                }
            }
        })
    }

})



module.exports = router;




