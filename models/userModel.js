const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         username: johndoe
 *         email: john@example.com
 *         password: secret123
 */

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add the user name"]
  },
  email: {
    type: String,
    required: [true, "Please add the user email address"],
    unique: [true, "Email address already taken"]
  },
  password: {
    type: String,
    required: [true, "Please add the user password"]
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;