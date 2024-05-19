function loadPlayerColors() {
  let [hstep, hmin, hmax] = [20, 0, 359];
  let [lstep, lmin, lmax] = [20, 50, 60];
  let [sstep, smin, smax] = [30, 70, 100];
  let [whites, blacks, all] = [[], [], []];
  for (let h = hmin; h < hmax; h += hstep) {
    for (let l = lmin; l <= lmax; l += lstep) {
      for (let s = smin; s <= smax; s += sstep) {
        let o = { h: h, s: s, l: l };
        let c = hslToHexCOOL(o);
        o.c = c;
        all.push(o);
        let fg = idealTextColor(c);
        if (fg == 'white') whites.push(c); else blacks.push(c);
      }
    }
  }
  DA.allColors = all;
  blacks.push('#FFDD33')
  let plColors = whites.concat(blacks);
  shuffle(plColors);
  let userColors = {
    "afia": "#69c963",
    "ally": "#6660f3",
    "amanda": "#339940",
    "annabel": "#ADA0EE",
    "bob": "#033993",
    "buddy": "midnightblue",
    "felix": BLUE,
    "guest": "dodgerblue",
    "gul": "#6fccc3",
    "lauren": BLUEGREEN,
    "leo": "#C19450",
    "mac": ORANGE,
    "minnow": "#F28DB2",
    "mimi": "#76AEEB",
    "nasi": "#EC4169",
    "nimble": "#6E52CC",
    "sarah": "deeppink",
    "sheeba": "gold",
    "valerie": "lightgreen"
  };
  // for (const plname in userColors) {
  //   let uc = userColors[plname];
  //   uc = colorFrom(uc);
  //   let already = firstCond(all, x => x.c.toLowerCase() == uc.substring(0, 7).toLowerCase());
  //   if (already) console.log('present', uc);
  // }
	userColors = Object.values(userColors).map(x=>colorFrom(x));
  ensureColorDict();
  ensureColorNames();
  let allColors = Object.values(ColorDi).map(x => x.c);
  let list = Object.values(userColors).concat(plColors).concat(allColors).concat(Object.values(ColorNames));
  // console.log('list',jsCopy(list))
  //list = list.filter(x => colorLum(x) < .85);
  list = list.filter(x => !isGrayColor(x));
  let s = new Set(list);
  list = Array.from(s);
	// let x=list.filter(x=>x.length!=7); console.log(x)
	assertion(list.every(x=>x.length == 7),"COLORS WRONG!")
  let hsllist = list.map(x => colorHexToHsl01Array(x)); //, true));
	// hsllist = hsllist.map(x=>({h:x[0],s:x[1],l:x[2]}));
	hsllist = hsllist.map(x=>({h:x[0]*360,s:x[1]*100,l:x[2]*100}));
  console.log('list',jsCopy(hsllist)); 
  sortByMultipleProperties(hsllist, 'h', 'l');
  console.log('list',jsCopy(hsllist[100])); 
  // let list2 = hsllist.map(x => hslToHex(x.h*360,x.s*100,x.l*100)); //colorFrom(hslToHsl(x)));
  let list2 = hsllist.map(x => hslToHex(x.h,x.s,x.l)); //colorFrom(hslToHsl(x)));
	for(let i=0;i<list2.length;i++) if (!list.includes(list2[i])) console.log("ERROR")
  console.log('list',jsCopy(list))
  //list = arrRemoveDuplicates(list);
  //M.playerColors = list;
  return list;
}

//#region showColors
async function showColors() {
	showTitle('Settings');
	let [szSmall, szMiddle, wmax] = [30,80, 34*15];
	let dParent = mBy('dMain'); mClear(dParent);

	DA.itemsColor = showColorGrid(dParent,szSmall,wmax,onclickColor)

	let dPalette = mDom(dParent, { wmax, hmargin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true }, { id: 'dPalette' });

	DA.itemsTexture = showTextureGrid(dParent,szSmall,wmax,onclickTexture);

	DA.itemsBlend = showBlendGrid(dParent,szMiddle,wmax,onclickBlendSample);

	mButton('Apply',settingsApply,'dMain',{fz:24,maleft:20});
	mButton('Save',settingsSave,'dMain',{fz:24,maleft:20});

	let color = selectUserColor(DA.itemsColor);
	let pathTexture = selectUserTexture(DA.itemsTexture);
	if (isEmpty(pathTexture)) return;
	let blend = selectUserBlend(DA.itemsBlend);
}
function showBlendGrid(dParent,sz,wmax,handler){
	let dBlend = mDom(dParent, { wmax, margin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
	list = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
	let itemsBlend = DA.itemsBlend = [];
	// console.log('list',list.length)
	for (const [idx, mode] of list.entries()) {
		let id = `dSample${idx}`;
		let db = mDom(dBlend, { border: 'white', w: sz, h: sz, 'background-blend-mode': mode, cursor: 'pointer' }, { id, idx });
		let item = { div: db, blend: mode, isSelected: false };
		itemsBlend.push(item);
		db.onclick = () => handler(item, itemsBlend);
	}
	return itemsBlend;
}
function showColorGrid(dParent,sz,wmax,handler){
	let dColors = mDom(dParent, { wmax, hmargin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true }, { id: 'dColors' });
	let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
	list = M.playerColors.concat(grays);
	let items = [];
	//console.log(BLUEGREEN)
	for (const c of list) {
		let dc = mDom(dColors, { w: sz, h: sz, bg: c, cursor: 'pointer' });
		let item = { div: dc, color: c, isSelected: false };
		//console.log('color',c,dc,item)
		items.push(item);
		dc.onclick = () => handler(item, items);
	}
	return items;
}
function showTextureGrid(dParent,sz,wmax,handler){
	let dTheme = mDom(dParent, { wmax, margin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
	list = M.textures;
	let itemsTexture = [];
	for (const t of list) {
		let bgRepeat = t.includes('marble_') ? 'no-repeat' : 'repeat';
		let bgSize = bgRepeat == 'repeat' ? 'auto' : 'cover';
		let bgImage = `url('${t}')`;
		let recommendedMode = t.includes('ttrans') ? 'normal' : t.includes('marble_') ? 'luminosity' : 'multiply';
		// let dc = mDom(dTheme, { cursor: 'pointer', border: 'black', w: sz, h: sz, 'background-image': bgImage, 'background-blend-mode': recommendedMode });
		let dc = mDom(dTheme, { cursor: 'pointer', border: 'black', w: sz, h: sz }, { tag: 'img' });
		let item = { div: dc, path: t, bgImage, bgRepeat, bgSize, blend: recommendedMode, isSelected: false };
		itemsTexture.push(item);
		dc.onclick = () => handler(item, itemsTexture);
	}
	for (const [i, o] of itemsTexture.entries()) {
		let img = iDiv(o);
		img.onload = () => {
			let pal = ColorThiefObject.getPalette(img);
			if (pal == null) {
				//mach eine transparency palette!
				pal = colorTransPalette();

			}
			if (pal != null) {
				pal.unshift('white'); pal.push('black');
				let n = pal.length;
				pal = pal.map(x => colorHex(x)); // console.log(pal)
				let palhex = Array.from(new Set(pal));// console.log(palhex)
				let palhsl = palhex.map(x => colorHexToHsl360Object(x));
				let lum = palhsl.map(x => x.l);
				let hue = palhsl.map(x => x.h);
				let sat = palhsl.map(x => x.s);
				pal = [];
				for (let i = 0; i < palhex.length; i++) {
					let o = { hex: palhex[i], lum: lum[i], hue: hue[i], sat: sat[i] };
					pal.push(o);
				}
				//if (n!=pal.length) console.log('reduce from',n,'to',pal.length)
			}

			itemsTexture[i].palette = pal;
		}
		img.src = o.path; //,src:t		//let pal=colorPaletteFromUrl(t); //await getPaletteFromElem(dc);

	}
	return itemsTexture;
}

//#endregion

//#region settings
function settingsApply(){
	console.log('apply settings');
	let color = settingsGetSelectedColor();
	let texture = settingsGetSelectedTexture();
	let blend = settingsGetSelectedBlend();
	setColors(color,texture,blend);
}
function extractUrlFromBlendMode(blend){
	let parts = blend.split('.');
	console.log('parts',parts);
}
function setColors(c, texture, blend) {
  // mClass(document.body, 'wood');
  if (nundef(c)) {
    //pickup document.body style
    c = document.body.style.background;
    texture = document.body.style.backgroundImage;
    blend = document.body.style.backgroundBlendMode;
  }
  if (isEmpty(c)) c = 'transparent';
  if (nundef(texture)) texture = '';
  if (nundef(blend)) blend = '';
  let [bgRepeat, bgSize] = getRepeatAndSizeForTexture(texture);
}


//#endregion
