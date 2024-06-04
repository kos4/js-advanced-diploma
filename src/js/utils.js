/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns string - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  let result = 'center';
  const sq = boardSize * boardSize;

  if (index >= 0 && index < boardSize) {
    result = 'top';
  } else if (index >= sq - boardSize && index < sq) {
    result = 'bottom';
  }

  if (index % boardSize === 0) {
    if (result !== 'center') {
      result += '-left';
    } else {
      result = 'left';
    }
  } else if ((index + 1) % boardSize === 0) {
    if (result !== 'center') {
      result += '-right';
    } else {
      result = 'right';
    }
  }

  return result;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function getInfoCharacter(character) {
  return `🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`;
}
