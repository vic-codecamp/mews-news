const Joi = require("@hapi/joi");

module.exports = Joi.object({
  userId: Joi.string().required(),
  url: Joi.string().required(),
  title: Joi.string().required(),
  action: Joi.number().required(),
  when: Joi.number().required(),
  test: Joi.boolean()
});
