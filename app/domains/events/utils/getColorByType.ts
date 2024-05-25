import { Event } from "../types/Event";

const colors = [
  "#6B8E23", // Olive Drab
  "#4682B4", // Steel Blue
  "#D2691E", // Chocolate
  "#8FBC8F", // Dark Sea Green
  "#CD5C5C", // Indian Red
  "#20B2AA", // Light Sea Green
  "#7B68EE", // Medium Slate Blue
  "#DB7093", // Pale Violet Red
  "#B8860B", // Dark Goldenrod
  "#708090", // Slate Gray
];
function getRandomColor() {
  return () => {
    if (!colors.length) {
      throw new Error("Not enough colors, should create more");
    }
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors.splice(randomIndex, 1)[0];
  };
}

export const getColorByType = (type: Event["type"]) => {
  switch (type) {
    case "work": {
      return colors[0];
    }
    case "study": {
      return colors[1];
    }
    case "travel": {
      return colors[2];
    }
    default: {
      throw new Error(`Color is not defined for type: ${type}`);
    }
  }
};

export const getColorsByTypeV2 = (
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
