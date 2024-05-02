
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

function isStandardHexColor(c){return isString(c) && c[0]=='#' && (c.length==7 || c.length == 9); }
function rgbString2Hex79(cAny,a){
	
}

function colorFrom(cAny, a) {
	//returns hex standard format (7 or 9 characters)
	let alpha = isdef(a) && a < 1 ? alphaToHex(a) : '';
	let tString = isString(cAny), tArr = isArray(cAny), tObj = isDict(cAny);
	if (tString && cAny[0] == '#' && cAny.length >= 7) return cAny.substring(0, 7) + alpha;
	else if (tString && cAny[0] == '#') return hex42hex79(cAny, a);
	else if (tString && isdef(ColorDi) && lookup(ColorDi, [cAny])) return ColorDi[cAny].substring(0, 7) + alpha;
	else if (tString && cAny.startsWith('rand')) {
		//eg. randLight => colorLight
		let spec = capitalize(cAny.substring(4));
		let func = window['color' + spec];
		cAny=isdef(func)?func():rColor();
		assertion(isStandardHexColor(cAny),'ERROR coloFrom!!!!!!!!! (rand)');
	}else if (tString && (cAny.startsWith('linear') || cAny.startsWith('radial'))) return cAny;
	else if (tString && cAny.startsWith('rgb')) return rgbString2RgbArr(cAny)+alpha;

}
function restrestrest(cAny, a) {
	if (cAny[0] == 'r' && cAny[1] == 'g') {
		let parts = cAny.split(',');
		let r = firstNumber(parts[0]);
		let g = firstNumber(parts[1]);
		let b = firstNumber(parts[2]);
		if (nundef(a) && parts.length > 3) a = Number(stringBefore(parts[3], ')'));
		return rgbArgs2Hex79(r, g, b, a);
	} else if (cAny[0] == 'h' && cAny[1] == 's') {
		let parts = cAny.split(',');
		let h = firstNumber(parts[0]);
		let s = firstNumber(parts[1]);
		let l = firstNumber(parts[2]);
		if (parts.length > 3) a = valf(a, Number(stringBefore(parts[3], ')')));
		return hslToHex(h, s, l, a);
	} else {
		ensureColorDict();
		let c = ColorDi[cAny];
		if (nundef(c)) {
			if (cAny.startsWith('rand')) {
				let spec = cAny.substring(4);
				if (isdef(window['color' + spec])) {
					c = window['color' + spec](res);
				} else c = rColor();
			} else {
				console.log('color not available:', cAny);
				throw new Error('color not found: ' + cAny)
				return '#00000000';
			}
		} else c = c.c;
		if (a == undefined) return c;
		c = c.substring(0, 7);
		return c + (a == 1 ? '' : alphaToHex(a));

	} else if (Array.isArray(cAny)) {
		if (cAny.length == 3 && isNumber(cAny[0])) {
			let r = cAny[0];
			let g = cAny[1];
			let b = cAny[2];
			return rgbArgs2Hex79(r, g, b, a);
			// return a == undefined || a == 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
		} else {
			return rChoose(cAny);
		}
	} else if (typeof cAny == 'object') {
		if ('h' in cAny) { return hslToHex(cAny.h, cAny.s, cAny.l, valf(a, cAny.a)); }
		else if ('r' in cAny) { return rgbArgs2Hex79(cAny.r, cAny.g, cAny.b, valf(a, cAny.a)); }
	}
}

function hex42hex79(cAny, a) {
	let r = cAny[1];
	let g = cAny[2];
	let b = cAny[3];
	if (cAny.length == 5 && nundef(a)) return `#${r}${r}${g}${g}${b}${b}${cAny[4]}${cAny[4]}`;
	cAny = `#${r}${r}${g}${g}${b}${b}`;

	if (a == undefined) return cAny;
	cAny = cAny.substring(0, 7);
	return cAny + (a == 1 ? '' : alphaToHex(a));
}
function hex2Hsl01Array(hex) { return rgbArgs2Hsl01Array(...hex2RgbArray(hex)); }
function hex2Hsl360Object(hex) {
	let arr = hex2Hsl01Array(hex);
	return hsl01Array2hsl360Object(arr);
}
function hex2RgbArray(hex) {
	let r = 0, g = 0, b = 0;
	// 3 digits
	if (hex.length === 4) {
		r = parseInt(hex[1] + hex[1], 16);
		g = parseInt(hex[2] + hex[2], 16);
		b = parseInt(hex[3] + hex[3], 16);
	}
	// 6 digits
	else if (hex.length === 7) {
		r = parseInt(hex[1] + hex[2], 16);
		g = parseInt(hex[3] + hex[4], 16);
		b = parseInt(hex[5] + hex[6], 16);
	}
	return [r, g, b];
}
function hsl01Args2RgbArray(h, s, l) {
	let r, g, b;

	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		let p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function hsl01Array2hsl360Object(arr) {
	let res = { h: arr[0] * 360, s: arr[1] * 100, l: arr[2] * 100 };
	if (arr.length > 3) res.a = arr[3];
	return res;
}
function rgbArgs2Hex79(r, g, b, a) {
	//returns a standard hex 7
	r = Math.round(r).toString(16).padStart(2, '0');
	g = Math.round(g).toString(16).padStart(2, '0');
	b = Math.round(b).toString(16).padStart(2, '0');

	if (nundef(a)) return `#${r}${g}${b}`;

	a = Math.round(a * 255).toString(16).padStart(2, '0');
	return `#${r}${g}${b}${a}`;
}
function rgbArgs2Hsl01Array(r, g, b) {
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









