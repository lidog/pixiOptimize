<template>
  <div></div>
</template>

<script>
import * as PIXI from "pixi.js";
export default {
  async mounted() {
    // renderer 是渲染器；一切故事从这开始
    let app = new PIXI.Application();
    document.body.appendChild(app.view);
    const texture = PIXI.Texture.from('logo.png');
    const sprite = new PIXI.Sprite(texture);
    app.stage.addChild(sprite);
    // 参照官网查看 sprite实例的属性；
    console.log(sprite)
  },
};
</script>

<style lang="less" scoped></style>
