import { Graphics, Sprite, SCALE_MODES } from "pixi.js";
import { protoHandle, BaseTrackClass, APPARENT_STATUS, tagsTypeArr } from './trackUtils';

// 实例化背景板
export default class TrackBgPlate extends BaseTrackClass {
    constructor(trackData) {
        super();
        const { label: { size, style } } = APPARENT_STATUS[trackData.arrDep] || APPARENT_STATUS[1];
        const labelSize = tagsTypeArr[0];
        const graphics = new Graphics();
        graphics.beginFill(
            style.fill.color,
            0.3 || style.fill.alpha, // 没找到是在哪里改变了alpha
        );
        graphics.drawRoundedRect(
            0,
            0,
            size.w,
            size.h,
            size.r,
        )
        graphics.endFill();
        const graphicsTexture = window.app.renderer.generateTexture(
            graphics,
            SCALE_MODES.NEAREST,
            2
        );
        const rectSprite = new Sprite(graphicsTexture);
        // rectSprite.height = labelSize.h;
        // rectSprite.width = labelSize.w;
        // 标牌点击事件
        rectSprite.anchor.set(0.5); // !important
        rectSprite.position.set(0);
        protoHandle(this, graphics);
        return rectSprite;
    }
}