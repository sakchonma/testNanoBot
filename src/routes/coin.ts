import express from "express"
import {
    listExchangeSchema,
    listExchangeController,
    getInfoExchangeController,
    getAllPriceController,
    getAllKeyRedisController,
    listPriceSchema,
    listPriceController
} from "../controllers/coin"

import authorize from "../middleware/auth"
const router = express.Router()

router.post('/list', authorize(), listExchangeSchema, listExchangeController)
router.post('/listprice', authorize(), listPriceSchema, listPriceController)
router.get('/info/:symbol', authorize(), getInfoExchangeController)
router.get('/allprice', authorize(), getAllPriceController)
router.get('/allredis', getAllKeyRedisController)
export default router