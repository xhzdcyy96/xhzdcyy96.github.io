// 塔类
import { towerConfig } from '../config/gameEntities.js';

export class Tower extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, type = 'normal') {
    const config = towerConfig[type];
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
    super(scene, x, y, texture);
    this.setOrigin(0.5, 0.5); // 先设置原点
    this.setScale(config.scale); // 再设置缩放
    scene.add.existing(this);
    this.type = type;
    this.config = config;
    this.level = 1;
    this.range = config.baseRange;
    this.damage = config.baseDamage;
    this.fireRate = config.baseFireRate;
    this.lastFire = 0;
    this.isAlive = true;

    this.createRangeIndicator();
  }

  createRangeIndicator() {
    this.rangeIndicator = this.scene.add.graphics();
    this.rangeIndicator.setDepth(0);
    this.updateRangeIndicator();
  }

  updateRangeIndicator() {
    if (this.rangeIndicator) {
      this.rangeIndicator.clear();
      this.rangeIndicator.lineStyle(2, this.config.colors[`level${this.level}`], 0.3);
      this.rangeIndicator.strokeCircle(this.x, this.y, this.range);
    }
  }

  upgrade() {
    if (this.level < this.config.maxLevel) {
      this.level++;
      this.damage *= this.config.upgradeMultiplier.damage;
      this.range *= this.config.upgradeMultiplier.range;
      this.fireRate *= this.config.upgradeMultiplier.fireRate;
      this.setScale(this.config.scale + (this.level - 1) * this.config.levelScaleIncrement);
      this.updateRangeIndicator();
      return true;
    }
    return false;
  }

  fire(target, enemies) {
    if (this.scene.time.now - this.lastFire < this.fireRate) return;

    this.lastFire = this.scene.time.now;

    // 检查子弹纹理是否存在，如果不存在则使用默认图形
    let bulletTexture = 'bullet';
    if (!this.scene.textures.exists(bulletTexture)) {
      // 创建默认图形作为占位符
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(0xffff00, 1);
      graphics.fillCircle(20, 20, 10);
      graphics.generateTexture(bulletTexture, 20, 20);
      graphics.destroy();
    }

    // 创建子弹
    const bullet = new Phaser.GameObjects.Sprite(this.scene, this.x, this.y, bulletTexture);
    bullet.setScale(0.5);
    this.scene.add.existing(bullet);

    // 计算子弹速度
    const speed = 600; // 增加子弹速度

    // 追踪敌人的更新函数
    const updateBullet = () => {
      if (bullet.active && target.active && enemies.includes(target)) {
        const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, target.x, target.y);
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        // 更新子弹位置
        bullet.x += velocityX * 0.016; // 假设60fps
        bullet.y += velocityY * 0.016;

        // 检查是否击中敌人
        const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, target.x, target.y);
        if (distance < 20) {
          // 造成伤害
          target.takeDamage(this.damage);
          bullet.destroy();
        }
      } else {
        bullet.destroy();
      }
    };

    // 添加更新函数到场景的update循环
    const updateCallback = () => updateBullet();
    this.scene.events.on('update', updateCallback);

    // 确保子弹销毁时移除更新函数
    bullet.on('destroy', () => {
      this.scene.events.off('update', updateCallback);
    });
  }

  getTarget(enemies) {
    for (const enemy of enemies) {
      if (enemy.active && Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.range) {
        return enemy;
      }
    }
    return null;
  }

  update(enemies) {
    if (!this.isAlive) return;

    const target = this.getTarget(enemies);
    if (target) {
      this.fire(target, enemies);
    }
  }

  destroy() {
    if (this.rangeIndicator) {
      this.rangeIndicator.destroy();
    }
    this.isAlive = false;
    super.destroy();
  }
}

export class SlowTower extends Tower {
  constructor(scene, x, y) {
    super(scene, x, y, 'slow');
  }

  fire(target, enemies) {
    if (this.scene.time.now - this.lastFire < this.fireRate) return;

    this.lastFire = this.scene.time.now;

    // 检查子弹纹理是否存在，如果不存在则使用默认图形
    let bulletTexture = 'bullet';
    if (!this.scene.textures.exists(bulletTexture)) {
      // 创建默认图形作为占位符
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(0xffff00, 1);
      graphics.fillCircle(20, 20, 10);
      graphics.generateTexture(bulletTexture, 20, 20);
      graphics.destroy();
    }

    // 创建子弹
    const bullet = new Phaser.GameObjects.Sprite(this.scene, this.x, this.y, bulletTexture);
    bullet.setScale(0.5);
    bullet.setTint(0x00aaff);
    this.scene.add.existing(bullet);

    // 计算子弹速度
    const speed = 400;

    // 追踪敌人的更新函数
    const updateBullet = () => {
      if (bullet.active && target.active && enemies.includes(target)) {
        const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, target.x, target.y);
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        // 更新子弹位置
        bullet.x += velocityX * 0.016;
        bullet.y += velocityY * 0.016;

        // 检查是否击中敌人
        const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, target.x, target.y);
        if (distance < 20) {
          // 造成伤害
          target.takeDamage(this.damage);
          // 减速效果
          const originalSpeed = target.speed;
          target.speed *= this.config.slowFactor;
          // 2秒后恢复速度
          this.scene.time.delayedCall(2000, () => {
            if (target.active) {
              target.speed = originalSpeed;
            }
          });
          bullet.destroy();
        }
      } else {
        bullet.destroy();
      }
    };

    // 添加更新函数到场景的update循环
    const updateCallback = () => updateBullet();
    this.scene.events.on('update', updateCallback);

    // 确保子弹销毁时移除更新函数
    bullet.on('destroy', () => {
      this.scene.events.off('update', updateCallback);
    });
  }
}

export class SplashTower extends Tower {
  constructor(scene, x, y) {
    super(scene, x, y, 'splash');
  }

  fire(target, enemies) {
    if (this.scene.time.now - this.lastFire < this.fireRate) return;

    this.lastFire = this.scene.time.now;

    // 检查子弹纹理是否存在，如果不存在则使用默认图形
    let bulletTexture = 'bullet';
    if (!this.scene.textures.exists(bulletTexture)) {
      // 创建默认图形作为占位符
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(0xffff00, 1);
      graphics.fillCircle(20, 20, 10);
      graphics.generateTexture(bulletTexture, 20, 20);
      graphics.destroy();
    }

    // 创建子弹
    const bullet = new Phaser.GameObjects.Sprite(this.scene, this.x, this.y, bulletTexture);
    bullet.setScale(0.7);
    bullet.setTint(0xffaa00);
    this.scene.add.existing(bullet);

    // 计算子弹速度
    const speed = 300;

    // 追踪敌人的更新函数
    const updateBullet = () => {
      if (bullet.active && target.active && enemies.includes(target)) {
        const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, target.x, target.y);
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        // 更新子弹位置
        bullet.x += velocityX * 0.016;
        bullet.y += velocityY * 0.016;

        // 检查是否击中敌人
        const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, target.x, target.y);
        if (distance < 20) {
          // 范围伤害
          for (const enemy of enemies) {
            if (enemy.active && Phaser.Math.Distance.Between(target.x, target.y, enemy.x, enemy.y) <= this.config.splashRadius) {
              enemy.takeDamage(this.damage);
            }
          }
          
          // 创建爆炸效果
          const explosion = this.scene.add.graphics();
          explosion.fillStyle(0xffff00, 1);
          explosion.fillCircle(target.x, target.y, this.config.splashRadius);
          explosion.setDepth(10);
          
          // 爆炸效果淡出
          this.scene.tweens.add({
            targets: explosion,
            alpha: 0,
            duration: 500,
            onComplete: () => explosion.destroy()
          });
          
          bullet.destroy();
        }
      } else {
        bullet.destroy();
      }
    };

    // 添加更新函数到场景的update循环
    const updateCallback = () => updateBullet();
    this.scene.events.on('update', updateCallback);

    // 确保子弹销毁时移除更新函数
    bullet.on('destroy', () => {
      this.scene.events.off('update', updateCallback);
    });
  }
}
