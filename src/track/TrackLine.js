import { Sprite, Texture } from "pixi.js";
import { protoHandle, BaseTrackClass, getApparentStatus } from './trackUtils';

// 实例化背景板
export default class TrackLine extends BaseTrackClass {
    constructor(trackData) {
        super();
        const {
            size: {
                length,
                angle,
            },
            style: {
                width,
                color,
                alpha,
            }
        } = getApparentStatus(trackData.arrDep, 'line');
        let line = new Sprite(Texture.WHITE);
        line.height = width;
        line.tint = color;
        line.alpha = alpha;
        line.rotation = angle;
        line.width = length;
        line.position.set(0);
        protoHandle(this, line);
        line.name = 'trackLine';
        return line;
    }
}