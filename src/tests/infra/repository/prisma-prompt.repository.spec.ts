import { CreatePromptDTO } from '@/core/application/prompts/create-prompt.dto';
import { UpdatePromptDTO } from '@/core/application/prompts/update-prompt.dto';
import { Prompt } from '@/core/domain/prompts/prompt.entity';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository';

interface PromptDelegateMock {
  create: jest.MockedFunction<
    (args: { data: CreatePromptDTO }) => Promise<void>
  >;
  findMany: jest.MockedFunction<
    (args: {
      orderBy?: { createdAt: 'asc' | 'desc' };
      where?: {
        OR: Array<{
          title?: { contains: string; mode: 'insensitive' };
          content?: { contains: string; mode: 'insensitive' };
        }>;
      };
    }) => Promise<Prompt[]>
  >;
  findFirst: jest.MockedFunction<
    (args: {
      where?: {
        title: string;
      };
    }) => Promise<Pick<Prompt, 'id' | 'title' | 'content'>>
  >;
  findUnique: jest.MockedFunction<
    (args: { where: { id: string } }) => Promise<Prompt | null>
  >;
  update: jest.MockedFunction<
    (args: { where: { id: string }; data: UpdatePromptDTO }) => Promise<Prompt>
  >;
}

interface PrismaMock {
  prompt: PromptDelegateMock;
}

const createMockPrisma = () => {
  const mock = {
    prompt: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  return mock as unknown as PrismaClient & PrismaMock;
};

describe('PrismaPromptRepository', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let repository: PrismaPromptRepository;

  beforeEach(() => {
    prisma = createMockPrisma();
    repository = new PrismaPromptRepository(prisma);
  });

  describe('create', () => {
    it('should call prisma.prompt.create with the correct data', async () => {
      const input = {
        title: 'title',
        content: 'content',
      };

      await repository.create(input);

      expect(prisma.prompt.create).toHaveBeenCalledWith({
        data: input,
      });
    });
  });

  describe('findMany', () => {
    it('should sort results by createdAt in descending order and return them', async () => {
      const now = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '2',
          title: 'Title 02',
          content: 'Content 02',
          createdAt: now,
          updatedAt: now,
        },
      ];

      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.findMany();

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });
  });

  describe('searchMany', () => {
    it('should search with an empty term without submitting the where clause', async () => {
      const now = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '2',
          title: 'Title 02',
          content: 'Content 02',
          createdAt: now,
          updatedAt: now,
        },
      ];

      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany('   ');

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });

    it('should search with a term with submitting the where clause with OR clause', async () => {
      const now = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '2',
          title: 'Title 02',
          content: 'Content 02',
          createdAt: now,
          updatedAt: now,
        },
      ];

      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany('   title 01  ');

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'title 01', mode: 'insensitive' } },
            { content: { contains: 'title 01', mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });
  });

  describe('findByTitle', () => {
    it('should call findFirst correctly with the provided title', async () => {
      const title = 'Title 01';
      const input = {
        id: '1',
        title,
        content: 'Content 01',
      };

      prisma.prompt.findFirst.mockResolvedValue(input);

      const result = await repository.findByTitle(title);

      expect(prisma.prompt.findFirst).toHaveBeenCalledWith({
        where: { title },
      });
      expect(result).toMatchObject(input);
    });
  });

  describe('findById', () => {
    it('deve retornar um prompt quando existir', async () => {
      const now = new Date();
      const prompt = {
        id: '1',
        title: 'title',
        content: 'content',
        createdAt: now,
        updatedAt: now,
      };
      prisma.prompt.findUnique.mockResolvedValue(prompt);

      const result = await repository.findById(prompt.id);

      expect(prisma.prompt.findUnique).toHaveBeenCalledWith({
        where: {
          id: prompt.id,
        },
      });
      expect(result).toEqual(prompt);
    });

    it('deve retornar null quando não existir um prompt', async () => {
      prisma.prompt.findUnique.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar o prompt', async () => {
      const now = new Date();
      const prompt = {
        id: '1',
        title: 'new title',
        content: 'new content',
        createdAt: now,
        updatedAt: now,
      };

      const data = {
        title: prompt.title,
        content: prompt.content,
      };

      prisma.prompt.update.mockResolvedValue(prompt);

      const result = await repository.update(prompt.id, data);

      expect(prisma.prompt.update).toHaveBeenCalledWith({
        where: { id: prompt.id },
        data: {
          title: prompt.title,
          content: prompt.content,
        },
      });
      expect(result).toEqual(prompt);
    });

    it('deve enviar somente os campos presentes (ex: somente title)', async () => {
      const now = new Date();
      const prompt = {
        id: '1',
        title: 'new title',
        content: 'old content',
        createdAt: now,
        updatedAt: now,
      };

      const data = {
        title: prompt.title,
      };

      prisma.prompt.update.mockResolvedValue(prompt);

      await repository.update(prompt.id, data);
      const call = prisma.prompt.update.mock.calls[0][0];

      expect(call.where).toEqual({ id: prompt.id });
      expect(call.data).toEqual(data);
      expect('content' in call.data).toBe(false);
    });

    it('deve enviar somente os campos presentes (ex: somente content)', async () => {
      const now = new Date();
      const prompt = {
        id: '1',
        title: 'old title',
        content: 'new content',
        createdAt: now,
        updatedAt: now,
      };

      const data = {
        content: prompt.content,
      };

      prisma.prompt.update.mockResolvedValue(prompt);

      await repository.update(prompt.id, data);
      const call = prisma.prompt.update.mock.calls[0][0];

      expect(call.where).toEqual({ id: prompt.id });
      expect(call.data).toEqual(data);
      expect('title' in call.data).toBe(false);
    });
  });
});
