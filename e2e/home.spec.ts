import { type Page } from '@playwright/test';
import { test, expect } from './fixtures';

test('deve carregar a página inicial', async ({ page }: { page: Page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Selecione um prompt' })
  ).toBeVisible();
  await expect(
    page.getByText(
      'Escolha um prompt da lista ao lado para visualizar e editar.'
    )
  ).toBeVisible();
});
