// Imports for other libraries
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = 8080;

app.use(express.static('src'));
// Enable getting email and password for the form
app.use(express.urlencoded({ extended: false}));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// Using cookie parser to work with cookies
app.use(cookieParser());

// Current valid users
const users = [{id: 1, email: 'first@example.com', password: '123'}, {id: 2, email: 'second@example.com', password: '123'}, {id: 3, email: 'third@example.com', password: '123'}];

// Using ejs for the template engine
app.set('view engine', 'ejs');
app.set('views', 'src');

const initializePassport = require('./passport');
initializePassport(passport, email => users.find(user => user.email === email),id => users.find(user => user.id === id));

app.get('/', (req, res)=>{
    // Implementing session counter
    if(req.user){
        if(req.session.count){
            req.session.count += 1;
        } else {
            req.session.count = 1;
        }
    }

    // Return index.ejs web page
    res.render('index', { email: req.user ? req.user.email: undefined, count: req.user ? req.session.count : 0 });
});

app.get('/login', (req, res) => {
    // Returning the login.ejs web page
    res.render('login', );
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

app.listen(port, ()=>{
    console.log('Running on the port 8080');
})