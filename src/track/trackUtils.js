import lodash from "lodash";
import { APPARENT_STATUS, defaultLabelTextConfig } from "./trackConst";

// 全局缓存
export const renderedTrackMap = Object.create(null);
// 全局数据缓存
export const renderedTrackDataMap = Object.create(null);

// 判断是否是新的track
export const isNewTrack = trackNumber => !renderedTrackMap[trackNumber];

// 判断是否数据有变化；
export const isTrackDataUpdated = trackData => {
    return JSON.stringify(trackData) === renderedTrackDataMap[trackData.trackNumber];
}

/**
 * 把 originTarget 原型上的方法，挂到 target 上；
 * 把target 的子元素映射为属性；
 */
export function protoHandle(originTarget, target) {
    target.eventMode = 'static'
    originTarget.instance = target;
    let proto = Object.getPrototypeOf(originTarget);
    let keysOfProto = Object.getOwnPropertyNames(proto);
    keysOfProto.forEach(key => {
        target[key] = (...arg) => originTarget[key].apply(originTarget, arg);
    });
    while (!keysOfProto.includes('setAlpha')) {
        proto = Object.getPrototypeOf(proto);
        keysOfProto = Object.getOwnPropertyNames(proto);
    }
    keysOfProto.forEach(key => {
        target[key] = (...arg) => originTarget[key].apply(originTarget, arg);
    });
    // 映射子元素
    target.children?.forEach(children => {
        target[children.name] = children;
    })
}

/**
 * 基础类，集成一些基础方法；
 */
export class BaseTrackClass {
    setAlpha(alpha) {
        this.instance.alpha = alpha;
    }
    setPosition(x, y) {
        this.instance.position.set(x, y);
    }
    setScale(x, y) {
        this.instance.scale.set(x, y);
    }
}

export function getApparentStatus(index = 1, key = '') {
    return lodash.get(APPARENT_STATUS[index], key);
}

// 合并style；
const mergeTextStyle = (textConfig, defaultConfig) => {
    Object.keys(defaultConfig).forEach(key => {
        if (textConfig[key]) {
            textConfig[key].style = defaultConfig[key].style;
        }
    })
    return textConfig;
}

// 全标牌
export const getAllLabelText = (trackData) => {
    const isHavePlanText = !trackData.relatedFlag === 0 ? "*" : "";
    const isHaveRouteText = trackData.relatedFlag === 2 ? "*" : "";
    const { label } = APPARENT_STATUS[trackData.arrDep] || APPARENT_STATUS[1];
    const labelSize = label.size;
    const textConfig = {
        callSign: {
            visible: true,
            value: isHavePlanText + trackData.callSign + isHaveRouteText,
            x: -labelSize.w / 2 + 2,
            y: -labelSize.h / 2,
        },
        isControllStr: {
            visible: false,
            value: "■",
            style: {
                fontFamily: "Bahnschrift",
                fontSize: 12,
                fill: 0xffffbf,
                fontWeight: "bold",
            },
            x: -labelSize.w / 2 + trackData.callSign.length + 90,
            y: -labelSize.h / 2,
        },
        flyType: {
            visible: true,
            value: trackData.flyType,
            x: -labelSize.w / 4 + trackData.callSign.length + 50,
            y: -labelSize.h / 2,
        },
        runway: {
            visible: true,
            value: trackData.runway,
            x: labelSize.w / 2 - 27,
            y: -labelSize.h / 2,
        },
        aircraftType: {
            visible: true,
            value: trackData.aircraftType + "/",
            x: -labelSize.w / 2 + 3,
            y: -labelSize.h / 5,
        },
        wakeType: {
            visible: true,
            value: trackData.wakeType,
            x: -labelSize.w / 2 + trackData.aircraftType.length + 33,
            y: -labelSize.h / 5,
        },
        DestAirport: {
            visible: true,
            value: trackData.DestAirport,
            x: labelSize.w / 2 - 80,
            y: -labelSize.h / 5,
        },
        actTime: {
            visible: true,
            value: 1962,
            x: labelSize.w / 2 - 30,
            y: -labelSize.h / 5,
        },
        SID: {
            visible: true,
            value: trackData.SID,
            x: -labelSize.w / 2 + 3,
            y: labelSize.h / 30,
        },
        StripState: {
            visible: true,
            value: trackData.StripState,
            x: labelSize.w / 2 - 30,
            y: labelSize.h / 30,
        },
        freeText: {
            visible: true,
            value: "FREETEXT",
            x: -labelSize.w / 2 + 3,
            y: labelSize.h / 4,
        },
        isForeignPilots: {
            visible: true,
            value: trackData.isForeignPilots ? "E" : "",
            x: labelSize.w / 2 - 13,
            y: labelSize.h / 4,
        },
    }
    return mergeTextStyle(textConfig, defaultLabelTextConfig);
}

// 简标牌
export const getSimpleLabelText = (trackData) => {
    const isHavePlanText = !trackData.relatedFlag === 0 ? "*" : "";
    const isHaveRouteText = trackData.relatedFlag === 2 ? "*" : "";
    const { label } = APPARENT_STATUS[trackData.arrDep] || APPARENT_STATUS[1];
    const labelSize = label.size;
    const textConfig = {
        callSign: {
            visible: true,
            value: isHavePlanText + trackData.callSign + isHaveRouteText,
            x: -labelSize.w / 2 + 2,
            y: -labelSize.h / 2 - 2,
        },
        isControllStr: {
            visible: trackData.isControll,
            value: "■",
            style: {
                fontFamily: "Bahnschrift",
                fontSize: 12,
                fill: 0xffffbf,
                fontWeight: "bold",
            },
            x: -labelSize.w / 2 + trackData.callSign.length + 75,
            y: -labelSize.h / 2 - 2,
        },
        runway: {
            visible: true,
            value: trackData.runway,
            x: labelSize.w / 2 - 27,
            y: -labelSize.h / 2,
        },
        flyType: {
            visible: true,
            value: trackData.flyType,
            x: -labelSize.w / 2 + 2,
            y: -labelSize.h / 7,
        },
        wakeType: {
            visible: true,
            value: trackData.wakeType,
            x: -labelSize.w / 4,
            y: -labelSize.h / 7,
        },
        StripState: {
            visible: true,
            value: trackData.StripState,
            x: labelSize.w / 2 - 30,
            y: -labelSize.h / 7,
        },
        // isForeignPilots: {
        //     visible: true,
        //     value: trackData.isForeignPilots ? "E" : "",
        //     x: labelSize.w / 2 - 13,
        //     y: labelSize.h / 4 - 5,
        // },
    }
    return mergeTextStyle(textConfig, defaultLabelTextConfig);
};