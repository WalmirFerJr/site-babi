/**
 * Tradução do conteúdo que vem de perfil.json e eventos.json.
 *
 * Regra desta tradução: nada é acrescentado, reforçado nem arredondado. Os
 * números seguem idênticos ("mais de 50" vira "more than 50"), e as atribuições
 * continuam sendo de contribuição, não de autoria individual — "contribuindo
 * para a estratégia" vira "contributing to the strategy", nunca "grew".
 *
 * As chaves de experiência são "empresa|início", estáveis mesmo que o cargo mude.
 */

export const cargos: Record<string, string> = {
  'HAOMA|2026-07': 'Social Media Content Creator',
  'Digipix|2025-07': 'Marketing Assistant',
  'Digipix|2024-06': 'Marketing Intern',
  'Sorella Store|2022-03': 'E-commerce Assistant',
};

export const periodos: Record<string, string> = {
  'HAOMA|2026-07': 'Jul. 2026 - present',
  'Digipix|2025-07': 'Jul. 2025 - Jul. 2026',
  'Digipix|2024-06': 'Jun. 2024 - Jul. 2025',
  'Sorella Store|2022-03': 'Mar. 2022 - Apr. 2024',
};

export const palavrasChave: Record<string, string[]> = {
  'HAOMA|2026-07': ['Content', 'Campaigns', 'Creators', 'Performance'],
  'Digipix|2025-07': ['Social Media', 'Influencers', 'Content', 'Metrics'],
  'Digipix|2024-06': ['Content Marketing', 'Influencers', 'Social Media'],
  'Sorella Store|2022-03': ['Digital Marketing', 'Copywriting', 'KPIs'],
};

export const atividades: Record<string, string[]> = {
  'HAOMA|2026-07': [
    'I plan and produce digital content, developing concepts, copywriting, scripts and creative briefs, and following audiovisual productions from brief to approval.',
    'I build and manage the editorial calendar for institutional, commercial, editorial and product topics, connecting launches, campaigns and seasonal dates to brand positioning and social media strategy.',
    'I run influencer marketing, creator management and community management, aligning briefs and deliverables while tracking trends, reach, retention, engagement and community behaviour to produce reports, insights and content optimisations.',
  ],
  'Digipix|2025-07': [
    'I managed relationships with more than 50 influencers, aligning briefs, following deliverables and supporting content for influencer marketing campaigns.',
    'I planned, produced and published content for Instagram, TikTok, Facebook and LinkedIn, contributing to the content strategy and positioning of a brand profile that passed 1 million followers.',
    'I took part in planning large-scale digital campaigns such as Black Friday, with more than 1,000 pieces of content produced, developing editorial calendars and scripts with copywriting and storytelling.',
    'I analysed metrics and community interactions to guide adjustments to content and campaigns.',
  ],
  'Digipix|2024-06': [
    'I developed content for social media, blog and email marketing using Canva and Photoshop, applying CTR and retention techniques to improve engagement.',
    'I supported influencer prospecting, community management and performance tracking to generate learnings and adjustments for campaigns.',
  ],
  'Sorella Store|2022-03': [
    'I planned digital marketing campaigns and schedules, creating product content and copy for Instagram, TikTok and Facebook, and handling social media and audience relationships.',
    'I tracked goals, KPIs and content performance, and built reports and dashboards to support decisions on e-commerce, campaigns and optimisation.',
  ],
};

export const competencias: Record<string, string> = {
  'Estratégia e calendário de conteúdo': 'Content strategy and calendar',
  'Gestão de redes sociais': 'Social media management',
  'Comunicação de lançamentos': 'Launch communication',
  'Campanhas sazonais': 'Seasonal campaigns',
  'Copywriting e storytelling': 'Copywriting and storytelling',
  'Roteiros e direcionamento criativo': 'Scripts and creative direction',
  'Produção audiovisual e briefings': 'Audiovisual production and briefs',
  'Marketing de influência e gestão de creators': 'Influencer marketing and creator management',
  'Community management': 'Community management',
  'Posicionamento de marca': 'Brand positioning',
  'Análise de performance e KPIs': 'Performance analysis and KPIs',
  SEO: 'SEO',
};

export const ferramentas: Record<string, string> = {
  'Pacote Adobe': 'Adobe Suite',
  'Pacote Office': 'Microsoft Office',
  'Plataformas de agendamento': 'Social scheduling platforms',
};

export const idiomas: Record<string, { lingua: string; nivel: string }> = {
  Português: { lingua: 'Portuguese', nivel: 'native' },
  Inglês: { lingua: 'English', nivel: 'advanced' },
};

export const formacao = {
  degree: 'Bachelor in Advertising and Propaganda',
  institution: 'Universidade Anhembi Morumbi',
};

/** Conteúdo de eventos. Legendas e alt descrevem a imagem, sem atribuir autoria. */
export const eventos: Record<string, { titulo: string; tipo: string; dataLabel?: string; local?: string }> = {
  'influent-summit': {
    titulo: 'Influent Summit 2026',
    tipo: 'Event attendance',
    dataLabel: '24 and 25 June 2026',
    local: 'Expo Center Norte, São Paulo',
  },
  'projeto-scwepss': {
    titulo: 'Presentation and product records',
    tipo: 'Record of participation',
  },
};

export const legendas: Record<string, { alt: string; caption: string }> = {
  'retrato-principal': {
    alt: 'Portrait of Bárbara Fraquete.',
    caption: '',
  },
  'evento-1782411664005': {
    alt: 'Audience facing a stage and green panels at the Influent Summit.',
    caption: 'Record of attendance at the Influent Summit 2026.',
  },
  'evento-q123-sem-qr': {
    alt: 'Influent Summit 2026 Full Pass badge in the name of Bárbara Andrade, held in hand during the event.',
    caption: 'Influent Summit 2026 badge.',
  },
  'evento-1781136192015': {
    alt: 'Projected presentation and a table with items and products branded Schweppes.',
    caption: 'Record of a presentation.',
  },
  'evento-1781136196282': {
    alt: 'Arrangement with bottles, lemons and a foam package branded Schweppes.',
    caption: 'Record of a product arrangement.',
  },
  'evento-1781136196790': {
    alt: 'Table with glasses, lemons, bottles and a foam package with Schweppes branding.',
    caption: 'Detail of the arrangement.',
  },
  'evento-1781136198300': {
    alt: 'A hand applying foam to a glass, next to bottles and lemons.',
    caption: 'Record of a demonstration.',
  },
};
