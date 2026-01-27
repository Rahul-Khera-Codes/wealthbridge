import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/User'; // Adjust the path as necessary

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User API', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'john@example.com' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.name).toBe('John Doe');
  });

  it('should return 400 for invalid user data', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: '', email: 'invalid-email' });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should fetch all users', async () => {
    const res = await request(app).get('/api/users');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a user by ID', async () => {
    const user = await User.create({ name: 'Jane Doe', email: 'jane@example.com' });
    const res = await request(app).get(`/api/users/${user._id}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.name).toBe('Jane Doe');
  });

  it('should return 404 for non-existing user', async () => {
    const res = await request(app).get('/api/users/123456789012345678901234');
    
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });
});