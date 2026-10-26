import { expect, Locator, Page } from '@playwright/test';

/**
 * Espera o React hidratar o elemento. Antes disso, um fill altera só o DOM:
 * o onChange não dispara e o estado do componente fica com o valor antigo.
 */
export const waitForHydration = async (locator: Locator) => {
  await expect
    .poll(
      () =>
        locator.evaluate((el) =>
          Object.keys(el).some((key) => key.startsWith('__reactProps'))
        ),
      { timeout: 15000 }
    )
    .toBe(true);
};

export const fillPromptForm = async (
  page: Page,
  title: string,
  content: string
) => {
  const titleInput = page.getByPlaceholder(/título do prompt/i);
  const contentInput = page.getByPlaceholder(/conteúdo do seu prompt/i);

  await waitForHydration(titleInput);

  await expect(async () => {
    await titleInput.fill(title);
    await contentInput.fill(content);
    await expect(titleInput).toHaveValue(title, { timeout: 1000 });
    await expect(contentInput).toHaveValue(content, { timeout: 1000 });
  }).toPass();
};
