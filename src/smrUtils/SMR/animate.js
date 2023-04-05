// import * as PIXI from 'pixi.js'
import {
    Ticker,
    Graphics,
    Renderer,
    SCALE_MODES,
    MSAA_QUALITY,
    Assets,
    Texture,
    Sprite,
    settings,
    Container,
    Text,
} from "pixi.js";
import Util from "@/utils/tools";
import * as TWEEDLE from "tweedle.js";
import head_runway_json from "/public/SMR/target_head_runway_new";
let _surface, _texture
const animate = {
    initFlowArrowAnimate(sprite) {
        const data = head_runway_json.land;
        let copyData = JSON.parse(JSON.stringify(data));

        let tickerCnt = 0;
        let tickerGap = 10;
        let pos = 0;
        const ticker = new Ticker();
        ticker.add(() => {
            if (tickerCnt > tickerGap) {
                tickerCnt = 0;

                if (copyData.length < 2) {
                    copyData = JSON.parse(JSON.stringify(data));
                }
                copyData.shift();
                let len = copyData.length;

                if (pos > len - 2) {
                    pos = 0;
                }
                pos++;
                console.log("len: ", len);
                console.log("pos: ", pos);
                sprite.position.set(data[pos][0], data[pos][1]);
                // sprite.angle = data[pos][2]
            }
            tickerCnt++;
        });
        ticker.start();
    },
    drawArrow() {
        const arrow = new Graphics();
        arrow.beginFill(0xff3300, 1);
        arrow.lineStyle(1, 0xffd900, 1);
        arrow.moveTo(0, 0);
        arrow.lineTo(50, 50);
        arrow.lineTo(0, 100);
        arrow.lineTo(0, 0);
        arrow.closePath();
        arrow.endFill();

        return arrow;
    },
    drawLonngArrow() {
        const path = [
            0, -50, 200, -50, 200, -100, 300, 0, 200, 100, 200, 50, 0, 50,
        ];
        const arrow = new Graphics();
        arrow.lineStyle(1, 0x000001, 1);
        arrow.beginFill(0xb2e6ff, 1);
        arrow.drawPolygon(path);
        arrow.endFill();

        return arrow;
    },
    getArrowTexture() {
        settings.STRICT_TEXTURE_CACHE = true;
        try {
            return Texture.from("arrow");
        } catch {
            const arrow = this.drawArrow();
            const arrowTexture = new Renderer().generateTexture(arrow, {
                scaleMode: SCALE_MODES.NEAREST,
                resolution: 2,
                multisample: MSAA_QUALITY.HIGH,
            });
            Texture.addToCache(arrowTexture, "arrow");
            return arrowTexture;
        }
    },
    async renderArrowSprite() {
        // const texture = this.getArrowTexture()
        const texture = await Assets.load(location.origin + "/SMR/image/land.png");
        const arrowSprite = new Sprite(texture);
        // arrowSprite.position(0, 0)
        // arrowSprite.scale.set(4)

        return arrowSprite;
    },
    drawRoute() {
        const route = new Graphics();
        // route.beginFill(0xFF3300, 1)
        route.lineStyle(1, 0xffff00, 1);
        // let data = head_runway_json.land;
        for (let i = 0, len = TWEEDLE_PARAMS.xTargets.length; i < len; i++) {
            // route.lineTo(data[i][0], data[i][1]);
            route.lineTo(TWEEDLE_PARAMS.xTargets[i], TWEEDLE_PARAMS.yTargets[i]);
        }
        _surface.addChild(route);
        // return route;
    },
    async initTweedle(surface, trackNum) {
        _surface = surface
        _texture = await Assets.load(location.origin + "/SMR/image/arrow-1.png");
        // let cnt = 3
        this.tweedleGroup(trackNum, _surface, _texture)
    },
    tweedleGroup(trackNum, _surface, resolvedTexture) {
        let opt = this.updateAnimationLine(trackNum)
        // console.log('ani opt: ', opt)

        if (opt.xTargets.length !== 0 && opt.yTargets.length !== 0 && opt.rTargets.length !== 0 && opt.duration > opt.RD) {
            for (let i = 0; i < opt.cnt; i++) {
                // const texturePromise = Assets.load(
                //     location.origin + "/SMR/image/arrow-1.png"
                // );
                // texturePromise.then((resolvedTexture) => {
                // let arrow = smrTool.renderDoubleArrow({x:0 ,y :0}, 0, {width: 48, height: 48}, 0xff0000)
                // arrowSprite.position.set(0, 0)
                const arrowSprite = new Sprite(resolvedTexture);
                // const arrowSprite = new PIXI.Sprite(PIXI.Texture.WHITE)
                arrowSprite.width = opt.size.w
                arrowSprite.height = opt.size.h
                arrowSprite.anchor.set(0.5);
                // arrowSprite.scale.set(1.5 - i * 0.3);
                // arrowSprite.alpha = 1 - i * 0.3;
                // TODO
                arrowSprite.tint = 0x00ff00;
                arrowSprite.visible = false;
                arrowSprite.zIndex = 10;
                // console.log('arrow: ', arrow)
                _surface.addChild(arrowSprite);
                // animate.initFlowArrowAnimate(arrow)
                // this.updateParams();
                arrowSprite.angle = opt.rTargets[0];
                arrowSprite.position.set(
                    opt.xTargets[0],
                    opt.yTargets[0]
                );
                this.tweedleSingle(arrowSprite, opt, trackNum, i);
                // this.tweedleGroup.add(animate.tweedleAnimate(arrowSprite, i));
                // });
            }
        } else {
            // console.log('status enter len0: ', this.animationStatus)
            this.animationStatus[trackNum] = false
        }
    },
    tweedleSingle(sprite, opt, trackNum, index = 0) {
        const delay = opt.gap / opt.speed;
        return (
            new TWEEDLE.Tween(sprite)
                .dynamicTo(
                    { x: opt.xTargets, y: opt.yTargets, angle: opt.rTargets }
                )
                .duration(opt.duration)
                .repeat(0)
                .delay(delay * index + 1000)
                .interpolation(TWEEDLE.Interpolation.Geom.CatmullRom)
                // .onStart((sprite) => {
                //     sprite.visible = true;
                // })
                .onAfterDelay((sprite) => {
                    sprite.visible = true;
                })
                .onComplete((sprite, tween) => {
                    tween.stop()
                    _surface.removeChild(sprite)
                    sprite.destroy()
                    if (opt.duration > opt.RD) {
                        if (index === opt.cnt - 1) {
                            this.tweedleGroup(trackNum, _surface, _texture)
                        }
                    } 
                    else {
                        // console.log('status RD: ', this.animationStatus)
                        this.animationStatus[trackNum] = false
                    }
                })
                .start()
        );
    },
    updateAnimationLine(key) {
        // 后续应该作为参数传入
        let opt = {
            xTargets: [],
            yTargets: [],
            rTargets: [],
            size: {
                w: 64,
                h: 64
            },
            duration: 0,
            speed: 0.55,
            gap: 100,
            RD: 650,
            cnt: 3
        }
        opt.RD = ((opt.cnt - 1) * opt.gap + opt.cnt * (opt.size.w > opt.size.h ? opt.size.w : opt.size.h)) / opt.speed

        if (JSON.parse(Util.getLocalData('track'))) {
            // let key = 12
            let trackSet = JSON.parse(Util.getLocalData('track'))
            // console.log('trackSet:', trackSet)
            if (key in trackSet) {
                let track = trackSet[key]
                // console.log('track: ', track)
                let animationLine = track.AnimationLine
                // for (let i = 0, len = animationLineArr.length; i < len; i++) {
                //     let p = animationLineArr[i]
                //     TWEEDLE_PARAMS.xTargets.push(p[0])
                //     TWEEDLE_PARAMS.yTargets.push(p[1])
                //     TWEEDLE_PARAMS.rTargets.push(p[2])
                // }
                opt.xTargets = animationLine.xTargets
                opt.yTargets = animationLine.yTargets
                opt.rTargets = animationLine.rTargets

                const distance = Math.sqrt(
                    Math.pow(opt.xTargets[opt.xTargets.length - 1] - opt.xTargets[0], 2) +
                    Math.pow(opt.yTargets[opt.yTargets.length - 1] - opt.yTargets[0], 2)
                )
                opt.duration = distance / opt.speed
            }
        }

        return opt
    },
    sliceRoute() {
        const data = head_runway_json.runway02L
        let xTargets = []
        let yTargets = []
        let rTargets = []
        // console.log('original len:', data.length)
        if (JSON.parse(Util.getLocalData('track'))) {
            let key = 12
            let trackSet = JSON.parse(Util.getLocalData('track'))
            console.log('trackSet:', trackSet)
            if (key in trackSet) {
                let track = trackSet[key]
                // console.log('track: ', track)
                let xPoint = track.xPoint
                let yPoint = track.yPoint
                let minDis = Math.sqrt(
                    Math.pow(data[0][0] - xPoint, 2) +
                    Math.pow(data[0][1] - yPoint, 2)
                )
                let index = 0
                for (let i = 1, len = data.length; i < len; i++) {
                    let crtDis = Math.sqrt(
                        Math.pow(data[i][0] - xPoint, 2) +
                        Math.pow(data[i][1] - yPoint, 2)
                    )

                    if (crtDis < minDis) {
                        minDis = crtDis
                        index = i
                    }
                }

                let newRoute = data.slice(index)
                // console.log('after len:', newRoute.length)
                for (let i = 1, len = newRoute.length; i < len; i++) {
                    xTargets.push(newRoute[i][0])
                    yTargets.push(newRoute[i][1])
                    rTargets.push(newRoute[i][2])
                }
            }
        }

        return [xTargets, yTargets, rTargets]
    },
    updateParams(sprite = null, tweenRef = null) {
        const data = this.sliceRoute();
        TWEEDLE_PARAMS.xTargets = data[0];
        TWEEDLE_PARAMS.yTargets = data[1];

        // const speed = 0.85;
        const distance = Math.sqrt(
            Math.pow(TWEEDLE_PARAMS.xTargets[TWEEDLE_PARAMS.xTargets.length - 1] - TWEEDLE_PARAMS.xTargets[0], 2) +
            Math.pow(TWEEDLE_PARAMS.yTargets[TWEEDLE_PARAMS.yTargets.length - 1] - TWEEDLE_PARAMS.yTargets[0], 2)
        )
        TWEEDLE_PARAMS.duration = distance / TWEEDLE_PARAMS.speed

        if (sprite) {
            sprite.visible = false
        }

        if (tweenRef) {
            tweenRef.reset()
            tweenRef.dynamicTo({ x: TWEEDLE_PARAMS.xTargets, y: TWEEDLE_PARAMS.yTargets }).duration(TWEEDLE_PARAMS.duration)
            tweenRef.restart()
        }
    },
    // 初始化进度条
    initProgress(type) {
        const textStr = type === "ms" ? "0/4000m" : "0/60s";
        let redP = this.drawProgress(0xd33249, type, 400);
        redP.zIndex = 100;
        let greenP = this.drawProgress(0x00c364, type, 0);
        // greenP.width = 0
        greenP.zIndex = 101;
        const textP = new Text(textStr, {
            fontFamily: "PingFangSC-Regular",
            fontSize: 38,
            fill: 0x000000,
            fontWeight: "bold",
        });
        if (type === "ms") {
            textP.position.set(-535, -1730);
            textP.rotation = 1.325;
        } else {
            textP.position.set(-2702, -1557);
            textP.rotation = 1.325;
        }

        textP.zIndex = 102;
        textP.scale.set(1, -1);
        let progressContainer = new Container();
        progressContainer.addChild(redP, greenP, textP);
        progressContainer.visible = false;
        let greenPWidth = 0;
        let obj = {
            container: progressContainer,
            isCountdown: false,
        };
        let greenPpos2 = 0;
        let ticker_time = 0;
        const ticker = new Ticker();
        ticker.add(() => {
            // 进度条时间动画
            if (obj.isCountdown) {
                if (ticker_time > 50) {
                    ticker_time = 0;
                    if (greenPpos2 > 60) {
                        greenPpos2 = 0;
                        // this.prObj2.greenP.width = 0
                        greenPWidth = 0;

                        obj.isCountdown = false;
                        progressContainer = null;
                    } else {
                        greenPWidth += 400 / 60;
                    }
                    progressContainer.visible = true;
                    textP.text = 0 + greenPpos2 * 1 + "/60s";
                    // this.prObj2.greenP.width += 400 / 60
                    greenP.clear();
                    greenP.lineStyle(2, 0x000000, 1);
                    greenP.beginFill(0x00c364);
                    greenP.drawRoundedRect(0, 0, greenPWidth, 45, 50);
                    greenP.endFill();
                    greenPpos2++;
                }
                ticker_time++;
            }
        });
        ticker.start();
        return obj;
    },
    // 绘制进度条
    drawProgress(color, type, width) {
        let itineraryPr = new Graphics();
        itineraryPr.lineStyle(2, 0x000000, 1);
        itineraryPr.beginFill(color);
        itineraryPr.drawRoundedRect(0, 0, width, 45, 50);
        itineraryPr.endFill();
        if (type === "ms") {
            itineraryPr.position.set(-550, -1800);
        } else {
            itineraryPr.position.set(-2736, -1702);
        }

        itineraryPr.rotation = 1.325;
        itineraryPr.scale.set(1, -1);
        return itineraryPr;
    },
    animationStatus: {
        // "CSN3298": { isOn: false },
        // "CCA1797": { isOn: false },
        // "CSN3602": { isOn: false },
        // "CSN5053": { isOn: false },
    }
};

const TWEEDLE_PARAMS = {
    xTargets: [],
    yTargets: [],
    rTargets: [],
    size: {
        w: 64,
        h: 64
    },
    duration: 0,
    speed: 0.85,
    gap: 100,
    RD: 650
}


export default animate