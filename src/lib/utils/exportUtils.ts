import { LifeEvent, AppSettings } from '../types';

interface ExportData {
  version: string;
  exportDate: string;
  events: LifeEvent[];
  settings?: AppSettings;
}

/**
 * Экспортирует события в JSON файл и скачивает его
 */
export function exportEventsToJSON(
  events: LifeEvent[],
  settings?: AppSettings
): void {
  const data: ExportData = {
    version: '1.1',
    exportDate: new Date().toISOString(),
    events,
    ...(settings && { settings }),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `life-calendar-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
