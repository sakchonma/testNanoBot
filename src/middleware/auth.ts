import { expressjwt } from "express-jwt"
import { Request, Response, NextFunction } from "express"
// import ProfileModel from "../models/profile"

export default () => {
    const secret = process.env.TOKEN_SECRET || ""
    return [
        expressjwt({
            secret,
            algorithms: ["HS256"]
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const user = (req as any).user?.user
            if (user) {
                if (user) {
                    // const profile = await ProfileModel.findOne({ user: user })
                    // if (!profile) {
                    //     return res
                    //         .status(401)
                    //         .json({
                    //             message: 'Unauthorized'
                    //         })
                    // }
                    next()
                } else {
                    return res.status(401).json({ message: "Unauthorized" })
                }
            } else {
                return res.status(401).json({ message: "Unauthorized" })
            }
        }
    ]
}
