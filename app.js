const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quiz_db'
});

// Connect to MySQL
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Routes

// Home route to display all questions
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM questions';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', { questions: results });
    });
});

// Route to submit answers and calculate score
app.post('/submit', (req, res) => {
    const userAnswers = req.body;
    let score = 0;

    for (let id in userAnswers) {
        const sql = 'SELECT correct_option FROM questions WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) throw err;
            if (result[0].correct_option === userAnswers[id]) {
                score++;
            }
        });
    }

    // Delay rendering to ensure all queries complete
    setTimeout(() => {
        res.render('result', { score: score });
    }, 500);
});

// Start the server
app.listen(3007, () => {
    console.log('Server started on http://localhost:3007');
});
