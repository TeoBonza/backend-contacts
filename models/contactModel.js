const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: Contact name
 *         email:
 *           type: string
 *           description: Contact email address
 *         phone:
 *           type: string
 *           description: Contact phone number
 *       example:
 *         name: John Doe
 *         email: john@example.com
 *         phone: "+1-202-555-0152"
 */

const contactSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Please add the contact name"]
  },
  email: {
    type: String,
    required: [true, "Please add the contact email address"]
  },
  phone: {
    type: String,
    required: [true, "Please add the contact phone number"]
  }
}, {
  timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;