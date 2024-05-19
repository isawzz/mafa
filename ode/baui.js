
function calculateGoodColors(bg,fg){
	let fgIsLight = isdef(fg) ? colorIdealText(fg) == 'black' : colorIdealText(bg) == 'white';
	let bgIsDark = colorIdealText(bg) == 'white';
	if (nundef(fg)) fg = colorIdealText(bg);
	let bgNav = bg;
	fg = colorToHex79(fg);
	if (fgIsLight) {
		if (isEmpty(U.bgImage)) { bgNav = '#00000040'; }
		else if (bgIsDark) { bgNav = colorTrans(bg, .8); }
		else { bgNav = colorTrans(colorDark(bg, 50), .8); }
	} else {
		if (isEmpty(U.bgImage)) { bgNav = '#ffffff40'; }
		else if (!bgIsDark) { bgNav = colorTrans(bg, .8); }
		else { bgNav = colorTrans(colorLight(bg, 50), .8); }
	}
	let t = U.bgImage;
	let realBg = bg;
	if (bgNav == realBg) bgNav = fgIsLight ? colorDark(bgNav, .2) : colorLight(bgNav, .2);
	let bgContrast = fgIsLight ? colorDark(bgNav, .2) : colorLight(bgNav, .2);
	let fgContrast = fgIsLight ? '#ffffff80' : '#00000080'; // 'red'; //bestContrastingColor(bgNav); // colorContrast(bgNav); // fgIsLight ? colorDark(fg, .5) : colorLight(fg, .5);
	return [realBg,bgContrast,bgNav,fg,fgContrast];
}










