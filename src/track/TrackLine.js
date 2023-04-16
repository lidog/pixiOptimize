import { Graphics } from "pixi.js";
import { protoHandle, APPARENT_STATUS, BaseTrackClass } from './trackUtils';

// 实例化背景板
export default class TrackLine extends BaseTrackClass {
    constructor(trackData) {
        super();
        const { line: lineConfig } = APPARENT_STATUS[trackData.arrDep || 1];
        const { size, style: {
            width,
            color,
            alpha,
        } } = lineConfig;
        const line = new Graphics();
        line.lineStyle(width, color, alpha);
        line.moveTo(0, 0);
        line.lineTo(80, 50);
        line.x = 32;
        line.y = 32;
        protoHandle(this, line);
        return line;
    }
}