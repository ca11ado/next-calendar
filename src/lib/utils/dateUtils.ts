import {
  differenceInDays,
  startOfYear,
  endOfYear,
  isLeapYear as dateFnsIsLeapYear,
  getYear,
} from 'date-fns';

/**
 * Проверяет, является ли год високосным
 */
export function isLeapYear(year: number): boolean {
  return dateFnsIsLeapYear(new Date(year, 0, 1));
}

/**
 * Возвращает количество дней в году
 */
export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Возвращает номер дня в году (1-365 или 1-366)
 */
export function getDayOfYear(date: Date): number {
  const yearStart = startOfYear(date);
  return differenceInDays(date, yearStart) + 1;
}

/**
 * Возвращает количество дней между двумя датами
 */
export function getDaysBetween(startDate: Date, endDate: Date): number {
  return differenceInDays(endDate, startDate);
}

/**
 * Возвращает год из даты
 */
export function getYearFromDate(date: Date): number {
  return getYear(date);
}

/**
 * Возвращает начало года для заданной даты
 */
export function getStartOfYear(date: Date): Date {
  return startOfYear(date);
}

/**
 * Возвращает конец года для заданной даты
 */
export function getEndOfYear(date: Date): Date {
  return endOfYear(date);
}

/**
 * Проверяет, находится ли дата в пределах года
 */
export function isDateInYear(date: Date, year: number): boolean {
  return getYear(date) === year;
}

/**
 * Возвращает массив годов между двумя датами (включительно)
 */
export function getYearsBetween(startDate: Date, endDate: Date): number[] {
  const startYear = getYear(startDate);
  const endYear = getYear(endDate);
  const years: number[] = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
}

/**
 * Возвращает дату окончания события или текущую дату, если событие продолжается
 */
export function getEventEndDate(endDate: Date | null): Date {
  return endDate || new Date();
}

/**
 * Создает Date из строки формата YYYY-MM-DD в локальном часовом поясе (без сдвига UTC)
 * Используется для форм ввода, чтобы избежать проблем с часовыми поясами
 */
export function parseDateFromString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Конвертирует Date в строку формата YYYY-MM-DD в локальном часовом поясе
 * Используется для форм ввода, чтобы избежать проблем с часовыми поясами
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
