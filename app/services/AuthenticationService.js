/**
 * Created by pierre on 18/04/16.
 */

'use strict';

module.exports = class AuthenticationService {

    constructor (helper) {
        this.helper = helper;
    }

    login (login, password, callback) {
        var user = {
            "login" : login,
            "password" : password
        };
        this.helper.login(JSON.stringify(user), 'users' ,'login', callback);
    }
};

