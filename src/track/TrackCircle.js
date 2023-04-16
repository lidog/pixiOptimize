import { Graphics } from "pixi.js";
import { protoHandle, BaseTrackClass, APPARENT_STATUS } from './trackUtils';
// const style = APPARENT_STATUS[1];

// 实例化背景板
export default class TrackBgPlate extends BaseTrackClass {
    constructor(trackData) {
        super();
        const { target: { style: { border, fill }, radius: {nor} } } = APPARENT_STATUS[trackData.arrDep] || APPARENT_STATUS[1];
        const circle = new Graphics();
        circle.lineStyle({
            width: border.width,
            color: border.color,
            alpha: trackData.isvirtually ? 0 : border.alpha,
          });
        circle.beginFill(fill.color, fill.alpha);
        circle.drawCircle(0,0, nor);
        circle.endFill();
        protoHandle(this, circle);
        this.setScale(0.5, 0.5);
        return circle;
    }
}