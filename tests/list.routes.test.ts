import request from 'supertest';
import express, { Application } from 'express';
import listRoutes from '../src/routes/list.routes';
import { errorHandler } from '../src/middlewares';
import { listService } from '../src/services/list.service';
import { List } from '../src/types';

jest.mock('../src/services/list.service');

const app: Application = express();
app.use(express.json());
app.use('/api/lists', listRoutes);
app.use(errorHandler);

describe('List Routes', () => {
  const mockList = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test List',
    created_at: '2025-11-12T13:32:40.225Z',
    updated_at: '2025-11-12T13:32:40.225Z',
  } as unknown as List;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/lists', () => {
    it('should return all lists', async () => {
      const mockLists = [mockList];
      jest.spyOn(listService, 'getAllLists').mockResolvedValue(mockLists);

      const response = await request(app).get('/api/lists');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockLists);
    });
  });

  describe('GET /api/lists/:id', () => {
    it('should return a list by id', async () => {
      jest.spyOn(listService, 'getListById').mockResolvedValue(mockList);

      const response = await request(app).get(`/api/lists/${mockList.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockList);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app).get('/api/lists/invalid-id');

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/lists', () => {
    it('should create a new list', async () => {
      const newList = { ...mockList, name: 'New List' };
      jest.spyOn(listService, 'createList').mockResolvedValue(newList);

      const response = await request(app).post('/api/lists').send({ name: 'New List' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New List');
    });

    it('should return 400 for missing name', async () => {
      const response = await request(app).post('/api/lists').send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 for empty name', async () => {
      const response = await request(app).post('/api/lists').send({ name: '   ' });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/lists/:id', () => {
    it('should update a list', async () => {
      const updatedList = { ...mockList, name: 'Updated List' };
      jest.spyOn(listService, 'updateList').mockResolvedValue(updatedList);

      const response = await request(app)
        .put(`/api/lists/${mockList.id}`)
        .send({ name: 'Updated List' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated List');
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .put('/api/lists/invalid-id')
        .send({ name: 'Updated List' });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing name', async () => {
      const response = await request(app).put(`/api/lists/${mockList.id}`).send({});

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/lists/:id', () => {
    it('should delete a list', async () => {
      jest.spyOn(listService, 'deleteList').mockResolvedValue();

      const response = await request(app).delete(`/api/lists/${mockList.id}`);

      expect(response.status).toBe(204);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app).delete('/api/lists/invalid-id');

      expect(response.status).toBe(400);
    });
  });
});
