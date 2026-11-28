// Збирає новини з усіх джерел у public/data/news.json. Без залежностей, Node 20+.
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { decodeBytes, readSource, merge } from '../public/feed.js';

const root = new URL('../', import.meta.url);
const OUT = new URL('public/data/news.json', root);
async function get(url, tries = 4) {
  let res;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'BerlinNews/1.0 (RSS reader)', accept: 'application/rss+xml, application/atom+xml, application/json, text/xml, */*' } });
  } catch (e) {
    // тимчасовий збій мережі: пробуємо ще раз
    if (tries <= 1) throw e;
    await new Promise(r => setTimeout(r, 5000));
    return get(url, tries - 1);
  }
  // 429: сервіс просить зачекати
  if (res.status === 429 && tries > 1) {
    const wait = Math.min(Number(res.headers.get('retry-after')) || 10, 60);
    await new Promise(r => setTimeout(r, wait * 1000));
    return get(url, tries - 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return decodeBytes(await res.arrayBuffer(), res.headers.get('content-type') ?? '');
}

const rss = async src => readSource(await get(src.url), src);

async function previous() {
  try {
    // PREV_URL потрібен у GitHub Actions, де локального файлу між запусками немає
    return JSON.parse(process.env.PREV_URL ? await get(process.env.PREV_URL) : await readFile(OUT, 'utf8')).items ?? [];
  } catch { return []; }
}

export async function update() {
  const sources = JSON.parse(await readFile(new URL('public/sources.json', root), 'utf8'));
  const jobs = sources.map(s => [s.name, () => rss(s)]);
  const results = [];
  for (let i = 0; i < jobs.length; i += 8) {
    results.push(...await Promise.all(jobs.slice(i, i + 8).map(async ([name, run]) => {
      try { return { name, items: await run() }; }
      catch (e) { return { name, items: [], error: e.message }; }
    })));
  }
  const fresh = results.flatMap(r => r.items);
  if (!fresh.length) throw new Error('Жодне джерело не відповіло — старі дані збережено');
  const items = merge(await previous(), fresh);
  const data = { updated: new Date().toISOString(), status: results.map(r => ({ name: r.name, count: r.items.length, error: r.error })), items };
  await mkdir(new URL('.', OUT), { recursive: true });
  const tmp = fileURLToPath(OUT) + '.tmp';
  await writeFile(tmp, JSON.stringify(data));
  await rename(tmp, OUT);
  const failed = data.status.filter(s => s.error);
  console.log(`${data.updated}: ${items.length} матеріалів; помилок: ${failed.length}/${results.length}`);
  failed.forEach(f => console.log(`  ✗ ${f.name}: ${f.error}`));
  return data;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await update();
