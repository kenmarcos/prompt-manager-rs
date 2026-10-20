import { PromptRepository } from '@/core/domain/prompts/prompt.repository';
import { UpdatePromptDTO } from './update-prompt.dto';
import { Prompt } from '@/generated/prisma/client';

export class UpdatePromptsUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(data: UpdatePromptDTO): Promise<Prompt> {
    const promptExists = await this.promptRepository.findById(data.id);

    if (!promptExists) {
      throw new Error('PROMPT_NOT_FOUND');
    }

    const prompt = await this.promptRepository.update(data.id, {
      title: data.title,
      content: data.content,
    });

    return prompt;
  }
}
