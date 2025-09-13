import axios from 'axios';
import ExchangeInfosModel from '../models/ExchangeInfo';

export const fetcherExchangeInfo = async () => {
    try {
        const { data } = await axios.get("https://api.binance.com/api/v3/exchangeInfo", { timeout: 5000 });
        const symbols: any[] = data?.symbols || [];
        if (!symbols.length) return;

        const bulkOps = symbols.map((coin: any) => ({
            updateOne: {
                filter: { symbol: coin.symbol },
                update: {
                    $set: {
                        symbol: coin.symbol,
                        status: coin.status,
                        baseAsset: coin.baseAsset,
                        baseAssetPrecision: coin.baseAssetPrecision,
                        quoteAsset: coin.quoteAsset,
                        quotePrecision: coin.quotePrecision,
                        quoteAssetPrecision: coin.quoteAssetPrecision,
                        baseCommissionPrecision: coin.baseCommissionPrecision,
                        quoteCommissionPrecision: coin.quoteCommissionPrecision,
                        orderTypes: coin.orderTypes || [],
                        icebergAllowed: coin.icebergAllowed,
                        ocoAllowed: coin.ocoAllowed,
                        otoAllowed: coin.otoAllowed,
                        quoteOrderQtyMarketAllowed: coin.quoteOrderQtyMarketAllowed,
                        allowTrailingStop: coin.allowTrailingStop,
                        cancelReplaceAllowed: coin.cancelReplaceAllowed,
                        amendAllowed: coin.amendAllowed,
                        pegInstructionsAllowed: coin.pegInstructionsAllowed,
                        isSpotTradingAllowed: coin.isSpotTradingAllowed,
                        isMarginTradingAllowed: coin.isMarginTradingAllowed,
                        filters: coin.filters || [],
                        permissions: coin.permissions || [],
                        permissionSets: coin.permissionSets || [],
                        defaultSelfTradePreventionMode: coin.defaultSelfTradePreventionMode,
                        allowedSelfTradePreventionModes: coin.allowedSelfTradePreventionModes,
                        updatedAt: new Date(),
                    },
                    $setOnInsert: { createdAt: new Date() }
                },
                upsert: true
            }
        }));

        const result = await ExchangeInfosModel.bulkWrite(bulkOps);
        console.log(`[fetcherExchangeInfo] Saved ${bulkOps.length} docs`);
    } catch (error: any) {
        console.error("[fetcherExchangeInfo] error:", error.message || error);
    }
}
