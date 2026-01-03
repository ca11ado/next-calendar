import { useState, useCallback, useEffect } from 'react';
import { GroupingField } from '../types';
import { DEFAULT_GROUPING_FIELDS, STORAGE_KEY_GROUPING } from '../constants';

interface UseGroupingFieldsReturn {
  groupingFields: GroupingField[];
  toggleField: (field: GroupingField) => void;
  setGroupingFields: (fields: GroupingField[]) => void;
  resetGroupingFields: () => void;
}

/**
 * Hook для управления полями группировки событий
 * Позволяет выбирать несколько полей для группировки (title, category)
 */
export function useGroupingFields(): UseGroupingFieldsReturn {
  const [groupingFields, setGroupingFields] = useState<GroupingField[]>(
    DEFAULT_GROUPING_FIELDS
  );

  // Загружаем сохраненное значение при монтировании
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GROUPING);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Проверяем, что все элементы являются валидными GroupingField
          const validFields: GroupingField[] = parsed.filter(
            (field): field is GroupingField =>
              field === 'title' || field === 'category'
          );
          if (validFields.length > 0) {
            setGroupingFields(validFields);
          }
        }
      } catch (e) {
        // Игнорируем ошибки парсинга
        console.error('Ошибка при загрузке настроек группировки:', e);
      }
    }
  }, []);

  // Сохраняем при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GROUPING, JSON.stringify(groupingFields));
  }, [groupingFields]);

  /**
   * Переключает выбранное поле (добавляет или удаляет)
   */
  const toggleField = useCallback((field: GroupingField) => {
    setGroupingFields((prev) => {
      if (prev.includes(field)) {
        // Убираем поле, но оставляем хотя бы одно
        return prev.length > 1 ? prev.filter((f) => f !== field) : prev;
      } else {
        // Добавляем поле
        return [...prev, field];
      }
    });
  }, []);

  /**
   * Сбрасывает поля группировки к значению по умолчанию
   */
  const resetGroupingFields = useCallback(() => {
    setGroupingFields(DEFAULT_GROUPING_FIELDS);
  }, []);

  return {
    groupingFields,
    toggleField,
    setGroupingFields,
    resetGroupingFields,
  };
}
