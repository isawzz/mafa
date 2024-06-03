
async function onclickSettMyTheme(){
	localStorage.setItem('settingsMenu','settMyTheme')

	let d = mBy('dSettingsColor'); mClear(d); 
	let dParent = mDom(d); mFlex(dParent);
	let dOuter=mDom(dParent, {bg:'white',padding:25}); // { padding: 10, gap: 10, margin:'auto', w:500, align:'center', bg:'white' }); //mCenterFlex(dParent);
	mCenterFlex(dOuter)

	showPaletteFor(dOuter,U.texture,U.color,U.blendMode);
	return;

	let d1 = mDom(dParent);
	let ca = await getCanvasCtx(d1, { w: 300, h: 200, fill, bgBlend }, { src });
	let palette = await getPaletteFromCanvas(ca.cv);
	palette.unshift(fill); palette.splice(8);
	showPaletteMini(d1, palette);
	d1.onclick = async () => {
		U.palette = palette;
		U.blendMode = blendCSS;
		await updateUserTheme();
	}


	let list = arrMinus(getBlendModesCSS(), ['saturation', 'color']);
	for (const blendMode of list) { await showBlendMode(dParent, blendMode); }
}








