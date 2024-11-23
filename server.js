if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2');


const initializePassport = require('./passport-config');
initializePassport(passport);

// Database connection
// const db = require('./models/connection');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "ssquad",
    password: "password",
    multipleStatements: true,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Auth Service connected to database');
    }
});
global.db = connection;

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/stuffs")));

const createTableQuery = `
CREATE TABLE IF NOT EXISTS plans (
    plan_id VARCHAR(36) PRIMARY KEY, 
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    description TEXT,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'open'
);
`;

db.query(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Table "plans" is ready');
    }
});

// On the start of server
app.get('/', checkAuthenticated, (req, res) => {
    const name = req.name;
    const query = 'SELECT * FROM plans';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from plans table:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.render("plans.ejs", { plans: results, name: name });
    });
});


app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, (req, res, next) => {
    console.log('Login Form Data:', req.body);
    next();
}, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));


// Showing all plans
app.get('/plans', checkAuthenticated, (req, res) => {
    // for pagination
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const query = `
        SELECT * FROM plans
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?;
    `;

    db.query(query, [limit, offset], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching plans', error: err.message });
        } else {
            res.render('plans.ejs', { plans: results, page });
        }
    });
});
// To create new plan
app.get('/plans/new', checkAuthenticated, (req, res) => {
    res.render('newplan.ejs');
});

app.post('/plans', checkAuthenticated, (req, res) => {
    const { title, location, category, date, time, description, created_by } = req.body;
    const plan_id = uuidv4();

    const query = `
        INSERT INTO plans (plan_id, title, location, category, date, time, description, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [plan_id, title, location, category, date, time, description, created_by];

    db.query(query, values, (err) => {
        if (err) {
            res.status(500).json({ message: 'Error creating plan', error: err.message });
        } else {
            // req.flash('success', 'Plan created successfully');
            res.redirect('/plans');
        }
    });
});


app.get('/plans/filter', checkAuthenticated, (req, res) => {
    const { location, date, category, sort_by } = req.query;

    let query = `SELECT * FROM plans WHERE 1=1`;
    const values = [];
    if (location) {
        query += ` AND location = ?`;
        values.push(location);
    }

    if (date) {
        query += ` AND date = ?`;
        values.push(date);
    }

    if (category) {
        query += ` AND category = ?`;
        values.push(category);
    }

    if (sort_by === 'date') {
        query += ` ORDER BY date ASC`;
    } else if (sort_by === 'time') {
        query += ` ORDER BY time ASC`;
    }

    db.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error filtering plans', error: err.message });
        } else {
            res.render('plans.ejs', { plans: results, filters: { location, date, category, sort_by } });
        }
    });
});



// Get a plan
app.get('/plans/:id', checkAuthenticated, (req, res) => {
    const planId = req.params.id;

    const query = 'SELECT * FROM plans WHERE plan_id = ?';

    db.query(query, [planId], (err, results) => {
        if (err) {
            res.status(500).json({ message: err.message });
        }
        else {
            res.render('plan.ejs', { plan: results[0] });
        }
    });
});

// Update a plan
app.get('/plans/edit/:id', checkAuthenticated, (req, res) => {
    const planId = req.params.id;

    const query = 'SELECT * FROM plans WHERE plan_id = ?';

    db.query(query, [planId], (err, results) => {
        if (err) {
            console.error('Error fetching plan:', err);
            return res.status(500).json({ message: 'Failed to fetch the plan for editing.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Plan not found.' });
        }

        res.render('edit.ejs', { plan: results[0] });
    });
});

app.patch('/plans/:id', checkAuthenticated, (req, res) => {
    const planId = req.params.id;
    const { title, location, category, date, time, description, created_by } = req.body;

    const query = `
        UPDATE plans
        SET title = ?, location = ?, category = ?, date = ?, time = ?, description = ?, created_by = ?
        WHERE plan_id = ?;
    `;

    const values = [title, location, category, date, time, description, created_by, planId];

    db.query(query, values, (err) => {
        if (err) {
            res.status(400).json({ message: err.message });
        } else {
            res.redirect(`/plans`);
        }
    });
});



// Delete a plan
app.delete('/plans/:id', checkAuthenticated, (req, res) => {
    const planId = req.params.id;

    const query = 'DELETE FROM plans WHERE plan_id = ?';

    db.query(query, [planId], (err) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else {
            res.redirect('/plans');
        }
    });
});

app.get('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});