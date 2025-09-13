import {
    NextFunction,
    Request,
    Response
} from "express"
import {
    listCoinsService as listCoins,
} from "../services/coin"
import validateRequest from "../middleware/validateRequest"
import Joi from "joi"

const listCoinsSchema = (
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
const listCoinsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {
        page,
        limit,
    } = req.body
    listCoins(page, limit).then((result) => {
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
    listCoinsSchema,
    listCoinsController,
}