const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.adminProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.AUTH_SECRET);
      const userData = await User.findById(decoded.id);
      if (!userData) {
        return res.status(401).json({ message: "User not found" });
      }

      if (userData.role !== "admin") {
        return res
          .status(401)
          .json({ message: "Not authorized, token failed" });
      }

      req.user = userData;
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
