# Берлін сьогодні

Новини Берліна з кількох видань, оновлення щогодини (GitHub Pages + Actions).

- Увімкнути сайт: Settings → Pages → Source: GitHub Actions.
- Локально: `node server.mjs` → http://localhost:3000
- Джерела: `scripts/sources.json`. Які з них не відповіли, видно внизу сайту.
- Переклад заголовків та описів українською робить `scripts/translate.py` моделлю NLLB-200 (ліцензія CC-BY-NC: лише некомерційне використання) під час збірки.
