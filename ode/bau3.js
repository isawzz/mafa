
async function uiTypePalette(dParent,src, color, blendMode){

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
	let bgItems = showPaletteMini(d, palette);
	mLinebreak(d);
	let fgItems = showPaletteMini(d, palContrast);
	mLinebreak(d);

	mIfNotRelative(dParent);
	let dText = mDom(dParent, { align:'center', fg: 'white', fz: 30, position: 'absolute', top: 0, left: 0, w100: true, h100: true });
	mCenterFlex(dText);
	dText.innerHTML=`<br>HALLO<br>das<br>ist ein Text`

	for(const item of fgItems){
		let div=iDiv(item);
		console.log(div)
		mStyle(div,{cursor:'pointer'});
	}

	// function changeFg(c) { mStyle(dText, { fg: c }); }
	// function changeBg(c) { mStyle(dParent, { bg: c }); }

	// fgItems.map(x=>iDiv(x).onclick=()=>changeFg(x.bg))
	// bgItems.map(x=>iDiv(x).onclick=()=>changeBg(x.bg))

	return {pal:palette.map(x=>colorO(x)),palContrast};
	
}

