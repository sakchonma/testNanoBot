import express from "express"
import {
    listCoinsController,
    listCoinsSchema,
} from "../controllers/coin"
import authorize from "../middleware/auth"
const router = express.Router()

router.get('/list', authorize(), listCoinsSchema, listCoinsController)

export default router