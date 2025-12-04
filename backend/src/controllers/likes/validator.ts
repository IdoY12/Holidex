import Joi from "joi";

export const likeValidator = Joi.object({
    vacationId: Joi.string().uuid()
})

export const unlikeValidatorValidator = likeValidator