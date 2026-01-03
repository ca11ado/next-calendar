'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LifeEvent, PositionedEvent, AppSettings } from '@/lib/types';
import { LIFE_SPAN_YEARS } from '@/lib/constants';
import { useEvents } from '@/lib/hooks/useEvents';
import { useZoom } from '@/lib/hooks/useZoom';
import { useViewport } from '@/lib/hooks/useViewport';
import { useGroupingFields } from '@/lib/hooks/useGroupingFields';
import { useStartYear } from '@/lib/hooks/useStartYear';
import { generateTestEvents } from '@/lib/testData';
import { Timeline } from '@/components/calendar/Timeline';
import { ZoomControls } from '@/components/calendar/ZoomControls';
import { GroupingFieldsControls } from '@/components/calendar/GroupingFieldsControls';
import { StartYearModal } from '@/components/calendar/StartYearModal';
import { Legend } from '@/components/calendar/Legend';
import { EventModal } from '@/components/events/EventModal';
import { EventDetails } from '@/components/events/EventDetails';
import { ExportButton } from '@/components/events/ExportButton';
import { ImportButton, ImportMode } from '@/components/events/ImportButton';
import { IconButton } from '@/components/ui/IconButton';
import { PlusIcon, FullscreenIcon, RefreshIcon } from '@/components/ui/icons';
import {
  regenerateColorPalette,
  regenerateSingleColor,
  setColorForKey,
  exportColorState,
  importColorState,
} from '@/lib/utils/colorUtils';

export default function HomePage() {
  const { events, addEvent, updateEvent, deleteEvent, setEvents } = useEvents();
  const { zoomScale, setZoomScale } = useZoom();
  const { groupingFields, toggleField, setGroupingFields } =
    useGroupingFields();
  const { startYear, setStartYear } = useStartYear();
  const { height: viewportHeight } = useViewport();

  // Модалки
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<LifeEvent | null>(null);

  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(true);

  // Состояние для обновления цветов (используется для форсирования перерисовки)
  const [colorOffset, setColorOffset] = useState(0);

  // Создаем объект настроек для экспорта
  const appSettings: AppSettings = {
    zoomScale,
    groupingFields,
    startYear,
    colors: exportColorState(colorOffset),
  };

  // Состояние fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Состояние для подсветки событий из легенды
  const [highlightedLegendItem, setHighlightedLegendItem] = useState<
    string | null
  >(null);

  // Состояние для модального окна выбора года
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [yearModalAnchor, setYearModalAnchor] = useState<HTMLElement | null>(
    null
  );

  // Загрузка тестовых данных при первом запуске
  useEffect(() => {
    const initializeData = async () => {
      // Небольшая задержка для имитации загрузки
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (events.length === 0) {
        const testEvents = generateTestEvents();
        setEvents(testEvents);
      }
      setIsLoading(false);
    };

    initializeData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Обработчики событий
  const handleEventClick = useCallback((event: PositionedEvent) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  }, []);

  const handleAddEvent = useCallback(
    (data: Omit<LifeEvent, 'id'>) => {
      addEvent(data);
    },
    [addEvent]
  );

  const handleEditEvent = useCallback(
    (data: Omit<LifeEvent, 'id'>) => {
      if (selectedEvent) {
        updateEvent(selectedEvent.id, data);
        setIsDetailsModalOpen(false);
      }
    },
    [selectedEvent, updateEvent]
  );

  const handleDeleteEvent = useCallback(() => {
    if (selectedEvent) {
      if (
        window.confirm(
          `Вы уверены, что хотите удалить событие "${selectedEvent.title}"?`
        )
      ) {
        deleteEvent(selectedEvent.id);
        setIsDetailsModalOpen(false);
        setSelectedEvent(null);
      }
    }
  }, [selectedEvent, deleteEvent]);

  const handleOpenEditFromDetails = useCallback(() => {
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(true);
  }, []);

  const handleImport = useCallback(
    (importedEvents: LifeEvent[], mode: ImportMode, settings?: AppSettings) => {
      if (mode === 'replace') {
        setEvents(importedEvents);
      } else {
        // Объединяем события: существующие + новые
        setEvents([...events, ...importedEvents]);
      }

      // Применяем настройки, если они переданы
      if (settings) {
        setZoomScale(settings.zoomScale);
        setGroupingFields(settings.groupingFields);
        setStartYear(settings.startYear);

        // Применяем настройки цветов
        if (settings.colors) {
          importColorState(settings.colors);
          setColorOffset(settings.colors.colorOffset);
        }
      }
    },
    [setEvents, events, setZoomScale, setGroupingFields, setStartYear]
  );

  const handleColorRefresh = useCallback(() => {
    // Генерируем случайный offset от 0 до 360
    const newOffset = Math.floor(Math.random() * 360);
    regenerateColorPalette(newOffset);
    setColorOffset(newOffset); // Изменяем state для форсирования перерисовки
  }, []);

  const handleRegenerateColor = useCallback((key: string) => {
    regenerateSingleColor(key);
    // Форсируем перерисовку, изменяя colorOffset
    setColorOffset((prev) => prev + 1);
  }, []);

  const handleSelectColor = useCallback((key: string, color: string) => {
    setColorForKey(key, color);
    // Форсируем перерисовку, изменяя colorOffset
    setColorOffset((prev) => prev + 1);
  }, []);

  // Вход в fullscreen режим
  const enterFullscreen = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Ошибка при входе в fullscreen:', err);
      });
    }
  }, []);

  // Выход из fullscreen режима
  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.error('Ошибка при выходе из fullscreen:', err);
      });
    }
  }, []);

  // Отслеживаем изменения fullscreen состояния
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const currentYear = new Date().getFullYear();
  const endYear = startYear + LIFE_SPAN_YEARS - 1;

  // Fullscreen режим
  if (isFullscreen) {
    return (
      <div className="relative h-screen w-screen bg-gray-900">
        {/* Кнопка выхода из fullscreen */}
        <button
          onClick={exitFullscreen}
          className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white text-gray-700 rounded-full p-3 shadow-lg transition-all hover:scale-110"
          aria-label="Выйти из полноэкранного режима"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Календарь в fullscreen */}
        <div className="w-full h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">Загрузка календаря...</p>
              </div>
            </div>
          ) : viewportHeight > 0 ? (
            <Timeline
              key={colorOffset}
              events={events}
              zoomScale={zoomScale}
              viewportHeight={viewportHeight}
              groupingFields={groupingFields}
              startYear={startYear}
              onEventClick={handleEventClick}
              highlightedLegendItem={highlightedLegendItem}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-white">Инициализация...</p>
            </div>
          )}
        </div>

        {/* Модалки работают и в fullscreen */}
        <EventModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddEvent}
        />

        {selectedEvent && (
          <>
            <EventModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              event={selectedEvent}
              onSubmit={handleEditEvent}
            />

            <EventDetails
              isOpen={isDetailsModalOpen}
              onClose={() => {
                setIsDetailsModalOpen(false);
                setSelectedEvent(null);
              }}
              event={selectedEvent}
              onEdit={handleOpenEditFromDetails}
              onDelete={handleDeleteEvent}
            />
          </>
        )}
      </div>
    );
  }

  // Обычный режим с sidebar
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Левая колонка - Sidebar с контролами */}
      <aside className="w-1/5 min-w-[300px] max-w-[320px] bg-white border-r border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {/* Заголовок */}
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            Календарь жизни
          </h1>

          {/* Секция: Действия */}
          <div className="mb-6">
            <h2 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Действия
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-normal text-gray-500 mb-2">
                  События
                </h3>
                <div className="flex gap-2">
                  <IconButton
                    icon={<PlusIcon />}
                    onClick={() => setIsAddModalOpen(true)}
                    title="Добавить новое событие"
                    variant="accent"
                    size="wide"
                  />
                  <ExportButton
                    events={events}
                    settings={appSettings}
                    iconOnly
                    size="md"
                  />
                  <ImportButton
                    currentEvents={events}
                    onImport={handleImport}
                    iconOnly
                    size="md"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-normal text-gray-500 mb-2">
                  Режимы
                </h3>
                <div className="flex gap-2">
                  <IconButton
                    icon={<FullscreenIcon />}
                    onClick={enterFullscreen}
                    title="Полноэкранный режим"
                    variant="neutral"
                    size="compact"
                  />
                  <IconButton
                    icon={<RefreshIcon />}
                    onClick={handleColorRefresh}
                    title="Перегенерировать цвета"
                    variant="neutral"
                    size="compact"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Секция: Настройки */}
          <div className="mb-6">
            <h2 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Настройки
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-normal text-gray-500 mb-2">
                  Группировка
                </h3>
                <GroupingFieldsControls
                  selectedFields={groupingFields}
                  onToggleField={toggleField}
                />
              </div>

              <div>
                <h3 className="text-xs font-normal text-gray-500 mb-2">
                  Размер
                </h3>
                <ZoomControls
                  currentZoom={zoomScale}
                  onZoomChange={setZoomScale}
                />
              </div>
            </div>
          </div>

          {/* Секция: Информация */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h2 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Информация
            </h2>
            <div className="text-xs text-gray-600 space-y-2">
              <div>
                <span className="text-gray-500">Текущий год:</span>{' '}
                <span className="font-semibold text-gray-900">
                  {currentYear}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div>
                  <span className="text-gray-500">
                    Календарь ({LIFE_SPAN_YEARS} лет):
                  </span>{' '}
                  <span className="font-semibold text-gray-900">
                    {startYear}–{endYear}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    setYearModalAnchor(e.currentTarget);
                    setIsYearModalOpen(true);
                  }}
                  className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Изменить год начала календаря"
                  aria-label="Изменить год начала календаря"
                >
                  <svg
                    className="w-3 h-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Секция: Легенда */}
          {!isLoading && (
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Легенда
              </h2>
              <Legend
                events={events}
                groupingFields={groupingFields}
                onHighlight={setHighlightedLegendItem}
                onRegenerateColor={handleRegenerateColor}
                onSelectColor={handleSelectColor}
                colorOffset={colorOffset}
              />
            </div>
          )}
        </div>
      </aside>

      {/* Правая колонка - Календарь */}
      <main className="flex-1 overflow-hidden flex items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка календаря...</p>
          </div>
        ) : viewportHeight > 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <Timeline
              key={colorOffset}
              events={events}
              zoomScale={zoomScale}
              viewportHeight={viewportHeight}
              groupingFields={groupingFields}
              startYear={startYear}
              onEventClick={handleEventClick}
              highlightedLegendItem={highlightedLegendItem}
            />
          </div>
        ) : (
          <p className="text-gray-500">Инициализация...</p>
        )}
      </main>

      {/* Модалки */}
      <EventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEvent}
      />

      {selectedEvent && (
        <>
          <EventModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            event={selectedEvent}
            onSubmit={handleEditEvent}
          />

          <EventDetails
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedEvent(null);
            }}
            event={selectedEvent}
            onEdit={handleOpenEditFromDetails}
            onDelete={handleDeleteEvent}
          />
        </>
      )}

      {/* Модальное окно выбора года */}
      {isYearModalOpen && (
        <StartYearModal
          currentYear={currentYear}
          startYear={startYear}
          onSelectYear={setStartYear}
          onClose={() => setIsYearModalOpen(false)}
          anchorEl={yearModalAnchor}
        />
      )}
    </div>
  );
}
