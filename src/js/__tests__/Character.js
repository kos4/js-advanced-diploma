import Character from "../Character";
import Bowman from "../characters/Bowman";
import Swordsman from "../characters/Swordsman";
import Magician from "../characters/Magician";
import Vampire from "../characters/Vampire";
import Undead from "../characters/Undead";
import Daemon from "../characters/Daemon";

test('check that an instance of the Characters class is not created', () => {
  expect(() => {
    new Character(3, 'bowman');
  }).toThrow();
});

test('check create new character', () => {
  const char = new Bowman(1);
  expect(char).toEqual({
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'bowman',
  });
});

test.each([
  [Swordsman, 1, {
    level: 1,
    attack: 40,
    defence: 10,
    health: 50,
    type: 'swordsman',
  }],
  [Bowman, 1, {
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'bowman',
  }],
  [Magician, 1, {
    level: 1,
    attack: 10,
    defence: 40,
    health: 50,
    type: 'magician',
  }],
  [Daemon, 1, {
    level: 1,
    attack: 10,
    defence: 40,
    health: 50,
    type: 'daemon',
  }],
  [Undead, 1, {
    level: 1,
    attack: 40,
    defence: 10,
    health: 50,
    type: 'undead',
  }],
  [Vampire, 1, {
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'vampire',
  }],
])('check create new character %s %i уровня', (className, lvl, expected) => {
  expect(new className(lvl)).toEqual(expected);
});
