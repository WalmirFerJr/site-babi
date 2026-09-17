/**
 * Textos do site, transcritos de conteudo/textos-site.md.
 * Editar aqui muda a página sem tocar em componentes.
 * Não acrescentar afirmações que não estejam no kit.
 */

export const meta = {
  titulo: 'Bárbara Fraquete | Social media e conteúdo',
  descricao:
    'Conheça a trajetória de Bárbara Fraquete em conteúdo, redes sociais e marketing de influência, com atuação atual na HAOMA e experiências anteriores na Digipix e na Sorella Store.',
  idioma: 'pt-BR',
} as const;

export const hero = {
  sobretitulo: 'Social Media Content Creator',
  titulo: ['Conteúdo com intenção.', 'Marcas com conversa.'],
  apoio:
    'Conecto estratégia de conteúdo, campanhas e creators: do calendário editorial aos roteiros, produções e conversas com a comunidade.',
  // Troque por "Explore meus trabalhos" → /trabalhos quando houver case publicado.
  ctaPrincipal: { texto: 'Conheça minha trajetória', href: '#trajetoria' },
  ctaPrincipalComCases: { texto: 'Explore meus trabalhos', href: '#trabalhos' },
  ctaSecundario: { texto: 'Vamos conversar' },
} as const;

export const atuacao = {
  titulo: 'Entre a ideia e a conversa.',
  // Observação do kit: são áreas de atuação profissional, não pacotes de serviços.
  blocos: [
    {
      nome: 'Conteúdo e campanhas',
      texto:
        'Calendários estratégicos, conceitos, copys e roteiros que conectam lançamentos e datas sazonais ao posicionamento da marca.',
    },
    {
      nome: 'Direcionamento de produção',
      texto:
        'Briefings, referências e acompanhamento de foto e vídeo para transformar ideias em materiais coerentes com a campanha.',
    },
    {
      nome: 'Marketing de influência',
      texto:
        'Relacionamento com criadores, alinhamento de briefings e acompanhamento de entregas.',
    },
    {
      nome: 'Comunidade e análise',
      texto:
        'Escuta do público e acompanhamento de métricas para orientar os próximos conteúdos.',
    },
  ],
} as const;

export const trajetoria = {
  titulo: 'Onde venho construindo repertório.',
  intro: 'Experiências em marketing digital, conteúdo e relacionamento com o público.',
} as const;

export const trabalhos = {
  titulo: 'Ideias que foram para o mundo.',
} as const;

export const eventos = {
  titulo: 'Repertório também se constrói fora da tela.',
  intro: 'Registros de participação em eventos e projetos.',
} as const;

export const sobre = {
  titulo: 'Criatividade, contexto e curiosidade.',
  paragrafos: [
    'Sou Bárbara Fraquete, estudante de Publicidade e Propaganda na Universidade Anhembi Morumbi. Atuo como Social Media Content Creator na HAOMA, desenvolvendo calendários, conceitos, copys e roteiros, acompanhando produções e ações com creators.',
    'Minha experiência anterior na Digipix reúne relacionamento com mais de 50 influenciadores e participação em campanhas de grande escala. Gosto de conectar ideias, pessoas e objetivos de marca em cada etapa do trabalho.',
  ],
  // A linha de formação é montada a partir de perfil.json (education), para não divergir do currículo.
  rotulos: {
    ferramentas: 'Ferramentas',
    idioma: 'Idioma',
    formacao: 'Formação',
  },
  curriculo: {
    texto: 'Baixar currículo',
    href: '/curriculo/barbara-fraquete.pdf',
    complemento: 'PDF',
  },
} as const;

export const contato = {
  titulo: 'Vamos conversar sobre a próxima ideia?',
  texto: 'Para conversar sobre experiências, projetos e oportunidades profissionais.',
} as const;

/** Ordem espelha a ordem das seções na home. Itens condicionais somem se não houver material. */
export const navegacao = [
  { rotulo: 'Atuação', href: '#atuacao' },
  { rotulo: 'Trajetória', href: '#trajetoria' },
  { rotulo: 'Trabalhos', href: '#trabalhos', dependeDeCases: true },
  { rotulo: 'Registros', href: '#registros', dependeDeEventos: true },
  { rotulo: 'Sobre', href: '#sobre' },
  { rotulo: 'Contato', href: '#contato' },
] as const;
