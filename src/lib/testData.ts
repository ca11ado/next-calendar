import { LifeEvent } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Генерирует тестовые события для демонстрации функциональности
 */
export function generateTestEvents(): LifeEvent[] {
  return [
    // Школа
    {
      id: uuidv4(),
      title: 'Средняя школа №15',
      startDate: new Date(1996, 8, 1), // 1 сентября 1996
      endDate: new Date(2007, 5, 25), // 25 июня 2007
      category: 'education',
      description: 'Среднее образование',
    },

    // Университет
    {
      id: uuidv4(),
      title: 'МГУ им. Ломоносова',
      startDate: new Date(2007, 8, 1), // 1 сентября 2007
      endDate: new Date(2012, 5, 30), // 30 июня 2012
      category: 'education',
      description: 'Факультет компьютерных наук',
    },

    // Подработка во время учёбы (параллельно с университетом)
    {
      id: uuidv4(),
      title: 'Фриланс программист',
      startDate: new Date(2010, 2, 1), // 1 марта 2010
      endDate: new Date(2012, 2, 31), // 31 марта 2012
      category: 'work',
      description: 'Веб-разработка на фрилансе',
    },

    // Первая работа
    {
      id: uuidv4(),
      title: 'Junior Developer - StartupTech',
      startDate: new Date(2012, 6, 1), // 1 июля 2012
      endDate: new Date(2015, 11, 31), // 31 декабря 2015
      category: 'work',
      description: 'Первая полноценная работа после университета',
    },

    // Путешествие во время смены работы
    {
      id: uuidv4(),
      title: 'Путешествие по Европе',
      startDate: new Date(2016, 0, 10), // 10 января 2016
      endDate: new Date(2016, 1, 20), // 20 февраля 2016
      category: 'travel',
      description: 'Месячное путешествие между работами',
    },

    // Вторая работа
    {
      id: uuidv4(),
      title: 'Middle Developer - TechCorp',
      startDate: new Date(2016, 2, 1), // 1 марта 2016
      endDate: new Date(2019, 8, 30), // 30 сентября 2019
      category: 'work',
      description: 'Рост до Middle разработчика',
    },

    // Короткая поездка во время работы
    {
      id: uuidv4(),
      title: 'Конференция в Берлине',
      startDate: new Date(2018, 5, 15), // 15 июня 2018
      endDate: new Date(2018, 5, 22), // 22 июня 2018
      category: 'travel',
      description: 'Рабочая поездка на конференцию',
    },

    // Третья работа (текущая)
    {
      id: uuidv4(),
      title: 'Senior Developer - BigCompany',
      startDate: new Date(2019, 9, 1), // 1 октября 2019
      endDate: null, // текущее событие
      category: 'work',
      description: 'Текущее место работы',
    },

    // Личное событие (параллельно с работой)
    {
      id: uuidv4(),
      title: 'Курсы MBA',
      startDate: new Date(2021, 8, 1), // 1 сентября 2021
      endDate: new Date(2023, 5, 30), // 30 июня 2023
      category: 'personal',
      description: 'Вечерняя программа MBA',
    },

    // Недавнее путешествие
    {
      id: uuidv4(),
      title: 'Отпуск в Японии',
      startDate: new Date(2024, 3, 1), // 1 апреля 2024
      endDate: new Date(2024, 3, 20), // 20 апреля 2024
      category: 'travel',
      description: 'Весенний отпуск',
    },
  ];
}
