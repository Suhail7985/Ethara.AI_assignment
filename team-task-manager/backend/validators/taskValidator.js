const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().min(2).max(300).required(),
  description: Joi.string().max(5000).allow('').optional(),
  project: Joi.string().length(24).required(),
  assignedTo: Joi.string().length(24).optional().allow(null, ''),
  status: Joi.string().valid('todo', 'in-progress', 'review', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().iso().optional().allow(null),
  tags: Joi.array().items(Joi.string()).optional(),
  order: Joi.number().optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(2).max(300).optional(),
  description: Joi.string().max(5000).allow('').optional(),
  assignedTo: Joi.string().length(24).optional().allow(null, ''),
  status: Joi.string().valid('todo', 'in-progress', 'review', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().iso().optional().allow(null),
  tags: Joi.array().items(Joi.string()).optional(),
  order: Joi.number().optional(),
});

const addCommentSchema = Joi.object({
  text: Joi.string().min(1).max(2000).required(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }
  next();
};

module.exports = { createTaskSchema, updateTaskSchema, addCommentSchema, validate };
