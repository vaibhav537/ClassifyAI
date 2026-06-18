import { Redis } from "@upstash/redis";

let client: Redis | null = null;

function getRedisClient() {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("Redis Token is missing");
  }
  client = new Redis({
    url,
    token,
  });
  return client;
}

export const redis = {
  async setex(key: string, seconds: number, value: string) {
    return getRedisClient().set(key, value, { ex: seconds });
  },

  async get<T = string>(key: string) {
    return getRedisClient().get<T>(key);
  },

  async del(key: string) {
    return getRedisClient().del(key);
  },
};