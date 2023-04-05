import { Graphics } from "pixi.js";
import { protoHandle, BaseTrackClass } from './trackUtils';
// import { APPARENT_STATUS } from '@/track/trackStyle';
// const style = APPARENT_STATUS[1];

// 实例化背景板
export default class TrackBgPlate extends BaseTrackClass {
    constructor() {
        super();
        const graphics = new Graphics();
        graphics.beginFill(0xDE3249);
        graphics.drawRect(50, 50, 100, 100);
        graphics.endFill();
        graphics.eventMode = 'static'
        this.instance = graphics;
        protoHandle(this, graphics);
        return graphics;
    }
}