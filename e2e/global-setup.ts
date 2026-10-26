import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config as dotenvConfig } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { seedDatabase } from '../prisma/seed';

/**
 * Remove os prompts criados pelos specs (todos com título "E2E ..."). Sem isso
 * eles se acumulam a cada execução e deixam a sidebar cada vez mais lenta.
 */
async function cleanE2EPrompts(url: string) {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
  });

  try {
    await prisma.prompt.deleteMany({
      where: { title: { startsWith: 'E2E ' } },
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function globalSetup() {
  if (!process.env.CI) {
    const root = process.cwd();
    const envPath = resolve(root, '.env');
    const envExamplePath = resolve(root, '.env.example');
    if (existsSync(envPath)) {
      dotenvConfig({ path: envPath });
    } else if (existsSync(envExamplePath)) {
      dotenvConfig({ path: envExamplePath });
    }
  }

  const url = process.env.DATABASE_URL;
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    console.warn('[E2E] Seed ignorado: DATABASE_URL ausente ou inválida.');
    return;
  }

  try {
    await cleanE2EPrompts(url);
  } catch (error) {
    const _error = error as Error;
    console.warn(
      `[E2E] Limpeza dos prompts de teste falhou. ${_error.message}`
    );
  }

  try {
    await seedDatabase();
  } catch (error) {
    const _error = error as Error;
    console.warn(
      `[E2E] Seed do banco de dados falhou, 
      prosseguindo sem seed. ${_error.message}`
    );
  }
}

export default globalSetup;
