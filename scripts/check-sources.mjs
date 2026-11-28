// Перевіряє, чи стрічки з public/sources.json відповідають і мають свіжі матеріали
import { readFile } from 'node:fs/promises';
import { decodeBytes, readSource, merge } from '../public/feed.js';

const sources = JSON.parse(await readFile(new URL('../public/sources.json', import.meta.url), 'utf8'));
for (const src of sources) {
  try {
    const r = await fetch(src.url, { signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'BerlinNews/1.0 (RSS reader)' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const items = merge([], readSource(decodeBytes(await r.arrayBuffer(), r.headers.get('content-type') ?? ''), src));
    if (!items.length) throw new Error('немає матеріалів за 30 днів');
    console.log(`OK|${src.name}|${items.length}|${items[0].date.slice(0, 10)}|${items[0].title.slice(0, 60)}`);
  } catch (e) { console.log(`FAIL|${src.name}|${e.message}`); }
}
