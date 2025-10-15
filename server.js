const express = require('express');
const errorhandler = require('./middleware/errorHandler');
const setupSwagger = require('./swagger');
const rateLimiter = require('./middleware/rate-limiter');
const AppDataSource = require("./dataSource");

const app = express();

const port = process.env.PORT || 5002;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized");

    // Applying rate limits
    app.use('/api/users/login', rateLimiter({ windowInSeconds: 60, maxRequests: 5 }));
    app.use('/api/users/register', rateLimiter({ windowInSeconds: 60, maxRequests: 5 }));
    app.use(rateLimiter({ windowInSeconds: 60, maxRequests: 10 }));

    app.use('/api/contacts', require('./routes/contactRoutes'));
    app.use('/api/users', require('./routes/userRoutes'));
    app.use(errorhandler);

    // setup swagger
    setupSwagger(app);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization", error);
  });
