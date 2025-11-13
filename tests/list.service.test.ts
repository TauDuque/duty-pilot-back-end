import { listService } from '../src/services/list.service';
import { listRepository } from '../src/repositories/list.repository';
import { AppError } from '../src/middlewares';
import { List } from '../src/types';

jest.mock('../src/repositories/list.repository');

describe('ListService', () => {
  const mockList: List = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test List',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLists', () => {
    it('should return all lists', async () => {
      const mockLists = [mockList];
      jest.spyOn(listRepository, 'findAll').mockResolvedValue(mockLists);

      const result = await listService.getAllLists();

      expect(result).toEqual(mockLists);
      expect(listRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getListById', () => {
    it('should return a list when found', async () => {
      jest.spyOn(listRepository, 'findById').mockResolvedValue(mockList);

      const result = await listService.getListById(mockList.id);

      expect(result).toEqual(mockList);
      expect(listRepository.findById).toHaveBeenCalledWith(mockList.id);
    });

    it('should throw AppError when list not found', async () => {
      jest.spyOn(listRepository, 'findById').mockResolvedValue(null);

      await expect(listService.getListById('non-existent-id')).rejects.toThrow(AppError);
    });
  });

  describe('createList', () => {
    it('should create and return a new list', async () => {
      const input = { name: 'New List' };
      jest.spyOn(listRepository, 'create').mockResolvedValue(mockList);

      const result = await listService.createList(input);

      expect(result).toEqual(mockList);
      expect(listRepository.create).toHaveBeenCalledWith(input);
    });
  });

  describe('updateList', () => {
    it('should update and return the list', async () => {
      const input = { name: 'Updated List' };
      jest.spyOn(listRepository, 'update').mockResolvedValue(mockList);

      const result = await listService.updateList(mockList.id, input);

      expect(result).toEqual(mockList);
      expect(listRepository.update).toHaveBeenCalledWith(mockList.id, input);
    });

    it('should throw AppError when list not found', async () => {
      const input = { name: 'Updated List' };
      jest.spyOn(listRepository, 'update').mockResolvedValue(null);

      await expect(listService.updateList('non-existent-id', input)).rejects.toThrow(AppError);
    });
  });

  describe('deleteList', () => {
    it('should delete a list successfully', async () => {
      jest.spyOn(listRepository, 'delete').mockResolvedValue(true);

      await expect(listService.deleteList(mockList.id)).resolves.not.toThrow();
      expect(listRepository.delete).toHaveBeenCalledWith(mockList.id);
    });

    it('should throw AppError when list not found', async () => {
      jest.spyOn(listRepository, 'delete').mockResolvedValue(false);

      await expect(listService.deleteList('non-existent-id')).rejects.toThrow(AppError);
    });
  });
});

