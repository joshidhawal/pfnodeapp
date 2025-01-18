"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_js_1 = require("./db.js");
function getUsers() {
    // Fetch a random integer between -99 and +99
    var dbOutput = (0, db_js_1.getAllFromDatabase)('SELECT RANDOM() % 100 as result, 1 as column_new union SELECT RANDOM() % 100 as result , 1 as column_new union SELECT RANDOM() % 100 as result, 1 as column_new union SELECT RANDOM() % 100 as result, 1 as column_new;');
    return new Promise(function (resolve, reject) {
        dbOutput
            .then(
        // @ts-ignore
        function (response) {
            // @ts-ignore
            var serverResponse = [];
            // processing the DB Response
            console.log("logging in users.ts : ", response);
            response.forEach(function (row) {
                serverResponse.push(row);
            });
            // @ts-ignore
            resolve(serverResponse);
        }, function (response) {
            console.error(response);
            reject(response);
        })
            .catch(function (error) {
            console.error("Failed to resolve the Promise", error);
            reject(error);
        });
    });
}
module.exports = {
    "getUsers": getUsers
};
