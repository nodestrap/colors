import createCssConfig from '@cssfn/css-config'; // Stores & retrieves configuration using *css custom properties* (css variables)
// other libs:
import Color from 'color'; // color utilities
// color fn:
// might be removed if *css 4* `color()` -or- `color-mod()` already exists
const config = {
    thinLevel: 0.5,
    mildLevel: 0.8,
    boldLevel: 0.8,
};
const textColorValue = (color) => (color.isLight() ? themes.dark : themes.light);
const textColor = (color) => (color.isLight() ? colors.dark : colors.light);
const thinColor = (color) => color.alpha(config.thinLevel);
const mildColor = (color) => color.mix(page1.backg, config.mildLevel);
const boldColor = (color) => color.mix(page2.foreg, config.boldLevel);
//#region define colors by group
const basics = {
    blue: Color('#0d6efd'),
    indigo: Color('#6610f2'),
    purple: Color('#6f42c1'),
    pink: Color('#d63384'),
    red: Color('#dc3545'),
    orange: Color('#fd7e14'),
    yellow: Color('#ffc107'),
    green: Color('#198754'),
    teal: Color('#20c997'),
    cyan: Color('#0dcaf0'),
    black: Color('#000000'),
    white: Color('#ffffff'),
    gray: Color('#6c757d'),
    grayDark: Color('#343a40'),
};
const themes = {
    primary: basics.blue,
    secondary: basics.gray,
    success: basics.green,
    info: basics.cyan,
    warning: basics.yellow,
    danger: basics.red,
    light: Color('#f8f9fa'),
    dark: Color('#212529'),
};
const page1 = {
    backg: basics.white,
};
const page2 = {
    foreg: textColorValue(page1.backg),
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
    primaryText: textColorValue(themes.primary),
    secondaryText: textColorValue(themes.secondary),
    successText: textColorValue(themes.success),
    infoText: textColorValue(themes.info),
    warningText: textColorValue(themes.warning),
    dangerText: textColorValue(themes.danger),
    lightText: textColorValue(themes.light),
    darkText: textColorValue(themes.dark),
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
const stringColorCache = new WeakMap();
const isRef = (value) => (typeof (value) === 'string') && value.startsWith('var(--');
export const [cssProps, cssDecls, cssVals, cssConfig] = createCssConfig(() => {
    return new Proxy(allColors, {
        get: (t, propName) => {
            let color = allColors[propName];
            if (color === undefined)
                return undefined;
            if (isRef(color))
                return color; // do not convert the string if it's likely a css variable
            let strColor = stringColorCache.get(color);
            if (strColor)
                return strColor;
            strColor = stringColor(color);
            stringColorCache.set(color, strColor);
            return strColor;
        },
        set: (t, propName, newValue) => {
            if (typeof (newValue) === 'string') {
                if (!isRef(newValue)) { // do not convert the string if it's likely a css variable
                    newValue = Color(newValue);
                } // if
            } // if
            if ((typeof (newValue) !== 'string') && !(newValue instanceof Color))
                throw TypeError('The value must be a string or Color.');
            allColors[propName] = newValue;
            return true;
        },
    });
}, { prefix: 'col' });
export { cssProps as colors, cssProps as default };
const colors = cssProps;
// might be removed if *css 4* `color()` -or- `color-mod()` already exists
export const configProxy = new Proxy(config, {
    set: (config, propName, newValue) => {
        if (!(propName in config))
            return false; // the requested propName does not exist
        if ((typeof (newValue) !== 'number') || (newValue < 0) || (newValue > 1))
            return false; // invalid value
        // compare `oldValue` & `newValue`:
        const oldValue = config[propName];
        if (oldValue === newValue)
            return true; // success but no change => no need to update
        // apply changes & update:
        config[propName] = newValue;
        defineBackg(page1.backg);
        defineForeg(page2.foreg);
        for (const [themeName, themeColor] of Object.entries(themes)) {
            defineTheme(themeName, themeColor);
        } // for
        return true; // notify the operation was completed successfully
    },
});
export { configProxy as config };
const createProxy = (colorGroup) => new Proxy(colorGroup, {
    get: (cg, propName) => {
        if (!(propName in colorGroup))
            return undefined; // not found
        return colors[propName];
    },
    set: (cg, propName, newValue) => {
        const colorValue = Color(newValue);
        cssVals[propName] = colorValue;
        if (propName in colorGroup) {
            colorGroup[propName] = colorValue;
        } // if
        return true;
    },
});
const themesProxy = createProxy(themes);
const themesTextProxy = createProxy(themesText);
export { themesProxy as themes, themesTextProxy as themesText, };
// utilities:
const stringColor = (color) => ((color.alpha() === 1) ? color.hex() : color.toString()).toLowerCase();
export const defineBackg = (color, autoDefineForeg = true) => {
    if (!color)
        throw Error('You cannot delete the background color.');
    if (typeof (color) === 'string')
        color = Color(color);
    if (!(color instanceof Color))
        throw TypeError('The value must be a string or Color.');
    // define sub-colors:
    const backg = color;
    const backgThin = thinColor(color);
    const backgMild = mildColor(color);
    const backgBold = boldColor(color);
    // update caches:
    page1.backg = backg;
    page3.backgThin = backgThin;
    page3.backgMild = backgMild;
    page3.backgBold = backgBold;
    // update cssConfig:
    cssVals.backg = backg;
    cssVals.backgThin = backgThin;
    cssVals.backgMild = backgMild;
    cssVals.backgBold = backgBold;
    if (autoDefineForeg)
        defineForeg(textColorValue(color));
};
export const defineForeg = (color) => {
    if (!color)
        throw Error('You cannot delete the foreground color.');
    if (typeof (color) === 'string')
        color = Color(color);
    if (!(color instanceof Color))
        throw TypeError('The value must be a string or Color.');
    // define sub-colors:
    const foreg = color;
    const foregThin = thinColor(color);
    const foregMild = mildColor(color);
    const foregBold = boldColor(color);
    // update caches:
    page2.foreg = foreg;
    page3.foregThin = foregThin;
    page3.foregMild = foregMild;
    page3.foregBold = foregBold;
    // update cssConfig:
    cssVals.foreg = foreg;
    cssVals.foregThin = foregThin;
    cssVals.foregMild = foregMild;
    cssVals.foregBold = foregBold;
};
export const defineTheme = (name, color) => {
    if (!color) {
        // delete caches:
        delete themes[name];
        delete themesText[`${name}Text`];
        delete themesThin[`${name}Thin`];
        delete themesMild[`${name}Mild`];
        delete themesBold[`${name}Bold`];
        // delete cssConfig:
        cssVals[name] = undefined;
        cssVals[`${name}Text`] = undefined;
        cssVals[`${name}Thin`] = undefined;
        cssVals[`${name}Mild`] = undefined;
        cssVals[`${name}Bold`] = undefined;
    }
    else {
        if (typeof (color) === 'string')
            color = Color(color);
        if (!(color instanceof Color))
            throw TypeError('The value must be a string or Color.');
        // define sub-colors:
        const theme = color;
        const themeTextValue = textColorValue(color);
        const themeText = textColor(color);
        const themeThin = thinColor(color);
        const themeMild = mildColor(color);
        const themeBold = boldColor(color);
        // update caches:
        themes[name] = theme;
        themesText[`${name}Text`] = themeTextValue;
        themesThin[`${name}Thin`] = themeThin;
        themesMild[`${name}Mild`] = themeMild;
        themesBold[`${name}Bold`] = themeBold;
        // update cssConfig:
        cssVals[name] = theme;
        cssVals[`${name}Text`] = themeText;
        cssVals[`${name}Thin`] = themeThin;
        cssVals[`${name}Mild`] = themeMild;
        cssVals[`${name}Bold`] = themeBold;
    } // if
};
// setup css variables:
for (const themeName in themes)
    defineTheme(themeName, themes[themeName]);
