import mongoose from "mongoose"
const { Schema } = mongoose

const UserSchema = new Schema({
    username: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ["admin", "editor", "user"],
        default: "user"
    },
    createAt: {
        type: Date,
        default: new Date().getTime()
    },
})

const User = mongoose.model('User', UserSchema)
export default User