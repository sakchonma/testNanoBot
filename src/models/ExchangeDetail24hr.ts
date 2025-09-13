import mongoose from "mongoose"
const { Schema } = mongoose

const exchangeDetail24hrSchema = new Schema({
  symbol: {
    type: String
  },
  buy: {
    type: String,
    default: 0
  },
  sell: {
    type: String,
    default: 0
  },
  changeRate: {
    type: String,
    default: 0
  },
  changePrice: {
    type: String,
    default: 0
  },
  high: {
    type: String,
    default: 0
  },
  low: {
    type: String,
    default: 0
  },
  vol: {
    type: String,
    default: 0
  },
  volValue: {
    type: String,
    default: 0
  },
  last: {
    type: String,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
})

const ExchangeDetail24hr = mongoose.model('ExchangeDetail24hr', exchangeDetail24hrSchema)
export default ExchangeDetail24hr