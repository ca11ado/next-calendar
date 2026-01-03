import React, { useState } from 'react';
import { LifeEvent, AppSettings } from '@/lib/types';
import { exportEventsToJSON } from '@/lib/utils/exportUtils';
import { IconButton } from '@/components/ui/IconButton';
import { DownloadIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';

interface ExportButtonProps {
  events: LifeEvent[];
  settings?: AppSettings;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg'; // для обратной совместимости, но не используется
}

export function ExportButton({
  events,
  settings,
  iconOnly = false,
}: ExportButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [includeSettings, setIncludeSettings] = useState(false);

  const handleClick = () => {
    if (events.length === 0) {
      alert('Нет событий для экспорта');
      return;
    }

    setShowDialog(true);
  };

  const handleConfirmExport = () => {
    try {
      exportEventsToJSON(
        events,
        includeSettings && settings ? settings : undefined
      );
      setShowDialog(false);
      setIncludeSettings(false);
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
      alert('Произошла ошибка при экспорте событий');
    }
  };

  const handleCancelExport = () => {
    setShowDialog(false);
    setIncludeSettings(false);
  };

  return (
    <>
      <IconButton
        icon={<DownloadIcon />}
        onClick={handleClick}
        title="Экспортировать события в JSON"
        text={!iconOnly ? 'Экспорт' : undefined}
        variant="neutral"
        size="compact"
      />

      {/* Диалог настроек экспорта */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Экспорт событий
            </h2>

            <p className="text-gray-700 mb-4">
              Будет экспортировано <strong>{events.length}</strong>{' '}
              {events.length === 1
                ? 'событие'
                : events.length < 5
                  ? 'события'
                  : 'событий'}
              .
            </p>

            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSettings}
                  onChange={(e) => setIncludeSettings(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    Включить настройки
                  </div>
                  <div className="text-sm text-gray-600">
                    Экспортировать настройки масштаба, группировки, начального
                    года и цветов событий
                  </div>
                  {settings && includeSettings && settings.colors && (
                    <div className="text-xs text-gray-500 mt-1">
                      Будет сохранено{' '}
                      {Object.keys(settings.colors.colorMapping).length}{' '}
                      цветовых настроек
                    </div>
                  )}
                </div>
              </label>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={handleCancelExport}>
                Отмена
              </Button>
              <Button variant="primary" onClick={handleConfirmExport}>
                Экспортировать
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
