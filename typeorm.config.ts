import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Place } from './src/entities/place.entity';

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'kamino_places',
  entities: [Place],
  migrations: ['src/migrations/*.ts'],
  ssl: isProd ? { rejectUnauthorized: false } : false,
});