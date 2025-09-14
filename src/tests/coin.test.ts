import {
  listExchangeService,
  getInfoExchangeService,
  getAllPriceService
} from '../services/coin';

import Redis from 'ioredis';
import ExchangeInfoModel from '../models/ExchangeInfo';
import Exchange24hrModel from '../models/Exchange24hr';
import PriceModel from '../models/Price';
import dotenv from 'dotenv';
dotenv.config();
// Mock Redis
jest.mock('ioredis');
const mockedRedis = {
  get: jest.fn(),
  set: jest.fn(),
  on: jest.fn(),
};
(Redis as unknown as jest.Mock).mockImplementation(() => mockedRedis);

// Mock Mongoose Models
jest.mock('../models/ExchangeInfo');
jest.mock('../models/Exchange24hr');
jest.mock('../models/Price');

describe('Exchange Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listExchangeService', () => {
    it('should return cached data if exists', async () => {
      const cacheKey = 'price-coins-1-10';
      const cachedData = { data: [{ symbol: 'BTCUSDT' }] };
      mockedRedis.get.mockResolvedValueOnce(JSON.stringify(cachedData));
      const result = await listExchangeService(1, 10);
      expect(mockedRedis.get).toHaveBeenCalledWith(cacheKey);
      expect(result.data.data).toEqual(cachedData.data);
    });

    it('should fetch from DB if cache is empty', async () => {
      mockedRedis.get.mockResolvedValueOnce(null);
      (ExchangeInfoModel.find as any).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([{ symbol: 'BTCUSDT' }])
      });
      (ExchangeInfoModel.countDocuments as any).mockResolvedValue(1);

      const result = await listExchangeService(1, 10);
      expect(result.data).toEqual([{ symbol: 'BTCUSDT' }]);
      expect(mockedRedis.set).toHaveBeenCalled();
    });
  });

  describe('getInfoExchangeService', () => {
    it('should return cached data if exists', async () => {
      const symbol = 'BTCUSDT';
      const cachedData = { data: { info: {}, detail24hr: {} } };
      mockedRedis.get.mockResolvedValueOnce(JSON.stringify(cachedData));

      const result = await getInfoExchangeService(symbol);
      expect(result.data.data).toEqual(cachedData.data);
    });

    it('should fetch from DB if cache is empty', async () => {
      mockedRedis.get.mockResolvedValueOnce(null);
      (ExchangeInfoModel.findOne as any).mockResolvedValue({ symbol: 'BTCUSDT' });
      (Exchange24hrModel.findOne as any).mockResolvedValue({ priceChange: 100 });

      const result = await getInfoExchangeService('BTCUSDT');
      expect(result.data.info.symbol).toBe('BTCUSDT');
      expect(mockedRedis.set).toHaveBeenCalled();
    });
  });

  describe('getAllPriceService', () => {
    it('should return cached data if exists', async () => {
      const cachedData = { data: [{ symbol: 'BTCUSDT', price: 30000 }] };
      mockedRedis.get.mockResolvedValueOnce(JSON.stringify(cachedData));

      const result = await getAllPriceService();
      expect(result.data.data).toEqual(cachedData.data);
    });

    it('should fetch from DB if cache is empty', async () => {
      mockedRedis.get.mockResolvedValueOnce(null);
      (PriceModel.find as any).mockResolvedValue([{ symbol: 'BTCUSDT', price: 30000 }]);

      const result = await getAllPriceService();
      expect(result.data).toEqual([{ symbol: 'BTCUSDT', price: 30000 }]);
      expect(mockedRedis.set).toHaveBeenCalled();
    });
  });

});
