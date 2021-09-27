const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors')
const mysql = require('mysql');
var bodyParser = require('body-parser')


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




router.get('/Surveys/:id', function (req, res) {

    const creator_id = parseInt(req.params.id)
    db.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };

    db.query("SELECT Surveys.id, Surveys.Date, Surveys.Title, Users.Firstname FROM `Surveys` JOIN Users ON Users.id = Surveys.User_id WHERE Surveys.User_id = :id LIMIT 10", {id:creator_id}, (err, result) => {
        if (err) {
            res.json({ message: "SQL Error" })
        }
        if (result.length == 0) {
            res.json({ message: "Il n'existe pas de sondage" })
        } else {
            console.log(result);
            res.json(result)
        }
    })
})

router.get('/SurveyDetails/:id', function (req, res) {

    const survey_id = parseInt(req.params.id)
    console.log(survey_id);
    db.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };

    db.query("SELECT Surveys.id, Surveys.Date, Surveys.Question, Surveys.Title, Users.Firstname, Answers.Answer FROM `Surveys` JOIN Users ON Users.id = Surveys.User_id JOIN Answers ON Answers.Question_id = Surveys.Id WHERE Surveys.Id = :id AND Answers.Question_id = Surveys.id LIMIT 10 ", {id:survey_id}, (err, result) => {
        if (err) {
            res.json({ message: "SQL Error" })
        }
        if (result.length == 0) {
            res.json({ message: "Il n'existe pas de sondage" })
        } else {
            console.log(result);
            res.json(result)
        }
    })
})



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
                id: result[0].id,
                FirstName: result[0].FirstName,
                LastName: result[0].LastName,
                Mail: result[0].Mail,
                Password: result[0].Password
            })
        }
    })
});

router.post('/newSurvey/:id', function (req, res) {

 
    const creator_id = parseInt(req.params.id)
    console.log(id);
    const Title = req.body.Title
    const Question = req.body.Question
    const Date = req.body.Date
    const Answer = req.body.Answer
    db.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };


  

    $sqlQuery="INSERT INTO Surveys (User_id, Date, Title, Question) VALUES (:creator_id, :date,:title,:question)",{id:creator_id},
    $result=mysql_query($sqlQuery),

    $id = mysql_insert_id();

    $sqlQuery = "INSERT INTO Answers(id, answer) VALUES (' $id ','$myEmail')";
    $result=mysql_query($sqlQuery);
        (err, result) => {
                if (err) {
                    res.json({ message: 'Erreur lors de l\'enregistrement du sondage' })
                }
                res.json({
                    id: result.insertId,
                    Title: req.body.Title,
                    Question: req.body.Question,
                    Date: req.body.Date,
                    Answer: req.body.Answer,
                })
            }
        
        })
    // db.query(
        
    //     "START TRANSACTION; INSERT INTO Surveys (User_id, Date, Title, Question) VALUES (:id, :date,:title,:question); INSERT INTO Answers (Question_id, Answer) VALUES (Surveys.Id, :answer); COMMIT;",
    //     {id:creator_id, date: Date, title: Title, question: Question, answer: Answer},
    //     (err, result) => {
    //         if (err) {
    //             res.json({ message: 'Erreur lors de l\'enregistrement du sondage' })
    //         }
    //         res.json({
    //             id: result.insertId,
    //             Title: req.body.Title,
    //             Question: req.body.Question,
    //             Date: req.body.Date,
    //             Answer: req.body.Answer,
    //         })
    //     }
    // );
// });

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



