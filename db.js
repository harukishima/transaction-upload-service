const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPassword,
  {
    host: config.dbHost,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database: ' + err);
  });

module.exports = sequelize;
