/** Tipos do conteúdo do kit. Espelham conteudo/*.json e assets/manifest.json. */

export interface Experiencia {
  company: string;
  role: string;
  start: string;
  end: string | null;
  current?: boolean;
  period: string;
  dateStatus?: string;
  bullets: string[];
  /** Faixa curta de palavras-chave do cargo, vinda do currículo atualizado. */
  keywords?: string[];
  source?: string;
  /** Nota interna sobre números não confirmados. Nunca renderizada. */
  metricNote?: string;
}

export interface Formacao {
  institution: string;
  degree: string;
  start: string;
  expectedEnd: string;
  status: string;
}

export interface Curso {
  name: string;
  institution: string;
  year: string;
}

export interface Idioma {
  language: string;
  level: string;
  source?: string;
}

export interface Perfil {
  name: string;
  fullName: string;
  headline: string;
  summary: string;
  email: string;
  /** Só existe no kit. A cópia publicada não carrega o telefone; ele fica apenas no PDF. */
  phone?: string;
  location: string | null;
  linkedin: string | null;
  instagram: string | null;
  education: Formacao;
  experiences: Experiencia[];
  skills: string[];
  tools: string[];
  languages: Idioma[];
  selectedCourses: Curso[];
  provenance?: string;
}

/** `publicado` é o único status que gera rota e aparece na home. */
export type StatusCase = 'rascunho' | 'publicado';

export interface Case {
  slug: string;
  title: string;
  status: StatusCase | string;
  company: string;
  context: string | null;
  role: string | null;
  objective: string | null;
  period: string | null;
  process: string[];
  deliverables: string[];
  results: string[];
  credits: string[];
  assetIds: string[];
  /** Pendências de trabalho. Removidas na cópia publicada (ver scripts/sync-conteudo.mjs). */
  missing?: string[];
}

export interface Evento {
  slug: string;
  title: string;
  sourceFolder?: string;
  kind: string;
  year?: number;
  date: string | null;
  description: string;
  assetIds: string[];
  privateAssetIds?: string[];
  status: string;
  missing?: string[];
}

export interface Asset {
  id: string;
  path: string;
  type: 'decoration' | 'event-photo' | 'case-image' | 'portrait' | 'company-logo' | string;
  status: string;
  alt: string | null;
  caption?: string | null;
  credit: string | null;
  event?: string;
  date?: string | null;
  year?: number | null;
  barbaraRole?: string;
  width?: number;
  height?: number;
  /** Falso ou ausente = o arquivo não é copiado para o site. Ver scripts/sync-conteudo.mjs. */
  publicUse?: boolean;
  note?: string;
}

export interface Manifesto {
  version: number;
  receivedMedia: boolean;
  assets: Asset[];
  pendingSlots: { id: string; folder: string; type: string; company?: string; status: string }[];
}
