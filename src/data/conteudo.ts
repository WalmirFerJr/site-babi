/**
 * Camada única de leitura do conteúdo.
 * Componentes consomem daqui; ninguém importa JSON solto.
 *
 * Regras de publicação aplicadas neste arquivo:
 * - case só aparece (e só gera rota) com status "publicado" E imagem real;
 * - imagem só aparece se publicUse === true e se o arquivo existir em src/assets;
 * - campos internos (missing, dateStatus, provenance) nunca chegam ao visitante.
 */
import type { Asset, Case, Evento, Experiencia, Manifesto, Perfil } from './types';
import perfilJson from './perfil.json';
import casesJson from './cases.json';
import eventosJson from './eventos.json';
import manifestoJson from './manifest.json';

export const perfil = perfilJson as Perfil;
const cases = casesJson as Case[];
const eventos = eventosJson as Evento[];
const manifesto = manifestoJson as unknown as Manifesto;

/** Imagens otimizadas pelo Astro. O arquivo é nomeado pelo id do manifesto (ver scripts/sync-conteudo.mjs). */
const arquivosDeEvento = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/eventos/*.{jpeg,jpg,png,webp,avif}',
  { eager: true },
);

const porId = new Map<string, Asset>(manifesto.assets.map((a) => [a.id, a]));

export interface Imagem {
  id: string;
  src: ImageMetadata;
  alt: string;
  legenda: string | null;
  credito: string | null;
}

/**
 * Resolve um id do manifesto para uma imagem exibível.
 * Devolve null quando o asset é privado, não existe ou não tem alt —
 * assim uma pendência vira ausência silenciosa, nunca imagem quebrada.
 */
export function imagem(id: string): Imagem | null {
  const asset = porId.get(id);
  if (!asset || asset.publicUse !== true) return null;

  const chave = Object.keys(arquivosDeEvento).find(
    (caminho) => caminho.split('/').pop()?.replace(/\.[^.]+$/, '') === id,
  );
  if (!chave) return null;

  const alt = asset.alt?.trim();
  if (!alt) return null;

  return {
    id: asset.id,
    src: arquivosDeEvento[chave].default,
    alt,
    legenda: legendaPublica(asset.caption),
    credito: asset.credit?.trim() || null,
  };
}

/**
 * As legendas do manifesto terminam com a pasta de origem ("— pasta Projeto Scwepss"),
 * que serve à rastreabilidade interna e não ao visitante. O kit continua guardando o
 * nome original da pasta; aqui só a parte descritiva vai para a página.
 */
function legendaPublica(legenda: string | null | undefined): string | null {
  if (!legenda) return null;
  const descritiva = legenda.split(/\s+—\s+/)[0]?.trim();
  if (!descritiva) return null;
  return /[.!?]$/.test(descritiva) ? descritiva : `${descritiva}.`;
}

export interface EventoPublicado extends Omit<Evento, 'assetIds' | 'privateAssetIds'> {
  imagens: Imagem[];
}

/** Eventos que têm ao menos uma imagem liberada. Sem imagem, o registro não vai ao ar. */
export const eventosPublicados: EventoPublicado[] = eventos
  .map(({ assetIds, privateAssetIds: _privadas, ...resto }) => ({
    ...resto,
    imagens: assetIds.map(imagem).filter((i): i is Imagem => i !== null),
  }))
  .filter((evento) => evento.imagens.length > 0);

export const temEventos = eventosPublicados.length > 0;

export interface CasePublicado extends Omit<Case, 'assetIds' | 'missing'> {
  imagens: Imagem[];
}

/**
 * Um case só é publicado com status "publicado" e ao menos uma imagem real.
 * Rascunhos não geram rota nem card "em breve".
 */
export const casesPublicados: CasePublicado[] = cases
  .filter((c) => c.status === 'publicado')
  .map(({ assetIds, missing: _missing, ...resto }) => ({
    ...resto,
    imagens: assetIds.map(imagem).filter((i): i is Imagem => i !== null),
  }))
  .filter((c) => c.imagens.length > 0);

export const temCases = casesPublicados.length > 0;

/** Experiências em ordem cronológica inversa, HAOMA primeiro. Cargos nunca são fundidos. */
export const experiencias: Experiencia[] = [...perfil.experiences].sort((a, b) =>
  b.start.localeCompare(a.start),
);

export const anoCorrente = new Date().getFullYear();
