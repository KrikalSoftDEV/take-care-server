import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string(),
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  role: Joi.string().valid('provider', 'admin', 'dependent').required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
});

export const generateOtpForVerifyMobileSchema = Joi.object({
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
});


export const loginSchema = Joi.object({
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  otp: Joi.string().length(6).pattern(/^[0-9]{6}$/).required(),
});

export const findProviderProfile=Joi.object({
  providerId:Joi.string().optional(),
  mobile:Joi.string().pattern(/^[0-9]{10}$/).optional()
})

export const updateProviderProfile=Joi.object({
  providerId:Joi.string().required(),
  firstName:Joi.string().min(3).max(30).optional(),
  lastName:Joi.string().min(3).max(30).optional(),
  email:Joi.string().email().optional(),
  mobile:Joi.string().pattern(/^[0-9]{10}$/).optional()
})

