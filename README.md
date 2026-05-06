# ♟ Ход дрона — Поиск по регламенту

Поисковая система на базе LLM для регламента соревнования **«Ход дрона. Шахматные сражения гетерогенных роёв дронов»** (Москва, Сколково, 2026).

🌐 **[gebondar.github.io/Hod_Drone_Reglament](https://gebondar.github.io/Hod_Drone_Reglament)**

> 💸 **Весь стек — полностью бесплатный.** Никаких платежей: GitHub Pages, Deno Deploy, OpenRouter (free-модели).

---

## Возможности

- **💬 LLM-поиск** — вопрос по регламенту → модель находит ответ со ссылками на разделы
- **📋 Просмотр регламента** — полный текст `reglament_v02.md` с оглавлением и якорной навигацией
- **13 бесплатных моделей** на выбор через OpenRouter, автосмена при ошибках
- **Адаптивный интерфейс** — телефон, планшет, десктоп
- **Безопасность** — API-ключ скрыт за серверным прокси, в коде не виден

---

## Архитектура

```
Браузер (GitHub Pages)
    │
    │ запрос (без API-ключа)
    ▼
Deno Deploy Proxy
    │
    │ + API-ключ (из env)
    ▼
OpenRouter API
    │
    │ free-модель
    ▼
Ответ → рендеринг Markdown (marked.js)
```

| Слой | Технология | Цена |
|------|-----------|------|
| Хостинг | GitHub Pages | $0 |
| Прокси | Deno Deploy | $0 (1M req/мес) |
| LLM | OpenRouter (free модели) | $0 |
| Markdown | marked.js (CDN) | $0 |

### Защита API-ключа

Ключ хранится в двух местах, недоступных из браузера:
1. **GitHub Secrets** — для деплоя (не коммитится)
2. **Deno Deploy env** — для прокси (только серверная сторона)

Браузер вызывает прокси без ключа, прокси добавляет ключ и форвардит в OpenRouter. В HTML-исходниках сайта ключа нет.

---

## Автосмена моделей

При любой ошибке (лимит токенов, таймаут 60с, пустой ответ, сбой провайдера) система автоматически переключается на следующую free-модель с паузой 1 секунда:

```
gpt-oss-20b → deepseek-chat-v3 → nemotron-3-super → ...
```

Список моделей в `docs/index.html` → `<select id="modelSelect">`.

---

## Структура проекта

```
├── docs/
│   ├── index.html          # сайт (SPA: чат + рендерер регламента)
│   ├── reglament_v02.md    # копия для GitHub Pages
│   └── .nojekyll
├── reglament_v02.md         # актуальный регламент (источник)
├── worker/
│   ├── deno-proxy.ts        # Deno Deploy прокси
│   └── worker.js            # Cloudflare Worker (запасной)
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions: инжект секретов + деплой
└── README.md
```

---

## Разработка

```bash
# Локально
start docs/index.html

# Деплой фронтенда
git push origin main   # GitHub Actions соберёт и задеплоит
```

### Обновление регламента

Отредактируй `reglament_v02.md` и `docs/reglament_v02.md` — сайт подгружает их динамически.

### Добавление моделей

Список в `docs/index.html` → `<select id="modelSelect">`. Только free-модели (цена = $0 на OpenRouter).

### Настройка прокси

1. [Deno Deploy Dashboard](https://dash.deno.com) → новый проект
2. Код из `worker/deno-proxy.ts`
3. Env: `OPENROUTER_API_KEY` = твой ключ
4. URL → GitHub Secret `WORKER_URL`
