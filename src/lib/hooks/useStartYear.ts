import { useState, useEffect } from 'react';

const STORAGE_KEY = 'life-calendar-start-year';

// Дефолтный год: текущий год минус 35 лет (середина 70-летнего периода)
const getDefaultStartYear = () => {
  const currentYear = new Date().getFullYear();
  return currentYear - 35;
};

export function useStartYear() {
  const [startYear, setStartYear] = useState<number>(getDefaultStartYear());

  // Загружаем сохраненное значение при монтировании
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const year = parseInt(saved, 10);
      // Загружаем сохраненный год без валидации - он важнее текущего диапазона
      if (!isNaN(year)) {
        setStartYear(year);
      }
    }
  }, []);

  // Сохраняем при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, startYear.toString());
  }, [startYear]);

  return { startYear, setStartYear };
}
