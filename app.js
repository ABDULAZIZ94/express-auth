var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(upload.array());
app.use(cookieParser());
app.use(session({
    secret: "my_cookie_secret",
    resave: false,
    saveUninitialized: false
}));

var Users = [ { id: 'aziz', password: '1234' } ];

app.get('/signup', (req, res) => {
    res.render('signup', {
        message: "Welcome"
        });
    }
);

app.post('/signup', (req, res) => {
        console.log("processing post in server");
        if( !req.body.id || !req.body.password){
            console.log(req);
            res.status("404");
            res.send("Invallid details");
        }else{
            Users.filter( (user) => {
                if(user.id === req.body.id){
                    res.render('signup',{
                        message:"User already exist! Login or choose another user id"
                    });
                }
            });
            var newUser = {id: req.body.id, password: req.body.password};
            Users.push(newUser);
            console.log(newUser);
            res.redirect('/protected_page');
        }
    }
);

function checkSignIn(req, res, next){
    if(req.session.user){
        next();
    }else{
        var err = new Error("Not Sign In");
        console.log(req.session.user);
        next(err); //Error. trying to acces unauthorized page!
    }
}

app.get('/protected_page', checkSignIn, function(req, res){
    res.render('protected_page', {id: req.session.user.id})
 });

app.get('/login', (req, res) => {
    res.render('login', {
        message: "Welcome"
        });
});

app.post('/login', (req, res) => {
    console.log(Users);
    if(!req.body.id || !req.body.password){
        res.render("login", {message: "Please enter both id and password"});
    }else{
        Users.filter( (user)=>{
            if(user.id === req.body.id && user.password === req.body.password ){
                req.session.user = user;
                res.redirect('/protected_page');
            }
        });
        res.render('login', {message: "Invallid Credentials!!!"});
    }
});

// app.get('/logout', (req, res) => {
//     req.session.destroy( (req, res) => {
//         console.log("user logged out");
//     });
//     res.redirect('/login');
// });

// app.use('/protected_page', (err, req, res, next) => {
//     console.log(err);
//     //User shoild be authenticated, redirect him to log in
//     res.redirect('/login');
// });



app.listen(80)