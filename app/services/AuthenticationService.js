/**
 * Created by pierre on 18/04/16.
 */

// Imports
var Helper = require("./../amqp/Helper");

// Exports
exports.login = _login;

// Private

function _login (login, password, callback) {
    var user = {
        "login" : login,
        "password" : password
    };
    Helper.login(JSON.stringify(user), 'users' ,'login', callback);
}

module.Exports = class AuthenticationService {

    constructor () {

    }

    login (login, password, callback) {

    }
};

