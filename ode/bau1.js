
async function calcUserPalette(name) {
	if (nundef(name)) name = U.name;
	let user = await getUser(name);

	let dParent = mPopup(null,{opacity:0});
	return await showPaletteFor(dParent,user.texture, user.color, user.blendMode);
}
async function showPaletteFor(dParent,src, color, blendMode) {
	let fill = color;
	let bgBlend = getBlendCanvas(blendMode);
	let d = mDom(dParent, { w100:true, gap: 4 }); mCenterFlex(d);

	let palette = [color];
	if (isdef(src)) {
		let ca = await getCanvasCtx(d, { w:500, h: 300, fill, bgBlend }, { src });
		palette = await getPaletteFromCanvas(ca.cv);
		palette.unshift(fill);
	} else {
		//make a palette with color and other shades of that color
		let ca = mDom(d,{w:500,h:300});
		palette = arrCycle(paletteShades(color), 4);
	}

	let dominant = palette[0];
	let palContrast = paletteContrastVariety(palette,palette.length);
	mLinebreak(d);
	showPaletteMini(d, palette);
	mLinebreak(d);
	showPaletteMini(d, palContrast);
	mLinebreak(d);

	return [palette.map(x=>colorO(x)),palContrast];
}












