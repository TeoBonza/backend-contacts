const express = require('express');
const router = express.Router();
const {
  getContacts,
  getContact,
  createContacts,
  updateContact,
  deleteContact
} = require('../controllers/contactController');
const { validateToken } = require('../middleware/validareTokenHandler');

router.use(validateToken);
router.route('/').get(getContacts);
router.route('/').post(createContacts);
router.route('/:id').get(getContact);
router.route('/:id').put(updateContact);
router.route('/:id').delete(deleteContact);

module.exports = router;
