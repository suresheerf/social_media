import { config } from 'dotenv';

config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const { JWT_SECRET } = process.env;
export const { JWT_EXPIRES_IN } = process.env;
export const DB_URL = process.env.DB_URL || '';
