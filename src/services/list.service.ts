import { listRepository } from '../repositories/list.repository';
import { List, CreateListInput, UpdateListInput } from '../types';
import { AppError } from '../middlewares';

class ListService {
  async getAllLists(): Promise<List[]> {
    return await listRepository.findAll();
  }

  async getListById(id: string): Promise<List> {
    const list = await listRepository.findById(id);

    if (!list) {
      throw new AppError(404, 'List not found');
    }

    return list;
  }

  async createList(input: CreateListInput): Promise<List> {
    return await listRepository.create(input);
  }

  async updateList(id: string, input: UpdateListInput): Promise<List> {
    const list = await listRepository.update(id, input);

    if (!list) {
      throw new AppError(404, 'List not found');
    }

    return list;
  }

  async deleteList(id: string): Promise<void> {
    const deleted = await listRepository.delete(id);

    if (!deleted) {
      throw new AppError(404, 'List not found');
    }
  }
}

export const listService = new ListService();
