const express = require('express');
const errorhandler = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const setupSwagger = require('./swagger');
const options = require('./swagger');
const dotenv = require('dotenv').config();

connectDb();
const app = express();

const port = process.env.PORT || 5001;

app.use(express.json());
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use(errorhandler);

// setup swagger
setupSwagger(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});