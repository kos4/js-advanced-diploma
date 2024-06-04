import {characterGenerator, generateTeam} from "../generators";
import Swordsman from "../characters/Swordsman";
import Bowman from "../characters/Bowman";
import Magician from "../characters/Magician";

test('check generator new characters', () => {
  const count = 100;
  const classList = {
    swordsman: Swordsman,
    bowman: Bowman,
    magician: Magician,
  };
  let cnt = 0;

  for (let i = count; i > 0; i -= 1) {
    let char = characterGenerator(Object.values(classList), 4).next();
    if (char.value instanceof classList[char.value.type]) {
      cnt += 1;
    }
  }

  expect(cnt).toBe(count);
});

test('check team', () => {
  const quantityChars = 3;
  const maxLvl = 4;
  const team = generateTeam([Swordsman, Bowman, Magician], maxLvl, quantityChars);
  let result = true;

  if (team.characters.length !== quantityChars) {
    result = false;
  }

  for (let i = 0; i < team.characters.length; i += 1) {
    if (team.characters[i].level > maxLvl || team.characters[i].level < 1) {
      result = false;
      break;
    }
  }

  expect(result).toBeTruthy();
});
