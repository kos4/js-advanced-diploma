import themes from "./themes";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import {generateTeam, getPositions, getPositionsChar, getRandomInRange} from "./generators";
import PositionedCharacter from "./PositionedCharacter";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";
import Daemon from "./characters/Daemon";
import {getInfoCharacter, checkPositionMoving, getRadiusAttack} from "./utils";
import GamePlay from "./GamePlay";
import cursors from "./cursors";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positions = [];
    this.classesPlayer = [Bowman, Swordsman, Magician];
    this.selectChar = null;
    this.move = 'player';
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

    if (this.move === 'mobs') {
      GamePlay.showError('Сейчас ход противника.');
      return;
    }

    if (this.checkPositionPlayer(index)) {
      this.playerTeam.characters.forEach(item => {
        this.gamePlay.deselectCell(item.position);
      });
      this.gamePlay.selectCell(index);
    } else {
      if (this.selectChar) {
        if (checkPositionMoving(index, this.selectChar.position, this.selectChar.distance, this.gamePlay.boardSize) && !this.positions.includes(index)) {
          this.movingCharacter(index);
        } else if (this.positions.includes(index)) {
          this.attackCharacter(index);
        }

        this.ai();
      } else {
        GamePlay.showError('Вы выбираете не своего персонажа.');
      }
    }
  }

  attackCharacter(index) {
    const target = this.getCharacterByPosition(index)
    const damage = Math.max(this.selectChar.attack - target.defence, this.selectChar.attack * 0.1);
    target.health -= damage;
    const showDamage = this.gamePlay.showDamage(index, damage);
    showDamage.then(() => {
      const positionedCharacter = this.getNewPositions();

      this.gamePlay.redrawPositions(positionedCharacter);
      this.gamePlay.deselectCell(this.selectChar.position);
      this.selectChar = null;
    });
    this.move = 'mobs';
  }

  getNewPositions() {
    const positionedCharacter = [];

    this.playerTeam.characters.forEach(item => positionedCharacter.push(new PositionedCharacter(item, item.position)));
    this.mobsTeam.characters.forEach(item => positionedCharacter.push(new PositionedCharacter(item, item.position)));

    return positionedCharacter;
  }

  movingCharacter(index) {
    const currentPosition = this.selectChar.position;
    this.selectChar.position = index;
    this.positions = this.positions.map(item => item === currentPosition ? index : item);
    this.selectChar.radiusAttack = getRadiusAttack(index, this.selectChar.distanceAttack);
    this.selectChar.position = index;
    this.gamePlay.deselectCell(currentPosition);
    this.gamePlay.deselectCell(index);

    const positionedCharacter = this.getNewPositions();

    this.gamePlay.redrawPositions(positionedCharacter);
    this.selectChar = null;
    this.move = 'mobs';
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    let cursor = 'auto';
    if (this.positions.includes(index)) {
      const character = this.getCharacterByPosition(index);
      this.gamePlay.showCellTooltip(getInfoCharacter(character), index);

      if (this.selectChar) {
        if (this.checkAttack(index)) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor(cursors.crosshair);
        }
      } else {
        if (this.isCharacterPlayer(character)) {
          cursor = 'pointer';
        } else {
          cursor = 'notallowed';
        }
        this.gamePlay.setCursor(cursors[cursor]);
      }
    } else {
      if (this.selectChar) {
        if (checkPositionMoving(index, this.selectChar.position, this.selectChar.distance, this.gamePlay.boardSize)) {
          this.gamePlay.selectCell(index, 'green');
          this.gamePlay.setCursor(cursors.pointer);
        }
      }
    }
  }

  checkAttack(index) {
    const positions = [];
    this.mobsTeam.characters.forEach(item => positions.push(item.position));

    return this.selectChar.radiusAttack.includes(index) && positions.includes(index);
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.positions.includes(index)) {
      this.gamePlay.hideCellTooltip(index);
      this.gamePlay.setCursor(cursors.auto);

      if (this.getCharacterByPosition(index).mob) {
        this.gamePlay.deselectCell(index);
      }
    } else {
      this.gamePlay.deselectCell(index);
      this.gamePlay.setCursor(cursors.auto);
    }
  }

  renderingTeamInit() {
    const positions = getPositions(this.gamePlay.boardSize);
    const posPlayer = this.renderingTeam(positions, 'player');
    const posMobs = this.renderingTeam(positions, 'mobs');

    this.gamePlay.redrawPositions([...posPlayer, ...posMobs]);
  }

  renderingTeam(positions, type) {
    const positionedCharacter = [];
    const characters = type === 'mobs' ? this.mobsTeam.characters : this.playerTeam.characters;
    characters.forEach(character => {
      let position = getRandomInRange(0, positions[type].length - 1);
      character.position = positions[type][position];
      character.radiusAttack = getRadiusAttack(character.position, character.distanceAttack);
      this.positions.push(character.position);
      positionedCharacter.push(new PositionedCharacter(character, positions[type][position]));
      positions[type].splice(position, 1);
    });

    return positionedCharacter;
  }

  getCharacterByPosition(position) {
    const characters = this.playerTeam.characters.concat(this.mobsTeam.characters);
    for (let i = 0; i < characters.length; i += 1) {
      if (characters[i].position === position) {
        return characters[i];
      }
    }
  }

  checkPositionPlayer(index) {
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

  ai() {
    if (this.move !== 'mobs') return;

    //выбор моба и цели.
    const select = this.aiSelect();

    if (select.action === 'attack') {
      this.attackAi(select);
    } else {
      this.movingAi(select);
    }
  }

  aiSelect() {
    // выбираем самого ближайшего
    let selected = null;

    this.mobsTeam.characters.forEach((mob, mobKey) => {
      if (selected) return;

      this.playerTeam.characters.forEach((player, playerKey) => {
        if (mob.radiusAttack.includes(player.position)) {
          selected = {
            action: 'attack',
            mob: this.mobsTeam.characters[mobKey],
            player: this.playerTeam.characters[playerKey],
          };
          return false;
        }
      });
    });

    if (!selected) {
      selected = {
        action: 'move',
        mob: 0,
        player: 0,
      };
      this.mobsTeam.characters.forEach((mob, mobKey) => {
        this.playerTeam.characters.forEach((player, playerKey) => {
          if (Math.abs(mob.position - player.position) < Math.abs(this.mobsTeam.characters[selected.mob].position - this.playerTeam.characters[selected.player].position)) {
            selected.mob = mobKey;
            selected.player = playerKey;
          }
        });
      });

      selected.mob = this.mobsTeam.characters[selected.mob];
      selected.player = this.playerTeam.characters[selected.player];
    }

    return selected;
  }

  attackAi(selectChar) {
    const {mob, player} = selectChar;
    const damage = Math.max(mob.attack - player.defence, mob.attack * 0.1);
    player.health -= damage;

    const showDamage = this.gamePlay.showDamage(player.position, damage);
    showDamage.then(() => {
      const positionedCharacter = this.getNewPositions();

      this.gamePlay.redrawPositions(positionedCharacter);

      this.move = 'player';
    });
  }

  movingAi(selectChar) {
    const {mob, player} = selectChar;
    let newPosition = null;
    mob.movingPositions = this.setAiPositionsMoving(mob);

    mob.movingPositions.forEach(pos => {
      if (newPosition === null || (Math.abs(pos - player.position) < Math.abs(newPosition - player.position) && !this.positions.includes(pos))) {
        newPosition = pos;
      }
    });

    this.positions = this.positions.map(item => item === mob.position ? newPosition : item);
    mob.radiusAttack = getRadiusAttack(newPosition, mob.distanceAttack);
    mob.position = newPosition;

    const positionedCharacter = this.getNewPositions();

    this.gamePlay.redrawPositions(positionedCharacter);
    this.move = 'player';
  }

  setAiPositionsMoving(charecter) {
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
