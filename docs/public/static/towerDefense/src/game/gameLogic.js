// 游戏逻辑
import { towerConfig, enemyConfig } from '../config/gameEntities.js';
import { path } from '../config/gameConfig.js';
import { Tower, SlowTower, SplashTower } from '../entities/Tower.js';
import { Enemy, FastEnemy, StrongEnemy, BossEnemy } from '../entities/Enemy.js';

export function placeTower(x, y) {
  // 将位置对齐到最近的格子中心
  const gridSize = 40;
  const gridOffsetY = 60; // 网格的起始偏移量
  // 确保塔建在格子中间，而不是线上
  // 使用 Math.floor 确保点击格子里的任何位置都能在那个格子里建塔
  // 考虑网格的起始偏移量，确保塔建在格子中心
  const snappedX = Math.floor(x / gridSize) * gridSize + gridSize / 2;
  const snappedY = Math.floor((y - gridOffsetY) / gridSize) * gridSize + gridSize / 2 + gridOffsetY;
  
  const towerType = globalThis.selectedTowerType;
  const config = towerConfig[towerType];
  
  if (config && globalThis.money >= config.baseCost) {
    let tower;
    switch (towerType) {
      case 'slow':
        tower = new SlowTower(globalThis.scene, snappedX, snappedY);
        break;
      case 'splash':
        tower = new SplashTower(globalThis.scene, snappedX, snappedY);
        break;
      default:
        tower = new Tower(globalThis.scene, snappedX, snappedY);
    }
    
    globalThis.towers.push(tower);
    globalThis.money -= config.baseCost;
    globalThis.updateMoneyUI && globalThis.updateMoneyUI();
  }
}

export function upgradeTower(tower) {
  const config = towerConfig[tower.type];
  const upgradeCost = Math.floor(config.baseCost * Math.pow(1.5, tower.level));
  
  if (globalThis.money >= upgradeCost && tower.upgrade()) {
    globalThis.money -= upgradeCost;
    globalThis.updateMoneyUI && globalThis.updateMoneyUI();
    // 重新创建塔操作UI以更新信息
    globalThis.clearTowerUI && globalThis.clearTowerUI();
    globalThis.createTowerUI && globalThis.createTowerUI(tower);
  }
}

export function sellTower(tower) {
  const config = towerConfig[tower.type];
  const sellValue = Math.floor(config.baseCost * 0.5 * tower.level);
  
  globalThis.money += sellValue;
  globalThis.updateMoneyUI && globalThis.updateMoneyUI();
  
  const index = globalThis.towers.indexOf(tower);
  if (index > -1) {
    globalThis.towers.splice(index, 1);
  }
  
  tower.destroy();
  globalThis.clearTowerUI && globalThis.clearTowerUI();
}

export function startWave(scene) {
  console.log('Starting wave:', globalThis.wave);
  globalThis.enemiesAlive = 5 + globalThis.wave * 2;
  globalThis.nextEnemy = scene.time.now + 1000;
  
  // 每10波出现一次Boss
  globalThis.isBossWave = globalThis.wave % 10 === 0;
  if (globalThis.isBossWave) {
    globalThis.enemiesAlive = 1; // Boss波只生成1个Boss
  }
}

export function spawnEnemy() {
  if (globalThis.enemiesAlive <= 0) return;
  
  let enemy;
  if (globalThis.isBossWave) {
    enemy = new BossEnemy(globalThis.scene, path);
  } else {
    const rand = Math.random();
    if (rand < 0.6) {
      enemy = new Enemy(globalThis.scene, path);
    } else if (rand < 0.8) {
      enemy = new FastEnemy(globalThis.scene, path);
    } else {
      enemy = new StrongEnemy(globalThis.scene, path);
    }
  }
  
  globalThis.enemies.push(enemy);
  globalThis.enemiesAlive--;
}

export function checkGameOver() {
  if (globalThis.lives <= 0) {
    globalThis.gameOver();
  }
}

export function canPlaceTower(x, y) {
  // 检查是否在最上方的状态栏区域（高度60）
  if (y <= 60) {
    return false;
  }
  
  // 检查是否在最下方的操作区域（从450开始）
  if (y >= 450) {
    return false;
  }
  
  // 计算格子中心坐标
  const gridSize = 40;
  const gridOffsetY = 60; // 网格的起始偏移量
  const snappedX = Math.floor(x / gridSize) * gridSize + gridSize / 2;
  const snappedY = Math.floor((y - gridOffsetY) / gridSize) * gridSize + gridSize / 2 + gridOffsetY;
  
  // 检查是否在路径上
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];
    if (Phaser.Math.Distance.Between(snappedX, snappedY, p1.x, p1.y) < 40 || 
        Phaser.Math.Distance.Between(snappedX, snappedY, p2.x, p2.y) < 40 ||
        (snappedX >= Math.min(p1.x, p2.x) - 40 && snappedX <= Math.max(p1.x, p2.x) + 40 &&
         snappedY >= Math.min(p1.y, p2.y) - 40 && snappedY <= Math.max(p1.y, p2.y) + 40)) {
      return false;
    }
  }
  
  // 检查是否与其他塔重叠
  for (const tower of globalThis.towers) {
    if (Phaser.Math.Distance.Between(snappedX, snappedY, tower.x, tower.y) < 40) {
      return false;
    }
  }
  
  return true;
}

export function getClickedTower(pointer) {
  for (const tower of globalThis.towers) {
    if (Phaser.Math.Distance.Between(pointer.x, pointer.y, tower.x, tower.y) < 30) {
      return tower;
    }
  }
  return null;
}

export function updateGame(delta) {
  // 更新塔
  for (const tower of globalThis.towers) {
    tower.update(globalThis.enemies);
  }
  
  // 检查敌人是否到达终点或被击败
  for (let i = globalThis.enemies.length - 1; i >= 0; i--) {
    const enemy = globalThis.enemies[i];
    if (!enemy.active) {
      globalThis.enemies.splice(i, 1);
      // 只有当敌人是活着的时候被销毁，才认为是到达终点
      // 如果敌人已经被标记为死亡（isAlive === false），则是被塔击败
      if (enemy.isAlive !== false) {
        // 敌人到达终点，减少生命值
        globalThis.lives--;
        globalThis.updateLivesUI && globalThis.updateLivesUI();
        checkGameOver();
      }
    }
  }
  
  // 生成新敌人
  if (globalThis.waveStarted && globalThis.enemiesAlive > 0 && 
      globalThis.scene.time.now > globalThis.nextEnemy) {
    spawnEnemy();
    globalThis.nextEnemy = globalThis.scene.time.now + 1000;
  }
  
  // 检查波次是否结束
  if (globalThis.waveStarted && globalThis.enemiesAlive <= 0 && globalThis.enemies.length === 0) {
    globalThis.waveStarted = false;
    globalThis.wave++;
    globalThis.updateWaveUI && globalThis.updateWaveUI();
    // 自动开始下一波
    setTimeout(() => {
      globalThis.startWave(globalThis.scene);
      globalThis.waveStarted = true;
    }, 2000); // 2秒后自动开始下一波
  }
}
