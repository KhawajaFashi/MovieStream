import Joi from 'joi';
import AppError from '../utils/AppError.js';

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const message = error.details.map(details => details.message).join(', ');
            return next(new AppError(message, 400));
        }
        next();
    };
};

export const signupSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const signinSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export default validate;
