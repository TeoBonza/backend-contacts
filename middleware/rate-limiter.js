const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.connect().catch(console.error);

const rateLimiter = ({ windowInSeconds, maxRequests }) => {
  return async (req, res, next) => {
    try {
      const ip = req.ip;
      const key = `rate-limit:${ip}:${req.originalUrl}`;

      const requests = await client.incr(key);

      if (requests === 1) {
        await client.expire(key, windowInSeconds);
      }

      if (requests > maxRequests) {
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
        });
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      next();
    }
  };
};

module.exports = rateLimiter;
