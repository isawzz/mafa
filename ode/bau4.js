

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


