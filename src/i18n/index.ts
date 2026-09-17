import type { Idioma } from './idiomas';
import type { Dicionario } from './tipos';
import { pt } from './pt';
import { en } from './en';

const dicionarios: Record<Idioma, Dicionario> = { pt, en };

/** Textos do idioma pedido. */
export function t(idioma: Idioma): Dicionario {
  return dicionarios[idioma];
}

export type { Dicionario };
export * from './idiomas';
