const { authenticate } = require("./authHelpers");

exports.authProtect = async (req, res, next) => {
  try {
    const { user } = await authenticate(req, { requireSession: true });
    req.user = user;
    next();
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.requireApproved = (req, res, next) => {
  if (req.user.role === "admin" || req.user.status === "approved")
    return next();
  res.status(403).json({ message: `Account ${req.user.status}` });
};
