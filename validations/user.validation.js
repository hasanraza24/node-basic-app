const Joi = require('joi');
const { assign } = require('lodash');

const authBody = {
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().required()
};

const userBody = {
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().required()
}

const emailBody = {
  email: Joi.string().trim().email().required()
}


const frgPwd = assign({}, { body: emailBody })
const auth = assign({}, { body: authBody });
const create = assign({}, { body: userBody });

module.exports = {
  auth,
  create,
  frgPwd
};