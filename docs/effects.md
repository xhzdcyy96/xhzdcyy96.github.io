---
title: CSS 特效展示
---

<div class="home-hero">
  <h1>CSS 特效展示</h1>
  <p>探索各种有趣的 CSS 动画和特效</p>
</div>

## 特效展示

### 1. 渐变文字

<div class="card">
  <h2>渐变文字效果</h2>
  <div class="gradient-text">CSS 渐变文字效果</div>
  <p>使用背景渐变和文字裁剪实现的渐变文字效果</p>
</div>

### 2. 悬停卡片

<div class="card hover-card">
  <h2>悬停卡片效果</h2>
  <p>当鼠标悬停时，卡片会产生阴影和缩放效果</p>
</div>

### 3. 加载动画

<div class="card">
  <h2>加载动画</h2>
  <div class="loader"></div>
  <p>使用 CSS 动画实现的加载指示器</p>
</div>

### 4. 3D 翻转卡片

<div class="card">
  <h2>3D 翻转卡片</h2>
  <div class="flip-card">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <h3>正面</h3>
        <p>点击卡片翻转</p>
      </div>
      <div class="flip-card-back">
        <h3>背面</h3>
        <p>3D 翻转效果</p>
      </div>
    </div>
  </div>
  <p>使用 CSS 3D 变换实现的卡片翻转效果</p>
</div>

### 5. 波纹效果

<div class="card">
  <h2>波纹效果</h2>
  <button id="ripple-button" class="ripple-btn" onclick="window.showPopup('按钮被点击了！', '这是一个弹窗示例，展示了按钮点击事件的响应。')">点击我333</button>
  <p>点击按钮时产生的波纹扩散效果</p>
</div>

### 6. 进度条

<div class="card">
  <h2>进度条</h2>
  <div class="progress-container">
    <div class="progress-bar"></div>
  </div>
  <p>使用 CSS 动画实现的进度条效果</p>
</div>

### 7. 霓虹文字

<div class="card">
  <h2>霓虹文字</h2>
  <div class="neon-text">霓虹文字效果</div>
  <p>使用文字阴影和动画实现的霓虹效果</p>
</div>

### 8. 粒子效果

<div class="card">
  <h2>粒子效果</h2>
  <div class="particles-container">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
  </div>
  <p>使用 CSS 动画实现的粒子浮动效果</p>
</div>

## 技术实现

所有特效均使用纯 CSS 实现，未使用任何 JavaScript。主要技术包括：

- CSS 渐变
- CSS 动画
- CSS 变换
- CSS 过渡
- CSS 伪元素
- CSS 变量

这些特效可以直接应用到您的项目中，为用户界面增添活力和互动性。