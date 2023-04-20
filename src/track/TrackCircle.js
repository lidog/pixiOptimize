import { Graphics, SCALE_MODES, Sprite } from "pixi.js";
import { protoHandle, BaseTrackClass, getApparentStatus } from './trackUtils';

// 实例化背景板
export default class TrackCircle extends BaseTrackClass {
    constructor(trackData) {
        super();
        const { style: { border, fill }, radius: { nor } } = getApparentStatus(trackData.arrDep, 'target');
        const circle = new Graphics();
        circle.lineStyle({
            width: border.width,
            color: border.color,
            alpha: trackData.isvirtually ? 0 : border.alpha,
        });
        circle.beginFill(fill.color, fill.alpha);
        circle.drawCircle(0, 0, nor);
        circle.endFill();
        const circleTexture = window.app.renderer.generateTexture(
            circle,
            SCALE_MODES.NEAREST,
            2
        )
        const circleSprite = new Sprite(circleTexture);
        circleSprite.anchor.set(0.5);
        circleSprite.position.set(0, 0);
        circleSprite.scale.set(0.5);
        protoHandle(this, circleSprite);
        circleSprite.name = 'trackCircle';
        return circleSprite;
    }
}