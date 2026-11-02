'use client';

import { useEffect } from 'react';

/**
 * Sinaliza que a página já foi hidratada, escrevendo data-hydrated="true" na
 * tag <html>. Os testes E2E esperam esse atributo (ver e2e/fixtures.ts) antes
 * de interagir, pois cliques e digitação feitos antes da hidratação podem ser
 * descartados.
 *
 * Funciona porque o useEffect nunca roda no servidor: ele só executa no
 * navegador, depois que o React assume o HTML recebido. Então, se o atributo
 * existe, a hidratação já aconteceu. Por isso o atributo não pode vir escrito
 * no HTML do servidor: o sinal deixaria de significar alguma coisa.
 *
 * Não renderiza nada na tela. Deve ficar no layout raiz para valer em todas as
 * páginas. Cobre a hidratação da raiz; conteúdo dentro de <Suspense> pode
 * hidratar depois, e por isso os campos também usam o hook useHydrated.
 */
export const HydrationMarker = () => {
  useEffect(() => {
    // dataset.hydrated vira o atributo data-hydrated (camelCase -> kebab-case)
    document.documentElement.dataset.hydrated = 'true';
  }, []);

  // Componente só de efeito: não desenha nada
  return null;
};
