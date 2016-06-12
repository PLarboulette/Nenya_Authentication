/**
 * Created by pierre on 15/04/16.
 */

// Modules imports
var express = require('express');
var app = express();
var http = require('http').Server(app);
var Helper = require("./amqp/Helper");
var bodyParser = require('body-parser');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

// Own modules imports
var AuthenticationService = require("./services/AuthenticationService");

// Private

// Passport
passport.use('local-login', new LocalStrategy(
    {
        usernameField: 'login',
        passwordField: 'password'
    },
    function(username, password, callback) {
        AuthenticationService.login(username, password, callback);
    })
);

passport.serializeUser(function(user, cb) {
    cb(null, JSON.parse(user).data.id);
});

passport.deserializeUser(function(id, cb) {
   /* db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });*/

    var user = {};
    user.id = 1;
    cb(null, user);

});

// Express app parameters
app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "tHiSiSasEcRetStr", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

http.listen(app.get('port'), function(){
    console.log("INFO = [Listening on port 3001]");
    Helper.start('localhost');

});

app.post('/login',
    passport.authenticate('local-login', { failureRedirect: 'http://localhost:3000' }),
    function(req, res) {
         res.json(JSON.parse(req.user).data.id);
    });

app.get('/logout',
    function(req, res){
        req.logout();
        res.redirect('/');
    }
);

module.exports.app = app;