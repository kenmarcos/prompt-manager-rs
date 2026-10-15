import { expect, test } from '@playwright/test';

test('Criação de prompt via UI (sucesso)', async ({ page }) => {
  const uniqueTitle = `E2E Prompt ${Date.now()}`;
  const content = 'Conteúdo gerado via E2E';

  await page.goto('/new');

  await expect(page.getByPlaceholder(/título do prompt/i)).toBeVisible();

  await page.fill('input[name="title"]', uniqueTitle);
  await page.fill('textarea[name="content"]', content);
  await page.getByRole('button', { name: /salvar/i }).click();

  await page.waitForSelector('text=Prompt criado com sucesso', {
    state: 'visible',
    timeout: 15000,
  });
});
