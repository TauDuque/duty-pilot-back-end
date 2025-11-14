export type DutyStatus = 'pending' | 'in_progress' | 'done';

export interface Duty {
  id: string;
  name: string;
  status: DutyStatus;
  list_id: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateDutyInput {
  name: string;
  list_id?: string;
  status?: DutyStatus;
}

export interface UpdateDutyInput {
  name?: string;
  status?: DutyStatus;
}

export interface DutyRepository {
  findAll(listId?: string): Promise<Duty[]>;
  findById(id: string): Promise<Duty | null>;
  create(input: CreateDutyInput): Promise<Duty>;
  update(id: string, input: UpdateDutyInput): Promise<Duty | null>;
  delete(id: string): Promise<boolean>;
}
