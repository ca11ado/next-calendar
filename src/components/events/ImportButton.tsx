import React, { useRef, useState } from 'react';
import { LifeEvent, AppSettings } from '@/lib/types';
import { importEventsFromJSON } from '@/lib/utils/importUtils';
import { IconButton } from '@/components/ui/IconButton';
import { UploadIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';

export type ImportMode = 'replace' | 'merge';

interface ImportButtonProps {
  currentEvents: LifeEvent[];
  onImport: (
    events: LifeEvent[],
    mode: ImportMode,
    settings?: AppSettings
  ) => void;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg'; // для обратной совместимости, но не используется
}

export function ImportButton({
  currentEvents,
  onImport,
  iconOnly = false,
}: ImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingEvents, setPendingEvents] = useState<LifeEvent[]>([]);
  const [pendingSettings, setPendingSettings] = useState<
    AppSettings | undefined
  >();
  const [selectedMode, setSelectedMode] = useState<ImportMode>('replace');
  const [applySettings, setApplySettings] = useState(true);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { events, settings } = await importEventsFromJSON(file);

      // Показываем диалог выбора режима импорта
      setPendingEvents(events);
      setPendingSettings(settings);
      setApplySettings(!!settings); // Включаем чекбокс по умолчанию, если настройки есть
      setShowDialog(true);
    } catch (error) {
      console.error('Ошибка при импорте:', error);
      alert(
        'Ошибка при импорте: ' +
          (error instanceof Error ? error.message : 'Неизвестная ошибка')
      );
    }

    // Сбрасываем input чтобы можно было импортировать тот же файл снова
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = () => {
    onImport(
      pendingEvents,
      selectedMode,
      applySettings && pendingSettings ? pendingSettings : undefined
    );
    setShowDialog(false);
    setPendingEvents([]);
    setPendingSettings(undefined);
    setApplySettings(true);

    const eventsMessage =
      selectedMode === 'replace'
        ? `Успешно импортировано ${pendingEvents.length} событий`
        : `Добавлено ${pendingEvents.length} событий к существующим ${currentEvents.length}`;

    const settingsMessage =
      applySettings && pendingSettings ? '\nНастройки применены' : '';

    alert(eventsMessage + settingsMessage);
  };

  const handleCancelImport = () => {
    setShowDialog(false);
    setPendingEvents([]);
    setPendingSettings(undefined);
    setApplySettings(true);
  };

  return (
    <>
      <IconButton
        icon={<UploadIcon />}
        onClick={handleClick}
        title="Импортировать события из JSON"
        text={!iconOnly ? 'Импорт' : undefined}
        variant="neutral"
        size="compact"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Диалог выбора режима импорта */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Импорт событий
            </h2>

            <p className="text-gray-700 mb-4">
              Найдено <strong>{pendingEvents.length}</strong> событий для
              импорта.
              {currentEvents.length > 0 && (
                <>
                  {' '}
                  У вас уже есть <strong>{currentEvents.length}</strong>{' '}
                  событий.
                </>
              )}
            </p>

            <div className="space-y-3 mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={selectedMode === 'replace'}
                  onChange={(e) =>
                    setSelectedMode(e.target.value as ImportMode)
                  }
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    Заменить все события
                  </div>
                  <div className="text-sm text-gray-600">
                    Удалить все текущие события и импортировать новые
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={selectedMode === 'merge'}
                  onChange={(e) =>
                    setSelectedMode(e.target.value as ImportMode)
                  }
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    Объединить события
                  </div>
                  <div className="text-sm text-gray-600">
                    Добавить новые события к существующим
                  </div>
                </div>
              </label>
            </div>

            {/* Чекбокс для импорта настроек */}
            {pendingSettings && (
              <div className="border-t border-gray-200 pt-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applySettings}
                    onChange={(e) => setApplySettings(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      Применить настройки из файла
                    </div>
                    <div className="text-sm text-gray-600">
                      Масштаб: {pendingSettings.zoomScale}%, Группировка:{' '}
                      {pendingSettings.groupingFields.join(', ')}, Год:{' '}
                      {pendingSettings.startYear}
                    </div>
                    {pendingSettings.colors && (
                      <div className="text-xs text-gray-500 mt-1">
                        +{' '}
                        {
                          Object.keys(pendingSettings.colors.colorMapping)
                            .length
                        }{' '}
                        цветовых настроек
                      </div>
                    )}
                  </div>
                </label>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={handleCancelImport}>
                Отмена
              </Button>
              <Button variant="primary" onClick={handleConfirmImport}>
                Импортировать
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
