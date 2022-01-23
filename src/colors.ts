// cssfn:
import type {
    Optional,
    Dictionary,
    ValueOf,
    DictionaryOf,
}                           from '@cssfn/types'       // cssfn's types
import type {
    Prop,
    Cust,
}                           from '@cssfn/css-types'   // ts defs support for cssfn
import createCssConfig      from '@cssfn/css-config'  // Stores & retrieves configuration using *css custom properties* (css variables)

// other libs:
import Color                from 'color'         // color utilities



// general types:
type ColorType = Prop.Color | Cust.Expr
export type { ColorType as Color }



// color fn:

// might be removed if *css 4* `color()` -or- `color-mod()` already exists
const config = {
    thinLevel : 0.5,
    mildLevel : 0.8,
    boldLevel : 0.8,
};
const textColorValue = (color: Color): Color    => (color.isLight() ? themes.dark : themes.light)
const textColor      = (color: Color): Cust.Ref => (color.isLight() ? colors.dark : colors.light)
const thinColor      = (color: Color): Color    => color.alpha(config.thinLevel)
const mildColor      = (color: Color): Color    => color.mix(page1.backg as Color, config.mildLevel)
const boldColor      = (color: Color): Color    => color.mix(page2.foreg as Color, config.boldLevel)



//#region define colors by group
const basics = {
    blue     : Color('#0d6efd'),
    indigo   : Color('#6610f2'),
    purple   : Color('#6f42c1'),
    pink     : Color('#d63384'),
    red      : Color('#dc3545'),
    orange   : Color('#fd7e14'),
    yellow   : Color('#ffc107'),
    green    : Color('#198754'),
    teal     : Color('#20c997'),
    cyan     : Color('#0dcaf0'),

    black    : Color('#000000'),
    white    : Color('#ffffff'),
    gray     : Color('#6c757d'),
    grayDark : Color('#343a40'),
};

const themes = {
    primary   : basics.blue,
    secondary : basics.gray,
    success   : basics.green,
    info      : basics.cyan,
    warning   : basics.yellow,
    danger    : basics.red,
    light     : Color('#f8f9fa'),
    dark      : Color('#212529'),
};

const page1 = {
    backg : basics.white,
};

const page2 = {
    foreg : textColorValue(page1.backg),
};
const page3 = {
    backgThin : thinColor(page1.backg),
    backgMild : mildColor(page1.backg),
    backgBold : boldColor(page1.backg),

    foregThin : thinColor(page2.foreg),
    foregMild : mildColor(page2.foreg),
    foregBold : boldColor(page2.foreg),
};

const themesText = {
    primaryText   : textColorValue(themes.primary),
    secondaryText : textColorValue(themes.secondary),
    successText   : textColorValue(themes.success),
    infoText      : textColorValue(themes.info),
    warningText   : textColorValue(themes.warning),
    dangerText    : textColorValue(themes.danger),
    lightText     : textColorValue(themes.light),
    darkText      : textColorValue(themes.dark),
};

const themesThin = {
    primaryThin   : thinColor(themes.primary),
    secondaryThin : thinColor(themes.secondary),
    successThin   : thinColor(themes.success),
    infoThin      : thinColor(themes.info),
    warningThin   : thinColor(themes.warning),
    dangerThin    : thinColor(themes.danger),
    lightThin     : thinColor(themes.light),
    darkThin      : thinColor(themes.dark),
};

const themesMild = {
    primaryMild   : mildColor(themes.primary),
    secondaryMild : mildColor(themes.secondary),
    successMild   : mildColor(themes.success),
    infoMild      : mildColor(themes.info),
    warningMild   : mildColor(themes.warning),
    dangerMild    : mildColor(themes.danger),
    lightMild     : mildColor(themes.light),
    darkMild      : mildColor(themes.dark),
};

const themesBold = {
    primaryBold   : boldColor(themes.primary),
    secondaryBold : boldColor(themes.secondary),
    successBold   : boldColor(themes.success),
    infoBold      : boldColor(themes.info),
    warningBold   : boldColor(themes.warning),
    dangerBold    : boldColor(themes.danger),
    lightBold     : boldColor(themes.light),
    darkBold      : boldColor(themes.dark),
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



const stringColorCache = new WeakMap<Color, string>();
const isRef = (value: any): value is Cust.Ref => (typeof(value) === 'string') && value.startsWith('var(--');
export const [cssProps, cssDecls, cssVals, cssConfig] = createCssConfig(() => {
    type ColorList  = typeof allColors;
    type ColorProxy = { [key in keyof ColorList]: ColorType };
    return new Proxy(allColors as unknown as ColorProxy, {
        get: (t, propName: string): string|undefined => {
            let color = (allColors as Dictionary<Color>)[propName];
            if (color === undefined) return undefined;
            
            
            
            if (isRef(color)) return color; // do not convert the string if it's likely a css variable
            
            
            
            let strColor = stringColorCache.get(color);
            if (strColor) return strColor;
            
            strColor = stringColor(color);
            stringColorCache.set(color, strColor);
            
            return strColor;
        },
        set : (t, propName: string, newValue: any): boolean => {
            if (typeof(newValue) === 'string') {
                if (!isRef(newValue)) { // do not convert the string if it's likely a css variable
                    newValue = Color(newValue);
                } // if
            } // if
            if ((typeof(newValue) !== 'string') && !(newValue instanceof Color)) throw TypeError('The value must be a string or Color.');
            
            
            
            (allColors as Dictionary<Color>)[propName] = newValue as Color;
            return true;
        },
    });
}, { prefix: 'col' });
export { cssProps as colors, cssProps as default }
const colors = cssProps;



// might be removed if *css 4* `color()` -or- `color-mod()` already exists
export const configProxy = new Proxy(
    config,
    {
        set : (config, propName: string, newValue: any): boolean => {
            if (!(propName in config)) return false; // the requested propName does not exist
            if ((typeof(newValue) !== 'number') || (newValue < 0) || (newValue > 1)) return false; // invalid value
            
            
            
            // compare `oldValue` & `newValue`:
            const oldValue = (config as any)[propName];
            if (oldValue === newValue) return true; // success but no change => no need to update
            
            
            
            // apply changes & update:
            (config as any)[propName] = newValue;
            
            
            
            defineBackg(page1.backg);
            defineForeg(page2.foreg);
            for (const [themeName, themeColor] of Object.entries(themes)) {
                defineTheme(themeName, themeColor);
            } // for
            
            
            
            return true; // notify the operation was completed successfully
        },
    }
);
export { configProxy as config }



const createProxy = <TColorGroup extends { [key in keyof TColorGroup]: Color },>(colorGroup: TColorGroup) => new Proxy(colorGroup as unknown as { [key in keyof TColorGroup]: ValueOf<typeof colors> }, {
    get: (cg, propName: string): (ValueOf<typeof colors>|undefined) => {
        if (!(propName in colorGroup)) return undefined; // not found
        
        return (colors as DictionaryOf<typeof colors>)[propName];
    },
    set: (cg, propName: string, newValue: ValueOf<typeof colors>) => {
        const colorValue = Color(newValue);
        
        (cssVals as DictionaryOf<typeof cssVals>)[propName] = colorValue as any;
        
        if (propName in colorGroup) {
            (colorGroup as Dictionary<Color>)[propName]     = colorValue;
        } // if
        
        
        
        return true;
    },
});

const themesProxy     = createProxy(themes);
const themesTextProxy = createProxy(themesText);

export {
    themesProxy     as themes,
    themesTextProxy as themesText,
}



// utilities:
const stringColor = (color: Color) => ((color.alpha() === 1) ? color.hex() : color.toString()).toLowerCase();

export const defineBackg = (color: Color|string, autoDefineForeg = true) => {
    if (!color) throw Error('You cannot delete the background color.');
    if (typeof(color) === 'string') color = Color(color);
    if (!(color instanceof Color)) throw TypeError('The value must be a string or Color.');
    
    
    
    // define sub-colors:
    const backg     = color            as any;
    const backgThin = thinColor(color) as any;
    const backgMild = mildColor(color) as any;
    const backgBold = boldColor(color) as any;
    
    // update caches:
    page1.backg       = backg;
    page3.backgThin   = backgThin;
    page3.backgMild   = backgMild;
    page3.backgBold   = backgBold;
    
    // update cssConfig:
    cssVals.backg     = backg;
    cssVals.backgThin = backgThin;
    cssVals.backgMild = backgMild;
    cssVals.backgBold = backgBold;
    
    
    
    if (autoDefineForeg) defineForeg(textColorValue(color));
};
export const defineForeg = (color: Color|string) => {
    if (!color) throw Error('You cannot delete the foreground color.');
    if (typeof(color) === 'string') color = Color(color);
    if (!(color instanceof Color)) throw TypeError('The value must be a string or Color.');
    
    
    
    // define sub-colors:
    const foreg     = color            as any;
    const foregThin = thinColor(color) as any;
    const foregMild = mildColor(color) as any;
    const foregBold = boldColor(color) as any;
    
    // update caches:
    page2.foreg       = foreg;
    page3.foregThin   = foregThin;
    page3.foregMild   = foregMild;
    page3.foregBold   = foregBold;
    
    // update cssConfig:
    cssVals.foreg     = foreg;
    cssVals.foregThin = foregThin;
    cssVals.foregMild = foregMild;
    cssVals.foregBold = foregBold;
};
export const defineTheme = (name: string, color: Optional<Color|string>) => {
    if (!color) {
        // delete caches:
        delete (themes     as DictionaryOf<typeof themes>    )[   name      ];
        delete (themesText as DictionaryOf<typeof themesText>)[`${name}Text`];
        delete (themesThin as DictionaryOf<typeof themesThin>)[`${name}Thin`];
        delete (themesMild as DictionaryOf<typeof themesMild>)[`${name}Mild`];
        delete (themesBold as DictionaryOf<typeof themesBold>)[`${name}Bold`];
        
        // delete cssConfig:
        (cssVals as DictionaryOf<typeof cssVals>)[   name      ] = undefined as any;
        (cssVals as DictionaryOf<typeof cssVals>)[`${name}Text`] = undefined as any;
        (cssVals as DictionaryOf<typeof cssVals>)[`${name}Thin`] = undefined as any;
        (cssVals as DictionaryOf<typeof cssVals>)[`${name}Mild`] = undefined as any;
        (cssVals as DictionaryOf<typeof cssVals>)[`${name}Bold`] = undefined as any;
    }
    else {
        if (typeof(color) === 'string') color = Color(color);
        if (!(color instanceof Color)) throw TypeError('The value must be a string or Color.');
        
        
        
        // define sub-colors:
        const theme          = color                 as any;
        const themeTextValue = textColorValue(color) as any;
        const themeText      = textColor(color)      as any;
        const themeThin      = thinColor(color)      as any;
        const themeMild      = mildColor(color)      as any;
        const themeBold      = boldColor(color)      as any;
        
        // update caches:
        (themes     as DictionaryOf<typeof themes>    )[   name      ] = theme;
        (themesText as DictionaryOf<typeof themesText>)[`${name}Text`] = themeTextValue;
        (themesThin as DictionaryOf<typeof themesThin>)[`${name}Thin`] = themeThin;
        (themesMild as DictionaryOf<typeof themesMild>)[`${name}Mild`] = themeMild;
        (themesBold as DictionaryOf<typeof themesBold>)[`${name}Bold`] = themeBold;
        
        // update cssConfig:
        (cssVals as DictionaryOf<typeof cssVals>)[   name      ]       = theme;
        (cssVals as DictionaryOf<typeof cssVals>)[`${name}Text`]       = themeText;
        (cssVals as DictionaryOf<typeof cssVals>)[`${name}Thin`]       = themeThin;
        (cssVals as DictionaryOf<typeof cssVals>)[`${name}Mild`]       = themeMild;
        (cssVals as DictionaryOf<typeof cssVals>)[`${name}Bold`]       = themeBold;
    } // if
};



// setup css variables:
for (const themeName in themes) defineTheme(themeName, (themes as DictionaryOf<typeof themes>)[themeName]);
