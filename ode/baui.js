
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
		let items = []; //console.log(pl.cards)
		for (const fencard of pl.cards) { 
			//console.log(cinfo)
			let ocard = wsItemFromFen(fencard); //console.log(fencard,ocard) 
			wsShowCardItem(ocard,dCards,.5);
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
function wsFenFromItem(item) {
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
function wsFromNormalized(s, sep = '_') {
  let x = replaceAll(s, sep, ' '); return x;
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

	let src=valf(files[key],key == 'food'?files[rChoose(keys)]:null);
	if (src) return  mDom(dParent, styles, { tag: 'img', width: sz, height: sz, src: files[valf(key, rChoose(keys))] });

	let o=M.superdi[key];
	return showim2(key,dParent,styles);
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
//#_endregion
