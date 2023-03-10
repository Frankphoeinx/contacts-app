<template>
  <div class="loader-wrapper">
    <div class="loader-ripple">
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loader-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(#383838, 0.4);

  .loader-ripple {
    display: inline-block;
    position: relative;
    width: 160px;
    height: 160px;
  }
  .loader-ripple div {
    position: absolute;
    border: 4px solid #fff;
    opacity: 1;
    border-radius: 50%;
    animation: loader-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .loader-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes loader-ripple {
    0% {
      top: 80px;
      left: 80px;
      width: 0;
      height: 0;
      opacity: 0;
    }
    4.9% {
      top: 80px;
      left: 80px;
      width: 0;
      height: 0;
      opacity: 0;
    }
    5% {
      top: 80px;
      left: 80px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 160px;
      height: 160px;
      opacity: 0;
    }
  }
}
</style>
