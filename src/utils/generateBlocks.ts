import { format, getDaysInMonth } from 'date-fns';
import generateEvents from './getRandomEvents';
import { Event } from '@/types/Event';

export interface Block {
  id: string;
  events: Array<Event>;
  formattedDate: string;
}

const generateMockedDays = (): Block[] => {
  const currentDate = new Date();
  const daysInMonth = getDaysInMonth(currentDate);

  const blocks: Block[] = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const formattedDate = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd');
    return {
      id: `block-${day}`,
      events: generateEvents(day),
      formattedDate,
    };
  });

  return blocks;
};

export default generateMockedDays;
