import express from "express";
const app = express();
const PORT = 8000;
// Handling '/' Request
// app.get('/', (_req, _res) => {
//     let serverResponse = getUsers().then(
//         (serverResponse) => {
//             console.log("Logging in app.ts : " + serverResponse);
//             _res.send(serverResponse);
//         }, (serverResponse) => {
//             console.log("Logging in app.ts : " + serverResponse);
//             _res.send(serverResponse);
//         }
//     );
// });
app.listen(PORT, () => {
    console.log("Server is Successfully Running, and App is listening on port " + PORT);
});
