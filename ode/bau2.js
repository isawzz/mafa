
//#region legacy colors
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

//#endregion

function colorFrom(c, a) {
	c = anyToHex79(c);
	if (nundef(a)) return c;
	return c.substring(0, 7) + (a < 1 ? alphaToHex(a) : '');
}
function isStandardHexColor(c) { return isString(c) && c[0] == '#' && (c.length == 7 || c.length == 9); }
function anyToHex79(c) {
	//returns hex standard format (7 or 9 characters)
	if (isStandardHexColor(c)) return c;

	let tString = isString(c), tArr = isList(c), tObj = isDict(c);
	if (tString && c[0] == '#') return hex45ToHex79(c);
	else if (tString && isdef(ColorDi) && lookup(ColorDi, [c])) return ColorDi[c].c;
	else if (tString && c.startsWith('rand')) {
		//eg. randLight => colorLight
		let spec = capitalize(c.substring(4));
		let func = window['color' + spec];
		c = isdef(func) ? func() : rColor();
		assertion(isStandardHexColor(c), 'ERROR coloFrom!!!!!!!!! (rand)');
		return c;
	} else if (tString && (c.startsWith('linear') || c.startsWith('radial'))) return c;
	else if (tString && c.startsWith('rgb')) return rgbStringToHex79(c);
	else if (tString && c.startsWith('hsl')) return hsl360StringToHex79(c);
	else if (tString) { ensureColorDict(); let c1 = ColorDi[c]; assertion(isdef(c1), `UNKNOWN color ${c}`); return c1.c; }
	else if (tArr && (c.length == 3 || c.length == 4) && isNumber(c[0])) return rgbArrayToHex79(c);
	else if (tArr) return anyToHex79(rChoose(tArr));
	else if (tObj && 'h' in c && c.h > 1) { return hsl360ObjectToHex79(c); } //console.log('!!!');
	else if (tObj && 'h' in c) return hsl01ObjectToHex79(c);
	else if (tObj && 'r' in c) return rgbArgsToHex79(c.r, c.g, c.b, c.a);

	assertion(false, `NO COLOR FOUND FOR ${c}`);
}

function hex45ToHex79(c) {
	let r = c[1];
	let g = c[2];
	let b = c[3];
	if (c.length == 5) return `#${r}${r}${g}${g}${b}${b}${c[4]}${c[4]}`;
	return `#${r}${r}${g}${g}${b}${b}`;
}
function hex79ToRgbArray(c) {
	let r = 0, g = 0, b = 0;
	r = parseInt(c[1] + c[2], 16);
	g = parseInt(c[3] + c[4], 16);
	b = parseInt(c[5] + c[6], 16);
	if (c.length == 7) return [r, g, b];

	let a = parseInt(c[7] + c[8], 16) / 255;
	return [r, g, b, a];
}
function hexToHsl01Array(c) { return rgbArgsToHsl01Array(...hexToRgbArray(c)); }
function hexToHsl360Object(c) {
	let arr = hexToHsl01Array(c);
	return hsl01ArrayToHsl360Object(arr);
}
function hexToHsl360String(c) {
	let arr = hexToHsl01Array(c);
	let o = hsl01ArrayToHsl360Object(arr);
	if (nundef(o.a)) return `hsl(${o.h},${o.s}%,${o.l}%)`;
	return `hsla(${o.h},${o.s}%,${o.l}%,${o.a})`;
}
function hexToHsl360String(c) {
	let r = 0, g = 0x40 / 255, b = 0x54 / 255;
	let max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	} else {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		if (max === r)
			h = (g - b) / d + (g < b ? 6 : 0);
		else if (max === g)
			h = (b - r) / d + 2;
		else if (max === b)
			h = (r - g) / d + 4;
		h *= 60;
		if (h < 0) h += 360;
	}
	return `hsl(${h.toFixed(1)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%)`;
}
function hexToRgbArray(c) {
	if (c.length < 7) c = hex45ToHex79(c);
	return hex79ToRgbArray(c);
}
function hexToRgbObject(c) {
	let arr = hexToRgbArray(c);
	let o = { r: arr[0], g: arr[1], b: arr[2] };
	if (arr.length > 3) o.a = arr[3];
	return o;
}
function hexToRgbString(hex) {
	let o = hexToRgbObject(hex);
	if (nundef(o.a)) return `rgb(${o.r},${o.g},${o.b})`;
	return `rgba(${o.r},${o.g},${o.b},${o.a})`;
}
function hsl01ArgsToRgbArray(h, s, l, a) {
	let r, g, b;

	//console.log('...',h,s,l,a)

	if (s === 0) {
		r = g = b = l; // achromatic
	} else {

		let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		let p = 2 * l - q;
		//console.log('???',q,p)
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	let res = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	//console.log('!!!res',res)
	if (nundef(a) || a == 1) return res;
	res.push(a);
	return res;
}
function hsl01ArgsToHex79(h, s, l, a) {
	let rgb = hsl01ArgsToRgbArray(h, s, l, a); //console.log(h,s,l,a,rgb)
	let res = rgbArgsToHex79(rgb[0], rgb[1], rgb[2], rgb.length > 3 ? rgb[3] : null);
	return res;
}
function hsl01ArrayToHsl360Object(arr) {
	let res = { h: arr[0] * 360, s: arr[1] * 100, l: arr[2] * 100 };
	if (arr.length > 3) res.a = arr[3];
	return res;
}
function hsl01ObjectToHex79(c) {
	//console.log('!!!!!',c)
	if (isdef(c.a)) return hsl01ArgsToHex79(c.h, c.s, c.l, c.a);
	return hsl01ArgsToHex79(c.h, c.s, c.l);
}
function hsl360ArgsToHsl01Object(h, s, l, a) {
	let res = { h: h / 360, s: s / 100, l: l / 100 };
	if (isdef(a)) res.a = a;
	return res;
}
function hsl360ArgsToHex79(h, s, l, a) {
	let o01 = hsl360ArgsToHsl01Object(h, s, l, a);
	return hsl01ArgsToHex79(o01.h, o01.s, o01.l, o01.a)
}
function hsl360ObjectToHex79(c) {
	let o01 = hsl360ArgsToHsl01Object(c.h, c.s, c.l, c.a); //console.log('!!!!',o01)
	return hsl01ObjectToHex79(o01)
}
function hsl360StringToHsl360Object(c) {
	let [h, s, l, a] = c.match(/\d+\.?\d*/g).map(Number);
	if (isdef(a) && a>1) a/=10;
	console.log('parsed',h,s,l,a)
	return { h, s, l, a };
}
function hsl360StringToHex79(c) {
 	let o360 = hsl360StringToHsl360Object(c); console.log(o360);
	let o01 = hsl360ArgsToHsl01Object(o360.h, o360.s, o360.l, o360.a); //console.log(o01);
	return hsl01ObjectToHex79(o01);
}
function hsl360StringToHex79_(hsl) {
	let [h, s, l] = hsl.match(/\d+\.?\d*/g).map(Number);
	console.log('anfang',h,s,l);
	const hue = h/360;
	const saturation = s / 100;
	const lightness = l / 100;



	const [r, g, b] = hslToRgb__(h, s, l); //saturation, lightness);
	console.log('rgb',r,g,b)
	// Convert RGB to Hex
	const toHex = x => x.toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbArrayToHex79(arr) { return rgbArgsToHex79(...arr); }

function rgbArgsToHex79(r, g, b, a) {
	//returns a standard hex 7
	r = Math.round(r).toString(16).padStart(2, '0');
	g = Math.round(g).toString(16).padStart(2, '0');
	b = Math.round(b).toString(16).padStart(2, '0');

	if (nundef(a)) return `#${r}${g}${b}`;

	a = Math.round(a * 255).toString(16).padStart(2, '0');
	return `#${r}${g}${b}${a}`;
}
function rgbArgsToHsl01Array(r, g, b) {
	r /= 255, g /= 255, b /= 255;
	let max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	} else {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	return [h, s, l];
}
function rgbStringToHex79(c) {
	let parts = c.split(',');
	let r = firstNumber(parts[0]);
	let g = firstNumber(parts[1]);
	let b = firstNumber(parts[2]);
	let a = parts.length > 3 ? Number(stringBefore(parts[3], ')')) : null;
	return rgbArgsToHex79(r, g, b, a);
}



function hslToRgb__(h, s, l) {
	console.log('hallo')
	let c = (1 - Math.abs(2 * l - 1)) * s;
	let x = c * (1 - Math.abs((h / 60) % 2 - 1));
	let m = l - c / 2;
	let r = 0, g = 0, b = 0;

	if (h >= 0 && h < 60) {
		r = c; g = x; b = 0;
	} else if (h >= 60 && h < 120) {
		r = x; g = c; b = 0;
	} else if (h >= 120 && h < 180) {
		r = 0; g = c; b = x;
	} else if (h >= 180 && h < 240) {
		r = 0; g = x; b = c;
	} else if (h >= 240 && h < 300) {
		r = x; g = 0; b = c;
	} else if (h >= 300 && h < 360) {
		r = c; g = 0; b = x;
	}

	// Converting from 0-1 range to 0-255 range and adding m
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return [r, g, b];
}
function hue2rgb(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}






