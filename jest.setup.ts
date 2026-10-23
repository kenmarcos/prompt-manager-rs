/* eslint-disable @typescript-eslint/no-explicit-any */
// Arquivo executado imediatamente após a inicialização do ambiente de teste, mas antes que qualquer teste seja rodado.

import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';
import { webcrypto } from 'crypto';
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;
if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = webcrypto;
}

jest.mock('next/cache', () => {
  return {
    revalidatePath: jest.fn(),
  };
});
