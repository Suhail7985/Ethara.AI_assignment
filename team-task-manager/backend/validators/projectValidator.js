const Joi = require('joi');

const createProjectSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(2000).allow('').optional(),
  status: Joi.string().valid('active', 'on-hold', 'completed', 'cancelled').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  deadline: Joi.date().iso().optional().allow(null),
  members: Joi.array().items(Joi.string().length(24)).optional(),
  color: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(2000).allow('').optional(),
  status: Joi.string().valid('active', 'on-hold', 'completed', 'cancelled').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  deadline: Joi.date().iso().optional().allow(null),
  members: Joi.array().items(Joi.string().length(24)).optional(),
  color: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  next();
};

module.exports = { createProjectSchema, updateProjectSchema, validate };
