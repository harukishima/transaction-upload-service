require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8000,
  dbHost: process.env.DB_HOST || 'localhost',
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB || 'postgres',
};
