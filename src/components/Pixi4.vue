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
    let labelRect = track.labelRect;
    labelRect.on('pointerdown', () => {
        labelRect.setAlpha(0.5);
    });
    labelRect.on('pointerup', () => {
        labelRect.setAlpha(1);
    });
    track.setPosition(100, 100);
    track.labelText.trackCallSign.setPosition(10, 10);
})

</script>

<style lang="scss" scoped>

</style>