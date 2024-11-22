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

const initializePassport = require('./passport-config');
initializePassport(passport);

// Database connection
const db = require('../models/db');

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
            res.status(200).json({ plans: results, page });
        }
    });
});
// To create new plan
app.post('/plans', (req, res) => {
    const { title, location, category, date, time, description, created_by } = req.body;
    const plan_id = uuidv4();

    const query = `
        Insert into plans (plan_id, title, location, category, date, time, description, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [plan_id, title, location, category, date, time, description, created_by];

    db.query(query, values, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error creating plan', error: err.message });
        } else {
            res.status(201).json({ message: 'Plan created successfully', plan_id });
        }
    });
});

app.get('/plans/filter', (req, res) => {
    const { location, date, category, sort_by } = req.query;

    const query = `
        SELECT * FROM plans
        WHERE (? IS NULL OR location = ?) AND (? IS NULL OR date = ?) AND (? IS NULL OR category = ?)
        ORDER BY CASE WHEN ? = 'time' THEN time END ASC, CASE WHEN ? = 'date' THEN date END ASC;
    `;
    const values = [location, location, date, date, category, category, sort_by, sort_by];

    db.query(query, values, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error filtering plans', error: err.message });
        } else {
            res.redirect('/plans',{ plans: results });
        }
    });
});

// Get a plan
app.get('/plans/:id', (req, res) => {
    const planId = req.params.id;

    const query = 'SELECT * FROM plans WHERE plan_id = ?';

    db.query(query, [planId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.redirect('plan.ejs',{results});
    });
});

// Update a plan
app.patch('/plans/:id', (req, res) => {
    const planId = req.params.id;
    const { title, location, category, date, time, description, created_by } = req.body;

    const query = `
        UPDATE plans
        SET title = ?, location = ?, category = ?, date = ?, time = ?, description = ?, created_by = ?
        WHERE plan_id = ?;
    `;

    const values = [title, location, category, date, time, description, created_by, planId];

    db.query(query, values, (err, results) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.redirect(`/plans/${planId}`);
    });
});


// Delete a plan
app.delete('/plans/:id', (req, res) => {
    const planId = req.params.id;

    const query = 'DELETE FROM plans WHERE plan_id = ?';

    db.query(query, [planId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.redirect('/plans');
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