#!/usr/bin/env node
/**
 * Sincroniza o conteúdo do kit (../conteudo, ../assets, ../curriculo) para dentro de site/.
 *
 * Por que existe: o site precisa ser autocontido para ir ao ar sozinho (Vercel),
 * mas a fonte de verdade do conteúdo continua sendo o kit. Rode este script
 * sempre que editar os arquivos do kit.
 *
 *   npm run sync:conteudo
 *
 * Regras aplicadas aqui, e não na confiança do desenvolvedor:
 * - imagens com publicUse !== true NUNCA são copiadas (ex.: crachá com QR code);
 * - só entram no site os arquivos realmente referenciados pelo manifesto;
 * - nada de referencias-privadas/, notas internas, .tex ou .cls.
 */
import { readFile, writeFile, mkdir, rm, copyFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kitDir = path.resolve(siteDir, '..');

const DATA_DIR = path.join(siteDir, 'src/data');
const EVENT_IMG_DIR = path.join(siteDir, 'src/assets/eventos');
const DECOR_DIR = path.join(siteDir, 'src/assets/decoracao');
const PDF_DIR = path.join(siteDir, 'public/curriculo');

const log = [];
const warn = [];

const rel = (p) => path.relative(kitDir, p);

/**
 * Campos que existem só para o controle do trabalho e que o site nunca renderiza:
 * pendências, hipóteses de data, proveniência, telefone e caminhos locais.
 *
 * Eles são removidos na cópia porque o repositório do site é público: deixados ali,
 * virariam texto pesquisável ao lado do nome da Bárbara — um recrutador acharia
 * "Separar entregas de Bárbara das entregas da equipe" tão facilmente quanto o site.
 * O kit continua com tudo; a fonte de verdade não perde nada.
 */
const CAMPOS_INTERNOS = new Set([
  'missing',
  'dateStatus',
  'source',
  'metricNote',
  'provenance',
  'phone',
  'originalPath',
]);

function semCamposInternos(valor) {
  if (Array.isArray(valor)) return valor.map(semCamposInternos);
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(
      Object.entries(valor)
        .filter(([chave]) => !CAMPOS_INTERNOS.has(chave))
        .map(([chave, v]) => [chave, semCamposInternos(v)]),
    );
  }
  return valor;
}

async function copiarJson(nome) {
  const origem = path.join(kitDir, 'conteudo', nome);
  if (!existsSync(origem)) {
    warn.push(`conteudo/${nome} não encontrado no kit — mantido o arquivo atual em src/data/.`);
    return;
  }
  const dados = JSON.parse(await readFile(origem, 'utf8'));
  await writeFile(path.join(DATA_DIR, nome), JSON.stringify(semCamposInternos(dados), null, 2) + '\n');
  log.push(`conteudo/${nome} → src/data/${nome}`);
}

async function limparDiretorio(dir, extensoes) {
  if (!existsSync(dir)) return;
  for (const arquivo of await readdir(dir)) {
    if (extensoes.some((ext) => arquivo.endsWith(ext))) {
      await rm(path.join(dir, arquivo));
    }
  }
}

async function main() {
  // O repositório publicado contém apenas o site. O kit (conteudo/, assets/, curriculo/)
  // fica na máquina de quem edita o conteúdo.
  if (!existsSync(path.join(kitDir, 'conteudo')) || !existsSync(path.join(kitDir, 'assets'))) {
    console.error(
      '\nO kit não foi encontrado em ' + kitDir + '.\n\n' +
        'Este script copia conteúdo de ../conteudo, ../assets e ../curriculo, que não fazem\n' +
        'parte do repositório do site. Sem o kit por perto, edite direto em src/data/ —\n' +
        'o site é autocontido e não depende desta sincronização para funcionar.\n',
    );
    process.exit(1);
  }

  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(EVENT_IMG_DIR, { recursive: true });
  await mkdir(DECOR_DIR, { recursive: true });
  await mkdir(PDF_DIR, { recursive: true });

  for (const nome of ['perfil.json', 'cases.json', 'eventos.json']) {
    await copiarJson(nome);
  }

  const manifesto = JSON.parse(await readFile(path.join(kitDir, 'assets/manifest.json'), 'utf8'));
  await writeFile(
    path.join(DATA_DIR, 'manifest.json'),
    JSON.stringify(semCamposInternos(manifesto), null, 2) + '\n',
  );
  log.push('assets/manifest.json → src/data/manifest.json');

  // Só imagens de evento liberadas entram no projeto. O nome do arquivo passa a ser
  // o id do manifesto, o que evita espaços/acentos no caminho e mantém a rastreabilidade.
  await limparDiretorio(EVENT_IMG_DIR, ['.jpeg', '.jpg', '.png', '.webp', '.avif']);

  let copiadas = 0;
  let bloqueadas = 0;
  for (const asset of manifesto.assets ?? []) {
    if (asset.type !== 'event-photo' && asset.type !== 'case-image' && asset.type !== 'portrait') continue;
    if (asset.publicUse !== true) {
      bloqueadas++;
      warn.push(`bloqueado (publicUse !== true): ${asset.path}`);
      continue;
    }
    const origem = path.join(kitDir, asset.path);
    if (!existsSync(origem)) {
      warn.push(`arquivo ausente no kit: ${asset.path}`);
      continue;
    }
    const destino = path.join(EVENT_IMG_DIR, `${asset.id}${path.extname(asset.path).toLowerCase()}`);
    await copyFile(origem, destino);
    copiadas++;
  }
  log.push(`${copiadas} imagem(ns) liberada(s) → src/assets/eventos/ (${bloqueadas} bloqueada(s) por publicUse)`);

  for (const decor of (manifesto.assets ?? []).filter((a) => a.type === 'decoration')) {
    const origem = path.join(kitDir, decor.path);
    if (!existsSync(origem)) {
      warn.push(`decoração ausente: ${decor.path}`);
      continue;
    }
    await copyFile(origem, path.join(DECOR_DIR, path.basename(decor.path)));
    log.push(`${rel(origem)} → src/assets/decoracao/${path.basename(decor.path)}`);
  }

  // Só o PDF. Nunca .tex, .cls ou notas internas.
  const pdf = path.join(kitDir, 'curriculo/barbara-fraquete.pdf');
  if (existsSync(pdf)) {
    await copyFile(pdf, path.join(PDF_DIR, 'barbara-fraquete.pdf'));
    log.push('curriculo/barbara-fraquete.pdf → public/curriculo/barbara-fraquete.pdf');
  } else {
    warn.push('curriculo/barbara-fraquete.pdf não encontrado — o link de download vai quebrar.');
  }

  console.log('\nSincronização concluída:');
  for (const linha of log) console.log('  ✓ ' + linha);
  if (warn.length) {
    console.log('\nAvisos:');
    for (const linha of warn) console.log('  • ' + linha);
  }
  console.log('');
}

main().catch((erro) => {
  console.error('Falha na sincronização:', erro.message);
  process.exit(1);
});
