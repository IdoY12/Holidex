import validation from "../middlewares/validation";
import { getUserLikes, likeVacation, unlikeVacation } from "../controllers/likes/controller";
import { Router } from "express";
import { likeValidator } from "../controllers/likes/validator";

const likesRouter = Router()

likesRouter.get('/', getUserLikes)
likesRouter.post('/:vacationId', validation(likeValidator, 'params'), likeVacation)
likesRouter.delete('/:vacationId', validation(likeValidator, 'params'), unlikeVacation)

export default likesRouter