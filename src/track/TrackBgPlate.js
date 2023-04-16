import { Graphics } from "pixi.js";
import { protoHandle, BaseTrackClass, APPARENT_STATUS } from './trackUtils';

// 实例化背景板
export default class TrackBgPlate extends BaseTrackClass {
    constructor(trackData) {
        super();
        const { label: { size, style } } = APPARENT_STATUS[trackData.arrDep] || APPARENT_STATUS[1];
        const graphics = new Graphics();
        graphics.beginFill(
            style.fill.color,
            0.3 || style.fill.alpha
        );
        graphics.drawRect(0, 0, size.w, size.h, size.r);
        graphics.endFill();
        protoHandle(this, graphics);
        return graphics;
    }
}