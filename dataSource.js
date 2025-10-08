const { DataSource } = require('typeorm');
const Contact = require('./models/contactModel');
const User = require('./models/userModel');

const config = JSON.parse(process.env.DATABASE_CONNECTION_OPTIONS);

const AppDataSource = new DataSource({
  ...config,
  authSource: 'admin',
  synchronize: true,
  useUnifiedTopology: true,
  entities: [Contact, User],
});

module.exports = AppDataSource;
