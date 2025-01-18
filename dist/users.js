import { getAllFromDatabase } from "./db.js";
export function getUsers() {
    // Fetch a random integer between -99 and +99
    let dbOutput = getAllFromDatabase('SELECT RANDOM() % 100 as result, 1 as column_new union SELECT RANDOM() % 100 as result , 1 as column_new union SELECT RANDOM() % 100 as result, 1 as column_new union SELECT RANDOM() % 100 as result, 1 as column_new;');
    // let dbOutput = runstmt('select * from users;');
    return new Promise((resolve, reject) => {
        dbOutput
            .then(
        // @ts-ignore
        (response) => {
            // @ts-ignore
            let serverResponse = [];
            // processing the DB Response
            console.log("logging in users.ts : ", response);
            response.forEach((row) => {
                serverResponse.push(row);
            });
            // @ts-ignore
            resolve(serverResponse);
        }, (response) => {
            console.error(response);
            reject(response);
        })
            .catch((error) => {
            console.error("Failed to resolve the Promise", error);
            reject(error);
        });
    });
}
