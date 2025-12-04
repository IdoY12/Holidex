import Joi from "joi";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const newVacationValidator = Joi.object({
    destination: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(1000).required(),
    startDate: Joi.date().min(today).required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    price: Joi.number().min(0).max(10000).required(),
});


export const updateVacationValidator = newVacationValidator

export const updateVacationImageValidator = Joi.object({
    image: Joi.object({
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/webp')
    }).optional().unknown(true)
})

export const newVacationImageValidator = Joi.object({      // <-- i expected to get obj called 'image' and hes an obj
    image: Joi.object({
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/webp')
    }).unknown(true).required()
})