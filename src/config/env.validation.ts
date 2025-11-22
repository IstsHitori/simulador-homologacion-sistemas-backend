import * as joi from 'joi';

export const ENV_VALIDATION_SCHEMA = joi.object({
  PORT: joi.number().default(3000),
  //DB_ENV
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().default(5432),
  DB_USERNAME: joi.string().required(),
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
