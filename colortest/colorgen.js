/**
 * some color generation functions
 * @module ColorGen
 * @author John C <me@johncheung.art>
 * @version 1.0
 */

/**
 * get a random RGB color
 * 
 * @returns {Array} an array of int [R, G, B] in range of 0 - 255
 * @tutorial randomRGB 
 */
export function randomRGB() {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
}

/**
 * parse color input and output it as an array
 * 
 * @param {*} color an array ([r,g,b]) or an object (o.r,o.g,o.b or o.R,o.G,o.B) or a (A)RGB color (only RGB is used in this library and only RGB is output from this function)
 * @returns {Array} an array representing the color [r,g,b];
 * @example 
 * colorgen.parseColor({r:24, g:25, b:144});
 * //return [24,25,144]
 */
export function parseColor(color) {
    let r, g, b;
    if (Array.isArray(color)) {
        r = color[0];
        g = color[1];
        b = color[2];
    } else if (Object.keys(color).includes("r") && Object.keys(color).includes("g") && Object.keys(color).includes("b")) {
        r = color.r;
        g = color.g;
        b = color.b;
    } else if (Object.keys(color).includes("R") && Object.keys(color).includes("G") && Object.keys(color).includes("B")) {
        r = color.R;
        g = color.G;
        b = color.B;
    } else if (typeof color === 'string' && color.startsWith("#")) { 
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        r = parseInt(result[1], 16);
        g = parseInt(result[2], 16);
        b = parseInt(result[3], 16);
    } else {
        r = color >>> 16 & 0xff;
        g = color >>> 8 & 0xff;
        b = color & 0xff;
    }
    if (r === undefined || g === undefined || b === undefined) throw Error("invalid color!")
    return [r, g, b];
}

/**
 * caculate the weighted Euclidean distance of two RGB colors
 * 
 * @param {*} color1 a color, @see{@link parseColor} for more info
 * @param {*} color2 the other color, @see{@link parseColor} for more info
 * @returns {number} the distance 
 * @tutorial colorDistance
 */
export function colorDistance(color1, color2) {
    color1 = parseColor(color1);
    color2 = parseColor(color2);
    let mean = (color1[0] + color2[0]) / 2;
    let dr = color1[0] - color2[0];
    let dg = color1[1] - color2[1];
    let db = color1[2] - color2[2];
    return Math.sqrt((((512 + mean) * dr * dr) / 256) + 4 * dg * dg + (((767 - mean) * db * db) / 256));
}

/**
 * caculate the unweighted Euclidean distance of two RGB colors
 * 
 * @param {*} color1 first color
 * @param {*} color2 second color
 * @returns {number} float, the distance between two color
 * @see parseColor
 */
export function colorDistanceUnweightedRGB(color1, color2) {
    color1 = parseColor(color1);
    color2 = parseColor(color2);
    let dr, dg, db;
    dr = color1[0] - color2[0];
    dg = color1[1] - color2[1];
    db = color1[2] - color2[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * caculate the unweighted Euclidean distance of two HSB colors in the HSB cone
 * 
 * @param {array} color1 float array representing the first color, [H, S, B] range from 0 - 1;
 * @param {array} color2 float array representing the second color, [H, S, B] range from 0 - 1;
 * @returns {number} float, the distance between two color
 */
export function colorDistanceHSB(color1, color2) {
    let h1, h2, b1, b2, s1, s2, a1, a2, aa1, aa2, da, db, dc;
    h1 = color1[0] * Math.PI * 2;
    h2 = color2[0] * Math.PI * 2;
    s1 = color1[1];
    s2 = color2[1];
    b1 = color1[2];
    b2 = color2[2];
    a1 = s1 * b1 * Math.cos(h1);
    a2 = s2 * b2 * Math.cos(h2);
    aa1 = s1 * b1 * Math.sin(h1);
    aa2 = s2 * b2 * Math.sin(h2);
    da = a1 - a2;
    db = aa1 - aa2;
    dc = b1 - b2;
    return Math.sqrt(da * da + db * db + dc * dc);
}

/**
 * generate random offset color based on a chosen color
 * 
 * @param {*} baseColor a color, @see{@link parseColor} for more info
 * @param {number} offset the max offset
 * @returns {Array} an RGB array (range from 0 - 255);
 * @tutorial randomOffset 
 */
export function randomOffset(baseColor, offset) {
    baseColor = parseColor(baseColor);
    let mean = (baseColor[0] + baseColor[1] + baseColor[2]) / 3;
    let newMean = mean + 2 * Math.random() * offset - offset;
    let offsetRatio = newMean / mean;
    return [baseColor[0] * offsetRatio, baseColor[1] * offsetRatio, baseColor[2] * offsetRatio];
}

/**
 * Cover HSB color (0-1 range) to RGB color (0-255), this is based on the
 * function in java.awt.Color
 * 
 * @param {number} hue 0-1
 * @param {number} sat 0-1
 * @param {number} bri 0-1
 * @returns {Array} int array representing the corresponding RGB color
 * @example 
 * colorgen.HSBtoRGB(0.5,1,1);
 * // return [0, 255, 255];
 */
export function HSBtoRGB(hue, sat, bri) {
    if (sat === 0) return [bri * 255, bri * 255, bri * 255];
    if (sat < 0 || sat > 1 || bri < 0 || bri > 1) throw new Error("Bad HSB Value");
    hue = hue - Math.floor(hue);
    let i = parseInt(6 * hue);
    let f = 6 * hue - i;
    let p = bri * (1 - sat);
    let q = bri * (1 - sat * f);
    let t = bri * (1 - sat * (1 - f));
    switch (i) {
        case 0:
            return floatToIntRGB(bri, t, p);
        case 1:
            return floatToIntRGB(q, bri, p);
        case 2:
            return floatToIntRGB(p, bri, t);
        case 3:
            return floatToIntRGB(p, q, bri);
        case 4:
            return floatToIntRGB(t, p, bri);
        case 5:
            return floatToIntRGB(bri, p, q);
        default:
            throw new Error("impossible to convert hsb to rgb");
    }
}

/**
 * convert RGB (0-255) to HSB (0-1), base on the function in java.awt.Color
 * 
 * @param {number} red between 0 - 255
 * @param {number} green between 0 - 255
 * @param {number} blue between 0 - 255
 * @returns {Array} a float array representing the HSB color
 * @example 
 * colorgen.RGBtoHSB(0, 255, 255);
 * //return [0.5, 1, 1]
 */
export function RGBtoHSB(red, green, blue) {
    let array = [0, 0, 0], min, max;
    if (red < green) {
        min = red;
        max = green;
    } else {
        min = green;
        max = red;
    }
    if (blue > max) {
        max = blue;
    } else if (blue < min) {
        min = blue;
    }
    array[2] = max / 255;
    if (max == 0) {
        array[1] = 0;
    } else {
        array[1] = ((max - min)) / (max);
    }
    if (array[1] == 0) {
        array[0] = 0;
    } else {
        let delta = (max - min) * 6;
        if (red == max) {
            array[0] = (green - blue) / delta;
        } else if (green == max) {
            array[0] = 1 / 3 + (blue - red) / delta;
        } else {
            array[0] = 2 / 3 + (red - green) / delta;
        }
        if (array[0] < 0)
            array[0]++;
    }
    return array;
}

/**
 * generate a bunch of color in gradient, take different type
 * @param {number} n the number of color return
 * @param {number} from the starting point of the gradient (0 - 1)
 * @param {number} to the end point of the gradient (0 - 1)
 * @param {string} type how the colors are picked. "UR": Uniform Random, randomly select
 *                  values between 0 and 1, and map this to the gradient to select
 *                  colours. "G": Grid, uniform sections, no two colours will be
 *                  closer to each other(along the gradient) than 1/n. "JG": Jittered
 *                  Grid, grid with random offset. "GR" Golden Ratio, using golden
 *                  ratio.
 * @param {number} sat optional, satuation value between 0 - 1, defalut to 1
 * @param {number} bri optional, brightness value between 0 - 1, defalut to 1
 * @returns {Array} an array of rbg colors
 * @tutorial gradientRGB
 */
export function gradientRGB(n, from, to, type, sat = 1, bri = 1) {
    let array = new Array(n);
    if (from < 0 || from > 1 || to < 0 || to > 1) throw new Error("bad gradient range");
    if (from > to) {
        let tem = from;
        from = to;
        to = tem;
    }
    let del = to - from;
    switch (type) {
        default:
            throw new Error("unknown gradiendRGB type");
        case "UR":
            for (let i = 0; i < array.length; i++) {
                let h = from + Math.random() * del;
                while (h < 0) h++;
                h = h % 1;
                array[i] = HSBtoRGB(h, sat, bri);
            }
            return array;
        case "G":
            for (let i = 0; i < array.length; i++) {
                array[i] = HSBtoRGB(from + i * (del / n), sat, bri);
            }
            return array;
        case "JG":
            for (let i = 0; i < array.length; i++) {
                let maxJitter = (del / n) / 2;
                let h = from + i * del / n + (Math.random() * 2 - 1) * maxJitter;
                while (h < 0) h++;
                h = h % 1;
                array[i] = HSBtoRGB(h, sat, bri);
            }
            return array;
        case "GR":
            for (let i = 0; i < array.length; i++) {
                let h = from + (0.618033988749895 * i) % 1;
                while (h < 0) h++;
                h = h % 1;
                array[i] = HSBtoRGB(h, sat, bri);
            }
            return array;
    }
}

/**
 * Generate a bunch of color according to the stander harmony color scheme, see
 * http://doi.acm.org/10.1145/1179352.1141933
 * 
 * @param {number} n number of the colors
 * @param {number} range1 float, range angle 1 in the hue ring
 * @param {number} range2 float, range angle 2 in the hue ring
 * @param {number} range3 float, range angle 3 in the hue ring
 * @param {number} reference optional, float, as the reference hue for generation, default is random
 * @param {number} sat optional, float (0 - 1), sat value, default to 1
 * @param {number} bri optional, float (0 - 1), bri value, default to 1
 * @param {number} offset1 optional, float, offset amount 1, default 0, must between 0 - 1
 * @param {number} offset2 optional, float, offset amount 2, default 0, must between 0 - 1
 * @returns {Array} an array of color in RGB format
 * @see {@link analogousColor} {@link complementaryColor} {@link splitcomplementaryColor} {@link triadColor}
 */
export function standerHarmonyColor(n, range1, range2, range3, reference = undefined, sat = 1, bri = 1, offset1 = 0, offset2 = 0) {
    if (reference === undefined) reference = Math.random();
    let array = new Array(n);
    for (let i = 0; i < array.length; i++) {
        let randA = Math.random() * (range1 + range2 + range3);
        if (randA < range1) {
            randA -= range1 / 2;
        } else if (randA >= range1 && randA < range1 + range2) {
            randA += offset1 - range2;
        } else {
            randA += offset2 - range3;
        }
        let h = randA + reference;
        while (h < 0) h++;
        h = h % 1;
        array[i] = HSBtoRGB(h, sat, bri);
    }
    return array;
}

/**
 * Generate a bunch of color according to the analogous color scheme
 * @see {@link standerHarmonyColor}
 * 
 * @param {number} n number of colors
 * @param {number} range range of color
 * @param {number} ref optional, reference angle, default is random
 * @param {number} sat optional, float, 0 - 1, default to 1
 * @param {number} bri optional, float, 0 - 1, default to 1
 * @param {number} offset1 optional, float, offset amount 1, default 0, must between 0 - 1
 * @param {number} offset2 optional, float, offset amount 1, default 0, must between 0 - 1
 * @returns {Array} an array of colors in RGB format
 * @tutorial analogousColor
 */
export function analogousColor(n, range, ref = undefined, sat = 1, bri = 1, offset1 = 0, offset2 = 0) {
    if (ref === undefined) ref = Math.random();
    return standerHarmonyColor(n, range, 0, 0, ref, sat, bri, offset1, offset2);
}

/**
 * Generate a bunch of color according to the complementary color scheme
 * @see {@link standerHarmonyColor}
 * 
 * @param {number} n number of colors
 * @param {number} range1
 * @param {number} range2
 * @param {number} ref optional, reference angle, default is random
 * @param {number} sat optional, float, 0 - 1, default to 1
 * @param {number} bri optional, float, 0 - 1, default to 1
 * @param {number} offset2 optional, float, offset amount 2, default 0, must between 0 - 1
 * @returns {Array} an array of colors in RGB format
 * @tutorial complementaryColor
 */
export function complementaryColor(n, range1, range2, ref = undefined, sat = 1, bri = 1, offset2 = 0) {
    if (ref === undefined) ref = Math.random();
    return standerHarmonyColor(n, range1, range2, 0, ref, sat, bri, 0.5, offset2);
}

/**
 * Generate a bunch of color according to the split complementary color scheme
 * @see {@link standerHarmonyColor}
 * 
 * @param {number} n number of colors
 * @param {number} range1
 * @param {number} range2 range2, must smaller than 2*var
 * @param {number} range3 range3, must smaller than 2*var
 * @param {number} vari variation from 180 for the offset values
 * @param {number} ref optional, reference angle, default is random
 * @param {number} sat optional, float, 0 - 1, default to 1
 * @param {number} bri optional, float, 0 - 1, default to 1
 * @returns {Array}  an array of colors in RGB format
 * @tutorial splitcomplementaryColor
 */
export function splitcomplementaryColor(n, range1, range2, range3, vari, ref = undefined, sat = 1, bri = 1) {
    if (ref === undefined) ref = Math.random();
    if (range2 >= 2 * vari || range3 >= 2 * vari) throw new Error("bad ranges for split complementary scheme");
    return standerHarmonyColor(n, range1, range2, range3, ref, sat, bri, 180 - vari, 180 + vari);
}

/**
 * Generate a bunch of color according to the traid color scheme
 * @see {@link standerHarmonyColor}
 * 
 * @param {number} n number of colors
 * @param {number} range1 
 * @param {number} range2
 * @param {number} range3
 * @param {number} ref optional, reference angle, default is random
 * @param {number} sat optional, float, 0 - 1, default to 1
 * @param {number} bri optional, float, 0 - 1, default to 1
 * @returns {Array} an array of colors in RGB format
 * @tutorial triadColor
 */
export function triadColor(n, range1, range2, range3, ref = undefined, sat = 1, bri = 1) {
    if (ref === undefined) ref = Math.random();
    return standerHarmonyColor(n, range1, range2, range3, ref, sat, bri, 0.33333, 0.66667);
}

/**
 * mix 3 color to get a new one, use the greyControl to control the grey value (0:low -1:high)
 * 
 * @param {*} color1 first color to mix, see {@link parseColor}
 * @param {*} color2 second color to mix, see {@link parseColor}
 * @param {*} color3 third color to mix, see {@link parseColor}
 * @param {number} greyControl 0-1, how much grey get mix in
 * @returns {Array} a color array in RGB format
 * @see {@link parseColor}
 * @tutorial triadMixing
 */
export function triadMixing(color1, color2, color3, greyControl) {
    color1 = parseColor(color1);
    color2 = parseColor(color2);
    color3 = parseColor(color3);
    let randomIdx = Math.floor(Math.random() * 3);
    let mixRatio1 = randomIdx == 0 ? Math.random() * greyControl : Math.random();
    let mixRatio2 = randomIdx == 1 ? Math.random() * greyControl : Math.random();
    let mixRatio3 = randomIdx == 2 ? Math.random() * greyControl : Math.random();
    let sum = mixRatio1 + mixRatio2 + mixRatio3;
    mixRatio1 /= sum;
    mixRatio2 /= sum;
    mixRatio3 /= sum;
    return [mixRatio1 * color1[0] + mixRatio2 * color2[0] + mixRatio3 * color3[0], mixRatio1 * color1[1] + mixRatio2 * color2[1] + mixRatio3 * color3[1], mixRatio1 * color1[2] + mixRatio2 * color2[2] + mixRatio3 * color3[2]];
}

/**
 * YIQ color contrast calculation, returning black or white determination of
 * optimal foreground color
 * 
 * @param {*} color the foreground color, 
 * @see {@link parseColor}
 * @returns {boolean} true for black(dark color) and false for white(bright color)
 * @tutorial yiq
 */
export function yiq(color) {
    color = parseColor(color);
    let y = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
    return y >= 128;
}

/**
 * cast the color to 24 bit int RGB color
 * 
 * @param {any} color the color to cast, 
 * @see {@link parseColor} for input options
 * @returns {color} a 24bit int color
 * @example 
 * colorgen.to24BitRGB([255, 255, 255]).toString(16);
 * //return "ffffff"
 */
export function to24BitRGB(color) {
    color = parseColor(color);
    let r, g, b;
    r = Math.round(color[0]);
    g = Math.round(color[1]);
    b = Math.round(color[2]);
    r = r << 16;
    g = g << 8;
    return r | g | b;
}

/**
 * cast the color array to 32 bit int ARGB color
 * 
 * @param {*} color the color to cast, 
 * @see {@link parseColor} for input options
 * @param {number} alpha alpha value of the color output, 0 - 255
 * @param {boolean} rgba optional, if true, output in RRGGBBAA format
 * @returns {color} a 32bit int color
 * @see to24BitRGB
 */
export function to32BitARGB(color, alpha, rgba = false) {
    color = parseColor(color);
    let r = Math.round(color[0]);
    let g = Math.round(color[1]);
    let b = Math.round(color[2]);
    let a = alpha * 255;
    if (!rgba) {
        a = a << 24;
        r = r << 16;
        g = g << 8;
        return a | r | g | b;
    } else {
        r = r << 24;
        g = g << 16;
        b = b << 8;
        return r | g | b | a;
    }
}

/**
 * cast the color to css string
 * 
 * @param {*} color input color
 * @param {number} alpha optional, alpha value between 0-1
 * @param {boolean} forceHex optional, if true and alpha is used, return color in #rrggbbaa, this notation may not be supported on old browsers
 * @returns {string} the result css string
 * @tutorial toCSSString
 */
export function toCSSString(color, alpha = undefined, forceHex = false) {
    color = parseColor(color);
    if (alpha !== undefined) {
        if (!forceHex) return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
        let hex = to32BitARGB(color, alpha, true).toString(16);
        while (hex.length < 6) hex = "0" + hex;
        return "#" + hex;
    } else {
        let hex = to24BitRGB(color).toString(16);
        while (hex.length < 6) hex = "0" + hex;
        return "#" + hex;
    }
}

function floatToIntRGB(r, g, b) {
    return [r * 255, g * 255, b * 255];
}