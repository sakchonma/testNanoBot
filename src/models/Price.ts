import mongoose from "mongoose"
const { Schema } = mongoose

const PriceSchema = new Schema({
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

const Price = mongoose.model('Price', PriceSchema)
export default Price