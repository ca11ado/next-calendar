// Категории событий
export type EventCategory =
  | 'education'
  | 'work'
  | 'travel'
  | 'personal'
  | 'other';

// Единицы времени для горизонтальной детализации
export type TimeUnit = 'days' | 'weeks' | 'months';

// Масштаб размера календаря (50% = уменьшенный, 80%/100% = без скролла, 150%/200% = со скроллом)
export type ZoomScale = 50 | 80 | 100 | 150 | 200;

// Поля для группировки событий
export type GroupingField = 'title' | 'category';

// Базовое событие жизни
export interface LifeEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date | null; // null = текущее/продолжающееся событие
  category: EventCategory;
  color?: string; // опциональный кастомный цвет
  description?: string;
}

// Сегмент события - часть события с определенными параметрами отображения
export interface EventSegment {
  startX: number; // начало сегмента в процентах (0-100)
  width: number; // ширина сегмента в процентах
  subRow: number; // номер подряда в этом сегменте
  totalSubRows: number; // общее количество подрядов в этом сегменте
}

// Событие с рассчитанными позициями для отображения
export interface PositionedEvent extends LifeEvent {
  row: number; // номер горизонтального ряда ВНУТРИ года
  startX: number; // X позиция в процентах (0-100) - для обратной совместимости
  width: number; // ширина в процентах - для обратной совместимости
  subRow?: number; // номер подряда внутри ряда (для view-a, когда события делят высоту)
  totalSubRows?: number; // общее количество подрядов в ряду (для view-a)
  segments?: EventSegment[]; // массив сегментов для динамической высоты (view-a)
}

// Данные года с событиями и компоновкой
export interface YearData {
  year: number;
  events: PositionedEvent[];
  rowCount: number; // количество рядов, необходимых году
  height: number; // высота года в пикселях (с учётом zoomScale)
  yOffset: number; // Y смещение от начала таймлайна в пикселях
}

// Конфигурация таймлайна
export interface TimelineConfig {
  birthDate: Date;
  lifeSpanYears: number;
  timeUnit: TimeUnit; // влияет на горизонтальную детализацию
  zoomScale: ZoomScale; // влияет на вертикальный размер
  viewportHeight: number; // высота видимой области
}

// Настройки цветов для экспорта/импорта
export interface ColorSettings {
  colorOffset: number;
  colorMapping: Record<string, string>; // маппинг ключей группировки на цвета
}

// Настройки приложения для экспорта/импорта
export interface AppSettings {
  zoomScale: ZoomScale;
  groupingFields: GroupingField[];
  startYear: number;
  colors?: ColorSettings;
}
