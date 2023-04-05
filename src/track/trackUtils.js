// import { Container } from "pixi.js";
/**
 * 把 originTarget 原型上的方法，挂到 target 上；
 */
export function protoHandle(originTarget, target) {
    let proto = Object.getPrototypeOf(originTarget);
    let keysOfProto =  Object.getOwnPropertyNames(proto);
    while (!keysOfProto.includes('setAlpha')) {
        proto = Object.getPrototypeOf(proto);
        keysOfProto =  Object.getOwnPropertyNames(proto);
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
        this.instance.position.set(x,y);
    }
}