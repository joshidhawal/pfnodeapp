import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error.middleware.js";
import { config } from "./config/env.js";
const app = express();
const PORT = 8000;
console.table(config);
app.use(cors());
app.use(express.json());
// Routes
// app.use("/api/users", userRoutes);
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
// Error handler
app.use(errorHandler);
app.listen(PORT, () => {
    console.log("Server is Successfully Running, and App is listening on port " + PORT);
});
