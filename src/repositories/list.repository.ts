import { pool } from '../config/database';
import { List, CreateListInput, UpdateListInput, ListRepository } from '../types';
import { AppError } from '../middlewares';
import { logger } from '../utils/logger';

class ListRepositoryImpl implements ListRepository {
  async findAll(): Promise<List[]> {
    try {
      const query = `
        SELECT id, name, created_at, updated_at 
        FROM lists 
        ORDER BY created_at DESC
      `;

      const result = await pool.query<List>(query);
      return result.rows;
    } catch (error) {
      logger.error({ err: error }, 'Error in listRepository.findAll');
      throw new AppError(500, 'Failed to fetch lists from database');
    }
  }

  async findById(id: string): Promise<List | null> {
    try {
      const query = `
        SELECT id, name, created_at, updated_at 
        FROM lists 
        WHERE id = $1
      `;

      const result = await pool.query<List>(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error({ err: error, listId: id }, 'Error in listRepository.findById');
      throw new AppError(500, 'Failed to fetch list from database');
    }
  }

  async create(input: CreateListInput): Promise<List> {
    try {
      const query = `
        INSERT INTO lists (name) 
        VALUES ($1) 
        RETURNING id, name, created_at, updated_at
      `;

      const result = await pool.query<List>(query, [input.name]);
      return result.rows[0];
    } catch (error) {
      logger.error({ err: error, payload: input }, 'Error in listRepository.create');
      throw new AppError(500, 'Failed to create list in database');
    }
  }

  async update(id: string, input: UpdateListInput): Promise<List | null> {
    try {
      const query = `
        UPDATE lists 
        SET name = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 
        RETURNING id, name, created_at, updated_at
      `;

      const result = await pool.query<List>(query, [input.name, id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error({ err: error, listId: id, payload: input }, 'Error in listRepository.update');
      throw new AppError(500, 'Failed to update list in database');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const query = `
        DELETE FROM lists 
        WHERE id = $1 
        RETURNING id
      `;

      const result = await pool.query(query, [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error({ err: error, listId: id }, 'Error in listRepository.delete');
      throw new AppError(500, 'Failed to delete list from database');
    }
  }
}

export const listRepository = new ListRepositoryImpl();
