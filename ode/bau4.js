
function arrFindKeywordFromIndex(keywords, words, iStart) {
	//console.log(keywords,words,iStart)
	for (let i = iStart; i < words.length; i++) {
		let w = words[i];
		if (keywords.some(x => x == w)) return { i, w };
	}
	return null;
}
function stringSplit(input) {
  // Split the string at any whitespace character or comma
  return input.split(/[\s,]+/);
}
function showInfoCard(key, d) {

	let o = getDetailedSuperdi(key);

	let sz = 400;
	let [yTitle, yPic, szPic] = [8, sz / 5, sz / 2];
	let [yLifespan, yBrown, hTop] = [yPic + szPic, yPic + szPic + 22, yPic];

	let card = cBlank(d, { h: sz, border: 'dimgray' });
	let dCard = iDiv(card);// console.log(card);

	let d1 = showim1(key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tc', 0, yPic);

	let title = fromNormalized(o.friendly);
	let dtitle = mDom(dCard, { display: 'inline', weight: 'bold' }, { html: title });
	mPlace(dtitle, 'tc', 0, yTitle);

	let lifespan = calcLifespan(o.lifespan);// console.log('lifespan',lifespan);
	let dlifespan = mDom(dCard, { display: 'inline' }, { html: lifespan.lifespan })
	mPlace(dlifespan, 'tr', 40, yLifespan);

	let dbrown = mDom(dCard, { matop: yBrown, w100: true, bg: 'sienna', fg: 'white', padding: 10, box: true }, { html: 'WHEN ACTIVATED: All players gain 1 food from supply.' })

	let foodtype = extractFoodType(o.food); //console.log(key,foodtype)
	let difood = { omnivorous: 'pot_of_food', carnivorous: 'poultry_leg', herbivorous: 'seedling', insectivorous: 'ant' }
	let dfood = mDom(dCard); //,{bg:'silver',round:true,}); //,{},{html:foodtype});
	showim1(difood[foodtype], dfood, { sz: 30 });
	mPlace(dfood, 'tl', 10, 0)

	let weight = calcNumericInfo(o.weight, { kg: 1000, g: 1, mg: .001 }, 'kg');
	let size = calcNumericInfo(o.size, { cm: .01, centimeter: .01, mm: .001, millimeter: .001, meter: 1, m: 1 }, 'm');
	let offs = calcOffsprings(o.offsprings);

	o.foodType = foodtype;
	o.difood = difood;
	o.weight = weight;
	o.size = size;
	o.offsprings = offs;
	//console.log(key,offs.text);

	addKeys(card, o)
	//mLinebreak(d)

	return o;

}

function fishgame() {

	function setup(table) {
		let fen = {};
		fen.deck = rChoose(M.byCollection.tierspiel, 170); //range(4, table.options.numCards); //[4, 5, 6, 7, 8, 9, 10];
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
			pl.cards = deckDeal(fen.deck, 5);
		}
		//fen.cards = [1, 2, 3];
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function stats(table) {
		let [me, players] = [getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'rowflex', style)
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

		mStyle(d, { hmin: 500, w: '90%', margin: 20 }); //, bg:'#ffffffaa'}); // bgImage:`url('../assets/textures/marble_water.jpg')` });
		d.innerHTML = ' ';

		let me = getUname();
		let pl = table.players[me];

		let dCards = mDom(d, { gap: 8 }); mCenterFlex(dCards);
		for (const c of pl.cards) {
			//let d1=mDom(dCards, {w:100,h:100,bg:U.color})
			showImageCard(c, dCards, { bg: U.color }); //, {sz:100,border:})
		}
		//mach eine animal card
		//wie geht das?
		//console.log(M.byCat.animal)



		//mBy('dTable').remove(); 
		//let dTable = 
	}
	function restPresent(table) {
		let dTable = mBy(dTable); mClassRemove(dTable, 'wood');
		mStyle('dTable', { padding: 25, w: 400, h: 400, rounding: 0 }); //, bgImage:'../assets/textures/' });
		let d = mDom('dTable', { gap: 10, padding: 0 }); mCenterFlex(d);
		let items = [];
		for (const card of fen.cards) {
			let item = cNumber(card);
			mAppend(d, iDiv(item));
			items.push(item);
		}
		return items;
	}
	async function activate(table, items) {
		return;
		await instructionStandard(table); //browser tab and instruction if any

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
function showImageCard(key, dParent, styles = {}, opts = {}) {
	let d = mDom(dParent, styles, opts);
	let o = M.superdi[key];
	console.log(o);
	let d1 = showImage1(key, d);
}
function showImage1(key, dParent, styles = {}, useSymbol = false) {
	let o = M.superdi[key];
	assertion(o, `showImage:key not found ${key}`);
	let [w, h] = mSizeSuccession(styles); console.log(w, h)
	let [sz, fz] = [.9 * w, .8 * h];
	addKeys({ position: 'relative', w, h, padding: 11, box: true }, styles)
	let d1 = mDiv(dParent, styles);//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	if (!useSymbol && isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: hline, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz - 2, hline: hline, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoGame', bg: valf(styles.bg, 'beige'), fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'contain', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	assertion(el, 'PROBLEM mit' + key);
	return d1;
}













