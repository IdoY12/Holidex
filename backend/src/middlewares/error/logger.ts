import { NextFunction, Request, Response } from "express";

export default function logger(err: unknown, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    next(err);
}