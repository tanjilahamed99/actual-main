const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Extract and verify Bearer token, load user, check session.
 * Returns { user } on success, or throws a structured error.
 */
async function authenticate(req, { requireSession = true } = {}) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer")) {
    const err = new Error("Not authorized, no token");
    err.status = 401;
    throw err;
  }

  const token = header.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.AUTH_SECRET);
  } catch {
    const err = new Error("Not authorized, token failed");
    err.status = 401;
    throw err;
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    const err = new Error("User not found");
    err.status = 401;
    throw err;
  }

  // Session check (single-device login)
  if (requireSession && user.activeSessionId !== decoded.sessionId) {
    const err = new Error("Account already logged in from another device");
    err.status = 401;
    throw err;
  }

  return { user, decoded };
}

module.exports = { authenticate };