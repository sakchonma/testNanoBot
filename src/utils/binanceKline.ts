import axios from "axios";
import { getRedisClient } from "../configs/redis.js";
const INTERVAL_MS = Number(process.env.SOCKET_INTERVAL_MS || 60000);
export async function fetchKline(symbol = "BTCUSDT", interval = "1m") {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`;
    const { data } = await axios.get(url);

    const kline = {
        openTime: data[0][0],
        open: data[0][1],
        high: data[0][2],
        low: data[0][3],
        close: data[0][4],
        volume: data[0][5],
        closeTime: data[0][6],
        symbol,
        interval,
    };
    let cacheKey = `kline:${symbol}:${interval}`
    const redis = await getRedisClient();
    console.log(cacheKey)
    await redis.set(
        cacheKey,
        JSON.stringify(kline),
        'EX',
        Math.floor(INTERVAL_MS / 1000) - 5 || 55
    );

    return kline;
}
