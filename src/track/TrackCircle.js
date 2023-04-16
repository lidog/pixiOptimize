import { Graphics } from "pixi.js";
import { protoHandle, BaseTrackClass } from './trackUtils';
// import { APPARENT_STATUS } from '@/track/trackStyle';
// const style = APPARENT_STATUS[1];

// 实例化背景板
export default class TrackBgPlate extends BaseTrackClass {
    constructor() {
        super();
        const circle = new Graphics();
        circle.beginFill(0xDE3249, 1);
        circle.drawCircle(100, 250, 50);
        circle.endFill();
        protoHandle(this, circle);
        return circle;
    }
}