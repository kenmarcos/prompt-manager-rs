import { PrismaClient } from '@/generated/prisma/client';
import { expect, test } from './fixtures';
import { PrismaPg } from '@prisma/adapter-pg';

test('Deleção de prompt via UI (sucesso)', async ({ page }) => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const title = `E2E Deleteble Prompt ${Date.now()}`;
  const content = 'content';

  await prisma.prompt.create({
    data: {
      title,
      content,
    },
  });

  await prisma.$disconnect();

  await page.goto('/');

  const promptItem = page.getByRole('listitem').filter({ hasText: title });
  await promptItem.getByRole('button', { name: /remover prompt/i }).click();

  const dialog = page.getByRole('alertdialog', { name: /remover prompt/i });
  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: /remover/i }).click();

  await expect(page.getByText('Prompt removido com sucesso')).toBeVisible({
    timeout: 15000,
  });
  await expect(dialog).toBeHidden();
  await expect(promptItem).toHaveCount(0, { timeout: 15000 });
});
