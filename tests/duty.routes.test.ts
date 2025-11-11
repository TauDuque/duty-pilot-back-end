import request from 'supertest';
import express, { Application } from 'express';
import dutyRoutes from '../src/routes/duty.routes';
import { errorHandler } from '../src/middlewares';
import { dutyService } from '../src/services/duty.service';
import { Duty } from '../src/types';

jest.mock('../src/services/duty.service');

const app: Application = express();
app.use(express.json());
app.use('/api/duties', dutyRoutes);
app.use(errorHandler);

describe('Duty Routes', () => {
  const mockDuty: Duty = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Duty',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/duties', () => {
    it('should return all duties', async () => {
      const mockDuties = [mockDuty];
      jest.spyOn(dutyService, 'getAllDuties').mockResolvedValue(mockDuties);

      const response = await request(app).get('/api/duties');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockDuties);
    });
  });

  describe('GET /api/duties/:id', () => {
    it('should return a duty by id', async () => {
      jest.spyOn(dutyService, 'getDutyById').mockResolvedValue(mockDuty);

      const response = await request(app).get(`/api/duties/${mockDuty.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockDuty);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app).get('/api/duties/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/duties', () => {
    it('should create a new duty', async () => {
      const input = { name: 'New Duty' };
      jest.spyOn(dutyService, 'createDuty').mockResolvedValue(mockDuty);

      const response = await request(app).post('/api/duties').send(input);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockDuty);
    });

    it('should return 400 for missing name', async () => {
      const response = await request(app).post('/api/duties').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for empty name', async () => {
      const response = await request(app).post('/api/duties').send({ name: '   ' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/duties/:id', () => {
    it('should update a duty', async () => {
      const input = { name: 'Updated Duty' };
      const updatedDuty = { ...mockDuty, ...input };
      jest.spyOn(dutyService, 'updateDuty').mockResolvedValue(updatedDuty);

      const response = await request(app).put(`/api/duties/${mockDuty.id}`).send(input);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(updatedDuty);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .put('/api/duties/invalid-id')
        .send({ name: 'Updated' });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing name', async () => {
      const response = await request(app).put(`/api/duties/${mockDuty.id}`).send({});

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/duties/:id', () => {
    it('should delete a duty', async () => {
      jest.spyOn(dutyService, 'deleteDuty').mockResolvedValue(undefined);

      const response = await request(app).delete(`/api/duties/${mockDuty.id}`);

      expect(response.status).toBe(204);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app).delete('/api/duties/invalid-id');

      expect(response.status).toBe(400);
    });
  });
});

