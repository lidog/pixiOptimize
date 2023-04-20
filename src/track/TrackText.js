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
        protoHandle(this, textContainer);
        textContainer.name = 'trackTexts'
        return textContainer;
    }
}

const defaultFontStyle = {
    fontFamily: "Bahnschrift",
    fontSize: 14,
    fill: 0xffffff,
};
class myText extends BaseTrackClass {
    constructor(textValue, config, key) {
        super();
        const trackText = new Text(textValue, {
            ...config.style || defaultFontStyle,
            stroke: "#000000",
            strokeThickness: 1,
        });
        trackText.position.set(config.x, config.y);
        trackText.visible = Boolean(config.visible);
        protoHandle(this, trackText);
        trackText.name = key;
        return trackText;
    }
}