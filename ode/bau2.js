
async function onclickSettMyTheme(){
	localStorage.setItem('settingsMenu','settMyTheme')

	let dSettings = mBy('dSettingsMenu'); mClear(dSettings); 
	console.log(getRect(dSettings))
	console.log(dSettings); //return;
	let d=mDom(dSettings,{h:'100vh',bg:U.color})
	//let dParent = mDom(d,{h:2000,bg:U.color}); mFlex(dParent);

	//return;

	let dOuter=mDom(d, {padding:25}); // { padding: 10, gap: 10, margin:'auto', w:500, align:'center', bg:'white' }); //mCenterFlex(dParent);
	mCenterFlex(dOuter)

	let ui = await uiTypePalette(dOuter,U.texture,U.color,U.blendMode);
	//mDom(dText,{fg:'white',fz:30,h:200},{html:'hallo'})
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








