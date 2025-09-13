import express from 'express'
import cors from "cors"
import morgan from "morgan"
import coinRouter from "./coin"
import userRouter from "./user"
const router = express.Router()

const options: cors.CorsOptions = {
    allowedHeaders: ["X-Requested-With", "Content-Type", "Authorization"],
    credentials: true,
    methods: "GET,OPTIONS,PUT,POST,DELETE",
    preflightContinue: false,
    origin: true,
}

router.use(cors(options))
router.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))

router.options('*', cors(options))
router.use('/coin', coinRouter)
router.use('/user', userRouter)

export default router