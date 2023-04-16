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

// import { Container } from "pixi.js";
/**
 * 把 originTarget 原型上的方法，挂到 target 上；
 */
export function protoHandle(originTarget, target) {
    target.eventMode = 'static'
    originTarget.instance = target;
    let proto = Object.getPrototypeOf(originTarget);
    let keysOfProto = Object.getOwnPropertyNames(proto);
    while (!keysOfProto.includes('setAlpha')) {
        proto = Object.getPrototypeOf(proto);
        keysOfProto = Object.getOwnPropertyNames(proto);
    }
    keysOfProto.forEach(key => {
        target[key] = (...arg) => originTarget[key].apply(originTarget, arg);
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
    update(newTrackData) {
        
    }
}


// 标牌大小及目标等样式配置
// 起降标识，1出港， 2进港， 3本地， 4过境/飞越
export const APPARENT_STATUS = {
    // 默认状态
    0: {
        label: {
            style: {
                fill: { color: 0x121110, alpha: 1 },
                text: { color: 0xffffff },
            },
            size: {
                w: 160,
                h: 75,
                r: 0,
            },
        },
        target: {
            style: {
                border: { width: 4, color: 0xffffff, alpha: 1 },
                fill: { color: 0xffffff, alpha: 0 },
            },
            radius: {
                min: 0,
                nor: 18,
                max: 48,
            },
        },
        line: {
            size: {
                length: 50,
                angle: -Math.PI / 4,
            },
            style: {
                width: 2,
                color: 0xffffff,
                alpha: 1,
            },
        },
    },
    // 离港
    1: {
        label: {
            style: {
                fill: { color: 0x121110, alpha: 1 },
                text: { color: 0xffffff },
            },
            size: {
                w: 160,
                h: 75,
                r: 0,
            },
        },
        target: {
            style: {
                border: { width: 4, color: 0xffffff, alpha: 1 },
                fill: { color: 0xffffff, alpha: 0 },
            },
            radius: {
                min: 0,
                nor: 18,
                max: 48,
            },
        },
        line: {
            size: {
                length: 50,
                angle: -Math.PI / 4,
            },
            style: {
                width: 2,
                color: 0xffffff,
                alpha: 1,
            },
        },
    },
    // 进港
    2: {
        label: {
            style: {
                fill: { color: 0x121110, alpha: 1 },
                text: { color: 0xb2e6ff },
            },
            size: {
                w: 160,
                h: 75,
                r: 0,
            },
        },
        target: {
            style: {
                border: { width: 4, color: 0xb2e6ff, alpha: 1 },
                fill: { color: 0xb2e6ff, alpha: 0 },
            },
            radius: {
                min: 0,
                nor: 18,
                max: 48,
            },
        },
        line: {
            size: {
                length: 50,
                angle: -Math.PI / 4,
            },
            style: {
                width: 2,
                color: 0xb2e6ff,
                alpha: 1,
            },
        },
    },
};

// 0,1,2简，详，扩展
export const tagsTypeArr = [
    {
        h: 50,
        w: 133,
    },
    {
        h: 75,
        w: 160,
    },
    {
        h: 75,
        w: 160,
    },
];

// 文字样式配置
export const defaultLabelTextConfig = {
    callSign: {
        visible: true,
        style: {
            fontFamily: "Bahnschrift",
            fontSize: 18,
            fill: 0xffffff,
            fontWeight: "bold",
        },
    },
    runway: {
        visible: true,
        style: {
            fontFamily: "Bahnschrift",
            fontSize: 14,
            fill: 0xffffff,
            fontWeight: "bold",
        },
    },
    StripState: {
        visible: true,
        style: {
            fontFamily: "Bahnschrift",
            fontSize: 14,
            fill: 0xffffff,
            fontWeight: "bold",
        },
    },
};

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
        isForeignPilots: {
            visible: true,
            value: trackData.isForeignPilots ? "E" : "",
            x: labelSize.w / 2 - 13,
            y: labelSize.h / 4 - 5,
        },
    }
    return mergeTextStyle(textConfig, defaultLabelTextConfig);
};