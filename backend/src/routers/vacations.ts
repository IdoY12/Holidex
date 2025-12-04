import { Router } from "express";
import { createVacation, deleteVacation, getVacations, updateVacation } from "../controllers/vacations/controller";
import enforceAdmin from "../middlewares/enforce-admin";
import validation from "../middlewares/validation";
import { newVacationImageValidator, newVacationValidator, updateVacationImageValidator, updateVacationValidator } from "../controllers/vacations/validator";
import fileValidation from "../middlewares/file-validation";
import fileUploader from "../middlewares/file-uploader";

const vacationsRouter = Router()

vacationsRouter.get('/', getVacations)
vacationsRouter.post('/', 
    enforceAdmin,
    fileValidation(newVacationImageValidator),
    validation(newVacationValidator), 
    fileUploader,
    createVacation
)
vacationsRouter.put('/:id', 
    enforceAdmin, 
    fileValidation(updateVacationImageValidator),
    validation(updateVacationValidator), 
    fileUploader,
    updateVacation
)
vacationsRouter.delete('/:id', enforceAdmin, deleteVacation)

export default vacationsRouter