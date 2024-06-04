

//#region findNearest von chatGPT using LAB system
function rgbToXyz([r, g, b]) {
	r = r / 255;
	g = g / 255;
	b = b / 255;

	r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
	g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
	b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;

	let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
	let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
	let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

	return [x * 100, y * 100, z * 100];
}
function xyzToLab([x, y, z]) {
	x /= 95.047;
	y /= 100.000;
	z /= 108.883;

	x = x > 0.008856 ? x ** (1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? y ** (1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? z ** (1 / 3) : (7.787 * z) + (16 / 116);

	let l = (116 * y) - 16;
	let a = 500 * (x - y);
	let b = 200 * (y - z);

	return [l, a, b];
}
function rgbToLab(rgb) {
	return xyzToLab(rgbToXyz(rgb));
}
function deltaE2000(lab1, lab2) {
	const [L1, a1, b1] = lab1;
	const [L2, a2, b2] = lab2;

	const kL = 1;
	const kC = 1;
	const kH = 1;

	const deltaLPrime = L2 - L1;
	const LBar = (L1 + L2) / 2;
	const C1 = Math.sqrt(a1 * a1 + b1 * b1);
	const C2 = Math.sqrt(a2 * a2 + b2 * b2);
	const CBar = (C1 + C2) / 2;
	const a1Prime = a1 + a1 / 2 * (1 - Math.sqrt(CBar ** 7 / (CBar ** 7 + 25 ** 7)));
	const a2Prime = a2 + a2 / 2 * (1 - Math.sqrt(CBar ** 7 / (CBar ** 7 + 25 ** 7)));
	const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
	const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);
	const CBarPrime = (C1Prime + C2Prime) / 2;
	const deltaCPrime = C2Prime - C1Prime;
	const h1Prime = Math.atan2(b1, a1Prime) * 180 / Math.PI;
	const h2Prime = Math.atan2(b2, a2Prime) * 180 / Math.PI;
	const hBarPrime = (Math.abs(h1Prime - h2Prime) > 180) ? (h1Prime + h2Prime + 360) / 2 : (h1Prime + h2Prime) / 2;
	const deltaHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin((h2Prime - h1Prime) * Math.PI / 360);
	const T = 1 - 0.17 * Math.cos((hBarPrime - 30) * Math.PI / 180) + 0.24 * Math.cos((2 * hBarPrime) * Math.PI / 180) + 0.32 * Math.cos((3 * hBarPrime + 6) * Math.PI / 180) - 0.20 * Math.cos((4 * hBarPrime - 63) * Math.PI / 180);
	const SL = 1 + ((0.015 * ((LBar - 50) ** 2)) / Math.sqrt(20 + ((LBar - 50) ** 2)));
	const SC = 1 + 0.045 * CBarPrime;
	const SH = 1 + 0.015 * CBarPrime * T;
	const RT = -2 * Math.sqrt(CBarPrime ** 7 / (CBarPrime ** 7 + 25 ** 7)) * Math.sin(60 * Math.exp(-(((hBarPrime - 275) / 25) ** 2)) * Math.PI / 180);
	const deltaE = Math.sqrt((deltaLPrime / (kL * SL)) ** 2 + (deltaCPrime / (kC * SC)) ** 2 + (deltaHPrime / (kH * SH)) ** 2 + RT * (deltaCPrime / (kC * SC)) * (deltaHPrime / (kH * SH)));

	return deltaE;
}
function findNearestNamedColor(inputColor, namedColors) {
	let inputRgb = colorHexToRgbArray(colorFrom(inputColor));
	let inputLab = rgbToLab(inputRgb);

	let minDistance = Infinity;
	let nearestColor = null;

	namedColors.forEach(namedColor => {
		let namedRgb = colorHexToRgbArray(namedColor.hex);
		let namedLab = rgbToLab(namedRgb);
		let distance = deltaE2000(inputLab, namedLab);
		if (distance < minDistance) {
			minDistance = distance;
			nearestColor = namedColor;
		}
	});

	return nearestColor;
}
function findFarestNamedColor(inputColor, namedColors) {
	let inputRgb = colorHexToRgbArray(colorFrom(inputColor));
	let inputLab = rgbToLab(inputRgb);

	let minDistance = 0;
	let nearestColor = null;

	namedColors.forEach(namedColor => {
		let namedRgb = colorHexToRgbArray(namedColor.hex);
		let namedLab = rgbToLab(namedRgb);
		let distance = deltaE2000(inputLab, namedLab);
		if (distance > minDistance) {
			minDistance = distance;
			nearestColor = namedColor;
		}
	});

	return nearestColor;
}
//#endregion

//#region todo






























