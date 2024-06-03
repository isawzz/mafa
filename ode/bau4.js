
function colorDistanceHue(color1,color2){
	let c1=colorO(color1);
	let c2=colorO(color2);
	let hueDiff = Math.abs(c1.hue-c2.hue);
	let hueDistance = Math.min(hueDiff, 360 - hueDiff) / 180; // Normalize to [0, 1]
	let num = (hueDistance*100).toFixed(2);
	return Number(num);
}
function colorDistanceHueLum(color1,color2){
	let c1=colorO(color1);
	let c2=colorO(color2);
	// console.log('color1',c1.hex,c1.hue,c1.lightness)
	// console.log('color2',c2.hex,c2.hue,c2.lightness)
	let hueDiff = Math.abs(c1.hue-c2.hue);
	let hueDistance = Math.min(hueDiff, 360 - hueDiff) / 180; // Normalize to [0, 1]
	let lightnessDistance = Math.abs(c1.lightness - c2.lightness); // Normalize to [0, 1]
	// console.log('===>',hueDistance,lightnessDistance)
	let distance = hueDistance + lightnessDistance; //koennte .5*lightnessDistance machen!
	return Number((distance*100).toFixed(2));
}
function colorDistanceHSL(color1, color2) {
	let hsl1 = hexToHSL(color1);
	let hsl2 = hexToHSL(color2);

	let hueDiff = Math.abs(hsl1.h - hsl2.h);
	let hueDistance = Math.min(hueDiff, 360 - hueDiff) / 180; // Normalize to [0, 1]

	let lightnessDistance = Math.abs(hsl1.l - hsl2.l) / 100; // Normalize to [0, 1]

	let distance = hueDistance + 0.5 * lightnessDistance;
	return distance;
}
function mPopup(dParent, styles={}, opts={}) {
  if (nundef(dParent)) dParent = document.body;
  if (isdef(mBy(opts.id))) mRemove(opts.id);
  mIfNotRelative(dParent);
  let animation = 'diamond-in-center .5s ease-in-out'; let transition = 'opacity .5s ease-in-out';
  addKeys({ animation, bg:'white', fg:'black', padding:20, rounding:12, top: 50, left: '50%', transform: 'translateX(-50%)', position:'absolute' },styles);
  let popup = mDom(dParent, styles, opts);
  mButtonX(popup); //, null, 25, 4, 'silver');
  return popup;
}
function paletteAddDistanceTo(pal,color,key,distfunc=colorGetContrast){
	let opal = isDict(pal[0])?pal:paletteToObjects(pal);
	for (let i = 0; i < pal.length; i++) {
		let o = opal[i];
		o[`dist_${key}`] = distfunc(o.hex, color);
	}
	return opal;
}
function paletteToObjects(pal){return pal.map(x=>colorO(x));}
function showColorFromHue(dParent, hue, s = 100, l = 50) {
  let c = colorHsl360ArgsToHex79(hue, s, l);
  let w3 = colorNearestNamed(c, M.colorList);
  let d1 = showObject(w3, ['name', 'hex', 'bucket', 'hue'], dParent, { bg: w3.hex,wmin:120 });
  d1.innerHTML += colorGetBucket(w3.hex);
}









