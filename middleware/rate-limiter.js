const Redis = require('redis');

const redisUrl = process.env.REDIS_URL;
const redisClient = Redis.createClient({
  url: redisUrl,
});

redisClient.connect().catch(console.error);

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis:', redisUrl.replace(/:[^:]*@/, ':****@'));
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

const rateLimiter = ({ windowInSeconds, maxRequests }) => {
  return async (req, res, next) => {
    try {
      const ip = req.ip;
      const key = `rate-limit:${ip}:${req.originalUrl}`;

      const requests = await redisClient.incr(key);

      if (requests === 1) {
        await redisClient.expire(key, windowInSeconds);
      }

      if (requests > maxRequests) {
        return res.status(429).json({
          message: 'Too many requests. Please try again later.',
        });
      }

      next();
    } catch (err) {
      console.error('Rate limiter error:', err);
      next();
    }
  };
};

module.exports = rateLimiter;
