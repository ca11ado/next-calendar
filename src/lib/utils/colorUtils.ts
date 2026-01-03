import { GroupingField, LifeEvent } from '../types';
import { CATEGORY_LABELS } from '../constants';

/**
 * Категории цветов с разными вариантами яркости
 */
export interface ColorCategory {
  name: string;
  colors: string[];
}

/**
 * Генерирует набор популярных и максимально различающихся цветов
 */
function generatePopularColors(): string[] {
  // 10 равномерно распределенных оттенков с хорошей видимостью
  const popularHues = [
    0, // Красный
    25, // Оранжевый
    45, // Желто-оранжевый
    75, // Желто-зеленый
    120, // Зеленый
    180, // Голубой
    210, // Светло-синий
    240, // Синий
    270, // Фиолетовый
    300, // Пурпурный
  ];

  return popularHues.map((hue) => `hsl(${hue}, 70%, 50%)`);
}

/**
 * Генерирует палитру цветов с вариациями яркости
 * Возвращает массив категорий: темные, средние, светлые
 */
function generateCategorizedPalette(offset: number = 0): ColorCategory[] {
  const saturation = 75;
  const baseHues = 32; // Базовых оттенков (увеличено для лучшего покрытия спектра)
  const step = 360 / baseHues;

  // Генерируем равномерно распределенные hue
  const validHues: number[] = [];
  for (let i = 0; i < baseHues; i++) {
    const hue = Math.round((step * i + offset) % 360);
    validHues.push(hue);
  }

  // Создаем категории с разными вариантами яркости
  const categories: ColorCategory[] = [
    {
      name: 'Темные',
      colors: validHues.map((hue) => `hsl(${hue}, ${saturation}%, 35%)`),
    },
    {
      name: 'Средние',
      colors: validHues.map((hue) => `hsl(${hue}, ${saturation}%, 55%)`),
    },
    {
      name: 'Светлые',
      colors: validHues.map((hue) => `hsl(${hue}, ${saturation}%, 75%)`),
    },
  ];

  return categories;
}

/**
 * Генерирует плоскую палитру из всех категорий (для обратной совместимости)
 */
function generateDistinctPalette(offset: number = 0): string[] {
  const categories = generateCategorizedPalette(offset);
  return categories.flatMap((cat) => cat.colors);
}

// Палитра максимально различающихся цветов (96 цветов: 32 оттенка × 3 яркости)
// Равномерно распределены по hue с фиксированной насыщенностью и яркостью
let DISTINCT_COLOR_PALETTE = generateDistinctPalette(48);

/**
 * Регенерирует палитру цветов с новым offset
 */
export function regenerateColorPalette(offset: number): void {
  DISTINCT_COLOR_PALETTE = generateDistinctPalette(offset);
  // Очищаем кэш цветов
  colorCache.clear();
}

/**
 * Простая хеш-функция для строки
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Маппинг полей на функции получения отображаемого значения
 */
const FIELD_DISPLAY_MAPPERS: Record<
  GroupingField,
  (event: Pick<LifeEvent, 'title' | 'category'>) => string
> = {
  title: (event) => event.title,
  category: (event) => CATEGORY_LABELS[event.category],
};

/**
 * Маппинг полей на функции получения ключевого значения (для кэширования цветов)
 */
const FIELD_KEY_MAPPERS: Record<
  GroupingField,
  (event: Pick<LifeEvent, 'title' | 'category'>) => string
> = {
  title: (event) => event.title,
  category: (event) => event.category,
};

/**
 * Генерирует ключ для группировки на основе события и выбранных полей
 */
export function generateGroupingKey(
  event: Pick<LifeEvent, 'title' | 'category'>,
  groupingFields: GroupingField[]
): string {
  return groupingFields
    .map((field) => FIELD_KEY_MAPPERS[field](event))
    .join('::');
}

/**
 * Генерирует метку для отображения в легенде на основе события и выбранных полей
 */
export function generateGroupingLabel(
  event: Pick<LifeEvent, 'title' | 'category'>,
  groupingFields: GroupingField[]
): string {
  return groupingFields
    .map((field) => FIELD_DISPLAY_MAPPERS[field](event))
    .join(' • ');
}

/**
 * Генерирует согласованный цвет на основе строки (например, title события)
 * Одинаковые строки всегда дают одинаковый цвет из палитры
 */
export function generateColorFromString(str: string): string {
  const hash = hashString(str);
  const index = hash % DISTINCT_COLOR_PALETTE.length;
  return DISTINCT_COLOR_PALETTE[index];
}

/**
 * Преобразует HSL в RGB hex формат
 */
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Кэш для цветов, чтобы не генерировать их каждый раз
 */
const colorCache = new Map<string, string>();

/**
 * Получает согласованный цвет для строки с кэшированием
 */
export function getConsistentColor(str: string): string {
  if (colorCache.has(str)) {
    return colorCache.get(str)!;
  }

  const color = generateColorFromString(str);
  colorCache.set(str, color);
  return color;
}

/**
 * Получает список всех занятых цветов
 */
function getUsedColors(): Set<string> {
  return new Set(colorCache.values());
}

/**
 * Получает незанятый цвет из палитры
 */
function getUnusedColor(usedColors: Set<string>): string {
  // Находим все незанятые цвета
  const unusedColors = DISTINCT_COLOR_PALETTE.filter(
    (color) => !usedColors.has(color)
  );

  // Если есть незанятые цвета, выбираем случайный из них
  if (unusedColors.length > 0) {
    const randomIndex = Math.floor(Math.random() * unusedColors.length);
    return unusedColors[randomIndex];
  }

  // Если все цвета заняты, выбираем случайный из всей палитры
  const randomIndex = Math.floor(Math.random() * DISTINCT_COLOR_PALETTE.length);
  return DISTINCT_COLOR_PALETTE[randomIndex];
}

/**
 * Переназначает цвет для конкретной сущности на незанятый
 */
export function regenerateSingleColor(key: string): void {
  const usedColors = getUsedColors();

  // Убираем текущий цвет из списка занятых, чтобы не назначить его же
  const currentColor = colorCache.get(key);
  if (currentColor) {
    usedColors.delete(currentColor);
  }

  // Получаем незанятый цвет
  const newColor = getUnusedColor(usedColors);

  // Переназначаем цвет в кэше
  colorCache.set(key, newColor);
}

/**
 * Получает список доступных (незанятых) цветов из палитры
 */
export function getAvailableColors(): string[] {
  const usedColors = getUsedColors();
  return DISTINCT_COLOR_PALETTE.filter((color) => !usedColors.has(color));
}

/**
 * Получает список доступных (незанятых) цветов, организованных по категориям
 */
export function getAvailableColorsByCategory(
  offset: number = 48
): ColorCategory[] {
  const usedColors = getUsedColors();

  // Создаем категорию популярных цветов
  const popularColors = generatePopularColors().filter(
    (color) => !usedColors.has(color)
  );
  const popularCategory: ColorCategory = {
    name: 'Популярные',
    colors: popularColors,
  };

  // Получаем остальные категории
  const categories = generateCategorizedPalette(offset);

  // Фильтруем каждую категорию, оставляя только незанятые цвета
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      colors: category.colors.filter((color) => !usedColors.has(color)),
    }))
    .filter((category) => category.colors.length > 0); // Убираем пустые категории

  // Возвращаем популярные первыми, если есть доступные цвета
  return popularColors.length > 0
    ? [popularCategory, ...filteredCategories]
    : filteredCategories;
}

/**
 * Устанавливает конкретный цвет для ключа
 */
export function setColorForKey(key: string, color: string): void {
  colorCache.set(key, color);
}

/**
 * Парсит HSL строку и возвращает компоненты
 */
function parseHSL(hslString: string): {
  h: number;
  s: number;
  l: number;
} | null {
  const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return null;

  return {
    h: parseInt(match[1], 10),
    s: parseInt(match[2], 10),
    l: parseInt(match[3], 10),
  };
}

/**
 * Определяет, является ли цвет светлым на основе значения lightness
 * Возвращает true для светлых цветов, false для темных
 */
export function isLightColor(color: string): boolean {
  const hsl = parseHSL(color);
  if (!hsl) {
    // Если не удалось распарсить, возвращаем false (используем светлый текст)
    return false;
  }

  // Цвета с lightness >= 60% считаются светлыми
  return hsl.l >= 60;
}

/**
 * Экспортирует текущее состояние цветов (кэш и offset)
 */
export function exportColorState(colorOffset: number): {
  colorOffset: number;
  colorMapping: Record<string, string>;
} {
  const colorMapping: Record<string, string> = {};
  colorCache.forEach((color, key) => {
    colorMapping[key] = color;
  });

  return {
    colorOffset,
    colorMapping,
  };
}

/**
 * Импортирует состояние цветов (восстанавливает кэш и палитру)
 */
export function importColorState(colorSettings: {
  colorOffset: number;
  colorMapping: Record<string, string>;
}): void {
  // Регенерируем палитру с сохраненным offset
  regenerateColorPalette(colorSettings.colorOffset);

  // Восстанавливаем маппинг цветов
  Object.entries(colorSettings.colorMapping).forEach(([key, color]) => {
    colorCache.set(key, color);
  });
}
