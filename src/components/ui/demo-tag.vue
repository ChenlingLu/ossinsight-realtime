<template>
  <div class="demo-tag">
    <span class="demo-tag-content">DEMO</span>
  </div>
</template>
<style scoped lang="less">
.demo-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: -30px;
  width: 131px;
  bottom: 20px;
  rotate: 45deg;
  background: #0085FF;
  color: white;
  background-blend-mode: exclusion;
  font-size: 16px;
  font-weight: bold;

  &-content {
    padding: 4px 0;
    letter-spacing: 4px;
  }
}
</style>