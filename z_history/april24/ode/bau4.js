
//#region NEW color functions
function colorFrom(c, a) {
	c = colorToHex79(c);
	if (nundef(a)) return c;
	return c.substring(0, 7) + (a < 1 ? alphaToHex(a) : '');
}
function colorIsHex79(c) { return isString(c) && c[0] == '#' && (c.length == 7 || c.length == 9); }
function colorToHex79(c) {
	//returns hex standard format (7 or 9 characters)
	if (colorIsHex79(c)) return c;

	let tString = isString(c), tArr = isList(c), tObj = isDict(c);
	if (tString && c[0] == '#') return colorHex45ToHex79(c);
	else if (tString && isdef(ColorDi) && lookup(ColorDi, [c])) return ColorDi[c].c;
	else if (tString && c.startsWith('rand')) {
		//eg. randLight => colorLight
		let spec = capitalize(c.substring(4));
		let func = window['color' + spec];
		c = isdef(func) ? func() : rColor();
		assertion(colorIsHex79(c), 'ERROR coloFrom!!!!!!!!! (rand)');
		return c;
	} else if (tString && (c.startsWith('linear') || c.startsWith('radial'))) return c;
	else if (tString && c.startsWith('rgb')) return colorRgbStringToHex79(c);
	else if (tString && c.startsWith('hsl')) return colorHsl360StringToHex79(c);
	else if (tString) { ensureColorDict(); let c1 = ColorDi[c]; assertion(isdef(c1), `UNKNOWN color ${c}`); return c1.c; }
	else if (tArr && (c.length == 3 || c.length == 4) && isNumber(c[0])) return colorRgbArrayToHex79(c);
	else if (tArr) return colorToHex79(rChoose(tArr));
	else if (tObj && 'h' in c && c.h > 1) { return colorHsl360ObjectToHex79(c); } //console.log('!!!');
	else if (tObj && 'h' in c) return colorHsl01ObjectToHex79(c);
	else if (tObj && 'r' in c) return colorRgbArgsToHex79(c.r, c.g, c.b, c.a);

	assertion(false, `NO COLOR FOUND FOR ${c}`);
}

function colorHex45ToHex79(c) {
	let r = c[1];
	let g = c[2];
	let b = c[3];
	if (c.length == 5) return `#${r}${r}${g}${g}${b}${b}${c[4]}${c[4]}`;
	return `#${r}${r}${g}${g}${b}${b}`;
}
function colorHex79ToRgbArray(c) {
	let r = 0, g = 0, b = 0;
	r = parseInt(c[1] + c[2], 16);
	g = parseInt(c[3] + c[4], 16);
	b = parseInt(c[5] + c[6], 16);
	if (c.length == 7) return [r, g, b];

	let a = parseInt(c[7] + c[8], 16) / 255;
	return [r, g, b, a];
}
function colorHexToHsl01Array(c) { return colorRgbArgsToHsl01Array(...colorHexToRgbArray(c)); }
function colorHexToHsl360Object(c) {
	let arr = colorHexToHsl01Array(c);
	return colorHsl01ArrayToHsl360Object(arr);
}
function colorHexToHsl360String(c) {
	let arr = colorHexToHsl01Array(c);
	let o = colorHsl01ArrayToHsl360Object(arr);
	if (nundef(o.a)) return `hsl(${o.h},${o.s}%,${o.l}%)`;
	return `hsla(${o.h},${o.s}%,${o.l}%,${o.a})`;
}
function colorHexToHsl360String(c) {
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
function colorHexToRgbArray(c) {
	if (c.length < 7) c = colorHex45ToHex79(c);
	return colorHex79ToRgbArray(c);
}
function colorHexToRgbObject(c) {
	let arr = colorHexToRgbArray(c);
	let o = { r: arr[0], g: arr[1], b: arr[2] };
	if (arr.length > 3) o.a = arr[3];
	return o;
}
function colorHexToRgbString(hex) {
	let o = colorHexToRgbObject(hex);
	if (nundef(o.a)) return `rgb(${o.r},${o.g},${o.b})`;
	return `rgba(${o.r},${o.g},${o.b},${o.a})`;
}
function colorHsl01ArgsToRgbArray(h, s, l, a) {
	let r, g, b;

	//console.log('...',h,s,l,a)
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

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
function colorHsl01ArgsToHex79(h, s, l, a) {
	let rgb = colorHsl01ArgsToRgbArray(h, s, l, a); //console.log(h,s,l,a,rgb)
	let res = colorRgbArgsToHex79(rgb[0], rgb[1], rgb[2], rgb.length > 3 ? rgb[3] : null);
	return res;
}
function colorHsl01ArrayToHsl360Object(arr) {
	let res = { h: arr[0] * 360, s: arr[1] * 100, l: arr[2] * 100 };
	if (arr.length > 3) res.a = arr[3];
	return res;
}
function colorHsl01ObjectToHex79(c) {
	//console.log('!!!!!',c)
	if (isdef(c.a)) return colorHsl01ArgsToHex79(c.h, c.s, c.l, c.a);
	return colorHsl01ArgsToHex79(c.h, c.s, c.l);
}
function colorHsl360ArgsToHsl01Object(h, s, l, a) {
	let res = { h: h / 360, s: s / 100, l: l / 100 };
	if (isdef(a)) res.a = a;
	return res;
}
function colorHsl360ArgsToHex79(h, s, l, a) {
	let o01 = colorHsl360ArgsToHsl01Object(h, s, l, a);
	return colorHsl01ArgsToHex79(o01.h, o01.s, o01.l, o01.a)
}
function colorHsl360ObjectToHex79(c) {
	let o01 = colorHsl360ArgsToHsl01Object(c.h, c.s, c.l, c.a); //console.log('!!!!',o01)
	return colorHsl01ObjectToHex79(o01)
}
function colorHsl360StringToHsl360Object(c) {
	let [h, s, l, a] = c.match(/\d+\.?\d*/g).map(Number);
	if (isdef(a) && a>1) a/=10;
	//console.log('parsed',h,s,l,a)
	return { h, s, l, a };
}
function colorHsl360StringToHex79(c) {
 	let o360 = colorHsl360StringToHsl360Object(c); //console.log(o360);
	let o01 = colorHsl360ArgsToHsl01Object(o360.h, o360.s, o360.l, o360.a); //console.log(o01);
	return colorHsl01ObjectToHex79(o01);
}
function colorRgbArrayToHex79(arr) { return colorRgbArgsToHex79(...arr); }

function colorRgbArgsToHex79(r, g, b, a) {
	//returns a standard hex 7
	r = Math.round(r).toString(16).padStart(2, '0');
	g = Math.round(g).toString(16).padStart(2, '0');
	b = Math.round(b).toString(16).padStart(2, '0');

	if (nundef(a)) return `#${r}${g}${b}`;

	a = Math.round(a * 255).toString(16).padStart(2, '0');
	return `#${r}${g}${b}${a}`;
}
function colorRgbArgsToHsl01Array(r, g, b) {
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
function colorRgbStringToHex79(c) {
	let parts = c.split(',');
	let r = firstNumber(parts[0]);
	let g = firstNumber(parts[1]);
	let b = firstNumber(parts[2]);
	let a = parts.length > 3 ? Number(stringBefore(parts[3], ')')) : null;
	return colorRgbArgsToHex79(r, g, b, a);
}


//#endregion



function circleFromCenter(dParent, center, styles = {}) {
	mSizeSuccession(styles);
	let [left, top] = [center.x - styles.w / 2, center.y - styles.h / 2];
	let d = mDom(dParent, { position: 'absolute', left, top, round: true });
	mStyle(d, styles);
	return d;
}
function colormapAsString(){
	let html = `
		<area style='cursor:pointer' shape='poly' coords='63,0,72,4,72,15,63,19,54,15,54,4' onclick='clickColor("#003366",-200,54)' onmouseover='mouseOverColor("#003366")' alt='#003366' />
		<area style='cursor:pointer' shape='poly' coords='81,0,90,4,90,15,81,19,72,15,72,4' onclick='clickColor("#336699",-200,72)' onmouseover='mouseOverColor("#336699")' alt='#336699' />
		<area style='cursor:pointer' shape='poly' coords='99,0,108,4,108,15,99,19,90,15,90,4' onclick='clickColor("#3366CC",-200,90)' onmouseover='mouseOverColor("#3366CC")' alt='#3366CC' />
		<area style='cursor:pointer' shape='poly' coords='117,0,126,4,126,15,117,19,108,15,108,4' onclick='clickColor("#003399",-200,108)' onmouseover='mouseOverColor("#003399")' alt='#003399' />
		<area style='cursor:pointer' shape='poly' coords='135,0,144,4,144,15,135,19,126,15,126,4' onclick='clickColor("#000099",-200,126)' onmouseover='mouseOverColor("#000099")' alt='#000099' />
		<area style='cursor:pointer' shape='poly' coords='153,0,162,4,162,15,153,19,144,15,144,4' onclick='clickColor("#0000CC",-200,144)' onmouseover='mouseOverColor("#0000CC")' alt='#0000CC' />
		<area style='cursor:pointer' shape='poly' coords='171,0,180,4,180,15,171,19,162,15,162,4' onclick='clickColor("#000066",-200,162)' onmouseover='mouseOverColor("#000066")' alt='#000066' />
		<area style='cursor:pointer' shape='poly' coords='54,15,63,19,63,30,54,34,45,30,45,19' onclick='clickColor("#006666",-185,45)' onmouseover='mouseOverColor("#006666")' alt='#006666' />
		<area style='cursor:pointer' shape='poly' coords='72,15,81,19,81,30,72,34,63,30,63,19' onclick='clickColor("#006699",-185,63)' onmouseover='mouseOverColor("#006699")' alt='#006699' />
		<area style='cursor:pointer' shape='poly' coords='90,15,99,19,99,30,90,34,81,30,81,19' onclick='clickColor("#0099CC",-185,81)' onmouseover='mouseOverColor("#0099CC")' alt='#0099CC' />
		<area style='cursor:pointer' shape='poly' coords='108,15,117,19,117,30,108,34,99,30,99,19' onclick='clickColor("#0066CC",-185,99)' onmouseover='mouseOverColor("#0066CC")' alt='#0066CC' />
		<area style='cursor:pointer' shape='poly' coords='126,15,135,19,135,30,126,34,117,30,117,19' onclick='clickColor("#0033CC",-185,117)' onmouseover='mouseOverColor("#0033CC")' alt='#0033CC' />
		<area style='cursor:pointer' shape='poly' coords='144,15,153,19,153,30,144,34,135,30,135,19' onclick='clickColor("#0000FF",-185,135)' onmouseover='mouseOverColor("#0000FF")' alt='#0000FF' />
		<area style='cursor:pointer' shape='poly' coords='162,15,171,19,171,30,162,34,153,30,153,19' onclick='clickColor("#3333FF",-185,153)' onmouseover='mouseOverColor("#3333FF")' alt='#3333FF' />
		<area style='cursor:pointer' shape='poly' coords='180,15,189,19,189,30,180,34,171,30,171,19' onclick='clickColor("#333399",-185,171)' onmouseover='mouseOverColor("#333399")' alt='#333399' />
		<area style='cursor:pointer' shape='poly' coords='45,30,54,34,54,45,45,49,36,45,36,34' onclick='clickColor("#669999",-170,36)' onmouseover='mouseOverColor("#669999")' alt='#669999' />
		<area style='cursor:pointer' shape='poly' coords='63,30,72,34,72,45,63,49,54,45,54,34' onclick='clickColor("#009999",-170,54)' onmouseover='mouseOverColor("#009999")' alt='#009999' />
		<area style='cursor:pointer' shape='poly' coords='81,30,90,34,90,45,81,49,72,45,72,34' onclick='clickColor("#33CCCC",-170,72)' onmouseover='mouseOverColor("#33CCCC")' alt='#33CCCC' />
		<area style='cursor:pointer' shape='poly' coords='99,30,108,34,108,45,99,49,90,45,90,34' onclick='clickColor("#00CCFF",-170,90)' onmouseover='mouseOverColor("#00CCFF")' alt='#00CCFF' />
		<area style='cursor:pointer' shape='poly' coords='117,30,126,34,126,45,117,49,108,45,108,34' onclick='clickColor("#0099FF",-170,108)' onmouseover='mouseOverColor("#0099FF")' alt='#0099FF' />
		<area style='cursor:pointer' shape='poly' coords='135,30,144,34,144,45,135,49,126,45,126,34' onclick='clickColor("#0066FF",-170,126)' onmouseover='mouseOverColor("#0066FF")' alt='#0066FF' />
		<area style='cursor:pointer' shape='poly' coords='153,30,162,34,162,45,153,49,144,45,144,34' onclick='clickColor("#3366FF",-170,144)' onmouseover='mouseOverColor("#3366FF")' alt='#3366FF' />
		<area style='cursor:pointer' shape='poly' coords='171,30,180,34,180,45,171,49,162,45,162,34' onclick='clickColor("#3333CC",-170,162)' onmouseover='mouseOverColor("#3333CC")' alt='#3333CC' />
		<area style='cursor:pointer' shape='poly' coords='189,30,198,34,198,45,189,49,180,45,180,34' onclick='clickColor("#666699",-170,180)' onmouseover='mouseOverColor("#666699")' alt='#666699' />
		<area style='cursor:pointer' shape='poly' coords='36,45,45,49,45,60,36,64,27,60,27,49' onclick='clickColor("#339966",-155,27)' onmouseover='mouseOverColor("#339966")' alt='#339966' />
		<area style='cursor:pointer' shape='poly' coords='54,45,63,49,63,60,54,64,45,60,45,49' onclick='clickColor("#00CC99",-155,45)' onmouseover='mouseOverColor("#00CC99")' alt='#00CC99' />
		<area style='cursor:pointer' shape='poly' coords='72,45,81,49,81,60,72,64,63,60,63,49' onclick='clickColor("#00FFCC",-155,63)' onmouseover='mouseOverColor("#00FFCC")' alt='#00FFCC' />
		<area style='cursor:pointer' shape='poly' coords='90,45,99,49,99,60,90,64,81,60,81,49' onclick='clickColor("#00FFFF",-155,81)' onmouseover='mouseOverColor("#00FFFF")' alt='#00FFFF' />
		<area style='cursor:pointer' shape='poly' coords='108,45,117,49,117,60,108,64,99,60,99,49' onclick='clickColor("#33CCFF",-155,99)' onmouseover='mouseOverColor("#33CCFF")' alt='#33CCFF' />
		<area style='cursor:pointer' shape='poly' coords='126,45,135,49,135,60,126,64,117,60,117,49' onclick='clickColor("#3399FF",-155,117)' onmouseover='mouseOverColor("#3399FF")' alt='#3399FF' />
		<area style='cursor:pointer' shape='poly' coords='144,45,153,49,153,60,144,64,135,60,135,49' onclick='clickColor("#6699FF",-155,135)' onmouseover='mouseOverColor("#6699FF")' alt='#6699FF' />
		<area style='cursor:pointer' shape='poly' coords='162,45,171,49,171,60,162,64,153,60,153,49' onclick='clickColor("#6666FF",-155,153)' onmouseover='mouseOverColor("#6666FF")' alt='#6666FF' />
		<area style='cursor:pointer' shape='poly' coords='180,45,189,49,189,60,180,64,171,60,171,49' onclick='clickColor("#6600FF",-155,171)' onmouseover='mouseOverColor("#6600FF")' alt='#6600FF' />
		<area style='cursor:pointer' shape='poly' coords='198,45,207,49,207,60,198,64,189,60,189,49' onclick='clickColor("#6600CC",-155,189)' onmouseover='mouseOverColor("#6600CC")' alt='#6600CC' />
		<area style='cursor:pointer' shape='poly' coords='27,60,36,64,36,75,27,79,18,75,18,64' onclick='clickColor("#339933",-140,18)' onmouseover='mouseOverColor("#339933")' alt='#339933' />
		<area style='cursor:pointer' shape='poly' coords='45,60,54,64,54,75,45,79,36,75,36,64' onclick='clickColor("#00CC66",-140,36)' onmouseover='mouseOverColor("#00CC66")' alt='#00CC66' />
		<area style='cursor:pointer' shape='poly' coords='63,60,72,64,72,75,63,79,54,75,54,64' onclick='clickColor("#00FF99",-140,54)' onmouseover='mouseOverColor("#00FF99")' alt='#00FF99' />
		<area style='cursor:pointer' shape='poly' coords='81,60,90,64,90,75,81,79,72,75,72,64' onclick='clickColor("#66FFCC",-140,72)' onmouseover='mouseOverColor("#66FFCC")' alt='#66FFCC' />
		<area style='cursor:pointer' shape='poly' coords='99,60,108,64,108,75,99,79,90,75,90,64' onclick='clickColor("#66FFFF",-140,90)' onmouseover='mouseOverColor("#66FFFF")' alt='#66FFFF' />
		<area style='cursor:pointer' shape='poly' coords='117,60,126,64,126,75,117,79,108,75,108,64' onclick='clickColor("#66CCFF",-140,108)' onmouseover='mouseOverColor("#66CCFF")' alt='#66CCFF' />
		<area style='cursor:pointer' shape='poly' coords='135,60,144,64,144,75,135,79,126,75,126,64' onclick='clickColor("#99CCFF",-140,126)' onmouseover='mouseOverColor("#99CCFF")' alt='#99CCFF' />
		<area style='cursor:pointer' shape='poly' coords='153,60,162,64,162,75,153,79,144,75,144,64' onclick='clickColor("#9999FF",-140,144)' onmouseover='mouseOverColor("#9999FF")' alt='#9999FF' />
		<area style='cursor:pointer' shape='poly' coords='171,60,180,64,180,75,171,79,162,75,162,64' onclick='clickColor("#9966FF",-140,162)' onmouseover='mouseOverColor("#9966FF")' alt='#9966FF' />
		<area style='cursor:pointer' shape='poly' coords='189,60,198,64,198,75,189,79,180,75,180,64' onclick='clickColor("#9933FF",-140,180)' onmouseover='mouseOverColor("#9933FF")' alt='#9933FF' />
		<area style='cursor:pointer' shape='poly' coords='207,60,216,64,216,75,207,79,198,75,198,64' onclick='clickColor("#9900FF",-140,198)' onmouseover='mouseOverColor("#9900FF")' alt='#9900FF' />
		<area style='cursor:pointer' shape='poly' coords='18,75,27,79,27,90,18,94,9,90,9,79' onclick='clickColor("#006600",-125,9)' onmouseover='mouseOverColor("#006600")' alt='#006600' />
		<area style='cursor:pointer' shape='poly' coords='36,75,45,79,45,90,36,94,27,90,27,79' onclick='clickColor("#00CC00",-125,27)' onmouseover='mouseOverColor("#00CC00")' alt='#00CC00' />
		<area style='cursor:pointer' shape='poly' coords='54,75,63,79,63,90,54,94,45,90,45,79' onclick='clickColor("#00FF00",-125,45)' onmouseover='mouseOverColor("#00FF00")' alt='#00FF00' />
		<area style='cursor:pointer' shape='poly' coords='72,75,81,79,81,90,72,94,63,90,63,79' onclick='clickColor("#66FF99",-125,63)' onmouseover='mouseOverColor("#66FF99")' alt='#66FF99' />
		<area style='cursor:pointer' shape='poly' coords='90,75,99,79,99,90,90,94,81,90,81,79' onclick='clickColor("#99FFCC",-125,81)' onmouseover='mouseOverColor("#99FFCC")' alt='#99FFCC' />
		<area style='cursor:pointer' shape='poly' coords='108,75,117,79,117,90,108,94,99,90,99,79' onclick='clickColor("#CCFFFF",-125,99)' onmouseover='mouseOverColor("#CCFFFF")' alt='#CCFFFF' />
		<area style='cursor:pointer' shape='poly' coords='126,75,135,79,135,90,126,94,117,90,117,79' onclick='clickColor("#CCCCFF",-125,117)' onmouseover='mouseOverColor("#CCCCFF")' alt='#CCCCFF' />
		<area style='cursor:pointer' shape='poly' coords='144,75,153,79,153,90,144,94,135,90,135,79' onclick='clickColor("#CC99FF",-125,135)' onmouseover='mouseOverColor("#CC99FF")' alt='#CC99FF' />
		<area style='cursor:pointer' shape='poly' coords='162,75,171,79,171,90,162,94,153,90,153,79' onclick='clickColor("#CC66FF",-125,153)' onmouseover='mouseOverColor("#CC66FF")' alt='#CC66FF' />
		<area style='cursor:pointer' shape='poly' coords='180,75,189,79,189,90,180,94,171,90,171,79' onclick='clickColor("#CC33FF",-125,171)' onmouseover='mouseOverColor("#CC33FF")' alt='#CC33FF' />
		<area style='cursor:pointer' shape='poly' coords='198,75,207,79,207,90,198,94,189,90,189,79' onclick='clickColor("#CC00FF",-125,189)' onmouseover='mouseOverColor("#CC00FF")' alt='#CC00FF' />
		<area style='cursor:pointer' shape='poly' coords='216,75,225,79,225,90,216,94,207,90,207,79' onclick='clickColor("#9900CC",-125,207)' onmouseover='mouseOverColor("#9900CC")' alt='#9900CC' />
		<area style='cursor:pointer' shape='poly' coords='9,90,18,94,18,105,9,109,0,105,0,94' onclick='clickColor("#003300",-110,0)' onmouseover='mouseOverColor("#003300")' alt='#003300' />
		<area style='cursor:pointer' shape='poly' coords='27,90,36,94,36,105,27,109,18,105,18,94' onclick='clickColor("#009933",-110,18)' onmouseover='mouseOverColor("#009933")' alt='#009933' />
		<area style='cursor:pointer' shape='poly' coords='45,90,54,94,54,105,45,109,36,105,36,94' onclick='clickColor("#33CC33",-110,36)' onmouseover='mouseOverColor("#33CC33")' alt='#33CC33' />
		<area style='cursor:pointer' shape='poly' coords='63,90,72,94,72,105,63,109,54,105,54,94' onclick='clickColor("#66FF66",-110,54)' onmouseover='mouseOverColor("#66FF66")' alt='#66FF66' />
		<area style='cursor:pointer' shape='poly' coords='81,90,90,94,90,105,81,109,72,105,72,94' onclick='clickColor("#99FF99",-110,72)' onmouseover='mouseOverColor("#99FF99")' alt='#99FF99' />
		<area style='cursor:pointer' shape='poly' coords='99,90,108,94,108,105,99,109,90,105,90,94' onclick='clickColor("#CCFFCC",-110,90)' onmouseover='mouseOverColor("#CCFFCC")' alt='#CCFFCC' />
		<area style='cursor:pointer' shape='poly' coords='117,90,126,94,126,105,117,109,108,105,108,94' onclick='clickColor("#FFFFFF",-110,108)' onmouseover='mouseOverColor("#FFFFFF")' alt='#FFFFFF' />
		<area style='cursor:pointer' shape='poly' coords='135,90,144,94,144,105,135,109,126,105,126,94' onclick='clickColor("#FFCCEE",-110,126)' onmouseover='mouseOverColor("#FFCCEE")' alt='#FFCCFF' />
		<area style='cursor:pointer' shape='poly' coords='153,90,162,94,162,105,153,109,144,105,144,94' onclick='clickColor("#FFAAEE",-110,144)' onmouseover='mouseOverColor("#FFAAEE")' alt='#FF33DD' />
		<area style='cursor:pointer' shape='poly' coords='171,90,180,94,180,105,171,109,162,105,162,94' onclick='clickColor("#FF88EE",-110,162)' onmouseover='mouseOverColor("#FF88EE")' alt='#FF66FF' />
		<area style='cursor:pointer' shape='poly' coords='189,90,198,94,198,105,189,109,180,105,180,94' onclick='clickColor("#FF14EE",-110,180)' onmouseover='mouseOverColor("#FF14EE")' alt='#FF00FF' />
		<area style='cursor:pointer' shape='poly' coords='207,90,216,94,216,105,207,109,198,105,198,94' onclick='clickColor("#CC00CC",-110,198)' onmouseover='mouseOverColor("#CC00CC")' alt='#CC00CC' />
		<area style='cursor:pointer' shape='poly' coords='225,90,234,94,234,105,225,109,216,105,216,94' onclick='clickColor("#660066",-110,216)' onmouseover='mouseOverColor("#660066")' alt='#660066' />
		<area style='cursor:pointer' shape='poly' coords='18,105,27,109,27,120,18,124,9,120,9,109' onclick='clickColor("#336600",-95,9)' onmouseover='mouseOverColor("#336600")' alt='#336600' />
		<area style='cursor:pointer' shape='poly' coords='36,105,45,109,45,120,36,124,27,120,27,109' onclick='clickColor("#009900",-95,27)' onmouseover='mouseOverColor("#009900")' alt='#009900' />
		<area style='cursor:pointer' shape='poly' coords='54,105,63,109,63,120,54,124,45,120,45,109' onclick='clickColor("#66FF33",-95,45)' onmouseover='mouseOverColor("#66FF33")' alt='#66FF33' />
		<area style='cursor:pointer' shape='poly' coords='72,105,81,109,81,120,72,124,63,120,63,109' onclick='clickColor("#99FF66",-95,63)' onmouseover='mouseOverColor("#99FF66")' alt='#99FF66' />
		<area style='cursor:pointer' shape='poly' coords='90,105,99,109,99,120,90,124,81,120,81,109' onclick='clickColor("#CCFF99",-95,81)' onmouseover='mouseOverColor("#CCFF99")' alt='#CCFF99' />
		<area style='cursor:pointer' shape='poly' coords='108,105,117,109,117,120,108,124,99,120,99,109' onclick='clickColor("#FFFFCC",-95,99)' onmouseover='mouseOverColor("#FFFFCC")' alt='#FFFFCC' />
		<area style='cursor:pointer' shape='poly' coords='126,105,135,109,135,120,126,124,117,120,117,109' onclick='clickColor("#FFCCCC",-95,117)' onmouseover='mouseOverColor("#FFCCCC")' alt='#FFCCCC' />
		<area style='cursor:pointer' shape='poly' coords='144,105,153,109,153,120,144,124,135,120,135,109' onclick='clickColor("#FF99CC",-95,135)' onmouseover='mouseOverColor("#FF99CC")' alt='#FF99CC' />
		<area style='cursor:pointer' shape='poly' coords='162,105,171,109,171,120,162,124,153,120,153,109' onclick='clickColor("#FF66CC",-95,153)' onmouseover='mouseOverColor("#FF66CC")' alt='#FF66CC' />
		<area style='cursor:pointer' shape='poly' coords='180,105,189,109,189,120,180,124,171,120,171,109' onclick='clickColor("#FF33CC",-95,171)' onmouseover='mouseOverColor("#FF33CC")' alt='#FF33CC' />
		<area style='cursor:pointer' shape='poly' coords='198,105,207,109,207,120,198,124,189,120,189,109' onclick='clickColor("#CC0099",-95,189)' onmouseover='mouseOverColor("#CC0099")' alt='#CC0099' />
		<area style='cursor:pointer' shape='poly' coords='216,105,225,109,225,120,216,124,207,120,207,109' onclick='clickColor("#993399",-95,207)' onmouseover='mouseOverColor("#993399")' alt='#993399' />
		<area style='cursor:pointer' shape='poly' coords='27,120,36,124,36,135,27,139,18,135,18,124' onclick='clickColor("#333300",-80,18)' onmouseover='mouseOverColor("#333300")' alt='#333300' />
		<area style='cursor:pointer' shape='poly' coords='45,120,54,124,54,135,45,139,36,135,36,124' onclick='clickColor("#669900",-80,36)' onmouseover='mouseOverColor("#669900")' alt='#669900' />
		<area style='cursor:pointer' shape='poly' coords='63,120,72,124,72,135,63,139,54,135,54,124' onclick='clickColor("#99FF33",-80,54)' onmouseover='mouseOverColor("#99FF33")' alt='#99FF33' />
		<area style='cursor:pointer' shape='poly' coords='81,120,90,124,90,135,81,139,72,135,72,124' onclick='clickColor("#CCFF66",-80,72)' onmouseover='mouseOverColor("#CCFF66")' alt='#CCFF66' />
		<area style='cursor:pointer' shape='poly' coords='99,120,108,124,108,135,99,139,90,135,90,124' onclick='clickColor("#FFFF99",-80,90)' onmouseover='mouseOverColor("#FFFF99")' alt='#FFFF99' />
		<area style='cursor:pointer' shape='poly' coords='117,120,126,124,126,135,117,139,108,135,108,124' onclick='clickColor("#FFCC99",-80,108)' onmouseover='mouseOverColor("#FFCC99")' alt='#FFCC99' />
		<area style='cursor:pointer' shape='poly' coords='135,120,144,124,144,135,135,139,126,135,126,124' onclick='clickColor("#FF9999",-80,126)' onmouseover='mouseOverColor("#FF9999")' alt='#FF9999' />
		<area style='cursor:pointer' shape='poly' coords='153,120,162,124,162,135,153,139,144,135,144,124' onclick='clickColor("#FF6699",-80,144)' onmouseover='mouseOverColor("#FF6699")' alt='#FF6699' />
		<area style='cursor:pointer' shape='poly' coords='171,120,180,124,180,135,171,139,162,135,162,124' onclick='clickColor("#FF3399",-80,162)' onmouseover='mouseOverColor("#FF3399")' alt='#FF3399' />
		<area style='cursor:pointer' shape='poly' coords='189,120,198,124,198,135,189,139,180,135,180,124' onclick='clickColor("#CC3399",-80,180)' onmouseover='mouseOverColor("#CC3399")' alt='#CC3399' />
		<area style='cursor:pointer' shape='poly' coords='207,120,216,124,216,135,207,139,198,135,198,124' onclick='clickColor("#990099",-80,198)' onmouseover='mouseOverColor("#990099")' alt='#990099' />
		<area style='cursor:pointer' shape='poly' coords='36,135,45,139,45,150,36,154,27,150,27,139' onclick='clickColor("#666633",-65,27)' onmouseover='mouseOverColor("#666633")' alt='#666633' />
		<area style='cursor:pointer' shape='poly' coords='54,135,63,139,63,150,54,154,45,150,45,139' onclick='clickColor("#99CC00",-65,45)' onmouseover='mouseOverColor("#99CC00")' alt='#99CC00' />
		<area style='cursor:pointer' shape='poly' coords='72,135,81,139,81,150,72,154,63,150,63,139' onclick='clickColor("#CCFF33",-65,63)' onmouseover='mouseOverColor("#CCFF33")' alt='#CCFF33' />
		<area style='cursor:pointer' shape='poly' coords='90,135,99,139,99,150,90,154,81,150,81,139' onclick='clickColor("#FFFF66",-65,81)' onmouseover='mouseOverColor("#FFFF66")' alt='#FFFF66' />
		<area style='cursor:pointer' shape='poly' coords='108,135,117,139,117,150,108,154,99,150,99,139' onclick='clickColor("#FFCC66",-65,99)' onmouseover='mouseOverColor("#FFCC66")' alt='#FFCC66' />
		<area style='cursor:pointer' shape='poly' coords='126,135,135,139,135,150,126,154,117,150,117,139' onclick='clickColor("#FF9966",-65,117)' onmouseover='mouseOverColor("#FF9966")' alt='#FF9966' />
		<area style='cursor:pointer' shape='poly' coords='144,135,153,139,153,150,144,154,135,150,135,139' onclick='clickColor("#FF6666",-65,135)' onmouseover='mouseOverColor("#FF6666")' alt='#FF6666' />
		<area style='cursor:pointer' shape='poly' coords='162,135,171,139,171,150,162,154,153,150,153,139' onclick='clickColor("#FF0066",-65,153)' onmouseover='mouseOverColor("#FF0066")' alt='#FF0066' />
		<area style='cursor:pointer' shape='poly' coords='180,135,189,139,189,150,180,154,171,150,171,139' onclick='clickColor("#CC6699",-65,171)' onmouseover='mouseOverColor("#CC6699")' alt='#CC6699' />
		<area style='cursor:pointer' shape='poly' coords='198,135,207,139,207,150,198,154,189,150,189,139' onclick='clickColor("#993366",-65,189)' onmouseover='mouseOverColor("#993366")' alt='#993366' />
		<area style='cursor:pointer' shape='poly' coords='45,150,54,154,54,165,45,169,36,165,36,154' onclick='clickColor("#999966",-50,36)' onmouseover='mouseOverColor("#999966")' alt='#999966' />
		<area style='cursor:pointer' shape='poly' coords='63,150,72,154,72,165,63,169,54,165,54,154' onclick='clickColor("#CCCC00",-50,54)' onmouseover='mouseOverColor("#CCCC00")' alt='#CCCC00' />
		<area style='cursor:pointer' shape='poly' coords='81,150,90,154,90,165,81,169,72,165,72,154' onclick='clickColor("#FFFF00",-50,72)' onmouseover='mouseOverColor("#FFFF00")' alt='#FFFF00' />
		<area style='cursor:pointer' shape='poly' coords='99,150,108,154,108,165,99,169,90,165,90,154' onclick='clickColor("#FFCC00",-50,90)' onmouseover='mouseOverColor("#FFCC00")' alt='#FFCC00' />
		<area style='cursor:pointer' shape='poly' coords='117,150,126,154,126,165,117,169,108,165,108,154' onclick='clickColor("#FF9933",-50,108)' onmouseover='mouseOverColor("#FF9933")' alt='#FF9933' />
		<area style='cursor:pointer' shape='poly' coords='135,150,144,154,144,165,135,169,126,165,126,154' onclick='clickColor("#FF6600",-50,126)' onmouseover='mouseOverColor("#FF6600")' alt='#FF6600' />
		<area style='cursor:pointer' shape='poly' coords='153,150,162,154,162,165,153,169,144,165,144,154' onclick='clickColor("#FF5050",-50,144)' onmouseover='mouseOverColor("#FF5050")' alt='#FF5050' />
		<area style='cursor:pointer' shape='poly' coords='171,150,180,154,180,165,171,169,162,165,162,154' onclick='clickColor("#CC0066",-50,162)' onmouseover='mouseOverColor("#CC0066")' alt='#CC0066' />
		<area style='cursor:pointer' shape='poly' coords='189,150,198,154,198,165,189,169,180,165,180,154' onclick='clickColor("#660033",-50,180)' onmouseover='mouseOverColor("#660033")' alt='#660033' />
		<area style='cursor:pointer' shape='poly' coords='54,165,63,169,63,180,54,184,45,180,45,169' onclick='clickColor("#996633",-35,45)' onmouseover='mouseOverColor("#996633")' alt='#996633' />
		<area style='cursor:pointer' shape='poly' coords='72,165,81,169,81,180,72,184,63,180,63,169' onclick='clickColor("#CC9900",-35,63)' onmouseover='mouseOverColor("#CC9900")' alt='#CC9900' />
		<area style='cursor:pointer' shape='poly' coords='90,165,99,169,99,180,90,184,81,180,81,169' onclick='clickColor("#FF9900",-35,81)' onmouseover='mouseOverColor("#FF9900")' alt='#FF9900' />
		<area style='cursor:pointer' shape='poly' coords='108,165,117,169,117,180,108,184,99,180,99,169' onclick='clickColor("#CC6600",-35,99)' onmouseover='mouseOverColor("#CC6600")' alt='#CC6600' />
		<area style='cursor:pointer' shape='poly' coords='126,165,135,169,135,180,126,184,117,180,117,169' onclick='clickColor("#FF3300",-35,117)' onmouseover='mouseOverColor("#FF3300")' alt='#FF3300' />
		<area style='cursor:pointer' shape='poly' coords='144,165,153,169,153,180,144,184,135,180,135,169' onclick='clickColor("#FF0000",-35,135)' onmouseover='mouseOverColor("#FF0000")' alt='#FF0000' />
		<area style='cursor:pointer' shape='poly' coords='162,165,171,169,171,180,162,184,153,180,153,169' onclick='clickColor("#CC0000",-35,153)' onmouseover='mouseOverColor("#CC0000")' alt='#CC0000' />
		<area style='cursor:pointer' shape='poly' coords='180,165,189,169,189,180,180,184,171,180,171,169' onclick='clickColor("#990033",-35,171)' onmouseover='mouseOverColor("#990033")' alt='#990033' />
		<area style='cursor:pointer' shape='poly' coords='63,180,72,184,72,195,63,199,54,195,54,184' onclick='clickColor("#663300",-20,54)' onmouseover='mouseOverColor("#663300")' alt='#663300' />
		<area style='cursor:pointer' shape='poly' coords='81,180,90,184,90,195,81,199,72,195,72,184' onclick='clickColor("#996600",-20,72)' onmouseover='mouseOverColor("#996600")' alt='#996600' />
		<area style='cursor:pointer' shape='poly' coords='99,180,108,184,108,195,99,199,90,195,90,184' onclick='clickColor("#CC3300",-20,90)' onmouseover='mouseOverColor("#CC3300")' alt='#CC3300' />
		<area style='cursor:pointer' shape='poly' coords='117,180,126,184,126,195,117,199,108,195,108,184' onclick='clickColor("#993300",-20,108)' onmouseover='mouseOverColor("#993300")' alt='#993300' />
		<area style='cursor:pointer' shape='poly' coords='135,180,144,184,144,195,135,199,126,195,126,184' onclick='clickColor("#990000",-20,126)' onmouseover='mouseOverColor("#990000")' alt='#990000' />
		<area style='cursor:pointer' shape='poly' coords='153,180,162,184,162,195,153,199,144,195,144,184' onclick='clickColor("#800000",-20,144)' onmouseover='mouseOverColor("#800000")' alt='#800000' />
		<area style='cursor:pointer' shape='poly' coords='171,180,180,184,180,195,171,199,162,195,162,184' onclick='clickColor("#993333",-20,162)' onmouseover='mouseOverColor("#993333")' alt='#993333' />
	 `;
	return html;
}
function colormapAsStringOrig(){
	let html = `
		<area style='cursor:pointer' shape='poly' coords='63,0,72,4,72,15,63,19,54,15,54,4' onclick='clickColor("#003366",-200,54)' onmouseover='mouseOverColor("#003366")' alt='#003366' />
		<area style='cursor:pointer' shape='poly' coords='81,0,90,4,90,15,81,19,72,15,72,4' onclick='clickColor("#336699",-200,72)' onmouseover='mouseOverColor("#336699")' alt='#336699' />
		<area style='cursor:pointer' shape='poly' coords='99,0,108,4,108,15,99,19,90,15,90,4' onclick='clickColor("#3366CC",-200,90)' onmouseover='mouseOverColor("#3366CC")' alt='#3366CC' />
		<area style='cursor:pointer' shape='poly' coords='117,0,126,4,126,15,117,19,108,15,108,4' onclick='clickColor("#003399",-200,108)' onmouseover='mouseOverColor("#003399")' alt='#003399' />
		<area style='cursor:pointer' shape='poly' coords='135,0,144,4,144,15,135,19,126,15,126,4' onclick='clickColor("#000099",-200,126)' onmouseover='mouseOverColor("#000099")' alt='#000099' />
		<area style='cursor:pointer' shape='poly' coords='153,0,162,4,162,15,153,19,144,15,144,4' onclick='clickColor("#0000CC",-200,144)' onmouseover='mouseOverColor("#0000CC")' alt='#0000CC' />
		<area style='cursor:pointer' shape='poly' coords='171,0,180,4,180,15,171,19,162,15,162,4' onclick='clickColor("#000066",-200,162)' onmouseover='mouseOverColor("#000066")' alt='#000066' />
		<area style='cursor:pointer' shape='poly' coords='54,15,63,19,63,30,54,34,45,30,45,19' onclick='clickColor("#006666",-185,45)' onmouseover='mouseOverColor("#006666")' alt='#006666' />
		<area style='cursor:pointer' shape='poly' coords='72,15,81,19,81,30,72,34,63,30,63,19' onclick='clickColor("#006699",-185,63)' onmouseover='mouseOverColor("#006699")' alt='#006699' />
		<area style='cursor:pointer' shape='poly' coords='90,15,99,19,99,30,90,34,81,30,81,19' onclick='clickColor("#0099CC",-185,81)' onmouseover='mouseOverColor("#0099CC")' alt='#0099CC' />
		<area style='cursor:pointer' shape='poly' coords='108,15,117,19,117,30,108,34,99,30,99,19' onclick='clickColor("#0066CC",-185,99)' onmouseover='mouseOverColor("#0066CC")' alt='#0066CC' />
		<area style='cursor:pointer' shape='poly' coords='126,15,135,19,135,30,126,34,117,30,117,19' onclick='clickColor("#0033CC",-185,117)' onmouseover='mouseOverColor("#0033CC")' alt='#0033CC' />
		<area style='cursor:pointer' shape='poly' coords='144,15,153,19,153,30,144,34,135,30,135,19' onclick='clickColor("#0000FF",-185,135)' onmouseover='mouseOverColor("#0000FF")' alt='#0000FF' />
		<area style='cursor:pointer' shape='poly' coords='162,15,171,19,171,30,162,34,153,30,153,19' onclick='clickColor("#3333FF",-185,153)' onmouseover='mouseOverColor("#3333FF")' alt='#3333FF' />
		<area style='cursor:pointer' shape='poly' coords='180,15,189,19,189,30,180,34,171,30,171,19' onclick='clickColor("#333399",-185,171)' onmouseover='mouseOverColor("#333399")' alt='#333399' />
		<area style='cursor:pointer' shape='poly' coords='45,30,54,34,54,45,45,49,36,45,36,34' onclick='clickColor("#669999",-170,36)' onmouseover='mouseOverColor("#669999")' alt='#669999' />
		<area style='cursor:pointer' shape='poly' coords='63,30,72,34,72,45,63,49,54,45,54,34' onclick='clickColor("#009999",-170,54)' onmouseover='mouseOverColor("#009999")' alt='#009999' />
		<area style='cursor:pointer' shape='poly' coords='81,30,90,34,90,45,81,49,72,45,72,34' onclick='clickColor("#33CCCC",-170,72)' onmouseover='mouseOverColor("#33CCCC")' alt='#33CCCC' />
		<area style='cursor:pointer' shape='poly' coords='99,30,108,34,108,45,99,49,90,45,90,34' onclick='clickColor("#00CCFF",-170,90)' onmouseover='mouseOverColor("#00CCFF")' alt='#00CCFF' />
		<area style='cursor:pointer' shape='poly' coords='117,30,126,34,126,45,117,49,108,45,108,34' onclick='clickColor("#0099FF",-170,108)' onmouseover='mouseOverColor("#0099FF")' alt='#0099FF' />
		<area style='cursor:pointer' shape='poly' coords='135,30,144,34,144,45,135,49,126,45,126,34' onclick='clickColor("#0066FF",-170,126)' onmouseover='mouseOverColor("#0066FF")' alt='#0066FF' />
		<area style='cursor:pointer' shape='poly' coords='153,30,162,34,162,45,153,49,144,45,144,34' onclick='clickColor("#3366FF",-170,144)' onmouseover='mouseOverColor("#3366FF")' alt='#3366FF' />
		<area style='cursor:pointer' shape='poly' coords='171,30,180,34,180,45,171,49,162,45,162,34' onclick='clickColor("#3333CC",-170,162)' onmouseover='mouseOverColor("#3333CC")' alt='#3333CC' />
		<area style='cursor:pointer' shape='poly' coords='189,30,198,34,198,45,189,49,180,45,180,34' onclick='clickColor("#666699",-170,180)' onmouseover='mouseOverColor("#666699")' alt='#666699' />
		<area style='cursor:pointer' shape='poly' coords='36,45,45,49,45,60,36,64,27,60,27,49' onclick='clickColor("#339966",-155,27)' onmouseover='mouseOverColor("#339966")' alt='#339966' />
		<area style='cursor:pointer' shape='poly' coords='54,45,63,49,63,60,54,64,45,60,45,49' onclick='clickColor("#00CC99",-155,45)' onmouseover='mouseOverColor("#00CC99")' alt='#00CC99' />
		<area style='cursor:pointer' shape='poly' coords='72,45,81,49,81,60,72,64,63,60,63,49' onclick='clickColor("#00FFCC",-155,63)' onmouseover='mouseOverColor("#00FFCC")' alt='#00FFCC' />
		<area style='cursor:pointer' shape='poly' coords='90,45,99,49,99,60,90,64,81,60,81,49' onclick='clickColor("#00FFFF",-155,81)' onmouseover='mouseOverColor("#00FFFF")' alt='#00FFFF' />
		<area style='cursor:pointer' shape='poly' coords='108,45,117,49,117,60,108,64,99,60,99,49' onclick='clickColor("#33CCFF",-155,99)' onmouseover='mouseOverColor("#33CCFF")' alt='#33CCFF' />
		<area style='cursor:pointer' shape='poly' coords='126,45,135,49,135,60,126,64,117,60,117,49' onclick='clickColor("#3399FF",-155,117)' onmouseover='mouseOverColor("#3399FF")' alt='#3399FF' />
		<area style='cursor:pointer' shape='poly' coords='144,45,153,49,153,60,144,64,135,60,135,49' onclick='clickColor("#6699FF",-155,135)' onmouseover='mouseOverColor("#6699FF")' alt='#6699FF' />
		<area style='cursor:pointer' shape='poly' coords='162,45,171,49,171,60,162,64,153,60,153,49' onclick='clickColor("#6666FF",-155,153)' onmouseover='mouseOverColor("#6666FF")' alt='#6666FF' />
		<area style='cursor:pointer' shape='poly' coords='180,45,189,49,189,60,180,64,171,60,171,49' onclick='clickColor("#6600FF",-155,171)' onmouseover='mouseOverColor("#6600FF")' alt='#6600FF' />
		<area style='cursor:pointer' shape='poly' coords='198,45,207,49,207,60,198,64,189,60,189,49' onclick='clickColor("#6600CC",-155,189)' onmouseover='mouseOverColor("#6600CC")' alt='#6600CC' />
		<area style='cursor:pointer' shape='poly' coords='27,60,36,64,36,75,27,79,18,75,18,64' onclick='clickColor("#339933",-140,18)' onmouseover='mouseOverColor("#339933")' alt='#339933' />
		<area style='cursor:pointer' shape='poly' coords='45,60,54,64,54,75,45,79,36,75,36,64' onclick='clickColor("#00CC66",-140,36)' onmouseover='mouseOverColor("#00CC66")' alt='#00CC66' />
		<area style='cursor:pointer' shape='poly' coords='63,60,72,64,72,75,63,79,54,75,54,64' onclick='clickColor("#00FF99",-140,54)' onmouseover='mouseOverColor("#00FF99")' alt='#00FF99' />
		<area style='cursor:pointer' shape='poly' coords='81,60,90,64,90,75,81,79,72,75,72,64' onclick='clickColor("#66FFCC",-140,72)' onmouseover='mouseOverColor("#66FFCC")' alt='#66FFCC' />
		<area style='cursor:pointer' shape='poly' coords='99,60,108,64,108,75,99,79,90,75,90,64' onclick='clickColor("#66FFFF",-140,90)' onmouseover='mouseOverColor("#66FFFF")' alt='#66FFFF' />
		<area style='cursor:pointer' shape='poly' coords='117,60,126,64,126,75,117,79,108,75,108,64' onclick='clickColor("#66CCFF",-140,108)' onmouseover='mouseOverColor("#66CCFF")' alt='#66CCFF' />
		<area style='cursor:pointer' shape='poly' coords='135,60,144,64,144,75,135,79,126,75,126,64' onclick='clickColor("#99CCFF",-140,126)' onmouseover='mouseOverColor("#99CCFF")' alt='#99CCFF' />
		<area style='cursor:pointer' shape='poly' coords='153,60,162,64,162,75,153,79,144,75,144,64' onclick='clickColor("#9999FF",-140,144)' onmouseover='mouseOverColor("#9999FF")' alt='#9999FF' />
		<area style='cursor:pointer' shape='poly' coords='171,60,180,64,180,75,171,79,162,75,162,64' onclick='clickColor("#9966FF",-140,162)' onmouseover='mouseOverColor("#9966FF")' alt='#9966FF' />
		<area style='cursor:pointer' shape='poly' coords='189,60,198,64,198,75,189,79,180,75,180,64' onclick='clickColor("#9933FF",-140,180)' onmouseover='mouseOverColor("#9933FF")' alt='#9933FF' />
		<area style='cursor:pointer' shape='poly' coords='207,60,216,64,216,75,207,79,198,75,198,64' onclick='clickColor("#9900FF",-140,198)' onmouseover='mouseOverColor("#9900FF")' alt='#9900FF' />
		<area style='cursor:pointer' shape='poly' coords='18,75,27,79,27,90,18,94,9,90,9,79' onclick='clickColor("#006600",-125,9)' onmouseover='mouseOverColor("#006600")' alt='#006600' />
		<area style='cursor:pointer' shape='poly' coords='36,75,45,79,45,90,36,94,27,90,27,79' onclick='clickColor("#00CC00",-125,27)' onmouseover='mouseOverColor("#00CC00")' alt='#00CC00' />
		<area style='cursor:pointer' shape='poly' coords='54,75,63,79,63,90,54,94,45,90,45,79' onclick='clickColor("#00FF00",-125,45)' onmouseover='mouseOverColor("#00FF00")' alt='#00FF00' />
		<area style='cursor:pointer' shape='poly' coords='72,75,81,79,81,90,72,94,63,90,63,79' onclick='clickColor("#66FF99",-125,63)' onmouseover='mouseOverColor("#66FF99")' alt='#66FF99' />
		<area style='cursor:pointer' shape='poly' coords='90,75,99,79,99,90,90,94,81,90,81,79' onclick='clickColor("#99FFCC",-125,81)' onmouseover='mouseOverColor("#99FFCC")' alt='#99FFCC' />
		<area style='cursor:pointer' shape='poly' coords='108,75,117,79,117,90,108,94,99,90,99,79' onclick='clickColor("#CCFFFF",-125,99)' onmouseover='mouseOverColor("#CCFFFF")' alt='#CCFFFF' />
		<area style='cursor:pointer' shape='poly' coords='126,75,135,79,135,90,126,94,117,90,117,79' onclick='clickColor("#CCCCFF",-125,117)' onmouseover='mouseOverColor("#CCCCFF")' alt='#CCCCFF' />
		<area style='cursor:pointer' shape='poly' coords='144,75,153,79,153,90,144,94,135,90,135,79' onclick='clickColor("#CC99FF",-125,135)' onmouseover='mouseOverColor("#CC99FF")' alt='#CC99FF' />
		<area style='cursor:pointer' shape='poly' coords='162,75,171,79,171,90,162,94,153,90,153,79' onclick='clickColor("#CC66FF",-125,153)' onmouseover='mouseOverColor("#CC66FF")' alt='#CC66FF' />
		<area style='cursor:pointer' shape='poly' coords='180,75,189,79,189,90,180,94,171,90,171,79' onclick='clickColor("#CC33FF",-125,171)' onmouseover='mouseOverColor("#CC33FF")' alt='#CC33FF' />
		<area style='cursor:pointer' shape='poly' coords='198,75,207,79,207,90,198,94,189,90,189,79' onclick='clickColor("#CC00FF",-125,189)' onmouseover='mouseOverColor("#CC00FF")' alt='#CC00FF' />
		<area style='cursor:pointer' shape='poly' coords='216,75,225,79,225,90,216,94,207,90,207,79' onclick='clickColor("#9900CC",-125,207)' onmouseover='mouseOverColor("#9900CC")' alt='#9900CC' />
		<area style='cursor:pointer' shape='poly' coords='9,90,18,94,18,105,9,109,0,105,0,94' onclick='clickColor("#003300",-110,0)' onmouseover='mouseOverColor("#003300")' alt='#003300' />
		<area style='cursor:pointer' shape='poly' coords='27,90,36,94,36,105,27,109,18,105,18,94' onclick='clickColor("#009933",-110,18)' onmouseover='mouseOverColor("#009933")' alt='#009933' />
		<area style='cursor:pointer' shape='poly' coords='45,90,54,94,54,105,45,109,36,105,36,94' onclick='clickColor("#33CC33",-110,36)' onmouseover='mouseOverColor("#33CC33")' alt='#33CC33' />
		<area style='cursor:pointer' shape='poly' coords='63,90,72,94,72,105,63,109,54,105,54,94' onclick='clickColor("#66FF66",-110,54)' onmouseover='mouseOverColor("#66FF66")' alt='#66FF66' />
		<area style='cursor:pointer' shape='poly' coords='81,90,90,94,90,105,81,109,72,105,72,94' onclick='clickColor("#99FF99",-110,72)' onmouseover='mouseOverColor("#99FF99")' alt='#99FF99' />
		<area style='cursor:pointer' shape='poly' coords='99,90,108,94,108,105,99,109,90,105,90,94' onclick='clickColor("#CCFFCC",-110,90)' onmouseover='mouseOverColor("#CCFFCC")' alt='#CCFFCC' />
		<area style='cursor:pointer' shape='poly' coords='117,90,126,94,126,105,117,109,108,105,108,94' onclick='clickColor("#FFFFFF",-110,108)' onmouseover='mouseOverColor("#FFFFFF")' alt='#FFFFFF' />
		<area style='cursor:pointer' shape='poly' coords='135,90,144,94,144,105,135,109,126,105,126,94' onclick='clickColor("#FFCCFF",-110,126)' onmouseover='mouseOverColor("#FFCCFF")' alt='#FFCCFF' />
		<area style='cursor:pointer' shape='poly' coords='153,90,162,94,162,105,153,109,144,105,144,94' onclick='clickColor("#FF99FF",-110,144)' onmouseover='mouseOverColor("#FF99FF")' alt='#FF99FF' />
		<area style='cursor:pointer' shape='poly' coords='171,90,180,94,180,105,171,109,162,105,162,94' onclick='clickColor("#FF66FF",-110,162)' onmouseover='mouseOverColor("#FF66FF")' alt='#FF66FF' />
		<area style='cursor:pointer' shape='poly' coords='189,90,198,94,198,105,189,109,180,105,180,94' onclick='clickColor("#FF00FF",-110,180)' onmouseover='mouseOverColor("#FF00FF")' alt='#FF00FF' />
		<area style='cursor:pointer' shape='poly' coords='207,90,216,94,216,105,207,109,198,105,198,94' onclick='clickColor("#CC00CC",-110,198)' onmouseover='mouseOverColor("#CC00CC")' alt='#CC00CC' />
		<area style='cursor:pointer' shape='poly' coords='225,90,234,94,234,105,225,109,216,105,216,94' onclick='clickColor("#660066",-110,216)' onmouseover='mouseOverColor("#660066")' alt='#660066' />
		<area style='cursor:pointer' shape='poly' coords='18,105,27,109,27,120,18,124,9,120,9,109' onclick='clickColor("#336600",-95,9)' onmouseover='mouseOverColor("#336600")' alt='#336600' />
		<area style='cursor:pointer' shape='poly' coords='36,105,45,109,45,120,36,124,27,120,27,109' onclick='clickColor("#009900",-95,27)' onmouseover='mouseOverColor("#009900")' alt='#009900' />
		<area style='cursor:pointer' shape='poly' coords='54,105,63,109,63,120,54,124,45,120,45,109' onclick='clickColor("#66FF33",-95,45)' onmouseover='mouseOverColor("#66FF33")' alt='#66FF33' />
		<area style='cursor:pointer' shape='poly' coords='72,105,81,109,81,120,72,124,63,120,63,109' onclick='clickColor("#99FF66",-95,63)' onmouseover='mouseOverColor("#99FF66")' alt='#99FF66' />
		<area style='cursor:pointer' shape='poly' coords='90,105,99,109,99,120,90,124,81,120,81,109' onclick='clickColor("#CCFF99",-95,81)' onmouseover='mouseOverColor("#CCFF99")' alt='#CCFF99' />
		<area style='cursor:pointer' shape='poly' coords='108,105,117,109,117,120,108,124,99,120,99,109' onclick='clickColor("#FFFFCC",-95,99)' onmouseover='mouseOverColor("#FFFFCC")' alt='#FFFFCC' />
		<area style='cursor:pointer' shape='poly' coords='126,105,135,109,135,120,126,124,117,120,117,109' onclick='clickColor("#FFCCCC",-95,117)' onmouseover='mouseOverColor("#FFCCCC")' alt='#FFCCCC' />
		<area style='cursor:pointer' shape='poly' coords='144,105,153,109,153,120,144,124,135,120,135,109' onclick='clickColor("#FF99CC",-95,135)' onmouseover='mouseOverColor("#FF99CC")' alt='#FF99CC' />
		<area style='cursor:pointer' shape='poly' coords='162,105,171,109,171,120,162,124,153,120,153,109' onclick='clickColor("#FF66CC",-95,153)' onmouseover='mouseOverColor("#FF66CC")' alt='#FF66CC' />
		<area style='cursor:pointer' shape='poly' coords='180,105,189,109,189,120,180,124,171,120,171,109' onclick='clickColor("#FF33CC",-95,171)' onmouseover='mouseOverColor("#FF33CC")' alt='#FF33CC' />
		<area style='cursor:pointer' shape='poly' coords='198,105,207,109,207,120,198,124,189,120,189,109' onclick='clickColor("#CC0099",-95,189)' onmouseover='mouseOverColor("#CC0099")' alt='#CC0099' />
		<area style='cursor:pointer' shape='poly' coords='216,105,225,109,225,120,216,124,207,120,207,109' onclick='clickColor("#993399",-95,207)' onmouseover='mouseOverColor("#993399")' alt='#993399' />
		<area style='cursor:pointer' shape='poly' coords='27,120,36,124,36,135,27,139,18,135,18,124' onclick='clickColor("#333300",-80,18)' onmouseover='mouseOverColor("#333300")' alt='#333300' />
		<area style='cursor:pointer' shape='poly' coords='45,120,54,124,54,135,45,139,36,135,36,124' onclick='clickColor("#669900",-80,36)' onmouseover='mouseOverColor("#669900")' alt='#669900' />
		<area style='cursor:pointer' shape='poly' coords='63,120,72,124,72,135,63,139,54,135,54,124' onclick='clickColor("#99FF33",-80,54)' onmouseover='mouseOverColor("#99FF33")' alt='#99FF33' />
		<area style='cursor:pointer' shape='poly' coords='81,120,90,124,90,135,81,139,72,135,72,124' onclick='clickColor("#CCFF66",-80,72)' onmouseover='mouseOverColor("#CCFF66")' alt='#CCFF66' />
		<area style='cursor:pointer' shape='poly' coords='99,120,108,124,108,135,99,139,90,135,90,124' onclick='clickColor("#FFFF99",-80,90)' onmouseover='mouseOverColor("#FFFF99")' alt='#FFFF99' />
		<area style='cursor:pointer' shape='poly' coords='117,120,126,124,126,135,117,139,108,135,108,124' onclick='clickColor("#FFCC99",-80,108)' onmouseover='mouseOverColor("#FFCC99")' alt='#FFCC99' />
		<area style='cursor:pointer' shape='poly' coords='135,120,144,124,144,135,135,139,126,135,126,124' onclick='clickColor("#FF9999",-80,126)' onmouseover='mouseOverColor("#FF9999")' alt='#FF9999' />
		<area style='cursor:pointer' shape='poly' coords='153,120,162,124,162,135,153,139,144,135,144,124' onclick='clickColor("#FF6699",-80,144)' onmouseover='mouseOverColor("#FF6699")' alt='#FF6699' />
		<area style='cursor:pointer' shape='poly' coords='171,120,180,124,180,135,171,139,162,135,162,124' onclick='clickColor("#FF3399",-80,162)' onmouseover='mouseOverColor("#FF3399")' alt='#FF3399' />
		<area style='cursor:pointer' shape='poly' coords='189,120,198,124,198,135,189,139,180,135,180,124' onclick='clickColor("#CC3399",-80,180)' onmouseover='mouseOverColor("#CC3399")' alt='#CC3399' />
		<area style='cursor:pointer' shape='poly' coords='207,120,216,124,216,135,207,139,198,135,198,124' onclick='clickColor("#990099",-80,198)' onmouseover='mouseOverColor("#990099")' alt='#990099' />
		<area style='cursor:pointer' shape='poly' coords='36,135,45,139,45,150,36,154,27,150,27,139' onclick='clickColor("#666633",-65,27)' onmouseover='mouseOverColor("#666633")' alt='#666633' />
		<area style='cursor:pointer' shape='poly' coords='54,135,63,139,63,150,54,154,45,150,45,139' onclick='clickColor("#99CC00",-65,45)' onmouseover='mouseOverColor("#99CC00")' alt='#99CC00' />
		<area style='cursor:pointer' shape='poly' coords='72,135,81,139,81,150,72,154,63,150,63,139' onclick='clickColor("#CCFF33",-65,63)' onmouseover='mouseOverColor("#CCFF33")' alt='#CCFF33' />
		<area style='cursor:pointer' shape='poly' coords='90,135,99,139,99,150,90,154,81,150,81,139' onclick='clickColor("#FFFF66",-65,81)' onmouseover='mouseOverColor("#FFFF66")' alt='#FFFF66' />
		<area style='cursor:pointer' shape='poly' coords='108,135,117,139,117,150,108,154,99,150,99,139' onclick='clickColor("#FFCC66",-65,99)' onmouseover='mouseOverColor("#FFCC66")' alt='#FFCC66' />
		<area style='cursor:pointer' shape='poly' coords='126,135,135,139,135,150,126,154,117,150,117,139' onclick='clickColor("#FF9966",-65,117)' onmouseover='mouseOverColor("#FF9966")' alt='#FF9966' />
		<area style='cursor:pointer' shape='poly' coords='144,135,153,139,153,150,144,154,135,150,135,139' onclick='clickColor("#FF6666",-65,135)' onmouseover='mouseOverColor("#FF6666")' alt='#FF6666' />
		<area style='cursor:pointer' shape='poly' coords='162,135,171,139,171,150,162,154,153,150,153,139' onclick='clickColor("#FF0066",-65,153)' onmouseover='mouseOverColor("#FF0066")' alt='#FF0066' />
		<area style='cursor:pointer' shape='poly' coords='180,135,189,139,189,150,180,154,171,150,171,139' onclick='clickColor("#CC6699",-65,171)' onmouseover='mouseOverColor("#CC6699")' alt='#CC6699' />
		<area style='cursor:pointer' shape='poly' coords='198,135,207,139,207,150,198,154,189,150,189,139' onclick='clickColor("#993366",-65,189)' onmouseover='mouseOverColor("#993366")' alt='#993366' />
		<area style='cursor:pointer' shape='poly' coords='45,150,54,154,54,165,45,169,36,165,36,154' onclick='clickColor("#999966",-50,36)' onmouseover='mouseOverColor("#999966")' alt='#999966' />
		<area style='cursor:pointer' shape='poly' coords='63,150,72,154,72,165,63,169,54,165,54,154' onclick='clickColor("#CCCC00",-50,54)' onmouseover='mouseOverColor("#CCCC00")' alt='#CCCC00' />
		<area style='cursor:pointer' shape='poly' coords='81,150,90,154,90,165,81,169,72,165,72,154' onclick='clickColor("#FFFF00",-50,72)' onmouseover='mouseOverColor("#FFFF00")' alt='#FFFF00' />
		<area style='cursor:pointer' shape='poly' coords='99,150,108,154,108,165,99,169,90,165,90,154' onclick='clickColor("#FFCC00",-50,90)' onmouseover='mouseOverColor("#FFCC00")' alt='#FFCC00' />
		<area style='cursor:pointer' shape='poly' coords='117,150,126,154,126,165,117,169,108,165,108,154' onclick='clickColor("#FF9933",-50,108)' onmouseover='mouseOverColor("#FF9933")' alt='#FF9933' />
		<area style='cursor:pointer' shape='poly' coords='135,150,144,154,144,165,135,169,126,165,126,154' onclick='clickColor("#FF6600",-50,126)' onmouseover='mouseOverColor("#FF6600")' alt='#FF6600' />
		<area style='cursor:pointer' shape='poly' coords='153,150,162,154,162,165,153,169,144,165,144,154' onclick='clickColor("#FF5050",-50,144)' onmouseover='mouseOverColor("#FF5050")' alt='#FF5050' />
		<area style='cursor:pointer' shape='poly' coords='171,150,180,154,180,165,171,169,162,165,162,154' onclick='clickColor("#CC0066",-50,162)' onmouseover='mouseOverColor("#CC0066")' alt='#CC0066' />
		<area style='cursor:pointer' shape='poly' coords='189,150,198,154,198,165,189,169,180,165,180,154' onclick='clickColor("#660033",-50,180)' onmouseover='mouseOverColor("#660033")' alt='#660033' />
		<area style='cursor:pointer' shape='poly' coords='54,165,63,169,63,180,54,184,45,180,45,169' onclick='clickColor("#996633",-35,45)' onmouseover='mouseOverColor("#996633")' alt='#996633' />
		<area style='cursor:pointer' shape='poly' coords='72,165,81,169,81,180,72,184,63,180,63,169' onclick='clickColor("#CC9900",-35,63)' onmouseover='mouseOverColor("#CC9900")' alt='#CC9900' />
		<area style='cursor:pointer' shape='poly' coords='90,165,99,169,99,180,90,184,81,180,81,169' onclick='clickColor("#FF9900",-35,81)' onmouseover='mouseOverColor("#FF9900")' alt='#FF9900' />
		<area style='cursor:pointer' shape='poly' coords='108,165,117,169,117,180,108,184,99,180,99,169' onclick='clickColor("#CC6600",-35,99)' onmouseover='mouseOverColor("#CC6600")' alt='#CC6600' />
		<area style='cursor:pointer' shape='poly' coords='126,165,135,169,135,180,126,184,117,180,117,169' onclick='clickColor("#FF3300",-35,117)' onmouseover='mouseOverColor("#FF3300")' alt='#FF3300' />
		<area style='cursor:pointer' shape='poly' coords='144,165,153,169,153,180,144,184,135,180,135,169' onclick='clickColor("#FF0000",-35,135)' onmouseover='mouseOverColor("#FF0000")' alt='#FF0000' />
		<area style='cursor:pointer' shape='poly' coords='162,165,171,169,171,180,162,184,153,180,153,169' onclick='clickColor("#CC0000",-35,153)' onmouseover='mouseOverColor("#CC0000")' alt='#CC0000' />
		<area style='cursor:pointer' shape='poly' coords='180,165,189,169,189,180,180,184,171,180,171,169' onclick='clickColor("#990033",-35,171)' onmouseover='mouseOverColor("#990033")' alt='#990033' />
		<area style='cursor:pointer' shape='poly' coords='63,180,72,184,72,195,63,199,54,195,54,184' onclick='clickColor("#663300",-20,54)' onmouseover='mouseOverColor("#663300")' alt='#663300' />
		<area style='cursor:pointer' shape='poly' coords='81,180,90,184,90,195,81,199,72,195,72,184' onclick='clickColor("#996600",-20,72)' onmouseover='mouseOverColor("#996600")' alt='#996600' />
		<area style='cursor:pointer' shape='poly' coords='99,180,108,184,108,195,99,199,90,195,90,184' onclick='clickColor("#CC3300",-20,90)' onmouseover='mouseOverColor("#CC3300")' alt='#CC3300' />
		<area style='cursor:pointer' shape='poly' coords='117,180,126,184,126,195,117,199,108,195,108,184' onclick='clickColor("#993300",-20,108)' onmouseover='mouseOverColor("#993300")' alt='#993300' />
		<area style='cursor:pointer' shape='poly' coords='135,180,144,184,144,195,135,199,126,195,126,184' onclick='clickColor("#990000",-20,126)' onmouseover='mouseOverColor("#990000")' alt='#990000' />
		<area style='cursor:pointer' shape='poly' coords='153,180,162,184,162,195,153,199,144,195,144,184' onclick='clickColor("#800000",-20,144)' onmouseover='mouseOverColor("#800000")' alt='#800000' />
		<area style='cursor:pointer' shape='poly' coords='171,180,180,184,180,195,171,199,162,195,162,184' onclick='clickColor("#993333",-20,162)' onmouseover='mouseOverColor("#993333")' alt='#993333' />
	 `;
	return html;
}
function colorSample(d,color){
	if (nundef(d)) return;
	mStyle(d, { bg: color, fg:idealTextColor(color) }); //, fg:idealTextColor(color) });  
	d.innerHTML = `${color}<br>${w3color(color).toHslString()}`;
}
function colorSchemeRYB(){
	let ryb=['#FE2712','#FC600A','#FB9902','#FCCC1A','#FEFE33','#B2D732','#66B032','#347C98','#0247FE','#4424D6','#8601AF','#C21460'];
	return ryb;
	console.log('w3color',w3color('deeppink'))

	for (const c of ryb){
		let cw=w3color(c);
		console.log(cw.hue,cw.sat,cw.lightness,cw.ncol);
	}
}
function downloadAsText(s, filename, ext = 'txt') {
  saveFileAtClient(
    filename + "." + ext,
    "data:application/text",
    new Blob([s], { type: "" }));
}
function downloadAsYaml(o, filename) {
  let y = jsyaml.dump(o);
  downloadAsText(y, filename, 'yaml');
}
function drawHexBoard(topside,side,dParent,styles={},itemStyles={},opts={}){
	addKeys({box:true},styles);
	let dOuter = mDom(dParent, styles, opts); 
	let d = mDom(dOuter,{position:'relative',});
	let [centers,rows,maxcols] = hexBoardCenters(topside,side);
	let [w, h] = mSizeSuccession(itemStyles,24);
	let gap=valf(opts.gap,-.5);
	let items = [];
	if (gap!=0) copyKeys({ w:w-gap, h:h-gap },itemStyles);
	for(const c of centers){
		let dhex = hexFromCenter(d, {x:c.x*w,y:c.y*h}, itemStyles);
		let item = {div:dhex,cx:c.x,cy:c.y,row:c.row,col:c.col};
		items.push(item);
	}
	let [wBoard,hBoard]=[maxcols*w,rows*h*.75+h*.25];
	mStyle(d,{w:wBoard,h:hBoard}); 
	return {div:dOuter,topside,side,centers,rows,maxcols,boardShape:'hex',w,h,wBoard,hBoard,items}
}
function findColor(colorhex) {
	let x, y;
	colormap = document.getElementById("colormap");
	areas = colormap.getElementsByTagName("area");
	for (i = 0; i < areas.length; i++) {
		areacolor = areas[i].getAttribute("onmouseover").replace('mouseOverColor("', '');
		areacolor = areacolor.replace('")', '');
		//console.log('areacolor',areacolor)
		if (areacolor.toLowerCase() == colorhex) {
			cc = areas[i].getAttribute("onclick").replace(')', '').split(",");
			y = Number(cc[1]);
			x = Number(cc[2]);
		}
	}
	return [x,y];

}
function getBeautifulColors(){
  let res = getColormapColors();
	res = res.concat(colorSchemeRYB());
  res = res.concat(levelColors.concat(modernColors.concat(Object.values(playerColors).concat(vibrantColors.concat(childrenRoomColors.concat(deepRichColors)))))).map(x=>w3color(x));
	res = res.filter(x=>x.sat*100 >= 50);
  for(const o of res) o.hex = o.toHexString();
  return res; //.map(x=>x.hex);
}
function getColormapColors(){
	let s = colormapAsStringOrig();
	let parts = s.split('clickColor("');
	let colors = [];
	for (const p of parts) { if (p.startsWith('#')) colors.push(p.substring(0, 7)); }
	return colors;
}
function hexBoardCenters(topside,side){
	if (nundef(topside)) topside = 4;
	if (nundef(side)) side=topside;
	let [rows,maxcols]=[side+side-1,topside+side-1];
	assertion(rows%2 == 1,`hex with even rows ${rows} top:${topside} side:${side}!`);
	let centers = [];
	//console.log(`top:${topside} side:${side} rows:${rows} maxcols:${maxcols}`);
	let cols=topside;
	let y=0.5;
  for (i of range(rows)) {
    let n=cols;
		let x=(maxcols-n)/2+.5;
		for(const c of range(n)) {
			centers.push({x,y,row:i+1,col:x*2}); x++;
		}
		y+=.75

    if (i < (rows - 1) / 2) cols += 1; else cols -= 1;
  }
	assertion(cols == topside-1,`END OF COLS WRONG ${cols}`)

	return [centers,rows,maxcols];
}
function hexFromCenter(dParent, center, styles = {}, opts = {}) {
	let [w, h] = mSizeSuccession(styles);
	let [left, top] = [center.x - w / 2, center.y - h / 2];
	let d = mDom(dParent, { position: 'absolute', left, top, 'clip-path': 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }, opts);
	mStyle(d, styles);
	return d;
}
function isCloseTo(n, m, acc = 10) { return Math.abs(n - m) <= acc + 1; }
function mColorPicker(dParent,handler){
	dParent = mDom(dParent); mFlex(dParent);
	async function mCPClick(item,board){
		//console.log('mColorPicker.mCPClick')
		let selitems = board.items.filter(x=>x.isSelected==true); selitems.map(x=>toggleItemSelection(x))
		toggleItemSelection(item);
		mClassRemove(iDiv(item),'hexframe');
		mStyle(iDiv(board),item.color);
		let dh=mBy('dHslTable');
		mClear(dh);
		hslTables(dh,item.color)
		//['hue','sat','light'].map(x=>hslTable(dh,x,item.color));
		if (isdef(handler)) handler(item.color); //mStyle(document.body,{bg:item.color});
	}
	async function mCPEnter(item,board){	
		//console.log('mColorPicker.mCPEnter')
		mStyle(iDiv(board),{bg:item.color});
	}
	async function mCPLeave(item,board){	
		//console.log('mColorPicker.mCPLeave')
		let selitem = board.items.find(x=>x.isSelected==true); 
		if (isdef(selitem)) mStyle(iDiv(board),{bg:selitem.color});
	}
	//let board = drawHexBoard(7, 7, dParent, { bg: rColor(), padding:10, transition:'1s' }, {w:20,h:22, classes:'hexframe'}); //, {padding:10});
	let board = drawHexBoard(7, 7, dParent, { bg: 'transparent', padding:10 }, {w:20,h:22, classes:'hexframe'}); //, {padding:10});
	let tables = mDom(dParent,{},{id:'dHslTable'});
	let colors = getColormapColors(); //console.log('colors', colors);
	let i = 0;
	for (const item of board.items) {
		let bg = colors[i++];
		item.color = bg;
		let dhex=iDiv(item);
		dhex.onmouseenter = ()=>mCPEnter(item,board);
		dhex.onmouseleave = ()=>mCPLeave(item,board);
		dhex.onclick = ()=>mCPClick(item,board); //{mStyle(document.body, {bg});} 
		mStyle(dhex, { bg });
	}
	//console.log('board', board);
	function getColor(){let item = board.items.find(x=>x.isSelected==true);return lookup(item,['color']);}
	function setColor(){let item = rChoose(board.items);mCPClick(item,board); return item;}
	return {board, getColor, setColor};
}
function mColorPickerHex(dParent,colors) {
	dParent = mDom(dParent); 

	//let board = drawHexBoard(7, 7, dParent, { bg: rColor(), padding:10, transition:'1s' }, {w:20,h:22, classes:'hexframe'}); //, {padding:10});
	let board = drawHexBoard(7, 7, dParent, { bg: 'transparent', padding: 10 }, { w: 20, h: 22 }); 
	//return board;
	board.dSample = mDom(dParent,{w:200,hmin:40,margin:'auto',align:'center'});
	//let tables = mDom(dParent, {}, { id: 'dHslTable' });
	//let colors = getColormapColors(); //console.log('colors', colors);

	let i = 0;
	for (const item of board.items) {
		let bg = colors[i++];
		item.color = bg;
		let dhex = iDiv(item);
		dhex.onmouseenter = () => onenterHex(item, board);
		dhex.onmouseleave = () => onleaveHex(item, board);
		dhex.onclick = () => onclickHex(item, board); //{mStyle(document.body, {bg});} 
		mStyle(dhex, { bg });
	}

	return board;
}
async function mGetText(path = '../base/assets/m.txt') {
  let res = await fetch(path);
  let text = await res.text();
  return text;
}
function mInsert(dParent, el, index = 0) { dParent.insertBefore(el, dParent.childNodes[index]); return el; }
function mSizeSuccession(styles = {}, szDefault = 100, fromWidth = true) {
	let [w, h] = [styles.w, styles.h];
	if (fromWidth) {
		w = valf(w, styles.sz, h, szDefault);
		h = valf(h, styles.sz, w, szDefault);
	} else {
		h = valf(h, styles.sz, w, szDefault);
		w = valf(w, styles.sz, h, szDefault);
	}
	return [w, h];
}
async function onclickColor(color){
	//console.log('YEAH!!!!!!!!!')
	mStyle(document.body,{bg:color});
}
function onclickHex(item, board) { 
	toggleItemSelectionUnique(item, board.items); 
	if (isdef(board.handler)) board.handler(item, board); 
}
function onenterHex(item, board) { 
	colorSample(board.dSample,item.color);
}
function onleaveHex(item, board) { 
	let selitem = board.items.find(x => x.isSelected == true); //console.log(selitem)
	if (nundef(selitem)) return;
	colorSample(board.dSample,selitem.color);
}
function saveFileAtClient(name, type, data) {
  if (data != null && navigator.msSaveBlob) return navigator.msSaveBlob(new Blob([data], { type: type }), name);
  let a = document.createElement('a');
  a.style.display = 'none';
  let url = window.URL.createObjectURL(new Blob([data], { type: type }));
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  simulateClick(a);
  setTimeout(function () {
    window.URL.revokeObjectURL(url);
    a.remove();
  }, 500);
}
function showPalette(dParent,colors){
  let d1=mDom(dParent,{display:'flex',dir:'column',wrap:true, gap:2, hmax:'100vh'});
  
  for(var c of colors){
    if (isDict(c)) c=c.hex;
		let html=`${c}<br>hue:${w3color(c).hue}<br>sat:${Math.round(w3color(c).sat*100)}<br>lum:${Math.round(w3color(c).lightness*100)}`
    let dmini=mDom(d1,{wmin:40,hmin:40,padding:2,bg:c,fg:idealTextColor(c)},{html});
  }

}
function showPaletteNames(dParent,colors){
  let d1=mDom(dParent);
  
  for(var c of colors){
    let bg=c.hex;
		let html=`${c.name}: ${bg} hue:${c.hue} sat:${Math.round(c.sat*100)} lum:${Math.round(c.lightness*100)}`
    let dmini=mDom(d1,{padding:2,bg,fg:idealTextColor(bg)},{html});
  }

}
function showPaletteNames(dParent,colors){
  let d1=mDom(dParent,{gap:12}); mFlexWrap(d1);
  console.log('HALLO')
  for(var c of colors){
    let bg=c.hex;
    let d2=mDom(d1,{wmin:250,bg,fg:idealTextColor(bg),padding:20});
    mDom(d2,{weight:'bold',align:'center'},{html:c.name});
    
		// let html=`<span style:'font-weight:900'>${c.name}</span><br>${bg}<br>hue:${c.hue}<br>sat:${Math.round(c.sat*100)}<br>lum:${Math.round(c.lightness*100)}`
		let html=`<br>${bg}<br>hue:${c.hue}<br>sat:${Math.round(c.sat*100)}<br>lum:${Math.round(c.lightness*100)}`
    let dmini=mDom(d2,{align:'center',wmin:120,padding:2,bg,fg:idealTextColor(bg)},{html});
  }

}
function simulateClick(elem) {
  var evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
  var canceled = !elem.dispatchEvent(evt);
}
function splitAtWhiteSpace(s){
  return s.split(/\s+/).filter(x => x.trim() !== "");
}
function sortByHues(list){
  let buckets={red:[],orange:[],yellow:[],green:[],cyan:[],blue:[],purple:[],magenta:[],pink:[],grey:[]};
  for(const c of list){
    let hue = c.hue;
    if (hue>=355 || hue <=10) buckets.red.push(c);
    if (hue>=11 && hue <=45) buckets.orange.push(c);
    if (hue>=46 && hue <=62 && c.lightness*100>=45) buckets.yellow.push(c);
    if (hue>=63 && hue <=164) buckets.green.push(c);
    if (hue>=165 && hue <=199) buckets.cyan.push(c); //180
    if (hue>=200 && hue <=245) buckets.blue.push(c);
    if (hue>=246 && hue <=277) buckets.purple.push(c);
    if (hue>=278 && hue <=305) buckets.magenta.push(c);
    if (hue>=306 && hue <=355) buckets.pink.push(c);
  }
  for(const b in buckets){
    sortByMultipleProperties(buckets[b],'lightness','hue');
  }
  return buckets;
}
function toggleItemSelectionUnique(item, items) {
	let selitems = items.filter(x => x.isSelected == true); selitems.map(x => toggleItemSelection(x))
	toggleItemSelection(item);

}




















