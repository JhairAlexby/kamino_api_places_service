import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Place } from './src/entities/place.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'kamino_places',
  entities: [Place],
  migrations: ['src/database/migrations/*.ts'], // This will be the directory for migrations
  synchronize: false, // Never synchronize in production, use migrations instead
  logging: true,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default AppDataSource;
