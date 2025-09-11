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

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact management
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: List of contacts
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact created
 *
 * /api/contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single contact
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact updated
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted
 */

router.route('/').get(getContacts);
router.route('/').post(createContacts);
router.route('/:id').get(getContact);
router.route('/:id').put(updateContact);
router.route('/:id').delete(deleteContact);

module.exports = router;
