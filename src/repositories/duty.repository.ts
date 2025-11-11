import { pool } from '../config/database';
import { Duty, CreateDutyInput, UpdateDutyInput, DutyRepository } from '../types';
import { AppError } from '../middlewares';

class DutyRepositoryImpl implements DutyRepository {
  async findAll(): Promise<Duty[]> {
    try {
      const query = `
        SELECT id, name, created_at, updated_at 
        FROM duties 
        ORDER BY created_at DESC
      `;

      const result = await pool.query<Duty>(query);
      return result.rows;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new AppError(500, 'Failed to fetch duties from database');
    }
  }

  async findById(id: string): Promise<Duty | null> {
    try {
      const query = `
        SELECT id, name, created_at, updated_at 
        FROM duties 
        WHERE id = $1
      `;

      const result = await pool.query<Duty>(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in findById:', error);
      throw new AppError(500, 'Failed to fetch duty from database');
    }
  }

  async create(input: CreateDutyInput): Promise<Duty> {
    try {
      const query = `
        INSERT INTO duties (name) 
        VALUES ($1) 
        RETURNING id, name, created_at, updated_at
      `;

      const result = await pool.query<Duty>(query, [input.name]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in create:', error);
      throw new AppError(500, 'Failed to create duty in database');
    }
  }

  async update(id: string, input: UpdateDutyInput): Promise<Duty | null> {
    try {
      const query = `
        UPDATE duties 
        SET name = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 
        RETURNING id, name, created_at, updated_at
      `;

      const result = await pool.query<Duty>(query, [input.name, id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in update:', error);
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
      console.error('Error in delete:', error);
      throw new AppError(500, 'Failed to delete duty from database');
    }
  }
}

export const dutyRepository = new DutyRepositoryImpl();
