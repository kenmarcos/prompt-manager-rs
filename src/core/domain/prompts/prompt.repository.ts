import { CreatePromptDTO } from '@/core/application/prompts/create-prompt.dto';
import { Prompt } from './prompt.entity';

export interface PromptRepository {
  findMany(): Promise<Prompt[]>;
  findByTitle(title: string): Promise<Prompt | null>;
  searchMany(term: string): Promise<Prompt[]>;
  create(data: CreatePromptDTO): Promise<void>;
}
