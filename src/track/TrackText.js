import { Text, Container } from "pixi.js";
import { protoHandle, BaseTrackClass, getSimpleLabelText } from './trackUtils';

export default class TrackText extends BaseTrackClass {
    constructor(trackData) {
        super();
        const textContainer = new Container();
        const textConfig = getSimpleLabelText(trackData);
        Object.keys(textConfig).forEach(key => {
            const text = new myText(trackData[key], textConfig[key], key);
            textContainer.addChild(text);
        })
        textContainer.name = 'trackTexts'
        protoHandle(this, textContainer);
        return textContainer;
    }
    update(newTrackData) {
        this.dom.children.forEach(children => children?.update?.(newTrackData));
    }
}

const defaultFontStyle = {
    fontFamily: "Bahnschrift",
    fontSize: 14,
    fill: 0xffffff,
};
class myText extends BaseTrackClass {
    constructor(textValue, textConfig, key) {
        super();
        this.textKey = key;
        const trackText = new Text(textValue, {
            ...textConfig.style || defaultFontStyle,
            stroke: "#000000",
            strokeThickness: 1,
        });
        trackText.position.set(textConfig.x, textConfig.y);
        trackText.visible = Boolean(textConfig.visible);
        protoHandle(this, trackText);
        trackText.name = key;
        return trackText;
    }
    update(newTrackData) {
        this.dom.children.forEach(children => children?.update?.(newTrackData));
        // 改变文字；
        if (this.dom.text !== newTrackData[this.textKey]) {
            this.dom.text = newTrackData[this.textKey];
        }
        // 重新定义style this.dom.style = { fill: xxx, font:xxx }
        // 设置 透明度
        this.dom.alpha = newTrackData.isTrackOwner ? 1 : 0.5;
    }
}