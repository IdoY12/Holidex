import { NextFunction, Request, Response } from "express";
import Vacation from "../../models/Vacation";
import Like from "../../models/Like";
import sequelize from "../../db/sequelize";
import config from "config";
import { buildImageUrl } from "../../utils/buildImageUrl";

const bucket = config.get<string>('s3.bucket');


export async function getVacations(req: Request, res: Response, next: NextFunction) {
    try {
        const vacations = await Vacation.findAll({
            attributes: [
                'id',
                'destination',
                'description',
                'startDate',
                'endDate',
                'price',
                'imageUrl',
                [sequelize.fn('COUNT', sequelize.col('likes.user_id')), 'likesCount']
            ],
            include: [{ model: Like, attributes: [] }],
            group: ['Vacation.id']
        })

        res.json(vacations.map(v => {
            const { likesCount, imageUrl, ...rest } = v.toJSON()
            return {
                ...rest,
                imageUrl: buildImageUrl(imageUrl),
                likes: Number(likesCount)
            }
        }))
    } catch (e) {
        next(e)
    }
}


export async function createVacation(req: Request, res: Response, next: NextFunction) {
    try {
        const createdVacation = await Vacation.create({ ...req.body, imageUrl: req.imageUrl })
        res.json(createdVacation)
    } catch (e) {
        next(e);
    }
}

export async function updateVacation(req: Request, res: Response, next: NextFunction) {
    try {
        const vacation = await Vacation.findByPk(req.params.id)
        if (!vacation) return next({ status: 404, message: "vacation not found" })

            const imageUrl = req.imageUrl ?? vacation.imageUrl

            const updatedVacation = await vacation.update({ ...req.body, imageUrl: imageUrl })
                        
        res.json({
            ...updatedVacation.toJSON(),
            imageUrl: buildImageUrl(imageUrl)
        })
    } catch (e) {
        next(e)
    }
}



export async function deleteVacation(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const deletedVacation = await Vacation.destroy({ where: { id: req.params.id } })
        if (!deletedVacation) return next({ status: 404, message: "vacation not found" })
        res.json(deletedVacation)
    } catch (e) {
        next(e)
    }
}
