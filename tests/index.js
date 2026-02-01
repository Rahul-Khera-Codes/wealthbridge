import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary
import mongoose from 'mongoose';

describe('API Tests', () => {
  beforeAll(async () => {
    const uri = 'mongodb://localhost:27017/testdb'; // Use your test database URI
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 200 for GET /api/items', async () => {
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new item with POST /api/items', async () => {
    const newItem = { name: 'Test Item', description: 'This is a test item.' };
    const response = await request(app).post('/api/items').send(newItem);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newItem.name);
  });

  it('should return 404 for non-existing route', async () => {
    const response = await request(app).get('/api/non-existing-route');
    expect(response.status).toBe(404);
  });
});

import { render, screen } from '@testing-library/react';
import App from '../src/App'; // Adjust the path as necessary

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

describe('LangChain Tests', () => {
  it('should initialize ChatOpenAI correctly', () => {
    const chatModel = new ChatOpenAI({ temperature: 0 });
    expect(chatModel).toBeDefined();
  });

  it('should create embeddings with OpenAIEmbeddings', async () => {
    const embeddings = new OpenAIEmbeddings();
    const result = await embeddings.embedQuery('Test query');
    expect(result).toBeDefined();
  });

  it('should store vectors in PineconeStore', async () => {
    const store = new PineconeStore({ apiKey: 'your-pinecone-api-key' });
    await store.addVectors([{ id: '1', values: [0.1, 0.2, 0.3] }]);
    const vectors = await store.getVectors(['1']);
    expect(vectors.length).toBe(1);
  });
});