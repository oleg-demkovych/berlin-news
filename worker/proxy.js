// Cloudflare Worker: віддає застосунку лише стрічки з дозволених доменів
const ORIGIN = 'https://oleg-demkovych.github.io';
const HOSTS = ["berlinspectator.com", "brunnenmagazin.de", "entwicklungsstadt.de", "feeds.thelocal.com", "mitvergnuegen.com", "neukoellner.net", "rss.dw.com", "taz.de", "weddingweiser.de", "www.berlin.de", "www.berliner-zeitung.de", "www.iheartberlin.de", "www.morgenpost.de", "www.prenzlauerberg-nachrichten.de", "www.qiez.de", "www.rbb24.de", "www.slowtravelberlin.com", "www.tagesspiegel.de"];

export default {
  async fetch(request) {
    const cors = { 'access-control-allow-origin': ORIGIN };
    const deny = status => new Response('Forbidden', { status, headers: cors });
    let url = new URL(request.url).searchParams.get('url');
    if (request.method !== 'GET') return deny(405);
    // переадресації перевіряємо самі, щоб не вийти за межі списку
    for (let hop = 0; hop < 4; hop++) {
      try { url = new URL(url); } catch { return deny(400); }
      if (url.protocol !== 'https:' || !HOSTS.includes(url.hostname)) return deny(403);
      const res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'BerlinNews/1.0 (RSS reader)' }, cf: { cacheTtl: 120 } });
      const next = res.status >= 300 && res.status < 400 && res.headers.get('location');
      if (!next) return new Response(res.body, { status: res.status, headers: { ...cors, 'content-type': res.headers.get('content-type') ?? 'text/xml' } });
      url = new URL(next, url).href;
    }
    return deny(508);
  }
};
