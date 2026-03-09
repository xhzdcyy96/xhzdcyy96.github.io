// 游戏配置

export const gameConfig = {
  width: 800,
  height: 600,
  tileSize: 40,
  player: {
    startingMoney: 1000,
    startingLives: 10
  },
  wave: {
    initialEnemies: 5,
    enemyIncrement: 2,
    timeBetweenWaves: 3000
  }
};

// 游戏路径点
export const path = [
  { x: 0, y: 220 },
  { x: 200, y: 220 },
  { x: 200, y: 140 },
  { x: 400, y: 140 },
  { x: 400, y: 300 },
  { x: 600, y: 300 },
  { x: 600, y: 220 },
  { x: 800, y: 220 }
];
