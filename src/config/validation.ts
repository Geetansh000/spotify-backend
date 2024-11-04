import * as Joi from 'joi';
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'testing', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().port().default(8000),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.number().default(90),
  DB_CONNECTION: Joi.string().equal('mysql').required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().optional(),
  DB_LOGGING: Joi.string().optional(),
});
