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
      .send({ username: 'testuser', password: 'password123' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('testuser');
  });

  it('should return all users', async () => {
    const res = await request(app).get('/api/users');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('should return a user by ID', async () => {
    const user = await User.create({ username: 'testuser2', password: 'password123' });
    const res = await request(app).get(`/api/users/${user._id}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('testuser2');
  });

  it('should update a user', async () => {
    const user = await User.create({ username: 'testuser3', password: 'password123' });
    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ username: 'updateduser' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('updateduser');
  });

  it('should delete a user', async () => {
    const user = await User.create({ username: 'testuser4', password: 'password123' });
    const res = await request(app).delete(`/api/users/${user._id}`);
    
    expect(res.statusCode).toEqual(204);
  });
});

import { render, screen } from '@testing-library/react';
import App from '../src/App'; // Adjust the path as necessary

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});