# Site-portfólio da Bárbara Fraquete

Site estático em **Astro + TypeScript + CSS**, sem backend, banco, CMS ou analytics.
Conteúdo e apresentação são separados: os textos e dados ficam em `src/data/`, os
componentes só desenham o que recebem.

---

## Rodar e publicar

```bash
npm install
npm run dev
```

Abre em <http://localhost:4321>.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor local com recarga automática |
| `npm run build` | Verifica os tipos e gera o site em `dist/` |
| `npm run preview` | Serve `dist/` para conferir o resultado do build |
| `npm test` | Roda as regras de publicação contra `dist/` (rode o build antes) |
| `npm run sync:conteudo` | Traz conteúdo e imagens do kit para dentro de `site/` |
| `npm run check` | Só a verificação de tipos |

### Subir na Vercel

O repositório <https://github.com/WalmirFerJr/site-babi> contém **apenas o site**, com
este `package.json` na raiz. A Vercel detecta Astro sozinha: build `npm run build`,
saída `dist`, nenhuma pasta raiz a configurar.

1. Importe o repositório na Vercel e aceite o que ela detectar.
2. Confira o endereço público (veja o aviso abaixo) e, se for diferente do padrão,
   crie a variável de ambiente **`SITE_URL`** com o endereço final.

> **Atenção ao endereço.** O currículo atualizado aponta para
> `https://www.barbarafraquete.vercel.app`, mas o subdomínio **`www.` não funciona em
> domínios `*.vercel.app`**: a Vercel serve apenas `<projeto>.vercel.app`. Por isso o
> padrão configurado em `astro.config.mjs` é **`https://barbarafraquete.vercel.app`**,
> sem `www`. Decida qual é o endereço final e acerte os dois lados — o currículo e a
> `SITE_URL` —, senão o link do PDF leva a lugar nenhum e as tags canônicas apontam
> para um endereço que não existe.

O endereço habilita `<link rel="canonical">`, `og:url` e a URL absoluta da imagem
social. Definir `SITE_URL` no painel da Vercel tem prioridade sobre o padrão do arquivo.

---

## Onde editar cada coisa

### Textos da página

`src/data/textos.ts` — títulos, chamadas, rótulos e os blocos de "Atuação". É um arquivo
TypeScript comum: mudar uma frase ali muda a página, sem tocar em componente nenhum.

### Dados de carreira

`src/data/perfil.json` — experiências, formação, competências, ferramentas, idiomas,
e-mail. A trajetória do site é montada a partir daqui, em ordem cronológica inversa
(a experiência com `"current": true` aparece primeiro).

### Cases e eventos

`src/data/cases.json` e `src/data/eventos.json`.

### Imagens

`src/assets/eventos/` (otimizadas no build) e `src/data/manifest.json` (legendas, textos
alternativos e permissão de uso).

> **Fonte de verdade e privacidade.** Esses arquivos são cópias filtradas do kit
> (`../conteudo/`, `../assets/`, `../curriculo/`), que **não faz parte deste repositório**
> e vive só na máquina de quem edita o conteúdo. Rodar `npm run sync:conteudo` com o kit
> por perto traz tudo de novo e **sobrescreve** `src/data/`. Sem o kit, o script avisa e
> para: o site é autocontido e não depende dele para funcionar.
>
> A sincronização **descarta** os campos que existem só para o controle do trabalho e que
> o site nunca renderiza: `missing`, `dateStatus`, `source`, `metricNote`, `provenance`,
> `phone` e `originalPath`. O motivo é este repositório ser público — deixados ali, eles
> virariam texto pesquisável ao lado do nome da Bárbara. Quem procurasse por ela acharia
> "Separar entregas de Bárbara das entregas da equipe" com a mesma facilidade com que
> acha o site. O telefone segue apenas dentro do PDF, e caminhos locais do computador não
> saem da máquina. Um teste verifica isso a cada build.
>
> Escolha um caminho e siga nele: editar o kit e sincronizar, ou editar direto em
> `src/data/` e parar de sincronizar.

---

## Regras de publicação embutidas no código

Não são convenções de documentação: estão implementadas e cobertas por teste.

1. **Imagem com `"publicUse": false` nunca sai do kit.** `scripts/sync-conteudo.mjs` se
   recusa a copiá-la, e `src/data/conteudo.ts` se recusa a exibi-la. Hoje isso protege
   `q123.jpeg`, o crachá com QR code do Influent Summit: ele não está em `src/`, não está
   em `dist/` e não aparece em lugar nenhum do site.
2. **Case só aparece com `"status": "publicado"` e ao menos uma imagem real.** Rascunho
   não vira card "em breve", não gera rota e não entra na navegação. Hoje os quatro cases
   são rascunho, então a seção "Trabalhos" não existe na página — e a home continua
   fechando bem sem ela.
3. **Seções sem material somem inteiras**, e a numeração editorial (01, 02, 03…) é
   recalculada sobre o que realmente aparece, para não parecer que falta uma seção.
4. **Nenhum rótulo de pendência chega ao visitante.** Campos internos (`missing`,
   `dateStatus`, `provenance`) são lidos, mas nunca renderizados.
5. **Telefone só no PDF.** A página mostra apenas o e-mail. Não há WhatsApp, endereço,
   localização, LinkedIn nem Instagram, porque esses dados não foram informados.
6. **Legendas neutras.** As legendas do manifesto terminam com a pasta de origem
   ("— pasta Projeto Scwepss"), útil para rastreabilidade interna e não para o visitante.
   O site publica só a parte descritiva. A marca visível nas fotos é descrita no texto
   alternativo, como manda a acessibilidade, mas **não** aparece como cliente, empregadora
   ou autoria em nenhum texto visível.
7. **Contato por `mailto:`**, sem formulário — nada é simulado como "enviado".
8. **Número simulado não entra.** Ver a seção seguinte.

---

## Números: o que entrou e o que ficou de fora

O currículo atualizado (LaTeX) trouxe métricas para a HAOMA. O próprio arquivo as
declara simuladas, no comentário do cabeçalho e no bloco de macros:

```latex
% METRICAS SIMULADAS DA HAOMA - SUBSTITUIR POR DADOS COMPROVAVEIS
\newcommand{\QuantidadeCampanhas}{8}
\newcommand{\QuantidadeConteudos}{120}
\newcommand{\ReducaoRetrabalho}{22\%}
```

**Ficaram de fora do site:**

| Número | Por quê |
| --- | --- |
| 8 campanhas e lançamentos | Marcado como simulado no `.tex` e em `conteudo/SIMULACOES-NAO-PUBLICAR.md` |
| mais de 120 conteúdos | Idem |
| 22% de redução de retrabalho | Idem — "retrabalho" aparece nas simulações como *pergunta a investigar*, não como resultado medido |
| +200% de crescimento do perfil (Digipix) | Ganho percentual sem fonte, que **substituiria** o marco de 1 milhão de seguidores dos currículos originais. Mantida a formulação com fonte |

**Entrou, porque tem origem nos currículos:** mais de 50 influenciadores, mais de 1.000
conteúdos em campanhas de grande escala e o perfil que ultrapassou 1 milhão de
seguidores — sempre com o contexto de contribuição, nunca como autoria individual.

**Também entrou, do currículo atualizado:** competências de SEO, análise de performance,
KPIs, posicionamento de marca, gestão de creators e community management; mLabs nas
ferramentas; português nativo; "Bacharelado" na formação; e a faixa de palavras-chave de
cada cargo na trajetória.

Dois testes protegem isso: um varre o HTML publicado, outro **abre o PDF** e procura os
mesmos termos lá dentro.

### ⚠ O PDF disponível para download está desatualizado

`public/curriculo/barbara-fraquete.pdf` ainda é a versão **anterior** do currículo:
sem SEO, sem mLabs, sem o link do portfólio. Para atualizar:

1. Compile o `.tex` novo (com `resume.cls` na mesma pasta, pdfLaTeX).
2. **Antes de compilar, troque as três macros simuladas** por dados comprováveis — ou
   remova as frases que as usam. Elas são o motivo do aviso no topo do próprio arquivo.
3. Substitua `curriculo/barbara-fraquete.pdf` no kit e rode `npm run sync:conteudo`.
4. `npm run build && npm test` — o teste do PDF reprova se algum número simulado tiver
   ido junto.

Isso importa porque o PDF é um binário opaco: sem esse teste, um número simulado entraria
no site pelo botão "Baixar currículo", passando por fora de todas as outras verificações.

---

## Quando chegar material novo

### Retrato

1. Coloque o arquivo em `assets/fotos/` no kit (mínimo 1600 px no lado maior).
2. Registre no `manifest.json` usando o `entryTemplate`, com `"type": "portrait"`,
   `"publicUse": true`, `alt` e crédito.
3. `npm run sync:conteudo`.
4. Em `src/components/Hero.astro`, troque o bloco `<svg class="hero__composicao">` por um
   `<Picture>` apontando para a imagem. O comentário no arquivo marca o lugar exato.
   O mesmo vale para o retrato secundário em `src/components/Sobre.astro`.

### Logos das empresas

Hoje HAOMA, Digipix e Sorella Store aparecem **em texto** na trajetória, como previsto:
logo real só depois de receber o arquivo oficial. Ao receber, cadastre em
`manifest.json` com `"type": "company-logo"` e troque `.trajetoria__empresa` por uma
imagem com área de respiro.

### Publicar um case

Em `cases.json`: preencha `context`, `role`, `process`, `deliverables`, `results` e
`credits`, aponte `assetIds` para imagens reais já cadastradas no manifesto e mude
`status` para `"publicado"`. A partir daí, sozinho:

- a seção "Trabalhos" aparece na home, com o primeiro case em destaque;
- a rota `/trabalhos/<slug>` é gerada;
- "Trabalhos" entra na navegação;
- o botão principal do hero passa de "Conheça minha trajetória" para
  "Explore meus trabalhos".

Isso foi verificado publicando um case de teste e conferindo a rota gerada.

---

## O que ainda falta de material

Nada disso aparece como pendência no site — as seções simplesmente não existem ainda.

Os caminhos `assets/…` e `conteudo/…` abaixo são do **kit**, na máquina local, não deste
repositório.

| Falta | Para quê | Onde entra |
| --- | --- | --- |
| Retrato editorial | Área visual do hero e coluna do "Sobre" | `assets/fotos/` |
| Logos de HAOMA, Digipix e Sorella Store | Trajetória com marca, em vez de só texto | `assets/logos/` |
| Peças de campanha com autoria identificada | Primeiro case publicável | `assets/cases/` |
| Contexto do "Projeto Scwepss" | Nome oficial, data, natureza e papel da Bárbara — hoje a legenda é neutra de propósito | `conteudo/eventos.json` |
| Data e crédito das fotos do Influent Summit | Legenda completa | `assets/manifest.json` |
| Confirmação do ano de entrada na HAOMA | Hoje 2026 é hipótese; se mudar, **toda a cronologia** muda junto (ver `conteudo/revisao-e-fontes.md`) | `conteudo/perfil.json` |
| Confirmar o endereço final (com ou sem `www`) | `canonical`, `og:url` e o link impresso no currículo | `astro.config.mjs` ou `SITE_URL` |
| PDF recompilado, sem os números simulados | Botão "Baixar currículo" | `curriculo/barbara-fraquete.pdf` |
| Dados reais para as métricas da HAOMA | Substituir as simulações por evidência | `conteudo/perfil.json` |

Também continuam em aberto, e por isso fora do site: identificação do perfil que
ultrapassou 1 milhão de seguidores, recorte temporal das campanhas e separação entre o
que foi entrega individual e entrega de equipe.

---

## O que foi validado, e como

Validado rodando de fato, não por inspeção de código:

- **Build e tipos** — `astro check` com 0 erros, 0 avisos; build completo sem erro.
- **Rotas** — geradas: `/`, `/404`. Nenhuma rota de rascunho. A rota de case foi
  verificada publicando um case temporário e depois revertendo.
- **Contraste WCAG AA** — todo elemento com texto visível teve a razão de contraste
  calculada contra o fundo efetivo, a 1280 px e a 360 px: **0 reprovações** em 130 e 126
  elementos, já com o conteúdo atualizado. Três combinações foram corrigidas nesse
  processo, todas terracota sobre creme (3,76:1) em texto pequeno.
- **Responsividade** — 360, 640, 768 e 1440 px sem rolagem horizontal e sem elemento
  estourando o contêiner. 640 px equivale a zoom de 200% em 1280 px.
- **Estrutura** — exatamente um `<h1>`, hierarquia de títulos sem saltos
  (h1 → h2 → h3), um `main`, um `footer`, um `nav`, e nenhuma imagem sem `alt`.
- **Teclado e menu** — o menu móvel abre, fecha ao clicar num link, fecha com Escape e
  devolve o foco ao botão; `aria-expanded` acompanha o estado.
- **Ampliação de imagem** — abre em `<dialog>` modal, fecha pelo botão, pelo fundo e pelo
  Escape, e em todos os caminhos devolve o foco à foto de origem e limpa o conteúdo.
- **Sem JavaScript** — o botão de menu e os botões de ampliar são servidos com `hidden` e
  só são habilitados pelo script. Sem JS, a navegação vira uma lista rolável e a galeria,
  imagens comuns. Nenhum conteúdo depende de script, hover ou animação.
- **Download do currículo** — o link responde 200, `application/pdf`, 20 168 bytes, com
  assinatura `%PDF-` conferida.
- **Imagens** — 5 fotos publicadas, todas com `width`/`height`, `loading="lazy"`, AVIF e
  WebP. Nenhuma imagem remota. O crachá não existe em `src/` nem em `dist/`, verificado
  por comparação de conteúdo byte a byte.
- **Fontes** — Space Grotesk e Inter (ambas SIL OFL 1.1) são baixadas no build e servidas
  do próprio domínio, em 3 arquivos (68 KB). Nenhuma requisição a terceiros em tempo de
  execução.

### Limites desta validação

- **Um único motor de renderização.** Tudo foi conferido em um navegador Chromium. Não
  houve teste em Firefox, Safari, iOS ou Android reais.
- **`prefers-reduced-motion` foi conferido no CSS gerado**, não acionando a preferência no
  sistema operacional: as regras estão lá (`--duration: 0s`, transições e animações
  reduzidas a 0,01 ms, `scroll-behavior: auto`), mas o efeito não foi observado na tela.
- **Escape e foco foram exercitados por evento disparado no próprio DOM**, porque o
  navegador usado no teste não entregava teclas sintéticas à página. Por isso a tecla é
  tratada explicitamente no código, além do comportamento nativo do `<dialog>`, e a
  retenção de foco se apoia em `showModal()` (confirmado com `:modal`).
- **Nenhum leitor de tela foi usado.** A verificação de acessibilidade foi estrutural e de
  contraste, não de experiência com tecnologia assistiva.
- **Nenhuma medição de desempenho** (Lighthouse, Core Web Vitals) foi feita.
- **Nenhuma revisão de texto por falante nativo** além do conteúdo fornecido no kit.

---

## Estrutura

```
site/
├── astro.config.mjs        Astro, fontes auto-hospedadas, SITE_URL opcional
├── vercel.json             Build e cache para o deploy estático
├── scripts/
│   └── sync-conteudo.mjs   Kit → site, aplicando a regra de publicUse
├── testes/
│   └── publicacao.test.mjs 15 testes das regras de publicação (inclui o PDF)
├── public/                 Servido como está: PDF, favicon, imagem social, robots
└── src/
    ├── assets/             Imagens processadas no build (5 fotos + decoração)
    ├── components/         Header, Hero, Atuacao, Trajetoria, TrabalhosSelecionados,
    │                       GaleriaEventos, Sobre, Contato, Rodape, e auxiliares
    ├── data/               Conteúdo, tipos e a camada única de leitura (conteudo.ts)
    ├── layouts/Base.astro  <head>, metadados, fontes, skip link
    ├── pages/              index.astro, trabalhos/[slug].astro, 404.astro
    └── styles/             tokens.css (paleta e escala) e global.css
```
