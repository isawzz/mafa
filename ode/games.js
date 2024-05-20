//#region setgame
async function setActivate(items) {
	try {
		T.sets = setFindAllSets(items);
		[T.bNoSet, T.bHint] = setShowButtons(items);
		setActivateCards(items);
		let use_level = getGameOption('use_level'); if (use_level == 'no') { T.bHint.remove(); return; }
		let level = getPlayerProp('level');
		let noset = isEmpty(T.sets);
		T.numHints = level <= 3 ? noset ? 1 : 2 : level <= 5 ? 1 : 0;
		if (level > 5) { T.bHint.remove(); }
		else if (level == 1) { T.autoHints = noset ? 1 : 2; T.hintTimes = [noset ? 10000 : 2000, 5000]; }
		else if (level == 2) { T.autoHints = noset ? 1 : 2; T.hintTimes = [noset ? 10000 : 3000, 8000]; }
		else if (level == 3) { T.autoHints = 1; T.hintTimes = [noset ? 10000 : 4000]; }
		else if (level == 4) { T.autoHints = 1; T.hintTimes = [noset ? 10000 : 8000]; }
		let i = 0;
		while (i < T.autoHints) {
			await mSleep(T.hintTimes[i]);
			if (checkInterrupt(items)) { console.log(`autoHint ${i}`); return; }
			if (DA.stopAutobot == true) { console.log(`autoHint ${i}`); return; }
			await setOnclickHint(items);
			i++;
		}
	} catch { console.log('human: please reload!') }
}
function setActivateCards(items) {
	for (const item of items) {
		let d = iDiv(item);
		d.onclick = () => setOnclickCard(item, items, true);
		mStyle(d, { cursor: 'pointer' })
	}
}
async function setBotMove(table) {
	try {
		let items = T.items;
		[T.bNoSet, T.bHint] = setShowButtons(items); T.bHint.remove();
		mShield(dOpenTable, { bg: '#00000010' });
		let speed = calcBotSpeed(table); console.log('speed', speed);
		T.sets = setFindAllSets(items);
		if (isEmpty(T.sets)) {
			speed *= 3;
			await mSleep(speed); if (checkInterrupt(items)) { console.log('!sleep noset'); return; }
			await setOnclickNoSet(items);
		} else {
			let list = rChoose(T.sets);
			await mSleep(speed); if (checkInterrupt(items)) { console.log('!sleep 1'); return; }
			await setOnclickCard(list[0], items);
			await mSleep(speed); if (checkInterrupt(items)) { console.log('!!sleep 2'); return; }
			await setOnclickCard(list[1], items);
			await mSleep(speed); if (checkInterrupt(items)) { console.log('!!!sleep 3'); return; }
			await setOnclickCard(list[2], items);
		}
		console.log('* END OF AUTOMOVE *');
	} catch { console.log('please reload!') }
}
function setCheckIfSet(keys) {
	let arr = makeArrayWithParts(keys);
	let isSet = arr.every(x => arrAllSameOrDifferent(x));
	return isSet;
}
function setDrawCard(card, dParent, colors, sz = 100) {
	const paths = {
		diamond: "M25 0 L50 50 L25 100 L0 50 Z",
		squiggle: "M38.4,63.4c2,16.1,11,19.9,10.6,28.3c1,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
		oval: "M25,95C14.2,95,5.5,85.2,5.5,80V20C5.5,13.2,14.2,5.2,25,5.2S44.5,13.2,44.5,20v60 C44.5,85.2,35.8,95,25,95z"
	}
	let [color, shape, num, fill] = card.split('_');
	var attr = {
		d: paths[shape],
		fill: fill == 'striped' ? `url(#striped-${color})` : fill == 'solid' ? colors[color] : 'none',
		stroke: colors[color],
		'stroke-width': 2,
	};
	let h = sz, w = sz / .65;
	let ws = w / 4;
	let hs = 2 * ws;
	let d0 = mDom(dParent, { display: 'flex', w, h, bg: 'white', rounding: 10 });
	mStyle(d0, { justify: 'center', 'align-items': 'center', gap: 6 })
	let shapeSvg = `<svg viewbox="-2 -2 54 104">` + makeSVG("path", attr) + '</svg>';
	for (const i of range(num)) {
		let d1 = mDom(d0, { h: hs, w: ws }, { html: shapeSvg });
	}
	return d0;
}
function setFindAllSets(items) {
	let result = [];
	for (var x = 0; x < items.length; x++) {
		for (var y = x + 1; y < items.length; y++) {
			for (var z = y + 1; z < items.length; z++) {
				assertion(items[x] != items[y], `WTF!?!?!?! ${items[x].key} ${items[y].key}`)
				let list = [items[x], items[y], items[z]];
				let keys = list.map(x => x.key);
				if (setCheckIfSet(keys)) result.push(list);
			}
		}
	}
	if (isEmpty(result)) console.log('no set!')
	return result;
}
function setGameover(table) {
	table.status = 'over';
	table.winners = getPlayersWithMaxScore(table);
}
function setHintHide() { mClass(T.bHint, 'disabled'); } //mStyle(T.bHint,{display:'hidden'}); } //T.bHint.remove();}

function setLoadPatterns(dParent, colors) {
	dParent = toElem(dParent);
	let id = "setpatterns";
	if (isdef(mBy(id))) { return; }
	let html = `
    <svg id="setpatterns" width="0" height="0">
      <!--  Define the patterns for the different fill colors  -->
      <pattern id="striped-red" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M-1,1 H5" style="stroke:${colors.red}; stroke-width:1" />
      </pattern>
      <pattern id="striped-green" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M-1,1 H5" style="stroke:${colors.green}; stroke-width:1" />
      </pattern>
      <pattern id="striped-purple" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M-1,1 H5" style="stroke:${colors.purple}; stroke-width:1" />
      </pattern>
    </svg>
    `;
	let el = mCreateFrom(html);
	mAppend(dParent, el)
}
async function setOnclickCard(item, items, direct = false) {
	if (checkInterrupt(items)) { console.log('!!!onclick card!!!'); return; }
	else if (direct) stopAutobot();
	else if (!direct && item.isSelected) { console.log('already clicked!'); return; }
	else if (DA.stopAutobot == true) { assertion(!direct, 'direct and autobot true'); return; }
	toggleItemSelection(item);
	let selitems = items.filter(x => x.isSelected);
	let [keys, m] = [selitems.map(x => x.key), selitems.length];
	let olist = [];
	if (m == 3) {
		clearEvents();
		mShield(dOpenTable, { bg: '#00000000' }); //disable ui
		let [me, table] = [getUname(), T];
		let [fen, pl] = [table.fen, table.players[me]];
		let isSet = setCheckIfSet(keys);
		if (isSet) {
			assertion(fen.cards.length >= table.options.numCards || isEmpty(fen.deck), `LOGISCHER IRRTUM SET REPLENISH ${fen.cards.length}, deck:${fen.deck.length}`)
			let toomany = Math.max(0, fen.cards.length - table.options.numCards);
			let need = Math.max(0, 3 - toomany);
			let newCards = deckDeal(fen.deck, need);
			for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, keys[i], newCards[i]); else removeInPlace(fen.cards, keys[i])
			olist.push({ keys: ['fen', 'cards'], val: table.fen.cards });
			olist.push({ keys: ['fen', 'deck'], val: table.fen.deck });
			pl.score++;
			pl.incScore = 1;
		} else {
			pl.score--;
			pl.incScore = -1;
		}
		olist.push({ keys: ['players', me, 'score'], val: pl.score });
		if (pl.playmode == 'bot') {
			await mSleep(500);
			if (checkInterrupt(items)) { console.log('!!!onclick card!!!'); return; }
		}
		let res = await sendMergeTable({ id: table.id, name: me, olist }); // console.log('res', res)
	}
}
async function setOnclickHint(items, direct = false) {
	assertion(T.numHints > 0, 'NO Hints left!!!!');
	if (direct) stopAutobot();
	T.numHints -= 1;
	if (isEmpty(T.sets)) {
		let elem = T.bNoSet;
		T.numHints = 0; setHintHide();
		ANIM.button = scaleAnimation(elem);
		return;
	} else if (nundef(T.hintSet)) {
		T.hintSet = rChoose(T.sets);
	} else {
		let sofar = T.items.filter(x => x.isSelected);
		if (sofar.length >= 2) {
			return;
		}
	}
	let item = T.hintSet.find(x => !x.isSelected);
	if (!T.numHints) setHintHide();
	await setOnclickCard(item, T.items, direct);
}
async function setOnclickNoSet(items, direct = false) {
	if (direct) stopAutobot();
	mShield(dOpenTable, { bg: '#00000000' }); //disable ui
	let b = T.bNoSet; mClass(b, 'framedPicture')
	let [me, table] = [getUname(), T];
	let [fen, pl] = [table.fen, table.players[me]];
	let olist = [];
	if (isEmpty(T.sets)) {
		pl.score++;
		pl.incScore = 1;
		let newCards = deckDeal(fen.deck, 1);
		if (!isEmpty(newCards)) {
			fen.cards.push(newCards[0]);
			olist.push({ keys: ['fen', 'cards'], val: table.fen.cards });
			olist.push({ keys: ['fen', 'deck'], val: table.fen.deck });
		} else {
			setGameover(table);
			olist.push({ keys: ['status'], val: table.status });
			olist.push({ keys: ['winners'], val: table.winners });
			console.log(`table status is now ${table.status}`);
			assertion(table.status == 'over', "HAAAAAAAAALLLLLLLO")
		}
	} else {
		pl.score--;
		pl.incScore = -1;
	}
	olist.push({ keys: ['players', me, 'score'], val: pl.score });
	if (pl.playmode == 'bot') {
		await mSleep(500);
		if (checkInterrupt(items)) { console.log('!!!onclick noset!!!'); return; }
	}
	let res = await sendMergeTable({ id: table.id, name: me, olist });
}
async function setPresent(dParent, table) {
	const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' }; 
	setLoadPatterns('dPage', colors);
	mClear(dParent);
	let d = mDom(dParent, { margin: 10 }); 
	[dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(d);
	let [fen, playerNames, players, turn] = [table.fen, table.playerNames, table.players, table.turn];
	let cards = fen.cards;
	let dp = mDom(dOpenTable, { w100: true }); mCenterFlex(dp);
	let dBoard = T.dBoard = mGrid(cards.length / 3, 3, dp, { gap: 14 });
	let items = [];
	for (const c of cards) {
		let d = setDrawCard(c, dBoard, colors, TESTING ? 80 : 100);
		let item = mItem({ div: d }, { key: c });
		items.push(item);
	}
	setStats(table, dOben, 'rowflex', false);
	return items;
}
function setShowButtons(items) {
	let buttons = mDom(dOpenTable, { w100: true, gap: 10, matop: 20 }); mCenterCenterFlex(buttons);
	let bno = mButton('NO Set', () => setOnclickNoSet(items, true), buttons, { w: 80 }, 'input');
	let bhint = mButton('Hint', () => setOnclickHint(items, true), buttons, { w: 80 }, 'input');
	return [bno, bhint];
}
function setStats(table, dParent, layout, showTurn = true) {
	let [fen, me] = [table.fen, getUname()];
	let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
	let player_stat_items = uiTypePlayerStats(table, me, dParent, layout, style)
	let uselevel = getGameOption('use_level');
	let botLevel = Math.floor(calcBotLevel(table));
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		let item = player_stat_items[plname];
		if (pl.playmode == 'bot') {
			let c = getLevelColor(botLevel);
			mStyle(item.img, { rounding: 0, border: `${c} ${botLevel}px solid` });
		}
		let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
		playerStatCount('star', pl.score, d);
		if (uselevel != 'yes') continue;
		mDom(d, { fz: 11, round: true, hpadding: 3, fg: 'contrast', bg: getLevelColor(pl.level), position: 'absolute', top: 1, right: 2 }, { html: pl.level })
	}
}

//#endregion

