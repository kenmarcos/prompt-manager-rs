import { PrismaClient } from '@/generated/prisma/client';
import { test, expect } from './fixtures';
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

  await page.getByPlaceholder(/título do prompt/i).fill(updatedTitle);
  await page.getByPlaceholder(/conteúdo do seu prompt/i).fill(updatedContent);
  await page.getByRole('button', { name: /salvar/i }).click();

  await expect(page.getByText('Prompt atualizado com sucesso')).toBeVisible({
    timeout: 15000,
  });

  // A sidebar só reflete o novo título após o revalidatePath/router.refresh
  await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByPlaceholder(/título do prompt/i)).toHaveValue(
    updatedTitle
  );
});
