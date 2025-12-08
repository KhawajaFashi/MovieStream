import redis from "../config/redis.js";

export async function getOrSetCache(key, fetchFn) {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

    const fresh = await fetchFn();
    await redis.set(key, JSON.stringify(fresh), "EX", 60 * 5); // 5-min TTL
    return fresh;
}
