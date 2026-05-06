const Joi = require('joi');

const authValidation = {
  signup: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    }),
    name: Joi.string().min(2).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required'
    })
  }),
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  })
};

const projectValidation = {
  create: Joi.object({
    name: Joi.string().min(2).required().messages({
      'string.min': 'Project name must be at least 2 characters',
      'any.required': 'Project name is required'
    }),
    description: Joi.string().allow('').optional()
  }),
  update: Joi.object({
    name: Joi.string().min(2).optional(),
    description: Joi.string().optional()
  })
};

const taskValidation = {
  create: Joi.object({
    title: Joi.string().min(3).required().messages({
      'string.min': 'Task title must be at least 3 characters',
      'any.required': 'Task title is required'
    }),
    description: Joi.string().optional(),
    status: Joi.string().valid('TODO', 'IN_PROGRESS', 'DONE').default('TODO'),
    assignedToId: Joi.number().optional().allow(null),
    dueDate: Joi.date().optional().allow('', null)
  }),
  update: Joi.object({
    title: Joi.string().min(3).optional(),
    description: Joi.string().optional(),
    status: Joi.string().valid('TODO', 'IN_PROGRESS', 'DONE').optional(),
    assignedToId: Joi.number().optional().allow(null),
    dueDate: Joi.date().optional().allow('', null)
  })
};

const memberValidation = {
  add: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Valid email is required',
      'any.required': 'Email is required'
    }),
    role: Joi.string().valid('ADMIN', 'MEMBER').default('MEMBER')
  }),
  updateRole: Joi.object({
    role: Joi.string().valid('ADMIN', 'MEMBER').required().messages({
      'any.required': 'Role is required'
    })
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    console.log('📥 Validating request body:', req.body);
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      console.error('❌ Validation error:', error.details);
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({ message: 'Validation error', details });
    }

    console.log('✅ Validation passed');
    req.body = value;
    next();
  };
};

module.exports = {
  authValidation,
  projectValidation,
  taskValidation,
  memberValidation,
  validate
};
