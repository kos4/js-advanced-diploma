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

export function checkPositionMoving(idCursor, idActive, limit, size = 8) {
  let result;
  let diff = Math.abs(idCursor - idActive);
  const mod = idCursor % size;

  const diagDiffKoef = Math.abs(
    Math.floor(idCursor / size) - Math.floor(idActive / size)
  )

  // vertical
  if (mod - (idActive % size) === 0 && diff / size <= limit) {
    result = diff / size;
  }

  // horisontal
  if (Math.floor(idCursor / size) === Math.floor(idActive / size) && diff <= limit) {
    result = diff;
  }

  //left diagonal
  if (diff === (size - 1) * diagDiffKoef && diff / (size - 1) <= limit) {
    result = diff / (size - 1)
  }

  //right diagonal
  if (diff === (size + 1) * diagDiffKoef && diff / (size + 1) <= limit) {
    result = diff / (size + 1)
  }

  return result;
}

export function getRadiusAttack(cur_pos, dist) {
  const size = 8;
  const list = [];

  const pos_x = (cur_pos - 1) % size + 1 >= size ? 0 : (cur_pos - 1) % size + 1;
  const pos_y = Math.floor((cur_pos - 1)/size) + 1;

  const start_x = (pos_x - dist >= 0) ? pos_x - dist : 0;
  const start_y = (pos_y - dist >= 0) ? pos_y - dist : 0;
  const end_x = (pos_x + dist < size) ? pos_x + dist : size - 1;
  const end_y = (pos_y + dist < size) ? pos_y + dist : size - 1;

  for (let y = start_y; y <= end_y; y++) {
    for (let x = start_x; x <= end_x; x++) {
      let res = y * size + x;

      if (res !== cur_pos) {
        list.push(res);
      }

    }
  }

  return list;
}
