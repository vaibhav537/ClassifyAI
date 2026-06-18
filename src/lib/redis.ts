import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl && process.env.NODE_ENV === "production") {
  throw new Error("REDIS_URL is not set in production environment");
}

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

export const redis =
  globalForRedis.redis ??
  new Redis(redisUrl ?? "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: 1,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
