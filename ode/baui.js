function stringBetween(sFull, sStart, sEnd) {
	return stringBefore(stringAfter(sFull, sStart), isdef(sEnd) ? sEnd : sStart);
}
function uiTypeRadios(lst, d, styles = {}, opts = {}) {
	let rg = mRadioGroup(d, {}, 'rSquare', 'Resize (cropped area) to height: '); mClass(rg, 'input');
	let handler = x => squareTo(cropper, x);
	mRadio(`${'just crop'}`, 0, 'rSquare', rg, {}, cropper.crop, 'rSquare', false)
	for (const h of [128, 200, 300, 400, 500, 600, 700, 800]) {
		mRadio(`${h}`, h, 'rSquare', rg, {}, handler, 'rSquare', false)
	}
	return rg;
}

//#region mStyle
function mStyle(elem, styles = {}, unit = 'px') {
  elem = toElem(elem);
  let style = styles = jsCopy(styles);
  if (isdef(styles.w100)) style.w = '100%';
  if (isdef(styles.h100)) style.h = '100%';
  let bg, fg;
  if (isdef(styles.bg) || isdef(styles.fg)) {
    [bg, fg] = colorsFromBFA(styles.bg, styles.fg, styles.alpha);
  }
  if (isdef(styles.vpadding) || isdef(styles.hpadding)) {
    styles.padding = valf(styles.vpadding, 0) + unit + ' ' + valf(styles.hpadding, 0) + unit;
  }
  if (isdef(styles.vmargin) || isdef(styles.hmargin)) {
    styles.margin = valf(styles.vmargin, 0) + unit + ' ' + valf(styles.hmargin, 0) + unit;
  }
  if (isdef(styles.upperRounding) || isdef(styles.lowerRounding)) {
    let rtop = '' + valf(styles.upperRounding, 0) + unit;
    let rbot = '' + valf(styles.lowerRounding, 0) + unit;
    styles['border-radius'] = rtop + ' ' + rtop + ' ' + rbot + ' ' + rbot;
  }
  if (isdef(styles.box)) styles['box-sizing'] = 'border-box';
  if (isdef(styles.round)) { elem.style.setProperty('border-radius', '50%'); }
  for (const k in styles) {
    if (['round', 'box'].includes(k)) continue;
    let val = styles[k];
    let key = k;
    if (isdef(STYLE_PARAMS[k])) key = STYLE_PARAMS[k];
    else if (k == 'font' && !isString(val)) {
      let fz = f.size; if (isNumber(fz)) fz = '' + fz + 'px';
      let ff = f.family;
      let fv = f.variant;
      let fw = isdef(f.bold) ? 'bold' : isdef(f.light) ? 'light' : f.weight;
      let fs = isdef(f.italic) ? 'italic' : f.style;
      if (nundef(fz) || nundef(ff)) return null;
      let s = fz + ' ' + ff;
      if (isdef(fw)) s = fw + ' ' + s;
      if (isdef(fv)) s = fv + ' ' + s;
      if (isdef(fs)) s = fs + ' ' + s;
      elem.style.setProperty(k, s);
      continue;
    } else if (k.includes('class')) {
      mClass(elem, styles[k]);
    } else if (k == 'border') {
      if (isNumber(val)) val = `solid ${val}px ${isdef(styles.fg) ? styles.fg : '#ffffff80'}`;
      if (val.indexOf(' ') < 0) val = 'solid 1px ' + val;
    } else if (k == 'ajcenter') {
      elem.style.setProperty('justify-content', 'center');
      elem.style.setProperty('align-items', 'center');
    } else if (k == 'layout') {
      if (val[0] == 'f') {
        val = val.slice(1);
        elem.style.setProperty('display', 'flex');
        elem.style.setProperty('flex-wrap', 'wrap');
        let hor, vert;
        if (val.length == 1) hor = vert = 'center';
        else {
          let di = { c: 'center', s: 'start', e: 'end' };
          hor = di[val[1]];
          vert = di[val[2]];
        }
        let justStyle = val[0] == 'v' ? vert : hor;
        let alignStyle = val[0] == 'v' ? hor : vert;
        elem.style.setProperty('justify-content', justStyle);
        elem.style.setProperty('align-items', alignStyle);
        switch (val[0]) {
          case 'v': elem.style.setProperty('flex-direction', 'column'); break;
          case 'h': elem.style.setProperty('flex-direction', 'row'); break;
        }
      } else if (val[0] == 'g') {
        val = val.slice(1);
        elem.style.setProperty('display', 'grid');
        let n = allNumbers(val);
        let cols = n[0];
        let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
        elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
        elem.style.setProperty('place-content', 'center');
      }
    } else if (k == 'layflex') {
      elem.style.setProperty('display', 'flex');
      elem.style.setProperty('flex', '0 1 auto');
      elem.style.setProperty('flex-wrap', 'wrap');
      if (val == 'v') { elem.style.setProperty('writing-mode', 'vertical-lr'); }
    } else if (k == 'laygrid') {
      elem.style.setProperty('display', 'grid');
      let n = allNumbers(val);
      let cols = n[0];
      let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
      elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
      elem.style.setProperty('place-content', 'center');
    }
    if (key == 'font-weight') { elem.style.setProperty(key, val); continue; }
    else if (key == 'background-color') elem.style.backgroundColor = bg;
    else if (key == 'color') elem.style.color = fg;
    else if (key == 'opacity') elem.style.opacity = val;
    else if (key == 'wrap') { if (val == 'hard') elem.setAttribute('wrap', 'hard'); else elem.style.flexWrap = 'wrap'; }
    else if (k.startsWith('dir')) {
      isCol = val[0] == 'c';
      elem.style.setProperty('flex-direction', 'column');
    } else if (key == 'flex') {
      if (isNumber(val)) val = '' + val + ' 1 0%';
      elem.style.setProperty(key, makeUnitString(val, unit));
    } else {
      elem.style.setProperty(key, makeUnitString(val, unit));
    }
  }
}
//#endregion

//#region colors menu
function colorPaletteFromImage(img) {
  if (nundef(ColorThiefObject)) ColorThiefObject = new ColorThief();
  //console.log('ColorThiefObject',ColorThiefObject)
  let palette0 = ColorThiefObject.getPalette(img);
  //console.log('...',palette0); //das ist manchmal null for some reason!
  let palette = [];
  for (const pal of palette0) {
    let color = colorFrom(pal);
    palette.push(color);
  }
  return palette;
}
function colorPaletteFromUrl(path) {
  let img = mCreateFrom(`<img src='${path}' />`);
  let pal = colorPaletteFromImage(img);
  return pal;
}
function selectUserColor(itemsColor){
  //console.log('selectUserColor',U.color); 
	// let [color,texture,blend]=[U.color,U.texture,U.blend];
	//console.log(color);
	if (isEmpty(U.color)) U.color=rChoose(itemsColor);
	let chex=colorHex(U.color);
	//console.log(chex,itemsColor)
	let item = itemsColor.find(x=>x.color==chex);
	//console.log('item with same color',item);

	if (isdef(item)) iDiv(item).click();
	return item.color;


}
function selectUserTexture(itemsTexture){
  //console.log('selectUserTexture',U.texture); 

	//let [color,texture,blend]=[U.color,U.texture,U.blend];
	//console.log(texture,blend);
	//console.log('itemsTexture',itemsTexture)
	let item = itemsTexture.find(x=>x.bgImage.includes(U.texture));
	//console.log('item with same color',item);
	if (isdef(item)) iDiv(item).click();

	return isdef(item)?item.path:'';

}
function selectUserBlend(itemsBlend){
  //console.log('selectUserBlend',U.blend); 

	//let [color,texture,blend]=[U.color,U.texture,U.blend];
	//console.log(texture,blend);
	let item = itemsBlend.find(x=>x.blendMode==U.blend);
	//console.log('item with same color',item);
	if (isdef(item)) iDiv(item).click();

	return isdef(item)?item.blendMode:'';

}
function setColors(c, texture, blendMode) {
  // mClass(document.body, 'wood');
  if (nundef(c)){
    //pickup document.body style
    c=document.body.style.background;
    texture = document.body.style.backgroundImage;
    blendMode = document.body.style.backgroundBlendMode;
  }
  if (isEmpty(c)) c='transparent';
  if (nundef(texture)) texture = '';
  if (nundef(blendMode)) blendMode = '';
  let [bgRepeat,bgSize] = getRepeatAndSizeForTexture(texture);
  //console.log('')
  //mStyle(document.body,{'background-'}
  

  return;
  if (isdef(texture)) c = 'transparent';
  let hsl = colorHSL(c, true);
  let [hue, diff, wheel, p] = [hsl.h, 30, [], 20];
  let hstart = (hue + diff);
  for (i = hstart; i <= hstart + 235; i += 20) {
    let h = i % 360;
    let c1 = colorFromHSL(h, 100, 75);
    wheel.push(c1);
  }
  let cc = idealTextColor(c);
  let pal = colorPalette(c); pal.unshift('black'); pal.push('white');
  let palc = colorPalette(cc);
  function light(i = 3) { if (i < 0) i = 0; if (i > 5) i = 5; return pal[5 + i]; }
  function dark(i = 3) { if (i < 0) i = 0; if (i > 5) i = 5; return pal[5 - i]; }
  function simil(i = 3) { return cc == 'white' ? dark(i) : light(i); }
  function contrast(i = 3) { return cc == 'white' ? light(i) : dark(i); }
  setCssVar('--bgBody', c);
  setCssVar('--bgButton', 'transparent')
  setCssVar('--bgButtonActive', light(3))
  setCssVar('--bgNav', simil(2))
  setCssVar('--bgLighter', light())
  setCssVar('--bgDarker', dark())
  setCssVar('--fgButton', contrast(3))
  setCssVar('--fgButtonActive', cc == 'black' ? dark(2) : c)
  setCssVar('--fgButtonDisabled', 'silver')
  setCssVar('--fgButtonHover', contrast(5))
  setCssVar('--fgTitle', contrast(4))
  setCssVar('--fgSubtitle', contrast(3))
  if (nundef(texture)) return;
  //console.log('HALLO')
  mStyle(document.body, { 'background-repeat': 'repeat', 'background-image': texture })

}
function getRepeatAndSizeForTexture(t){
	if (isEmpty(t)) return ['',''];
	let bgRepeat = t.includes('marble_') ? 'no-repeat' : 'repeat';
	let bgSize = bgRepeat == 'repeat' ? 'auto' : 'cover';
	return [bgRepeat,bgSize];
}
async function onclickColor(item, items) {
  let c = item.color;//ev.target.style.background; 
  toggleItemSelection(item);//console.log('items',items)
  let selitems = items.filter(x => x.isSelected && x != item); selitems.map(x => toggleItemSelection(x));
  //console.log('c',c,typeof(c),isEmpty(c))
  if (!isEmpty(c)) c = colorHex(c);
  //if (isEmpty(c)) { console.log('color EMPTY!', item); } //ev.target.style);}
  for (const i of range(0, 9)) { mBy(`dSample${i}`).style.backgroundColor = c; }
  document.body.style.backgroundColor = c;
  // mBy('dPos').style.backgroundColor = c;
}
async function onclickTexture(item, items) {
  //console.log('item', item)
  let texture = item.bgImage; //ev.target.style.backgroundImage;
  let repeat = item.bgRepeat; //ev.target.style.backgroundRepeat;
  let bgSize = item.bgSize; //repeat == 'repeat'?'auto':'cover';
  let blendMode = item.blendMode;
  toggleItemSelection(item);
  let selitems = items.filter(x => x.isSelected && x != item); selitems.map(x => toggleItemSelection(x));
  //console.log('texture',texture,'repeat',repeat)
  //if (isEmpty(texture)) { console.log('texture EMPTY!', item); } //ev.target.style);}
  let blendModeDiv = null;
  for (const i of range(0, 9)) {
    let sample = mBy(`dSample${i}`);
    //console.log(sample.style.backgroundBlendMode, blendMode)
    if (sample.style.backgroundBlendMode == blendMode) { blendModeDiv = sample; }//console.log('YES!') }
    sample.style.backgroundImage = texture;
    sample.style.backgroundRepeat = repeat;
    sample.style.backgroundSize = bgSize;
  }
  document.body.style.backgroundImage = texture;
  document.body.style.backgroundRepeat = repeat;
  document.body.style.backgroundSize = bgSize;
  if (nundef(blendModeDiv)) return;
  blendModeDiv.click();

  //mBy('dSample0').click()
  // mBy('dPos').style.backgroundImage = texture;
  // mBy('dPos').style.backgroundRepeat = repeat;
  // mBy('dPos').style.backgroundSize = bgSize;
}
async function onclickBlendSample(item, items) {
  //console.log('CLICK!!!');//,item)
  let blendMode = item.blendMode; //ev.target.style.backgroundImage;
  toggleItemSelection(item);
  let selitems = items.filter(x => x.isSelected && x != item); selitems.map(x => toggleItemSelection(x));
  document.body.style.backgroundBlendMode = blendMode;
}

//#endregion

//#region showTable
async function showTable(table) {
  if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); }
  if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game];
  let me = getUname();

  clearMain(); 

}
async function ____showTable(table) {
  if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); }
  let func = DA.funcs[table.game];
  let me = getUname();

  clearMain(); //INTERRUPT();

  if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
  else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

  Clientdata.table = table; //console.log(table);
  TPrev = T; T={table,me};

  let d=T.dMain=mBy('dMain');//mClass(d,'wood')
  let dInstruction = T.dInstruction=mDom(d,{className:'instruction'},{html:`Waiting for ${table.fen.turn.join(', ')}`});  
  mCenterFlex(dInstruction);
  // let dTitle=T.dTitle=mDom(d,{fz:'2em',weight:'bold',padding:'10'},{html:table.friendly,classes:'title'});
  let dTitle=T.dTitle=mDom(d,{},{html:table.friendly});
  let dGameover=T.dGameover=mDom(d);
  let dStats=T.dStats=mDom('dMain');
  let dOpenTable=T.dOpenTable=mDom(d);
  // showRibbon(d,"this is the game!")
  //showMessage('HALLO this is a message');
  let dt=testUpdateTestButtons(dTitle); mStyle(dt,{matop:4});

  func.present(T);
  func.showStats(T);
  mRise(d);

  
}
async function ___showTable_rest(table){
  //showTitle(`${table.friendly}`);
  mStyle('dTitle',{display:'flex',justify:'space-between'})
  mDom('dTitle',{fz:'2em',weight:'bold',maleft:10,display:'inline'},{html:table.friendly,classes: 'title'});
  let dOver=mDom('dMain',{},{id:'dGameover'})


  
  T = func.present('dMain', table, me); //console.log('TPrev',TPrev,'T',T);
  func.showStats(T);
  mRise('dMain');

  if (TESTING) testUpdateTestButtons();

  if (table.status == 'over') return showGameover(table,dOver);
  else if (func.checkGameover(table)) return await sendMergeTable(table);
  
  if (!table.fen.turn.includes(me)) {staticTitle(table); return;}

  animatedTitle();
  
  let playmode = getPlaymode(table, me); 
  if (playmode == 'bot') return await func.botMove(T);
  else return await func.activate(T);
}
//#endregion 

//#region button96
function button96() {
  function setup(table) {
    let fen = {};
    fen.players = {};
    for (const name in table.players) {
      let pl = fen.players[name] = table.players[name];
      pl.color = getUserColor(name)
      pl.score = 0;
    }
    fen.number = 0;
    fen.plorder = jsCopy(table.playerNames);
    fen.turn = jsCopy(table.playerNames);
    delete table.players;
    return fen;
  }
  function checkGameover(table) {
    let score_sum = calcScoreSum(table);
    //console.log('___check score sum',score_sum);
    if (score_sum >= 5) {
      table.winners = getPlayersWithMaxScore(table.fen);
      table.status = 'over';
      return true;
    } else return false;
    //return table.playerNames.some(x => x.score == table.options.winning_score);
  }
  function present(T) {
    // //assumes that me is player at this table!!!
    // //assertion(calcScoreSum(table) == table.fen.number, "SCORE MISMATCH!!!! present")
    // //mClear(dParent);
    // let dInstruction = mDom(dParent,{className:'instruction'},{html:`Waiting for ${table.fen.turn.join(', ')}`});
    // let dStats = mDom(dParent);
    // let div = mDom(dParent, { margin: 12, align: 'center' }, { id: 'dGameDiv' }); //for shield! 

    // let bYes = mDom(div, { fz: 100, wmin: 200, margin:10, className: 'button' }, { tag: 'button', html: `Step:${table.step}` });
    // let bNo = mDom(div, { fz: 100, wmin: 200, margin:10,className: 'button' }, { tag: 'button', html: `Error!` });

    // if (nundef(name)) name=getUname(); //eingeloggter user perspective is default!

    // return { div, bYes, bNo, dInstruction, dStats, table, name };
  }
  function showStats(T){ button96Stats(T);}
  async function activate(T) {
    dInstruction.innerHTML = "click one of the buttons!"
    T.bYes.onclick = () => button96OnclickYes(T, true);
    T.bNo.onclick = () => button96OnclickNo(T, true);
  }
  async function botMove(T) {
    TO.button = setTimeout(() => button96BotMove(T), rChoose([1000, 2000, 3000]));
  }
  return { setup, activate, checkGameover, present, showStats, botMove };
}
function button96Stats(T){
  let [fen,name,dStats]=[T.table.fen,T.name,T.dStats];
  let layout = 'rowflex';
  let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
  let player_stat_items = uiTypePlayerStats(fen, name, dStats, layout, style)
  for (const plname in fen.players) {
    let pl = fen.players[plname];
    let item = player_stat_items[plname];
    if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
    let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
    playerStatCount('star', pl.score, d);
  }
}
async function button96OnclickYes(T, direct = false) {
  let b = T.bYes;
  if (direct) clearEvents();
  disableUI(); //disableButton(b);

  await sendRaceStepScore(T.table, T.name);
}
async function button96OnclickNo(T, direct = false) {
  let b = T.bNo;
  if (direct) clearEvents();
  disableUI(); //disableButton(b);

  await sendRaceError(T.table,T.name);
}
async function button96BotMove(T) {
  if (coin(80)) await button96OnclickYes(T); else await button96OnclickNo(T);
} 
//#endregion