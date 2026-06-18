import { Redis } from "@upstash/redis";

let client: Redis | null = null;

function getRedisClient() {
  if (client) return client;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing"
    );
  }

  client = new Redis({
    url,
    token,
  });

  return client;
}

type RedisExpiryMode = "EX" | "PX" | "ex" | "px";
type RedisCondition = "NX" | "XX" | "nx" | "xx";

export const redis = {
  async setex(key: string, seconds: number, value: string) {
    return getRedisClient().set(key, value, { ex: seconds });
  },

  async set(
    key: string,
    value: string,
    mode?: RedisExpiryMode,
    ttl?: number,
    condition?: RedisCondition
  ) {
    const normalizedMode = mode?.toUpperCase();
    const normalizedCondition = condition?.toUpperCase();

    if (normalizedMode === "EX" && typeof ttl === "number") {
      if (normalizedCondition === "NX") {
        return getRedisClient().set(key, value, { ex: ttl, nx: true });
      }

      if (normalizedCondition === "XX") {
        return getRedisClient().set(key, value, { ex: ttl, xx: true });
      }

      return getRedisClient().set(key, value, { ex: ttl });
    }

    if (normalizedMode === "PX" && typeof ttl === "number") {
      if (normalizedCondition === "NX") {
        return getRedisClient().set(key, value, { px: ttl, nx: true });
      }

      if (normalizedCondition === "XX") {
        return getRedisClient().set(key, value, { px: ttl, xx: true });
      }

      return getRedisClient().set(key, value, { px: ttl });
    }

    return getRedisClient().set(key, value);
  },

  async get<T = string>(key: string) {
    return getRedisClient().get<T>(key);
  },

  async del(key: string) {
    return getRedisClient().del(key);
  },
};