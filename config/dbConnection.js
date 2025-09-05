const mongoose = require('mongoose')

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(
      process.env.CONNECTION_STRING,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    console.log("Database connected", connect.connection.host);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

module.exports = connectDb;