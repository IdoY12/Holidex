import { getLikes, getLikesCSV } from "../controllers/reports/controller";
import { Router } from "express";

const reportsRouter  = Router()


reportsRouter.get('/', getLikes)
reportsRouter.get('/csv', getLikesCSV)

export default reportsRouter