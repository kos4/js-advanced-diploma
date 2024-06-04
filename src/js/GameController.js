import themes from "./themes";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import {generateTeam, getPositions, getRandomInRange} from "./generators";
import PositionedCharacter from "./PositionedCharacter";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";
import Daemon from "./characters/Daemon";
import {getInfoCharacter} from "./utils";
import GamePlay from "./GamePlay";
import cursors from "./cursors";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positions = [];
    this.classesPlayer = [Bowman, Swordsman, Magician];
    this.selectChar = null;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    this.gamePlay.drawUi(themes.next().value);
    this.playerTeam = generateTeam(this.classesPlayer, 2, 3);
    this.mobsTeam = generateTeam([Vampire, Undead, Daemon], 2, 3);
    this.renderingTeamInit();
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  onCellClick(index) {
    // TODO: react to click

    if (this.checkPositionPlayer(index, true)) {
      this.playerTeam.characters.forEach(item => {
        this.gamePlay.deselectCell(item.position);
      });
      this.gamePlay.selectCell(index);
    } else {
      GamePlay.showError('Вы выбираете не своего персонажа.');
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    let cursor = 'auto';
    if (this.positions.includes(index)) {
      const character = this.getCharacterByPosition(index);
      this.gamePlay.showCellTooltip(getInfoCharacter(character), index);

      if (this.isCharacterPlayer(character)) {
        cursor = 'pointer';
      } else {
        cursor = 'notallowed';
      }

      this.gamePlay.setCursor(cursors[cursor]);
    } else {
      if (this.selectChar) {
        if (this.selectChar.positionsMoving.includes(index)) {
          this.gamePlay.selectCell(index, 'green');
          this.gamePlay.setCursor(cursors.pointer);
        }
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.positions.includes(index)) {
      this.gamePlay.hideCellTooltip(index);
      this.gamePlay.setCursor(cursors.auto);
    } else {
      this.gamePlay.deselectCell(index);
      this.gamePlay.setCursor(cursors.auto);
    }
  }

  renderingTeamInit() {
    const positions = getPositions(this.gamePlay.boardSize);
    this.renderingTeam(positions);
  }

  renderingTeam(positions) {
    const positionedCharacter = [];
    this.playerTeam.characters.forEach(character => {
      let position = getRandomInRange(0, positions.player.length - 1);
      character.position = positions.player[position];
      character.positionsMoving = this.setPositionsMoving(character);
      this.positions.push(character.position);
      positionedCharacter.push(new PositionedCharacter(character, positions.player[position]));
      positions.player.splice(position, 1);
    });
    this.mobsTeam.characters.forEach(character => {
      let position = getRandomInRange(0, positions.mobs.length - 1);
      character.position = positions.mobs[position];
      this.positions.push(character.position);
      positionedCharacter.push(new PositionedCharacter(character, positions.mobs[position]));
      positions.mobs.splice(position, 1);
    });
    this.gamePlay.redrawPositions(positionedCharacter);
  }

  getCharacterByPosition(position) {
    const characters = this.playerTeam.characters.concat(this.mobsTeam.characters);
    for (let i = 0; i < characters.length; i += 1) {
      if (characters[i].position === position) {
        return characters[i];
      }
    }
  }

  checkPositionPlayer(index, write = false) {
    if (this.positions.includes(index)) {
      const character = this.getCharacterByPosition(index);
      const result = this.isCharacterPlayer(character);

      if (result) {
        this.selectChar = character;
      }

      return result;
    }

    return false;
  }

  isCharacterPlayer(character) {
    for (let i = 0; i < this.classesPlayer.length; i += 1) {
      if (character instanceof this.classesPlayer[i]) {
        return true;
      }
    }

    return false;
  }

  setPositionsMoving(charecter) {
    const result = [];
    const mixMaxPos = this.getMinMaxPosRow(charecter.position);
    const max = this.gamePlay.boardSize * this.gamePlay.boardSize - 1;

    //горизонталь вправо
    for (let i = 1; i <= charecter.distance; i += 1) {
      const pos = charecter.position + i;
      if (pos <= mixMaxPos.max) {
        result.push(pos);
      }
    }

    //горизонталь влево
    for (let i = 1; i <= charecter.distance; i += 1) {
      const pos = charecter.position - i;
      if (pos >= mixMaxPos.min) {
        result.push(pos);
      }
    }

    //вертикаль вниз
    for (let i = 1; i <= charecter.distance; i += 1) {
      const pos = charecter.position + i * this.gamePlay.boardSize;
      if (pos <= max) {
        result.push(pos);
      }
    }

    //вертикаль вверх
    for (let i = 1; i <= charecter.distance; i += 1) {
      const pos = charecter.position - i * this.gamePlay.boardSize;
      if (pos >= 0) {
        result.push(pos);
      }
    }

    //диагональ вправо вниз
    for (let i = 1; i <= charecter.distance; i += 1) {
      const pos = charecter.position + i + i * this.gamePlay.boardSize;
      if (pos <= max && pos <= mixMaxPos.max + i * this.gamePlay.boardSize - 1) {
        result.push(pos);
      }
    }

    //диагональ влево вниз
    for (let i = 1; i <= charecter.distance; i += 1) {
      const pos = charecter.position - i + i * this.gamePlay.boardSize;
      if (pos <= max && pos >= mixMaxPos.min + i * this.gamePlay.boardSize) {
        result.push(pos);
      }
    }

    //диагональ вправо вверх
    for (let i = 1; i <= charecter.distance; i += 1) {
      const pos = charecter.position + i - i * this.gamePlay.boardSize;
      if (pos >= 0 && pos <= mixMaxPos.max - i * this.gamePlay.boardSize - 1) {
        result.push(pos);
      }
    }

    //диагональ влево вверх
    for (let i = 1; i <= charecter.distance; i += 1) {
      const pos = charecter.position - i - i * this.gamePlay.boardSize;
      if (pos >= 0 && pos >= mixMaxPos.min - i * this.gamePlay.boardSize) {
        result.push(pos);
      }
    }

    return result;
  }

  getMinMaxPosRow(index) {
    return {
      min: Math.floor(index / this.gamePlay.boardSize) * this.gamePlay.boardSize,
      max: (Math.floor(index / this.gamePlay.boardSize) + 1) * this.gamePlay.boardSize - 1,
    }
  }
}
