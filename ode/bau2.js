
async function showBlendModes(){
	if (isEmpty(U.bgImage)) {
		showMessage('No Texture has been selected! Blend mode needs a texture!');
		return;
	}
  mClear('dMain');
  let bgImage = U.bgImage; 
	let bg = U.color;
	let bgRepeat = 'repeat'; //U.bgRepeat;
	let bgSize = 'auto'; //U.bgSize;

	let dTheme=mDom('dMain',{padding:12, gap:10}); mFlexWrap(dTheme);
	let list = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
  console.log(list)
	let items = [];
	for (const bgBlend of list) {
    let dc = mDom(dTheme, { bgBlend,bgImage,bgRepeat,bgSize,bg,cursor: 'pointer', border: 'white', w: 300, h: 170 }, { tag: 'img' });
    let item = { div: dc, bgImage, bgRepeat, bgSize, bgBlend, isSelected: false };
		items.push(item);
    dc.onclick=async()=>onclickBlendMode(item,items);
  }

  // for (const [i, o] of items.entries()) {
	// 	let img = iDiv(o);
	// 	img.onload = () => {
	// 		let pal = ColorThiefObject.getPalette(img);
	// 		if (pal == null) {
	// 			//mach eine transparency palette!
	// 			pal = colorTransPalette();

	// 		}
	// 		if (pal != null) {
	// 			pal.unshift('white'); pal.push('black');
	// 			let n = pal.length;
	// 			pal = pal.map(x => colorHex(x)); // console.log(pal)
	// 			let palhex = Array.from(new Set(pal));// console.log(palhex)
	// 			let palhsl = palhex.map(x => colorHexToHsl360Object(x));
	// 			let lum = palhsl.map(x => x.l);
	// 			let hue = palhsl.map(x => x.h);
	// 			let sat = palhsl.map(x => x.s);
	// 			pal = [];
	// 			for (let i = 0; i < palhex.length; i++) {
	// 				let o = { hex: palhex[i], lum: lum[i], hue: hue[i], sat: sat[i] };
	// 				pal.push(o);
	// 			}
	// 			//if (n!=pal.length) console.log('reduce from',n,'to',pal.length)
	// 		}

	// 		items[i].palette = pal;

  
	// 	}
	// 	img.src = o.path; //,src:t		//let pal=colorPaletteFromUrl(t); //await getPaletteFromElem(dc);

	// }
	return items;
}



function testUpdateTestButtons(dParent, styles = {}) {
	let table = Clientdata.table;
	dParent = toElem(dParent);
	let id = 'dTestButtons'; mRemoveIfExists(id);
	mIfNotRelative(dParent);
	if (dParent.id == 'dExtra') mStyle(dParent,{hmin:26});
	addKeys({ display: 'flex', gap: 10, vpadding: 2, position: 'absolute', right: 8, top: 0 }, styles);
	let dBotHuman = mDom(dParent, styles, { id });
	let me = getUname();
	let names = isdef(table) ? [] : ['amanda', 'felix', 'lauren', 'mimi', 'gul'];
	for (const name of names) {
		let idname = getButtonCaptionName(name);
		let b = UI[idname] = mButton(name, testOnclickCaption, dBotHuman);
		if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
	}
	if (nundef(table)) return dBotHuman;;
	let playmode = getPlaymode(table, me);
	if (nundef(playmode)) return dBotHuman;;
	let [playmodeKey, sz, bg, matop, patop] = [playmode == 'human' ? 'skullcap' : 'robot', 25, 'transparent', 2, 0];
	showImage(playmodeKey, dBotHuman, { fg: 'white', sz, round: true, bg, matop, patop });// , 'line-height': sz });
	let caption = `Make me ${playmode == 'bot' ? 'human' : 'bot'}`;
	UI.bPlaymode = mButton(caption, testOnclickPlaymode, dBotHuman, { w: 130 });
	return dBotHuman;
}
