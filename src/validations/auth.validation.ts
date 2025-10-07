import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string(),
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  role: Joi.string().valid('user', 'admin', 'care_provider').required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
});

