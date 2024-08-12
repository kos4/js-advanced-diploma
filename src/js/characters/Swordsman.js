import Character from "../Character";

export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman');
    this.attack = /*40*/1000;
    this.defence = /*10*/1000;
    this.distance = 4;
    this.distanceAttack = 1;
  }
}
