"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineTheme = exports.defineForeg = exports.defineBackg = exports.themesText = exports.themes = exports.config = exports.configProxy = exports.default = exports.colors = exports.cssConfig = exports.cssVals = exports.cssDecls = exports.cssProps = void 0;
const css_config_1 = __importDefault(require("@cssfn/css-config")); // Stores & retrieves configuration using *css custom properties* (css variables)
// other libs:
const color_1 = __importDefault(require("color")); // color utilities
// color fn:
// might be removed if *css 4* `color()` -or- `color-mod()` already exists
const config = {
    thinLevel: 0.5,
    mildLevel: 0.8,
    boldLevel: 0.8,
};
const textColor = (color) => (color.isLight() ? themes.dark : themes.light);
const thinColor = (color) => color.alpha(config.thinLevel);
const mildColor = (color) => color.mix(page1.backg, config.mildLevel);
const boldColor = (color) => color.mix(page2.foreg, config.boldLevel);
//#region define colors by group
const basics = {
    blue: (0, color_1.default)('#0d6efd'),
    indigo: (0, color_1.default)('#6610f2'),
    purple: (0, color_1.default)('#6f42c1'),
    pink: (0, color_1.default)('#d63384'),
    red: (0, color_1.default)('#dc3545'),
    orange: (0, color_1.default)('#fd7e14'),
    yellow: (0, color_1.default)('#ffc107'),
    green: (0, color_1.default)('#198754'),
    teal: (0, color_1.default)('#20c997'),
    cyan: (0, color_1.default)('#0dcaf0'),
    black: (0, color_1.default)('#000000'),
    white: (0, color_1.default)('#ffffff'),
    gray: (0, color_1.default)('#6c757d'),
    grayDark: (0, color_1.default)('#343a40'),
};
const themes = {
    primary: basics.blue,
    secondary: basics.gray,
    success: basics.green,
    info: basics.cyan,
    warning: basics.yellow,
    danger: basics.red,
    light: (0, color_1.default)('#f8f9fa'),
    dark: (0, color_1.default)('#212529'),
};
const page1 = {
    backg: basics.white,
};
const page2 = {
    foreg: textColor(page1.backg),
};
const page3 = {
    backgThin: thinColor(page1.backg),
    backgMild: mildColor(page1.backg),
    backgBold: boldColor(page1.backg),
    foregThin: thinColor(page2.foreg),
    foregMild: mildColor(page2.foreg),
    foregBold: boldColor(page2.foreg),
};
const themesText = {
    primaryText: textColor(themes.primary),
    secondaryText: textColor(themes.secondary),
    successText: textColor(themes.success),
    infoText: textColor(themes.info),
    warningText: textColor(themes.warning),
    dangerText: textColor(themes.danger),
    lightText: textColor(themes.light),
    darkText: textColor(themes.dark),
};
const themesThin = {
    primaryThin: thinColor(themes.primary),
    secondaryThin: thinColor(themes.secondary),
    successThin: thinColor(themes.success),
    infoThin: thinColor(themes.info),
    warningThin: thinColor(themes.warning),
    dangerThin: thinColor(themes.danger),
    lightThin: thinColor(themes.light),
    darkThin: thinColor(themes.dark),
};
const themesMild = {
    primaryMild: mildColor(themes.primary),
    secondaryMild: mildColor(themes.secondary),
    successMild: mildColor(themes.success),
    infoMild: mildColor(themes.info),
    warningMild: mildColor(themes.warning),
    dangerMild: mildColor(themes.danger),
    lightMild: mildColor(themes.light),
    darkMild: mildColor(themes.dark),
};
const themesBold = {
    primaryBold: boldColor(themes.primary),
    secondaryBold: boldColor(themes.secondary),
    successBold: boldColor(themes.success),
    infoBold: boldColor(themes.info),
    warningBold: boldColor(themes.warning),
    dangerBold: boldColor(themes.danger),
    lightBold: boldColor(themes.light),
    darkBold: boldColor(themes.dark),
};
const allColors = {
    ...basics,
    ...themes,
    ...page1,
    ...page2,
    ...page3,
    ...themesText,
    ...themesThin,
    ...themesMild,
    ...themesBold,
};
//#endregion define colors by group
_a = (0, css_config_1.default)(() => {
    return new Proxy(allColors, {
        get: (t, prop) => {
            const color = allColors[prop];
            if (color === undefined)
                return undefined;
            return stringColor(color);
        },
    });
}, { prefix: 'col' }), exports.default = exports.colors = exports.cssProps = _a[0], exports.cssDecls = _a[1], exports.cssVals = _a[2], exports.cssConfig = _a[3];
exports.colors = exports.cssProps;
exports.default = exports.cssProps;
const colors = exports.cssProps;
// might be removed if *css 4* `color()` -or- `color-mod()` already exists
exports.configProxy = new Proxy(config, {
    set: (config, propName, newValue) => {
        if (!(propName in config))
            return false; // the requested prop does not exist
        if ((typeof (newValue) !== 'number') || (newValue < 0) || (newValue > 1))
            return false; // invalid value
        // compare `oldValue` & `newValue`:
        const oldValue = config[propName];
        if (oldValue === newValue)
            return true; // success but no change => no need to update
        // apply changes & update:
        config[propName] = newValue;
        (0, exports.defineBackg)(page1.backg);
        (0, exports.defineForeg)(page2.foreg);
        for (const [themeName, themeColor] of Object.entries(themes)) {
            (0, exports.defineTheme)(themeName, themeColor);
        } // for
        return true; // notify the operation was completed successfully
    },
});
exports.config = exports.configProxy;
const createProxy = (colorGroup) => new Proxy(colorGroup, {
    get: (cg, prop) => {
        if (!(prop in colorGroup))
            return undefined; // not found
        return colors[prop];
    },
    set: (cg, prop, newValue) => {
        const colorValue = (0, color_1.default)(newValue);
        exports.cssVals[prop] = colorValue;
        if (prop in colorGroup) {
            colorGroup[prop] = colorValue;
        } // if
        return true;
    },
});
const themesProxy = createProxy(themes);
exports.themes = themesProxy;
const themesTextProxy = createProxy(themesText);
exports.themesText = themesTextProxy;
// utilities:
const stringColor = (color) => (color.alpha() === 1) ? color.hex() : color.toString();
const defineBackg = (color, autoDefineForeg = true) => {
    if (typeof (color) === 'string')
        color = (0, color_1.default)(color);
    const backg = color;
    const backgThin = thinColor(color);
    const backgMild = mildColor(color);
    const backgBold = boldColor(color);
    page1.backg = backg;
    page3.backgThin = backgThin;
    page3.backgMild = backgMild;
    page3.backgBold = backgBold;
    exports.cssVals.backg = backg;
    exports.cssVals.backgThin = backgThin;
    exports.cssVals.backgMild = backgMild;
    exports.cssVals.backgBold = backgBold;
    if (autoDefineForeg)
        (0, exports.defineForeg)(textColor(color));
};
exports.defineBackg = defineBackg;
const defineForeg = (color) => {
    if (typeof (color) === 'string')
        color = (0, color_1.default)(color);
    const foreg = color;
    const foregThin = thinColor(color);
    const foregMild = mildColor(color);
    const foregBold = boldColor(color);
    page2.foreg = foreg;
    page3.foregThin = foregThin;
    page3.foregMild = foregMild;
    page3.foregBold = foregBold;
    exports.cssVals.foreg = foreg;
    exports.cssVals.foregThin = foregThin;
    exports.cssVals.foregMild = foregMild;
    exports.cssVals.foregBold = foregBold;
};
exports.defineForeg = defineForeg;
const defineTheme = (name, color) => {
    if (!color) {
        delete themes[name];
        delete themesText[`${name}Text`];
        delete themesThin[`${name}Thin`];
        delete themesMild[`${name}Mild`];
        delete themesBold[`${name}Bold`];
        exports.cssVals[name] = undefined;
        exports.cssVals[`${name}Text`] = undefined;
        exports.cssVals[`${name}Thin`] = undefined;
        exports.cssVals[`${name}Mild`] = undefined;
        exports.cssVals[`${name}Bold`] = undefined;
    }
    else {
        if (typeof (color) === 'string')
            color = (0, color_1.default)(color);
        const theme = color;
        const themeText = textColor(color);
        const themeThin = thinColor(color);
        const themeMild = mildColor(color);
        const themeBold = boldColor(color);
        themes[name] = theme;
        themesText[`${name}Text`] = themeText;
        themesThin[`${name}Thin`] = themeThin;
        themesMild[`${name}Mild`] = themeMild;
        themesBold[`${name}Bold`] = themeBold;
        exports.cssVals[name] = theme;
        exports.cssVals[`${name}Text`] = themeText;
        exports.cssVals[`${name}Thin`] = themeThin;
        exports.cssVals[`${name}Mild`] = themeMild;
        exports.cssVals[`${name}Bold`] = themeBold;
    } // if
};
exports.defineTheme = defineTheme;
