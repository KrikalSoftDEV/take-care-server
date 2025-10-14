import Joi from 'joi';

export const addDependentUser = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  age: Joi.number().min(0).max(120).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  DOB: Joi.date().optional(),
  medicalCondition: Joi.string().optional(),
  hospitalised: Joi.boolean().optional(),
  relationship: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    country: Joi.string().optional()
  }).required()
});

export const updateDependentUser = Joi.object({
  dependentId: Joi.string().required(),
  firstName: Joi.string().min(3).max(30).optional(),
  lastName: Joi.string().min(3).max(30).optional(),
  age: Joi.number().min(0).max(120).optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  email: Joi.string().email().optional(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  DOB: Joi.date().optional(),
  medicalCondition: Joi.string().optional(),
  hospitalised: Joi.boolean().optional(),
  relationship: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    country: Joi.string().optional()
  }).optional()
});

export const deleteDependentUser = Joi.object({
  dependentId: Joi.string().required()
});