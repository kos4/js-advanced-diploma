import {calcTileType, getInfoCharacter} from '../utils';

test.each([
  [0, 8, 'top-left'],
  [7, 8, 'top-right'],
  [3, 8, 'top'],
  [56, 8, 'bottom-left'],
  [63, 8, 'bottom-right'],
  [60, 8, 'bottom'],
  [31, 8, 'right'],
  [24, 8, 'left'],
  [44, 8, 'center'],
])('calcTileType get border index %i boardSize %i', (index, boardSize, expected) => {
  expect(calcTileType(index, boardSize)).toBe(expected);
});

test('check get info character', () => {
  const char = {
    attack: 40,
    defence: 10,
    health: 50,
    level: 2,
    position: 41,
    type: "swordsman",
  }
  expect(getInfoCharacter(char)).toBe('🎖2 ⚔40 🛡10 ❤50');
});
