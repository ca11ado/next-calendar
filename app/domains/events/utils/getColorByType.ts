import { Event } from "../types/Event";

function getRandomColor() {
  const colors = [
    "#FFC0CB",
    "#FFD700",
    "#90EE90",
    "#87CEEB",
    "#BA55D3",
    "#07988c",
    "#9c0025",
    "#77011d",
    "#d209ed",
    "#52055c",
    "#e308ff",
  ];
  return () => {
    if (!colors.length) {
      throw new Error("Not enough colors, should create more");
    }
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors.splice(randomIndex, 1)[0];
  };
}

export const getColorsByType = (
  events: Event[]
): Record<Event["type"], string> => {
  const getColor = getRandomColor();
  return events
    .map(({ type }) => type)
    .reduce<Record<Event["type"], string>>((accum, current) => {
      accum[current] = accum[current] || getColor();
      return accum;
    }, {});
};
