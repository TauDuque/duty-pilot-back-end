import { Request, Response } from 'express';
import { dutyService } from '../services/duty.service';
import { CreateDutyInput, UpdateDutyInput, SuccessResponse, Duty } from '../types';

class DutyController {
  async getAll(_req: Request, res: Response): Promise<void> {
    const duties = await dutyService.getAllDuties();

    const response: SuccessResponse<Duty[]> = {
      success: true,
      data: duties,
    };

    res.status(200).json(response);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const duty = await dutyService.getDutyById(id);

    const response: SuccessResponse<Duty> = {
      success: true,
      data: duty,
    };

    res.status(200).json(response);
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateDutyInput = req.body as CreateDutyInput;
    const duty = await dutyService.createDuty(input);

    const response: SuccessResponse<Duty> = {
      success: true,
      data: duty,
    };

    res.status(201).json(response);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const input: UpdateDutyInput = req.body as UpdateDutyInput;
    const duty = await dutyService.updateDuty(id, input);

    const response: SuccessResponse<Duty> = {
      success: true,
      data: duty,
    };

    res.status(200).json(response);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await dutyService.deleteDuty(id);

    res.status(204).send();
  }
}

export const dutyController = new DutyController();
