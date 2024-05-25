function getBlendCanvas(bgBlend='normal'){
	const blendModeMapping = {
		'normal': 'source-over',       // Default blending mode
		'multiply': 'multiply',
		'screen': 'screen',
		'overlay': 'overlay',
		'darken': 'darken',
		'lighten': 'lighten',
		'color-dodge': 'color-dodge',
		// 'color-burn': 'color-burn',
		// 'hard-light': 'hard-light',
		// 'soft-light': 'soft-light',
		// 'difference': 'difference',
		// 'exclusion': 'exclusion',
		// 'hue': 'hue',
		'saturation': 'saturation',
		'color': 'color',
		'luminosity': 'luminosity',
		// The following CSS blend modes do not have direct canvas equivalents,
		// but can be approximated using other techniques:
		'pass-through': 'source-over' // This is a made-up value for cases where no blending is applied
	};


	return blendModeMapping[bgBlend];
}
function getBlendModesCSS(){
	return 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');

}
function getBlendModesCanvas(){
	const blendModes = [
		'source-over',
		// 'source-in',
		// 'source-out',
		// 'source-atop',
		// 'destination-over',
		// 'destination-in',
		// 'destination-out',
		// 'destination-atop',
		'lighter',
		'copy',
		// 'xor',
		'multiply',
		'screen',
		'overlay',
		'darken',
		'lighten',
		'color-dodge',
		'color-burn',
		'hard-light',
		'soft-light',
		'difference',
		'exclusion',
		'hue',
		'saturation',
		'color',
		'luminosity'
	]; //these are for canvas
	return blendModes;	
}
async function getCanvasCtx(d,styles={},opts={}){
	opts.tag = 'canvas';
	let cv = mDom(d,styles,opts);
	let ctx = cv.getContext('2d');

	let fill = valf(styles.fill,styles.bg);
	if (fill) {
		ctx.fillStyle = fill;
		ctx.fillRect(0, 0, cv.width, cv.height);
	}
	let bgBlend = styles.bgBlend;
	if (bgBlend) ctx.globalCompositeOperation = bgBlend;

	let src = valf(opts.src,opts.path);
	if (src){
		let isRepeat = src.includes('ttrans');
		let imgStyle = isRepeat?{}:{w:cv.width,h:cv.height};
		let img = await imgAsync(null,imgStyle,{src});
		if (bgBlend) ctx.globalCompositeOperation = bgBlend;
		if (isRepeat) {
			const pattern = ctx.createPattern(img, 'repeat');	
			ctx.fillStyle = pattern;
			ctx.fillRect(0, 0, cv.width, cv.height);
		}else	ctx.drawImage(img, 0, 0, cv.width, cv.height);
	}
	return {cv,ctx};
}
async function getPaletteFromCanvas(canvas) {
  if (nundef(ColorThiefObject)) ColorThiefObject = new ColorThief();
  const dataUrl = canvas.toDataURL();
  const img = new Image();
  img.src = dataUrl;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const palette = ColorThiefObject.getPalette(img);
      resolve(palette?palette.map(x=>colorFrom(x)):['black','white']);
    };

    img.onerror = () => {
      reject(new Error('Failed to load the image from canvas.'));
    };
  });
}
async function getTextures(){
	M.textures = (await mGetFiles(`../assets/textures`)).map(x=>`../assets/textures/${x}`);
	return M.textures;
}
function getTextureStyle(bg,t){
  let bgRepeat = t.includes('marble_') || t.includes('wall') ? 'no-repeat' : 'repeat';
  let bgSize = t.includes('marble_') || t.includes('wall') ? `cover` : t.includes('ttrans') ? '' : 'auto';
  let bgImage = `url('${t}')`;
  let bgBlend = t.includes('ttrans') ? 'normal' : (t.includes('marble_') || t.includes('wall')) ? 'luminosity' : 'multiply';
	return { bg, bgImage, bgSize, bgRepeat, bgBlend };
}
function rBlend(){return rBlendCanvas();}
function rBlendCSS(){return rChoose(getBlendModesCSS());}
function rBlendCanvas(){	return rChoose(getBlendModesCanvas());}
function rTexture(){return rChoose(valf(M.textures,[]));}
function showPaletteMini(dParent, colors, sz=30) {
	let d1 = mDom(dParent, { display: 'flex', wrap: true, gap: 2 }); //, hmax: '100vh', dir: 'column' });
	let items = [];
	for (var c of colors) {
		if (isDict(c)) c = c.hex;
		let fg = 'dimgray'; //colorIdealText(c); if (fg == 'white') fg='silver';
		let dc = mDom(d1, { w: sz, h: sz, bg: c, fg, border:`${fg} solid 3px` });
		items.push({div:dc,bg:c})
	}
	return items;
}
function showPaletteText(dParent, list) {
	let d1 = mDom(dParent, { display: 'flex', wrap: true, gap: 2 }); //, hmax: '100vh', dir: 'column' });
	let items = [];
	for (var c of list) {
		let dc = mDom(d1, {bg:'black',fg:'white'},{html:c});
		items.push({div:dc,text:c})
	}
	return items;
}








