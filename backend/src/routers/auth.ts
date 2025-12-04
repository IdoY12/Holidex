import { Router } from "express";
import { login, signup } from "../controllers/auth/controller";
import validation from "../middlewares/validation";
import { loginValidator, signupValidator } from "../controllers/auth/validator";

const authRouter = Router()

authRouter.post('/signup', validation(signupValidator), signup)
authRouter.post('/login', validation(loginValidator), login)

export default authRouter