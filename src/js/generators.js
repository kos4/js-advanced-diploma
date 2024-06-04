import Team from "./Team";

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    yield new allowedTypes[getRandomInRange(0, allowedTypes.length - 1)](getRandomInRange(1, maxLevel));
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const characters = [];
  const charGen = characterGenerator(allowedTypes, maxLevel);

  while (characterCount > 0) {
    characters.push(charGen.next().value);
    characterCount -= 1;
  }

  return new Team(characters);
}

export function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getPositions(boardSize) {
  const positions = {
    player: [],
    mobs: [],
  };
  let num = 0

  for (let i = 0; i < boardSize; i += 1) {
    num = boardSize * i;
    positions.player.push(num);
    positions.player.push(num + 1);
    positions.mobs.push(num + boardSize - 1);
    positions.mobs.push(num + boardSize - 2);
  }

  return positions;
}
