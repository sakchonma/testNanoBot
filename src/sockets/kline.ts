import { Namespace, Socket } from "socket.io";
import { getRedisClient } from "../configs/redis";
import { startKlineStream } from "../sockets/streamExchangeKline";

const timers: any = new Map();
const subscribers: any = new Map();
const streamMap: any = new Map();
export default (io: Namespace, socket: Socket) => {
    const onGetSymbol = async (
        data: { symbol: string; interval: string },
        callback?: (response: string, error: string) => void
    ) => {
        try {
            const redis = await getRedisClient();
            const cacheKey = `kline:${data.symbol}:${data.interval}`;

            if (!subscribers.has(cacheKey)) {
                subscribers.set(cacheKey, new Set());
            }
            subscribers.get(cacheKey)!.add(socket.id);

            socket.join(cacheKey);
            if (!streamMap.has(cacheKey)) {
                console.log(`Start Binance stream for ${cacheKey}`);
                const ws = await startKlineStream(data.symbol, data.interval);
                socket.emit("klineUpdate", { "massage": "waiting for socket ..." });
                streamMap.set(cacheKey, ws);
            }

            if (!timers.has(cacheKey)) {

                console.log(`Start timer for ${cacheKey}`);
                const timer = setInterval(async () => {
                    console.log(`Refreshing ${cacheKey} from Binance`);
                    const cached = await redis.get(cacheKey);
                    console.log("cached:", cached)
                    if (cached) {
                        io.to(cacheKey).emit("klineUpdate", JSON.parse(cached));
                    }
                }, 60000);

                timers.set(cacheKey, timer);
            }
            const cached = await redis.get(cacheKey);
            if (cached) {
                socket.emit("klineUpdate", JSON.parse(cached));
            }


            callback && callback("Subscribe success", "null");
        } catch (err) {
            callback && callback("null", err ? err.toString() : "error");
        }
    };

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);

        for (const [cacheKey, subs] of subscribers.entries()) {
            if (subs.has(socket.id)) {
                subs.delete(socket.id);
                console.log(`Removed ${socket.id} from ${cacheKey}`);
            }

            if (subs.size === 0) {
                console.log(`Stop timer for ${cacheKey}`);
                clearInterval(timers.get(cacheKey));

                const ws = streamMap.get(cacheKey);
                if (ws) {
                    ws.close();
                    streamMap.delete(cacheKey);
                }
                subscribers.delete(cacheKey);
                timers.delete(cacheKey);
                subscribers.delete(cacheKey);
            }
        }
    });

    socket.on("subscribeKline", onGetSymbol);
};
