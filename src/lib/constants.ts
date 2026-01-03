import { EventCategory, GroupingField, ZoomScale } from './types';

// Дата рождения для календаря жизни
export const BIRTH_DATE = new Date(1989, 2, 25); // 25 марта 1989

// Продолжительность жизни для визуализации (в годах)
export const LIFE_SPAN_YEARS = 70;

// Теперь используем sidebar layout, нет header/footer
export const HEADER_HEIGHT = 0;
export const FOOTER_HEIGHT = 0;

// Ограничения для высоты ряда
export const MIN_ROW_HEIGHT = 15; // минимальная высота ряда при 100%
export const MAX_ROW_HEIGHT = 60; // максимальная высота (если очень мало рядов)

// Минимальная ширина события для видимости (в процентах)
export const MIN_EVENT_WIDTH = 0.5;

// Цвета для категорий событий (приглушённые, пастельные тона)
export const CATEGORY_COLORS: Record<EventCategory, string> = {
  education: '#93c5fd', // голубой светлый
  work: '#86efac', // зелёный светлый
  travel: '#fcd34d', // жёлтый/оранжевый светлый
  personal: '#c4b5fd', // фиолетовый светлый
  other: '#9ca3af', // серый светлый
};

// Названия категорий на русском
export const CATEGORY_LABELS: Record<EventCategory, string> = {
  education: 'Учёба',
  work: 'Работа',
  travel: 'Путешествия',
  personal: 'Личное',
  other: 'Другое',
};

// Конфигурация полей группировки
export const GROUPING_FIELD_CONFIG: Record<GroupingField, { label: string }> = {
  title: { label: 'Название' },
  category: { label: 'Категория' },
};

// Доступные масштабы размера
export const ZOOM_SCALES: readonly ZoomScale[] = [
  50, 80, 100, 150, 200,
] as const;

// Значения по умолчанию
export const DEFAULT_ZOOM_SCALE: ZoomScale = 100;
export const DEFAULT_GROUPING_FIELDS: GroupingField[] = ['title'];

// Ключи для localStorage
export const STORAGE_KEY = 'life-calendar-events';
export const STORAGE_KEY_ZOOM = 'life-calendar-zoom';
export const STORAGE_KEY_GROUPING = 'life-calendar-grouping';

// Конфигурация шрифтов для событий
export interface EventFontConfig {
  fontSize: string; // tailwind class или custom size
  padding: string; // tailwind padding class
  paddingLeft?: string; // inline style padding-left в px
  lineHeight?: string; // tailwind line-height class
}

type ViewModeFontConfig = {
  [zoomScale: number]: EventFontConfig;
};

// Конфигурация размеров шрифта для событий в зависимости от масштаба
export const EVENT_FONT_CONFIG: ViewModeFontConfig = {
  50: {
    fontSize: 'text-[3px]',
    padding: '',
    paddingLeft: '4px',
    lineHeight: 'leading-none',
  },
  80: {
    fontSize: 'text-[4px]',
    padding: '',
    paddingLeft: '4px',
    lineHeight: 'leading-tight',
  },
  100: {
    fontSize: 'text-[10px]',
    padding: '',
    paddingLeft: '4px',
    lineHeight: 'leading-tight',
  },
  150: {
    fontSize: 'text-[6px]',
    padding: '',
    paddingLeft: '4px',
    lineHeight: 'leading-tight',
  },
  200: {
    fontSize: 'text-[8px]',
    padding: '',
    paddingLeft: '4px',
    lineHeight: 'leading-tight',
  },
};

// Конфигурация цветов текста для событий
// Определяет, какой цвет текста использовать в зависимости от яркости фона
export const EVENT_TEXT_COLOR_CONFIG = {
  // Для светлых фонов (lightness >= 60%)
  light: {
    className: 'text-gray-900', // темный текст
    color: '#111827', // gray-900
  },
  // Для темных фонов (lightness < 60%)
  dark: {
    className: 'text-white', // светлый текст
    color: '#ffffff', // white
  },
} as const;
