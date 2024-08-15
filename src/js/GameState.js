export default class GameState {
  #state = {
    step: 'player',
    gameOver: false,
    score: 0,
    round: 1,
  };
  from(object) {
    // TODO: create object
    this.#state = object;
    return null;
  }

  getState () {
    return this.#state;
  }
}
