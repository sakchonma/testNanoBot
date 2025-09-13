import axios from "axios"

import exchangeDetail24hrModel from "../models/ExchangeDetail24hr"

export const fetchAndSaveExchangeDetails = async () => {
    try {
        const { data } = await axios.get("https://api1.binance.com/api/v3/ticker/24hr", { timeout: 5000 });
        if (!data || !data.length) return;

        const bulkOps = data.map((item: any) => ({
            updateOne: {
                filter: { symbol: item.symbol },
                update: {
                    $set: {
                        symbol: item.symbol,
                        buy: item.bidPrice,
                        sell: item.askPrice,
                        changeRate: item.priceChangePercent,
                        changePrice: item.priceChange,
                        high: item.highPrice,
                        low: item.lowPrice,
                        vol: item.volume,
                        volValue: item.quoteVolume,
                        last: item.lastPrice,
                        updatedAt: new Date(),
                    },
                    $setOnInsert: { createdAt: new Date() }
                },
                upsert: true
            }
        }));

        const result = await exchangeDetail24hrModel.bulkWrite(bulkOps);
        console.log(`[fetchAndSaveExchangeDetails] Saved ${bulkOps.length} docs`);
    } catch (error: any) {
        console.error("[fetchAndSaveExchangeDetails] error:", error.message || error);
    }
}
