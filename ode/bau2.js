
function colorContrastPickFromList(color, colorlist = ['white', 'black']) {
	let contrast = 0;
	let result = null;
	let rgb = colorHexToRgbArray(colorFrom(color));
	for (c1 of colorlist) {
    let x = colorHexToRgbArray(colorFrom(c1));
		let c = colorGetContrast(rgb, x);
		if (c > contrast) { contrast = c; result = c1; }
	}
	return result;
}
function colorContrastFromElem(elem, list = ['white', 'black']) {
  let bg = mGetStyle(elem, 'bg'); 
  return colorContrastPickFromList(bg, list);
}
function colorGetContrast(rgb1, rgb2) {
	var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
	var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
	var brightest = Math.max(lum1, lum2);
	var darkest = Math.min(lum1, lum2);
	return (brightest + 0.05)
		/ (darkest + 0.05);
}
function luminance(r, g, b) {
	var a = [r, g, b].map(function (v) {
		v /= 255;
		return v <= 0.03928
			? v / 12.92
			: Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function colorIdealText(bg, grayPreferred = false, nThreshold = 105) {
  let rgb = colorHexToRgbObject(colorFrom(bg));
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;
  var bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
  var foreColor = 255 - bgDelta < nThreshold ? 'black' : 'white';
  if (grayPreferred) foreColor = 255 - bgDelta < nThreshold ? 'dimgray' : 'snow';
  return foreColor;
}
function colorsFromBFA(bg, fg, alpha) {
  if (fg == 'contrast') {
    if (bg != 'inherit') bg = colorFrom(bg, alpha);
    fg = colorIdealText(bg);
  } else if (bg == 'contrast') {
    fg = colorFrom(fg);
    bg = colorIdealText(fg);
  } else {
    if (isdef(bg) && bg != 'inherit') bg = colorFrom(bg, alpha);
    if (isdef(fg) && fg != 'inherit') fg = colorFrom(fg);
  }
  return [bg, fg];
}
function colorTrans(cAny, alpha = 0.5) { return colorFrom(cAny, alpha); }


