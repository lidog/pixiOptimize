<template>
  <div></div>
</template>

<script>
import * as PIXI from "pixi.js";

export default {
  async mounted() {
    // renderer 是渲染器；一切故事从这开始
    window.PIXI = PIXI;
    let app = new PIXI.Application();
    globalThis.__PIXI_APP__ = app; //eslint disabled;
    document.body.appendChild(app.view);
    const texture = PIXI.Texture.from('logo.png');
    const sprite = new PIXI.Sprite(texture);
    app.stage.addChild(sprite);
    // 参照官网查看 sprite实例的属性；
    //实现一个标牌类
    
  },
};
</script>

<style lang="less" scoped></style>
