import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

export default function validation(validator: ObjectSchema, source = 'body') {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            await validator.validateAsync(req[source])
            next()
        } catch(e) {
            next({
                status: 422,
                message: e.message
            })
        }
    }
}