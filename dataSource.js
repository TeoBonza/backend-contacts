import { DATABASE_CONNECTION_OPTIONS } from '.env';
const { DataSource } = require('typeorm');
const Contact = require('./models/contactModel');
const User = require('./models/userModel');

const connectionOptions = JSON.parse(DATABASE_CONNECTION_OPTIONS);
const AppDataSource = new DataSource({
  ...connectionOptions,
  entities: [Contact, User],
});

module.exports = AppDataSource;
