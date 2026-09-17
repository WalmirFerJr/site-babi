// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

/**
 * Endereço público do site. Habilita <link rel="canonical">, og:url e a URL
 * absoluta da imagem social. Sem ele, essas tags não são emitidas — nenhum
 * endereço é inventado.
 *
 * O currículo atualizado aponta para https://www.barbarafraquete.vercel.app,
 * mas o subdomínio `www.` NÃO funciona em domínios *.vercel.app: a Vercel serve
 * apenas <projeto>.vercel.app. Por isso o padrão aqui é a forma sem `www`.
 * Confirme qual é o endereço final e, se for outro, defina SITE_URL no projeto
 * da Vercel — a variável tem prioridade sobre este valor.
 */
const site = process.env.SITE_URL || 'https://barbarafraquete.vercel.app';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  compressHTML: true,
  build: { format: 'directory' },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Space Grotesk',
      cssVariable: '--fonte-titulo',
      weights: [700],
      styles: ['normal'],
      // Português cabe inteiro no subset latin; latin-ext só somaria download.
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--fonte-corpo',
      weights: [400, 600],
      styles: ['normal'],
      // Português cabe inteiro no subset latin; latin-ext só somaria download.
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
    },
  ],
});
