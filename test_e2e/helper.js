const request = require('supertest');
const { constants } = require('../constants');

async function getAccessToken(userData) {
  const appUrl = constants.appUrl;

  await request(appUrl)
    .post('/api/users/register')
    .send(userData);

  const loginRes = await request(appUrl)
    .post('/api/users/login')
    .send({ email: userData.email, password: userData.password });

  return loginRes.body.accessToken;
}

module.exports = {
  getAccessToken,
};