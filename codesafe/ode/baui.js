
//#region color legacy code: TODO!!!! mimali, or isolate and eliminate
function colorHSL(cAny, asObject = false) {
  let res = colorFrom(cAny, undefined, true);
  let shsl = res;
  if (res[0] == '#') {
    if (res.length == 9) {
      shsl = hexAToHSLA(res);
    } else if (res.length == 7) {
      shsl = hexToHSL(res);
    }
  } else if (res[0] == 'r') {
    if (res[3] == 'a') {
      shsl = RGBAToHSLA(res);
    } else {
      shsl = RGBToHSL(res);
    }
  }
  let n = allNumbers(shsl);
  if (asObject) {
    return { h: n[0] / 360, s: n[1] / 100, l: n[2] / 100, a: n.length > 3 ? n[3] : 1 };
  } else {
    return shsl;
  }
}
function colorLum(cAny, percent = false) {
  let hsl = colorHSL(cAny, true);
  return percent ? hsl.l * 100 : hsl.l;
}
async function getPaletteFromElem(elem){
	let cv = await html2canvas(elem);
  let imgData = cv.toDataURL("image/jpeg", 0.9);
  let img = await imgAsync(elem.parentNode, {w:100,h:100,border:'red',position:'absolute',top:210,left:800}, {src:imgData});
  let pal=ColorThiefObject.getPalette(img); //console.log('palette',pal)

  //sort palette by brightness!
  let arr=pal.map(x=>({orig:x,hex:colorHex(x),lum:colorHSL(x,true).l}));
  arr=sortBy(arr,'lum');
  //img.remove();
  //console.log(arr);

  return arr.map(x=>x.hex); //.map(x=>colorHex(x));//new Image(cv.width,cv.height,imgData;
  // .then(function (canvas) {
	// 	let imgData = canvas.toDataURL("image/jpeg", 0.9);
	// 	var profile_image = mBy("profile_image");
	// 	profile_image.src = imgData;
	// 	mBy('imgPreview').src = imgData;

}
function mimali(c, n) {
  function whh(c1, c2) { return generateArrayColors(colorHex(c1), colorHex(c2), 10); }
  function genc(c, hinc) { let hsl = colorHSL(c, true); return colorHSLBuild((hsl.h + hinc) % 360, hsl.s * 100, hsl.l * 100); }
  function cinc(c, hinc, sinc, linc) { let hsl = colorHSL(c, true); return colorHSLBuild((hsl.h + hinc) % 360, clamp(hsl.s * 100 + sinc, 0, 100), clamp(hsl.l * 100 + linc, 0, 100)); }
  function arrd(c, hinc, sinc, linc, n) { let r = []; for (let i = 0; i < n; i++) { r.push(cinc(c, hinc * i, sinc * i, linc * i)); } return r; }
  function light(c, lper = 75) { let hsl = colorHSL(c, true); return colorHSLBuild(hsl.h, hsl.s * 100, lper); }
  function sat(c, sper = 100) { let hsl = colorHSL(c, true); return colorHSLBuild(sper, hsl.s * 100, hsl.l * 100); }
  function hue(c, hdeg) { let hsl = colorHSL(c, true); return colorHSLBuild(hdeg, hsl.s * 100, hsl.l * 100); }
  c = light(c, 75);
  let diff = Math.round(360 / n)
  wheel = arrd(c, diff, 0, 0, n);
  return wheel;
}

//#endregion

//#region legacy color functions
function hexAToHSLA(H) {
  let ex = /^#([\da-f]{4}){1,2}$/i;
  if (ex.test(H)) {
    let r = 0,
      g = 0,
      b = 0,
      a = 1;
    if (H.length == 5) {
      r = '0x' + H[1] + H[1];
      g = '0x' + H[2] + H[2];
      b = '0x' + H[3] + H[3];
      a = '0x' + H[4] + H[4];
    } else if (H.length == 9) {
      r = '0x' + H[1] + H[2];
      g = '0x' + H[3] + H[4];
      b = '0x' + H[5] + H[6];
      a = '0x' + H[7] + H[8];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    a = (a / 255).toFixed(3);
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  } else {
    return 'Invalid input color';
  }
}
function hexToHSL(H) {
  let ex = /^#([\da-f]{3}){1,2}$/i;
  if (ex.test(H)) {
    let r = 0,
      g = 0,
      b = 0;
    if (H.length == 4) {
      r = '0x' + H[1] + H[1];
      g = '0x' + H[2] + H[2];
      b = '0x' + H[3] + H[3];
    } else if (H.length == 7) {
      r = '0x' + H[1] + H[2];
      g = '0x' + H[3] + H[4];
      b = '0x' + H[5] + H[6];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
  } else {
    return 'Invalid input color';
  }
}
function hex2RgbObject(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		}
		: null;
}
function HSLAToRGBA(hsla, isPct) {
  let ex = /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
  if (ex.test(hsla)) {
    let sep = hsla.indexOf(',') > -1 ? ',' : ' ';
    hsla = hsla
      .substr(5)
      .split(')')[0]
      .split(sep);
    if (hsla.indexOf('/') > -1) hsla.splice(3, 1);
    isPct = isPct === true;
    let h = hsla[0],
      s = hsla[1].substr(0, hsla[1].length - 1) / 100,
      l = hsla[2].substr(0, hsla[2].length - 1) / 100,
      a = hsla[3];
    if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
    else if (h.indexOf('rad') > -1) h = Math.round((h.substr(0, h.length - 3) / (2 * Math.PI)) * 360);
    else if (h.indexOf('turn') > -1) h = Math.round(h.substr(0, h.length - 4) * 360);
    if (h >= 360) h %= 360;
    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    let pctFound = a.indexOf('%') > -1;
    if (isPct) {
      r = +((r / 255) * 100).toFixed(1);
      g = +((g / 255) * 100).toFixed(1);
      b = +((b / 255) * 100).toFixed(1);
      if (!pctFound) {
        a *= 100;
      } else {
        a = a.substr(0, a.length - 1);
      }
    } else if (pctFound) {
      a = a.substr(0, a.length - 1) / 100;
    }
    return 'rgba(' + (isPct ? r + '%,' + g + '%,' + b + '%,' + a + '%' : +r + ',' + +g + ',' + +b + ',' + +a) + ')';
  } else {
    return 'Invalid input color';
  }
}
function hslToHex(h, s, l, alpha) {
  //expects h:0..360, s,l 0..100%, alpha 0..1
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}` + (isdef(alpha)?alphaToHex(alpha):'');
}
function hslToHexCOOL(hslColor) {
  const hslColorCopy = { ...hslColor };
  hslColorCopy.l /= 100;
  const a =
    (hslColorCopy.s * Math.min(hslColorCopy.l, 1 - hslColorCopy.l)) / 100;
  const f = (n) => {
    const k = (n + hslColorCopy.h / 30) % 12;
    const color = hslColorCopy.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
function HSLToRGB(hsl, isPct) {
  let ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
  if (ex.test(hsl)) {
    let sep = hsl.indexOf(',') > -1 ? ',' : ' ';
    hsl = hsl
      .substr(4)
      .split(')')[0]
      .split(sep);
    isPct = isPct === true;
    let h = hsl[0],
      s = hsl[1].substr(0, hsl[1].length - 1) / 100,
      l = hsl[2].substr(0, hsl[2].length - 1) / 100;
    if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
    else if (h.indexOf('rad') > -1) h = Math.round((h.substr(0, h.length - 3) / (2 * Math.PI)) * 360);
    else if (h.indexOf('turn') > -1) h = Math.round(h.substr(0, h.length - 4) * 360);
    if (h >= 360) h %= 360;
    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    if (isPct) {
      r = +((r / 255) * 100).toFixed(1);
      g = +((g / 255) * 100).toFixed(1);
      b = +((b / 255) * 100).toFixed(1);
    }
    return 'rgb(' + (isPct ? r + '%,' + g + '%,' + b + '%' : +r + ',' + +g + ',' + +b) + ')';
  } else {
    return 'Invalid input color';
  }
}
function hue(h) {
  var r = Math.abs(h * 6 - 3) - 1;
  var g = 2 - Math.abs(h * 6 - 2);
  var b = 2 - Math.abs(h * 6 - 4);
  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}
function RGBAToHSLA(rgba) {
  let ex = /^rgba\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){3}))|(((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){3}))\/\s)((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
  if (ex.test(rgba)) {
    let sep = rgba.indexOf(',') > -1 ? ',' : ' ';
    rgba = rgba
      .substr(5)
      .split(')')[0]
      .split(sep);
    if (rgba.indexOf('/') > -1) rgba.splice(3, 1);
    for (let R in rgba) {
      let r = rgba[R];
      if (r.indexOf('%') > -1) {
        let p = r.substr(0, r.length - 1) / 100;
        if (R < 3) {
          rgba[R] = Math.round(p * 255);
        }
      }
    }
    let r = rgba[0] / 255,
      g = rgba[1] / 255,
      b = rgba[2] / 255,
      a = rgba[3],
      cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  } else {
    return 'Invalid input color';
  }
}
function RGBToHSL(rgb) {
  let ex = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;
  if (ex.test(rgb)) {
    let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
    rgb = rgb
      .substr(4)
      .split(')')[0]
      .split(sep);
    for (let R in rgb) {
      let r = rgb[R];
      if (r.indexOf('%') > -1) rgb[R] = Math.round((r.substr(0, r.length - 1) / 100) * 255);
    }
    let r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
  } else {
    return 'Invalid input color';
  }
}


function colorContrast(dDrop, list = ['white', 'black']) {
  let bg = mGetStyle(dDrop, 'bg'); return bestContrastingColor(bg, list);
}
function colorFromHSL(hue, sat = 100, lum = 50) {
  return hslToHex(valf(hue, rHue()), sat, lum);
}
function colorHex(cAny) {
  let c = colorFrom(cAny);
  if (c[0] == '#') {
    return c;
  } else {
    let res = pSBC(0, c, 'c');
    return res;
  }
}
function colorHexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}
function colorHSLBuild(hue, sat = 100, lum = 50) { let result = "hsl(" + hue + ',' + sat + '%,' + lum + '%)'; return result; }
function colorNameToHexString(str) {
  var ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = str;
  return ctx.fillStyle;
}
function colorRGB(cAny, asObject = false) {
  let res = colorFrom(cAny);
  let srgb = res;
  if (res[0] == '#') {
    srgb = pSBC(0, res, 'c');
  }
  let n = allNumbers(srgb);
  if (asObject) {
    return { r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 };
  } else {
    return srgb;
  }
}
function colorsFromBFA(bg, fg, alpha) {
  if (fg == 'contrast') {
    if (bg != 'inherit') bg = colorFrom(bg, alpha);
    fg = colorIdealText(bg);
  } else if (bg == 'contrast') {
    fg = colorFrom(fg);
    bg = colorIdealText(fg);
  } else {
    if (isdef(bg) && bg != 'inherit') bg = colorFrom(bg, alpha);
    if (isdef(fg) && fg != 'inherit') fg = colorFrom(fg);
  }
  return [bg, fg];
}
function colorIdealText(bg, grayPreferred = false) {
  let rgb = colorRGB(bg, true);
  const nThreshold = 105;
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;
  var bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
  var foreColor = 255 - bgDelta < nThreshold ? 'black' : 'white';
  if (grayPreferred) foreColor = 255 - bgDelta < nThreshold ? 'dimgray' : 'snow';
  return foreColor;
}
function colorLight(c, percent = 20, log = true) {
  if (nundef(c)) {
    return colorFromHSL(rHue(), 100, 85);
  } else c = colorFrom(c);
  let zero1 = percent / 100;
  return pSBC(zero1, c, undefined, !log);
}
function colorLighter(c, zero1 = .2, log = true) {
  c = colorFrom(c);
  return pSBC(zero1, c, undefined, !log);
}
function colorPalette(color, type = 'shade') {
  color = colorFrom(color);
  return colorShades(color);
}
function colorShades(color) {
  let res = [];
  for (let frac = -0.8; frac <= 0.8; frac += 0.2) {
    let c = pSBC(frac, color, undefined, true);
    res.push(c);
  }
  return res;
}
function colorTrans(cAny, alpha = 0.5) {
  return colorFrom(cAny, alpha);
}
function computeColor(c) { return (c == 'random') ? randomColor() : c; }
function getExtendedColors(bg, fg) {
  bg = computeColor(bg);
  fg = computeColor(fg);
  if (bg == 'inherit' && (nundef(fg) || fg == 'contrast')) {
    fg = 'inherit';
  } else if (fg == 'contrast' && isdef(bg) && bg != 'inherit') fg = colorIdealText(bg);
  else if (bg == 'contrast' && isdef(fg) && fg != 'inherit') { bg = colorIdealText(fg); }
  return [bg, fg];
}
//#endregion

//#region mStyle
function mStyle(elem, styles = {}, unit = 'px') {
  elem = toElem(elem);
  let style = styles = jsCopy(styles);
  if (isdef(styles.w100)) style.w = '100%';
  if (isdef(styles.h100)) style.h = '100%';
  let bg, fg;
  if (isdef(styles.bg) || isdef(styles.fg)) {
    [bg, fg] = colorsFromBFA(styles.bg, styles.fg, styles.alpha);
    //console.log('bg',bg)
  }
  if (isdef(styles.vpadding) || isdef(styles.hpadding)) {
    styles.padding = valf(styles.vpadding, 0) + unit + ' ' + valf(styles.hpadding, 0) + unit;
  }
  if (isdef(styles.vmargin) || isdef(styles.hmargin)) {
    styles.margin = valf(styles.vmargin, 0) + unit + ' ' + valf(styles.hmargin, 0) + unit;
  }
  if (isdef(styles.upperRounding) || isdef(styles.lowerRounding)) {
    let rtop = '' + valf(styles.upperRounding, 0) + unit;
    let rbot = '' + valf(styles.lowerRounding, 0) + unit;
    styles['border-radius'] = rtop + ' ' + rtop + ' ' + rbot + ' ' + rbot;
  }
  if (isdef(styles.box)) styles['box-sizing'] = 'border-box';
  if (isdef(styles.round)) { elem.style.setProperty('border-radius', '50%'); }
  for (const k in styles) {
    if (['round', 'box'].includes(k)) continue;
    let val = styles[k];
    let key = k;
    if (isdef(STYLE_PARAMS[k])) key = STYLE_PARAMS[k];
    else if (k == 'font' && !isString(val)) {
      let fz = f.size; if (isNumber(fz)) fz = '' + fz + 'px';
      let ff = f.family;
      let fv = f.variant;
      let fw = isdef(f.bold) ? 'bold' : isdef(f.light) ? 'light' : f.weight;
      let fs = isdef(f.italic) ? 'italic' : f.style;
      if (nundef(fz) || nundef(ff)) return null;
      let s = fz + ' ' + ff;
      if (isdef(fw)) s = fw + ' ' + s;
      if (isdef(fv)) s = fv + ' ' + s;
      if (isdef(fs)) s = fs + ' ' + s;
      elem.style.setProperty(k, s);
      continue;
    } else if (k.includes('class')) {
      mClass(elem, styles[k]);
    } else if (k == 'border') {
      if (isNumber(val)) val = `solid ${val}px ${isdef(styles.fg) ? styles.fg : '#ffffff80'}`;
      if (val.indexOf(' ') < 0) val = 'solid 1px ' + val;
    } else if (k == 'ajcenter') {
      elem.style.setProperty('justify-content', 'center');
      elem.style.setProperty('align-items', 'center');
    } else if (k == 'layout') {
      if (val[0] == 'f') {
        val = val.slice(1);
        elem.style.setProperty('display', 'flex');
        elem.style.setProperty('flex-wrap', 'wrap');
        let hor, vert;
        if (val.length == 1) hor = vert = 'center';
        else {
          let di = { c: 'center', s: 'start', e: 'end' };
          hor = di[val[1]];
          vert = di[val[2]];
        }
        let justStyle = val[0] == 'v' ? vert : hor;
        let alignStyle = val[0] == 'v' ? hor : vert;
        elem.style.setProperty('justify-content', justStyle);
        elem.style.setProperty('align-items', alignStyle);
        switch (val[0]) {
          case 'v': elem.style.setProperty('flex-direction', 'column'); break;
          case 'h': elem.style.setProperty('flex-direction', 'row'); break;
        }
      } else if (val[0] == 'g') {
        val = val.slice(1);
        elem.style.setProperty('display', 'grid');
        let n = allNumbers(val);
        let cols = n[0];
        let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
        elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
        elem.style.setProperty('place-content', 'center');
      }
    } else if (k == 'layflex') {
      elem.style.setProperty('display', 'flex');
      elem.style.setProperty('flex', '0 1 auto');
      elem.style.setProperty('flex-wrap', 'wrap');
      if (val == 'v') { elem.style.setProperty('writing-mode', 'vertical-lr'); }
    } else if (k == 'laygrid') {
      elem.style.setProperty('display', 'grid');
      let n = allNumbers(val);
      let cols = n[0];
      let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
      elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
      elem.style.setProperty('place-content', 'center');
    }
    if (key == 'font-weight') { elem.style.setProperty(key, val); continue; }
    else if (key == 'background-color') elem.style.backgroundColor = bg;
    else if (key == 'color') elem.style.color = fg;
    else if (key == 'opacity') elem.style.opacity = val;
    else if (key == 'wrap') { if (val == 'hard') elem.setAttribute('wrap', 'hard'); else elem.style.flexWrap = 'wrap'; }
    else if (k.startsWith('dir')) {
      isCol = val[0] == 'c';
      elem.style.setProperty('flex-direction', 'column');
    } else if (key == 'flex') {
      if (isNumber(val)) val = '' + val + ' 1 0%';
      elem.style.setProperty(key, makeUnitString(val, unit));
    } else {
      elem.style.setProperty(key, makeUnitString(val, unit));
    }
  }
}
//#endregion

//#region settings and colors menu
async function settingsClose(){
  console.log('close Settings!!!'); mClear('dMain');
}

function colorBlendMode(c1, c2, blendMode) {
	function blendColorDodge(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);

		const dodge = (a, b) => (b === 255) ? 255 : Math.min(255, ((a << 8) / (255 - b)));

		let r = dodge(r1, r2);
		let g = dodge(g1, g2);
		let b = dodge(b1, b2);

		return colorRgbArgsToHex79(r, g, b);
	}
	function blendColor(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);

		let [h1, s1, l1] = colorRgbArgsToHsl01Array(r1, g1, b1);
		let [h2, s2, l2] = colorRgbArgsToHsl01Array(r2, g2, b2);

		// Use the blend hue, but keep the base saturation and lightness
		let cfinal = colorHsl01ArgsToRgbArray(h2, s1, l1);
		return colorRgbArgsToHex79(...cfinal);
	}
	function blendDarken(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);

		let r = Math.min(r1, r2);
		let g = Math.min(g1, g2);
		let b = Math.min(b1, b2);

		return colorRgbArgsToHex79(r, g, b);
	}
	function blendLighten(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);

		let r = Math.max(r1, r2);
		let g = Math.max(g1, g2);
		let b = Math.max(b1, b2);

		return colorRgbArgsToHex79(r, g, b);
	}
	function blendLuminosity(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);

		let [h1, s1, l1] = colorRgbArgsToHsl01Array(r1, g1, b1);
		let [h2, s2, l2] = colorRgbArgsToHsl01Array(r2, g2, b2);

		// Set the luminosity of the base color to the luminosity of the blend color
		let [r, g, b] = colorHsl01ArgsToRgbArray(h1, s1, l2);

		return colorRgbArgsToHex79(r, g, b);
	}
	function blendMultiply(color1, color2) {
		let [r1, g1, b1] = colorHexToRgbArray(color1);
		let [r2, g2, b2] = colorHexToRgbArray(color2);

		// Multiply each channel and divide by 255 to scale back to color space
		let r = (r1 * r2) / 255;
		let g = (g1 * g2) / 255;
		let b = (b1 * b2) / 255;

		return colorRgbArgsToHex79(Math.round(r), Math.round(g), Math.round(b));
	}
	function blendNormal(baseColor, blendColor) {
		return blendColor; // The blend color simply replaces the base color
	}
	function blendOverlay(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);

		const overlayCalculate = (a, b) => (a <= 128) ? (2 * a * b / 255) : (255 - 2 * (255 - a) * (255 - b) / 255);

		let r = overlayCalculate(r1, r2);
		let g = overlayCalculate(g1, g2);
		let b = overlayCalculate(b1, b2);

		return colorRgbArgsToHex79(r, g, b);
	}
	function blendSaturation(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);

		let [h1, s1, l1] = colorRgbArgsToHsl01Array(r1, g1, b1);
		let [h2, s2, l2] = colorRgbArgsToHsl01Array(r2, g2, b2);

		// Use the base hue and lightness, blend saturation
		let cfinal = colorHsl01ArgsToRgbArray(h1, s2, l1);
		return colorRgbArgsToHex79(...cfinal);
	}
	function blendScreen(color1, color2) {
		let [r1, g1, b1] = colorHexToRgbArray(color1);
		let [r2, g2, b2] = colorHexToRgbArray(color2);

		// Apply the screen blend mode formula
		let r = 255 - (((255 - r1) * (255 - r2)) / 255);
		let g = 255 - (((255 - g1) * (255 - g2)) / 255);
		let b = 255 - (((255 - b1) * (255 - b2)) / 255);

		return colorRgbArgsToHex79(r, g, b);
	}

  //console.log('blendMode',blendMode);
  let di={darken:blendDarken,lighten:blendLighten,color:blendColor,colorDodge:blendColorDodge,luminosity:blendLuminosity,multiply:blendMultiply,normal:blendNormal,overlay:blendOverlay,
    saturation:blendSaturation,screen:blendScreen};
	let func = di[blendMode]; if (nundef(di)) {console.log('blendMode',blendMode);return c1;} //this[`blend${blendMode.toUpperCase}`];
	//console.log(func);
	c1hex = colorFrom(c1);
	c2hex = colorFrom(c2);
  let res = func(c1hex,c2hex);
	//console.log('blend',c1hex,c2hex,'=>',res);
	return res;
}
function colorPaletteFromImage(img) {
  if (nundef(ColorThiefObject)) ColorThiefObject = new ColorThief();
  //console.log('ColorThiefObject',ColorThiefObject)
  let palette0 = ColorThiefObject.getPalette(img);
  //console.log('...',palette0); //das ist manchmal null for some reason!
  let palette = [];
  for (const pal of palette0) {
    let color = colorFrom(pal);
    palette.push(color);
  }
  return palette;
}
function colorPaletteFromUrl(path) {
  let img = mCreateFrom(`<img src='${path}' />`);
  let pal = colorPaletteFromImage(img);
  return pal;
}
function colorTransPalette(n = 9) {
  let c = colorHex('white');
  let pal = [c];
  // alpha 0,0.1,0.2,0.3
  //wieviele alpha values kann ich in x colors unterbringen?
  //ex. x=3 1/3 
  //der mittlere ist 0

  //example n=5: 0 1 2 3 4 (Math.floor(n/2) = 2 sollte trans sein)
  // w, w .5 ,trans, b .5 ,b
  // incw=2, incb=2, iw=1, ib=1

  //  n iw  incw  ib  incb  vals
  //  3 0   _     0   _     white,trans,black
  //  4 1   .5    0   _     white,w.5,trans,black
  //  5 1   .5    1   .5    white,w.5,trans,b.5,black
  //  6 2   .33   1   .5    white,w.33,w.66,trans,b.5,black
  //  7 2   .33   2   .33   white,w.33,w.66,trans,b.33,b.66,black
  //  8 3   .25   2   .33   white,w.25,w.5.w.75,trans,b.33,b.66,black
  //  9 3   .25   3   .25   white,w.25,w.5.w.75,trans,b.25,b.5,b.75,black
  //...
  //  n Math.floor(n/2)-1 1/(iw+1) Math.floor((n-1)/2)-1 1/(ib+1)
  let [iw, ib] = [Math.floor(n / 2) - 1, Math.floor((n - 1) / 2) - 1];
  let [incw, incb] = [1 / (iw + 1), 1 / (ib + 1)];
  for (let i = 1; i < iw; i++) {
    let alpha = i * incw;
    pal.push(colorTrans(c, alpha));
  }
  pal.push('transparent');
  c = colorHex('black');
  for (let i = 1; i < ib; i++) {
    let alpha = i * incb;
    pal.push(colorTrans(c, alpha));
  }
  pal.push(c);

  return pal;
}
function expandHexShorthand(c) {
  // Check if the input is a valid shorthand hex code
  if (c.length === 4 && c[0] === '#') {
    // Expand each character to double
    let r = c[1];
    let g = c[2];
    let b = c[3];

    return `#${r}${r}${g}${g}${b}${b}`;
  } else {
    // Return the original input if it's not a valid shorthand hex code
    return c;
  }
}
async function getPaletteFromColorTextureBlend(color,texture,blend,dParent){
  let elem = mDom(dParent, {w:100,h:100,border:'red',position:'absolute',top:100,left:800});
  elem.style.backgroundColor = color;
  if (isEmpty(texture)) return colorPalette(color);
  elem.style.backgroundImage=texture.startsWith('url')?texture:`url("${texture}")`;
  elem.style.backgroundBlend = blend;
  let [repeat,size]=getRepeatAndSizeForTexture(texture);
  elem.style.backgroundRepeat = repeat;
  elem.style.backgroundSize = size;
  return getPaletteFromElem(elem);
}
function getRepeatAndSizeForTexture(t) {
  if (isEmpty(t)) return ['', ''];
  let bgRepeat = t.includes('marble_') ? 'no-repeat' : 'repeat';
  let bgSize = bgRepeat == 'repeat' ? 'auto' : 'cover';
  return [bgRepeat, bgSize];
}
function getNavBg(){return mGetStyle('dNav', 'bg');}
async function onclickBlendSample(item, items) {
  //console.log('CLICK!!!');//,item)
  let texture = settingsGetSelectedTexture();
  if (nundef(texture)) {console.log('please select a texture');return;}
  let blend = item.blend; //ev.target.style.backgroundImage;
  let prev=settingsGetSelectedBlend();//console.log(prev)
  if (prev != item) toggleItemSelection(prev);
  toggleItemSelection(item);
  if (item.isSelected) document.body.style.backgroundBlendMode = blend;

  let color=settingsGetSelectedColor();

}
async function onclickColor(item, items) {
  let c = item.color;//ev.target.style.background; 
  toggleItemSelection(item);//console.log('items',items)
  let selitems = items.filter(x => x.isSelected && x != item); selitems.map(x => toggleItemSelection(x));
  //console.log('c',c,typeof(c),isEmpty(c))
  if (!isEmpty(c)) c = colorHex(c);
  //if (isEmpty(c)) { console.log('color EMPTY!', item); } //ev.target.style);}
  for (const i of range(0, 9)) { mBy(`dSample${i}`).style.backgroundColor = c; }
  document.body.style.backgroundColor = c;
  // mBy('dPos').style.backgroundColor = c;
}
async function onclickTexture(item, items) {
  //console.log('item', item)
  let texture = item.bgImage; //ev.target.style.backgroundImage;
  let repeat = item.bgRepeat; //ev.target.style.backgroundRepeat;
  let bgSize = item.bgSize; //repeat == 'repeat'?'auto':'cover';
  let blend = item.blend;
  toggleItemSelection(item);
  let selitems = items.filter(x => x.isSelected && x != item); selitems.map(x => toggleItemSelection(x));
  //console.log('texture',texture,'repeat',repeat)
  //if (isEmpty(texture)) { console.log('texture EMPTY!', item); } //ev.target.style);}
  let blendDiv = null;
  for (const i of range(0, 9)) {
    let sample = mBy(`dSample${i}`);
    //console.log(sample.style.backgroundBlend, blend)
    if (sample.style.backgroundBlend == blend) { blendDiv = sample; break; }//console.log('YES!') }
    sample.style.backgroundImage = texture;
    sample.style.backgroundRepeat = repeat;
    sample.style.backgroundSize = bgSize;
  }
  document.body.style.backgroundImage = texture;
  document.body.style.backgroundRepeat = repeat;
  document.body.style.backgroundSize = bgSize;
  if (nundef(blendDiv)) return;
  blendDiv.click();

  let palette = item.palette.map(x=>x.hex); console.log(palette);
  let d=mBy('dPalette');
  mClear(d);
	let szSmall = 30;
	for (const c of palette) { mDom(d, { w: szSmall, h: szSmall, bg: c }) }
  mLinebreak(d);

}
function selectUserColor(itemsColor) {
  if (isEmpty(U.color)) U.color = rChoose(itemsColor);
  console.log('user color is',U.color)
  let c = colorHex(U.color);  //console.log(chex,itemsColor)
  let item = itemsColor.find(x => x.color == c);  //console.log('item with same color',item);
  console.log(c,item)
  if (isdef(item)) iDiv(item).click();
  return item.color;
}
function selectUserTexture(itemsTexture) {
  if (isEmpty(U.texture)) {console.log('no texture');return '';}
  let item = itemsTexture.find(x => x.bgImage.includes(U.texture));
  if (isdef(item)) iDiv(item).click();
  return isdef(item) ? item.path : '';
}
function selectUserBlend(itemsBlend) {
  if (isEmpty(U.blend)) {console.log('no blend');return '';}
  let item = itemsBlend.find(x => x.blend == U.blend);
  if (isdef(item)) iDiv(item).click();
  return isdef(item) ? item.blend : '';
}
function settingsGetSelectedBlend(){  
  let item = DA.itemsBlend.find(x=>x.isSelected == true);
  return item; 
}
function settingsGetSelectedColor(){  
  let item = DA.itemsColor.find(x=>x.isSelected == true);
  return item; 
}
function settingsGetSelectedTexture(){  
  let item = DA.itemsTexture.find(x=>x.isSelected == true);
  return item; 
}
async function settingsSave(){
  let o={name:U.name};
  let item = settingsGetSelectedColor();if (isdef(item)) o.color=item.color;
  item = settingsGetSelectedTexture();if (isdef(item)) o.texture=item.path;
  item = settingsGetSelectedBlend();if (isdef(item)) o.blend=item.blend;
}

//#endregion

//#region showTable
async function showTable(table) {
  if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); }
  if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

  let func = DA.funcs[table.game];
  let me = getUname();

  clearMain();

}
async function ____showTable(table) {
  if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); }
  let func = DA.funcs[table.game];
  let me = getUname();

  clearMain(); //INTERRUPT();

  if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
  else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

  Clientdata.table = table; //console.log(table);
  TPrev = T; T = { table, me };

  let d = T.dMain = mBy('dMain');//mClass(d,'wood')
  let dInstruction = T.dInstruction = mDom(d, { className: 'instruction' }, { html: `Waiting for ${table.fen.turn.join(', ')}` });
  mCenterFlex(dInstruction);
  // let dTitle=T.dTitle=mDom(d,{fz:'2em',weight:'bold',padding:'10'},{html:table.friendly,classes:'title'});
  let dTitle = T.dTitle = mDom(d, {}, { html: table.friendly });
  let dGameover = T.dGameover = mDom(d);
  let dStats = T.dStats = mDom('dMain');
  let dOpenTable = T.dOpenTable = mDom(d);
  // showRibbon(d,"this is the game!")
  //showMessage('HALLO this is a message');
  let dt = testUpdateTestButtons(dTitle); mStyle(dt, { matop: 4 });

  func.present(T);
  func.showStats(T);
  mRise(d);


}
async function ___showTable_rest(table) {
  //showTitle(`${table.friendly}`);
  mStyle('dTitle', { display: 'flex', justify: 'space-between' })
  mDom('dTitle', { fz: '2em', weight: 'bold', maleft: 10, display: 'inline' }, { html: table.friendly, classes: 'title' });
  let dOver = mDom('dMain', {}, { id: 'dGameover' })



  T = func.present('dMain', table, me); //console.log('TPrev',TPrev,'T',T);
  func.showStats(T);
  mRise('dMain');

  if (TESTING) testUpdateTestButtons();

  if (table.status == 'over') return showGameover(table, dOver);
  else if (func.checkGameover(table)) return await sendMergeTable(table);

  if (!table.fen.turn.includes(me)) { staticTitle(table); return; }

  animatedTitle();

  let playmode = getPlaymode(table, me);
  if (playmode == 'bot') return await func.botMove(T);
  else return await func.activate(T);
}
//#endregion 

//#region button96
function button96() {
  function setup(table) {
    let fen = {};
    fen.players = {};
    for (const name in table.players) {
      let pl = fen.players[name] = table.players[name];
      pl.color = getUserColor(name)
      pl.score = 0;
    }
    fen.number = 0;
    fen.plorder = jsCopy(table.playerNames);
    fen.turn = jsCopy(table.playerNames);
    delete table.players;
    return fen;
  }
  function checkGameover(table) {
    let score_sum = calcScoreSum(table);
    //console.log('___check score sum',score_sum);
    if (score_sum >= 5) {
      table.winners = getPlayersWithMaxScore(table.fen);
      table.status = 'over';
      return true;
    } else return false;
    //return table.playerNames.some(x => x.score == table.options.winning_score);
  }
  function present(T) {
    // //assumes that me is player at this table!!!
    // //assertion(calcScoreSum(table) == table.fen.number, "SCORE MISMATCH!!!! present")
    // //mClear(dParent);
    // let dInstruction = mDom(dParent,{className:'instruction'},{html:`Waiting for ${table.fen.turn.join(', ')}`});
    // let dStats = mDom(dParent);
    // let div = mDom(dParent, { margin: 12, align: 'center' }, { id: 'dGameDiv' }); //for shield! 

    // let bYes = mDom(div, { fz: 100, wmin: 200, margin:10, className: 'button' }, { tag: 'button', html: `Step:${table.step}` });
    // let bNo = mDom(div, { fz: 100, wmin: 200, margin:10,className: 'button' }, { tag: 'button', html: `Error!` });

    // if (nundef(name)) name=getUname(); //eingeloggter user perspective is default!

    // return { div, bYes, bNo, dInstruction, dStats, table, name };
  }
  function showStats(T) { button96Stats(T); }
  async function activate(T) {
    dInstruction.innerHTML = "click one of the buttons!"
    T.bYes.onclick = () => button96OnclickYes(T, true);
    T.bNo.onclick = () => button96OnclickNo(T, true);
  }
  async function botMove(T) {
    TO.button = setTimeout(() => button96BotMove(T), rChoose([1000, 2000, 3000]));
  }
  return { setup, activate, checkGameover, present, showStats, botMove };
}
function button96Stats(T) {
  let [fen, name, dStats] = [T.table.fen, T.name, T.dStats];
  let layout = 'rowflex';
  let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
  let player_stat_items = uiTypePlayerStats(fen, name, dStats, layout, style)
  for (const plname in fen.players) {
    let pl = fen.players[plname];
    let item = player_stat_items[plname];
    if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
    let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
    playerStatCount('star', pl.score, d);
  }
}
async function button96OnclickYes(T, direct = false) {
  let b = T.bYes;
  if (direct) clearEvents();
  disableUI(); //disableButton(b);

  await sendRaceStepScore(T.table, T.name);
}
async function button96OnclickNo(T, direct = false) {
  let b = T.bNo;
  if (direct) clearEvents();
  disableUI(); //disableButton(b);

  await sendRaceError(T.table, T.name);
}
async function button96BotMove(T) {
  if (coin(80)) await button96OnclickYes(T); else await button96OnclickNo(T);
}
//#endregion