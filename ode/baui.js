
//TODO
function fishgame() {

	function setup(table) {
		let fen = {};
		fen.deck = jsCopy(M.byCollection.tierspiel).map(x=>wsGenerateCardInfo(x)); //rChoose(M.byCollection.tierspiel, 170); //range(4, table.options.numCards); //[4, 5, 6, 7, 8, 9, 10];
		arrShuffle(fen.deck);
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
			pl.cards = deckDeal(fen.deck, 5);
		}
		//fen.cards = [1, 2, 3];
		fen.round=0;
		fen.phase='init';
		fen.stage='pick_cards';
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function stats(table) {
		let [me, players] = [getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dRight', 'colflex', style)
		for (const plname in players) {
			let pl = players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d); //, {}, {id:`stat_${plname}_score`});
		}
	}
	function present(table) {
		let fen = table.fen;
		let d = mBy('dTable');
		d.style = '';
		d.className = '';

		mStyle(d, { hmin: 500, w: '90%', margin: 20 }); 
		d.innerHTML = ' '; mCenterFlex(d)

		let me = getUname();
		let pl = table.players[me];

		let dCards = mDom(d, { gap: 8 }); mCenterFlex(dCards);
		let items = [];
		for (const cinfo of pl.cards) {
			console.log(cinfo)
			let ocard = wsFromCardInfo(cinfo,dCards,.5);
			// let o = getDetailedSuperdi(key); 
			// let ocard = showCardWingspanPortrait(o,dCards,250);
			items.push(ocard);
		}

		mLinebreak(d,25)

		let dBoard = mDom(d);
		mDom(dBoard,{},{tag:'img',src:'../assets/games/wingspan/board.jpg'});

		return items;
	}
	async function activate(table, items) {

		await instructionStandard(table,'may pick your initial cards'); //browser tab and instruction if any

		for(const item of items){
			let d=iDiv(item);
			d.onclick = wsOnclickCard;
			//console.log(item)
		}

		//dBoard.

		return;

		if (!isMyTurn(table)) { return; } //console.log('table.turn',table.turn); 

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item, items);
		}

		//check end condition
		if (isEmpty(table.fen.cards)) return gameoverScore(table);

		//bot move activation: in solo mode OR if user is a bot
		if (amIHuman(table) && table.options.gamemode == 'multi') return;

		let name = amIHuman(table) && table.options.gamemode == 'solo' ? someOtherPlayerName(table) : getUname();
		if (nundef(name)) return; //console.log('bot name',name)

		await botMove(name, table, items);
	}
	async function botMove(name, table, items) {
		let ms = rChoose(range(2000, 5000));

		TO.bot = setTimeout(async () => {
			let item = rChoose(items);
			toggleItemSelection(item);
			TO.bot1 = setTimeout(async () => await evalMove(name, table, item.key), 500);

		}, rNumber(ms, ms + 2000));

	}

	async function onclickCard(table, item, items) {
		toggleItemSelection(item);
		try { await mSleep(200); } catch (err) { return; }
		await evalMove(getUname(), table, item.key);
	}
	async function evalMove(name, table, key) {
		clearEvents();
		mShield('dTable', { bg: 'transparent' });
		let id = table.id;
		let step = table.step;

		let best = arrMinMax(table.fen.cards).min;
		let succeed = key == best;
		if (succeed) {
			table.players[name].score += 1;

			//calc how to replace cards from set
			let fen = table.fen;
			let newCards = deckDeal(fen.deck, 1);
			if (newCards.length > 0) arrReplace1(fen.cards, key, newCards[0]); else removeInPlace(fen.cards, key);
		} else {
			table.players[name].score -= 1;
		}
		lookupAddToList(table, ['moves'], { step, name, move: key, change: succeed ? '+1' : '-1', score: table.players[name].score });

		let o = { id, name, step, table };

		if (succeed) o.stepIfValid = step + 1;

		let res = await mPostRoute('table', o);
	}
	return { setup, present, stats, activate };

}

async function wsOnclickCard(table,item,items){}
async function wsPreAction(table,items){

	let [fen,me] = [table.fen,getUname()]
	let [phase,stage,round,pl,plorder,turn]=[fen.phase,fen.stage,fen.round,table.players[me],table.plorder,table.turn];

	console.log()
}


//#region ws cards
function wsCard(d, w, h) {
  let card = cBlank(d, { h, w, border: 'silver' }); //return;
  let dCard = iDiv(card);
  return [card, dCard];
}
function wsCardInfo(item) {
  return `${item.key}@${item.valueFactor}@${normalizeString(item.power, '_', [':', '.'])}@${item.colorPower}@${item.abstract}@${item.colorSym}@${item.op}`;
}
function wsFood(tokens, op, dtop, sz) {

  let d = mDom(dtop); mCenterCenterFlex(d);
  let ch = op; //tokens.length >= 2 && coin() ? '/' : '+';
  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    let d1 = wsPrintSymbol(d, sz, t);
    if (i < tokens.length-1) mDom(d, { fz: sz * .7,weight:'bold' }, { html: ch });
  }
}
function wsFromCardInfo(s, d, sz) {
  let [key, valueFactor, power, colorPower, sym, colorSym,op] = s.split('@');
  power = wsFromNormalized(power); //console.log('power',power)
  power = stringBefore(power, ':').toUpperCase() + ':' + stringAfter(power, ':');
  return wsShowCard(key, d, sz, Number(valueFactor), power, colorPower, sym, colorSym,op);
}
function wsFromNormalized(s, sep = '_') {
  let x = replaceAll(s, sep, ' '); return x;
}
function wsGenerateCardInfo(key) {
  let bg = rChoose(['white', 'sienna', 'pink', 'lightblue']);
  let palette = ['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
  let fg = rChoose(palette);
  sym = getAbstractSymbol([2, 4, 8, 23, 26]);
  power = 'WHEN ACTIVATED: All players gain 1 food from supply.';
  valueFactor = rChoose(range(1, 3));
	op=rChoose(['+','/']); console.log('op',op)
	return wsCardInfo({key,valueFactor,power,colorPower:bg,abstract:sym,colorSym:fg,op});
}
function wsHabitat(tokens, dtop, sz) {
  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    if (i == 2) mLinebreak(dtop);
    let d = wsPrintSymbol(dtop, sz, t);
    if (i == 2) mStyle(d, { matop: -sz * 3 / 2 });
  }
}
function wsPrintSymbol(dParent, sz, key) {
	let files = {
		cherries: '../assets/games/wingspan/fruit.svg',
		fish: '../assets/games/wingspan/fish.svg',
		forest: '../assets/games/wingspan/forest1.png',
		grain: '../assets/games/wingspan/wheat.svg',
		grassland: '../assets/games/wingspan/grassland2.png',
		mouse: '../assets/games/wingspan/mouse.svg',
		omni: '../assets/games/wingspan/pie3.svg',
		seedling: '../assets/img/emo/seedling.png',
		wetland: '../assets/games/wingspan/wetland.png',
		worm: '../assets/games/wingspan/worm.svg',
	};
	let keys = Object.keys(files);
	let styles = { w: sz, h: sz, };
	if (['wetland', 'grassland', 'forest'].includes(key)) styles['clip-path'] = PolyClips.diamond;
	if (key == 'wetland') styles.bg = 'lightblue';
	else if (key == 'grassland') styles.bg = 'goldenrod';
	else if (key == 'forest') styles.bg = 'emerald';
	return mDom(dParent, styles, { tag: 'img', width: sz, height: sz, src: files[valf(key, rChoose(keys))] });
}
function wsShowCard(key, d, fa, valueFactor, power, colorPower, sym, colorSym,op) {
  let o = getDetailedSuperdi(key);
  let item = jsCopy(o);
  let [w, h, sztop, sz, gap, fz] = [340, 500, 100, 30, 8, 16].map(x => x * fa);

  let [card, dCard] = wsCard(d, w, h);
  let dtop = wsTopLeft(dCard, sztop, card.rounding);//mStyle(dtop,{h:200})
  addKeys(card, item);

  let bg = item.colorPower = valf(colorPower, rChoose(['white', 'sienna', 'pink', 'lightblue']));
  let palette = ['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
  let fg = item.colorSym = valf(colorSym, rChoose(palette)); //console.log(palette)
  sym = item.abstract = valf(sym, getAbstractSymbol([2, 4, 8, 23, 26]));
  power = valf(power, 'WHEN ACTIVATED: All players gain 1 food from supply.');
  valueFactor = item.valueFactor = valf(valueFactor, rChoose(range(1, 3)));
  let value = item.value = valueFactor * (item.op=='+'?1:o.foodTokens.length);

  //o.habTokens.push('wetland');
  wsHabitat(o.habTokens, dtop, sz * 1.1); mLinebreak(dtop, sz / 5);
  wsFood(o.foodTokens, op, dtop, sz * .8);
  wsTitle(o, dCard, sztop, fz, gap);

  let [szPic, yPic] = [h / 2, sztop + gap]
  let d1 = showim2(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
  mPlace(d1, 'tr', gap, yPic);

  let leftBorderOfPic = w - (szPic + gap);
  let dleft = mDom(dCard, { w: leftBorderOfPic, h: szPic }); mPlace(dleft, 'tl', gap / 2, sztop + gap);
  mCenterCenterFlex(dleft);

  let dval = mDom(dleft, { fg, w: sz * 1.2, align: 'center', fz: fz * 1.8, weight: 'bold' }, { html: value });
  // mPlace(dval, 'tl', sztop/2-gap,sztop+gap); //(w-szPic)/2-3*gap, sztop+gap); //mPlace(dval, 'tr', 2 * gap, gap)
  mLinebreak(dleft, 2 * gap)

  let szSym = sz * 1.5;
  let a = showim2(sym, dleft, { w: szSym, h: szSym, fg });
  // mPlace(a,'tl',sztop/2-gap,sztop*2)
  mLinebreak(dleft, 3 * gap)

  //let szPlatz = h / 30; //o.ooffsprings.num =1;
  let dPlaetze = item.live.dPlaetze = showPlaetze(dleft, o.ooffsprings.num, gap * 2); //szPlatz);
  //mPlace(dPlaetze, 'cl', (w - szPic) / 2 - 3 * gap, 5 * gap); //2*gap,gap); //(w - szPic) / 2,0);//, sztop*2); // + szPlatz);

  let dbrown = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: sztop + szPic + gap * 3, w100: true, bg, fg: 'contrast', box: true }, { html: power })
  item.power = dbrown.innerHTML;

  let dinfo = mDom(dCard, { fz, hpadding: gap, box: true, w100: true });
  mPlace(dinfo, 'bl'); mFlexLine(dinfo, 'space-between');
  mDom(dinfo, {}, { html: o.class });
  mDom(dinfo, {}, { html: o.olifespan.text });
  mDom(dinfo, {}, { html: o.osize.text });
  // let dlifespan = mDom(dCard, { fz, display: 'inline' }, { html: `${o.class.toLowerCase()} ${o.olifespan.text}` })
  // mPlace(dlifespan, 'bl', gap);

  // let dsize = mDom(dCard, { fz, display: 'inline' }, { html: o.osize.text })
  // mPlace(dsize, 'br', gap);

  // let dclass = mDom(dCard, { fz, display: 'inline' }, { html: o.class });
  // mPlace(dsize, 'br', gap);

  return item;

}
function wsTitle(o, dCard, sztop, fz, gap) {
  let dtitle = mDom(dCard, { paleft: gap, wmax: sztop * 1.5 }); mPlace(dtitle, 'tl', sztop, gap)
  mDom(dtitle, { fz: fz * 1.1, weight: 'bold' }, { html: fromNormalized(o.friendly) });
  mDom(dtitle, { fz, 'font-style': 'italic' }, { html: o.species });
}
function wsTopLeft(dCard, sztop, rounding) {
  let dtop = mDom(dCard, { w: sztop, h: sztop, bg: '#ccc' });
  mPlace(dtop, 'tl');
  dtop.style.borderTopLeftRadius = dtop.style.borderBottomRightRadius = `${rounding}px`;
  mCenterCenterFlex(dtop);
  return dtop;
}
//#endregion
