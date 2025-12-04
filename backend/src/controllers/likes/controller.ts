import { NextFunction, Request, Response } from "express";
import Like from "../../models/Like";
import Vacation from "../../models/Vacation";
import { emitLikes } from "../../sockets/ioClient";

interface AuthRequest extends Request {
    userId: string;
    headers: Request['headers'] & {
        'x-client-id'?: string
    };
    params: {
        vacationId: string;
    };
}

export async function getUserLikes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId
        const likes = await Like.findAll({
            where: { userId },
            // 'attributes' tells Sequelize to select ONLY these columns.
            // Instead of returning the full Like record, return only vacationId.
            attributes: ['vacationId']
        })
        // Extract the vacationId value from each object to a simple array of strings.
        res.json(likes.map(l => l.vacationId))
    } catch (e) {
        next(e)
    }
}

export async function likeVacation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { vacationId } = req.params
        const userId = req.userId
        const clientId = req.headers["x-client-id"];

        const vacation = await Vacation.findByPk(vacationId)
        if (!vacation) throw new Error("Vacation not found")
        const exists = await Like.findOne({ where: { userId, vacationId } })
        if (exists) return res.json({ message: "Already liked" })
        await Like.create({ userId, vacationId })
        emitLikes(vacationId, 1, clientId, userId)
        res.json({ message: "Liked" })
    } catch (e) {
        next(e)
    }
}

export async function unlikeVacation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { vacationId } = req.params
        const userId = req.userId
        const clientId = req.headers["x-client-id"];

        const unliked = await Like.destroy({ where: { userId, vacationId } })
        if (!unliked) return next({ message: 'like is already removed' })
        emitLikes(vacationId, -1, clientId, userId)
        res.json({ message: "Unliked" })
    } catch (e) {
        next(e)
    }
}