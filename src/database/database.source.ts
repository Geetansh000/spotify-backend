import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config({ path: resolve(__dirname, '../../.env') });

// const config = dotenv.parse(readFileSync(resolve(__dirname, '../../.env')));

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',

  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [process.env.DB_ENTITIES],
  migrations: [process.env.DB_MIGRATIONS],
  synchronize: false,
  logging: ['error'],
  logger: 'simple-console',
};
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
