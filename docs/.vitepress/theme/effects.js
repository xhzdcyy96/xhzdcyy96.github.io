// CSS 特效页面的 JavaScript 事件处理

// 检查是否在浏览器环境中
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  console.log('Effects.js loaded in browser environment');
  
  // 全局函数，可在页面中直接调用
  window.createRipple = function(e) {
    console.log('Ripple effect triggered');
    const button = e.target;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    // 计算波纹位置
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    // 设置波纹样式
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    // 添加波纹到按钮
    button.appendChild(ripple);
    
    // 动画结束后移除波纹
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };
  
  window.showPopup = function(title = '提示', message = '这是一个弹窗') {
    console.log('Popup shown');
    // 创建弹窗容器
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');
    
    // 创建弹窗内容
    const popup = document.createElement('div');
    popup.classList.add('popup');
    
    // 创建标题
    const popupTitle = document.createElement('h3');
    popupTitle.classList.add('popup-title');
    popupTitle.textContent = title;
    
    // 创建消息
    const popupMessage = document.createElement('p');
    popupMessage.classList.add('popup-message');
    popupMessage.textContent = message;
    
    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.classList.add('popup-close');
    closeButton.textContent = '关闭';
    
    // 组装弹窗
    popup.appendChild(popupTitle);
    popup.appendChild(popupMessage);
    popup.appendChild(closeButton);
    popupContainer.appendChild(popup);
    
    // 添加到页面
    document.body.appendChild(popupContainer);
    
    // 关闭弹窗
    closeButton.addEventListener('click', function() {
      popupContainer.remove();
    });
    
    // 点击背景关闭弹窗
    popupContainer.addEventListener('click', function(e) {
      if (e.target === popupContainer) {
        popupContainer.remove();
      }
    });
  };
  
  // 页面加载完成后执行的函数
  function initEffects() {
    console.log('Initializing effects');
    
    // 为所有波纹按钮添加点击事件
    const rippleButtons = document.querySelectorAll('.ripple-btn');
    console.log('Found ripple buttons:', rippleButtons.length);
    rippleButtons.forEach(button => {
      // 检查是否已经添加了事件监听器
      if (!button.hasAttribute('data-ripple-initialized')) {
        console.log('Adding ripple effect to button');
        button.setAttribute('data-ripple-initialized', 'true');
        button.addEventListener('click', function(e) {
          window.createRipple(e);
        });
      }
    });
    
    // 粒子效果控制
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
      // 鼠标移动时粒子跟随
      particlesContainer.addEventListener('mousemove', function(e) {
        const particles = this.querySelectorAll('.particle');
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        particles.forEach((particle, index) => {
          const speed = (index + 1) * 0.01;
          const offsetX = (x - rect.width / 2) * speed;
          const offsetY = (y - rect.height / 2) * speed;
          particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
      });
      
      // 鼠标离开时粒子恢复原位
      particlesContainer.addEventListener('mouseleave', function() {
        const particles = this.querySelectorAll('.particle');
        particles.forEach(particle => {
          particle.style.transform = 'translate(0, 0)';
        });
      });
    }
    
    // 3D 翻转卡片控制
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
      card.addEventListener('click', function() {
        const inner = this.querySelector('.flip-card-inner');
        inner.classList.toggle('flipped');
      });
    });
    
    // 进度条控制
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      // 点击进度条时暂停/继续动画
      progressBar.addEventListener('click', function() {
        if (this.style.animationPlayState === 'paused') {
          this.style.animationPlayState = 'running';
        } else {
          this.style.animationPlayState = 'paused';
        }
      });
    }
    
    // 页面滚动效果
    window.addEventListener('scroll', function() {
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 当卡片进入视口时添加动画
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }
      });
    });
    
    // 初始化卡片动画
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      // 延迟显示卡片，创造序列动画效果
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
    
    // 霓虹文字颜色变化
    const neonText = document.querySelector('.neon-text');
    if (neonText) {
      const colors = ['#0073e6', '#e600e6', '#00e6e6', '#e6e600'];
      let colorIndex = 0;
      
      setInterval(() => {
        neonText.style.textShadow = `
          0 0 5px #fff,
          0 0 10px #fff,
          0 0 15px ${colors[colorIndex]},
          0 0 20px ${colors[colorIndex]},
          0 0 25px ${colors[colorIndex]},
          0 0 30px ${colors[colorIndex]},
          0 0 35px ${colors[colorIndex]}
        `;
        colorIndex = (colorIndex + 1) % colors.length;
      }, 2000);
    }
  }
  
  // 使用 requestAnimationFrame 确保 DOM 已经准备就绪
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEffects);
  } else {
    // 如果 DOM 已经加载完成，直接执行
    initEffects();
  }
  
  // 也添加 window.load 事件监听器作为后备
  window.addEventListener('load', initEffects);
}