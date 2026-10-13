// src/middleware/rateLimit.js
const buckets = new Map(); // userId -> { count, resetAt }

exports.impleRateLimit = ({ max = 5, windowMs = 60_000 }) => {
  return (req, res, next) => {
    const id = req.user?._id?.toString() ?? req.ip;
    const now = Date.now();
    const bucket = buckets.get(id) ?? { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(id, bucket);

    if (bucket.count > max) {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded. Try again in a minute.",
      });
    }
    next();
  };
};
