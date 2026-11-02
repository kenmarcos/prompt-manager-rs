import { PrismaClient } from '@/generated/prisma/client';
import { test, expect } from './fixtures';
import { PrismaPg } from '@prisma/adapter-pg';

test('Busca de prompts na Sidebar filtrando a lista de prompt em tempo real baseado no termo digitado', async ({
  page,
}) => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const suffix = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const uniqueAlpha = `E2E search Alpha ${suffix}`;
  const uniqueBeta = `E2E search Beta ${suffix}`;
  await prisma.prompt.createMany({
    data: [
      { title: uniqueAlpha, content: 'Alpha content' },
      { title: uniqueBeta, content: 'Beta content' },
    ],
  });
  await prisma.$disconnect();

  await page.goto('/');

  const searchInput = page.getByPlaceholder('Buscar prompt...');

  await searchInput.fill(uniqueAlpha);

  await expect(page.getByText(uniqueBeta)).toHaveCount(0, { timeout: 15000 });
  await expect(page.getByText(uniqueAlpha)).toHaveCount(1);

  await searchInput.fill(uniqueBeta);
  await expect(page.getByText(uniqueAlpha)).toHaveCount(0, { timeout: 15000 });
  await expect(page.getByText(uniqueBeta)).toHaveCount(1);

  const notExist = `E2E Search Not Exist ${Date.now()}`;
  await searchInput.fill(notExist);
  await expect(page.getByText(uniqueAlpha)).toHaveCount(0, { timeout: 15000 });
  await expect(page.getByText(uniqueBeta)).toHaveCount(0);
  await expect(page.getByText(notExist)).toHaveCount(0);
});
