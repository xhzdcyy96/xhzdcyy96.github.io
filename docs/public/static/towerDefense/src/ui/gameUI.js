// 游戏 UI
import { towerConfig } from '../config/gameEntities.js';
import { path } from '../config/gameConfig.js';

// 创建游戏 UI
export function createGameUI(scene) {
  // 背景
  const background = scene.add.graphics();
  background.fillStyle(0x2c3e50, 1);
  background.fillRect(0, 0, 800, 600);
  
  // 路径 - 使用config中的路径定义
  const pathGraphics = scene.add.graphics();
  pathGraphics.lineStyle(10, 0x7f8c8d, 1);
  
  pathGraphics.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    pathGraphics.lineTo(path[i].x, path[i].y);
  }
  pathGraphics.strokePath();
  
  // 标记路径区域（禁止建造塔的区域）
  const pathAreaGraphics = scene.add.graphics();
  pathAreaGraphics.lineStyle(2, 0xe74c3c, 0.5);
  pathAreaGraphics.fillStyle(0xe74c3c, 0.1);
  
  // 绘制路径周围的禁止区域
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];
    
    // 计算矩形区域
    const minX = Math.min(p1.x, p2.x) - 40;
    const maxX = Math.max(p1.x, p2.x) + 40;
    const minY = Math.min(p1.y, p2.y) - 40;
    const maxY = Math.max(p1.y, p2.y) + 40;
    
    pathAreaGraphics.fillRect(minX, minY, maxX - minX, maxY - minY);
    pathAreaGraphics.strokeRect(minX, minY, maxX - minX, maxY - minY);
  }
  
  // 标记可建造区域
  const buildableAreaGraphics = scene.add.graphics();
  buildableAreaGraphics.lineStyle(2, 0x27ae60, 0.5);
  buildableAreaGraphics.fillStyle(0x27ae60, 0.05);
  
  // 绘制可建造区域（排除UI区域和路径区域）
  buildableAreaGraphics.fillRect(0, 60, 800, 390);
  buildableAreaGraphics.strokeRect(0, 60, 800, 390);
  
  // 绘制可建造网格
  const gridSize = 40; // 网格大小
  const gridGraphics = scene.add.graphics();
  gridGraphics.lineStyle(2, 0x7f8c8d, 0.3); // 更改网格线颜色和粗细，使其与塔的颜色形成更明显的对比
  
  // 绘制水平线条（从60开始，确保网格线与路径对齐）
  for (let y = 60; y < 450; y += gridSize) {
    gridGraphics.lineBetween(0, y, 800, y);
  }
  
  // 绘制垂直线条（从0开始，确保网格线与路径对齐）
  for (let x = 0; x < 800; x += gridSize) {
    gridGraphics.lineBetween(x, 60, x, 450);
  }
  
  // 添加区域说明文字
  scene.add.text(400, 30, '敌人路径', {
    fontSize: '14px',
    fill: '#7f8c8d',
    fontFamily: 'Arial',
    fontWeight: 'bold'
  }).setOrigin(0.5, 0.5);
  
  scene.add.text(400, 420, '可建造区域', {
    fontSize: '14px',
    fill: '#27ae60',
    fontFamily: 'Arial',
    fontWeight: 'bold'
  }).setOrigin(0.5, 0.5);
  
  // 状态栏 - 美化设计
  const statusBar = scene.add.graphics();
  statusBar.fillStyle(0x34495e, 0.95);
  statusBar.fillRoundedRect(10, 10, 780, 40, 8);
  statusBar.lineStyle(2, 0x4a6990, 1);
  statusBar.strokeRoundedRect(10, 10, 780, 40, 8);
  
  // 金钱
  globalThis.moneyText = scene.add.text(30, 30, `金钱: ${globalThis.money}`, {
    fontSize: '18px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  });
  globalThis.moneyText.setOrigin(0, 0.5);
  
  // 生命值
  globalThis.livesText = scene.add.text(210, 30, `生命值: ${globalThis.lives}`, {
    fontSize: '18px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  });
  globalThis.livesText.setOrigin(0, 0.5);
  
  // 波次
  globalThis.waveText = scene.add.text(390, 30, `波次: ${globalThis.wave}`, {
    fontSize: '18px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  });
  globalThis.waveText.setOrigin(0, 0.5);
  
  // 计算各区域宽度
  const sectionWidth = 800 / 3;
  
  // 认输和暂停按钮区域 - 占三分之一宽度
  const buttonAreaWidth = sectionWidth;
  const buttonAreaX = sectionWidth * 2 + 10;
  
  // 认输按钮 - 美化设计
  globalThis.giveUpButton = scene.add.text(buttonAreaX + 20, 510, '认输', {
    fontSize: '16px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    backgroundColor: '#e74c3c',
    padding: {
      left: 20,
      right: 20,
      top: 8,
      bottom: 8
    },
    stroke: '#000000',
    strokeThickness: 1
  });
  globalThis.giveUpButton.setInteractive();
  globalThis.giveUpButton.name = 'giveUpButton';
  
  // 暂停按钮 - 美化设计
  globalThis.pauseButton = scene.add.text(buttonAreaX + 110, 510, '暂停', {
    fontSize: '16px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    backgroundColor: '#f39c12',
    padding: {
      left: 20,
      right: 20,
      top: 8,
      bottom: 8
    },
    stroke: '#000000',
    strokeThickness: 1
  });
  globalThis.pauseButton.setInteractive();
  globalThis.pauseButton.name = 'pauseButton';
  
  // 创建塔选择界面
  createTowerSelection(scene);
}

// 创建塔选择界面
export function createTowerSelection(scene) {
  // 底部操作区域背景
  const bottomPanel = scene.add.graphics();
  bottomPanel.fillStyle(0x34495e, 0.95);
  bottomPanel.fillRoundedRect(10, 455, 780, 140, 8);
  bottomPanel.lineStyle(2, 0x4a6990, 1);
  bottomPanel.strokeRoundedRect(10, 455, 780, 140, 8);
  bottomPanel.name = 'bottomPanel';
  bottomPanel.setDepth(-1); // 确保面板在按钮下方
  
  // 计算各区域宽度
  const sectionWidth = 800 / 3;
  
  // 塔选择区域 - 占三分之一宽度
  const towerSelectionX = 10;
  const towerSelectionWidth = sectionWidth - 10;
  
  // 绘制塔选择区域分隔线
  const divider1 = scene.add.graphics();
  divider1.lineStyle(2, 0x4a6990, 1);
  divider1.lineBetween(sectionWidth, 455, sectionWidth, 595);
  
  // 标题
  scene.add.text(towerSelectionX + 20, 470, '选择塔类型', {
    fontSize: '16px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  });
  
  // 普通塔 - 美化设计
  const normalTowerWidth = 60;
  const normalTowerHeight = 45;
  const normalTowerX = towerSelectionX + 50;
  const normalTowerY = 520;
  
  const normalTowerButton = scene.add.graphics();
  normalTowerButton.fillStyle(0x27ae60, 1);
  normalTowerButton.fillRoundedRect(normalTowerX - normalTowerWidth/2, normalTowerY - normalTowerHeight/2, normalTowerWidth, normalTowerHeight, 6);
  normalTowerButton.lineStyle(2, 0x229954, 1);
  normalTowerButton.strokeRoundedRect(normalTowerX - normalTowerWidth/2, normalTowerY - normalTowerHeight/2, normalTowerWidth, normalTowerHeight, 6);
  normalTowerButton.name = 'normalTowerButton';
  normalTowerButton.setInteractive(new Phaser.Geom.Rectangle(normalTowerX - normalTowerWidth/2, normalTowerY - normalTowerHeight/2, normalTowerWidth, normalTowerHeight), Phaser.Geom.Rectangle.Contains);
  
  // 普通塔文字 - 居中显示
  const normalTowerName = scene.add.text(normalTowerX, normalTowerY - 6, towerConfig.normal.name, {
    fontSize: '11px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  });
  normalTowerName.setOrigin(0.5, 0.5);
  
  const normalTowerCost = scene.add.text(normalTowerX, normalTowerY + 6, `${towerConfig.normal.baseCost}金`, {
    fontSize: '11px',
    fill: '#ffff00',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  });
  normalTowerCost.setOrigin(0.5, 0.5);
  
  // 减速塔 - 美化设计
  const slowTowerX = towerSelectionX + 120;
  const slowTowerY = 520;
  
  const slowTowerButton = scene.add.graphics();
  slowTowerButton.fillStyle(0x3498db, 1);
  slowTowerButton.fillRoundedRect(slowTowerX - normalTowerWidth/2, slowTowerY - normalTowerHeight/2, normalTowerWidth, normalTowerHeight, 6);
  slowTowerButton.lineStyle(2, 0x2980b9, 1);
  slowTowerButton.strokeRoundedRect(slowTowerX - normalTowerWidth/2, slowTowerY - normalTowerHeight/2, normalTowerWidth, normalTowerHeight, 6);
  slowTowerButton.name = 'slowTowerButton';
  slowTowerButton.setInteractive(new Phaser.Geom.Rectangle(slowTowerX - normalTowerWidth/2, slowTowerY - normalTowerHeight/2, normalTowerWidth, normalTowerHeight), Phaser.Geom.Rectangle.Contains);
  
  // 减速塔文字 - 居中显示
  const slowTowerName = scene.add.text(slowTowerX, slowTowerY - 6, towerConfig.slow.name, {
    fontSize: '11px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  });
  slowTowerName.setOrigin(0.5, 0.5);
  
  const slowTowerCost = scene.add.text(slowTowerX, slowTowerY + 6, `${towerConfig.slow.baseCost}金`, {
    fontSize: '11px',
    fill: '#ffff00',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  });
  slowTowerCost.setOrigin(0.5, 0.5);
  
  // 范围塔 - 美化设计
  const splashTowerX = towerSelectionX + 190;
  const splashTowerY = 520;
  
  const splashTowerButton = scene.add.graphics();
  splashTowerButton.fillStyle(0xe67e22, 1);
  splashTowerButton.fillRoundedRect(splashTowerX - normalTowerWidth/2, splashTowerY - normalTowerHeight/2, normalTowerWidth, normalTowerHeight, 6);
  splashTowerButton.lineStyle(2, 0xd35400, 1);
  splashTowerButton.strokeRoundedRect(splashTowerX - normalTowerWidth/2, splashTowerY - normalTowerHeight/2, normalTowerWidth, normalTowerHeight, 6);
  splashTowerButton.name = 'splashTowerButton';
  splashTowerButton.setInteractive(new Phaser.Geom.Rectangle(splashTowerX - normalTowerWidth/2, splashTowerY - normalTowerHeight/2, normalTowerWidth, normalTowerHeight), Phaser.Geom.Rectangle.Contains);
  
  // 范围塔文字 - 居中显示
  const splashTowerName = scene.add.text(splashTowerX, splashTowerY - 6, towerConfig.splash.name, {
    fontSize: '11px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  });
  splashTowerName.setOrigin(0.5, 0.5);
  
  const splashTowerCost = scene.add.text(splashTowerX, splashTowerY + 6, `${towerConfig.splash.baseCost}金`, {
    fontSize: '11px',
    fill: '#ffff00',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  });
  splashTowerCost.setOrigin(0.5, 0.5);
  
  // 塔信息区域 - 占三分之一宽度
  const towerInfoX = sectionWidth + 5;
  const towerInfoWidth = sectionWidth - 10;
  
  // 绘制塔信息区域分隔线
  const divider2 = scene.add.graphics();
  divider2.lineStyle(2, 0x4a6990, 1);
  divider2.lineBetween(sectionWidth * 2, 455, sectionWidth * 2, 595);
  
  const towerInfoPanel = scene.add.graphics();
  towerInfoPanel.fillStyle(0x2c3e50, 0.9);
  towerInfoPanel.fillRoundedRect(towerInfoX, 460, towerInfoWidth, 130, 6);
  towerInfoPanel.lineStyle(2, 0x34495e, 1);
  towerInfoPanel.strokeRoundedRect(towerInfoX, 460, towerInfoWidth, 130, 6);
  towerInfoPanel.name = 'towerInfoPanel';
  
  scene.add.text(towerInfoX + towerInfoWidth/2, 475, '塔信息', {
    fontSize: '16px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  }).setOrigin(0.5, 0.5);
  
  // 当前选中的塔类型显示
  globalThis.selectedTowerTypeText = scene.add.text(towerInfoX + towerInfoWidth/2, 505, `当前选择: ${towerConfig[globalThis.selectedTowerType].name}`, {
    fontSize: '14px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  });
  globalThis.selectedTowerTypeText.setOrigin(0.5, 0.5);
  globalThis.selectedTowerTypeText.name = 'selectedTowerTypeText';
}

// 创建塔操作界面
export function createTowerUI(tower) {
  const scene = globalThis.scene;
  
  // 清除之前的塔操作UI
  clearTowerUI();
  
  // 隐藏当前选中的塔类型显示
  if (globalThis.selectedTowerTypeText) {
    globalThis.selectedTowerTypeText.setVisible(false);
  }
  
  // 塔信息区域位置
  const sectionWidth = 800 / 3;
  const towerInfoX = sectionWidth + 5;
  const towerInfoWidth = sectionWidth - 10;
  
  // 塔信息 - 居中显示
  globalThis.towerInfoText = scene.add.text(towerInfoX + towerInfoWidth/2, 490, tower.config.name, {
    fontSize: '16px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  });
  globalThis.towerInfoText.setOrigin(0.5, 0.5);
  globalThis.towerInfoText.name = 'towerInfoText';
  
  // 塔等级 - 居中显示
  globalThis.towerLevelText = scene.add.text(towerInfoX + towerInfoWidth/2, 515, `等级: ${tower.level}`, {
    fontSize: '14px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    stroke: '#000000',
    strokeThickness: 1
  });
  globalThis.towerLevelText.setOrigin(0.5, 0.5);
  globalThis.towerLevelText.name = 'towerLevelText';
  
  // 塔属性 - 居中显示
  globalThis.towerStatsText = scene.add.text(towerInfoX + towerInfoWidth/2, 545, `伤害: ${Math.floor(tower.damage)}
范围: ${Math.floor(tower.range)}
攻速: ${(1000/tower.fireRate).toFixed(1)}次/秒`, {
    fontSize: '12px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    align: 'center',
    stroke: '#000000',
    strokeThickness: 1
  });
  globalThis.towerStatsText.setOrigin(0.5, 0.5);
  globalThis.towerStatsText.name = 'towerStatsText';
  
  // 升级按钮 - 美化设计
  const upgradeCost = Math.floor(tower.config.baseCost * Math.pow(1.5, tower.level));
  const canUpgrade = tower.level < tower.config.maxLevel && globalThis.money >= upgradeCost;
  
  globalThis.upgradeButton = scene.add.text(towerInfoX + 30, 575, `升级 (${upgradeCost}金)`, {
    fontSize: '12px',
    fill: canUpgrade ? '#ffffff' : '#888888',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    backgroundColor: canUpgrade ? '#27ae60' : '#7f8c8d',
    padding: {
      left: 12,
      right: 12,
      top: 6,
      bottom: 6
    },
    stroke: '#000000',
    strokeThickness: 1
  });
  globalThis.upgradeButton.setInteractive();
  globalThis.upgradeButton.name = 'upgradeButton';
  
  // 出售按钮 - 美化设计
  const sellValue = Math.floor(tower.config.baseCost * 0.5 * tower.level);
  globalThis.sellButton = scene.add.text(towerInfoX + 130, 575, `出售 (${sellValue}金)`, {
    fontSize: '12px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    backgroundColor: '#e67e22',
    padding: {
      left: 12,
      right: 12,
      top: 6,
      bottom: 6
    },
    stroke: '#000000',
    strokeThickness: 1
  });
  globalThis.sellButton.setInteractive();
  globalThis.sellButton.name = 'sellButton';
  
  // 存储当前选中的塔
  globalThis.selectedTower = tower;
}

// 清除塔操作界面
export function clearTowerUI() {
  const scene = globalThis.scene;
  if (!scene) return;
  
  // 先检查并销毁全局变量引用的UI元素
  if (globalThis.towerInfoText) {
    globalThis.towerInfoText.destroy();
    globalThis.towerInfoText = null;
  }
  if (globalThis.towerLevelText) {
    globalThis.towerLevelText.destroy();
    globalThis.towerLevelText = null;
  }
  if (globalThis.towerStatsText) {
    globalThis.towerStatsText.destroy();
    globalThis.towerStatsText = null;
  }
  if (globalThis.upgradeButton) {
    globalThis.upgradeButton.destroy();
    globalThis.upgradeButton = null;
  }
  if (globalThis.sellButton) {
    globalThis.sellButton.destroy();
    globalThis.sellButton = null;
  }
  
  // 再遍历所有子元素，确保所有塔相关UI元素都被销毁
  const children = scene.children.getChildren();
  for (const child of children) {
    if (child.name === 'towerInfoText' || 
        child.name === 'towerLevelText' || 
        child.name === 'towerStatsText' || 
        child.name === 'upgradeButton' || 
        child.name === 'sellButton') {
      child.destroy();
    }
  }
  
  // 重新显示当前选中的塔类型显示
  if (globalThis.selectedTowerTypeText) {
    globalThis.selectedTowerTypeText.setVisible(true);
  }
  
  // 清除选中的塔
  globalThis.selectedTower = null;
}

// 更新金钱 UI
export function updateMoneyUI() {
  if (globalThis.moneyText) {
    globalThis.moneyText.setText(`金钱: ${globalThis.money}`);
  }
}

// 更新生命值 UI
export function updateLivesUI() {
  if (globalThis.livesText) {
    globalThis.livesText.setText(`生命值: ${globalThis.lives}`);
  }
}

// 更新波次 UI
export function updateWaveUI() {
  if (globalThis.waveText) {
    globalThis.waveText.setText(`波次: ${globalThis.wave}`);
  }
}

// 检查是否点击了塔选择 UI
export function isClickOnTowerSelectionUI(pointer) {
  const scene = globalThis.scene;
  if (!scene) return false;
  
  // 塔选择区域宽度
  const sectionWidth = 800 / 3;
  
  // 直接检查点击位置是否在塔选择按钮的区域内
  // 普通塔按钮
  if (pointer.x >= 20 && pointer.x <= 80 && pointer.y >= 500 && pointer.y <= 540) {
    globalThis.selectedTowerType = 'normal';
    // 更新当前选中的塔类型显示
    if (globalThis.selectedTowerTypeText) {
      globalThis.selectedTowerTypeText.setText(`当前选择: ${towerConfig.normal.name}`);
    }
    return true;
  }
  // 减速塔按钮
  if (pointer.x >= 90 && pointer.x <= 150 && pointer.y >= 500 && pointer.y <= 540) {
    globalThis.selectedTowerType = 'slow';
    // 更新当前选中的塔类型显示
    if (globalThis.selectedTowerTypeText) {
      globalThis.selectedTowerTypeText.setText(`当前选择: ${towerConfig.slow.name}`);
    }
    return true;
  }
  // 范围塔按钮
  if (pointer.x >= 160 && pointer.x <= 220 && pointer.y >= 500 && pointer.y <= 540) {
    globalThis.selectedTowerType = 'splash';
    // 更新当前选中的塔类型显示
    if (globalThis.selectedTowerTypeText) {
      globalThis.selectedTowerTypeText.setText(`当前选择: ${towerConfig.splash.name}`);
    }
    return true;
  }
  return false;
}

// 检查是否点击了塔操作 UI
export function isClickOnTowerUI(pointer) {
  const scene = globalThis.scene;
  if (!scene || !globalThis.selectedTower) return false;
  
  // 塔信息区域位置
  const sectionWidth = 800 / 3;
  const towerInfoX = sectionWidth;
  
  // 直接检查点击位置是否在塔操作按钮的区域内
  // 升级按钮
  if (pointer.x >= towerInfoX + 30 && pointer.x <= towerInfoX + 150 && pointer.y >= 570 && pointer.y <= 595) {
    // 处理升级
    globalThis.upgradeTower && globalThis.upgradeTower(globalThis.selectedTower);
    return true;
  }
  // 出售按钮
  if (pointer.x >= towerInfoX + 130 && pointer.x <= towerInfoX + 230 && pointer.y >= 570 && pointer.y <= 595) {
    // 处理出售
    globalThis.sellTower && globalThis.sellTower(globalThis.selectedTower);
    return true;
  }
  return false;
}

// 检查是否点击了暂停按钮
export function isClickOnPauseButton(pointer) {
  if (!globalThis.pauseButton) return false;
  
  const bounds = globalThis.pauseButton.getBounds();
  return pointer.x >= bounds.x && pointer.x <= bounds.x + bounds.width &&
         pointer.y >= bounds.y && pointer.y <= bounds.y + bounds.height;
}

// 检查是否点击了认输按钮
export function isClickOnGiveUpButton(pointer) {
  if (!globalThis.giveUpButton) return false;
  
  const bounds = globalThis.giveUpButton.getBounds();
  return pointer.x >= bounds.x && pointer.x <= bounds.x + bounds.width &&
         pointer.y >= bounds.y && pointer.y <= bounds.y + bounds.height;
}

// 检查是否点击了开始波次按钮
export function isClickOnStartWaveButton(pointer) {
  const scene = globalThis.scene;
  if (!scene) return false;
  
  const children = scene.children.getChildren();
  for (const child of children) {
    if (child.name === 'startWaveButton') {
      // 检查 child 是否有 getBounds 方法
      if (typeof child.getBounds === 'function') {
        const bounds = child.getBounds();
        return pointer.x >= bounds.x && pointer.x <= bounds.x + bounds.width &&
               pointer.y >= bounds.y && pointer.y <= bounds.y + bounds.height;
      }
    }
  }
  return false;
}

// 创建蒙层
export function createOverlay(scene, overlayName, text, textColor) {
  console.log("createOverlay called")
  // 创建蒙层
  const overlay = scene.add.graphics();
  overlay.name = overlayName;
  overlay.fillStyle(0x000000, 0.7);
  overlay.fillRect(0, 0, 800, 600);
  overlay.setDepth(999);
  
  // 根据蒙层类型显示不同的图标
  if (overlayName === 'gameOverOverlay') {
    // 添加游戏结束图标（一个叉号）
    const gameOverIcon = scene.add.graphics();
    gameOverIcon.name = 'gameOverIcon';
    gameOverIcon.lineStyle(10, 0xff0000, 1);
    gameOverIcon.lineBetween(360, 220, 440, 300); // 往上移动40像素
    gameOverIcon.lineBetween(440, 220, 360, 300); // 往上移动40像素
    gameOverIcon.setDepth(1000);
  } else {
    // 添加暂停图标
    const pauseIcon = scene.add.graphics();
    pauseIcon.name = 'pauseIcon';
    pauseIcon.fillStyle(0xffffff, 1);
    pauseIcon.fillRect(370, 240, 20, 40); // 往上移动40像素
    pauseIcon.fillRect(410, 240, 20, 40); // 往上移动40像素
    pauseIcon.setDepth(1000);
  }
  
  // 添加文本
  const overlayText = scene.add.text(400, 350, text, {
    fontSize: '36px',
    fill: textColor || '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0.5);
  overlayText.name = 'overlayText';
  overlayText.setDepth(1000);
  
  return overlay;
}

// 关闭蒙层
export function closeOverlay(overlayName) {
  const scene = globalThis.scene;
  if (!scene) return;
  
  // 确保所有相关的对象都被销毁
  const children = scene.children.getChildren();
  const objectsToDestroy = [];
  
  // 收集所有需要销毁的对象
  for (const child of children) {
    if (child.name === overlayName || 
        child.name === 'pauseIcon' || 
        child.name === 'gameOverIcon' || 
        child.name === 'pauseText' || 
        child.name === 'overlayText' ||
        child.name === 'restartButton' ||
        child.name === 'restartBtnHitArea') {
      objectsToDestroy.push(child);
    }
  }
  
  // 销毁收集到的对象
  for (const obj of objectsToDestroy) {
    try {
      obj.destroy();
    } catch (error) {
      console.log('Error destroying object:', error);
    }
  }
  
  // 额外检查并清除所有相关图标和文本，确保完全清除
  const remainingChildren = scene.children.getChildren();
  for (const child of remainingChildren) {
    if (child.name === 'pauseIcon' || 
        child.name === 'gameOverIcon' || 
        child.name === 'pauseText' || 
        child.name === 'overlayText') {
      try {
        child.destroy();
      } catch (error) {
        console.log('Error destroying object:', error);
      }
    }
  }
}
