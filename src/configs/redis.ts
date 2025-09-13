import Redis from 'ioredis';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
    if (!redisClient) {
        const server_env = process.env.SERVER || '0';
        const redis_env = process.env.REDIS_URL || '';
        const vercel_redis_env = process.env.VERCEL_REDIS_URL || '';

        const connect_redis = server_env === '1' ? vercel_redis_env : redis_env;
        if (!connect_redis) {
            throw new Error('Redis URL is not defined');
        }

        redisClient = new Redis(connect_redis);
        redisClient.on('connect', () => console.log('Redis Ready!'));
        redisClient.on('error', (err) => console.error('Redis error:', err));
    }

    return redisClient;
};
