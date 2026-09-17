export interface Dicionario {
  meta: { titulo: string; descricao: string };
  navegacao: {
    atuacao: string; trajetoria: string; trabalhos: string; registros: string;
    sobre: string; contato: string; seccoesDaPagina: string; menu: string;
    pularParaConteudo: string;
  };
  controles: { temaEscuro: string; temaClaro: string; trocarIdioma: string; siglaIdioma: string };
  hero: {
    sobretitulo: string; titulo: string[]; apoio: string;
    ctaPrincipal: string; ctaPrincipalComCases: string; ctaSecundario: string;
  };
  atuacao: { rotulo: string; titulo: string; blocos: { nome: string; texto: string }[] };
  trajetoria: { rotulo: string; titulo: string; intro: string; atual: string };
  trabalhos: {
    rotulo: string; titulo: string; voltar: string; creditos: string;
    blocos: { contexto: string; objetivo: string; papel: string };
    listas: { processo: string; entregas: string; resultados: string };
  };
  registros: {
    rotulo: string; titulo: string; intro: string;
    ampliar: string; fechar: string; imagemAmpliada: string; foto: string;
  };
  sobre: {
    rotulo: string; titulo: string; paragrafos: string[]; fichaRotulo: string;
    rotulos: { formacao: string; competencias: string; ferramentas: string; idioma: string };
    conclusaoPrevista: string; curriculo: string; curriculoFormato: string; curriculoArquivo: string;
  };
  contato: { rotulo: string; titulo: string; texto: string };
  erro404: { titulo: string; texto: string; voltar: string; meta: string; descricao: string };
}
