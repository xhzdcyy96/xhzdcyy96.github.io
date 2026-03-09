// 游戏状态管理

export class GameState {
  constructor(gameManager) {
    this.gameManager = gameManager;
  }

  enter() {}
  exit() {}
  update() {}
  handlePointerDown(pointer) {}
}

export class NormalState extends GameState {
  enter() {
    console.log('Entering Normal State');
    // 游戏已经在 PausedState 的 exit 方法中恢复，不需要再次 resume
  }

  exit() {
    console.log('Exiting Normal State');
  }

  update() {
    // 游戏正常更新逻辑
  }

  handlePointerDown(pointer) {
    // 检查是否点击了暂停按钮
    if (globalThis.isClickOnPauseButton && globalThis.isClickOnPauseButton(pointer)) {
      this.gameManager.changeState('paused');
      return;
    }

    // 检查是否点击了认输按钮
    if (globalThis.isClickOnGiveUpButton && globalThis.isClickOnGiveUpButton(pointer)) {
      this.gameManager.changeState('gameOver');
      globalThis.gameOver();
      return;
    }

    // 检查是否点击了塔选择UI
    if (globalThis.isClickOnTowerSelectionUI && globalThis.isClickOnTowerSelectionUI(pointer)) {
      return;
    }

    // 检查是否点击了塔操作UI
    if (globalThis.isClickOnTowerUI && globalThis.isClickOnTowerUI(pointer)) {
      return;
    }

    // 检查是否点击了塔
    const clickedTower = globalThis.getClickedTower && globalThis.getClickedTower(pointer);
    if (clickedTower) {
      // 清除之前的塔操作UI
      globalThis.clearTowerUI && globalThis.clearTowerUI();
      // 创建新的塔操作UI
      globalThis.createTowerUI && globalThis.createTowerUI(clickedTower);
      return;
    }

    // 清除塔操作UI
    globalThis.clearTowerUI && globalThis.clearTowerUI();

    // 检查是否可以放置塔
    if (globalThis.selectedTowerType && globalThis.canPlaceTower && globalThis.canPlaceTower(pointer.x, pointer.y)) {
      globalThis.placeTower && globalThis.placeTower(pointer.x, pointer.y);
    }
  }
}

export class PausedState extends GameState {
  enter() {
    console.log('Entering Paused State');
    // 创建暂停蒙层
    if (globalThis.createOverlay) {
      globalThis.createOverlay(globalThis.scene, 'pauseOverlay', '游戏暂停', '#ffffff');
    }
    // 暂停所有敌人的 tweens 动画
    if (globalThis.enemies && globalThis.enemies.length > 0) {
      for (const enemy of globalThis.enemies) {
        if (enemy && enemy.scene) {
          enemy.scene.tweens.pauseAll();
        }
      }
    }
    // 不使用 scene.pause()，因为会阻止输入事件
    // 而是通过在 update 方法中不执行游戏逻辑来实现暂停
  }

  exit() {
    console.log('Exiting Paused State');
    // 关闭暂停蒙层
    if (globalThis.closeOverlay) {
      globalThis.closeOverlay('pauseOverlay');
    }
    // 恢复所有敌人的 tweens 动画
    if (globalThis.enemies && globalThis.enemies.length > 0) {
      for (const enemy of globalThis.enemies) {
        if (enemy && enemy.scene) {
          enemy.scene.tweens.resumeAll();
        }
      }
    }
    // 不需要 resume，因为我们没有使用 pause
  }

  update() {
    // 暂停状态下不更新游戏逻辑
  }

  handlePointerDown(pointer) {
    // 直接切换到 normal 状态，不需要检查点击位置
    // 这样点击屏幕任意位置都可以继续游戏
    this.gameManager.changeState('normal');
  }
}

export class GameOverState extends GameState {
  enter() {
    console.log('Entering Game Over State');
    // 不使用 scene.pause()，因为会阻止输入事件
    // 暂停所有敌人的 tweens 动画
    if (globalThis.enemies && globalThis.enemies.length > 0) {
      for (const enemy of globalThis.enemies) {
        if (enemy && enemy.scene) {
          enemy.scene.tweens.pauseAll();
        }
      }
    }
    // 创建游戏结束蒙层
    if (globalThis.createOverlay) {
      globalThis.createOverlay(globalThis.scene, 'gameOverOverlay', '游戏结束', '#ff0000');
    }
    // 创建重新开始按钮
    if (globalThis.scene) {
      const restartButton = globalThis.scene.add.text(400, 400, '重新开始', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);
      restartButton.setInteractive();
      restartButton.name = 'restartButton';
      restartButton.setDepth(1001); // 确保按钮在最上层

      // 创建碰撞区域
      const hitArea = globalThis.scene.add.rectangle(400, 400, 200, 50, 0x000000, 0);
      hitArea.name = 'restartBtnHitArea';
      hitArea.setDepth(1001); // 确保碰撞区域在最上层
      hitArea.setInteractive();
    }
  }

  exit() {
    console.log('Exiting Game Over State');
    // 关闭游戏结束蒙层
    if (globalThis.closeOverlay) {
      globalThis.closeOverlay('gameOverOverlay');
    }
    // 恢复所有敌人的 tweens 动画
    if (globalThis.enemies && globalThis.enemies.length > 0) {
      for (const enemy of globalThis.enemies) {
        if (enemy && enemy.scene) {
          enemy.scene.tweens.resumeAll();
        }
      }
    }
  }

  update() {
    // 游戏结束状态下不更新游戏逻辑
  }

  handlePointerDown(pointer) {
    // 检查是否点击了重新开始按钮
    const children = globalThis.scene.children.getChildren();
    for (const child of children) {
      if (child.name === 'restartBtnHitArea') {
        const hitArea = child;
        // 检查 hitArea 是否有 getBounds 方法
        if (typeof hitArea.getBounds === 'function') {
          const bounds = hitArea.getBounds();
          if (pointer.x >= bounds.x && pointer.x <= bounds.x + bounds.width &&
              pointer.y >= bounds.y && pointer.y <= bounds.y + bounds.height) {
            // 点击了重新开始按钮
            // 先重置游戏状态，再切换到 normal 状态
            globalThis.resetGame && globalThis.resetGame();
            this.gameManager.changeState('normal');
            // 阻止事件继续传播，防止误触放置塔的操作
            return true;
          }
        }
      }
    }
    return false;
  }
}

export class GameManager {
  constructor() {
    this.states = {
      normal: new NormalState(this),
      paused: new PausedState(this),
      gameOver: new GameOverState(this)
    };
    this.currentState = null;
  }

  changeState(stateName) {
    if (this.currentState) {
      this.currentState.exit();
    }
    this.currentState = this.states[stateName];
    if (this.currentState) {
      this.currentState.enter();
    }
  }

  update() {
    if (this.currentState) {
      this.currentState.update();
    }
  }

  handlePointerDown(pointer) {
    if (this.currentState) {
      this.currentState.handlePointerDown(pointer);
    }
  }
}
