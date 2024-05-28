function hexToRgb(hex) {
	// Remove the hash at the start if it's there
	hex = hex.replace(/^#/, '');

	// Parse the r, g, b values
	let bigint = parseInt(hex, 16);
	let r = (bigint >> 16) & 255;
	let g = (bigint >> 8) & 255;
	let b = bigint & 255;

	return { r: r, g: g, b: b };
}

// Helper function to convert RGB to HSL
function rgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;

	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max == min) {
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

	return { h: h * 360, s: s, l: l };
}

// Function to convert RGB to HWB
function rgbToHwb(r, g, b) {
	// Get the HSL values to extract the hue
	let hsl = rgbToHsl(r, g, b);
	let h = hsl.h;

	// Calculate whiteness and blackness
	let w = Math.min(r, g, b) / 255;
	let bValue = 1 - Math.max(r, g, b) / 255;

	return { h: h, w: w * 100, b: bValue * 100 };
}

// Function to convert hex to HWB
function hexToHwb(hex) {
	// Convert hex to RGB
	let rgb = hexToRgb(hex);

	// Convert RGB to HWB
	let hwb = rgbToHwb(rgb.r, rgb.g, rgb.b);

	return hwb;
}

// // Example usage
// let hexColor = "#3498db";
// let hwbColor = hexToHwb(hexColor);
// console.log(`Hex: ${hexColor} -> HWB: H(${hwbColor.h.toFixed(1)}), W(${hwbColor.w.toFixed(1)}%), B(${hwbColor.b.toFixed(1)}%)`);
