"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFromDatabase = getAllFromDatabase;
var database = sqlite.Database;
// Open a SQLite database, stored in the file db.sqlite
var db = new database('db.sqlite');
function getAllFromDatabase(query) {
    return new Promise(function (resolve, reject) {
        db.all(query, function (error, rows) {
            if (error) {
                console.log("logging error response inside db.ts callback function : ", error);
                reject(error);
            }
            else {
                console.log("logging inside db.ts callback function : ", rows);
                resolve(rows);
            }
        });
    });
}
