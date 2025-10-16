const { DataSource } = require('typeorm');
const Contact = require('./models/contactModel');
const User = require('./models/userModel');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'mycontacts-backend',
  synchronize: true,
  logging: process.env.DB_LOGGING === 'true',
  entities: [Contact, User],
});

module.exports = AppDataSource;
