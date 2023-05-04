import { get } from "lodash";
import { APPARENT_STATUS, defaultLabelTextConfig } from "./trackConst";
import Vue from "vue";
import { GlowFilter, OutlineFilter } from "pixi-filters";

export const trackBus = new Vue();

// 新建track 的配置, 全局共享；
export const trackConfig = {
  labelAlpha: 0.3,
  defaultAngle: 76.05193,
  angle: 76.05193,
  scale: 0.25,
};

// 全局实例缓存
export const renderedTrackMap = Object.create(null);

// 判断是否是新的track
export const isNewTrack = (trackNumber) => !renderedTrackMap[trackNumber];

/**
 * 把 originTarget 原型上的方法，挂到 target 上；
 * 把target 的子元素映射为属性；
 */
export function protoHandle(originTarget, target) {
  target.eventMode = "static";
  originTarget.dom = target;
  let proto = Object.getPrototypeOf(originTarget);
  let keysOfProto = Object.getOwnPropertyNames(proto);
  keysOfProto.forEach((key) => {
    target[key] = (...arg) => originTarget[key].apply(originTarget, arg);
  });
  Object.getOwnPropertyNames(BaseTrackClass.prototype).forEach((key) => {
    target[key] = (...arg) => originTarget[key].apply(originTarget, arg);
  });
  // 映射子元素
  target.children?.forEach((children) => {
    target[children.name] = children;
  });
}

/**
 * 基础类，集成一些基础方法；
 */
export class BaseTrackClass {
  setPosition(x, y) {
    this.dom.position.set(x, y);
  }
  setScale(x, y) {
    this.dom.scale.set(x, y);
  }
  getParent(parentName) {
    let parent = this.dom.parent;
    while (parent?.name !== parentName) {
      parent = parent.parent;
    }
    if (parent?.name !== parentName) return null;
    return parent;
  }
  getParentByType(trackType) {
    let parent = this.dom.parent;
    while (parent?.trackType !== trackType) {
      parent = parent.parent;
    }
    if (parent.trackType !== trackType) return null;
    return parent;
  }
  getTrackData() {
    return this.dom?.trackData ?? this.getParentByType("track")?.trackData;
  }
  contains(childrenName) {
    let match = (parent) => {
      let children = parent.children;
      if(children?.length > 0) {
        for(let i = 0; i < children.length; i++) {
          if (children[i].name === childrenName) {
            return true;
          } else if (children.children?.length > 0) {
            return match(children);
          }
        }
      }
      return false;
    }
    return match(this.dom);
  }
  belongTo(parentName) {
      return Boolean(this.getParent(parentName));
  }
}

export function getApparentStatus(index = 1, key = "") {
  return get(APPARENT_STATUS[index], key);
}

// 合并style；
const mergeTextStyle = (textConfig, defaultConfig) => {
  Object.keys(defaultConfig).forEach((key) => {
    if (textConfig[key]) {
      textConfig[key].style = defaultConfig[key].style;
    }
  });
  return textConfig;
};

// 全标牌
export const getAllLabelText = (trackData) => {
  const isHavePlanText = !trackData.relatedFlag === 0 ? "*" : "";
  const isHaveRouteText = trackData.relatedFlag === 2 ? "*" : "";
  const { label } = APPARENT_STATUS[trackData.arrDep] || APPARENT_STATUS[1];
  const labelSize = label.size;
  const centerX = -labelSize.w / 2;
  const centerY = -labelSize.h / 2;
  const textConfig = {
    callSign: {
      visible: true,
      value: isHavePlanText + trackData.callSign + isHaveRouteText,
      x: centerX + 2,
      y: centerY,
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
      x: centerX + trackData.callSign.length + 90,
      y: centerY,
    },
    flyType: {
      visible: true,
      value: trackData.flyType,
      x: -labelSize.w / 4 + trackData.callSign.length + 50,
      y: centerY,
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
      x: centerX + 3,
      y: -labelSize.h / 5,
    },
    wakeType: {
      visible: true,
      value: trackData.wakeType,
      x: centerX + trackData.aircraftType.length + 33,
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
      x: centerX + 3,
      y: labelSize.h / 30,
    },
    StripState: {
      visible: true,
      value: trackData.StripState,
      x: centerX - 30,
      y: labelSize.h / 30,
    },
    freeText: {
      visible: true,
      value: "FREETEXT",
      x: centerX + 3,
      y: labelSize.h / 4,
    },
    isForeignPilots: {
      visible: true,
      value: trackData.isForeignPilots ? "E" : "",
      x: (centerX * -1) - 13,
      y: labelSize.h / 4,
    },
  };
  return mergeTextStyle(textConfig, defaultLabelTextConfig);
};

// 简标牌
export const getSimpleLabelText = (trackData) => {
  const isHavePlanText = !trackData.relatedFlag === 0 ? "*" : "";
  const isHaveRouteText = trackData.relatedFlag === 2 ? "*" : "";
  const { label } = APPARENT_STATUS[trackData.arrDep] || APPARENT_STATUS[1];
  const labelSize = label.size;
  const centerX = -labelSize.w / 2;
  const centerY = -labelSize.h / 2;
  const textConfig = {
    callSign: {
      visible: true,
      value: isHavePlanText + trackData.callSign + isHaveRouteText,
      x: centerX + 2,
      y: centerY - 2,
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
      x: centerX + trackData.callSign.length + 75,
      y: centerY - 2,
    },
    runway: {
      visible: true,
      value: trackData.runway,
      x: -1*centerX - 27,
      y: centerY,
    },
    flyType: {
      visible: true,
      value: trackData.flyType,
      x: centerX + 2,
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
      x: -1*centerX - 30,
      y: -labelSize.h / 7,
    },
    // isForeignPilots: {
    //     visible: true,
    //     value: trackData.isForeignPilots ? "E" : "",
    //     x: labelSize.w / 2 - 13,
    //     y: labelSize.h / 4 - 5,
    // },
  };
  return mergeTextStyle(textConfig, defaultLabelTextConfig);
};

// 生成filter滤镜，并缓存；
const filterCache = {};
export function renderFilterByColor(color) {
  if (filterCache[color]) return filterCache[color];
  const filter = [
    new GlowFilter({
      distance: 30,
      outerStrength: 5,
      color,
    }),
  ];
  filterCache[color] = filter;
  return filter;
}

export function renderOutlineFilter(...args) {
  if (filterCache.outline) return filterCache.outline;
  return (filterCache.outline = [new OutlineFilter(...args)]);
}
