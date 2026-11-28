# Берлін сьогодні

Новини Берліна з кількох видань в одному місці. Застосунок сам завантажує свіжі новини.

**Сайт:** https://oleg-demkovych.github.io/berlin-news/

## Можливості
- Пошук, фільтри за категорією, періодом і джерелом
- Оновлення свайпом униз або кнопкою, а також раз на годину, поки застосунок відкритий
- Збережені та прочитані матеріали (у браузері вашого пристрою)
- Світла й темна теми
- PWA: встановлення на телефон і перегляд останніх завантажених новин без інтернету

## Встановлення на телефон
- **Android (Chrome):** відкрийте сайт → «Встановити», або меню ⋮ → «Додати на головний екран».
- **iPhone (Safari):** відкрийте сайт → «Поділитися» → «На початковий екран».

## Джерела

| Категорія | Видання |
|---|---|
| Новини | rbb24 Politik, rbb24 Wirtschaft, rbb24 Panorama, Tagesspiegel, Berliner Morgenpost, taz Berlin, rbb24, Berliner Zeitung |
| Поліція | Berliner Zeitung: поліція, Поліція Берліна |
| Місто | Entwicklungsstadt |
| Райони | QIEZ, neukoellner.net, Weddingweiser, Brunnenmagazin, Prenzlauer Berg Nachrichten |
| Культура і дозвілля | Berliner Zeitung: культура, rbb24 Kultur, Mit Vergnügen, iHeartBerlin |
| Спорт | BZ: Union Berlin, BZ: Hertha BSC, rbb24 Sport |
| English | Berliner Zeitung English, Slow Travel Berlin, The Local Berlin, The Berlin Spectator |
| Українською | DW українською |

Щоб додати джерело, допишіть його в `public/sources.json`:

```json
{"name": "Назва", "cat": "Новини", "url": "https://example.com/feed.xml"}
```

Необов'язкові поля: `filter` (регулярний вираз для відбору) і `max` (ліміт матеріалів).
## Як це працює
Застосунок читає RSS-стрічки прямо з пристрою. Якщо видання не дозволяє запит із браузера, пробуються безкоштовні посередники (AllOrigins, CodeTabs). Вони бачать вашу IP-адресу й адреси стрічок і можуть не працювати.

Резервна копія: workflow `.github/workflows/update.yml` за розкладом і після пушу в `main` зберігає `data/news.json` та публікує сайт. GitHub може затримувати запуски за розкладом.

## Власний посередник (надійніше)
1. [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → створіть Worker.
2. Вставте код `worker/proxy.js` і натисніть Deploy.
3. Впишіть адресу Worker у `const PROXY = ''` в `public/index.html`.

Після додавання джерела з новим доменом додайте його в `HOSTS` у `worker/proxy.js`.

## Налаштування з нуля
Settings → Pages → Source: **GitHub Actions**, потім Actions → «Оновлення новин» → Run workflow.

## Локальний запуск
Потрібен Node.js 20+:

```bash
node server.mjs
```

Відкрийте http://localhost:3000.

## Структура
```
public/            застосунок, список джерел, service worker, іконки
scripts/           збір резервної копії новин
worker/            власний посередник (необов'язково)
server.mjs         локальний сервер
.github/workflows/ щогодинна збірка
```

## Права
Права на матеріали належать виданням. Застосунок показує заголовки, короткі описи та посилання на оригінали.
