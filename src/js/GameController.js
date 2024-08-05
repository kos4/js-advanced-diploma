import themes from "./themes";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import {generateTeam, getPositions, getRandomInRange} from "./generators";
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

    if (this.checkPositionPlayer(index)) {
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
    this.renderingTeam(positions);
  }

  renderingTeam(positions) {
    const positionedCharacter = [];
    this.playerTeam.characters.forEach(character => {
      let position = getRandomInRange(0, positions.player.length - 1);
      character.position = positions.player[position];
      character.radiusAttack = getRadiusAttack(character.position, character.distanceAttack);
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
}
