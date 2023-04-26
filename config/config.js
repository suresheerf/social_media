require('dotenv').config();
const CONFIG = {};

CONFIG.NODE_ENV = process.env.NODE_ENV || 'development';
CONFIG.PORT = process.env.PORT || 3000;
CONFIG.JWT_SECRET = process.env.JWT_SECRET;
CONFIG.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

CONFIG.DB_URL = process.env.DB_URL;

console.log('CONFIG:', CONFIG);

module.exports = CONFIG;
