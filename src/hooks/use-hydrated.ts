import { useEffect, useState } from 'react';

/**
 * Informa se o componente já foi hidratado no navegador.
 *
 * - false no servidor e durante a hidratação
 * - true depois que o React assume o HTML do servidor
 *
 * Use para bloquear interações (readOnly/disabled) que seriam perdidas antes
 * de os handlers do React estarem ligados. Os testes E2E dependem disso: o
 * Playwright só age em elementos editáveis/habilitados e, assim, espera a
 * hidratação sem precisar de esperas fixas.
 */
export const useHydrated = () => {
  // Começa false: é o valor usado no servidor e na hidratação, que precisa
  // gerar o mesmo HTML que o servidor enviou
  const [hydrated, setHydrated] = useState(false);

  // O useEffect só roda no navegador, depois que o componente já apareceu.
  // Então, ao chegar aqui, a hidratação terminou e o valor pode virar true
  useEffect(() => {
    // O setState direto no efeito é intencional: é o que faz o valor mudar de
    // false para true após a hidratação. A regra avisa de renders em cascata,
    // mas aqui é um único re-render, executado uma só vez
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  return hydrated;
};
