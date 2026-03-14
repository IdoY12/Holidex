import { NextFunction, Request, Response } from "express";

type HttpError = {
    status?: number;
    message?: string;
};

export default function responder(err: unknown, req: Request, res: Response, next: NextFunction) {
    const httpError = err as HttpError;
    res.status(httpError.status ?? 500).send(httpError.message ?? "internal server error...");
}