/**
 * Testes das regras de publicação — só do que pode realmente falhar em silêncio.
 * Rodam contra dist/, ou seja, contra o que um visitante receberia de fato.
 *
 *   npm run build && npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(siteDir, 'dist');
const kit = path.resolve(siteDir, '..');

assert.ok(existsSync(dist), 'rode "npm run build" antes dos testes');

const perfil = JSON.parse(await readFile(path.join(siteDir, 'src/data/perfil.json'), 'utf8'));
const cases = JSON.parse(await readFile(path.join(siteDir, 'src/data/cases.json'), 'utf8'));
const manifesto = JSON.parse(await readFile(path.join(siteDir, 'src/data/manifest.json'), 'utf8'));

async function arquivos(dir) {
  const encontrados = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const caminho = path.join(dir, entrada.name);
    if (entrada.isDirectory()) encontrados.push(...(await arquivos(caminho)));
    else encontrados.push(caminho);
  }
  return encontrados;
}

const todosOsArquivos = await arquivos(dist);
const htmls = todosOsArquivos.filter((f) => f.endsWith('.html'));
const htmlJunto = (await Promise.all(htmls.map((f) => readFile(f, 'utf8')))).join('\n');

test('imagem com publicUse falso nunca é publicada', async () => {
  const privadas = manifesto.assets.filter((a) => a.type === 'event-photo' && a.publicUse !== true);
  assert.ok(privadas.length > 0, 'o manifesto precisa ter ao menos uma imagem privada para este teste valer');

  for (const asset of privadas) {
    // Comparação exata: um derivado publicável ("evento-q123-sem-qr") tem o id do
    // original como prefixo, e um "startsWith" o acusaria por engano.
    const semExtensao = (f) => path.basename(f).replace(/\.[^.]+$/, '');
    const noProjeto = (await arquivos(path.join(siteDir, 'src/assets'))).filter(
      (f) => semExtensao(f) === asset.id,
    );
    assert.deepEqual(noProjeto, [], `${asset.id} não deveria estar em src/assets/`);

    const referencia = new RegExp(`${asset.id}(?![\\w-])`);
    assert.ok(!referencia.test(htmlJunto), `${asset.id} é referenciado no HTML publicado`);

    // Com o kit por perto, a verificação é mais forte: comparação byte a byte,
    // que pega o arquivo mesmo renomeado ou reprocessado. Sem o kit (clone só do
    // site, build na Vercel), ficam valendo as duas checagens acima.
    const origem = path.join(kit, asset.path);
    if (!existsSync(origem)) continue;

    const conteudo = await readFile(origem);
    for (const arquivo of todosOsArquivos) {
      const info = await stat(arquivo);
      if (info.size !== conteudo.length) continue;
      const publicado = await readFile(arquivo);
      assert.ok(!publicado.equals(conteudo), `${asset.id} vazou para ${path.relative(dist, arquivo)}`);
    }
  }
});

test('case em rascunho não gera rota nem link', () => {
  const rascunhos = cases.filter((c) => c.status !== 'publicado');
  assert.ok(rascunhos.length > 0, 'este teste pressupõe rascunhos no kit');

  for (const rascunho of rascunhos) {
    assert.ok(
      !existsSync(path.join(dist, 'trabalhos', rascunho.slug)),
      `rascunho ${rascunho.slug} gerou rota`,
    );
    assert.ok(
      !htmlJunto.includes(`/trabalhos/${rascunho.slug}`),
      `rascunho ${rascunho.slug} virou link`,
    );
  }
});

test('sem case publicado, a seção Trabalhos não existe — nem vazia, nem "em breve"', () => {
  const publicados = cases.filter((c) => c.status === 'publicado');
  if (publicados.length > 0) return; // com case publicado a seção deve existir; ver teste acima
  assert.ok(!htmlJunto.includes('id="trabalhos"'), 'a seção Trabalhos ficou na página sem conteúdo');
  assert.ok(!/href="\/trabalhos\//.test(htmlJunto), 'há link para uma rota de case inexistente');
});

test('telefone fica só no PDF, nunca na página nem nos dados publicados', () => {
  assert.ok(!('phone' in perfil), 'o telefone não deveria estar em src/data/perfil.json');
  assert.ok(htmlJunto.includes(perfil.email), 'o e-mail deveria aparecer');

  // O número é lido de dentro do PDF — o único lugar onde ele pode estar.
  let texto;
  try {
    texto = execFileSync('pdftotext', ['-layout', path.join(dist, 'curriculo/barbara-fraquete.pdf'), '-'], {
      encoding: 'utf8',
    });
  } catch {
    return;
  }
  const telefone = texto.match(/\(\d{2}\)\s?\d{4,5}-?\d{4}/)?.[0];
  assert.ok(telefone, 'não achei o telefone no PDF; o teste perderia o sentido');

  const digitos = telefone.replace(/\D/g, '');
  assert.ok(!htmlJunto.includes(telefone), 'telefone formatado apareceu no HTML');
  assert.ok(!htmlJunto.replace(/\D/g, '').includes(digitos), 'telefone apareceu no HTML');
});

test('campo de controle interno não é publicado nem nos dados do site', () => {
  const bruto = [
    JSON.stringify(perfil),
    JSON.stringify(cases),
    JSON.stringify(manifesto),
  ].join('\n');

  for (const campo of ['missing', 'dateStatus', 'provenance', 'metricNote', 'originalPath', 'phone']) {
    assert.ok(!bruto.includes(`"${campo}"`), `campo interno "${campo}" ficou em src/data/`);
  }
  // O repositório é público: caminhos locais e pendências não podem virar texto pesquisável.
  assert.ok(!bruto.includes('/home/'), 'caminho local do computador ficou nos dados publicados');
});

test('nenhum campo de controle interno chega ao visitante', () => {
  const vazamentos = [
    'rascunho',
    'a confirmar',
    'dateStatus',
    'provenance',
    'pendente',
    'em breve',
    'SIMULA',
    'NAO-PUBLICAR',
    'referencias-privadas',
  ];
  for (const termo of vazamentos) {
    assert.ok(
      !htmlJunto.toLowerCase().includes(termo.toLowerCase()),
      `termo interno "${termo}" apareceu no HTML público`,
    );
  }
});

test('número simulado nunca chega ao site', () => {
  // O currículo em LaTeX marca estes três como SIMULADOS no próprio arquivo,
  // e conteudo/SIMULACOES-NAO-PUBLICAR.md descreve os cenários fictícios.
  // Nenhum deles pode aparecer como realização da Bárbara.
  const simulados = [
    '8 campanhas',
    '120 conteúdos',
    '22%',
    'retrabalho',
    '+200%',
    '200%',
    '93,75%',
    '94,4%',
    '32 peças',
    '12 creators',
    '36 entregas',
  ];
  for (const termo of simulados) {
    assert.ok(!htmlJunto.includes(termo), `número/termo simulado no HTML: "${termo}"`);
  }

  // Os números com fonte continuam presentes, na formulação do kit.
  assert.ok(htmlJunto.includes('mais de 50 influenciadores'));
  assert.ok(htmlJunto.includes('1 milhão de seguidores'));
  assert.ok(htmlJunto.includes('1.000 conteúdos'));
});

test('legenda pública não expõe a pasta de origem', () => {
  assert.ok(!htmlJunto.includes('pasta Projeto'), 'a legenda interna de rastreabilidade vazou');
  // O conteúdo descritivo da legenda continua presente.
  assert.ok(htmlJunto.includes('Registro de apresentação'), 'a legenda descritiva sumiu');
});

test('Schweppes aparece só na descrição das fotos, nunca como vínculo', () => {
  const empresas = perfil.experiences.map((e) => e.company);
  assert.ok(!empresas.includes('Schweppes'));

  // A marca é visível nas imagens, então descrevê-la no alt é correto e necessário.
  // O que não pode é aparecer no texto corrido, em título ou em legenda visível.
  const semAtributos = htmlJunto
    .replace(/alt="[^"]*"/g, '')
    .replace(/data-alt="[^"]*"/g, '')
    // rótulos acessíveis do botão de ampliar também derivam do alt
    .replace(/<span class="visualmente-oculto"[^>]*>[\s\S]*?<\/span>/g, '');
  assert.ok(
    !semAtributos.includes('Schweppes'),
    'a marca vazou para o conteúdo visível, fora da descrição das imagens',
  );
});

test('só o PDF do currículo é publicado', () => {
  const curriculos = todosOsArquivos.filter((f) => /curriculo/i.test(f));
  assert.deepEqual(
    curriculos.map((f) => path.basename(f)),
    ['barbara-fraquete.pdf'],
  );
  for (const extensao of ['.tex', '.cls', '.md']) {
    assert.ok(
      !todosOsArquivos.some((f) => f.endsWith(extensao)),
      `arquivo ${extensao} não deveria ser publicado`,
    );
  }
});

test('o PDF oferecido para download não carrega número simulado', () => {
  // O site publica o currículo como PDF — um binário opaco, que passaria por
  // fora de todas as outras verificações. Este teste olha dentro dele.
  const pdf = path.join(dist, 'curriculo/barbara-fraquete.pdf');
  assert.ok(existsSync(pdf), 'o PDF do currículo deveria estar publicado');

  let texto;
  try {
    texto = execFileSync('pdftotext', ['-layout', pdf, '-'], { encoding: 'utf8' });
  } catch {
    // Sem pdftotext (CI enxuto, por exemplo) não dá para inspecionar: não reprova.
    return;
  }

  for (const termo of ['8 campanhas', '120 conteúdos', 'retrabalho', '+200%', '200%']) {
    assert.ok(
      !texto.includes(termo),
      `o PDF publicado contém "${termo}", marcado como simulado. ` +
        'Substitua por dado comprovável antes de publicar este currículo.',
    );
  }
});

test('HAOMA é o vínculo atual e vem primeiro na trajetória', () => {
  const atual = perfil.experiences.filter((e) => e.current);
  assert.equal(atual.length, 1);
  assert.equal(atual[0].company, 'HAOMA');
  assert.equal(atual[0].role, 'Social Media Content Creator');

  const posHaoma = htmlJunto.indexOf('HAOMA');
  const posDigipix = htmlJunto.indexOf('Digipix');
  assert.ok(posHaoma > -1 && posDigipix > -1);
  assert.ok(posHaoma < posDigipix, 'HAOMA deveria aparecer antes da Digipix');
});

test('os dois cargos na Digipix continuam distintos', () => {
  const digipix = perfil.experiences.filter((e) => e.company === 'Digipix');
  assert.equal(digipix.length, 2);
  for (const vinculo of digipix) {
    assert.ok(htmlJunto.includes(vinculo.role), `cargo ausente: ${vinculo.role}`);
  }
});

test('toda imagem publicada tem alt e dimensões declaradas', () => {
  // O <img> do visor nasce sem src: é um molde preenchido ao ampliar uma foto.
  const imgs = (htmlJunto.match(/<img[^>]*>/g) ?? []).filter((img) => /src="[^"]+"/.test(img));
  assert.ok(imgs.length >= 5, 'as cinco fotos liberadas deveriam estar na página');
  for (const img of imgs) {
    assert.match(img, /alt="[^"]+"/, `img sem alt: ${img.slice(0, 90)}`);
    assert.match(img, /width="\d+"/, `img sem width: ${img.slice(0, 90)}`);
    assert.match(img, /height="\d+"/, `img sem height: ${img.slice(0, 90)}`);
  }
});

test('nenhuma imagem remota é carregada', () => {
  const remotas = htmlJunto.match(/<img[^>]+src="https?:\/\/[^"]*"/g) ?? [];
  assert.deepEqual(remotas, []);
});
