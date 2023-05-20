import { Event } from '@/types/Event';

function generateEvents(day: number): Event[] {
  const eventCount = Math.floor(Math.random() * 10) + 1; // Рандомное количество событий от 1 до 10

  const eventTexts = [
    'Событие 1',
    'Событие 2',
    'Событие 3',
    'Событие 4',
    'Событие 5',
    'Событие 6',
    'Событие 7',
    'Событие 8',
    'Событие 9',
    'Событие 10',
  ]; // Разные тексты событий

  // Перемешиваем массив текстов событий
  const shuffledEventTexts = eventTexts.sort(() => Math.random() - 0.5);

  return Array.from({ length: eventCount }, (_, index) => {
    const id = `event-${day}-${index}`;
    const name = shuffledEventTexts[index % eventTexts.length];

    return { id, name };
  });
}

export default generateEvents;
