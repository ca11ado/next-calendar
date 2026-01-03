import { EVENT_FONT_CONFIG, EventFontConfig } from '../constants';
import { ZoomScale } from '../types';

/**
 * Находит ближайший доступный масштаб в конфигурации
 * Приоритет: ближайший меньший, если нет - ближайший больший
 */
function findNearestZoomScale(
  targetZoom: number,
  availableZooms: number[]
): number {
  if (availableZooms.length === 0) {
    throw new Error('No available zoom scales in configuration');
  }

  // Если точное совпадение есть, используем его
  if (availableZooms.includes(targetZoom)) {
    return targetZoom;
  }

  // Сортируем доступные масштабы по возрастанию
  const sortedZooms = [...availableZooms].sort((a, b) => a - b);

  // Ищем ближайший меньший
  const smaller = sortedZooms.filter((zoom) => zoom < targetZoom);
  if (smaller.length > 0) {
    return smaller[smaller.length - 1]; // последний (самый большой) из меньших
  }

  // Если нет меньших, берём ближайший больший
  const larger = sortedZooms.filter((zoom) => zoom > targetZoom);
  if (larger.length > 0) {
    return larger[0]; // первый (самый маленький) из больших
  }

  // Фолбек на первый доступный (не должно произойти)
  return sortedZooms[0];
}

/**
 * Получает конфигурацию шрифта для события с умным фолбеком
 * @param zoomScale - масштаб
 * @returns конфигурация шрифта
 */
export function getEventFontConfig(zoomScale: ZoomScale): EventFontConfig {
  // Получаем список доступных масштабов
  const availableZooms = Object.keys(EVENT_FONT_CONFIG).map(Number);

  // Находим ближайший масштаб
  const nearestZoom = findNearestZoomScale(zoomScale, availableZooms);

  // Возвращаем конфигурацию
  return EVENT_FONT_CONFIG[nearestZoom];
}
