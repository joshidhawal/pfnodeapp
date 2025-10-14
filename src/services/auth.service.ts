import jwt from "jsonwebtoken";
import config from "../config/env.js";

export class AuthService {
  private secret;
  constructor() {
    this.secret = config.JWT_SECRET;
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (err) {
      throw new Error("Invalid token");
    }
  }
}
