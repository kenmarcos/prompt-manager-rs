import { test as base, expect } from '@playwright/test';

/**
 * Versão do `test` do Playwright usada por todos os specs do app (em vez de
 * importar de '@playwright/test').
 *
 * Problema que resolve: o Next envia o HTML pronto, mas os handlers do React
 * (onChange, onClick) só são ligados depois da hidratação. O Playwright age
 * assim que o elemento aparece, então um fill ou click logo após o goto pode
 * ser descartado.
 *
 * Solução: sobrescreve a fixture `page` para que todo `page.goto` só termine
 * quando o app sinalizar que hidratou. O sinal é o atributo data-hydrated no
 * <html>, escrito pelo componente HydrationMarker (src/components/).
 *
 * Isso é só uma rede de segurança. A proteção principal fica no app: campos e
 * botões ficam readOnly/disabled até hidratar (hook useHydrated).
 */
export const test = base.extend({
  // Em extend, o 2º parâmetro é o callback que entrega o valor ao teste. Ele
  // costuma se chamar `use`, mas aqui é `runTest` porque o eslint (react-hooks)
  // confunde `use(...)` com o hook `use` do React.
  page: async ({ page }, runTest) => {
    // Guarda o goto original, preso a `page`, para chamá-lo dentro do novo
    const originalGoto = page.goto.bind(page);

    // Troca o goto desta instância de page (só vale para o teste em execução)
    page.goto = async (url, options) => {
      const response = await originalGoto(url, options);

      // Espera até 15s: no `next dev` a primeira compilação de uma rota e a
      // hidratação podem passar dos 5s padrão do expect
      await expect(page.locator('html')).toHaveAttribute(
        'data-hydrated',
        'true',
        { timeout: 15000 }
      );

      return response;
    };

    // Entrega a page modificada ao teste. Quando o teste termina, a execução
    // continua depois desta linha (aqui não há nada a limpar)
    await runTest(page);
  },
});

// Reexporta o expect para os specs importarem test e expect do mesmo lugar
export { expect };
