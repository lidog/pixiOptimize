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
                fill: { color: 0x121110, alpha: 0.1 },
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