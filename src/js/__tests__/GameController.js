import {checkPositionMoving, getRadiusAttack} from "../utils";

test.each([
  [27, 4, 'top-left', [0, 9, 18]],
  [27, 4, 'top-right', [6, 13, 20]],
  [27, 4, 'top', [3, 11, 19]],
  [27, 2, 'bottom-left', [34, 41]],
  [27, 2, 'bottom-right', [36, 45]],
  [27, 2, 'bottom', [35, 43]],
  [27, 1, 'right', [28]],
  [27, 1, 'left', [26]],
])('check moving player: position %i, distance: %i, moving: %s', (index, dist, title,expected) => {
  const position = checkPositionMoving(expected[Math.floor(Math.random() * expected.length)], index, dist, 8);
    expect(position).toBeTruthy();
});

test.each([
  [27, 2, 36, true],
  [27, 2, 42, true],
  [27, 4, 20, true],
  [27, 4, 12, true],
  [27, 4, 63, true],
  [27, 1, 9, false],
  [27, 2, 3, false],
  [27, 2, 0, false],
])('check radius attack player: position %i, distance: %i, attack: %i', (pos, dist, attack, expected) => {
  const listAttack = getRadiusAttack(pos, dist);
  expect(listAttack.includes(attack)).toBe(expected);
});
