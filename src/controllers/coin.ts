import {
    NextFunction,
    Request,
    Response
} from "express"
import {
    listExchangeService as listExchange,
    getInfoExchangeService as getInfoExchange,
    getAllPriceService as getAllPrice,
} from "../services/coin"
import validateRequest from "../middleware/validateRequest"
import Joi from "joi"

const listExchangeSchema = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema = Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .required(),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .required(),
    })

    validateRequest(req, res, next, schema)
}
const listExchangeController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {
        page,
        limit,
    } = req.body
    listExchange(page, limit).then((result) => {
        if (result) {
            return res
                .status(200)
                .json({
                    status: true,
                    ...result,
                })
        } else {
            return res
                .status(200)
                .json({
                    status: false,
                    message: "try again"
                })
        }
    })
        .catch((error: any) => {
            return res.status(200)
                .json({
                    status: false,
                    message: error
                })
        })
}
const getInfoExchangeController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const symbol = req.params.symbol
    getInfoExchange(symbol).then((result) => {
        if (result) {
            return res
                .status(200)
                .json({
                    status: true,
                    ...result,
                })
        } else {
            return res
                .status(200)
                .json({
                    status: false,
                    message: "try again"
                })
        }
    })
        .catch((error: any) => {
            return res.status(200)
                .json({
                    status: false,
                    message: error
                })
        })
}
const getAllPriceController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    getAllPrice().then((result) => {
        if (result) {
            return res
                .status(200)
                .json({
                    status: true,
                    ...result,
                })
        } else {
            return res
                .status(200)
                .json({
                    status: false,
                    message: "try again"
                })
        }
    })
        .catch((error: any) => {
            return res.status(200)
                .json({
                    status: false,
                    message: error
                })
        })
}


export {
    listExchangeSchema,
    listExchangeController,
    getInfoExchangeController,
    getAllPriceController
}