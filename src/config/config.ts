import { config } from 'dotenv';
import fs from 'fs';

config();

const paths = ['public/file', 'logs', 'public/file/test-cases', 'public/file/assertions'];
const pwd = process.env.PWD || process.cwd();
paths.forEach((path) => {
  if (!fs.existsSync(`${pwd}/${path}`)) {
    fs.mkdirSync(`${pwd}/${path}`, { recursive: true });
  }
});

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const { JWT_SECRET } = process.env;
export const { JWT_EXPIRES_IN } = process.env;
export const DB_URL = process.env.DB_URL || '';
