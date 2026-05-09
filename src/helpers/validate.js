const Joi = require('joi');

exports.borrowSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Tên không được để trống',
      'any.required': 'Thiếu tên'
    }),

  amount: Joi.number()
    .positive() // hợp lý hơn min(0)
    .required()
    .messages({
      'number.base': 'Số tiền phải là số',
      'number.positive': 'Số tiền phải lớn hơn 0',
      'any.required': 'Thiếu số tiền'
    }),

  note: Joi.string()
    .allow('')
    .optional()
    .max(255)
});