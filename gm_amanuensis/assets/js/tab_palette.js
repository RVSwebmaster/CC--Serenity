export const TAB_COLOR_PALETTE = [
  '#78d0be',
  '#d7a55a',
  '#6fa8dc',
  '#d98fa8',
  '#8ecf74',
  '#c8a4ff',
  '#f08f6b',
  '#7fc3d8'
];

export function pickNextTabColor(existingColors = []) {
  const counts = new Map(TAB_COLOR_PALETTE.map((color) => [color, 0]));

  existingColors.forEach((color) => {
    if (counts.has(color)) {
      counts.set(color, counts.get(color) + 1);
    }
  });

  return TAB_COLOR_PALETTE.reduce((bestColor, color) => {
    if (counts.get(color) < counts.get(bestColor)) {
      return color;
    }
    return bestColor;
  }, TAB_COLOR_PALETTE[0]);
}
