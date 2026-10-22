import { CreatePromptDTO } from '@/core/application/prompts/create-prompt.dto';
import { Prompt } from './prompt.entity';

export interface PromptRepository {
  create(data: CreatePromptDTO): Promise<void>;
  findByTitle(title: string): Promise<Prompt | null>;
  searchMany(term: string): Promise<Prompt[]>;
  findMany(): Promise<Prompt[]>;
  findById(id: string): Promise<Prompt | null>;
  update(id: string, data: Partial<CreatePromptDTO>): Promise<Prompt>;
  delete(id: string): Promise<void>;
}
