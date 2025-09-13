import mongoose from "mongoose"
const { Schema } = mongoose

const CoinSchema = new Schema({
    symbol: {
        type: String,
        default: null
    },
    price: {
        type: String,
        default: null
    },
    createAt: {
        type: Date,
        default: new Date().getTime()
    },
})

const Coin = mongoose.model('Coin', CoinSchema)
export default Coin