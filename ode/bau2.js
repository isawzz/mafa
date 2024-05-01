async function showColors() {
  showTitle('Set Color Theme');
  let sz = 30;
  let d = mDom('dMain', { wmax: (sz + 4) * 15, margin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
  list = M.playerColors.concat(grays);
  let itemsColor = [];
  for (const c of list) {
    let dc = mDom(d, { w: sz, h: sz, bg: c, fg: idealTextColor(c), cursor: 'pointer' });
    let item = { div: dc, color: c, isSelected: false };
    itemsColor.push(item);
    dc.onclick = () => onclickColor(item, itemsColor);
  }
  let dcc = mDom(d, { bg:'white', border: getThemeFg(), h: sz, cursor: 'pointer', hpadding: 4 }, { html: 'none' });
  let itemc = { div: dcc, color: '', isSelected: false };
  itemsColor.push(itemc);
  dcc.onclick = () => onclickColor(itemc, itemsColor);

  let dTheme = mDom('dMain', { wmax: (sz + 4) * 15, margin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  list = M.textures;
  let itemsTexture = DA.itemsTexture = [];
  for (const t of list) {
    //console.log(c, typeof c)
    let bgRepeat = t.includes('marble_') ? 'no-repeat' : 'repeat';
    let bgSize = bgRepeat == 'repeat' ? 'auto' : 'cover';
    let bgImage = `url('${t}')`;
    let recommendedMode = t.includes('ttrans')?'normal':t.includes('marble_')?'luminosity':'multiply';
    // let dc = mDom(dTheme, { cursor: 'pointer', border: 'black', w: sz, h: sz, 'background-image': bgImage, 'background-blend-mode': recommendedMode });
    let dc = mDom(dTheme, { cursor: 'pointer', border: 'black', w: sz, h: sz},{tag:'img'});
    let item = { div: dc, path: t, bgImage, bgRepeat, bgSize, blendMode:recommendedMode, isSelected: false };
    itemsTexture.push(item);
    dc.onclick = () => onclickTexture(item, itemsTexture);
  }
  let dct = mDom(dTheme, { bg:'white', border: getThemeFg(), h: sz, cursor: 'pointer', hpadding: 4 }, { html: 'none' });
  let itemt = { div: dct, bgImage: '', bgRepeat: '', bgSize: '', blendMode:'', isSelected: false };
  itemsTexture.push(itemt);
  dct.onclick = () => onclickTexture(itemt, itemsTexture);

  sz = 100;
  let dBlend = mDom('dMain', { wmax: (sz + 4) * 6, margin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  list = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
  let itemsBlend = [];
  // console.log('list',list.length)
  for (const [idx, mode] of list.entries()) {
    let id = `dSample${idx}`;
    let db = mDom(dBlend, { border: 'white', w: 100, h: 100, 'background-blend-mode': mode, cursor: 'pointer' }, { id, idx });
    let item = { div: db, blendMode: mode, isSelected: false };
    itemsBlend.push(item);
    db.onclick = () => onclickBlendSample(item, itemsBlend);
  }

	let color=selectUserColor(itemsColor);
	let pathTexture=selectUserTexture(itemsTexture);
	let blend=selectUserBlend(itemsBlend);

	//mach einen mix aus diesen 3 in einem neuen sample

  let pal=await getPaletteFromColorTextureBlend(color,pathTexture,blend,'dMain');//console.log('!!!!!YEAH!!!!!',pal); 
  pal.unshift('#ffffff');pal.push('#000000');
  //console.log('got new palette',pal);

	//alle paletten holen
	//console.log('HALLOOOOOOOOOOOOOOOOOOOOOOOOO');
	//console.log(itemsTexture)
	for(const [i,o] of itemsTexture.entries()){
		let img=iDiv(o);
		img.onload=()=>{
			// let pal=item.pal=colorPaletteFromImage(dc);
			let pal = ColorThiefObject.getPalette(img);
			if (o.path.includes('ttrans') && pal != null){console.log('not null:',o.path,pal)}
			else if (pal == null) console.log('t',o.path,'pal',pal);

			//if (pal == null) pal = ['white','#ffffff']
			if (pal == null){
				//mach eine transparency palette!

			}
			if (pal != null){
				pal.unshift('white');pal.push('black');
				let n= pal.length;
				pal = pal.map(x=>colorHex(x));  console.log(pal)
				let palhex = Array.from(new Set(pal)); console.log(palhex)
				let palhsl = palhex.map(x=>colorHSL(x,true));
				let lum=palhsl.map(x=>x.l);
				let hue=palhsl.map(x=>x.h);
				let sat=palhsl.map(x=>x.s);
				pal = [];
				for(let i=0;i<palhex.length;i++){
					let o={hex:palhex[i],lum:lum[i],hue:hue[i],sat:sat[i]};
					pal.push(o);
				}
				if (n!=pal.length) console.log('reduce from',n,'to',pal.length)
			}

			DA.itemsTexture[i].palette = pal;
		}
		img.src=o.path; //,src:t		//let pal=colorPaletteFromUrl(t); //await getPaletteFromElem(dc);

	}


	return;
  //hier moecht ich ein fs mit radios fuer die verschiedenen bland modes
  // let dBlend = mDom('dMain', { margin:20, hpadding: 0 });

  // hier moecht ich die User settings selecten
  let ucitem = itemsColor.find(x=>x.color == U.color); //das geht nicht wenn user eine variante gewaehlt hat mit slider!!!
  //falls das eine slider variant ist, muss ich so ein item dazutun oben
  //irgendein anderes wird geloescht? ne, einfach neben none in die line geben?
  if (nundef(ucitem)) {
    console.log(`user ${U.name} has no color!!!!`)
  }else{
    iDiv(ucitem).click();
  }

  let utitem = itemsTexture.find(x=>x.bgImage == U.texture); //U.texture hat die url drin!!! das geht nicht wenn user eine variante gewaehlt hat mit slider!!!
  //falls das eine slider variant ist, muss ich so ein item dazutun oben
  //irgendein anderes wird geloescht? ne, einfach neben none in die line geben?
  if (nundef(utitem)) {
    console.log(`user ${U.name} has no texture!!!!`,U);
    //clicj on a random texture!
    let t=rChoose(itemsTexture);
    iDiv(t).click();
  }else{
    iDiv(utitem).click();
  }

  



}


