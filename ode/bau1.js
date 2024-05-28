
function colorToHwb360Object(c){

	c=colorFrom(c);
	//rgb=colorHexToRgbObject(c);
	let [r,g,blue]=colorHexToRgbArray(c);

	let [h,s,l] = colorHexToHsl01Array(c); h*=360;

	let w = 100*Math.min(r, g, blue) / 255;
	let b = 100*(1 - Math.max(r, g, blue) / 255);

	return {h,w,b};
}
function colorHueToNcol(hue){
	let x=Math.floor(hue/60);
	let pure=['red','yellow','green','cyan','blue','magenta'];
	let color=pure[x];
	let inc=(hue%60)*100/60;
	return {color,inc};
}










