import { pool } from '../config/database';
import { Duty, CreateDutyInput, UpdateDutyInput, DutyRepository } from '../types';
import { AppError } from '../middlewares';
import { logger } from '../utils/logger';

class DutyRepositoryImpl implements DutyRepository {
  async findAll(listId?: string): Promise<Duty[]> {
    try {
      let query = `
        SELECT id, name, status, list_id, created_at, updated_at 
        FROM duties 
      `;
      const params: string[] = [];

      if (listId) {
        query += ` WHERE list_id = $1`;
        params.push(listId);
      }

      query += ` ORDER BY created_at DESC`;

      const result = await pool.query<Duty>(query, params.length > 0 ? params : undefined);
      return result.rows;
    } catch (error) {
      logger.error({ err: error }, 'Error in dutyRepository.findAll');
      throw new AppError(500, 'Failed to fetch duties from database');
    }
  }

  async findById(id: string): Promise<Duty | null> {
    try {
      const query = `
        SELECT id, name, status, list_id, created_at, updated_at 
        FROM duties 
        WHERE id = $1
      `;

      const result = await pool.query<Duty>(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error({ err: error, dutyId: id }, 'Error in dutyRepository.findById');
      throw new AppError(500, 'Failed to fetch duty from database');
    }
  }

  async create(input: CreateDutyInput): Promise<Duty> {
    try {
      const query = `
        INSERT INTO duties (name, list_id, status) 
        VALUES ($1, $2, $3) 
        RETURNING id, name, status, list_id, created_at, updated_at
      `;

      const result = await pool.query<Duty>(query, [
        input.name,
        input.list_id || null,
        input.status ?? 'pending',
      ]);
      return result.rows[0];
    } catch (error) {
      logger.error({ err: error, payload: input }, 'Error in dutyRepository.create');
      throw new AppError(500, 'Failed to create duty in database');
    }
  }

  async update(id: string, input: UpdateDutyInput): Promise<Duty | null> {
    try {
      const setClauses: string[] = [];
      const values: unknown[] = [];

      if (input.name !== undefined) {
        setClauses.push(`name = $${values.length + 1}`);
        values.push(input.name);
      }

      if (input.status !== undefined) {
        setClauses.push(`status = $${values.length + 1}`);
        values.push(input.status);
      }

      if (setClauses.length === 0) {
        throw new AppError(400, 'No fields provided to update duty');
      }

      setClauses.push('updated_at = CURRENT_TIMESTAMP');

      const query = `
        UPDATE duties 
        SET ${setClauses.join(', ')}
        WHERE id = $${values.length + 1}
        RETURNING id, name, status, list_id, created_at, updated_at
      `;

      values.push(id);

      const result = await pool.query<Duty>(query, values);
      return result.rows[0] || null;
    } catch (error) {
      logger.error({ err: error, dutyId: id, payload: input }, 'Error in dutyRepository.update');
      throw new AppError(500, 'Failed to update duty in database');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const query = `
        DELETE FROM duties 
        WHERE id = $1 
        RETURNING id
      `;

      const result = await pool.query(query, [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error({ err: error, dutyId: id }, 'Error in dutyRepository.delete');
      throw new AppError(500, 'Failed to delete duty from database');
    }
  }
}

export const dutyRepository = new DutyRepositoryImpl();
