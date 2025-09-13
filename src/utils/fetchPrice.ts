import axios from 'axios';
import CoinsModel from '../models/Coin';

export const fetchPrice = async () => {
    try {
        const { data } = await axios.get("https://api.binance.com/api/v3/ticker/price", { timeout: 5000 });
        if (!data || !data.length) return;

        const bulkOps = data.map((coin: { symbol: string; price: string }) => ({
            updateOne: {
                filter: { symbol: coin.symbol },
                update: {
                    $set: {
                        symbol: coin.symbol,
                        price: coin.price,
                        updatedAt: new Date(),
                    },
                    $setOnInsert: { createdAt: new Date() }
                },
                upsert: true
            }
        }));

        const result = await CoinsModel.bulkWrite(bulkOps);
        console.log(`[fetchPrice] Saved ${bulkOps.length} docs`);
    } catch (error: any) {
        console.error("[fetchPrice] error:", error.message || error);
    }
}