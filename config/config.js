const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(8081),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  MONGO_URL: Joi.string().required()
    .description('Mongo DB url'),
  BASE_URL: Joi.string().required()
    .description('Base Url is required')
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  mongoUrl: envVars.MONGO_URL,
  baseUrl: envVars.BASE_URL
};

module.exports = config;
