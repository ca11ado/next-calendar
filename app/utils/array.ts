export function createArrayFromNumber(number: number) {
  return Array.from({ length: number }, (_, index) => index + 1);
}
