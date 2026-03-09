// 游戏实体配置文件

// 塔配置
export const towerConfig = {
  normal: {
    name: '普通塔',
    texture: 'tower',
    emoji: '🔫',
    baseRange: 120,
    baseDamage: 40,
    baseFireRate: 500,
    baseCost: 100,
    maxLevel: 3,
    upgradeMultiplier: {
      damage: 1.5,
      range: 1.2,
      fireRate: 0.8
    },
    scale: 0.55,
    levelScaleIncrement: 0.15,
    colors: {
      level1: 0x00ff00,
      level2: 0x00ffff,
      level3: 0xff00ff
    }
  },
  slow: {
    name: '减速塔',
    texture: 'slowTower',
    emoji: '❄️',
    baseRange: 100,
    baseDamage: 20,
    baseFireRate: 300,
    baseCost: 150,
    maxLevel: 3,
    upgradeMultiplier: {
      damage: 1.4,
      range: 1.25,
      fireRate: 0.9
    },
    scale: 0.55,
    levelScaleIncrement: 0.15,
    colors: {
      level1: 0x00aaff,
      level2: 0x00ffff,
      level3: 0x0088ff
    },
    slowFactor: 0.5
  },
  splash: {
    name: '范围塔',
    texture: 'splashTower',
    emoji: '💣',
    baseRange: 150,
    baseDamage: 30,
    baseFireRate: 1000,
    baseCost: 200,
    maxLevel: 3,
    upgradeMultiplier: {
      damage: 1.6,
      range: 1.15,
      fireRate: 0.9
    },
    scale: 0.55,
    levelScaleIncrement: 0.15,
    colors: {
      level1: 0xffaa00,
      level2: 0xffff00,
      level3: 0xff6600
    },
    splashRadius: 50
  }
};

// 敌人配置
export const enemyConfig = {
  normal: {
    name: '普通敌人',
    texture: 'enemy',
    emoji: '🐜',
    baseSpeed: 100,
    baseHealth: 100,
    scale: 1.2,
    reward: 50
  },
  fast: {
    name: '快速敌人',
    texture: 'fastEnemy',
    emoji: '🐆',
    baseSpeed: 150,
    baseHealth: 50,
    scale: 1.0,
    reward: 75
  },
  strong: {
    name: '强壮敌人',
    texture: 'strongEnemy',
    emoji: '🐊',
    baseSpeed: 75,
    baseHealth: 200,
    scale: 1.5,
    reward: 100
  },
  boss: {
    name: 'Boss',
    texture: 'bossEnemy',
    emoji: '🐉',
    baseSpeed: 50,
    baseHealth: 1000,
    scale: 2.0,
    reward: 500
  }
};
