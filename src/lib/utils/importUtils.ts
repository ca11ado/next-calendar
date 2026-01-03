import {
  LifeEvent,
  EventCategory,
  AppSettings,
  ZoomScale,
  GroupingField,
} from '../types';
import { v4 as uuidv4 } from 'uuid';
import { ZOOM_SCALES } from '../constants';

interface ImportData {
  version?: string;
  exportDate?: string;
  events: unknown[];
  settings?: unknown;
}

export interface ImportResult {
  events: LifeEvent[];
  settings?: AppSettings;
}

/**
 * Проверяет, является ли значение валидной категорией
 */
function isValidCategory(value: unknown): value is EventCategory {
  return (
    typeof value === 'string' &&
    ['education', 'work', 'travel', 'personal', 'other'].includes(value)
  );
}

/**
 * Парсит дату из ISO строки как локальную дату (без учета часовых поясов)
 * Извлекает только год, месяц и день
 */
function parseDateFromISO(dateString: string): Date | null {
  // Парсим ISO string, извлекая компоненты даты
  const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      0,
      0,
      0,
      0
    );
    // Проверяем, что дата валидна
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return null;
}

/**
 * Валидирует и преобразует импортированное событие
 */
function validateEvent(eventData: unknown): LifeEvent | null {
  if (typeof eventData !== 'object' || eventData === null) {
    return null;
  }

  const event = eventData as Record<string, unknown>;

  // Обязательные поля
  if (
    typeof event.title !== 'string' ||
    !event.title ||
    typeof event.startDate !== 'string' ||
    !isValidCategory(event.category)
  ) {
    return null;
  }

  const startDate = parseDateFromISO(event.startDate);
  if (startDate === null) {
    return null;
  }

  let endDate: Date | null = null;
  if (event.endDate !== null && event.endDate !== undefined) {
    if (typeof event.endDate === 'string') {
      endDate = parseDateFromISO(event.endDate);
      if (endDate === null) {
        return null;
      }
    } else {
      return null;
    }
  }

  return {
    id: typeof event.id === 'string' ? event.id : uuidv4(),
    title: event.title,
    startDate,
    endDate,
    category: event.category,
    color: typeof event.color === 'string' ? event.color : undefined,
    description:
      typeof event.description === 'string' ? event.description : undefined,
  };
}

/**
 * Валидирует настройки цветов
 */
function validateColorSettings(
  colorsData: unknown
): { colorOffset: number; colorMapping: Record<string, string> } | null {
  if (typeof colorsData !== 'object' || colorsData === null) {
    return null;
  }

  const colors = colorsData as Record<string, unknown>;

  // Валидация colorOffset
  const colorOffset =
    typeof colors.colorOffset === 'number' &&
    colors.colorOffset >= 0 &&
    colors.colorOffset < 360
      ? colors.colorOffset
      : null;

  // Валидация colorMapping
  let colorMapping: Record<string, string> | null = null;
  if (typeof colors.colorMapping === 'object' && colors.colorMapping !== null) {
    const mapping = colors.colorMapping as Record<string, unknown>;
    const validMapping: Record<string, string> = {};
    let hasValidEntries = false;

    for (const [key, value] of Object.entries(mapping)) {
      if (typeof key === 'string' && typeof value === 'string') {
        validMapping[key] = value;
        hasValidEntries = true;
      }
    }

    if (hasValidEntries) {
      colorMapping = validMapping;
    }
  }

  // Если есть хотя бы offset или маппинг, возвращаем настройки
  if (colorOffset !== null || colorMapping !== null) {
    return {
      colorOffset: colorOffset ?? 48,
      colorMapping: colorMapping ?? {},
    };
  }

  return null;
}

/**
 * Валидирует настройки
 */
function validateSettings(settingsData: unknown): AppSettings | null {
  if (typeof settingsData !== 'object' || settingsData === null) {
    return null;
  }

  const settings = settingsData as Record<string, unknown>;

  // Валидация zoomScale
  const zoomScale =
    typeof settings.zoomScale === 'number' &&
    ZOOM_SCALES.includes(settings.zoomScale as ZoomScale)
      ? (settings.zoomScale as ZoomScale)
      : null;

  // Валидация groupingFields
  let groupingFields: GroupingField[] | null = null;
  if (Array.isArray(settings.groupingFields)) {
    const validFields = settings.groupingFields.filter(
      (field): field is GroupingField =>
        field === 'title' || field === 'category'
    );
    if (validFields.length > 0) {
      groupingFields = validFields;
    }
  }

  // Валидация startYear
  const startYear =
    typeof settings.startYear === 'number' &&
    settings.startYear > 1900 &&
    settings.startYear < 2200
      ? settings.startYear
      : null;

  // Валидация colors
  let colors: {
    colorOffset: number;
    colorMapping: Record<string, string>;
  } | null = null;
  if (settings.colors) {
    colors = validateColorSettings(settings.colors);
  }

  // Если хотя бы одно поле валидно, возвращаем настройки
  if (
    zoomScale !== null ||
    groupingFields !== null ||
    startYear !== null ||
    colors !== null
  ) {
    return {
      zoomScale: zoomScale ?? 100,
      groupingFields: groupingFields ?? ['title'],
      startYear: startYear ?? new Date().getFullYear() - 35,
      ...(colors && { colors }),
    };
  }

  return null;
}

/**
 * Импортирует события из JSON файла
 */
export async function importEventsFromJSON(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as ImportData;

        if (!data.events || !Array.isArray(data.events)) {
          reject(new Error('Неверный формат файла: отсутствует массив events'));
          return;
        }

        const validEvents: LifeEvent[] = [];
        const errors: string[] = [];

        data.events.forEach((eventData, index) => {
          const validatedEvent = validateEvent(eventData);
          if (validatedEvent) {
            validEvents.push(validatedEvent);
          } else {
            errors.push(`Событие #${index + 1} содержит неверные данные`);
          }
        });

        if (validEvents.length === 0) {
          reject(
            new Error(
              'Не найдено валидных событий в файле. Ошибки: ' +
                errors.join(', ')
            )
          );
          return;
        }

        if (errors.length > 0) {
          console.warn('Импортированы не все события:', errors);
        }

        // Валидируем настройки, если они есть
        let validSettings: AppSettings | undefined;
        if (data.settings) {
          validSettings = validateSettings(data.settings) ?? undefined;
        }

        resolve({
          events: validEvents,
          settings: validSettings,
        });
      } catch (error) {
        reject(
          new Error(
            'Ошибка парсинга JSON: ' +
              (error instanceof Error ? error.message : 'Неизвестная ошибка')
          )
        );
      }
    };

    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };

    reader.readAsText(file);
  });
}
