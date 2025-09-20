import mongoose from "mongoose"
const { Schema } = mongoose

const KlineSchema = new Schema({
    symbol: {
        type: String,
        default: null
    },
    interval: {
        type: String,
        default: null
    },
    openTime: {
        type: Date,
        default: null
    },
    closeTime: {
        type: Date,
        default: null
    },
    open: {
        type: Number,
        default: null
    },
    high: {
        type: Number,
        default: null
    },
    low: {
        type: Number,
        default: null
    },
    close: {
        type: Number,
        default: null
    },
    volume: {
        type: Number,
        default: null
    },
    quoteVolume: {
        type: Number,
        default: null
    },
    tradeCount: {
        type: Number,
        default: null
    },
    takerBuyBase: {
        type: Number,
        default: null
    },
    takerBuyQuote: {
        type: Number,
        default: null
    },
    createAt: {
        type: Date,
        default: new Date().getTime()
    },
})

const Kline = mongoose.model('Kline', KlineSchema)
export default Kline