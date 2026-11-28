// Спільний код для застосунку та scripts/fetch.mjs
export const KEEP_DAYS = 30, MAX_TOTAL = 3000, MAX_PER_SOURCE = 100;

const ENT = { amp:'&', lt:'<', gt:'>', quot:'"', apos:"'", nbsp:' ', mdash:'—', ndash:'–', hellip:'…', auml:'ä', ouml:'ö', uuml:'ü', Auml:'Ä', Ouml:'Ö', Uuml:'Ü', szlig:'ß', eacute:'é', euro:'€', bdquo:'„', shy:'', rsquo:'’', lsquo:'‘', ldquo:'“', rdquo:'”' };
const decode = s => s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
  if (e[0] !== '#') return ENT[e] ?? m;
  const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1));
  return n <= 0x10ffff ? String.fromCodePoint(n) : m;
});
const unwrap = s => s.includes('<![CDATA[') ? s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') : decode(s);
const plain = s => decode(unwrap(s).replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const tag = (block, ...names) => {
  for (const n of names) {
    const m = block.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, 'i'));
    if (m && m[1].trim()) return m[1].trim();
  }
  return '';
};
const cut = (s, n = 240) => s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s;
const safeUrl = (u, base) => { try { const x = new URL(u, base); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };

export function parseFeed(xml, src) {
  const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) ?? [];
  return blocks.map(b => {
    const links = [...b.matchAll(/<link\s([^>]*?)\/?>/gi)].map(m => m[1]);
    const alt = links.find(a => /rel=["']alternate["']/.test(a)) ?? links.find(a => !/rel=/.test(a));
    const href = alt?.match(/href=["']([^"']+)["']/)?.[1];
    const url = safeUrl(href ? decode(href) : unwrap(tag(b, 'link', 'guid')).trim(), src.url);
    const date = new Date(unwrap(tag(b, 'pubDate', 'published', 'dc:date', 'updated')));
    const media = b.match(/<(?:media:content|media:thumbnail|enclosure)\s[^>]*url=["']([^"']+\.(?:jpe?g|png|webp|gif)[^"']*)["']/i)?.[1]
      ?? unwrap(tag(b, 'content:encoded', 'content', 'description')).match(/<img\s[^>]*src=["']([^"']+)["']/i)?.[1];
    return {
      title: cut(decode(unwrap(tag(b, 'title'))).replace(/\s+/g, ' ').trim(), 200), url,
      date: isNaN(date) ? null : date.toISOString(),
      text: cut(plain(tag(b, 'description', 'summary', 'content:encoded', 'content'))),
      image: media ? safeUrl(decode(media), src.url) : '',
      source: src.name, cat: src.cat,
    };
  }).filter(i => i.title && i.url && i.date);
}

// частина німецьких стрічок не в UTF-8
export function decodeBytes(buffer, contentType = '') {
  const bytes = new Uint8Array(buffer);
  const head = String.fromCharCode(...bytes.subarray(0, 200));
  const charset = head.match(/<\?xml[^>]*encoding=["']([\w-]+)/i)?.[1] ?? contentType.match(/charset=["']?([\w-]+)/i)?.[1];
  try { return new TextDecoder(charset || 'utf-8').decode(bytes); }
  catch { return new TextDecoder().decode(bytes); }
}

export function readSource(xml, src) {
  let items = parseFeed(xml, src);
  if (!items.length) throw new Error('порожня або нерозпізнана стрічка');
  if (src.filter) { const re = new RegExp(src.filter, 'i'); items = items.filter(i => re.test(i.title + ' ' + i.text)); }
  return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, src.max ?? MAX_PER_SOURCE);
}

export function merge(old, fresh, now = Date.now()) {
  const map = new Map();
  for (const i of [...old, ...fresh]) {
    const t = Date.parse(i.date);
    if (!i.url || !(t > now - KEEP_DAYS * 86400e3) || t > now + 86400e3) continue;
    const key = i.url.replace(/[?#]utm_.*$/, '').replace(/\/$/, '');
    const prev = map.get(key);
    // перше джерело залишається власником запису, свіжі дані оновлюють лише його
    if (!prev || prev.source === i.source) { const { titleUk, textUk, trV, ...item } = i; map.set(key, item); }
  }
  return [...map.values()].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, MAX_TOTAL);
}
