const Joi = require('joi');
const { assign } = require('lodash');

const authBody = {
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required()
};

const userBody = {
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(20).required()
}

const auth = assign({}, { body: authBody });
const create = assign({}, { body: userBody });

module.exports = {
  auth,
  create
};