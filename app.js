
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

// Middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'ifgijddf<9394#39EDez',
    name: "session",
    cookie: {
        sameSite: "lax",
        maxAge: 86400,
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');

app.get('/', (req, res) => {
    var userId = req.query.userId
    res.render('index', { user: undefined })
})
app.use('/', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/admin', adminRoutes)


// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
