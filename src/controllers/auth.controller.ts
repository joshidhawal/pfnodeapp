import config from "config/env.js";
const jwt = require("jsonwebtoken");

const JWT_SECRET = config.JWT_SECRET;
const JWT_EXPIRES_IN = "1h";

exports.login = (req, res) => {
  const { username, password } = req.body;

  // Dummy user check (replace with DB check)
  if (username === "admin" && password === "password") {
    const userPayload = {
      id: 1,
      username: "admin",
      role: "admin",
    };

    const token = jwt.sign(userPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
};
