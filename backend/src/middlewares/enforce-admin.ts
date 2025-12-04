import { NextFunction, Request, Response } from "express"
import User from "../models/User"

export default async function enforceAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await User.findByPk(req.userId)

        if (!user) {
            return next({
                status: 401,
                message: 'user not found'
            })
        }

        if (user.role !== 'admin') {
            return next({
                status: 403,
                message: 'admin privileges required'
            })
        }

        next()
    } catch (e) {
        next(e)
    }
}