import React, { useMemo, useState } from 'react';
import { GroupingField, LifeEvent } from '@/lib/types';
import {
  getConsistentColor,
  generateGroupingKey,
  generateGroupingLabel,
  getAvailableColorsByCategory,
} from '@/lib/utils/colorUtils';
import { RefreshIcon } from '@/components/ui/icons';
import { ColorPicker } from '@/components/ui/ColorPicker';

interface LegendProps {
  events: LifeEvent[];
  groupingFields: GroupingField[];
  onHighlight?: (label: string | null) => void;
  onRegenerateColor?: (key: string) => void;
  onSelectColor?: (key: string, color: string) => void;
  colorOffset?: number; // Для принудительного обновления цветов
}

interface LegendItem {
  label: string;
  color: string;
  key: string; // Уникальный ключ для сопоставления
}

export function Legend({
  events,
  groupingFields,
  onHighlight,
  onRegenerateColor,
  onSelectColor,
  colorOffset,
}: LegendProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [colorPickerItem, setColorPickerItem] = useState<string | null>(null);
  const [colorPickerAnchor, setColorPickerAnchor] =
    useState<HTMLElement | null>(null);

  // Вычисляем элементы легенды на основе groupingFields
  const legendItems = useMemo<LegendItem[]>(() => {
    // Показываем уникальные комбинации на основе groupingFields
    const uniqueGroups = new Map<string, LifeEvent>();

    // Собираем уникальные группы
    events.forEach((event) => {
      const key = generateGroupingKey(event, groupingFields);
      if (!uniqueGroups.has(key)) {
        uniqueGroups.set(key, event);
      }
    });

    // Генерируем элементы легенды
    return Array.from(uniqueGroups.entries())
      .map(([key, event]) => ({
        label: generateGroupingLabel(event, groupingFields),
        color: getConsistentColor(key),
        key,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    // colorOffset нужен для пересчета цветов после regenerateSingleColor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, groupingFields, colorOffset]);

  // Если нет элементов для отображения
  if (legendItems.length === 0) {
    return null;
  }

  // Получаем доступные цвета для палитры, организованные по категориям
  const availableColors = getAvailableColorsByCategory(colorOffset);

  return (
    <>
      <div className="space-y-2">
        {legendItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 -mx-1 px-1 py-0.5 rounded transition-colors relative group"
            onMouseEnter={() => {
              onHighlight?.(item.key);
              setHoveredItem(item.key);
            }}
            onMouseLeave={() => {
              onHighlight?.(null);
              setHoveredItem(null);
            }}
          >
            <div
              className="w-3 h-3 rounded flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-shadow"
              style={{ backgroundColor: item.color }}
              onClick={(e) => {
                e.stopPropagation();
                setColorPickerItem(item.key);
                setColorPickerAnchor(e.currentTarget as HTMLElement);
              }}
              title="Выбрать цвет"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setColorPickerItem(item.key);
                  setColorPickerAnchor(e.currentTarget as HTMLElement);
                }
              }}
            />
            <span className="text-xs text-gray-700 leading-tight flex-1">
              {item.label}
            </span>
            {/* Иконка регенерации, видна только при hover */}
            {hoveredItem === item.key && onRegenerateColor && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRegenerateColor(item.key);
                }}
                className="flex-shrink-0 p-0.5 hover:bg-gray-200 rounded transition-colors"
                title="Переназначить цвет"
                aria-label="Переназначить цвет"
              >
                <RefreshIcon className="w-3 h-3 text-gray-600" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ColorPicker popup */}
      {colorPickerItem && onSelectColor && (
        <ColorPicker
          availableColors={availableColors}
          onSelectColor={(color) => {
            onSelectColor(colorPickerItem, color);
            setColorPickerItem(null);
            setColorPickerAnchor(null);
          }}
          onClose={() => {
            setColorPickerItem(null);
            setColorPickerAnchor(null);
          }}
          anchorEl={colorPickerAnchor}
        />
      )}
    </>
  );
}
