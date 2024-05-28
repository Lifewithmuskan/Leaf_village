require('dotenv').config();
const express = require('express');
const session = require('express-session');
const db = require('./db.js');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Set template engine
app.set('view engine', 'ejs');

// Route prefix
app.use("", require('./routes/routes.js'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
