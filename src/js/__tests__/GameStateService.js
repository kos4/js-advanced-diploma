import GameStateService from '../GameStateService';

jest.mock('../GameStateService');

beforeEach(() => {
  jest.resetAllMocks();
});

test('should success fetch data', () => {
  const json = '{"step":"player","gameOver":false,"score":2,"round":3,"mobsTeam":[{"level":2,"attack":58.5,"defence":58.5,"health":100,"type":"vampire","distance":2,"distanceAttack":2,"mob":true,"position":39,"radiusAttack":[29,30,31,37,38,45,46,47,53,54,55,61,62,63]},{"level":4,"attack":303.26399999999995,"defence":75.81599999999999,"health":100,"type":"undead","distance":4,"distanceAttack":1,"mob":true,"position":58,"radiusAttack":[57,59],"movingPositions":[63,61,60,59,58,54,46,38,30,53,44,35,26]},{"level":3,"attack":105.3,"defence":105.3,"health":100,"type":"vampire","distance":2,"distanceAttack":2,"mob":true,"position":31,"radiusAttack":[21,22,23,29,30,37,38,39,45,46,47,53,54,55]}],"playerTeam":[{"level":3,"attack":2150.064,"defence":2150.064,"health":100,"type":"swordsman","distance":4,"distanceAttack":1,"className":"Swordsman","position":14,"radiusAttack":[13,15,21,22,23,29,30,31]},{"level":4,"attack":2340,"defence":2340,"health":100,"type":"swordsman","distance":4,"distanceAttack":1,"className":"Swordsman","position":56,"radiusAttack":[48,49,57]},{"level":4,"attack":23.4,"defence":93.6,"health":100,"type":"magician","distance":1,"distanceAttack":4,"className":"Magician","position":16,"radiusAttack":[0,1,2,3,4,8,9,10,11,12,17,18,19,20,24,25,26,27,28,32,33,34,35,36,40,41,42,43,44,48,49,50,51,52]}]}';
  const state = JSON.parse(json);
  const gameStateService = new GameStateService(json);
  gameStateService.load.mockResolvedValue(state);

  return gameStateService.load().then(data => expect(data).toEqual(state));
});

beforeEach(() => {
  jest.resetAllMocks();
});

test('should fail fetch data', () => {
  const json = '{"step":"player","gameOver":false,"score":2,"round":3,"mobsTeam":[{"level":2,"attack":58.5,"defence":58.5,"health":100,"type":"vampire","distance":2,"distanceAttack":2,"mob":true,"position":39,"radiusAttack":[29,30,31,37,38,45,46,47,53,54,55,61,62,63]},{"level":4,"attack":303.26399999999995,"defence":75.81599999999999,"health":100,"type":"undead","distance":4,"distanceAttack":1,"mob":true,"position":58,"radiusAttack":[57,59],"movingPositions":[63,61,60,59,58,54,46,38,30,53,44,35,26]},{"level":3,"attack":105.3,"defence":105.3,"health":100,"type":"vampire","distance":2,"distanceAttack":2,"mob":true,"position":31,"radiusAttack":[21,22,23,29,30,37,38,39,45,46,47,53,54,55]}],"playerTeam":[{"level":3,"attack":2150.064,"defence":2150.064,"health":100,"type":"swordsman","distance":4,"distanceAttack":1,"className":"Swordsman","position":14,"radiusAttack":[13,15,21,22,23,29,30,31]},{"level":4,"attack":2340,"defence":2340,"health":100,"type":"swordsman","distance":4,"distanceAttack":1,"className":"Swordsman","position":56,"radiusAttack":[48,49,57]},{"level":4,"attack":23.4,"defence":93.6,"health":100,"type":"magician","distance":1,"distanceAttack":4,"className":"Magician","position":16,"radiusAttack":[0,1,2,3,4,8,9,10,11,12,17,18,19,20,24,25,26,27,28,32,33,34,35,36,40,41,42,43,44,48,49,50,51,52]}]}';
  const state = JSON.parse(json);
  const gameStateService = new GameStateService(json);
  gameStateService.load.mockResolvedValue(new Error('Invalid state'));

  return gameStateService.load().then(data => expect(data).toEqual(new Error('Invalid state')));
});
