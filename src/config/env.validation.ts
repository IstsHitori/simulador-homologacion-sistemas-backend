import * as joi from 'joi';

export const ENV_VALIDATION_SCHEMA = joi.object({
  NODE_ENV: joi
    .string()
    .valid('development', 'production')
    .default('development'),
  PORT: joi.number().default(3000),
  //DB_ENV - DEVELOPMENT
  DEV_DB_PASSWORD: joi.string().required(),
  DEV_DB_NAME: joi.string().required(),
  DEV_DB_HOST: joi.string().required(),
  DEV_DB_PORT: joi.number().default(5432),
  DEV_DB_USERNAME: joi.string().required(),
  //DB_ENV - PRODUCTION
  PROD_DB_PASSWORD: joi.string().required(),
  PROD_DB_NAME: joi.string().required(),
  PROD_DB_HOST: joi.string().required(),
  PROD_DB_PORT: joi.number().default(5432),
  PROD_DB_USERNAME: joi.string().required(),
  //ADMIN_ENV
  ADMIN_NAME: joi.string().min(3).max(50).default('ADMIN'),
  ADMIN_USERNAME: joi.string().required().min(4).max(10),
  ADMIN_PASSWORD: joi
    .string()
    .required()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*d)(?=.*[@#$%^&+=!]).{6,}$'))
    .min(6)
    .max(20),
  ADMIN_EMAIL: joi.string().email().required().max(100),
  //JWT
  JWT_SECRET: joi.string().required(),
});
