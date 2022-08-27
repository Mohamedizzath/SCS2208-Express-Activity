// Imports for other libraries
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
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

// Using ejs for the template engine
app.set('view engine', 'ejs');
app.set('views', 'src');

// Setting up multer
const storage = multer.diskStorage({
    destination: './src/file-uploads/',
    filename: (req, file, callback) => {
        callback(null, req.user.email + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 10485760} //10485760 // 10MB
}).single('fileUpload');

// Current valid users
const users = [{id: 1, email: 'first@example.com', password: '123'}, {id: 2, email: 'second@example.com', password: '123'}, {id: 3, email: 'third@example.com', password: '123'}];

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
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

app.get('/uploads', (req, res) => {
    // Check the user is authenticated
    if(req.user){
        // Given user is authenticated
        res.render('uploads');
    }else{
        // Given user is not authenticated
        res.redirect('/login');
    }

    // TODO: For the development - needs to remove
    // res.render('uploads');
});

app.post('/uploads', (req, res) => {
    upload(req, res, (err) => {
       // Check that there exists an error
       if(err){
           res.render('uploads', { message: err, status: 'error' });
       }else{
           res.render('uploads', { message: 'Upload completed', status: 'success'});
       }
    });
})

app.listen(port, ()=>{
    console.log('Running on the port 8080');
})