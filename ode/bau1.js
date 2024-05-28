
function colorToHwb360Object(c){

	c=colorFrom(c);
	//rgb=colorHexToRgbObject(c);
	let [r,g,blue]=colorHexToRgbArray(c);

	let [h,s,l] = colorHexToHsl01Array(c); h*=360;

	let w = 100*Math.min(r, g, blue) / 255;
	let b = 100*(1 - Math.max(r, g, blue) / 255);

	return {h,w,b};
}










