import { Server, Socket } from "socket.io";
import { getRedisClient } from "../configs/redis";
import { fetchKline } from "../utils/binanceKline";
const timers: any = new Map();
export default (
    io: Server,
    socket: Socket
) => {
    const onGetSymbol = async (
        data: { symbol: string, interval: string },
        callback?: (response: string, error: string) => void
    ) => {
        try {
            const redis = await getRedisClient();
            const cacheKey = `kline:${data.symbol}:${data.interval}`;

            socket.join(cacheKey);

            if (!timers.has(cacheKey)) {
                console.log(`Start timer for ${cacheKey}`);

                await fetchKline(data.symbol, data.interval);

                const timer = setInterval(async () => {
                    console.log(`Refreshing ${cacheKey} from Binance...`);
                    await fetchKline(data.symbol, data.interval);

                    const cached = await redis.get(cacheKey);
                    if (cached) {
                        io.to(cacheKey).emit("klineUpdate", JSON.parse(cached));
                    }
                }, 60000);

                timers.set(cacheKey, timer);
            }

            // ✅ ส่งข้อมูลล่าสุดจาก redis กลับไปหา client ทันที
            const cached = await redis.get(cacheKey);
            if (cached) {
                socket.emit("klineUpdate", JSON.parse(cached));
            }

            callback && callback("Subscribe success", "null");
        } catch (err) {
            callback && callback("null", err ? err.toString() : "error");
        }
    };

    socket.on("subscribeKline", onGetSymbol);
};
