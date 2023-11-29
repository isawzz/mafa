function colorDistance(color1, color2) {
	color1 = parseColor(color1);
	color2 = parseColor(color2);
	let mean = (color1[0] + color2[0]) / 2;
	let dr = color1[0] - color2[0];
	let dg = color1[1] - color2[1];
	let db = color1[2] - color2[2];
	return Math.sqrt((((512 + mean) * dr * dr) / 256) + 4 * dg * dg + (((767 - mean) * db * db) / 256));
}
function parseColor(color) {
	let r, g, b;
	color = colorHex(color);
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
	r = parseInt(result[1], 16);
	g = parseInt(result[2], 16);
	b = parseInt(result[3], 16);
	return [r, g, b];
}
function randomRGB() {
	return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
}




























