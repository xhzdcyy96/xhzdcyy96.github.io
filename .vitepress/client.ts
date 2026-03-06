// VitePress 客户端脚本
import { defineClientConfig } from 'vitepress/client'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    // 页面加载完成后执行
    window.addEventListener('load', function() {
      // 波纹按钮效果
      const button = document.getElementById('ripple-button');
      if (button) {
        button.addEventListener('click', function(e) {
          // 创建波纹元素
          const ripple = document.createElement('span');
          ripple.classList.add('ripple');
          
          // 计算波纹位置
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
          
          // 设置波纹样式
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          
          // 添加波纹到按钮
          this.appendChild(ripple);
          
          // 动画结束后移除波纹
          setTimeout(() => {
            ripple.remove();
          }, 600);
          
          // 显示弹窗
          const popupContainer = document.createElement('div');
          popupContainer.classList.add('popup-container');
          
          const popup = document.createElement('div');
          popup.classList.add('popup');
          
          const popupTitle = document.createElement('h3');
          popupTitle.classList.add('popup-title');
          popupTitle.textContent = '按钮被点击了！';
          
          const popupMessage = document.createElement('p');
          popupMessage.classList.add('popup-message');
          popupMessage.textContent = '这是一个弹窗示例，展示了按钮点击事件的响应。';
          
          const closeButton = document.createElement('button');
          closeButton.classList.add('popup-close');
          closeButton.textContent = '关闭';
          
          popup.appendChild(popupTitle);
          popup.appendChild(popupMessage);
          popup.appendChild(closeButton);
          popupContainer.appendChild(popup);
          
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
        });
      }
    });
  }
})