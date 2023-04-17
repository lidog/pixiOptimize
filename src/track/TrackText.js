import { Text, Container } from "pixi.js";
import { protoHandle, BaseTrackClass, getSimpleLabelText } from './trackUtils';

export default class TrackText extends BaseTrackClass {
    constructor(trackData) {
        super();
        const textContainer = new Container();
        textContainer.trackTexts = Object.create(null);
        const textConfig = getSimpleLabelText(trackData);
        Object.keys(textConfig).forEach(key => {
            const text = new myText(trackData[key], textConfig[key]);
            textContainer.trackTexts[key] = text;
            textContainer.addChild(text);
        })
        protoHandle(this, textContainer);
        // textContainer.scale.set(0.8), 1;
        return textContainer;
    }
}

const defaultFontStyle = {
    fontFamily: "Bahnschrift",
    fontSize: 14,
    fill: 0xffffff,
};
class myText extends BaseTrackClass {
    constructor(textValue, config) {
        super();
        const trackText = new Text(textValue, {
            ...config.style || defaultFontStyle,
            stroke: "#000000",
            strokeThickness: 1,
        });
        trackText.position.set(config.x, config.y);
        trackText.visible = config.visible;
        protoHandle(this, trackText);
        return trackText;
    }
}