
function colorBlendMode(c1, c2, blendMode) {
	function blendColorDodge(baseColor, blendColor) {
		let [r1, g1, b1] = hexToRgb(baseColor);
		let [r2, g2, b2] = hexToRgb(blendColor);

		const dodge = (a, b) => (b === 255) ? 255 : Math.min(255, ((a << 8) / (255 - b)));

		let r = dodge(r1, r2);
		let g = dodge(g1, g2);
		let b = dodge(b1, b2);

		return rgbToHex(r, g, b);
	}
	function blendColor(baseColor, blendColor) {
		let [r1, g1, b1] = hexToRgb(baseColor);
		let [r2, g2, b2] = hexToRgb(blendColor);

		let [h1, s1, l1] = rgbToHsl(r1, g1, b1);
		let [h2, s2, l2] = rgbToHsl(r2, g2, b2);

		// Use the blend hue, but keep the base saturation and lightness
		let finalHsl = hslToRgb(h2, s1, l1);
		return rgbToHex(...finalHsl);
	}
	function blendDarken(baseColor, blendColor) {
		let [r1, g1, b1] = hexToRgb(baseColor);
		let [r2, g2, b2] = hexToRgb(blendColor);

		let r = Math.min(r1, r2);
		let g = Math.min(g1, g2);
		let b = Math.min(b1, b2);

		return rgbToHex(r, g, b);
	}
	function blendLighten(baseColor, blendColor) {
		let [r1, g1, b1] = hexToRgb(baseColor);
		let [r2, g2, b2] = hexToRgb(blendColor);

		let r = Math.max(r1, r2);
		let g = Math.max(g1, g2);
		let b = Math.max(b1, b2);

		return rgbToHex(r, g, b);
	}
	function blendLuminosity(baseColor, blendColor) {
		let [r1, g1, b1] = hexToRgb(baseColor);
		let [r2, g2, b2] = hexToRgb(blendColor);

		let [h1, s1, l1] = rgbToHsl(r1, g1, b1);
		let [h2, s2, l2] = rgbToHsl(r2, g2, b2);

		// Set the luminosity of the base color to the luminosity of the blend color
		let [r, g, b] = hslToRgb(h1, s1, l2);

		return rgbToHex(r, g, b);
	}
	function blendMultiply(color1, color2) {
		let [r1, g1, b1] = hexToRgb(color1);
		let [r2, g2, b2] = hexToRgb(color2);

		// Multiply each channel and divide by 255 to scale back to color space
		let r = (r1 * r2) / 255;
		let g = (g1 * g2) / 255;
		let b = (b1 * b2) / 255;

		return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
	}
	function blendNormal(baseColor, blendColor) {
		return blendColor; // The blend color simply replaces the base color
	}
	function blendOverlay(baseColor, blendColor) {
		let [r1, g1, b1] = hexToRgb(baseColor);
		let [r2, g2, b2] = hexToRgb(blendColor);

		const overlayCalculate = (a, b) => (a <= 128) ? (2 * a * b / 255) : (255 - 2 * (255 - a) * (255 - b) / 255);

		let r = overlayCalculate(r1, r2);
		let g = overlayCalculate(g1, g2);
		let b = overlayCalculate(b1, b2);

		return rgbToHex(r, g, b);
	}
	function blendSaturation(baseColor, blendColor) {
		let [r1, g1, b1] = hexToRgb(baseColor);
		let [r2, g2, b2] = hexToRgb(blendColor);

		let [h1, s1, l1] = rgbToHsl(r1, g1, b1);
		let [h2, s2, l2] = rgbToHsl(r2, g2, b2);

		// Use the base hue and lightness, blend saturation
		let finalHsl = hslToRgb(h1, s2, l1);
		return rgbToHex(...finalHsl);
	}
	function blendScreen(color1, color2) {
		let [r1, g1, b1] = hexToRgb(color1);
		let [r2, g2, b2] = hexToRgb(color2);

		// Apply the screen blend mode formula
		let r = 255 - (((255 - r1) * (255 - r2)) / 255);
		let g = 255 - (((255 - g1) * (255 - g2)) / 255);
		let b = 255 - (((255 - b1) * (255 - b2)) / 255);

		return rgbToHex(r, g, b);
	}
	function hexToRgb(hex) {
		let r = parseInt(hex.slice(1, 3), 16);
		let g = parseInt(hex.slice(3, 5), 16);
		let b = parseInt(hex.slice(5, 7), 16);
		return [r, g, b];
	}
	function hexToRgb(hex) {
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
	function hslToRgb(h, s, l) {
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
	function rgbToHex(r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }
	function rgbToHex(r, g, b) {
		r = Math.round(r).toString(16).padStart(2, '0');
		g = Math.round(g).toString(16).padStart(2, '0');
		b = Math.round(b).toString(16).padStart(2, '0');
		return `#${r}${g}${b}`;
	}
	function rgbToHsl(r, g, b) {
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

	let func = this[`blend${blendMode}`];
	console.log(func);
	c1hex = colorFrom(c1);
	c2hex = colorFrom(c2);
	return func(c1hex, c2hex);
}



















