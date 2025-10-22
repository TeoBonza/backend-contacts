const request = require('supertest');

describe('Users E2E Tests', () => {
  let accessToken;

  const appUrl = 'http://localhost:5002';
  
  const testUser = {
    username: 'TestUser',
    email: `user-${Date.now()}@test.com`,
    password: 'secret1234',
  };

  it('should register a new user successfully', async () => {
    const res = await request(appUrl)
      .post('/api/users/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', testUser.email);
    expect(res.body).not.toHaveProperty('password');
  });

  it('should login successfully the user and return access token', async () => {
    const res = await request(appUrl)
      .post('/api/users/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(typeof res.body.accessToken).toBe('string');
    accessToken = res.body.accessToken;
  });

  it('should get current user info with valid token', async () => {
    const res = await request(appUrl)
      .get('/api/users/current')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', testUser.email);
    expect(res.body).toHaveProperty('username', testUser.username);
  });

  it('should throw error if authentication token is not provided', async () => {
    const res = await request(appUrl)
      .get('/api/users/current');

    expect(res.status).toBe(401);
  });
});
