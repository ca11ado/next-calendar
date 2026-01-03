# Календарь жизни

Визуализация периодов жизни на вертикальной временной шкале. 70 лет на одном экране.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC)

## Фичи

- Вертикальный таймлайн с адаптивным размещением событий
- Масштабирование календаря (50%/80%/100%/150%/200%)
- Гибкая группировка: по названию, категории или обоим полям
- Автоматическое размещение перекрывающихся событий в несколько рядов
- CRUD для событий, экспорт/импорт JSON
- 5 категорий: Образование, Работа, Путешествия, Личное, Другое
- LocalStorage

## Sidebar

**ДЕЙСТВИЯ**

- События: добавить, экспорт, импорт
- Режимы: fullscreen, цвета

**НАСТРОЙКИ**

- Группировка: название, категория
- Размер: 1/2, 0.8, 1, x1.5, x2

**ИНФОРМАЦИЯ**: текущий год, календарь (70 лет)

**ЛЕГЕНДА**: список событий с цветами

## Установка

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # проверка перед коммитом
```

## Технологии

Next.js 16 (App Router) · TypeScript · Tailwind CSS · date-fns · LocalStorage

## Архитектура

```
src/
├── app/            # Страницы (page.tsx, layout.tsx)
├── components/
│   ├── calendar/   # Timeline, TimeGrid, EventBar
│   ├── events/     # CRUD компоненты
│   └── ui/         # Button, Modal, Input, Select
└── lib/
    ├── types.ts
    ├── constants.ts
    ├── hooks/      # useEvents, useLocalStorage, useZoom
    └── utils/      # layoutEngine, positionCalculator, export/import
```

**Ключевые алгоритмы:**

- `layoutEngine.ts` — жадный алгоритм размещения событий без перекрытий
- `positionCalculator.ts` — расчёт позиций с учётом масштаба и viewport

## Конфигурация

`src/lib/constants.ts`:

- `BIRTH_DATE` = 25 марта 1989
- `LIFE_SPAN_YEARS` = 70
- `DEFAULT_ZOOM_SCALE` = 100

## Разработка

Строгий TypeScript без `as`, ESLint max-warnings 0, Prettier. Всегда `npm run validate` перед коммитом.

---

MIT · Проект создан с помощью Claude Code
