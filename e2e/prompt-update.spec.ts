import { PrismaClient } from '@/generated/prisma/client';
import { test, expect } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';

test('Edição de prompt via UI (sucesso)', async ({ page }) => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const now = Date.now();
  const originalTitle = `E2E Edit Original ${now}`;
  const originalContent = 'Content';
  const updatedTitle = `E2E Edit Updated ${now}`;
  const updatedContent = 'Content';

  const created = await prisma.prompt.create({
    data: {
      title: originalTitle,
      content: originalContent,
    },
  });
  await prisma.$disconnect();

  await page.goto(`/${created.id}`);

  await expect(page.getByPlaceholder(/título do prompt/i)).toBeVisible();

  await page.fill('input[name="title"]', updatedTitle);
  await page.fill('textarea[name="content"]', updatedContent);

  await page.getByRole('button', { name: /salvar/i }).click();

  await page.waitForSelector('text=Prompt atualizado com sucesso', {
    state: 'visible',
    timeout: 15000,
  });

  await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible();
  await expect(page.locator('input[name="title"]')).toHaveValue(updatedTitle);
  // await expect(page.getByPlaceholder(/título do prompt/i)).toHaveValue(updatedTitle);
});
