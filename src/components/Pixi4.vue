<template>
    <div>
    </div>
</template>

<script setup>
import {onMounted} from "vue";
import * as PIXI from "pixi.js";
import renderTrack from '@/track';
import { Viewport } from "pixi-viewport";

onMounted(async () => {
    let app = new PIXI.Application({ background: "#ccc", width: 600, height: 600 });
    window.app = app;
    /* eslint-disable */
    globalThis.__PIXI_APP__ = app;
    document.body.appendChild(app.view);
    let viewport = new Viewport({
        divWheel: app.view,
    });
    app.stage.addChild(viewport);
    let trackData = await fetch('/track.json').then(res => res.json());
    const trackDom  = renderTrack(trackData, viewport);
    console.log(trackDom);
})

</script>

<style lang="scss" scoped>

</style>