export interface Duty {
  id: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateDutyInput {
  name: string;
}

export interface UpdateDutyInput {
  name: string;
}

export interface DutyRepository {
  findAll(): Promise<Duty[]>;
  findById(id: string): Promise<Duty | null>;
  create(input: CreateDutyInput): Promise<Duty>;
  update(id: string, input: UpdateDutyInput): Promise<Duty | null>;
  delete(id: string): Promise<boolean>;
}
