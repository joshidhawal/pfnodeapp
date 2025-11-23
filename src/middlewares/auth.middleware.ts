import { AuthService } from "../services/auth.service.js";
import { AppLogger } from "../services/logger.service.js";
import { sendResponseJSON } from "../utils/send-res.util.js";

const authService = new AuthService();
const logger = AppLogger.getChildLogger("AuthMiddleware");

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponseJSON(res, 401, {
        message: "Missing or invalid Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = authService.verifyToken(token);
    const userDetails = await authService.getUserSec(decoded["userId"]);
    // logger.info("userdetails");
    // logger.info(userDetails);
    req.user = {
      userId: userDetails["userId"],
      isAdmin: userDetails["isAdmin"],
      ...userDetails["user"],
    };
    // logger.info("req.user");
    // logger.info(decoded);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: " + err.message });
  }
};
