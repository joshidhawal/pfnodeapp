import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return res
  //     .status(401)
  //     .json({ message: "Missing or invalid Authorization header" });
  // }

  // const token = authHeader.split(" ")[1];

  try {
    // const decoded = authService.verifyToken(token);
    const decoded = { userId: "TESTADMIN", userRole: "TESTADMIN" };
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: " + err.message });
  }
};
