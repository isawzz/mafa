//#region integrate 31.mai 24 bau4.js =>closure.js
function colorGetBucket(c) {
	let buckets = 'red orange yellow lime green greencyan cyan cyanblue blue bluemagenta magenta magentared black'.split(' ');
	//console.log('buckets',buckets);

	c = colorFrom(c);

	//if (colorIsGrey(c)) return 'black';

	let hsl = colorHexToHsl360Object(c);
	let hue = hsl.h;

	//0 30 60 ...
	//orange range 15-45
	//yellow range 45-75
	//lime range 75-105
	//green range 105-135

	//hue+15:
	//red ... 0-30
	//orange ... 30-60
	let hshift = (hue + 16) % 360;
	let ib = Math.floor(hshift / 30);
	return buckets[ib];


}
function colorFromNat(ncol, wPercent, bPercent) { 
	return colorFromNcol(ncol,wPercent,bPercent); 
}
function colorFromHwb(h,wPercent,bPercent){
	let [r,g,b]=colorHwb360ToRgbArray(h,wPercent,bPercent); //console.log(r,g,b)
	return colorRgbArgsToHex79(r,g,b);
}
function colorFromNcol(ncol,wPercent,bPercent){
	let h=colorNcolToHue(ncol); console.log('hue',h);
	return colorFromHwb(h,wPercent,bPercent);
}
function colorFromRgb(r, g, b) { return colorFrom({ r, g, b }); }
function colorFromHsl(h, s = 100, l = 50) { return colorFrom({ h, s, l }); }
function colorFromHue(h, s = 100, l = 50) { return colorFrom({ h, s, l }); }
function colorFromRgbNamed(r, g, b) { let x = colorFrom({ r, g, b }); return colorNearestNamed(x); }
function colorFromHslNamed(h, s = 100, l = 50) { let x = colorFrom({ h, s, l }); return colorNearestNamed(x); }
function colorFromHueNamed(h, s = 100, l = 50) { return colorFromHslNamed(h, s, l); }
function colorIsGrey(c, tolerance = 5) {
	let { r, g, b } = colorHexToRgbObject(colorFrom(c));
	return Math.abs(r - g) <= tolerance && Math.abs(r - b) <= tolerance && Math.abs(g - b) <= tolerance;
}

function clearFlex() {
	let dp = clearBodyDiv({ bg: 'white', hmin: '100vh', padding: 10 });
	let d = mDom(dp, { gap: 10 }); mFlexWrap(d);
	return d;
}
function showObject(o, keys, dParent, styles = {}) {
	let bg = valf(styles.bg, 'dimgray');
	addKeys({ align: 'center', wmin: 120, padding: 2, bg, fg: colorIdealText(bg) }, styles);
	let html = '';
	for (const k of keys) { html += o[k] + '<br>'; }

	let d = mDom(dParent, styles, { html });
	return d;
}
function colorToW3Ext(c){
	let hex=colorFrom(c);
	let o=w3color(hex);

	let named=colorNearestNamed(hex); 
	let distance = Math.round(colorDistance(named.hex,hex));
	console.log('distance to',named.name,distance);

	//console.log('___',hex,'\n',named);
	o.name=named.name;
	o.distance = distance;
	o.bucket=colorGetBucket(hex);
	o.hex=hex;
	return o;
}

function colorHwb360ToRgbArray(h, w, b) {
	// Convert HWB to HSL
	let [r,g,blue] = colorHsl01ArgsToRgbArray(h/360, 1, 0.5);
	
	//console.log(r,g,blue)

	// Apply whiteness and blackness
	let whiteness = w / 100;
	let blackness = b / 100;

	r = Math.round((r / 255 * (1 - whiteness - blackness) + whiteness) * 255);
	g = Math.round((g / 255 * (1 - whiteness - blackness) + whiteness) * 255);
	b = Math.round((blue / 255 * (1 - whiteness - blackness) + whiteness) * 255);

	return [r,g,b];
}
function colorToHwb360Object(c){

	c=colorFrom(c);
	//rgb=colorHexToRgbObject(c);
	let [r,g,blue]=colorHexToRgbArray(c);

	let [h,s,l] = colorHexToHsl01Array(c); h*=360;

	let w = 100*Math.min(r, g, blue) / 255;
	let b = 100*(1 - Math.max(r, g, blue) / 255);

	return {h,w,b};
}
function colorToHwb360Object(c){

	c=colorFrom(c);
	//rgb=colorHexToRgbObject(c);
	let [r,g,blue]=colorHexToRgbArray(c);

	let [h,s,l] = colorHexToHsl01Array(c); h*=360;

	let w = 100*Math.min(r, g, blue) / 255;
	let b = 100*(1 - Math.max(r, g, blue) / 255);

	return {h,w,b};
}
function colorToHwbRounded(c){ 
	let o=colorToHwb360Object(c);
	return {h:Math.round(o.h),w:Math.round(o.w),b:Math.round(o.b)};

}
function colorGetWhite(c){return colorToHwb360Object(c).w;}
function colorGetBlack(c){return colorToHwb360Object(c).b;}
function colorHueToNat(hue){
	let x=Math.floor(hue/60);
	let pure=['red','yellow','green','cyan','blue','magenta'];
	let color=pure[x];
	//let inc=hue%60; //(hue%60)*100/60;
	let inc=hue%60; //Math.floor((hue%60)*100/60);
	return color.toUpperCase()[0]+inc; // return as String, eg. G15 {color,inc};
}
function colorNatToHue(ncol){
	//let x=Math.floor(hue/60);
	let pure=['red','yellow','green','cyan','blue','magenta'].map(x=>x.toUpperCase()[0]);
	let [letter,num]=[ncol[0],Number(ncol.substring(1))];
	let idx=pure.indexOf(letter);
	let hue=idx*60+num; //Math.ceil(num*60/100);
	return hue;
}
function colorHueToNcol(hue){

	let x=Math.floor(hue/60);
	let pure=['red','yellow','green','cyan','blue','magenta'];
	let color=pure[x];
	//let inc=hue%60; //(hue%60)*100/60;
	let inc=(hue%60)/0.6; 
	//console.log('mod60',hue%60)
	//toPercent(hue%60,60); //Math.floor((hue%60)*100/60);
	return color.toUpperCase()[0]+toPercent(hue%60,60); //Math.ceil(inc); //Math.floor(inc); // return as String, eg. G15 {color,inc};
}
function colorNcolToHue(ncol){
	//let x=Math.floor(hue/60);
	let pure=['red','yellow','green','cyan','blue','magenta'].map(x=>x.toUpperCase()[0]);
	let [letter,num]=[ncol[0],Number(ncol.substring(1))];
	let idx=pure.indexOf(letter);
	let hue=idx*60+fromPercent(num,60); //Math.ceil(num*60/100);
	return hue;
}
function toPercent(n,total){return Math.round(n*100/total);}
function fromPercent(n,total){return Math.round(n*total/100);}


async function analyseColorsForUser(d, name) {
  let user = Serverdata.users[name];
  let d1 = mDom(d, { align: 'center', bg: user.color, fg: valf(user.fg, colorIdealText(user.color)) });
  mDom(d1, {}, { html: name });
  let palette = await calcPalette(d1, user.texture, user.color, user.blendMode);
}
async function calcPalette(dParent, src, color, blendMode) {
	let fill = color;
	let bgBlend = getBlendCanvas(blendMode);
	let d1 = mDom(dParent);
	let ca = await getCanvasCtx(d1, { w: 310, h: 200, fill, bgBlend }, { src });
	let palette = await getPaletteFromCanvas(ca.cv);

	palette.splice(8);
	let dominant = palette[0];

	let opal = [];
	for (let i = 0; i < palette.length; i++) {
		let c = palette[i];
		let o = w3color(c);
		o.hex = c;
		o.distbg = colorDistance(c, fill);
		o.distbg = colorDistance(c, dominant);
		opal.push(o);
	}

	palette.unshift(fill);
	showPaletteMini(d1, palette);

	let pal2 = [colorComplement(fill), colorComplement(dominant), 'white', 'silver', 'dimgray', 'black'];
	showPaletteMini(d1, pal2);

	let pal3 = [colorTurnHueBy(fill), colorTurnHueBy(dominant), colorTurnHueBy(fill, 120), colorTurnHueBy(dominant, 120), colorTurnHueBy(fill, 240), colorTurnHueBy(dominant, 240)];
	showPaletteMini(d1, pal3);

	let pal4 = [getBestContrastingColor(fill), getBestContrastingColor(dominant)];
	showPaletteMini(d1, pal4);

	let pal5 = [fill, colorTurnHueBy(fill), colorComplement(fill), getBestContrastingColor(fill), colorIdealText(fill)]
	showPaletteMini(d1, pal5);
	for (const c of pal5) {
		console.log(c, colorDistance(fill, c));
	}

	console.log(src, opal)
	//palette nachbearbeiten!
	//wenn es keine texture hat, soll es ein colorMix scheme schicken
	//console.log(src)

	return palette;

}
function getBestContrastingColor(color) {
	let [r, g, b] = colorHexToRgbArray(colorFrom(color));

	// Calculate the YIQ value
	let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

	// Return black or white based on the YIQ value
	return (yiq >= 128) ? '#000000' : '#FFFFFF';
}
function colorBlendMode(c1, c2, blendMode) {
	function colorBurn(base, blend) {
		return (blend === 0) ? 0 : Math.max(0, 255 - Math.floor((255 - base) / blend));
	}
	function blendColorBurn(baseColor, blendColor) {
		let [baseR, baseG, baseB] = colorHexToRgbArray(baseColor);
		let [blendR, blendG, blendB] = colorHexToRgbArray(blendColor);

		let resultR = colorBurn(baseR, blendR);
		let resultG = colorBurn(baseG, blendG);
		let resultB = colorBurn(baseB, blendB);

		return colorRgbArgsToHex79(resultR, resultG, resultB);
	}
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
	function difference(a, b) {
		return Math.abs(a - b);
	}
	function blendDifference(baseColor, blendColor) {
		let [baseR, baseG, baseB] = colorHexToRgbArray(baseColor);
		let [blendR, blendG, blendB] = colorHexToRgbArray(blendColor);

		let resultR = difference(baseR, blendR);
		let resultG = difference(baseG, blendG);
		let resultB = difference(baseB, blendB);

		return colorRgbArgsToHex79(resultR, resultG, resultB);
	}
	function exclusion(a, b) {
		a /= 255;
		b /= 255;
		return (a + b - 2 * a * b) * 255;
	}
	function blendExclusion(baseColor, blendColor) {
		let [baseR, baseG, baseB] = colorHexToRgbArray(baseColor);
		let [blendR, blendG, blendB] = colorHexToRgbArray(blendColor);

		let resultR = Math.round(exclusion(baseR, blendR));
		let resultG = Math.round(exclusion(baseG, blendG));
		let resultB = Math.round(exclusion(baseB, blendB));

		return colorRgbArgsToHex79(resultR, resultG, resultB);
	}
	function hardLight(a, b) {
		a /= 255;
		b /= 255;
		return (b < 0.5) ? (2 * a * b) : (1 - 2 * (1 - a) * (1 - b));
	}
	function blendHardLight(baseColor, blendColor) {
		let [baseR, baseG, baseB] = colorHexToRgbArray(baseColor);
		let [blendR, blendG, blendB] = colorHexToRgbArray(blendColor);

		let resultR = Math.round(hardLight(baseR, blendR) * 255);
		let resultG = Math.round(hardLight(baseG, blendG) * 255);
		let resultB = Math.round(hardLight(baseB, blendB) * 255);

		return colorRgbArgsToHex79(resultR, resultG, resultB);
	}
	function blendHue(baseColor, blendColor) {
		let [baseR, baseG, baseB] = colorHexToRgbArray(baseColor);
		let [blendR, blendG, blendB] = colorHexToRgbArray(blendColor);

		let [baseH, baseS, baseL] = colorRgbArgsToHsl01Array(baseR, baseG, baseB);
		let [blendH, blendS, blendL] = colorRgbArgsToHsl01Array(blendR, blendG, blendB);

		let [resultR, resultG, resultB] = colorHsl01ArgsToRgbArray(blendH, baseS, baseL);

		return colorRgbArgsToHex79(resultR, resultG, resultB);
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
		let [r, g, b] = colorHsl01ArgsToRgbArray(h1, s1, l2);
		return colorRgbArgsToHex79(r, g, b);
	}
	function blendMultiply(color1, color2) {
		let [r1, g1, b1] = colorHexToRgbArray(color1);
		let [r2, g2, b2] = colorHexToRgbArray(color2);
		let r = (r1 * r2) / 255;
		let g = (g1 * g2) / 255;
		let b = (b1 * b2) / 255;
		return colorRgbArgsToHex79(Math.round(r), Math.round(g), Math.round(b));
	}
	function blendNormal(baseColor, blendColor) {
		return blendColor;
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
		let cfinal = colorHsl01ArgsToRgbArray(h1, s2, l1);
		return colorRgbArgsToHex79(...cfinal);
	}
	function blendScreen(color1, color2) {
		let [r1, g1, b1] = colorHexToRgbArray(color1);
		let [r2, g2, b2] = colorHexToRgbArray(color2);
		let r = 255 - (((255 - r1) * (255 - r2)) / 255);
		let g = 255 - (((255 - g1) * (255 - g2)) / 255);
		let b = 255 - (((255 - b1) * (255 - b2)) / 255);
		return colorRgbArgsToHex79(r, g, b);
	}
	function softLight(a, b) {
		a /= 255;
		b /= 255;
		let result;
		if (a < 0.5) {
			result = (2 * a - 1) * (b - b * b) + b;
		} else {
			result = (2 * a - 1) * (Math.sqrt(b) - b) + b;
		}
		return Math.min(Math.max(result * 255, 0), 255);
	}
	function blendSoftLight(baseColor, blendColor) {
		let [baseR, baseG, baseB] = colorHexToRgbArray(baseColor);
		let [blendR, blendG, blendB] = colorHexToRgbArray(blendColor);

		let resultR = Math.round(softLight(baseR, blendR));
		let resultG = Math.round(softLight(baseG, blendG));
		let resultB = Math.round(softLight(baseB, blendB));

		return colorRgbArgsToHex79(resultR, resultG, resultB);
	}
	let di = {
		darken: blendDarken, lighten: blendLighten, color: blendColor, colorBurn: blendColorBurn, colorDodge: blendColorDodge,
		difference: blendDifference, exclusion: blendExclusion, hardLight: blendHardLight, hue: blendHue,
		luminosity: blendLuminosity, multiply: blendMultiply, normal: blendNormal, overlay: blendOverlay,
		saturation: blendSaturation, screen: blendScreen, softLight: blendSoftLight
	};
	if (blendMode.includes('-')) blendMode = stringCSSToCamelCase(blendMode);
	let func = di[blendMode]; if (nundef(di)) { console.log('blendMode', blendMode); return c1; }
	c1hex = colorFrom(c1);
	c2hex = colorFrom(c2);
	let res = func(c1hex, c2hex);
	return res;
}
function colorTurnHueBy(color, inc = 180) { //genau gleiches result wie bei colorComplement!!!!!
	// Convert hex to RGB
	let [r, g, b] = colorHexToRgbArray(colorFrom(color));

	// Convert RGB to HSL
	let [h, s, l] = colorRgbArgsToHsl01Array(r, g, b); h *= 360;

	// Calculate the opposite hue
	h = (h + inc) % 360;

	// Convert HSL back to RGB
	let [newR, newG, newB] = colorHsl01ArgsToRgbArray(h / 360, s, l);

	// Convert RGB back to hex
	return colorRgbArgsToHex79(newR, newG, newB);
}
function colorDistance(color1, color2) {
	let [r1, g1, b1] = colorHexToRgbArray(colorFrom(color1));
	let [r2, g2, b2] = colorHexToRgbArray(colorFrom(color2));

	let distance = Math.sqrt(
		Math.pow(r2 - r1, 2) +
		Math.pow(g2 - g1, 2) +
		Math.pow(b2 - b1, 2)
	);

	return distance;
}
function colorComplement(color) {
	// Convert hex to RGB
	let [r, g, b] = colorHexToRgbArray(colorFrom(color));

	// Calculate the complementary color
	let compR = 255 - r;
	let compG = 255 - g;
	let compB = 255 - b;

	// Convert the complementary RGB back to hex
	return colorRgbArgsToHex79(compR, compG, compB);
}
function colorNearestNamed(inputColor, namedColors) {
	if (nundef(namedColors)) namedColors = M.colorList;
	let minDistance = Infinity;
	let nearestColor = null;

	namedColors.forEach(namedColor => {
		let distance = colorDistance(inputColor, namedColor.hex);
		if (distance < minDistance) {
			minDistance = distance;
			nearestColor = namedColor;
			//console.log(nearestColor,distance);
		}
	});

	return nearestColor;
}
function colorFarestNamed(inputColor, namedColors) {
	let maxDistance = 0;
	let nearestColor = null;

	namedColors.forEach(namedColor => {
		let distance = colorDistance(inputColor, namedColor.hex);
		if (distance > maxDistance) {
			maxDistance = distance;
			nearestColor = namedColor;
			//console.log(nearestColor,distance);
		}
	});

	return nearestColor;
}
function colorGetDicolorList() {
	let di = M.dicolor;
	let list = [];
	for (const k in di) {
		let bucket = di[k];
		for (const name in bucket) {
			let o={name,bucket:k,hex:bucket[name]};
			list.push(o);
		}
	}
	return list;
}
function showColor(dParent, c) {
  let [bg, name, bucket] = isDict(c) ? [c.hex, c.name, c.bucket] : [c, c, c];
  return mDom(dParent, { align: 'center', wmin: 120, padding: 2, bg, fg: colorIdealText(bg) }, { html: name + (bg != name ? `<br>${bg}` : '') });
}
function showText(dParent, text, bg='black') {
  return mDom(dParent, { align: 'center', wmin: 120, padding: 2, bg, fg: colorIdealText(bg) }, { html: text });
}
function stringCSSToCamelCase(s) {
	let parts = s.split('-');
	let res = parts[0];
	for (let i = 1; i < parts.length; i++) { res += capitalize(parts[i]) }
	return res;
}




//#region integrate 26.mai 24 bau4.js
async function showBlendModes() {
	let d = mBy('dSettingsColor'); mClear(d);
	let dTheme = mDom(d, { padding: 10, gap: 10 }); mFlexWrap(dTheme);
	let list = arrMinus(getBlendModesCSS(), ['saturation', 'color']);
	for (const blendMode of list) { await showBlendMode(dTheme, blendMode); }
}
async function showBlendMode(dParent, blendCSS) {
	let src = U.texture;
	let fill = U.color;
	let bgBlend = getBlendCanvas(blendCSS);

	let d1 = mDom(dParent);
	let ca = await getCanvasCtx(d1, { w: 300, h: 200, fill, bgBlend }, { src });
	let palette = await getPaletteFromCanvas(ca.cv);
	palette.unshift(fill); palette.splice(8);
	showPaletteMini(d1, palette);

	d1.onclick = async () => {
		U.palette = palette;
		U.blendMode = blendCSS;
		await updateUserTheme();
	}
}
function setUserTheme() {
	setColors(U.color, U.fg);
	setTexture(U);
}
function setTexture(item) {
	let d = document.body;
	let bgImage = valf(item.bgImage, bgImageFromPath(item.texture), '');
	let bgBlend = valf(item.bgBlend, item.blendMode, '');
	d.style.backgroundColor = valf(item.color, item.bg, '');
	d.style.backgroundImage = bgImage;
	d.style.backgroundSize = bgImage.includes('marble') || bgImage.includes('wall')? '100vw 100vh' : '';
	d.style.backgroundRepeat = 'repeat'; 
	d.style.backgroundBlendMode = bgBlend;
}
async function updateUserTheme() {
	await postUserChange();
	setUserTheme(U);
}
async function onclickTexture(item) {
	U.texture = pathFromBgImage(item.bgImage);
	await updateUserTheme();
}
async function onclickThemeSample(ev) {
	let key = evToAttr(ev, 'theme');
	//console.log('key', key)
	let theme = jsCopyExceptKeys(Serverdata.config.themes[key], ['name']);
	//console.log('theme', theme);
	copyKeys(theme, U);
	await updateUserTheme(); //console.log('U',U)
}

function getBlendCanvas(bgBlend='normal'){
	const blendModeMapping = {
		'normal': 'source-over',       // Default blending mode
		'multiply': 'multiply',
		'screen': 'screen',
		'overlay': 'overlay',
		'darken': 'darken',
		'lighten': 'lighten',
		'color-dodge': 'color-dodge',
		// 'color-burn': 'color-burn',
		// 'hard-light': 'hard-light',
		// 'soft-light': 'soft-light',
		// 'difference': 'difference',
		// 'exclusion': 'exclusion',
		// 'hue': 'hue',
		'saturation': 'saturation',
		'color': 'color',
		'luminosity': 'luminosity',
		// The following CSS blend modes do not have direct canvas equivalents,
		// but can be approximated using other techniques:
		'pass-through': 'source-over' // This is a made-up value for cases where no blending is applied
	};


	return blendModeMapping[bgBlend];
}
function getBlendModesCSS(){
	return 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
}
function getBlendModesCanvas(){
	const blendModes = [
		'source-over',
		// 'source-in',
		// 'source-out',
		// 'source-atop',
		// 'destination-over',
		// 'destination-in',
		// 'destination-out',
		// 'destination-atop',
		'lighter',
		'copy',
		// 'xor',
		'multiply',
		'screen',
		'overlay',
		'darken',
		'lighten',
		'color-dodge',
		'color-burn',
		'hard-light',
		'soft-light',
		'difference',
		'exclusion',
		'hue',
		'saturation',
		'color',
		'luminosity'
	]; //these are for canvas
	return blendModes;	
}
async function getCanvasCtx(d,styles={},opts={}){
	opts.tag = 'canvas';
	let cv = mDom(d,styles,opts);
	let ctx = cv.getContext('2d');

	let fill = valf(styles.fill,styles.bg);
	if (fill) {
		ctx.fillStyle = fill;
		ctx.fillRect(0, 0, cv.width, cv.height);
	}
	let bgBlend = styles.bgBlend;
	if (bgBlend) ctx.globalCompositeOperation = bgBlend;

	let src = valf(opts.src,opts.path);
	if (src){
		let isRepeat = src.includes('ttrans');
		let imgStyle = isRepeat?{}:{w:cv.width,h:cv.height};
		let img = await imgAsync(null,imgStyle,{src});
		if (bgBlend) ctx.globalCompositeOperation = bgBlend;
		if (isRepeat) {
			const pattern = ctx.createPattern(img, 'repeat');	
			ctx.fillStyle = pattern;
			ctx.fillRect(0, 0, cv.width, cv.height);
		}else	ctx.drawImage(img, 0, 0, cv.width, cv.height);
	}
	return {cv,ctx};
}
async function getPaletteFromCanvas(canvas) {
  if (nundef(ColorThiefObject)) ColorThiefObject = new ColorThief();
  const dataUrl = canvas.toDataURL();
  const img = new Image();
  img.src = dataUrl;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const palette = ColorThiefObject.getPalette(img);
      resolve(palette?palette.map(x=>colorFrom(x)):['black','white']);
    };

    img.onerror = () => {
      reject(new Error('Failed to load the image from canvas.'));
    };
  });
}
async function getTextures(){
	M.textures = (await mGetFiles(`../assets/textures`)).map(x=>`../assets/textures/${x}`);
	return M.textures;
}
function getTextureStyle(bg,t){
  let bgRepeat = t.includes('marble_') || t.includes('wall') ? 'no-repeat' : 'repeat';
  let bgSize = t.includes('marble_') || t.includes('wall') ? `cover` : t.includes('ttrans') ? '' : 'auto';
  let bgImage = `url('${t}')`;
  let bgBlend = t.includes('ttrans') ? 'normal' : (t.includes('marble_') || t.includes('wall')) ? 'luminosity' : 'multiply';
	return { bg, bgImage, bgSize, bgRepeat, bgBlend };
}
function rBlend(){return rBlendCanvas();}
function rBlendCSS(){return rChoose(getBlendModesCSS());}
function rBlendCanvas(){	return rChoose(getBlendModesCanvas());}
function rTexture(){return rChoose(valf(M.textures,[]));}
function showPaletteMini(dParent, colors, sz=30) {
	let d1 = mDom(dParent, { display: 'flex', wrap: true, gap: 2 }); //, hmax: '100vh', dir: 'column' });
	let items = [];
	for (var c of colors) {
		if (isDict(c)) c = c.hex;
		let fg = 'dimgray'; //colorIdealText(c); if (fg == 'white') fg='silver';
		let dc = mDom(d1, { w: sz, h: sz, bg: c, fg, border:`${fg} solid 3px` });
		items.push({div:dc,bg:c})
	}
	return items;
}
function showPaletteText(dParent, list) {
	let d1 = mDom(dParent, { display: 'flex', wrap: true, gap: 2 }); //, hmax: '100vh', dir: 'column' });
	let items = [];
	for (var c of list) {
		let dc = mDom(d1, {bg:'black',fg:'white'},{html:c});
		items.push({div:dc,text:c})
	}
	return items;
}
function pathFromBgImage(bgImage) { return bgImage.substring(5, bgImage.length - 2); }
function bgImageFromPath(path) { return isdef(path)?`url('${path}')`:null; }
async function showTextures() {
	let d = mBy('dSettingsColor'); mClear(d);
	let dTheme = mDom(d, { padding: 12, gap: 10 }); mFlexWrap(dTheme);
	let list = M.textures;
	if (colorGetLum(U.color)>75) list=list.filter(x=>!x.includes('ttrans'));
	let itemsTexture = [];
	for (const t of list) {
		let bgRepeat = t.includes('marble_') || t.includes('wall') ? 'no-repeat' : 'repeat';
		let bgSize = t.includes('marble_') || t.includes('wall') ? `cover` : t.includes('ttrans') ? '' : 'auto';
		let bgImage = `url('${t}')`;
		let recommendedMode = t.includes('ttrans') ? 'normal' : (t.includes('marble_') || t.includes('wall')) ? 'luminosity' : 'multiply';
		let dc = mDom(dTheme, { bg: U.color, bgImage, bgSize, bgRepeat, bgBlend: 'normal', cursor: 'pointer', border: 'white', w: '30%', wmax: 300, h: 170 });
		let item = { div: dc, path: t, bgImage, bgRepeat, bgSize, bgBlend: recommendedMode, isSelected: false };
		itemsTexture.push(item);
		dc.onclick = async () => onclickTexture(item, itemsTexture);
	}
	return itemsTexture;
}
function arrDisjoint(ad1, ad2, prop) {
	console.log(isDict(ad1), isDict(ad2))
	if (isDict(ad1) && isDict(ad2)) return Object.keys(ad1).find(x => x in ad2);
	else return ad1.map(x => x[prop]).find(el => ad2.map(x => x[prop]) == el);
}
function getListAndDicts(list) {
	let dicts = {}, lists = [];
	for (const arg of Array.from(arguments).slice(1)) {
		//dicts[`by${arg}`]=dict2list(list,arg);
		//console.log(arg)
		lists.push(list2dict(list, arg));
	}
	return [list].concat(lists); //dicts;
}
function getListAndDictsForDicolors() {
	let bucketlist = 'black yellow orangeyellow orange orangered red magentapink magenta bluemagenta blue cyanblue cyan greencyan green yellowgreen'.split(' ');
	bucketlist = arrCycle(bucketlist, 8);
	let dicolorlist = [];
	for (const bucket of bucketlist) {
		let list = dict2list(M.dicolor[bucket]);
		for (const c of list) {
			let o = w3color(c.value);
			o.name = c.id;
			o.hex = c.value;
			o.bucket = bucket;
			dicolorlist.push(o);
		}
	}

	let byhex = list2dict(dicolorlist, 'hex');
	let byname = list2dict(dicolorlist, 'name');
	return [dicolorlist, byhex, byname];
}
function getMyColors1() {
	const colors = [
		{ hex: '#336699', name: 'Dark Slate Blue', bucket: 'blue' },
		{ hex: '#3366cc', name: 'Royal Blue', bucket: 'blue' },
		{ hex: '#000099', name: 'Dark Blue', bucket: 'blue' },
		{ hex: '#0000cc', name: 'Medium Blue', bucket: 'blue' },
		{ hex: '#000066', name: 'Navy Blue', bucket: 'blue' },
		{ hex: '#006666', name: 'Medium Teal', bucket: 'cyanblue' },
		{ hex: '#006699', name: 'Sea Bluegreen', bucket: 'cyanblue' },
		{ hex: '#0099cc', name: 'Deep Sky Blue', bucket: 'cyanblue' },
		{ hex: '#0066cc', name: 'Dodger Blue', bucket: 'cyanblue' },
		{ hex: '#0033cc', name: 'Bright Blue', bucket: 'blue' },
		{ hex: '#3333ff', name: 'Electric Blue', bucket: 'blue' },
		{ hex: '#009999', name: 'Strong Cyan', bucket: 'cyan' },
		{ hex: '#33cccc', name: 'Sea Sky', bucket: 'cyan' },
		{ hex: '#0099ff', name: 'Spring Sky', bucket: 'cyanblue' },
		{ hex: '#0066ff', name: 'Brilliant Blue', bucket: 'cyanblue' },
		{ hex: '#3366ff', name: 'Summer Sky', bucket: 'blue' },
		{ hex: '#3333cc', name: 'Indigo Sky', bucket: 'blue' },
		{ hex: '#339966', name: 'Sea Green', bucket: 'greencyan' },
		{ hex: '#00ffcc', name: 'Aquagreen', bucket: 'cyan' },
		{ hex: '#33ccff', name: 'Light Sky Blue', bucket: 'cyanblue' },
		{ hex: '#6699ff', name: 'Light Royal Blue', bucket: 'blue' },
		{ hex: '#6600ff', name: 'Vivid Violet', bucket: 'bluemagenta' },
		{ hex: '#6600cc', name: 'Deep Purple', bucket: 'bluemagenta' },
		{ hex: '#339933', name: 'Forest Green', bucket: 'green' },
		{ hex: '#00cc66', name: 'Medium Spring Green', bucket: 'greencyan' },
		{ hex: '#00ff99', name: 'Spring Green', bucket: 'greencyan' },
		{ hex: '#66ffcc', name: 'Light Aqua', bucket: 'cyan' },
		{ hex: '#66ffff', name: 'bleach', bucket: 'cyan' },
		{ hex: '#66ccff', name: 'Light Azure', bucket: 'cyanblue' },
		{ hex: '#99ccff', name: 'Pale Sky Blue', bucket: 'cyanblue' },
		{ hex: '#9999ff', name: 'Pale Lilac', bucket: 'bluemagenta' },
		{ hex: '#9966ff', name: 'Medium Violet', bucket: 'bluemagenta' },
		{ hex: '#9933ff', name: 'Electric Lilac', bucket: 'bluemagenta' },
		{ hex: '#9900ff', name: 'Bright Violet', bucket: 'bluemagenta' },
		{ hex: '#00cc00', name: 'Lime Green', bucket: 'green' },
		{ hex: '#66ff99', name: 'Spearmint', bucket: 'greencyan' },
		{ hex: '#99ffcc', name: 'Pale Mint', bucket: 'greencyan' },
		{ hex: '#ccffff', name: 'Very Pale Cyan', bucket: 'cyan' },
		{ hex: '#cc66ff', name: 'Medium Orchid', bucket: 'magenta' },
		{ hex: '#cc33ff', name: 'Bright Orchid', bucket: 'magenta' },
		{ hex: '#9900cc', name: 'Dark Violet', bucket: 'bluemagenta' },
		{ hex: '#003300', name: 'Dark Green', bucket: 'green' },
		{ hex: '#009933', name: 'Jungle Green', bucket: 'green' },
		{ hex: '#33cc33', name: 'Light Green', bucket: 'green' },
		{ hex: '#99ff99', name: 'Pale Green', bucket: 'green' },
		{ hex: '#ccffcc', name: 'Very Pale Green', bucket: 'green' },
		{ hex: '#ffccff', name: 'Rosa', bucket: 'magenta' },
		{ hex: '#ffcccc', name: 'Pale Pink', bucket: 'magenta' },
		{ hex: '#ff99ff', name: 'Light Pink', bucket: 'magenta' },
		{ hex: '#ff66ff', name: 'Magentapink', bucket: 'magenta' },
		{ hex: '#660066', name: 'Purple', bucket: 'magenta' },
		{ hex: '#336600', name: 'Young Olive', bucket: 'green' },
		{ hex: '#009900', name: 'Strong Green', bucket: 'green' },
		{ hex: '#66ff33', name: 'Spring Leaf', bucket: 'yellowgreen' },
		{ hex: '#99ff66', name: 'Light Lime', bucket: 'yellowgreen' },
		{ hex: '#ccff99', name: 'Very Light Green', bucket: 'yellowgreen' },
		{ hex: '#cc0099', name: 'Strong Magenta', bucket: 'magenta' },
		{ hex: '#993399', name: 'Dark Magenta', bucket: 'magenta' },
		{ hex: '#333300', name: 'Very Dark Olive', bucket: 'green' },
		{ hex: '#669900', name: 'Olive Drab', bucket: 'yellowgreen' },
		{ hex: '#99ff33', name: 'Light Chartreuse', bucket: 'yellowgreen' },
		{ hex: '#ccff66', name: 'Pale Yellow Green', bucket: 'yellowgreen' },
		{ hex: '#ff6699', name: 'Light Red Violet', bucket: 'magenta' },
		{ hex: '#ff3399', name: 'Deep Pink', bucket: 'magenta' },
		{ hex: '#cc3399', name: 'Medium Red Violet', bucket: 'magenta' },
		{ hex: '#990099', name: 'Dark Red Violet', bucket: 'magenta' },
		{ hex: '#99cc00', name: 'Lime', bucket: 'yellowgreen' },
		{ hex: '#ccff33', name: 'Light Lime Green', bucket: 'yellowgreen' },
		{ hex: '#ffcc66', name: 'Light Orange', bucket: 'orangeyellow' },
		{ hex: '#ff6666', name: 'Dark Salmon', bucket: 'red' },
		{ hex: '#ff0066', name: 'Hot Pink', bucket: 'magenta' },
		{ hex: '#cc6699', name: 'Medium Pink', bucket: 'magenta' },
		{ hex: '#993366', name: 'Dark Mauve', bucket: 'magenta' },
		{ hex: '#ff5050', name: 'Strawberry', bucket: 'red' },
		{ hex: '#cc0066', name: 'Vivid Raspberry', bucket: 'magenta' },
		{ hex: '#660033', name: 'Dark Red', bucket: 'red' },
		{ hex: '#996633', name: 'Medium Brown', bucket: 'orange' },
		{ hex: '#cc6600', name: 'Orange Brown', bucket: 'orange' },
		{ hex: '#ff3300', name: 'Red Orange', bucket: 'orangered' },
		{ hex: '#cc0000', name: 'Jolly Red', bucket: 'red' },
		{ hex: '#990033', name: 'Dark Crimson', bucket: 'red' },
		{ hex: '#663300', name: 'Darkbrown', bucket: 'orange' },
		{ hex: '#cc3300', name: 'Carrot', bucket: 'orangered' },
		{ hex: '#993333', name: 'Indian Red', bucket: 'red' },
		{ hex: '#fc600a', name: 'Tangerine', bucket: 'orange' },
		{ hex: '#fccc1a', name: 'Bright Yellow', bucket: 'yellow' },
		{ hex: '#b2d732', name: 'Lime Green', bucket: 'yellowgreen' },
		{ hex: '#4424d6', name: 'Violetblue', bucket: 'bluemagenta' },
		{ hex: '#c21460', name: 'Raspberry', bucket: 'magenta' },
		{ hex: '#afff45', name: 'Apple Green', bucket: 'yellowgreen' },
		{ hex: '#42d4f4', name: 'Sky Blue', bucket: 'cyanblue' },
		{ hex: '#ffe119', name: 'Sunshine Yellow', bucket: 'yellow' },
		{ hex: '#e6194b', name: 'Deep Raspberry', bucket: 'red' },
		{ hex: '#3cb44b', name: 'Pleasant Green', bucket: 'green' },
		{ hex: '#4363d8', name: 'Cobalt Blue', bucket: 'blue' },
		{ hex: '#911eb4', name: 'Violet', bucket: 'bluemagenta' },
		{ hex: '#fff620', name: 'Buttercup Yellow', bucket: 'yellow' },
		{ hex: '#f58231', name: 'Orange', bucket: 'orange' },
		{ hex: '#ffd8b1', name: 'Peach', bucket: 'orangeyellow' },
		{ hex: '#000075', name: 'Deep Blue', bucket: 'blue' },
		{ hex: '#ff6f61', name: 'Watermelon', bucket: 'orangered' },
		{ hex: '#c68e17', name: 'Caramel', bucket: 'yellow' },
		{ hex: '#f7cac9', name: 'Light Pink', bucket: 'magenta' },
		{ hex: '#009b77', name: 'Seaglass', bucket: 'cyan' },
		{ hex: '#dd4124', name: 'Rust Red', bucket: 'orangered' },
		{ hex: '#d65076', name: 'Blush', bucket: 'magenta' },
		{ hex: '#efc050', name: 'Goldenrod', bucket: 'orangeyellow' },
		{ hex: '#9b2335', name: 'Carmine', bucket: 'red' },
		{ hex: '#e15d44', name: 'Terracotta', bucket: 'orangered' },
		{ hex: '#bc243c', name: 'Red', bucket: 'red' },
		{ hex: '#c3447a', name: 'Berry Pink', bucket: 'magenta' },
		{ hex: '#ffd662', name: 'Banana', bucket: 'orangeyellow' },
		{ hex: '#f4b9b8', name: 'Pale Blush', bucket: 'magenta' },
		{ hex: '#ff968a', name: 'Light Coral', bucket: 'orangered' },
		{ hex: '#83781b', name: 'Olive', bucket: 'yellowgreen' },
		{ hex: '#d01013', name: 'Scarlet', bucket: 'red' },
		{ hex: '#58a813', name: 'Lawn Green', bucket: 'yellowgreen' },
		{ hex: '#fad302', name: 'Golden Yellow', bucket: 'yellow' },
		{ hex: '#55038c', name: 'Deep Violet', bucket: 'bluemagenta' },
		{ hex: '#ed527a', name: 'Raspberry Pink', bucket: 'magenta' },
		{ hex: '#d99559', name: 'Sand', bucket: 'orange' },
		{ hex: '#049dd9', name: 'Ocean Blue', bucket: 'cyanblue' },
		{ hex: '#ff4057', name: 'Salmon Pink', bucket: 'orangered' },
		{ hex: '#00b8a9', name: 'Sea Green', bucket: 'greencyan' },
		{ hex: '#f46036', name: 'Orange Red', bucket: 'orangered' },
		{ hex: '#e71d36', name: 'Crimson Red', bucket: 'red' },
		{ hex: '#2ec4b6', name: 'Aqua', bucket: 'cyan' },
		{ hex: '#ffd166', name: 'Apricot', bucket: 'orangeyellow' },
		{ hex: '#06d6a0', name: 'Medium Spring Green', bucket: 'greencyan' },
		{ hex: '#ef476f', name: 'Pale Red', bucket: 'orangered' },
		{ hex: '#26547c', name: 'Winter Blue', bucket: 'blue' },
		{ hex: '#ff9f1c', name: 'Vivid Orange', bucket: 'orange' },
		{ hex: '#00bbf9', name: 'Bright Sky Blue', bucket: 'cyanblue' },
		{ hex: '#118ab2', name: 'Blue Green', bucket: 'cyanblue' },
		{ hex: '#073b4c', name: 'Dark Teal', bucket: 'cyanblue' },
		{ hex: '#ffd32d', name: 'Bright Yellow', bucket: 'yellow' },
		{ hex: '#8338ec', name: 'Bright Purple', bucket: 'bluemagenta' },
		{ hex: '#fb5607', name: 'Bright Orange Red', bucket: 'orangered' },
		{ hex: '#ff006e', name: 'Hot Magenta', bucket: 'magenta' },
		{ hex: '#3a86ff', name: 'Bright Blue', bucket: 'blue' },
		{ hex: '#ffbe0b', name: 'Bright Yellow Orange', bucket: 'orangeyellow' },
		{ hex: '#ff006e', name: 'Hot Magenta', bucket: 'magenta' },
		{ hex: '#f94144', name: 'Strong Red', bucket: 'red' },
		{ hex: '#f3722c', name: 'Deep Orange', bucket: 'orangered' },
		{ hex: '#9b5de5', name: 'Bright Violet', bucket: 'bluemagenta' },
		{ hex: '#f15bb5', name: 'Light Magenta', bucket: 'magenta' },
		{ hex: '#fee440', name: 'Bright Yellow', bucket: 'yellow' },
		{ hex: '#00f5d4', name: 'Bright Aqua', bucket: 'cyan' },
		{ hex: '#7209b7', name: 'Dark Purple', bucket: 'bluemagenta' },
		{ hex: '#ff9aa2', name: 'Light Pink', bucket: 'magenta' },
		{ hex: '#ffb7b2', name: 'Light Blush', bucket: 'magenta' },
		{ hex: '#ffdac1', name: 'Peach Puff', bucket: 'orangeyellow' },
		{ hex: '#e2f0cb', name: 'Pale Green', bucket: 'yellowgreen' },
		{ hex: '#b5ead7', name: 'Mint Green', bucket: 'greencyan' },
		{ hex: '#fddb3a', name: 'Bright Yellow', bucket: 'yellow' },
		{ hex: '#f49ac2', name: 'Orchid Pink', bucket: 'magenta' },
		{ hex: '#836fff', name: 'Medium Slate Blue', bucket: 'bluemagenta' },
		{ hex: '#ffd1dc', name: 'Pale Blush Pink', bucket: 'magenta' },
		{ hex: '#a23bec', name: 'Bright Purple', bucket: 'bluemagenta' },
		{ hex: '#450920', name: 'Dark Crimson', bucket: 'red' },
		{ hex: '#004346', name: 'Dark Cyan', bucket: 'cyan' },
		{ hex: '#540b0e', name: 'Dark Maroon', bucket: 'red' },
		{ hex: '#0b132b', name: 'Dark Blue', bucket: 'blue' },
		{ hex: '#3c1874', name: 'Deep Purple', bucket: 'bluemagenta' },
		{ hex: '#08415c', name: 'Dark Cyan Blue', bucket: 'cyanblue' },
		{ hex: '#650d1b', name: 'Deep Red', bucket: 'red' },
		{ hex: '#005f73', name: 'Teal Blue', bucket: 'cyanblue' },
		{ hex: '#6622cc', name: 'Bright Violet', bucket: 'bluemagenta' },
		{ hex: '#6a040f', name: 'Dark Red', bucket: 'red' },
		{ hex: '#230c33', name: 'Dark Purple', bucket: 'bluemagenta' },
		{ hex: '#3a0ca3', name: 'Dark Violet', bucket: 'bluemagenta' },
		{ hex: '#240046', name: 'Very Dark Violet', bucket: 'bluemagenta' },
		{ hex: '#10002b', name: 'Midnight Purple', bucket: 'bluemagenta' }
	];

	let res = [];
	for (const c of colors) {
		let o = w3color(c.hex);
		o.name = transformColorName(c.name);
		o.bucket = c.bucket;
		o.hex = c.hex;
		res.push(o)
	}
	return res; //colors.map(c=>({hex:c.hex,name:transformColorName(c.name),bucket:c.bucket}));
}
function getMyColors2() {
	const colors = [
		{ hex: '#669999', name: 'Desaturated Cyan', bucket: 'cyan' },
		{ hex: '#666699', name: 'Dark Lavender', bucket: 'bluemagenta' },
		{ hex: '#ffffff', name: 'White', bucket: 'black' },
		{ hex: '#a9a9a9', name: 'Dark Gray', bucket: 'blue' },
		{ hex: '#000000', name: 'Black', bucket: 'black' },
		{ hex: '#cb99c9', name: 'Lavender Pink', bucket: 'magenta' },
		{ hex: '#aec6cf', name: 'Pastel Blue', bucket: 'cyanblue' },
		{ hex: '#dea5a4', name: 'Pastel Red', bucket: 'red' },
		{ hex: '#779ecb', name: 'Periwinkle', bucket: 'bluemagenta' },
		{ hex: '#b39eb5', name: 'Pastel Purple', bucket: 'bluemagenta' },
		{ hex: '#cfcfc4', name: 'Light Gray', bucket: 'black' },
		{ hex: '#666633', name: 'Dark Olive Green', bucket: 'yellowgreen' },
		{ hex: '#999966', name: 'Pale Olive', bucket: 'yellowgreen' },
		{ hex: '#347c98', name: 'Steel Blue', bucket: 'cyanblue' },
		{ hex: '#469990', name: 'Teal', bucket: 'cyan' },
		{ hex: '#6b5b95', name: 'Royal Purple', bucket: 'bluemagenta' },
		{ hex: '#88b04b', name: 'Lime Green', bucket: 'yellowgreen' },
		{ hex: '#92a8d1', name: 'Pale Blue', bucket: 'cyanblue' },
		{ hex: '#955251', name: 'Rosewood', bucket: 'red' },
		{ hex: '#b565a7', name: 'Orchid', bucket: 'magenta' },
		{ hex: '#45b8ac', name: 'Medium Turquoise', bucket: 'cyan' },
		{ hex: '#5b5ea6', name: 'Medium Blue', bucket: 'blue' },
		{ hex: '#dfcfbe', name: 'Beige Grey', bucket: 'yellow' },
		{ hex: '#55b4b0', name: 'Dark Turquoise', bucket: 'cyan' },
		{ hex: '#7fcdcd', name: 'Light Cyan', bucket: 'cyan' },
		{ hex: '#98b4d4', name: 'Pale Blue', bucket: 'cyanblue' },
		{ hex: '#8d9440', name: 'Olive', bucket: 'yellowgreen' },
		{ hex: '#a4b086', name: 'Sage Green', bucket: 'yellowgreen' },
		{ hex: '#774d8e', name: 'Purple', bucket: 'bluemagenta' },
		{ hex: '#6e81a0', name: 'Slate Blue', bucket: 'cyanblue' },
		{ hex: '#5a7247', name: 'Military Green', bucket: 'yellowgreen' },
		{ hex: '#d2c29d', name: 'Pale Tan', bucket: 'yellow' },
		{ hex: '#f2e2e0', name: 'Very Pale Pink', bucket: 'magenta' },
		{ hex: '#e1ede9', name: 'Very Pale Cyan', bucket: 'cyan' },
		{ hex: '#5e3d26', name: 'Dark Brown', bucket: 'orange' },
		{ hex: '#a65f46', name: 'Copper Brown', bucket: 'orange' },
		{ hex: '#48bf84', name: 'Light Emerald', bucket: 'greencyan' },
		{ hex: '#90be6d', name: 'Light Olive Green', bucket: 'yellowgreen' },
		{ hex: '#577590', name: 'Airforce Greyblue', bucket: 'blue' },
		{ hex: '#c7ceea', name: 'Lavender Blue', bucket: 'bluemagenta' },
		{ hex: '#2b2d42', name: 'Gun Grey', bucket: 'blue' },
		{ hex: '#3f3351', name: 'Dark Lavender', bucket: 'bluemagenta' },
		{ hex: '#423629', name: 'Dark Taupe', bucket: 'orange' },
		{ hex: '#283618', name: 'Dark Olive', bucket: 'yellowgreen' },
		{ hex: '#462255', name: 'Purple', bucket: 'bluemagenta' },
		{ hex: '#1b263b', name: 'Prussian Blue', bucket: 'blue' },
		{ hex: '#353535', name: 'Dark Gray', bucket: 'black' },
		{ hex: '#101820', name: 'Eerie Black', bucket: 'black' },
		{ hex: '#1a1423', name: 'Raisin Black', bucket: 'black' },
		{ hex: '#4a4e69', name: 'Independence2', bucket: 'bluemagenta' },
		{ hex: '#264653', name: 'Greengrey', bucket: 'cyanblue' }
	];
	let res = [];
	for (const c of colors) {
		let o = w3color(c.hex);
		o.name = transformColorName(c.name);
		o.bucket = c.bucket;
		o.hex = c.hex;
		res.push(o)
	}
	return res; //colors.map(c=>({hex:c.hex,name:transformColorName(c.name),bucket:c.bucket}));

}
function getNavBg() { return mGetStyle('dNav', 'bg'); }
function from01ToPercent(x) { return Math.round(Number(x) * 100); }
function fromPercentTo01(x, nDecimals = 2) { return (Number(x) / 100).toFixed(nDecimals); }
function showColorBox(c, skeys = 'name hex hue sat lum', dParent = null, styles = {}) {

	let bg = c.hex; //isdef(c.hex) ? c.hex : isdef(c.bg) ? c.bg : isdef(c.color) ? c.color : 'white';
	let fg = colorIdealText(bg);
	//console.log('bg',bg)
	let keys = toWords(skeys);

	//console.log()
	let st = jsCopy(styles)
	addKeys({ bg, fg, align: 'center' }, st);
	let textStyles = { weight: 'bold' };

	let d2 = mDom(dParent, st, { class: 'colorbox', dataColor: bg });

	mDom(d2, textStyles, { html: c[keys[0]] });

	let html = '';
	for (let i = 1; i < keys.length; i++) {
		let key = keys[i];
		let val = c[key];
		if (isNumber(val)) val = Number(val);
		if (val <= 1) val = from01ToPercent(val);
		html += `${key}:${val}<br>`;
		
	}
	// let html = `<br>${bg}<br>hue: ${c.hue}<br>sat: ${Math.round(c.sat * 100)}<br>lum: ${Math.round(c.lightness * 100)}<br>bucket: ${c.bucket}`
	let dmini = mDom(d2, {}, { html });

	let item = jsCopy(c);
	item.div = dmini;
	item.dOuter = d2;
	return item;
}
function showColorBoxes(w3extlist, skeys, dParent, styles={}) {
	let d1 = mDom(dParent, { gap: 12, padding: 12 }); mFlexWrap(d1);
	let items = [];
	for (var c of w3extlist) {
		//console.log(c.hex)
		let item = showColorBox(c, skeys, d1, styles); items.push(item);
		items.push(item);
	}
	return items;
}
async function showColors() {
	let d = mBy('dSettingsColor'); mClear(d);
	let di = M.dicolor;
	let bucketlist = 'yellow orangeyellow orange orangered red magentapink magenta bluemagenta blue cyanblue cyan greencyan green yellowgreen'.split(' ');
	bucketlist = arrCycle(bucketlist, 8);
	for (const bucket of bucketlist) {
		let list = dict2list(di[bucket]);
		let clist = [];
		for (const c of list) {
			let o = w3color(c.value);
			o.name = c.id;
			o.hex = c.value;
			clist.push(o);
		}
		let sorted = sortByFunc(clist, x => -x.lightness);
		_showPaletteNames(d, sorted);
	}
	let divs = document.getElementsByClassName('colorbox');
	for (const div of divs) {
		mStyle(div, { cursor: 'pointer' })
		div.onclick = async () => onclickColor(div.getAttribute('dataColor'));
	}
}
function sortDicolor(di){
  if (nundef(di)) di = jsCopy(M.dicolor);
  let dinew = {};
  let kbucket = Object.keys(di);
  kbucket.sort();
  for(const k of kbucket){
    let o=di[k];
    let di_bucket_new={};
    let kc = Object.keys(o);
    kc.sort(); console.log(kc);
    for(const k1 of kc){
      di_bucket_new[k1]=o[k1];
    }
    dinew[k]=di_bucket_new;
    //break;
  }

  //return;
  downloadAsYaml(dinew,'dicolor')

}
function transformColorName(s) {
	let res = replaceAll(s, ' ', '_');
	return res.toLowerCase();
}

//#endregion

//#region integrate 21.mai 24 bau3.js
//#region theme setting
async function onclickSettTheme() { await showThemes(); }
async function onclickSettAddYourTheme() {
  let name = await mGather(iDiv(UI.settAddYourTheme));
  //console.log(`should add theme for user ${getUname()} under name ${name}`);
  let o = {};
  for (const s of ['color', 'bgImage', 'bgBlend', 'fg']) {
    if (isdef(U[s])) o[s] = U[s];
  }
  o.name = name;
  let themes = lookup(Serverdata.config, ['themes']);
  let key = isdef(themes[name]) ? rUniqueId(6, 'th') : name;
  Serverdata.config.themes[key] = o;
  await mPostRoute('postConfig', Serverdata.config);
}

async function showThemes() {
  let d = mBy('dSettingsColor'); mClear(d);
  let d1 = mDom(d, { gap: 12, padding: 10 }); mFlexWrap(d1);
  let themes = lookup(Serverdata.config, ['themes']);
  let bgImage, bgSize, bgRepeat, bgBlend, name, color, fg;
  for (const key in themes) {
    let th = themes[key];
    if (isdef(th.bgImage)) {
      //find bgSize and bgRepeat for bgImage
      bgImage = th.bgImage;
      bgRepeat = (bgImage.includes('marble')||bgImage.includes('wall')) ? 'no-repeat' : 'repeat';
      bgSize = (bgImage.includes('marble')||bgImage.includes('wall')) ? 'cover' : '';
      bgBlend = isdef(th.bgBlend) ? th.bgBlend : (bgImage.includes('ttrans') ? 'normal' : bgImage.includes('marble_') ? 'luminosity' : 'multiply');
    }
    color = th.color;
    if (isdef(th.fg)) fg = th.fg;
    name = th.name;

    let [realBg,bgContrast,bgNav,fgNew,fgContrast] = calculateGoodColors(color,fg)

    let styles = {w:300,h:200,bg:realBg,fg:fgNew,border:`solid 1px ${getCSSVariable('--fgButton')}`};
    if (isdef(bgImage)) addKeys({bgImage,bgSize,bgRepeat},styles);
    if (isdef(bgBlend)) addKeys({bgBlend},styles);
    let dsample = mDom(d1,styles,{theme:key});
    let dnav = mDom(dsample,{bg:bgNav,padding:10},{html:name.toUpperCase()});
    let dmain = mDom(dsample,{padding:10,fg:'black',className:'section'},{html:getMotto()});
    dsample.onclick = onclickThemeSample;
  }
}
async function onclickThemeSample(ev){
  let key = evToAttr(ev,'theme');
  console.log('key',key)
  let theme = jsCopyExceptKeys(Serverdata.config.themes[key],['name']);
  console.log('theme',theme);

  copyKeys(theme,U);
  await postUserChange();
  setTheme();
}
function getMotto(){
  let list = [
    `Let's play!`, 'Enjoy this beautiful space!', 'First vacation day!', 'No place like home!',
    'You are free!', 'Nothing to do here!', `Don't worry, be happy!`, `Good times ahead!`,
    'Right here, right now', 'Life is a dream', 'Dream away!', 'Airport forever'
  ];
  return rChoose(list);
}
//#endregion

//#region color functions neu
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
  let di = {
    darken: blendDarken, lighten: blendLighten, color: blendColor, colorDodge: blendColorDodge, luminosity: blendLuminosity, multiply: blendMultiply, normal: blendNormal, overlay: blendOverlay,
    saturation: blendSaturation, screen: blendScreen
  };
  let func = di[blendMode]; if (nundef(di)) { console.log('blendMode', blendMode); return c1; }
  //console.log(func);
  c1hex = colorFrom(c1);
  c2hex = colorFrom(c2);
  let res = func(c1hex, c2hex);
  //console.log('blend',c1hex,c2hex,'=>',res);
  return res;
}
function colorContrastPickFromList(color, colorlist = ['white', 'black']) {
	let contrast = 0;
	let result = null;
	let rgb = colorHexToRgbArray(colorFrom(color));
	for (c1 of colorlist) {
    let x = colorHexToRgbArray(colorFrom(c1));
		let c = colorGetContrast(rgb, x);
		if (c > contrast) { contrast = c; result = c1; }
	}
	return result;
}
function colorContrastFromElem(elem, list = ['white', 'black']) {
  let bg = mGetStyle(elem, 'bg'); 
  return colorContrastPickFromList(bg, list);
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
function colorGetContrast(c1,c2) {
  function luminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
	let rgb1 = colorHexToRgbArray(colorFrom(c1));
	let rgb2 = colorHexToRgbArray(colorFrom(c2));
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
	var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
	var brightest = Math.max(lum1, lum2);
	var darkest = Math.min(lum1, lum2);
	return (brightest + 0.05)
		/ (darkest + 0.05);
}
function colorGetLum(c){ return colorGetLum01(c)*100; }
function colorGetLum01(c){
	let hex=colorFrom(c);
	let hsl=colorHexToHsl01Array(hex); //console.log('hsl',hsl);
	return hsl[2];
}
function colorGetHue(c){ return colorGetHue01(c)*360; }
function colorGetHue01(c){
	let hex=colorFrom(c);
	let hsl=colorHexToHsl01Array(hex); //console.log('hsl',hsl);
	return hsl[0];
}
function colorGetSat(c){ return colorGetSat01(c)*100; }
function colorGetSat01(c){
	let hex=colorFrom(c);
	let hsl=colorHexToHsl01Array(hex); //console.log('hsl',hsl);
	return hsl[1];
}
function colorIdealText(bg, grayPreferred = false, nThreshold = 105) {
  let rgb = colorHexToRgbObject(colorFrom(bg));
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;
  var bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
  var foreColor = 255 - bgDelta < nThreshold ? 'black' : 'white';
  if (grayPreferred) foreColor = 255 - bgDelta < nThreshold ? 'dimgray' : 'snow';
  return foreColor;
}
function colorPalette(color, type = 'shade') {  return colorShades(colorFrom(color));}
function colorPaletteFromImage(img) {
  if (nundef(ColorThiefObject)) ColorThiefObject = new ColorThief();
  return ColorThiefObject.getPalette(img).map(x=>colorFrom(x));
}
function colorPaletteFromUrl(path) {
  let img = mCreateFrom(`<img src='${path}' />`);
  let pal = colorPaletteFromImage(img);
  return pal;
}
function colorShades(color) {
  let res = [];
  for (let frac = -0.8; frac <= 0.8; frac += 0.2) {
    let c = colorCalculator(frac, color, undefined, true);
    res.push(c);
  }
  return res;
}
function colorTrans(cAny, alpha = 0.5) { return colorFrom(cAny, alpha); }

function colorTransPalette(n = 9) {
  let c = colorHex('white');
  let pal = [c];
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
//#endregion


function calculateGoodColors(bg, fg) {
	let fgIsLight = isdef(fg) ? colorIdealText(fg) == 'black' : colorIdealText(bg) == 'white';
	let bgIsDark = colorIdealText(bg) == 'white';
	if (nundef(fg)) fg = colorIdealText(bg);
	let bgNav = bg;
	fg = colorToHex79(fg);
	if (fgIsLight) {
		if (isEmpty(U.bgImage)) { bgNav = '#00000040'; }
		else if (bgIsDark) { bgNav = colorTrans(bg, .8); }
		else { bgNav = colorTrans(colorDark(bg, 50), .8); }
	} else {
		if (isEmpty(U.bgImage)) { bgNav = '#ffffff40'; }
		else if (!bgIsDark) { bgNav = colorTrans(bg, .8); }
		else { bgNav = colorTrans(colorLight(bg, 50), .8); }
	}
	let t = U.bgImage;
	let realBg = bg;
	if (bgNav == realBg) bgNav = fgIsLight ? colorDark(bgNav, .2) : colorLight(bgNav, .2);
	let bgContrast = fgIsLight ? colorDark(bgNav, .2) : colorLight(bgNav, .2);
	let fgContrast = fgIsLight ? '#ffffff80' : '#00000080'; 
	return [realBg, bgContrast, bgNav, fg, fgContrast];
}
async function gameoverScore(table) {
	table.winners = getPlayersWithMaxScore(table);
	table.status = 'over';
	table.turn = [];
	let id = table.id;
	let name = getUname();
	let step = table.step;
	let stepIfValid = step + 1;
	let o = { id, name, step, stepIfValid, table };
	let res = await mPostRoute('table', o); //console.log(res);

}
function modifyStat(name,prop,val){
	//for this to work need to provide opts.id to playerStatCount!
	let id = `stat_${name}_${prop}`;
	console.log('id',id)
	let ui=mBy(id);
	console.log('ui',ui)
	if (isdef(ui)) ui.innerHTML = val;
}
function playerStatCount(key, n, dParent, styles = {}, opts = {}) {
	let sz = valf(styles.sz, 16);
	addKeys({ display: 'flex', margin: 4, dir: 'column', hmax: 2 * sz, 'align-content': 'center', fz: sz, align: 'center' }, styles);
	let d = mDiv(dParent, styles);
	let o = M.superdi[key];
	if (isdef(o)) showImage(key, d, { h: sz, 'line-height': sz, w: '100%', fg: 'grey' }, true);
	else mText(key, d, { h: sz, fz: sz, w: '100%' });
	d.innerHTML += `<span ${isdef(opts.id)?`id='${opts.id}'`:''} style="font-weight:bold;color:inherit">${n}</span>`;
	return d;
}
function showValidMoves(table) {
	if (nundef(table.moves)) { console.log('no moves yet!'); return; }
	console.log('________', table.step)
	for (const m of table.moves) {
		console.log(`${m.step} ${m.name}: ${m.move.map(x => x.substring(0, 5)).join(',')} (${m.change})=>${m.score}`);
	}
}


function mByAttr(key, val) {
  // Build the attribute selector string
  const selector = val ? `[${key}="${val}"]` : `[${key}]`;

  // Use querySelectorAll to find matching elements
	let list = Array.from(document.querySelectorAll(selector));
	return (list.length == 1)? list[0]:list;
}
function mRadio(label, val, name, dParent, styles = {}, onchangeHandler, group_id, is_on) {
	let cursor = styles.cursor; delete styles.cursor;
	let d = mDiv(dParent, styles, group_id + '_' + val);
	let id = isdef(group_id) ? `i_${group_id}_${val}` : getUID();
	let type = isdef(group_id) ? 'radio' : 'checkbox';
	let checked = isdef(is_on) ? is_on : false;
	let inp = mCreateFrom(`<input class='radio' id='${id}' type="${type}" name="${name}" value="${val}">`);
	if (checked) inp.checked = true;
	let text = mCreateFrom(`<label for='${inp.id}'>${label}</label>`);
	if (isdef(cursor)) { inp.style.cursor = text.style.cursor = cursor; }
	mAppend(d, inp);
	mAppend(d, text);
	if (isdef(onchangeHandler)) {
		inp.onchange = ev => {
			ev.cancelBubble = true;
			if (onchangeHandler == 'toggle') {
			} else if (isdef(onchangeHandler)) {
				onchangeHandler(ev.target.checked,name,val);
			}
		};
	}
	return d;
}
function setPlayersToMulti() {
	for (const name in DA.allPlayers) {
		lookupSetOverride(DA.allPlayers, [name, 'playmode'], 'human');
		updateUserImageToBotHuman(name,'human');
	}
	setRadioValue('playmode', 'human');
}
function setPlayersToSolo() {
	for (const name in DA.allPlayers) {
		if (name == getUname()) continue;
		lookupSetOverride(DA.allPlayers, [name, 'playmode'], 'bot');
		updateUserImageToBotHuman(name,'bot');
	}
	let popup = mBy('dPlayerOptions');
	if (isdef(popup) && popup.firstChild.innerHTML.includes(getUname())) return;
	setRadioValue('playmode', 'bot');
}
async function showTable(id) {
	//INVALID TABLES KOMMEN GARNICHT HIERHER!!!
	//VALID TABLES SOLLEN NICHT UNBEDINGT DEN MOVE UNTERBRECHEN! es kann auch nur ein UI update sein!
	let me = getUname();
	let table = await mGetRoute('table', { id });	//console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game]; //showValidMoves(table);

	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2>${table.friendly} (${table.step})</h2>`; // title
	d = mDom('dMain'); mCenterFlex(d); 
	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction
	mDom(d, {}, { id: 'dStats' }); mLinebreak(d); 
	
	func.stats(table); // player stats

	let minTableSize = 400; // present
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);

	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }

	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);

	await updateTestButtonsPlayers(table); // right side buttons

	func.activate(table, items); // activate

}
function updateUserImageToBotHuman(playername,value){
	function doit(checked,name,val){
		let du=mByAttr('username',playername);
		//console.log('checked',checked,name,val,du); return;
		let img = du.getElementsByTagName('img')[0]; //du.firstChild;
		if (checked==true) if (val == 'human') mStyle(img,{round:true}); else mStyle(img,{rounding:2});
	}
	if (isdef(value)) doit(true,0,value); else return doit;
}

//#endregion

//#region integrate 18.mai 24 baui.js


//#region bau3, bau4

function isSameTableOpen(id){return T && T.id == id;}
async function onsockMerged(x) {
	if (!isSameTableOpen(x.id)) return;
	await showTable(x);
}
async function onsockTable(x) {
	let [msg, id, turn, isNew] = [x.msg, x.id, x.turn, x.isNew];
	let menu = getMenu();
	let me = getUname();
	if (turn.includes(me) && menu == 'play') {Tid = id;await switchToMainMenu('table');}
	else if (menu == 'table') await showTable(id);
	else if (menu == 'play') await showTables();
}
async function onsockTables(x) { //passiert nur bei deleteTable!
	let menu = getMenu();
	if (menu == 'play') await showTables('onsockTables');
	else if (menu == 'table') {
		assertion(isdef(T),"menu table but no table!!!")
		let id = T.id;
		let exists = x.find(t => t.id == id);
		if (nundef(exists)) {Tid=T=null; await switchToMenu(UI.nav, 'play');}
	}
}
async function onsockPending(id) { 
	if (!isSameTableOpen(id)) return;
	await showTable(id);
}
async function sendMergeTable(o, cond = 'merge') {
	if (nundef(o)) {
		let table = Cliendata.table;
		let name = getUname();
		let id = table.id;
		o = { name, id, table };
	} else if (nundef(o.name)) {
		let table = o;
		let name = getUname();
		let id = table.id;
		o = { name, id, table };
	}
	let table = await mPostRoute(`${cond}Table`, o);
	if (!isDict(table)) { console.log('from server', table); } //INVALID!!!
	else await showTable(table);
}
async function sendRaceError(table, name, errors = 1) {
	let data = {
		id: table.id,
		name,
		errors,
		olist: [
			{ keys: ['players', name, 'score'], val: table.players[name].score - errors },
			{ keys: ['players', name, 'errors'], val: valf(table.players[name].errors, 0) + errors }
		]
	}
	let res = await sendMergeTable(data, 'race');
}
async function sendRaceStepScore(table, name, score = 1, olist = []) {
	let step = table.step + 1;
	olist.push({ keys: ['step'], val: step });
	olist.push({ keys: ['players', name, 'score'], val: table.players[name].score + score });
	let data = { id: table.id, name, step, olist };
	let res = await sendMergeTable(data, 'race');
}

async function onclickTable(id) {
	Tid = id;
	await switchToMainMenu('table');
	//await showTable(id);
}
async function onclickTableMenu() {
	let id = getTid();
	if (nundef(id)){
		let me = getUname();
		let table = Serverdata.tables.find(x => x.status == 'started' && x.turn.includes(me));
		if (nundef(table)) table = Serverdata.tables.find(x => x.status == 'started' && x.playerNames.includes(me));
		if (nundef(table)) table = Serverdata.tables.find(x => x.status != 'open' && x.playerNames.includes(me));
		if (nundef(table)) table = Serverdata.tables.find(x => x.status != 'open');
		if (isdef(table)) id=table.id;
	}
  //console.log('id',id)
	if (isdef(id)) {Tid=null;await showTable(id); } else await switchToMainMenu('play');
}
async function switchToMainMenu(name) { return await switchToMenu(UI.nav, name); }

async function switchToMenu(menu, key) {
	menuCloseCurrent(menu);
	Menu = {key}; localStorage.setItem('menu',key);
	await menuOpen(menu, key);
}
async function switchToOtherUser() {
	let uname = await mGetRoute('otherUser', arguments);
	await switchToUser(uname);
}
async function switchToTables() { return await switchToMainMenu('play'); }

async function switchToUser(uname,menu) {
	if (!isEmpty(uname)) uname = normalizeString(uname);
	if (isEmpty(uname)) uname = 'guest';
	sockPostUserChange(U ? getUname() : '', uname); //das ist nur fuer die client id!
	U = await getUser(uname);
	localStorage.setItem('username', uname);
	iDiv(UI.user).innerHTML = uname;
	setTheme(U);
	menu = valf(menu,getMenu(),localStorage.getItem('menu'),'home');
  switchToMainMenu(menu);
}



//#endregion


//#region showTables NEW
async function showTables(from) {
	await updateTestButtonsLogin();
	let me = getUname();
	let tables = Serverdata.tables = await mGetRoute('tables');
	tables.map(x => x.prior = x.status == 'open' ? 0 : x.turn.includes(me) ? 1 : x.playerNames.includes(me) ? 2 : 3);
	sortBy(tables, 'prior');
	let dParent = mBy('dTableList');
	if (isdef(dParent)) { mClear(dParent); }
	else dParent = mDom('dMain', {}, { className: 'section', id: 'dTableList' });
	if (isEmpty(tables)) { mText('no active game tables', dParent); return []; }
	tables.map(x => x.game_friendly = capitalize(getGameFriendly(x.game)));
	mText(`<h2>game tables</h2>`, dParent, { maleft: 12 })
	let t = UI.tables = mDataTable(tables, dParent, null, ['friendly', 'game_friendly', 'playerNames'], 'tables', false);
	mTableCommandify(t.rowitems.filter(ri => ri.o.status != 'open'), {
		0: (item, val) => hFunc(val, 'onclickTable', item.o.id, item.id),
	});
	mTableStylify(t.rowitems.filter(ri => ri.o.status == 'open'), { 0: { fg: 'blue' }, });
	let d = iDiv(t);
	for (const ri of t.rowitems) {
		let r = iDiv(ri);
		let id = ri.o.id;
		if (ri.o.prior == 1) mDom(r, {}, { tag: 'td', html: getWaitingHtml(24) });
		if (ri.o.status == 'open') {
			let playerNames = ri.o.playerNames;
			if (playerNames.includes(me)) {
				if (ri.o.owner != me) {
					let h1 = hFunc('leave', 'onclickLeaveTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
				}
			} else {
				let h1 = hFunc('join', 'onclickJoinTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
			}
		}
		if (ri.o.owner != me) continue;
		let h = hFunc('delete', 'onclickDeleteTable', id); let c = mAppend(r, mCreate('td')); c.innerHTML = h;
		if (ri.o.status == 'open') { let h1 = hFunc('start', 'onclickStartTable', id); let c1 = mAppend(r, mCreate('td')); c1.innerHTML = h1; }
	}
}
function showGames(ms = 500) {
	let dParent = mBy('dGameList'); if (isdef(dParent)) { mClear(dParent); } else dParent = mDom('dMain', {}, { className: 'section', id: 'dGameList' });
	mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });
	let d = mDiv(dParent, { fg: 'white' }, 'game_menu'); mFlexWrap(d);
	let gamelist = 'accuse aristo bluff ferro nations spotit wise'; if (DA.TEST0) gamelist += ' a_game'; gamelist = toWords(gamelist);
	gamelist = ['button96']; //'button99','button98','button97','setgame']
	for (const gname of gamelist) {
		let g = getGameConfig(gname);
		let [sym, bg, color, id] = [M.superdi[g.logo], g.color, null, getUID()];
		let d1 = mDiv(d, { cursor: 'pointer', rounding: 10, margin: 10, padding: 0, patop: 10, w: 140, height: 100, bg: bg, position: 'relative' }, g.id);
		d1.setAttribute('gamename', gname);
		d1.onclick = onclickGameMenuItem;
		mCenterFlex(d1);
		let o = M.superdi[g.logo];
		let el = mDom(d1, { matop: 0, mabottom: 6, fz: 65, hline: 65, family: 'emoNoto', fg: 'white', display: 'inline-block' }, { html: o.text });
		mLinebreak(d1);
		mDiv(d1, { fz: 18, align: 'center' }, null, g.friendly);
	}
}

//#endregion

//#region game menu
function allPlToPlayer(name){
	let allPl = DA.allPlayers[name];
	return jsCopyExceptKeys(allPl,['div','isSelected']);
}
function collectPlayers() {
	let players = {};
	for (const name of DA.playerList) {		players[name] = allPlToPlayer(name);}
	return players;
}
function createGamePlayer(name, gamename, opts = {}) {
	let pl = userToPlayer(name, gamename);
	copyKeys(opts, pl);
	return pl;
}
function createOpenTable(gamename, players, options) {
	let me = getUname();
	let playerNames = [me];
	assertion(me in players, "_createOpenTable without owner!!!!!")
	for (const name in players) { addIf(playerNames, name); }

	let table = {
		status: 'open',
		id: generateTableId(),
		fen: null,
		game: gamename,
		owner: playerNames[0],
		friendly: generateTableName(),
		players,
		playerNames: playerNames,
		options
	};
	return table;
}
function highlightPlayerItem(item) { mStyle(iDiv(item), { bg: getUserColor(item.name), fg: 'white', border: `white` }); }

async function saveDataFromPlayerOptionsUI(gamename) {
	let id = 'dPlayerOptions';
	let lastAllPl = DA.lastAllPlayerItem;
	let dold = mBy(id);
	if (isdef(dold)) { await saveAndUpdatePlayerOptions(lastAllPl, gamename); dold.remove(); }
}
async function saveAndUpdatePlayerOptions(allPl, gamename) {
	let name = allPl.name;
	let poss = getGamePlayerOptionsAsDict(gamename);
	if (nundef(poss)) return;

	let opts = {};
	for (const p in poss) { allPl[p] = getRadioValue(p); if (p != 'playmode') opts[p] = allPl[p]; }

	let id = 'dPlayerOptions'; mRemoveIfExists(id); //dont need UI anymore

	let oldOpts = valf(getUserOptionsForGame(name, gamename), {});

	let changed = false;
	for (const p in poss) {
		if (p == 'playmode') continue;
		if (oldOpts[p] != opts[p]) { changed = true; break; }
	}

	if (changed) {
		let games = valf(Serverdata.users[name].games, {});
		games[gamename] = opts;
		await postUserChange({ name, games })
	}
}
async function setPlayerPlaying(allPlItem, gamename) {
	let [name, da] = [allPlItem.name, allPlItem.div];
	addIf(DA.playerList, name);
	highlightPlayerItem(allPlItem);

	await saveDataFromPlayerOptionsUI(gamename);

	let id = 'dPlayerOptions';
	DA.lastAllPlayerItem = allPlItem;

	let poss = getGamePlayerOptions(gamename);
	if (nundef(poss)) return;

	//console.log('item', allPlItem)

	let dParent = mBy('dGameMenu');
	let bg = getUserColor(name);
	let rounding = 6;
	let d1 = mDom(dParent, { bg: colorLight(bg, 50), border: `solid 2px ${bg}`, rounding, display: 'inline-block', hpadding: 3, rounding }, { id });
	mDom(d1, {}, { html: `${name}` }); //title
	d = mDom(d1, {}); mCenterFlex(d);
	mCenterCenter(d);
	for (const p in poss) {
		let key = p;
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let legend = formatLegend(key);
			let fs = mRadioGroup(d, {}, `d_${key}`, legend);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, false); }
			let userval = lookup(DA.allPlayers, [name, p]);
			let chi = fs.children;
			for (const ch of chi) {
				let id = ch.id;
				if (nundef(id)) continue;
				let radioval = stringAfterLast(id, '_');
				if (isNumber(radioval)) radioval = Number(radioval);
				if (userval == radioval) ch.firstChild.checked = true;
				else if (nundef(userval) && `${radioval}` == arrLast(list)) ch.firstChild.checked = true;
			}
			measureFieldset(fs);
		}
	}
	let r = getRectInt(da, mBy('dGameMenu'));
	let rp = getRectInt(d1);
	let [y, w, h] = [r.y - rp.h - 4, rp.w, rp.h];
	let x = r.x - rp.w / 2 + r.w / 2;
	if (x < 0) x = r.x - 22;
	if (x > window.innerWidth - w - 100) x = r.x - w + r.w + 14;
	mIfNotRelative(dParent);
	mPos(d1, x, y);
	mButtonX(d1, ev => saveAndUpdatePlayerOptions(allPlItem, gamename), 18, 3, 'dimgray');
}
async function showGameOptions(dParent, gamename) {
	let poss = getGameOptions(gamename);
	if (nundef(poss)) return;
	for (const p in poss) {
		let key = p;
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let legend = formatLegend(key);
			let fs = mRadioGroup(dParent, {}, `d_${key}`, legend);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
			measureFieldset(fs);
		}
	}
	let inpsolo = mBy(`i_gamemode_solo`);//console.log('HALLO',inpsolo)
	let inpmulti = mBy(`i_gamemode_multi`);
	if (isdef(inpsolo)) inpsolo.onclick = setPlayersToSolo;
	if (isdef(inpmulti)) inpmulti.onclick = setPlayersToMulti;
}
async function showGamePlayers(dParent, users) {
	let me = getUname();
	mStyle(dParent, { wrap: true });
	let userlist = ['amanda', 'felix', 'mimi'];
	for (const name in users) addIf(userlist, name);
	for (const name of userlist) {
		let d = mDom(dParent, { align: 'center', padding: 2, cursor: 'pointer', border: `transparent` });
		let img = showUserImage(name, d, 40);
		let label = mDom(d, { matop: -4, fz: 12, hline: 12 }, { html: name });
		d.setAttribute('username', name)
		d.onclick = onclickGameMenuPlayer;

		let item = userToPlayer(name, DA.gamename); item.div = d; item.isSelected = false;

		DA.allPlayers[name] = item;
	}
	await clickOnPlayer(me);
}
function userToPlayer(name, gamename, playmode = 'human') {
	//assumes Serverdata.users is up-to-date!!!
	let user = Serverdata.users[name];
	let pl = jsCopyExceptKeys(user, ['games']);
	let options = valf(getUserOptionsForGame(name, gamename), {});
	addKeys(options, pl);

	pl.playmode = playmode;

	//for all the player options in this game, if this user does not have the corresponding options,
	//copy the default value from game options	
	let poss = getGamePlayerOptions(gamename);
	//console.log('poss', poss);
	for (const p in poss) {
		if (isdef(pl[p])) continue;
		let val = poss[p];
		let defval = arrLast(val.split(','));
		if (isNumber(defval)) defval = Number(defval);
		pl[p] = defval;
		//console.log('default for',p,'is',defval);
	}
	return pl;
}


//#endregion

function amIHuman(table){  return isPlayerHuman(table,getUname());}
function calcHeightLeftUnder(div) {
  let hwin = window.innerHeight;
  let r = getRect(div);
  let top = r.b; //console.log('top',top)
  let h = hwin - top;
  return h;
}
function get_waiting_html(sz = 30) { return `<img src="../assets/icons/active_player.gif" height="${sz}" style="margin:0px ${sz / 3}px" />`; }
function isPlayerHuman(table,name){return table.players[name].playmode != 'bot';}
function mFlexLine(d,startEndCenter='center'){mStyle(d,{display: 'flex','justify-content': startEndCenter,'align-items': 'center'});}
function mSwitch(dParent,styles={},opts={}) {
  addKeys({id:'dSwitch',val:''},opts);
  let inpid=`inp${opts.id}`
  let html = `
      <label class="switch">
        <input id='${inpid}' type="checkbox" ${opts.val}>
        <span class="slider round"></span>
      </label>
    `;
  opts.html=html
  let d=mDom(dParent,styles,opts);
  return {div:d,inp:mBy(inpid)};
}
async function onchangeBotSwitch(ev) {
  let elem = ev.target;
  assertion(T,"NO TABLE!!!!!!!!!!!!!!!")
  let name=getUname();
  let id = T.id;
  let playmode = (elem.checked) ? 'bot':'human';
  let olist = [{keys: ['players', name, 'playmode'], val: playmode}];
  let res=await mPostRoute(`olist`, {id,name,olist}); console.log(res)
}
async function resetUsers() {
  for (const name in Serverdata.users) {
    let uold = Serverdata.users[name];
    let unew = {};
    let list = ['name', 'key', 'color', 'bgImage', 'bgBlend', 'bgRepeat', 'bgSize'];
    for (const s of list) unew[s] = uold[s];
    //let unew = {name,color:uold.color,key:uold.key};
    await postUserChange(unew, true);
  }
  console.log(Serverdata.users);
}
//#endregion
async function ondropSaveUrl(url) {
	console.log('save dropped url to config:', url);
	Serverdata.config = mPostRoute('postConfig', { url: url });
}
app.post('/postConfig', (req, res) => {
	console.log('<== post config')
	let newConfig = req.body;
	let oldConfig = Session.config;
	Session.config = deepMerge(oldConfig, newConfig);
	let y = yaml.dump(Session.config);
	fs.writeFileSync(configFile, y, 'utf8');
	res.json(Session.config);
});





