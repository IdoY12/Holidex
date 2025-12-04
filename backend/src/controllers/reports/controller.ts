import { NextFunction, Request, Response } from "express";
import Like from "../../models/Like";
import Vacation from "../../models/Vacation";
import sequelize from "../../db/sequelize";

export async function getLikes(req: Request, res: Response, next: NextFunction) {
    try {
        const vacations = await Vacation.findAll({
            attributes: [
                'id',
                'destination',
                [sequelize.fn('COUNT', sequelize.col('likes.vacation_id')), 'likesCount']
            ],
            include: [{
                model: Like,
                as: 'likes',
                attributes: [],
                required: false
            }],
            group: ['Vacation.id'],
            raw: true
        });

        res.json(vacations.map((v: any) => ({
            id: v.id,
            destination: v.destination,
            likes: parseInt(v.likesCount) || 0
        })));
    } catch (e) {
        next(e)
    }
}


export async function getLikesCSV(req: Request, res: Response, next: NextFunction) {
    try {
        const vacations = await Vacation.findAll({ include: [Like] })
        
        const csv = [
            "Destination,Likes",
            ...vacations.map(({ destination, likes }) => `${destination},${likes.length}`)
        ].join("\n")

        res.setHeader("Content-Type", "text/csv")
        res.attachment("vacations-likes.csv")
        res.send(csv)
    } catch (e) {
        next(e)
    }
}