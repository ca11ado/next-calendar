export function calculateSquareSizeV1(
  screenWidth: number,
  screenHeight: number,
  padding: number,
  totalSquares: number
) {
  const idealRowSize = Math.floor(Math.sqrt(totalSquares));
  const numRows = Math.ceil(totalSquares / idealRowSize);

  const totalHorizontalPadding = (idealRowSize - 1) * padding;
  const totalVerticalPadding = (numRows - 1) * padding;

  const availableWidth = screenWidth - totalHorizontalPadding;
  const availableHeight = screenHeight - totalVerticalPadding;

  const squareWidth = availableWidth / idealRowSize;
  const squareHeight = availableHeight / numRows;

  return Math.min(squareWidth, squareHeight);
}

export function calculateSquareSize(
  screenWidth: number,
  screenHeight: number,
  padding: number,
  totalSquares: number
) {
  let idealRowSize = Math.floor(Math.sqrt(totalSquares)); // Предполагаемое количество квадратов в ряду
  let numRows = Math.ceil(totalSquares / idealRowSize); // Рассчитываем количество рядов

  // Проверяем, равно ли произведение количества рядов и колонок общему количеству квадратов
  while (idealRowSize * numRows < totalSquares) {
    idealRowSize++; // Увеличиваем количество колонок до достижения нужного значения
  }

  const totalHorizontalPadding = (idealRowSize - 1) * padding;
  const totalVerticalPadding = (numRows - 1) * padding;

  const availableWidth = screenWidth - totalHorizontalPadding;
  const availableHeight = screenHeight - totalVerticalPadding;

  const squareWidth = availableWidth / idealRowSize;
  const squareHeight = availableHeight / numRows;

  return Math.min(squareWidth, squareHeight);
}
