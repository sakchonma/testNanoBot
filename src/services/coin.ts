import { getRedisClient } from '../configs/redis';
import ExchangeInfoModel from '../models/ExchangeInfo';
import Exchange24hrModel from '../models/Exchange24hr';
import PriceModel from '../models/Price';
const INTERVAL_MS = Number(process.env.FETCH_INTERVAL_MS || 60000);

const listExchangeService = async (page: number, limit: number) => {
    try {

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const redis = await getRedisClient();

        const cacheKey = `price-coins-${page}-${limit}`;
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            console.log(`use redis key: price-coins-${page}-${limit}`);
            return { data: JSON.parse(cachedData) };
        }
        const listCoins: any = await ExchangeInfoModel.find().select({
            symbol: 1,
            baseAsset: 1,
            quoteAsset: 1,
            status: 1,
            quoteOrderQtyMarketAllowed: 1,
        })
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 });
        const total = await ExchangeInfoModel.countDocuments();
        const totalPages = limitNumber > 0 ? Math.ceil(total / limitNumber) : 1;

        await redis.set(
            cacheKey,
            JSON.stringify({ data: listCoins, total, page, limit }),
            'EX',
            Math.floor(INTERVAL_MS / 1000) - 5 || 55
        );

        return {
            data: listCoins,
            pagination: {
                total: total,
                page: pageNumber,
                limit: limitNumber,
                totalPages,
            }
        };
    } catch (error: any) {
        throw error.message ? error.message : error;
    }
};

const getInfoExchangeService = async (symbol: string) => {
    try {

        const redis = await getRedisClient();
        const cacheKey = `info-coins-${symbol}`;
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            console.log(`use redis key: info-coins-${symbol}`);
            return { data: JSON.parse(cachedData) };
        }

        const infoExchange: any = await ExchangeInfoModel.findOne({ symbol: symbol })
        const detail24hr: any = await Exchange24hrModel.findOne({ symbol: symbol })
        await redis.set(
            cacheKey,
            JSON.stringify({
                data: {
                    info: infoExchange,
                    detail24hr: detail24hr
                }
            }),
            'EX',
            Math.floor(INTERVAL_MS / 1000) - 5 || 55
        );

        return {
            data: {
                info: infoExchange,
                detail24hr: detail24hr
            },
        };
    } catch (error: any) {
        throw error.message ? error.message : error;
    }
};

const getAllPriceService = async () => {
    try {

        const redis = await getRedisClient();
        const cacheKey = `all-price`;
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            console.log(`use redis key: all-price`);
            return { data: JSON.parse(cachedData) };
        }

        const allPrice: any = await PriceModel.find()

        await redis.set(
            cacheKey,
            JSON.stringify({ data: allPrice }),
            'EX',
            Math.floor(INTERVAL_MS / 1000) - 5 || 55
        );

        return {
            data: allPrice,
        };
    } catch (error: any) {
        throw error.message ? error.message : error;
    }
};

export {
    listExchangeService,
    getInfoExchangeService,
    getAllPriceService
};
