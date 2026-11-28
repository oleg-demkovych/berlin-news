# Берлін сьогодні

Новини Берліна з кількох видань в одному місці. Застосунок сам завантажує свіжі новини.

**Сайт:** https://oleg-demkovych.github.io/berlin-news/

## Можливості
- Пошук, фільтри за категорією, періодом і джерелом
- Оновлення свайпом униз (як у мобільних застосунках) або кнопкою, а також кожні 10 хвилин, поки застосунок відкритий
- Збережені та прочитані матеріали (у браузері вашого пристрою)
- Світла й темна теми
- PWA: встановлення на телефон і перегляд останніх завантажених новин без інтернету

## Встановлення на телефон
- **Android (Chrome):** відкрийте сайт → «Встановити», або меню ⋮ → «Додати на головний екран».
- **iPhone (Safari):** відкрийте сайт → «Поділитися» → «На початковий екран».

## Джерела

| Категорія | Видання |
|---|---|
| Новини | rbb24 Politik, rbb24 Wirtschaft, rbb24 Panorama, Tagesspiegel, Berliner Morgenpost, taz Berlin, Berliner Zeitung: новини, Berliner Zeitung: політика, Berliner Zeitung: економіка, Berliner Kurier, rbb24, Berliner Zeitung |
| Поліція | Поліція Берліна |
| Місто | Entwicklungsstadt |
| Райони | QIEZ, Weddingweiser, Brunnenmagazin, Prenzlauer Berg Nachrichten, Pankower Allgemeine Zeitung, Kiez und Kneipe |
| Культура і дозвілля | Berliner Zeitung: культура, rbb24 Kultur, Mit Vergnügen, iHeartBerlin, Cee Cee, Berlin Food Stories, Digital in Berlin |
| Спорт | rbb24 Sport |
| English | Slow Travel Berlin, The Berlin Spectator |
| Українською | DW українською |

Щоб додати джерело, допишіть його в `public/sources.json`:

```json
{"name": "Назва", "cat": "Новини", "url": "https://example.com/feed.xml"}
```

Необов'язкові поля: `filter` (регулярний вираз для відбору) і `max` (ліміт матеріалів).
Перевірити, які стрічки відповідають: Actions → «Перевірка джерел» → Run workflow.

## Як це працює
Усі новини завантажуються тільки на пристрої: під час відкриття, свайпом, кнопкою та кожні 10 хвилин, поки застосунок відкритий. Завантажене зберігається в браузері.

Більшість видань не дозволяють запити з браузера, тому, крім прямого запиту, пробуються безкоштовні посередники AllOrigins, CodeTabs і rss2json. Вони бачать вашу IP-адресу й адреси стрічок, мають ліміти, можуть віддавати кешовані дані або не працювати. Який шлях спрацював, видно в «Стані джерел».

Workflow `.github/workflows/deploy.yml` лише публікує папку `public` після пушу в `main`.

## Власний посередник (надійніше)
1. [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → створіть Worker.
2. Вставте код `worker/proxy.js` і натисніть Deploy.
3. Впишіть адресу Worker у `const PROXY = ''` в `public/index.html`.

Після додавання джерела з новим доменом додайте його в `HOSTS` у `worker/proxy.js`.

## Налаштування з нуля
Settings → Pages → Source: **GitHub Actions**, потім Actions → «Публікація сайту» → Run workflow.

## Локальний запуск
Потрібен Node.js 20+:

```bash
node server.mjs
```

Відкрийте http://localhost:3000.

## Структура
```
public/            застосунок, список джерел, service worker, іконки
scripts/           перевірка джерел
worker/            власний посередник (необов'язково)
server.mjs         локальний сервер
.github/workflows/ публікація сайту
```

## Права
Права на матеріали належать виданням. Застосунок показує заголовки, короткі описи та посилання на оригінали.
