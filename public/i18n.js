// Мови інтерфейсу. Самі новини залишаються мовою видання.
export const LANGS = { uk: 'UA', pl: 'PL', de: 'DE', zh: '中文' };
export const LOCALES = { uk: 'uk', pl: 'pl', de: 'de', zh: 'zh-CN' };

// кожен рядок: [uk, pl, de, zh]
const T = {
  title: ['Берлін сьогодні', 'Berlin dzisiaj', 'Berlin heute', '今日柏林'],
  language: ['Мова', 'Język', 'Sprache', '语言'],
  install: ['Встановити', 'Zainstaluj', 'Installieren', '安装'],
  refresh: ['Оновити', 'Odśwież', 'Aktualisieren', '刷新'],
  theme: ['Змінити тему', 'Zmień motyw', 'Design wechseln', '切换主题'],
  categories: ['Категорії', 'Kategorie', 'Kategorien', '分类'],
  search: ['Пошук', 'Szukaj', 'Suche', '搜索'],
  searchHint: ['Пошук: BVG, Mitte, Miete…', 'Szukaj: BVG, Mitte, Miete…', 'Suche: BVG, Mitte, Miete…', '搜索：BVG、Mitte、Miete…'],
  period: ['Період', 'Okres', 'Zeitraum', '时间范围'],
  allTime: ['За весь час', 'Cały czas', 'Gesamter Zeitraum', '全部时间'],
  day: ['За 24 години', 'Ostatnie 24 godziny', 'Letzte 24 Stunden', '最近24小时'],
  week: ['За тиждень', 'Ostatni tydzień', 'Letzte Woche', '最近一周'],
  month: ['За місяць', 'Ostatni miesiąc', 'Letzter Monat', '最近一个月'],
  source: ['Джерело', 'Źródło', 'Quelle', '来源'],
  allSources: ['Усі джерела', 'Wszystkie źródła', 'Alle Quellen', '全部来源'],
  loading: ['Завантаження…', 'Ładowanie…', 'Wird geladen…', '加载中…'],
  count: ['Матеріалів: {n}', 'Materiały: {n}', 'Beiträge: {n}', '共 {n} 条'],
  more: ['Показати ще', 'Pokaż więcej', 'Mehr anzeigen', '显示更多'],
  health: ['Стан джерел', 'Stan źródeł', 'Status der Quellen', '来源状态'],
  badFeed: ['порожня або нерозпізнана стрічка', 'pusty lub nierozpoznany kanał', 'Feed leer oder unlesbar', '订阅源为空或无法识别'],
  all: ['Усі', 'Wszystkie', 'Alle', '全部'],
  saved: ['★ Збережене', '★ Zapisane', '★ Gespeichert', '★ 收藏'],
  save: ['Зберегти', 'Zapisz', 'Speichern', '收藏'],
  unsave: ['Прибрати зі збереженого', 'Usuń z zapisanych', 'Aus Gespeicherten entfernen', '取消收藏'],
  new: ['нове', 'nowe', 'neu', '新'],
  nothing: ['Нічого не знайдено. Змініть фільтри або пошук.', 'Nic nie znaleziono. Zmień filtry lub wyszukiwanie.', 'Nichts gefunden. Ändern Sie Filter oder Suche.', '没有找到内容。请调整筛选或搜索。'],
  noNews: ['Новин ще немає. Спробуйте оновити трохи пізніше.', 'Nie ma jeszcze wiadomości. Spróbuj odświeżyć później.', 'Noch keine Nachrichten. Bitte später erneut versuchen.', '暂无新闻，请稍后刷新。'],
  updating: ['Оновлення…', 'Aktualizowanie…', 'Wird aktualisiert…', '正在更新…'],
  progress: ['Оновлення {n} з {total}…', 'Aktualizowanie {n} z {total}…', 'Aktualisierung {n} von {total}…', '正在更新 {n}/{total}…'],
  updatedAll: ['Оновлено всі джерела', 'Zaktualizowano wszystkie źródła', 'Alle Quellen aktualisiert', '所有来源已更新'],
  updatedSome: ['Напряму оновлено {n} з {total} джерел', 'Zaktualizowano bezpośrednio {n} z {total} źródeł', '{n} von {total} Quellen direkt aktualisiert', '已直接更新 {n}/{total} 个来源'],
  copy: ['Напряму не вдалося, показано копію з сервера', 'Nie udało się pobrać bezpośrednio, pokazano kopię z serwera', 'Direktabruf fehlgeschlagen, Serverkopie wird angezeigt', '直接获取失败，显示服务器副本'],
  failed: ['Не вдалося оновити. Перевірте інтернет', 'Nie udało się zaktualizować. Sprawdź internet', 'Aktualisierung fehlgeschlagen. Internet prüfen', '更新失败，请检查网络'],
  updatedAgo: ['Оновлено {time}', 'Zaktualizowano {time}', 'Aktualisiert {time}', '更新于 {time}'],
  pull: ['↓ Потягніть, щоб оновити', '↓ Pociągnij, aby odświeżyć', '↓ Zum Aktualisieren ziehen', '↓ 下拉刷新'],
  release: ['↻ Відпустіть, щоб оновити', '↻ Puść, aby odświeżyć', '↻ Zum Aktualisieren loslassen', '↻ 松开刷新'],
  // назви категорій і джерел (ключ — значення з sources.json)
  'Новини': ['Новини', 'Wiadomości', 'Nachrichten', '新闻'],
  'Поліція': ['Поліція', 'Policja', 'Polizei', '警务'],
  'Місто': ['Місто', 'Miasto', 'Stadt', '城市'],
  'Культура і дозвілля': ['Культура і дозвілля', 'Kultura i rozrywka', 'Kultur und Freizeit', '文化休闲'],
  'English': ['English', 'Po angielsku', 'Englisch', '英语'],
  'Українською': ['Українською', 'Po ukraińsku', 'Ukrainisch', '乌克兰语'],
  'Поліція Берліна': ['Поліція Берліна', 'Policja w Berlinie', 'Polizei Berlin', '柏林警方'],
  'DW українською': ['DW українською', 'DW po ukraińsku', 'DW Ukrainisch', 'DW 乌克兰语版']
};

export function translator(lang) {
  const n = Math.max(0, Object.keys(LANGS).indexOf(lang));
  return (key, vars = {}) => (Object.hasOwn(T, key) ? T[key][n] : key).replace(/\{(\w+)\}/g, (m, v) => vars[v] ?? m);
}

export function detect(preferred = []) {
  return preferred.map(l => l.slice(0, 2).toLowerCase()).find(l => Object.hasOwn(LANGS, l)) ?? 'uk';
}
