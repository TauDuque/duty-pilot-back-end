import { dutyRepository } from '../repositories/duty.repository';
import { Duty, CreateDutyInput, UpdateDutyInput } from '../types';
import { AppError } from '../middlewares';

class DutyService {
  async getAllDuties(listId?: string): Promise<Duty[]> {
    return await dutyRepository.findAll(listId);
  }

  async getDutyById(id: string): Promise<Duty> {
    const duty = await dutyRepository.findById(id);

    if (!duty) {
      throw new AppError(404, 'Duty not found');
    }

    return duty;
  }

  async createDuty(input: CreateDutyInput): Promise<Duty> {
    const payload: CreateDutyInput = {
      ...input,
      status: input.status ?? 'pending',
    };

    return await dutyRepository.create(payload);
  }

  async updateDuty(id: string, input: UpdateDutyInput): Promise<Duty> {
    const duty = await dutyRepository.update(id, input);

    if (!duty) {
      throw new AppError(404, 'Duty not found');
    }

    return duty;
  }

  async deleteDuty(id: string): Promise<void> {
    const deleted = await dutyRepository.delete(id);

    if (!deleted) {
      throw new AppError(404, 'Duty not found');
    }
  }
}

export const dutyService = new DutyService();
