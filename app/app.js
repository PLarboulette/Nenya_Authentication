/**
 * Created by pierre on 15/04/16.
 */

// Modules imports
const express = require('express');
const appExpress = express();
const http = require('http').Server(appExpress);
const bodyParser = require('body-parser');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

// Own modules imports
const AuthenticationService = require("./services/AuthenticationService");
const Helper = require("./amqp/Helper");
const config = require('./utils/config.json');


class app  {

    constructor () {
        this.helper = new Helper('localhost');
        this.authenticationService = new AuthenticationService(this.helper);
        this.init();
        this.initPassport();
        this.initRoutes();
        this.launch();
    }

    init () {
        appExpress.set('port', process.env.PORT || config.port);
        appExpress.use(bodyParser.json());
        appExpress.use(bodyParser.urlencoded({ extended: true }));
        appExpress.use(passport.initialize());
        appExpress.use(passport.session());
    }

    initPassport () {

        passport.use('local-login', new LocalStrategy(
            {
                usernameField: 'login',
                passwordField: 'password'
            },
            function(username, password, callback) {
                this.authenticationService.login(username, password, callback);
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

    }

    initRoutes () {

        appExpress.post('/login',
            passport.authenticate('local-login', { failureRedirect: 'http://localhost:3000' }),
            function(req, res) {
                res.json(JSON.parse(req.user).data.id);
            });

        appExpress.get('/logout',
            function(req, res){
                req.logout();
                res.redirect('/');
            }
        );
    }

    launch () {
        http.listen(appExpress.get('port'), function(){
            console.log("INFO = [Listening on port "+appExpress.get('port')+"]");
        });
    }
}

new app();