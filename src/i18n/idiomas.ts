/**
 * Dois idiomas, duas rotas estáticas: "/" em português e "/en" em inglês.
 * Rotas separadas (em vez de troca por JavaScript) mantêm cada versão
 * indexável, compartilhável por link e legível sem script.
 */
export const IDIOMAS = ['pt', 'en'] as const;
export type Idioma = (typeof IDIOMAS)[number];

export const IDIOMA_PADRAO: Idioma = 'pt';

export const METADADOS_IDIOMA: Record<Idioma, { lang: string; ogLocale: string; nome: string }> = {
  pt: { lang: 'pt-BR', ogLocale: 'pt_BR', nome: 'Português' },
  en: { lang: 'en', ogLocale: 'en_US', nome: 'English' },
};

/** Prefixo de URL do idioma. O português fica na raiz, sem /pt. */
export function prefixo(idioma: Idioma): string {
  return idioma === IDIOMA_PADRAO ? '' : `/${idioma}`;
}

/** Monta um caminho no idioma dado. `caminho` sempre começa com "/". */
export function rota(idioma: Idioma, caminho = '/'): string {
  const base = prefixo(idioma) + (caminho === '/' ? '' : caminho);
  return base === '' ? '/' : base;
}

/** O mesmo caminho no outro idioma, para o botão de troca. */
export function outroIdioma(idioma: Idioma): Idioma {
  return idioma === 'pt' ? 'en' : 'pt';
}
