import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis.js";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 min
    max: 150,                   // limit per IP
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    }),
});

export default limiter;