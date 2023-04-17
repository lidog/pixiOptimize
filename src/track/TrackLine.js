import { Sprite } from "pixi.js";
import { Texture } from "pixi.js";
import { Graphics } from "pixi.js";
import { protoHandle, APPARENT_STATUS, BaseTrackClass } from './trackUtils';

// 实例化背景板
export default class TrackLine extends BaseTrackClass {
    constructor(trackData) {
        super();
        const { line: lineConfig } = APPARENT_STATUS[trackData.arrDep ?? 1];
        const { size: {
            length,
            angle,
        }, style: {
            width,
            color,
            alpha,
        } } = lineConfig;
        let line = new Sprite(Texture.WHITE);
        line.height = width;
        line.tint = color;
        line.alpha = alpha;
        line.rotation = angle;
        line.width = length;
        line.position.set(0);
        protoHandle(this, line);
        return line;
    }
}