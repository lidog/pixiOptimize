import { Graphics } from "pixi.js";
import { protoHandle } from './trackUtils';
// import { APPARENT_STATUS } from '@/track/trackStyle';
// const style = APPARENT_STATUS[1];

// 实例化背景板
export default class TrackBgPlate {
    constructor() {
        const line = new Graphics();
        line.lineStyle(4, 0xFFFFFF, 1);
        line.moveTo(0, 0);
        line.lineTo(80, 50);
        line.x = 32;
        line.y = 32;
        line.eventMode = 'static'
        this.instance = line;
        protoHandle(this, line);
        return line;
    }
    setAlpha(alpha) {
        this.instance.alpha = alpha;
    }
}