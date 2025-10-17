const request = require('supertest');
const { expect, describe, afterAll, beforeAll, it } = require('@jest/globals');
const { DataSource } = require('typeorm');
const express = require('express');
const errorhandler = require('../middleware/errorHandler');
const Contact = require('./testContactModel');
const User = require('./testUserModel');
require('dotenv').config();

let testDataSource;

const initializeTestDatabase = async () => {
  testDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: [Contact, User],
    synchronize: true,
    logging: false,
  });

  if (!testDataSource.isInitialized) {
    await testDataSource.initialize();
  }

  return testDataSource;
};

const createApp = () => {
  const app = express();
  app.use(express.json());
  return app;
};

describe('Application E2E Tests', () => {
  let app;
  let accessToken;
  let userId;
  let contactId;
  
  const testUser = {
    username: 'TestUser',
    email: `user-${Date.now()}@test.com`,
    password: 'secret1234',
  };

  const testContact = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-202-555-0152',
  };

  beforeAll(async () => {
    try {
      await initializeTestDatabase();

      const AppDataSource = require('../dataSource');
      AppDataSource.getRepository = testDataSource.getRepository.bind(testDataSource);
      AppDataSource.initialize = async () => testDataSource;
      AppDataSource.isInitialized = true;

      app = createApp();
      app.use(express.json());
      app.use('/api/contacts', require('../routes/contactRoutes'));
      app.use('/api/users', require('../routes/userRoutes'));
      app.use(errorhandler);
    } catch (error) {
      console.error('Error during test setup:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      if (testDataSource && testDataSource.isInitialized) {
        await testDataSource.destroy();
      }
    } catch (error) {
      console.error('Error closing database:', error);
    }
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', testUser.email);
      expect(res.body).not.toHaveProperty('password');
      userId = res.body.id;
    });
  });

  describe('POST /api/users/login', () => {
    it('should login successfully the user and return access token', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(typeof res.body.accessToken).toBe('string');
      accessToken = res.body.accessToken;
    });
  });

  describe('GET /api/users/current', () => {
    it('should get current user info with valid token', async () => {
      const res = await request(app)
        .get('/api/users/current')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', testUser.email);
      expect(res.body).toHaveProperty('username', testUser.username);
    });

    it('should throw error if authentication token is not provided', async () => {
      const res = await request(app)
        .get('/api/users/current');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/contacts', () => {
    it('should create a new contact successfully', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testContact);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', testContact.name);
      expect(res.body).toHaveProperty('email', testContact.email);
      expect(res.body).toHaveProperty('phone', testContact.phone);
      expect(res.body).toHaveProperty('userId', userId);
      contactId = res.body.id;
    });

    it('should throw error if trying to create contact without all fields', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBeDefined();
      expect(res.body.message).toContain('Fields are mandatory');
    });

    it('should throw error when creating contact without authentication', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send(testContact);

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/contacts', () => {
    it('should get all contacts for authenticated user', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should throw error if no token is provided', async () => {
      const res = await request(app)
        .get('/api/contacts');

      expect(res.status).toBe(401);
    });

    it('should return empty array if user has no contacts', async () => {
      const newUser = {
        username: 'User',
        email: `userNew-${Date.now()}@email.com`,
        password: 'secretWord',
      };

      await request(app)
        .post('/api/users/register')
        .send(newUser);

      const loginRes = await request(app)
        .post('/api/users/login')
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /api/contacts/:id', () => {
    it('should get a contact by ID', async () => {
      const res = await request(app)
        .get(`/api/contacts/${contactId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', contactId);
      expect(res.body).toHaveProperty('name', testContact.name);
      expect(res.body).toHaveProperty('email', testContact.email);
      expect(res.body).toHaveProperty('phone', testContact.phone);
    });

    it('should throw error if contact not exist', async () => {
      const res = await request(app)
        .get('/api/contacts/100')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/contacts/:id', () => {
    it('should update a contact successfully', async () => {
      const updatedData = {
        name: 'New John Doe',
      };

      const res = await request(app)
        .put(`/api/contacts/${contactId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', contactId);
      expect(res.body).toHaveProperty('name', updatedData.name);
    });

    it('should prevent user from updating other user contacts', async () => {
      const notOwnerUser = {
        username: 'guestUser',
        email: `guestuser-${Date.now()}@test.com`,
        password: '$1234',
      };

      await request(app)
        .post('/api/users/register')
        .send(notOwnerUser);

      const loginRes = await request(app)
        .post('/api/users/login')
        .send({
          email: notOwnerUser.email,
          password: notOwnerUser.password,
        });

      const res = await request(app)
        .put(`/api/contacts/${contactId}`)
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
        .send({ name: 'Hacker' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/contacts/:id', () => {
    it('should delete a contact successfully', async () => {
      const res = await request(app)
        .delete(`/api/contacts/${contactId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
    });

    it('should verify contact is deleted', async () => {
      const res = await request(app)
        .get(`/api/contacts/${contactId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });

    it('should throw error if trying to delete contact that does not exist', async () => {
      const res = await request(app)
        .delete('/api/contacts/20')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });
});
