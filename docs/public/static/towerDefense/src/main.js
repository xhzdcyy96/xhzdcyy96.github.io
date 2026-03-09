// 主游戏文件
import { gameConfig, path } from './config/gameConfig.js';
import { GameManager } from './state/GameState.js';
import { placeTower, upgradeTower, sellTower, startWave, spawnEnemy, canPlaceTower, getClickedTower, updateGame } from './game/gameLogic.js';
import { createGameUI, createTowerSelection, createTowerUI, clearTowerUI, updateMoneyUI, updateLivesUI, updateWaveUI, isClickOnTowerSelectionUI, isClickOnTowerUI, isClickOnPauseButton, isClickOnGiveUpButton, isClickOnStartWaveButton, createOverlay, closeOverlay } from './ui/gameUI.js';

// 全局变量
globalThis.towers = [];
globalThis.enemies = [];
globalThis.money = 1000;
globalThis.lives = 10;
globalThis.wave = 1;
globalThis.waveStarted = false;
globalThis.enemiesAlive = 0;
globalThis.nextEnemy = 0;
globalThis.isBossWave = false;
globalThis.selectedTowerType = 'normal';
globalThis.selectedTower = null;
globalThis.scene = null;
globalThis.gameManager = null;

// 游戏配置
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// 初始化游戏
const game = new Phaser.Game(config);

// 预加载资源
function preload() {
  // 尝试加载图片，如果失败则使用默认图形
  this.load.image('tower', 'assets/png/tower.png').on('loaderror', function () {
    console.log('Tower image not found, will use placeholder');
  });
  this.load.image('slowTower', 'assets/png/slowTower.png').on('loaderror', function () {
    console.log('Slow tower image not found, will use placeholder');
  });
  this.load.image('splashTower', 'assets/png/splashTower.png').on('loaderror', function () {
    console.log('Splash tower image not found, will use placeholder');
  });
  this.load.image('enemy', 'assets/png/enemy.png').on('loaderror', function () {
    console.log('Enemy image not found, will use placeholder');
  });
  this.load.image('fastEnemy', 'assets/png/fastEnemy.png').on('loaderror', function () {
    console.log('Fast enemy image not found, will use placeholder');
  });
  this.load.image('strongEnemy', 'assets/png/strongEnemy.png').on('loaderror', function () {
    console.log('Strong enemy image not found, will use placeholder');
  });
  this.load.image('bossEnemy', 'assets/png/bossEnemy.png').on('loaderror', function () {
    console.log('Boss enemy image not found, will use placeholder');
  });
  this.load.image('bullet', 'assets/png/bullet.png').on('loaderror', function () {
    console.log('Bullet image not found, will use placeholder');
  });
}

// 创建游戏
function create() {
  globalThis.scene = this;
  
  // 初始化游戏管理器
  globalThis.gameManager = new GameManager();
  globalThis.gameManager.changeState('normal');
  
  // 创建游戏 UI
  createGameUI(this);
  
  // 鼠标点击事件
  this.input.on('pointerdown', (pointer) => {
    globalThis.gameManager.handlePointerDown(pointer);
  });
  
  // 自动开始第一波
  setTimeout(() => {
    globalThis.startWave(globalThis.scene);
    globalThis.waveStarted = true;
  }, 2000); // 2秒后自动开始第一波
}

// 更新游戏
function update(time, delta) {
  // 只有在正常状态下才执行游戏逻辑
  if (globalThis.gameManager && globalThis.gameManager.currentState && 
      globalThis.gameManager.currentState.constructor.name === 'NormalState') {
    updateGame(delta);
  }
  globalThis.gameManager.update();
}

// 游戏结束
function gameOver() {
  globalThis.gameManager.changeState('gameOver');
}

// 暂停游戏
function togglePause() {
  if (globalThis.scene.scene.isPaused()) {
    globalThis.scene.scene.resume();
    globalThis.pauseButton.setText('暂停');
  } else {
    globalThis.scene.scene.pause();
    globalThis.pauseButton.setText('继续');
  }
}

// 重置游戏
function resetGame() {
  // 清除所有塔
  for (const tower of globalThis.towers) {
    tower.destroy();
  }
  globalThis.towers = [];
  
  // 清除所有敌人
  for (const enemy of globalThis.enemies) {
    enemy.destroy();
  }
  globalThis.enemies = [];
  
  // 重置游戏状态
  globalThis.money = 1000;
  globalThis.lives = 10;
  globalThis.wave = 1;
  globalThis.waveStarted = false;
  globalThis.enemiesAlive = 0;
  globalThis.nextEnemy = 0;
  globalThis.isBossWave = false;
  globalThis.selectedTowerType = 'normal';
  globalThis.selectedTower = null;
  
  // 恢复 tweens 动画
  if (globalThis.scene) {
    globalThis.scene.tweens.resumeAll();
  }
  
  // 清除 UI
  const children = globalThis.scene.children.getChildren();
  for (const child of children) {
    child.destroy();
  }
  
  // 重新创建 UI
  createGameUI(globalThis.scene);
  
  // 先移除现有的点击事件监听器，防止重复处理
  globalThis.scene.input.off('pointerdown');
  // 重新设置点击事件
  globalThis.scene.input.on('pointerdown', (pointer) => {
    globalThis.gameManager.handlePointerDown(pointer);
  });
  
  // 自动开始第一波
  setTimeout(() => {
    globalThis.startWave(globalThis.scene);
    globalThis.waveStarted = true;
  }, 2000); // 2秒后自动开始第一波
}

// 暴露全局函数供其他模块使用
globalThis.createGameUI = createGameUI;
globalThis.createTowerSelection = createTowerSelection;
globalThis.createTowerUI = createTowerUI;
globalThis.clearTowerUI = clearTowerUI;
globalThis.updateMoneyUI = updateMoneyUI;
globalThis.updateLivesUI = updateLivesUI;
globalThis.updateWaveUI = updateWaveUI;
globalThis.isClickOnTowerSelectionUI = isClickOnTowerSelectionUI;
globalThis.isClickOnTowerUI = isClickOnTowerUI;
globalThis.isClickOnPauseButton = isClickOnPauseButton;
globalThis.isClickOnGiveUpButton = isClickOnGiveUpButton;
globalThis.isClickOnStartWaveButton = isClickOnStartWaveButton;
globalThis.placeTower = placeTower;
globalThis.upgradeTower = upgradeTower;
globalThis.sellTower = sellTower;
globalThis.startWave = startWave;
globalThis.spawnEnemy = spawnEnemy;
globalThis.canPlaceTower = canPlaceTower;
globalThis.getClickedTower = getClickedTower;
globalThis.gameOver = gameOver;
globalThis.togglePause = togglePause;
globalThis.resetGame = resetGame;
globalThis.createOverlay = createOverlay;
globalThis.closeOverlay = closeOverlay;
