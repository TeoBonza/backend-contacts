const { DataSource } = require('typeorm');
const Contact = require('./models/contactModel');
const User = require('./models/userModel');

const AppDataSource = new DataSource({
  type: 'mongodb',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 27017,
  database: process.env.DB_NAME || 'mycontacts-backend',
  synchronize: true,
  useUnifiedTopology: true,
  entities: [Contact, User],
  logging: false,
});

module.exports = AppDataSource;
