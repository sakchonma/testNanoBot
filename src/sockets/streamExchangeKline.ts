import WebSocket from "ws";
import { getRedisClient } from "../configs/redis";
import KlineModel from "../models/Kline"; // mongoose schema
const INTERVAL_MS = Number(process.env.SOCKET_INTERVAL_MS || 60000);
export async function startKlineStream(symbol: string, interval = "1m") {
    const streamName = `${symbol.toLowerCase()}@kline_${interval}`;
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streamName}`;
    const ws = new WebSocket(wsUrl);
    const redis = await getRedisClient();

    ws.on("open", () => {
        console.log(`Connected to Binance Kline Stream: ${streamName}`);
    });

    ws.on("message", async (raw: string) => {
        const data = JSON.parse(raw.toString());
        const k = data.data.k;
        if (data.data.e === "kline") {
            const klineData = {
                symbol: data.data.s,
                interval: k.i,
                openTime: new Date(k.t),
                closeTime: new Date(k.T),
                open: parseFloat(k.o),
                high: parseFloat(k.h),
                low: parseFloat(k.l),
                close: parseFloat(k.c),
                volume: parseFloat(k.v),
                tradeCount: k.n,
                isFinal: k.x,
            };

            const cacheKey = `kline:${data.data.s}:${k.i}`;

            await redis.set(cacheKey, JSON.stringify(klineData), "EX", Math.floor(INTERVAL_MS / 1000) - 5 || 55);
            console.log("📊 Kline Update:", streamName);

            if (k.x) {
                await KlineModel.updateOne(
                    { symbol: k.s, interval: k.i, openTime: k.t },
                    {
                        $set: {
                            open: k.o,
                            high: k.h,
                            low: k.l,
                            close: k.c,
                            volume: k.v,
                            closeTime: k.T,
                        },
                    },
                    { upsert: true }
                );
                console.log(`💾 Saved Kline [${k.s} ${k.i}] @ ${k.t}`);
            }
        }
    });

    ws.on("close", () => {
        console.log(`Disconnected from Binance Kline Stream: ${streamName}`);
    });

    ws.on("error", (err) => {
        console.error("WebSocket Error:", err);
    });

    return ws;
}
