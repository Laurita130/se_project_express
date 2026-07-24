const { celebrate, Joi, Segments } = require("celebrate");

const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().pattern(urlRegex).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateProfile = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().pattern(urlRegex).required(),
  }),
});

const validateClothingItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    imageUrl: Joi.string().pattern(urlRegex).required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

const validateItemId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateProfile,
  validateClothingItem,
  validateItemId,
};