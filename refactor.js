//#region mStyle refactoring
const _STYLE_PARAMS = {
	acontent: 'align-content',
	aitems: 'align-items',
	align: 'text-align',
	aspectRatio: 'aspect-ratio',
	bg: 'background-color',
	dir: 'flex-direction',
	family: 'font-family',
	fg: 'color',
	fontSize: 'font-size',
	fz: 'font-size',
	gridCols: 'grid-template-columns',
	gridRows: 'grid-template-rows',
	h: 'height',
	hgap: 'column-gap',
	hmin: 'min-height',
	hmax: 'max-height',
	hline: 'line-height',
	jcontent: 'justify-content',
	jitems: 'justify-items',
	justify: 'justify-content',
	matop: 'margin-top',
	maleft: 'margin-left',
	mabottom: 'margin-bottom',
	maright: 'margin-right',
	origin: 'transform-origin',
	overx: 'overflow-x',
	overy: 'overflow-y',
	patop: 'padding-top',
	paleft: 'padding-left',
	pabottom: 'padding-bottom',
	paright: 'padding-right',
	place: 'place-items',
	rounding: 'border-radius',
	valign: 'align-items',
	vgap: 'row-gap',
	w: 'width',
	wmin: 'min-width',
	wmax: 'max-width',
	weight: 'font-weight',
	x: 'left',
	xover: 'overflow-x',
	y: 'top',
	yover: 'overflow-y',
	z: 'z-index'
};

function mStyle(elem, styles = {}, unit = 'px') {
	//remove: rest,wrest,hrest,whrest
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
		//console.log('margin should be',styles.margin)
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
		if (isdef(_STYLE_PARAMS[k])) key = _STYLE_PARAMS[k];
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
		else if (key == 'background-color') elem.style.background = bg;
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

// *** broken code *** (params zu activate, botMove, geaendert: T enthaelt jetzt table und name)
//#region button97
function button97() {
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
    if (score_sum >= 10) {
      table.winners = getPlayersWithMaxScore(table.fen);
      table.status = 'over';
      return true;
    } else return false;
    //return table.playerNames.some(x => x.score == table.options.winning_score);
  }
  async function checkValid(table){return false;} //deprecated

  function present(dParent, table) {
    //assertion(calcScoreSum(table) == table.fen.number, "SCORE MISMATCH!!!! present")
    mClear(dParent);
    let dStats = mDom(dParent);
    let div = mDom(dParent, { margin: 12,align:'center' })
    let bYes = mDom(div, { fz: 100, wmin: 200, className: 'button' }, { tag: 'button', html: `Step:${table.step}` });
    let bNo = mDom(div, { fz: 100, wmin: 200, className: 'button' }, { tag: 'button', html: `Error!` });

    //setStats(table, dOben, 'rowflex', false);
    let layout = 'rowflex';
    let [fen, me] = [table.fen, getUname()];
    let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
    let player_stat_items = uiTypePlayerStats(fen, me, dStats, layout, style)
    for (const plname in fen.players) {
      let pl = fen.players[plname];
      let item = player_stat_items[plname];
      if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
      let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
      playerStatCount('star', pl.score, d);
    }

    return { div, bYes, bNo };
  }
  async function activate(table, T, me) {
    T.bYes.onclick = () => button97OnclickYes(table, T, me, true);
    T.bNo.onclick = () => button97OnclickNo(table, T, me, true);
  }
  async function botMove(table, T, name) {
    TO.button = setTimeout(() => button97OnclickBot(table,T,name), rChoose([1000,2000,3000]));
  }
  return { setup, activate, checkGameover, checkValid, present, botMove };
}
async function button97OnclickYes(table, T, me, direct = false) {
  let b = T.bYes;
  if (direct) clearEvents();
  disableButton(b);

  let step = table.step+1;

  let data = {
    id: table.id,
    name: me,
    step,
    olist: [
      { keys: ['step'], val: step },
      { keys: ['fen', 'players', me, 'score'], val: table.fen.players[me].score + 1 }
    ]
  }
  let res = await sendMergeTable(data,'race');
}
async function button97OnclickNo(table, T, me, direct = false) {
  let b = T.bNo;
  if (direct) clearEvents();
  disableButton(b);

  let errors = 1;

  let data = {
    id: table.id,
    name: me,
    errors,
    olist: [
      { keys: ['fen', 'players', me, 'score'], val: table.fen.players[me].score - errors },
      { keys: ['fen', 'players', me, 'errors'], val: valf(table.fen.players[me].errors,0) + errors }
    ]
  }
  let res = await sendMergeTable(data,'race');
}
async function button97OnclickBot(table,T,name){
  if (coin()) await button97OnclickYes(table, T, name); else await button97OnclickNo(table, T, name);
} 
//#endregion
//#region button98
function button98() {
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
    if (score_sum >= 10) {
      table.winners = getPlayersWithMaxScore(table.fen);
      table.status = 'over';
      return true;
    } else return false;
    //return table.playerNames.some(x => x.score == table.options.winning_score);
  }
  async function checkValid(table){return false;} //deprecated

  function present(dParent, table) {
    //assertion(calcScoreSum(table) == table.fen.number, "SCORE MISMATCH!!!! present")
    mClear(dParent);
    let dStats = mDom(dParent);
    let div = mDom(dParent, { margin: 12,align:'center' })
    let button = mDom(div, { fz: 100, wmin: 200, className: 'button' }, { tag: 'button', html: table.fen.number });

    //setStats(table, dOben, 'rowflex', false);
    let layout = 'rowflex';
    let [fen, me] = [table.fen, getUname()];
    let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
    let player_stat_items = uiTypePlayerStats(fen, me, dStats, layout, style)
    for (const plname in fen.players) {
      let pl = fen.players[plname];
      let item = player_stat_items[plname];
      if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
      let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
      playerStatCount('star', pl.score, d);
    }

    return { div, button };
  }
  async function activate(table, T, me) {
    let b = T.button;
    b.onclick = () => button98Onclick(table, T, me, true);
  }
  async function botMove(table, T, name) {
    TO.button = setTimeout(() => button98Onclick(table, T, name), rChoose([1000,2000,3000]));
  }
  return { setup, activate, checkGameover, checkValid, present, botMove };
}
async function button98Onclick(table, T, me, direct = false) {
  let b = T.button;
  if (direct) clearEvents();
  disableButton(b);
  assertion(Number(b.innerHTML) == table.fen.number, "NUMBER MISMATCH onclick");

  //only correct clicks are sent
  let step = table.step+1;
  let number = step;

  let data = {
    id: table.id,
    name: me,
    step,
    olist: [
      { keys: ['step'], val: step },
      { keys: ['fen', 'number'], val: number },
      { keys: ['fen', 'players', me, 'score'], val: table.fen.players[me].score + 1 }
    ]
  }
  let res = await sendMergeTable(data,'race');
  //console.log('res',res) nicht gebraucht weil sendMergeTable calls showTable(table)!!!

}
//#endregion
//#region button99
function button99() {
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
    if (score_sum >= 10) {
      table.winners = getPlayersWithMaxScore(table.fen);
      table.status = 'over';
      return true;
    } else return false;
    //return table.playerNames.some(x => x.score == table.options.winning_score);
  }
  async function checkValid(table){
    let sum = calcScoreSum(table)
    let fen=table.fen;
    let [num,lastName,numClicked]=[fen.number,fen.lastName,fen.numClicked];
    let scores = table.playerNames.map(x=>fen.players[x].score).join(',')
    if (sum!=num){
      console.log('____checkValid\nnumber',num,'\nsum',sum,'\nplayer',lastName,'\nclicked on',numClicked,'\nscores',scores);
      //only wrong player correcting result!
      if (getUname()==table.owner) {
        fen.players[lastName].score-=1;
        await sendMergeTable(table);      
      }
      return false;
    }
    return true;
  }

  function present(dParent, table) {
    //assertion(calcScoreSum(table) == table.fen.number, "SCORE MISMATCH!!!! present")
    mClear(dParent);
    let dStats = mDom(dParent);
    let div = mDom(dParent, { margin: 12,align:'center' })
    let button = mDom(div, { fz: 100, wmin: 200, className: 'button' }, { tag: 'button', html: table.fen.number });

    //setStats(table, dOben, 'rowflex', false);
    let layout = 'rowflex';
    let [fen, me] = [table.fen, getUname()];
    let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
    let player_stat_items = uiTypePlayerStats(fen, me, dStats, layout, style)
    for (const plname in fen.players) {
      let pl = fen.players[plname];
      let item = player_stat_items[plname];
      if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
      let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
      playerStatCount('star', pl.score, d);
    }

    return { div, button };
  }
  async function activate(table, T, me) {
    let b = T.button;
    b.onclick = () => button99Onclick(table, T, me, true);
  }
  async function botMove(table, T, name) {
    TO.button = setTimeout(() => button99Onclick(table, T, name), rChoose([1000,2000,3000]));
  }
  return { setup, activate, checkGameover, checkValid, present, botMove };
}
async function button99Onclick(table, T, me, direct = false) {
  let b = T.button;
  if (direct) clearEvents();
  disableButton(b);
  assertion(Number(b.innerHTML) == table.fen.number, "NUMBER MISMATCH onclick");

  let newsum=calcScoreSum(table)+1;
  let newnum=table.fen.number+1;
  if (newsum>newnum){console.log('INVALID!!!','newsum',newsum,'newnum',newnum);return;}
  let step = table.step+1;

  let data = {
    id: table.id,
    name: me,
    step,
    olist: [
      { keys: ['step'], val: step },
      { keys: ['fen', 'numClicked'], val: Number(b.innerHTML) },
      { keys: ['fen', 'number'], val: table.fen.number + 1 },
      { keys: ['fen', 'lastName'], val: me },
      { keys: ['fen', 'players', me, 'score'], val: table.fen.players[me].score + 1 }
    ]
  }
  let res = await sendMergeTable(data,'race');
  //console.log('res',res) nicht gebraucht weil sendMergeTable calls showTable(table)!!!

}
//#endregion
