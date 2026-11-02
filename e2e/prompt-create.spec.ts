import { PrismaClient } from '@/generated/prisma/client';
import { expect, test } from './fixtures';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

test('Criação de prompt via UI (sucesso)', async ({ page }) => {
  const uniqueTitle = `E2E Prompt ${Date.now()}`;
  const content = 'Conteúdo gerado via E2E';

  await page.goto('/new');

  await expect(page.getByPlaceholder(/título do prompt/i)).toBeVisible();

  await page.getByPlaceholder(/título do prompt/i).fill(uniqueTitle);
  await page.getByPlaceholder(/conteúdo do seu prompt/i).fill(content);
  await page.getByRole('button', { name: /salvar/i }).click();

  await expect(page.getByText('Prompt criado com sucesso')).toBeVisible({
    timeout: 15000,
  });
});

test('Validação de duplicidade de título', async ({ page }) => {
  const duplicateTitle = 'E2E Duplicate Title';
  const content = 'Conteúdo gerado via E2E';

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  await prisma.prompt.deleteMany({ where: { title: duplicateTitle } });
  await prisma.prompt.create({
    data: {
      title: duplicateTitle,
      content,
    },
  });
  await prisma.$disconnect();

  await page.goto('/new');

  await expect(page.getByPlaceholder(/título do prompt/i)).toBeVisible();

  await page.getByPlaceholder(/título do prompt/i).fill(duplicateTitle);
  await page.getByPlaceholder(/conteúdo do seu prompt/i).fill(content);
  await page.getByRole('button', { name: /salvar/i }).click();

  await expect(page.getByText('Este prompt já existe')).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByRole('heading', { name: duplicateTitle })).toHaveCount(
    1
  );
});
