import { verifyToken } from "@clerk/backend";

// Authentication middleware with Clerk
const requireAuth = async (req, res, next) => {
  // Getting session token from the Auth header
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No authorization token provided" });
    }
    const token = authHeader.substring(7); // Removing 'Bearer ' prefix
    // Verifying JWTs from getToken()
    const verifiedToken = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    req.userId = verifiedToken.sub;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default requireAuth;
