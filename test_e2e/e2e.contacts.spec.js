const request = require('supertest');

describe('Contacts E2E Tests', () => {
  let accessToken;
  let contact;
  let contactId;
  
  const testUser = {
    username: 'TestUser2',
    email: `user2-${Date.now()}@test.com`,
    password: 'secret12345',
  };

  const testContact = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-202-555-0152',
  };

  beforeAll(async () => {
    await request('http://localhost:5002')
      .post('/api/users/register')
      .send(testUser);

    const res = await request('http://localhost:5002')
      .post('/api/users/login')
      .send({ email: testUser.email, password: testUser.password });

    accessToken = res.body.accessToken;

    contact = await request('http://localhost:5002')
      .post('/api/contacts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(testContact);

    contactId = contact.body.id;
  });

  it('should throw error if trying to create contact without all fields', async () => {
    const res = await request('http://localhost:5002')
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
    const res = await request('http://localhost:5002')
      .post('/api/contacts')
      .send(testContact);

    expect(res.status).toBe(401);
  });

  it('should get all contacts for authenticated user', async () => {
    const res = await request('http://localhost:5002')
      .get('/api/contacts')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should throw error if no token is provided', async () => {
    const res = await request('http://localhost:5002')
      .get('/api/contacts');

    expect(res.status).toBe(401);
  });

  it('should return empty array if user has no contacts', async () => {
    const newUser = {
      username: 'User',
      email: `userNew-${Date.now()}@email.com`,
      password: 'secretWord',
    };

    await request('http://localhost:5002')
      .post('/api/users/register')
      .send(newUser);

    const loginRes = await request('http://localhost:5002')
      .post('/api/users/login')
      .send({
        email: newUser.email,
        password: newUser.password,
      });

    const res = await request('http://localhost:5002')
      .get('/api/contacts')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should get a contact by ID', async () => {
    const res = await request('http://localhost:5002')
      .get(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', contactId);
    expect(res.body).toHaveProperty('name', testContact.name);
    expect(res.body).toHaveProperty('email', testContact.email);
    expect(res.body).toHaveProperty('phone', testContact.phone);
  });

  it('should throw error if contact not exist', async () => {
    const res = await request('http://localhost:5002')
      .get('/api/contacts/100')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });

  it('should update a contact successfully', async () => {
    const updatedData = {
      name: 'New John Doe',
    };

    const res = await request('http://localhost:5002')
      .put(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', contactId);
    expect(res.body).toHaveProperty('name', updatedData.name);
  });

  it('should delete a contact successfully', async () => {
    const res = await request('http://localhost:5002')
      .delete(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
  });

  it('should verify contact is deleted', async () => {
    const res = await request('http://localhost:5002')
      .get(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });

  it('should throw error if trying to delete contact that does not exist', async () => {
    const res = await request('http://localhost:5002')
      .delete('/api/contacts/20')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });
});
