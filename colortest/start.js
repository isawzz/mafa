onload = start;

function start() {
	// Replace 'baseColor' with your desired base color
	const baseColor = { r: 255, g: 0, b: 0 };
	generateColors(baseColor);
}

function generateColors(baseColor) {
	const numberOfColors = 5;
	const colorPalette = ColorGen.standerHarmonyColor(numberOfColors, 30, 30, 30, undefined, 1, 1, 0.1, 0.1);

	// Display colors on the page
	colorPalette.forEach(color => {
		const colorBox = document.createElement('div');
		colorBox.style.backgroundColor = ColorGen.toCSSString(color);
		colorBox.className = 'color-box';
		document.body.appendChild(colorBox);
	});
}

