// 敌人类
import { enemyConfig } from '../config/gameEntities.js';

export class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, path, type = 'normal') {
    const config = enemyConfig[type];
    // 检查纹理是否存在，如果不存在则使用 emoji
    let texture = config.texture;
    if (!scene.textures.exists(texture)) {
      // 创建临时文本对象来渲染 emoji
      const tempText = scene.add.text(0, 0, config.emoji, {
        fontSize: '40px',
        fontFamily: 'Arial',
        align: 'center'
      });
      
      // 创建一个新的纹理
      const canvas = document.createElement('canvas');
      canvas.width = 40;
      canvas.height = 40;
      const context = canvas.getContext('2d');
      
      // 清除画布为透明
      context.clearRect(0, 0, 40, 40);
      
      // 绘制 emoji
      context.font = '40px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#ffffff';
      context.fillText(config.emoji, 20, 20);
      
      // 将画布添加为纹理
      scene.textures.addCanvas(texture, canvas);
      
      // 清理临时对象
      tempText.destroy();
    }
    super(scene, path[0].x, path[0].y, texture);
    this.setOrigin(0.5, 0.5); // 先设置原点
    this.setScale(config.scale); // 再设置缩放
    this.setFlipX(true); // 水平翻转敌人
    scene.add.existing(this);
    this.path = path;
    this.pathIndex = 0;
    this.speed = config.baseSpeed;
    // 随波次增加敌人血量
    const wave = globalThis.wave || 1;
    const healthMultiplier = 1 + (wave - 1) * 0.2; // 每波增加20%血量
    this.health = Math.floor(config.baseHealth * healthMultiplier);
    this.maxHealth = this.health;
    this.type = type;
    this.config = config;
    this.isAlive = true;

    this.moveToNextPoint();
  }

  moveToNextPoint() {
    if (!this.active || !this.scene) return;

    this.pathIndex++;
    if (this.pathIndex >= this.path.length) {
      // 敌人到达终点
      // 不要设置 this.isAlive = false，因为 gameLogic.js 中会根据这个值来判断是否减少生命值
      this.destroy();
      return;
    }

    const nextPoint = this.path[this.pathIndex];
    const distance = Phaser.Math.Distance.Between(this.x, this.y, nextPoint.x, nextPoint.y);
    const duration = distance / this.speed * 1000;

    this.scene.tweens.add({
      targets: this,
      x: nextPoint.x,
      y: nextPoint.y,
      duration: duration,
      onComplete: () => {
        if (this.active && this.scene) {
          this.moveToNextPoint();
        }
      }
    });
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.isAlive = false;
      // 敌人被击败，奖励金币
      if (globalThis.money !== undefined && globalThis.updateMoneyUI) {
        globalThis.money += this.config.reward;
        globalThis.updateMoneyUI();
      }
      this.destroy();
      return true; // 敌人被消灭
    }
    return false;
  }
}

export class FastEnemy extends Enemy {
  constructor(scene, path) {
    super(scene, path, 'fast');
  }
}

export class StrongEnemy extends Enemy {
  constructor(scene, path) {
    super(scene, path, 'strong');
  }
}

export class BossEnemy extends Enemy {
  constructor(scene, path) {
    super(scene, path, 'boss');
  }
}
