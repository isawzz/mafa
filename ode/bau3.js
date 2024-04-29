
async function showColors() {
  showTitle('Set Color Theme');
  let sz = 30;
  let d = mDom('dMain', { wmax: (sz + 4) * 15,margin:20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
  list = M.playerColors.concat(grays);
  let itemsColor = [];
  for (const c of list) {
    let dc = mDom(d, { w: sz, h: sz, bg: c, fg: idealTextColor(c), cursor: 'pointer' });
    let item = {div:dc,color:c,isSelected:false};
    itemsColor.push(item);
    dc.onclick = ()=>onclickColor(item,itemsColor);
  }
	let dcc = mDom(d, { border:getThemeFg(), h: sz, cursor:'pointer',hpadding:4 },{html:'none'});
  let itemc = {div:dcc,color:'',isSelected:false};
  itemsColor.push(itemc);
  dcc.onclick = ()=>onclickColor(itemc,itemsColor);

  let dTheme = mDom('dMain', { wmax: (sz + 4) * 15,margin:20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  list = M.textures;
  let itemsTexture = [];
  for (const t of list) {
    //console.log(c, typeof c)
		let bgRepeat=t.includes('marble_')?'no-repeat':'repeat';
		let bgSize=bgRepeat == 'repeat'?'auto':'cover';
		let bgImage = `url('${t}')`;
    let dc = mDom(dTheme, { cursor: 'pointer',border:getThemeFg(), w: sz, h: sz, 'background-image': bgImage });
    let item = {div:dc,path:t,bgImage,bgRepeat,bgSize,isSelected:false};
    itemsTexture.push(item);
    dc.onclick = ()=>onclickTexture(item,itemsTexture);
  }
	let dct = mDom(dTheme, { border:getThemeFg(), h: sz, cursor:'pointer',hpadding:4 },{html:'none'});
  let itemt = {div:dct,bgImage:'',bgRepeat:'',bgSize:'',isSelected:false};
  itemsTexture.push(itemt);
  dct.onclick = ()=>onclickTexture(itemt,itemsTexture);

  sz=100;
  let dBlend = mDom('dMain', { wmax: (sz + 4) * 6,margin:20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  list='normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
  let itemsBlend = [];
  // console.log('list',list.length)
  for(const [i,mode] of list.entries()){
    let id = `dSample${i}`;
    let db=mDom(dBlend,{border:'white',w:100,h:100,'background-blend-mode': mode, cursor:'pointer'},{id});
    let item = {div:db,blendMode:mode,isSelected:false};
    itemsBlend.push(item);
    db.onclick = ()=>onclickBlendSample(item,itemsBlend);
  }

  //hier moecht ich ein fs mit radios fuer die verschiedenen bland modes
  // let dBlend = mDom('dMain', { margin:20, hpadding: 0 });




}


