require('dotenv').config();
const CONFIG = {};

CONFIG.ENV = process.env.ENV || 'development';
CONFIG.PORT = process.env.PORT || 3000;
CONFIG.JWT_SECRET = process.env.JWT_SECRET;
CONFIG.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
CONFIG.DB_URL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

console.log('CONFIG:', CONFIG);

module.exports = CONFIG;
