import { dutyService } from '../src/services/duty.service';
import { dutyRepository } from '../src/repositories/duty.repository';
import { AppError } from '../src/middlewares';
import { Duty } from '../src/types';

jest.mock('../src/repositories/duty.repository');

describe('DutyService', () => {
  const mockDuty: Duty = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Duty',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllDuties', () => {
    it('should return all duties', async () => {
      const mockDuties = [mockDuty];
      jest.spyOn(dutyRepository, 'findAll').mockResolvedValue(mockDuties);

      const result = await dutyService.getAllDuties();

      expect(result).toEqual(mockDuties);
      expect(dutyRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDutyById', () => {
    it('should return a duty when found', async () => {
      jest.spyOn(dutyRepository, 'findById').mockResolvedValue(mockDuty);

      const result = await dutyService.getDutyById(mockDuty.id);

      expect(result).toEqual(mockDuty);
      expect(dutyRepository.findById).toHaveBeenCalledWith(mockDuty.id);
    });

    it('should throw AppError when duty not found', async () => {
      jest.spyOn(dutyRepository, 'findById').mockResolvedValue(null);

      await expect(dutyService.getDutyById('non-existent-id')).rejects.toThrow(AppError);
    });
  });

  describe('createDuty', () => {
    it('should create and return a new duty', async () => {
      const input = { name: 'New Duty' };
      jest.spyOn(dutyRepository, 'create').mockResolvedValue(mockDuty);

      const result = await dutyService.createDuty(input);

      expect(result).toEqual(mockDuty);
      expect(dutyRepository.create).toHaveBeenCalledWith(input);
    });
  });

  describe('updateDuty', () => {
    it('should update and return the duty', async () => {
      const input = { name: 'Updated Duty' };
      jest.spyOn(dutyRepository, 'update').mockResolvedValue(mockDuty);

      const result = await dutyService.updateDuty(mockDuty.id, input);

      expect(result).toEqual(mockDuty);
      expect(dutyRepository.update).toHaveBeenCalledWith(mockDuty.id, input);
    });

    it('should throw AppError when duty not found', async () => {
      const input = { name: 'Updated Duty' };
      jest.spyOn(dutyRepository, 'update').mockResolvedValue(null);

      await expect(dutyService.updateDuty('non-existent-id', input)).rejects.toThrow(AppError);
    });
  });

  describe('deleteDuty', () => {
    it('should delete a duty successfully', async () => {
      jest.spyOn(dutyRepository, 'delete').mockResolvedValue(true);

      await expect(dutyService.deleteDuty(mockDuty.id)).resolves.not.toThrow();
      expect(dutyRepository.delete).toHaveBeenCalledWith(mockDuty.id);
    });

    it('should throw AppError when duty not found', async () => {
      jest.spyOn(dutyRepository, 'delete').mockResolvedValue(false);

      await expect(dutyService.deleteDuty('non-existent-id')).rejects.toThrow(AppError);
    });
  });
});
