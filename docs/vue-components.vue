<template>
  <div>
    <h1>Vue 组件展示</h1>
    <p>使用 Vue 组件实现的交互功能</p>

    <h2>组件示例</h2>

    <h3>1. 波纹按钮组件</h3>
    <RippleButton buttonText="点击我" />
    <p>点击按钮时产生的波纹效果</p>

    <h3>2. 计数器组件</h3>
    <Counter initialValue="0" />
    <p>简单的计数器功能</p>

    <h3>3. 弹窗组件</h3>
    <PopupDemo />
    <p>点击按钮显示弹窗</p>
  </div>
</template>

<script setup>
import RippleButton from './.vitepress/components/RippleButton.vue';
import Counter from './.vitepress/components/Counter.vue';
import PopupDemo from './.vitepress/components/PopupDemo.vue';
</script>

<style scoped>
/* 可以在这里添加页面特定的样式 */
</style>
