
function colorSchemeRYB(){
	let ryb=['#FE2712','#FC600A','#FB9902','#FCCC1A','#FEFE33','#B2D732','#66B032','#347C98','#0247FE','#4424D6','#8601AF','#C21460'];
	return ryb;
	console.log('w3color',w3color('deeppink'))

	for (const c of ryb){
		let cw=w3color(c);
		console.log(cw.hue,cw.sat,cw.lightness,cw.ncol);
	}
}
function generateRYBColorHexagon() {
	const colors = [];
	const steps = 127;
	const huesPerStep = 360 / steps;
	
	for (let i = 0; i < steps; i++) {
			const hue = i * huesPerStep;
			const angle = hue * Math.PI / 180;
			// Generate RYB values based on the angle
			const ryb = [
					(Math.cos(angle) + 1) / 2 * 255,               // Red
					(Math.cos(angle - 2 * Math.PI / 3) + 1) / 2 * 255, // Yellow
					(Math.cos(angle + 2 * Math.PI / 3) + 1) / 2 * 255  // Blue
			];
			const rgb = rybToRgb(ryb);
			const hex = `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
			colors.push(hex);
	}
	
	return colors;
}
function rybToRgb(ryb) {
	const r = ryb[0] / 255, y = ryb[1] / 255, b = ryb[2] / 255;
	// Convert RYB directly to RGB
	const rgb = [
			1 * r + 1 * y + 0 * b, // Red
			0 * r + 1 * y + 0.5 * b, // Green
			0 * r + 0 * y + 1 * b // Blue
	];
	// Normalize the colors
	return rgb.map(c => Math.round(c * 255));
}



