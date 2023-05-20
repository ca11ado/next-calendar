import { format, getDaysInMonth } from 'date-fns';

export interface Block {
  id: string;
  day: number;
  formattedDate: string;
}

const generateBlocks = (): Block[] => {
  const currentDate = new Date();
  const daysInMonth = getDaysInMonth(currentDate);

  const blocks: Block[] = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const formattedDate = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd');
    return {
      id: `block-${day}`,
      day,
      formattedDate,
    };
  });

  return blocks;
};

export default generateBlocks;
