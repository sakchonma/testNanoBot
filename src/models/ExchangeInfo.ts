import mongoose from "mongoose";
const { Schema } = mongoose;

const FilterSchema = new Schema({
    filterType: String,
    minPrice: String,
    maxPrice: String,
    tickSize: String,
    minQty: String,
    maxQty: String,
    stepSize: String,
    limit: Number,
    minTrailingAboveDelta: Number,
    maxTrailingAboveDelta: Number,
    minTrailingBelowDelta: Number,
    maxTrailingBelowDelta: Number,
    bidMultiplierUp: String,
    bidMultiplierDown: String,
    askMultiplierUp: String,
    askMultiplierDown: String,
    avgPriceMins: Number,
    applyMinToMarket: Boolean,
    applyMaxToMarket: Boolean,
    maxNumOrders: Number,
    maxNumOrderLists: Number,
    maxNumAlgoOrders: Number,
    maxNumOrderAmends: Number,
});

const ExchangeInfoSchema = new Schema({
    symbol: {
        type: String,
        required: true,
        unique: true
    },

    status: {
        type: String,
        default: "TRADING"
    },

    baseAsset: {
        type: String,
        default: null
    },

    baseAssetPrecision: {
        type: Number,
        default: 8
    },

    quoteAsset: {
        type: String,
        default: null
    },

    quotePrecision: {
        type: Number,
        default: 8
    },

    quoteAssetPrecision: {
        type: Number,
        default: 8
    },

    baseCommissionPrecision: {
        type: Number,
        default: 8
    },

    quoteCommissionPrecision: {
        type: Number,
        default: 8
    },

    orderTypes: {
        type: [String],
        default: [
            "LIMIT",
            "LIMIT_MAKER",
            "MARKET",
            "STOP_LOSS",
            "STOP_LOSS_LIMIT",
            "TAKE_PROFIT",
            "TAKE_PROFIT_LIMIT"
        ]
    },

    icebergAllowed: {
        type: Boolean,
        default: true
    },

    ocoAllowed: {
        type: Boolean,
        default: true
    },

    otoAllowed: {
        type: Boolean,
        default: true
    },

    quoteOrderQtyMarketAllowed: {
        type: Boolean,
        default: true
    },

    allowTrailingStop: {
        type: Boolean,
        default: true
    },

    cancelReplaceAllowed: {
        type: Boolean,
        default: true
    },

    amendAllowed: {
        type: Boolean,
        default: true
    },

    pegInstructionsAllowed: {
        type: Boolean,
        default: true
    },

    isSpotTradingAllowed: {
        type: Boolean,
        default: true
    },

    isMarginTradingAllowed: {
        type: Boolean,
        default: true
    },

    filters: {
        type: [FilterSchema],
        default: []
    },

    permissions: {
        type: [String],
        default: []
    },

    permissionSets: {
        type: [[String]],
        default: []
    },

    defaultSelfTradePreventionMode: {
        type: String,
        default: "EXPIRE_MAKER"
    },

    allowedSelfTradePreventionModes: {
        type: [String],
        default: ["EXPIRE_TAKER", "EXPIRE_MAKER", "EXPIRE_BOTH", "DECREMENT"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
});

const ExchangeInfo = mongoose.model("ExchangeInfo", ExchangeInfoSchema);
export default ExchangeInfo;
