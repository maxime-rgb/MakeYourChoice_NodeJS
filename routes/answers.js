const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser')

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

router.post('/new', function (req, res) {
    const userId = req.body.userId
    const surveyId = req.body.surveyId
    const answer = req.body.answer
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
            INSERT INTO answers (User_id,  Survey_id, answer) VALUES ( :User_id, :Survey_id, :answer);                   
        `,{User_id: userId, Survey_id: surveyId, answer: answer },
        (err, result) => {
            if (err) {
                res.json({ message: 'Erreur lors de l\'enregistrement de la réponse' })
            }
            console.log(result);
            res.json(result)
        }
    )
})

module.exports = router;



