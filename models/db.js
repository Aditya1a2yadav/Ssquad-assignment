const mysql = require('mysql2');

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

module.exports = connection;
