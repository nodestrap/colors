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
const textColor = (color) => (color.isLight() ? themes.dark : themes.light);
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
export const [cssProps, cssDecls, cssVals, cssConfig] = createCssConfig(() => {
    return new Proxy(allColors, {
        get: (t, prop) => {
            const color = allColors[prop];
            if (color === undefined)
                return undefined;
            let strColor = color.__strColor;
            if (strColor)
                return strColor;
            strColor = stringColor(color);
            color.__strColor = strColor;
            return strColor;
        },
    });
}, { prefix: 'col' });
export { cssProps as colors, cssProps as default };
const colors = cssProps;
// might be removed if *css 4* `color()` -or- `color-mod()` already exists
export const configProxy = new Proxy(config, {
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
    get: (cg, prop) => {
        if (!(prop in colorGroup))
            return undefined; // not found
        return colors[prop];
    },
    set: (cg, prop, newValue) => {
        const colorValue = Color(newValue);
        cssVals[prop] = colorValue;
        if (prop in colorGroup) {
            colorGroup[prop] = colorValue;
        } // if
        return true;
    },
});
const themesProxy = createProxy(themes);
const themesTextProxy = createProxy(themesText);
export { themesProxy as themes, themesTextProxy as themesText, };
// utilities:
const stringColor = (color) => (color.alpha() === 1) ? color.hex() : color.toString();
export const defineBackg = (color, autoDefineForeg = true) => {
    if (typeof (color) === 'string')
        color = Color(color);
    const backg = color;
    const backgThin = thinColor(color);
    const backgMild = mildColor(color);
    const backgBold = boldColor(color);
    page1.backg = backg;
    page3.backgThin = backgThin;
    page3.backgMild = backgMild;
    page3.backgBold = backgBold;
    cssVals.backg = backg;
    cssVals.backgThin = backgThin;
    cssVals.backgMild = backgMild;
    cssVals.backgBold = backgBold;
    if (autoDefineForeg)
        defineForeg(textColor(color));
};
export const defineForeg = (color) => {
    if (typeof (color) === 'string')
        color = Color(color);
    const foreg = color;
    const foregThin = thinColor(color);
    const foregMild = mildColor(color);
    const foregBold = boldColor(color);
    page2.foreg = foreg;
    page3.foregThin = foregThin;
    page3.foregMild = foregMild;
    page3.foregBold = foregBold;
    cssVals.foreg = foreg;
    cssVals.foregThin = foregThin;
    cssVals.foregMild = foregMild;
    cssVals.foregBold = foregBold;
};
export const defineTheme = (name, color) => {
    if (!color) {
        delete themes[name];
        delete themesText[`${name}Text`];
        delete themesThin[`${name}Thin`];
        delete themesMild[`${name}Mild`];
        delete themesBold[`${name}Bold`];
        cssVals[name] = undefined;
        cssVals[`${name}Text`] = undefined;
        cssVals[`${name}Thin`] = undefined;
        cssVals[`${name}Mild`] = undefined;
        cssVals[`${name}Bold`] = undefined;
    }
    else {
        if (typeof (color) === 'string')
            color = Color(color);
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
        cssVals[name] = theme;
        cssVals[`${name}Text`] = themeText;
        cssVals[`${name}Thin`] = themeThin;
        cssVals[`${name}Mild`] = themeMild;
        cssVals[`${name}Bold`] = themeBold;
    } // if
};
