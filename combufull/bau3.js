function mimali(c,n){
	function whh(c1,c2){return generateArrayColors(colorHex(c1), colorHex(c2), 10);}
	function genc(c,hinc){	let hsl=colorHSL(c,true);return colorHSLBuild((hsl.h+hinc)%360,hsl.s*100,hsl.l*100);}
	function cinc(c,hinc,sinc,linc){let hsl=colorHSL(c,true);return colorHSLBuild((hsl.h+hinc)%360,clamp(hsl.s*100+sinc,0,100),clamp(hsl.l*100+linc,0,100));}
	function arrd(c,hinc,sinc,linc,n){let r=[];for(let i=0;i<n;i++){r.push(cinc(c,hinc*i,sinc*i,linc*i));}return r;}

	function light(c,lper=75){let hsl=colorHSL(c,true);return colorHSLBuild(hsl.h,hsl.s*100,lper);}
	function sat(c,sper=100){let hsl=colorHSL(c,true);return colorHSLBuild(sper,hsl.s*100,hsl.l*100);}
	function hue(c,hdeg){let hsl=colorHSL(c,true);return colorHSLBuild(hdeg,hsl.s*100,hsl.l*100);}

	c=light(c,75);
	//c=cinc(c,5,0,0);
	let diff=Math.round(360/n)
	wheel=arrd(c,diff,0,0,n);

	return wheel;
}
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
















