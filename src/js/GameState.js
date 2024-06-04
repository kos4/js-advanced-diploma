export default class GameState {
  #state = {
    step: 'player',
  };
  static from(object) {
    // TODO: create object
    this.#state = object;
    return null;
  }

  static getState () {
    return this.#state;
  }
}
