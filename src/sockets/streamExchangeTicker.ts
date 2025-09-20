import WebSocket from "ws";
import { getRedisClient } from "../configs/redis";

export function startTickerStream(symbols: string[]) {
    const streams = symbols.map(s => `${s.toLowerCase()}@trade`).join("/");
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    console.log(wsUrl)
    const ws = new WebSocket(wsUrl);

    ws.on("message", async (raw: string) => {
        const data = JSON.parse(raw.toString());
        if (data?.data) {
            const { s: symbol, p: price, q: qty, T: time } = data.data;
            const redis = await getRedisClient();
            const cacheKey = `ticker:${symbol}`;
            console.log(cacheKey)
            await redis.set(cacheKey, JSON.stringify({ price, qty, time }), 'EX', 5);
        }
    });
}
