import sqlite from 'sqlite3';
const database = sqlite.Database;
// Open a SQLite database, stored in the file db.sqlite
const db = new database('db.sqlite');
createTable('usertesting', {
    "user_id": "varchar(50) UNIQUE",
    "user_name": "varchar(50)",
    "user_email": "varchar(50)",
    "PRIMARY KEY": "(user_id, user_email)"
});
export function createTable(tableName, columnStructure) {
    let createStmtArray = [];
    for (const column in columnStructure) {
        //@ts-ignore
        createStmtArray.push(column.concat(' ', columnStructure[column]));
    }
    // console.log(createStmtArray.join(',\n'));
    let stmt = `DROP TABLE IF EXISTS ${tableName}; CREATE TABLE ${tableName} (\n${createStmtArray.join(',\n')} );`;
    let dbOutput = runstmt(stmt);
    dbOutput.then(
    // @ts-ignore
    (response) => {
        // @ts-ignore
        // processing the DB Response
        console.log("logging in users.ts : ", response);
    }, (response) => {
        console.error(response);
    })
        .catch((error) => {
        console.error("Failed to resolve the Promise", error);
    });
}
// Various DB functions
export function getAllFromDatabase(query) {
    return new Promise((resolve, reject) => {
        db.all(query, (error, rows) => {
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
export function runstmt(query) {
    return new Promise((resolve, reject) => {
        db.run(query, (error) => {
            if (error) {
                console.log("logging error response inside db.ts callback function : ", error);
                reject(error);
            }
            else {
                console.log("logging inside db.ts callback function : ");
                resolve("success");
            }
        });
    });
}
