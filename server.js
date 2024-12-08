const path = require("path");
const session = require("express-session");

function createServer () {
    const express = require('express');
    const app = express();
    const bodyParser = require('body-parser');
    const session = require('express-session');
    const path = require('path');
    const dotenv = require('dotenv');
    const cookieParser = require('cookie-parser');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    dotenv.config();
    app.use(session({
        secret: process.env.SESSION_SECRET,
        name: "session",
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        }
    }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(cookieParser(process.env.COOKIE_SECRET));

    // View engine setup
    app.set('view engine', 'ejs');

    // Routes
    const authRoutes = require('./routes/auth');
    const taskRoutes = require('./routes/tasks');
    const adminRoutes = require('./routes/admin');

    app.use('/auth', authRoutes);
    app.use('/', taskRoutes);
    app.use('/admin', adminRoutes)

    return app;
}

module.exports = { createServer };