export interface List {
  id: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateListInput {
  name: string;
}

export interface UpdateListInput {
  name: string;
}

export interface ListRepository {
  findAll(): Promise<List[]>;
  findById(id: string): Promise<List | null>;
  create(input: CreateListInput): Promise<List>;
  update(id: string, input: UpdateListInput): Promise<List | null>;
  delete(id: string): Promise<boolean>;
}
