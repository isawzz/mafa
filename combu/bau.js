



















function generateGradientColor(startColor, endColor, steps) {
  // Create an empty array to store the gradient colors
  const gradientColors = [];

  // Iterate over the number of steps
  for (let i = 0; i < steps; i++) {
    // Calculate the step size
    const stepSize = 1 / steps;

    // Calculate the current color
    const currentColor = startColor + (endColor - startColor) * stepSize;

    // Add the current color to the gradient colors array
    gradientColors.push(currentColor);
  }

  // Return the gradient colors array
  return gradientColors;
}




function getComplementaryColor(hexColor) {
	// Remove the hash symbol if present
	hexColor = hexColor.replace(/^#/, '');

	// Convert hex to RGB
	const r = parseInt(hexColor.slice(0, 2), 16);
	const g = parseInt(hexColor.slice(2, 4), 16);
	const b = parseInt(hexColor.slice(4, 6), 16);

	// Calculate complementary color
	const compR = 255 - r;
	const compG = 255 - g;
	const compB = 255 - b;

	// Convert RGB back to hex
	const compHexColor = `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;

	return compHexColor;
}
function getSimilarColor(hexColor) {
	hexColor = hexColor.replace(/^#/, '');

	const r = parseInt(hexColor.slice(0, 2), 16);
	const g = parseInt(hexColor.slice(2, 4), 16);
	const b = parseInt(hexColor.slice(4, 6), 16);

	const hslColor = rgbToHsl(r, g, b);

	// Adjust the hue, saturation, and lightness
	const adjustedColor = hslToRgb(hslColor.h, Math.min(hslColor.s + 20, 100), Math.min(hslColor.l + 10, 100));

	const adjustedHexColor = `#${adjustedColor.r.toString(16).padStart(2, '0')}${adjustedColor.g.toString(16).padStart(2, '0')}${adjustedColor.b.toString(16).padStart(2, '0')}`;

	return adjustedHexColor;

	// Convert RGB to HSL
	function rgbToHsl(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);

		let h, s, l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // grayscale
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
	}

	// Convert HSL to RGB
	function hslToRgb(h, s, l) {
		h /= 360;
		s /= 100;
		l /= 100;

		let r, g, b;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const hue2rgb = (p, q, t) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;

			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
	}
}
function getMatchingColor(hexColor, diff) {
	// Remove the hash symbol if present
	hexColor = hexColor.replace(/^#/, '');

	// Convert hex to RGB
	const r = parseInt(hexColor.slice(0, 2), 16);
	const g = parseInt(hexColor.slice(2, 4), 16);
	const b = parseInt(hexColor.slice(4, 6), 16);

	// Convert RGB to HSL
	const hslColor = rgbToHsl(r, g, b);

	// Adjust the hue (e.g., increase by 180 degrees)
	const adjustedHue = (hslColor.h + diff) % 360;

	// Convert back to RGB
	const matchingColor = hslToRgb(adjustedHue, hslColor.s, hslColor.l);

	// Convert RGB back to hex
	const matchingHexColor = `#${matchingColor.r.toString(16).padStart(2, '0')}${matchingColor.g.toString(16).padStart(2, '0')}${matchingColor.b.toString(16).padStart(2, '0')}`;

	return matchingHexColor;

	// Convert RGB to HSL
	function rgbToHsl(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);

		let h, s, l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // grayscale
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
	}

	// Convert HSL to RGB
	function hslToRgb(h, s, l) {
		h /= 360;
		s /= 100;
		l /= 100;

		let r, g, b;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const hue2rgb = (p, q, t) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;

			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
	}

	// // Example usage:
	// const hexColor = '#3498db'; // Replace with your hex color
	// const matchingColor = getMatchingColor(hexColor);

	// console.log(`Matching color for ${hexColor} is ${matchingColor}`);

}
function ____mButtonX(dParent, handler, pos = 'tr', sz = 25, color = 'white') {
	// let d2 = mDiv(dParent, { fg: color, w: sz, h: sz, cursor: 'pointer' }, null, `<i class="fa fa-times" style="font-size:${sz}px;"></i>`, 'btnX');
	let d2 = mDom(dParent, { fg: color, w: sz, h: sz, cursor: 'pointer' });
	showImage('times', d2, { fg: color })
	mPlace(d2, pos, 2);
	d2.onclick = handler;
	return d2;
}
function mButtonX(dParent, sz = 30, id = 'dPopup') {
	mIfNotRelative(dParent);
	let bx = mDom(dParent, { position: 'absolute', top: -2, right: -5, w: sz, h: sz, cursor: 'pointer' }, { className: 'hop1' });
	bx.onclick = () => mBy(id).remove();
	let o = M.superdi.xmark;
	el = mDom(bx, { fz: sz, hline: sz, family: 'fa6', fg: 'dimgray', display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });

}
async function serverUpdate(route, o) {
	let data = await uploadJson(route, o)
	if (isdef(data.session)) Session = data.session;
	if (isdef(data.config)) Config = data.config;

}
function showWheel(list,bg) {
	mClear('dMessage');
	let dw1 = mDom('dMessage', { display: 'flex', 'flex-wrap':'wrap', gap: 5, bg: bg, matop: 5, padding: 5 });
	for (const x of list) { mDom(dw1, { w: 90, h: 50, bg: x, fg: idealTextColor(x.substring(0, 7)) }, { html: x }); }
	return dw1;
}
async function userLogin(name, color) {
	//let data = await uploadJson('save',{data:{}})
}




























































