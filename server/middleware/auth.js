// Authentication middleware with Clerk
const requireAuth = async (req, res, next) => {
  // Getting session token from the Auth header
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No authorization token provided" });
    }
    const token = authHeader.substring(7); // Removing 'Bearer ' prefix
    // Verifying the token with Clerk
    const response = await fetch("https://api.clerk.com/v1/sessions/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const session = await response.json();

    // Attaching user ID to request object
    req.userId = session.user_id;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

export default requireAuth;
