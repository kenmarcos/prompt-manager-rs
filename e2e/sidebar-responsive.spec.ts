import test, { expect } from '@playwright/test';

test.describe('Sidebar Responsiva', () => {
  test('mobile: menu hambúrger deve abrir sidebar e botão X deve fechar a sidebar', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');

    const menuButton = page.getByLabel('Abrir menu');
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    const aside = page.getByRole('complementary');
    await expect(aside).toBeInViewport();
    const closeButton = page.getByLabel('Fechar menu');
    await expect(closeButton).toBeInViewport();

    await closeButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(aside).not.toBeInViewport();
    await expect(closeButton).not.toBeInViewport();
  });

  test('desktop: menu hambúrguer deve estar oculto e sidebar deve estar visível', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/');

    await expect(page.getByLabel('Abrir menu')).toBeHidden();
    await expect(page.getByPlaceholder('Buscar prompt...')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Minimizar sidebar' })
    ).toBeVisible();
    await expect(page.getByLabel('Fechar menu')).toBeHidden();
    await expect(
      page.getByRole('heading', { name: 'Selecione um prompt' })
    ).toBeVisible();
  });
});
