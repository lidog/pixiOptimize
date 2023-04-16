<template>
    <div>
    </div>
</template>

<script setup>
import {onMounted} from "vue";
import * as PIXI from "pixi.js";
import renderTrack from '@/track';

onMounted(async () => {
    let app = new PIXI.Application({ background: "#ccc" });
    /* eslint-disable */
    globalThis.__PIXI_APP__ = app; 
    document.body.appendChild(app.view);
    let trackData = await fetch('/track.json').then(res => res.json());
    const track  = renderTrack(trackData, app);
    track.setPosition(100, 100);
})

</script>

<style lang="scss" scoped>

</style>