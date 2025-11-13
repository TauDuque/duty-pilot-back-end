import { Request, Response } from 'express';
import { listService } from '../services/list.service';
import { CreateListInput, UpdateListInput, SuccessResponse, List } from '../types';

class ListController {
  async getAll(_req: Request, res: Response): Promise<void> {
    const lists = await listService.getAllLists();

    const response: SuccessResponse<List[]> = {
      success: true,
      data: lists,
    };

    res.status(200).json(response);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const list = await listService.getListById(id);

    const response: SuccessResponse<List> = {
      success: true,
      data: list,
    };

    res.status(200).json(response);
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateListInput = req.body as CreateListInput;
    const list = await listService.createList(input);

    const response: SuccessResponse<List> = {
      success: true,
      data: list,
    };

    res.status(201).json(response);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const input: UpdateListInput = req.body as UpdateListInput;
    const list = await listService.updateList(id, input);

    const response: SuccessResponse<List> = {
      success: true,
      data: list,
    };

    res.status(200).json(response);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await listService.deleteList(id);

    res.status(204).send();
  }
}

export const listController = new ListController();
