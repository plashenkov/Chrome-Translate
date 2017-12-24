<template>
  <div class="spinner">
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
  </div>
</template>

<style>
  .spinner {
    margin: 0 auto;
    width: 42px;
    height: 26px;
    text-align: center;
    font-size: 10px;
  }

  .spinner > div {
    float: left;
    margin-right: 3px;
    background-color: #adadad;
    border: 1px solid #929292;
    width: 6px;
    height: 100%;
    box-sizing: border-box;
    animation: sk-stretchdelay 1.2s infinite ease-in-out;
  }

  .spinner > div:last-child {
    margin-right: 0;
  }

  .spinner .rect2 {
    animation-delay: -1.1s;
  }

  .spinner .rect3 {
    animation-delay: -1.0s;
  }

  .spinner .rect4 {
    animation-delay: -0.9s;
  }

  .spinner .rect5 {
    animation-delay: -0.8s;
  }

  @keyframes sk-stretchdelay {
    0%, 40%, 100% {
      transform: scaleY(0.6);
    }

    20% {
      transform: scaleY(1.0);
    }
  }
</style>
