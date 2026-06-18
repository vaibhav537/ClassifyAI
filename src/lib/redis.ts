import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

function createRedisClient() {
  if (!redisUrl) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("REDIS_URL is not set in production environment");
    }

    return new Redis("redis://127.0.0.1:6379", {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      enableReadyCheck: false,
    });
  }

  const client = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
    enableReadyCheck: false,
  });

  client.on("error", (error) => {
    console.error("[Redis Error]", error.message);
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}