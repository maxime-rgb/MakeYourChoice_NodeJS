const express = require('express');
const app = express();
const router = express.Router();
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

// Get SurveysByUser
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

    db.query("SELECT Surveys.Id, Surveys.User_id, Surveys.Title, Surveys.Date  FROM `Surveys` JOIN Users ON Users.Id = Surveys.User_id WHERE Surveys.User_id = :id LIMIT 10", {id:creator_id}, (err, result) => {
        if (err) {
            console.log(err);
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
// Get OneSurvey
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

    db.query("SELECT surveys.Id, surveys.Title, surveys.Date, surveys.Question,surveys.answers, answers.answer  FROM surveys LEFT JOIN answers ON answers.Survey_id = surveys.Id WHERE surveys.Id = :id ", {id:survey_id}, (err, result) => {
        if (err) {
            res.json({ message: "SQL Error" })
        }
        if (result.length == 0) {
            res.json({ message: "Il n'existe pas de sondage" })
        } else {
            res.json(result)
        }
    })
})

// Post OneSurvey
router.post('/newSurvey/:id', function (req, res) {
    console.log('ppl');
    const creator_id = parseInt(req.params.id)


    const Title = req.body.Title
    const Question = req.body.Question
    const Date = req.body.Date
    const Answers = req.body.AllAnswer
    console.log(req.body);
    db.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };

    db.query(
        `   
            INSERT INTO Surveys (User_id,  Title, Date, Question, answers) VALUES (:creator_id, :title, :date, :question, :answers );                   
        `,{creator_id:creator_id, title: Title, date:Date, question:Question, answers:Answers },
        (err, result) => {
            if (err) {
                res.json({ message: 'Erreur lors de l\'enregistrement du sondage' })
            }
            console.log(result);
            res.json(result)
        }
    )
})

router.post('/delete/:id', function(req,res){
    const survey_id = parseInt(req.params.id)
    //    
    db.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };

    db.query(
        `   
        DELETE FROM surveys WHERE surveys.Id = :id                   
        `,{id:survey_id},
        (err, result) => {
            if (err) {
                res.json({ message: 'Erreur lors de la suppression du sondage' })
            }
            res.json('Le sondage à été supprimé')
        }
    )
})

module.exports = router;



