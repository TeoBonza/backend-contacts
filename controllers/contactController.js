const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');
const AppDataSource = require('../dataSource');

//@desc Get all contacts
//@route GET /api/contacts
//@access Private
const getContacts = asyncHandler(async (req, res) => {
  const contactRepository = AppDataSource.getRepository(Contact);
  const contacts = await contactRepository.find({
    where: { userId: req.user.id },
  });
  res.status(200).json(contacts);
});

//@desc Create New contacts
//@route POST /api/contacts
//@access Private
const createContacts = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  if(!name || !email || !phone) {
    return res.status(400).send({ message: 'Fields are mandatory' });
  };

  const contactRepository = AppDataSource.getRepository(Contact);
  const newContact = contactRepository.create({
    name,
    email,
    phone,
    userId: req.user.id,
  });

  const contact = await contactRepository.save(newContact);
  res.status(201).json(contact);
});

//@desc Get contact by ID
//@route GET /api/contacts/:id
//@access Private
const getContact = asyncHandler(async (req, res) => {
  const contactRepository = AppDataSource.getRepository(Contact);
  const contact = await contactRepository.findOneBy({
    id: parseInt(req.params.id),
  });

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  };

  res.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access Private
const updateContact = asyncHandler(async (req, res) => {
  const contactRepository = AppDataSource.getRepository(Contact);
  const contact = await contactRepository.findOneBy({
    id: parseInt(req.params.id),
  });

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  };

  if (contact.userId !== req.user.id) {
    res.status(403);
    throw new Error('User does not have permission to update other user contacts');
  };

  contactRepository.merge(contact, req.body);
  const updatedContact = await contactRepository.save(contact);

  res.status(200).json(updatedContact);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access Private
const deleteContact = asyncHandler(async (req, res) => {
  const contactRepository = AppDataSource.getRepository(Contact);
  const contact = await contactRepository.findOneBy({
    id: parseInt(req.params.id),
  });

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  };

  if (contact.userId !== req.user.id) {
    res.status(403);
    throw new Error('User does not have permission to delete other user contacts');
  };

  await contactRepository.remove(contact);
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContacts,
  getContact,
  updateContact,
  deleteContact,
};
