
function colorGetBucket(c) {
	let buckets = 'red orange yellow lime green greencyan cyan cyanblue blue bluemagenta magenta magentared black'.split(' ');
	//console.log('buckets',buckets);

	c = colorFrom(c);
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
	let [r,g,b]=colorHwb360ToRgbArray(h,wPercent,bPercent); console.log(r,g,b)
	return colorRgbArgsToHex79(r,g,b);
}
function colorFromNcol(ncol,wPercent,bPercent){
	let h=colorNcolToHue(ncol);
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










