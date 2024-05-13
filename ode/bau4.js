
async function onclickSettColor(){
  console.log('set Color!!!')
  await showColors();
}
async function onclickSettFg(){
  console.log('set Color!!!')
  await showTextColors();
}
async function onclickSettRemoveTexture(){
  if (isEmpty(U.bgImage)) return;
  setTexture({});
  for(const prop of ['bgImage','bgSize','bgBlend','bgRepeat']) delete U[prop];
  console.log(U);
  await postUserChange(U,true)
}
async function onclickSettTexture(){
  console.log('set Texture!!!')
  await showTextures();
}
async function onclickTexture(item) {

	console.log('item',item)
	//console.log('items',items)

	console.log(U)

	U.bgImage = item.bgImage;
	U.bgBlend = item.bgBlend;
	U.bgSize = item.bgSize;
	U.bgRepeat = item.bgRepeat;


	//[U.bgImage,U.bgRepeat,U.bgBlend,U.bgSize]=[item.bgImage,item.bgRepeat,item.bgBlend,item.bgSize];

	setTexture(item);
	//let bgBlend = await mGather(dc, {}, { content: catlist, type: 'select' });

	// await uiGadgetTypeSelect()
	//let c=getCSSVariable('--bgBody');
	//let hex = colorToHex79(c);
	//U.color = hex;
	await postUserChange();


}
async function showColors(){
  console.log('open Settings!!!'); 
	
	mClear('dMain');

	let di=M.dicolor;
	let d=mDom('dMain',{padding:12});
  for(const bucket in di){
    let list = dict2list(di[bucket]);
    let clist=[];
    for(const c of list){
      let o=w3color(c.value);
      //console.log('c',c)
      o.name = c.id;
      o.hex = c.value;
      clist.push(o);
    }

    let sorted = sortByFunc(clist,x=>-x.lightness); //(10*x.lightness+x.sat*100));
    //console.log(sorted[0]); return;

    mDom(d,{},{html:`<br>${bucket}<br>`})
    showPaletteNames(d,sorted);
    
  }

  let divs=document.getElementsByClassName('colorbox');
  for(const div of divs){
    div.onclick=async()=>{
      setColors(div.getAttribute('dataColor'));
      let c=getCSSVariable('--bgBody');
      let hex = colorToHex79(c);
      U.color = hex;
      await postUserChange();
    
    }
    //console.log('HAAAAAAALLLO',div);break;

  }

}
async function showTextColors(){
	mClear('dMain');
	let d=mDom('dMain',{padding:12});

	//ich brauch die palette fuer den current body background
	//weiss, schwarz, silver, dimgray
	let d1 = mDom(d, { gap: 12 }); mFlexWrap(d1);
	let colors = ['white','silver','dimgray','black',getCSSVariable('--fgButton'),getCSSVariable('--fgButtonHover')].map(x=>w3color(x));
	for (var c of colors) {
		let bg = 'transparent';
		let fg = c.hex = c.toHexString();
		let d2 = mDom(d1, { border:fg, wmin: 250, bg, fg, padding: 20 }, { class: 'colorbox', dataColor: fg });
		mDom(d2, { weight: 'bold', align: 'center' }, { html: 'Text Sample' });
		let html = `<br>${bg}<br>hue:${c.hue}<br>sat:${Math.round(c.sat * 100)}<br>lum:${Math.round(c.lightness * 100)}`
		let dmini = mDom(d2, { align: 'center', wmin: 120, padding: 2, bg, fg }, { html });
	}

  let divs=document.getElementsByClassName('colorbox');
  for(const div of divs){
    div.onclick=async()=>{
			console.log('HALLO')
			let fg = div.getAttribute('dataColor');
      setColors(getCSSVariable('--bgBody'),fg);
      let hex = colorToHex79(fg);
      U.fg = hex;
      await postUserChange();
    
    }
    //console.log('HAAAAAAALLLO',div);break;

  }

}
async function showTextures(){
  mClear('dMain');
	let list=M.textures;
	let dTheme=mDom('dMain',{padding:12, gap:10}); mFlexWrap(dTheme);
  console.log(list)
	let itemsTexture = [];
	for (const t of list) {
		// let bgRepeat = t.includes('marble_') ? 'no-repeat' : 'repeat';
		// let bgSize = bgRepeat == 'repeat' ? 'auto' : 'cover';
    let bgRepeat = 'repeat';
    let bgSize = t.includes('marble_')? `100vw 100vh`:'auto';
    let bgImage = `url('${t}')`;
		let recommendedMode = t.includes('ttrans') ? 'normal' : t.includes('marble_') ? 'luminosity' : 'multiply';

    let dc = mDom(dTheme, { cursor: 'pointer', border: 'white', w: 300, h: 170 }, { tag: 'img' });

    let item = { div: dc, path: t, bgImage, bgRepeat, bgSize, bgBlend: recommendedMode, isSelected: false };
		itemsTexture.push(item);

    //dc.onclick = () => handler(item, itemsTexture);
    dc.onclick=async()=>onclickTexture(item,itemsTexture);
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
function setTheme(o){
	setColors(o.color,o.fg);
	setTexture(o);
}
async function settingsOpen(){
  await showColors();
  settingsSidebar();


}
async function settingsClose(){
  //uebernimm current color!
  //console.log('close Settings!!!'); mClear('dMain');
	closeLeftSidebar(); clearMain(); 
}
function settingsSidebar() {
	let wmin = 170;
	mStyle('dLeft', { wmin: wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 160, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
	let gap = 5;
	UI.settColor = mCommand(d, 'settColor', 'Color'); mNewline(d, gap);
	UI.settFg = mCommand(d, 'settFg', 'Text Color'); mNewline(d, gap);
	UI.settTexture = mCommand(d, 'settTexture', 'Texture'); mNewline(d, gap);
	UI.settRemoveTexture = mCommand(d, 'settRemoveTexture', 'Remove Texture'); mNewline(d, gap);
}
