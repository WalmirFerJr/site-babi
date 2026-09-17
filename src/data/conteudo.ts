/**
 * Camada única de leitura do conteúdo, agora por idioma.
 * Componentes consomem daqui; ninguém importa JSON solto.
 *
 * Regras de publicação aplicadas neste arquivo:
 * - case só aparece (e só gera rota) com status "publicado" E imagem real;
 * - imagem só aparece se publicUse === true e se o arquivo existir em src/assets;
 * - campos internos não chegam ao visitante (já removidos em src/data pelo sync).
 */
import type { Asset, Case, Evento, Experiencia, Manifesto, Perfil } from './types';
import type { Idioma } from '../i18n/idiomas';
import * as EN from '../i18n/conteudo-en';
import perfilJson from './perfil.json';
import casesJson from './cases.json';
import eventosJson from './eventos.json';
import manifestoJson from './manifest.json';

export const perfil = perfilJson as Perfil;
const cases = casesJson as Case[];
const eventos = eventosJson as Evento[];
const manifesto = manifestoJson as unknown as Manifesto;

const arquivosDeEvento = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/eventos/*.{jpeg,jpg,png,webp,avif}',
  { eager: true },
);
const arquivosDeFoto = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/fotos/*.{jpeg,jpg,png,webp,avif}',
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

/**
 * Resolve um id do manifesto para uma imagem exibível.
 * Devolve null quando o asset é privado, não existe ou não tem alt —
 * assim uma pendência vira ausência silenciosa, nunca imagem quebrada.
 */
export function imagem(id: string, idioma: Idioma = 'pt'): Imagem | null {
  const asset = porId.get(id);
  if (!asset || asset.publicUse !== true) return null;

  const arquivos = asset.type === 'portrait' ? arquivosDeFoto : arquivosDeEvento;
  const chave = Object.keys(arquivos).find(
    (caminho) => caminho.split('/').pop()?.replace(/\.[^.]+$/, '') === id,
  );
  if (!chave) return null;

  const traducao = idioma === 'en' ? EN.legendas[id] : undefined;
  const alt = (traducao?.alt ?? asset.alt)?.trim();
  if (!alt) return null;

  return {
    id: asset.id,
    src: arquivos[chave]!.default,
    alt,
    legenda: traducao ? traducao.caption.trim() || null : legendaPublica(asset.caption),
    credito: asset.credit?.trim() || null,
  };
}

export interface EventoPublicado {
  slug: string;
  title: string;
  kind: string;
  dateLabel?: string;
  location?: string;
  imagens: Imagem[];
}

/** Eventos que têm ao menos uma imagem liberada. Sem imagem, o registro não vai ao ar. */
export function obterEventos(idioma: Idioma): EventoPublicado[] {
  return eventos
    .map((evento) => {
      const t = idioma === 'en' ? EN.eventos[evento.slug] : undefined;
      return {
        slug: evento.slug,
        title: t?.titulo ?? evento.title,
        kind: t?.tipo ?? evento.kind,
        dateLabel: t?.dataLabel ?? evento.dateLabel,
        location: t?.local ?? evento.location,
        imagens: evento.assetIds
          .map((id) => imagem(id, idioma))
          .filter((i): i is Imagem => i !== null),
      };
    })
    .filter((evento) => evento.imagens.length > 0);
}

export interface CasePublicado extends Omit<Case, 'assetIds' | 'missing'> {
  imagens: Imagem[];
}

/**
 * Um case só é publicado com status "publicado" e ao menos uma imagem real.
 * Rascunhos não geram rota nem card "em breve".
 */
export function obterCases(idioma: Idioma = 'pt'): CasePublicado[] {
  return cases
    .filter((c) => c.status === 'publicado')
    .map(({ assetIds, missing: _missing, ...resto }) => ({
      ...resto,
      imagens: assetIds.map((id) => imagem(id, idioma)).filter((i): i is Imagem => i !== null),
    }))
    .filter((c) => c.imagens.length > 0);
}

export const temCases = obterCases().length > 0;
export const temEventos = obterEventos('pt').length > 0;

export interface ExperienciaExibida {
  company: string;
  role: string;
  period: string;
  current: boolean;
  keywords: string[];
  bullets: string[];
  agrupada: boolean;
}

/**
 * Experiências em ordem cronológica inversa, HAOMA primeiro.
 * Os dois cargos na Digipix permanecem distintos: a repetição do empregador
 * muda apenas o agrupamento visual.
 */
export function obterExperiencias(idioma: Idioma): ExperienciaExibida[] {
  const ordenadas: Experiencia[] = [...perfil.experiences].sort((a, b) =>
    b.start.localeCompare(a.start),
  );

  return ordenadas.map((e, indice) => {
    const chave = `${e.company}|${e.start}`;
    const en = idioma === 'en';
    return {
      company: e.company,
      role: (en && EN.cargos[chave]) || e.role,
      period: (en && EN.periodos[chave]) || e.period,
      current: e.current === true,
      keywords: (en && EN.palavrasChave[chave]) || e.keywords || [],
      bullets: (en && EN.atividades[chave]) || e.bullets,
      agrupada: indice > 0 && ordenadas[indice - 1]!.company === e.company,
    };
  });
}

export function obterCompetencias(idioma: Idioma): string[] {
  return idioma === 'en' ? perfil.skills.map((s) => EN.competencias[s] ?? s) : perfil.skills;
}

export function obterFerramentas(idioma: Idioma): string[] {
  return idioma === 'en' ? perfil.tools.map((f) => EN.ferramentas[f] ?? f) : perfil.tools;
}

export function obterIdiomas(idioma: Idioma): string {
  return perfil.languages
    .map((i) => {
      const t = idioma === 'en' ? EN.idiomas[i.language] : undefined;
      return t ? `${t.lingua} ${t.nivel}` : `${i.language} ${i.level.toLowerCase()}`;
    })
    .join(' · ');
}

export function obterFormacao(idioma: Idioma, conclusaoPrevista: string): string {
  const { degree, institution, expectedEnd } = perfil.education;
  const d = idioma === 'en' ? EN.formacao.degree : degree;
  const i = idioma === 'en' ? EN.formacao.institution : institution;
  return `${d} · ${i} · ${conclusaoPrevista} ${expectedEnd.slice(0, 4)}.`;
}

/**
 * Retrato principal. Enquanto não houver arquivo cadastrado no manifesto com
 * publicUse true, devolve null — e o hero usa a composição abstrata, sem foto
 * genérica e sem silhueta fictícia.
 */
export function obterRetrato(idioma: Idioma = 'pt'): Imagem | null {
  const asset = manifesto.assets.find((a) => a.type === 'portrait' && a.publicUse === true);
  return asset ? imagem(asset.id, idioma) : null;
}

export const anoCorrente = new Date().getFullYear();
