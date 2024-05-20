
//#region 20.mai 24: discarded set functions
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

//#region 19.mai 24: calcHeightLeftUnder('dExtra')

//#region 19.mai 24: resolvePending wird wieder eliminiert! hier die version mit resolvePending:
async function showTable(id) {
	//INVALID TABLES KOMMEN GARNICHT HIERHER!!!
	let me = getUname();
	let table = await mGetRoute('table', { id });	//console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game];

	if (table.status == 'started' && isdef(table.pending)) {
		func.resolvePending(table); // deterministic!!! (table.pending)
		if (table.status == 'over') { mPostRoute('postTable', table); return; }
	}

	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2>${table.friendly} (${table.step})</h2>`; // title

	//let tableSize = calcHeightLeftUnder('dExtra') - 40; //height visible in browser
	d = mDom('dMain'); mCenterFlex(d); 

	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction

	mDom(d, {}, { id: 'dStats' }); mLinebreak(d); func.stats(table); // player stats

	let minTableSize = 400; // present
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);

	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }

	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);

	await updateTestButtonsPlayers(table); // right side buttons

	func.activate(table, items); // activate

}
function setgame() {

	function setup(table) {
		//console.log('setup',table)
		let fen = {};
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
		}
		fen.deck = setCreateDeck();
		fen.cards = deckDeal(fen.deck, table.options.numCards);
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function resolvePending(table) {
		let [fen, players] = [table.fen, table.players];
		let pending = table.pending; delete table.pending;
		let [name, move] = [pending.name, pending.move];

		let skip = false;

		if (isdef(move.noset)){
			if (move.noset == 'correct'){
				players[name].score += 1;
				let newCards = deckDeal(fen.deck, 1); //add 1 cards!
				if (!isEmpty(newCards))	fen.cards.push(newCards[0]);
				DA.pendingChanges = [['players', name, 'score'], ['fen']];
			}else{
				//console.log('INCORRECT NOSET!!!!');
				players[name].score -= 1;
				DA.pendingChanges = [['players', name, 'score']];
			}
		}else{
			let isSet = setCheckIfSet(move);
			if (isSet) {
				players[name].score += 1;
	
				//calc how to replace cards from set
				let toomany = Math.max(0, fen.cards.length - table.options.numCards);
				let need = Math.max(0, 3 - toomany);
				let newCards = deckDeal(fen.deck, need);
				for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, move[i], newCards[i]); else removeInPlace(fen.cards, move[i]);
	
				DA.pendingChanges = [['players', name, 'score'], ['fen']];
			}else{
				//console.log('INCORRECT SET!!!!');
				players[name].score -= 1;
				DA.pendingChanges = [['players', name, 'score']];
			}
		}

		// ***TODO*** nicht ganz correct hier!!!
		if (isEmpty(fen.deck)){
			table.winners = getPlayersWithMaxScore(table);
			table.status = 'over';
			table.turn = [];
			delete DA.pendingChanges;
		}
	}
	function present(table) {
		const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' };
		setLoadPatterns('dPage', colors);
		let fen = table.fen;
		mStyle('dTable', { padding: 50, wmin: 500 });//rounding:250});
		let d = mDom('dTable', { gap: 10, padding: 10 }); mCenterFlex(d);
		let rows = fen.cards.length / 3;
		let sz = Math.min(80, Math.round(400 / rows));
		let dBoard = T.dBoard = mGrid(rows, 3, d, { gap: 14 });
		let items = [];
		for (const c of fen.cards) {
			let dc = setDrawCard(c, dBoard, colors, sz); //TESTING ? 80 : 100);
			let item = mItem({ div: dc }, { key: c });
			items.push(item);
		}

		let oset = setFindOneSet(items);
		console.log('set',oset?oset.keys:'NO SET'); 
		//if (oset)	console.log('set',oset.keys); else console.log('NO')

		return items;
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
	async function activate(table, items) {
		let myTurn = isMyTurn(table);

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item, items);
		}

		//show no set button
		let dParent = mBy('dTable').parentNode;
		mIfNotRelative(dParent);
		let bNoSet = mButton('No Set',()=>onclickNoSet(table,items),dParent,{className:'button'});
		mPos(bNoSet,window.innerWidth/2+180,110);

		if (amIHuman(table)) return;

		//bot move activation: random move
		TO.bot = setInterval(async () => {
			//console.log('BOT!!!',table.step);
			let item = rChoose(items);
			await onclickCard(table, item, items);
		}, rNumber(1000, 4000));

	}

	//#region set specific functions
	function setCheckIfSet(keys) {
		let arr = makeArrayWithParts(keys);
		let isSet = arr.every(x => arrAllSameOrDifferent(x));
		return isSet;
	}
	function setCreateDeck() {
		let deck = [];
		['red', 'purple', 'green'].forEach(color => {
			['diamond', 'squiggle', 'oval'].forEach(shape => {
				[1, 2, 3].forEach(num => {
					['solid', 'striped', 'open'].forEach(fill => {
						deck.push(`${color}_${shape}_${num}_${fill}`);
					});
				});
			});
		});
		arrShuffle(deck);
		return deck;
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
	function setFindOneSet(items) {
		for (var x = 0; x < items.length; x++) {
			for (var y = x + 1; y < items.length; y++) {
				for (var z = y + 1; z < items.length; z++) {
					assertion(items[x] != items[y], `WTF!?!?!?! ${items[x].key} ${items[y].key}`)
					let list = [items[x], items[y], items[z]];
					let keys = list.map(x => x.key);
					if (setCheckIfSet(keys)) return{items:list,keys};
				}
			}
		}
		console.log('no set!')
		return null;
	}
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

	async function onclickCard(table, item, items) {
		toggleItemSelection(item);
		let selitems = items.filter(x => x.isSelected);
		let [keys, m] = [selitems.map(x => x.key), selitems.length];
		if (m == 3) {
			clearEvents();
			mShield('dTable', { bg: 'transparent' });
			let id = table.id;
			let name = getUname();
			let move = keys;
			let step = table.step;
			let olist = [{ keys: ['pending'], val: { name, move } },];
			if (isdef(DA.pendingChanges)) {
				for (const klist of DA.pendingChanges) {
					olist.push({ keys: klist, val: lookup(table, klist) });
				}
			}
			let o = { id, name, olist, step };

			let isSet = setCheckIfSet(keys);
			if (isSet) o.stepIfValid = step + 1;

			let res = await mPostRoute('olist', o); //console.log(res);
		}
	}
	async function onclickNoSet(table,items){
		console.log('was nun?');
		clearEvents();
		mShield('dTable', { bg: 'transparent' });

		let oset = setFindOneSet(items);

		let id = table.id;
		let name = getUname();
		let move = oset?{noset:'wrong',keys:oset.keys}:{noset:'correct'};
		let step = table.step;
		let olist = [{ keys: ['pending'], val: { name, move } },];
		if (isdef(DA.pendingChanges)) {
			for (const klist of DA.pendingChanges) {
				olist.push({ keys: klist, val: lookup(table, klist) });
			}
		}
		let o = { id, name, olist, step };

		if (!oset) o.stepIfValid = step + 1;
		let res = await mPostRoute('olist', o); //console.log(res);
	}


	return { setup, resolvePending, present, stats, activate };
}


//#region 19.mai 24: skip variante geht nicht!!! revert!
async function showTable(id) {
	//INVALID TABLES KOMMEN GARNICHT HIERHER!!!
	let me = getUname();
	let table = await mGetRoute('table', { id });	//console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game];

	if (table.status == 'started' && isdef(table.pending)) {
		let skip = func.resolvePending(table); console.log('skip',skip); // deterministic!!! (table.pending)
		if (table.status == 'over') { mPostRoute('postTable', table); return; }
		else if (skip && isdef(mBy('dTable'))) return;
	}

	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2>${table.friendly} (${table.step})</h2>`; // title

	//let tableSize = calcHeightLeftUnder('dExtra') - 40; //height visible in browser
	d = mDom('dMain'); mCenterFlex(d); 

	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction

	mDom(d, {}, { id: 'dStats' }); mLinebreak(d); func.stats(table); // player stats

	let minTableSize = 400; // present
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);

	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }

	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);

	await updateTestButtonsPlayers(table); // right side buttons

	func.activate(table, items); // activate

}
function resolvePending(table) {
	let [fen, players] = [table.fen, table.players];
	let pending = table.pending; delete table.pending;
	let [name, move] = [pending.name, pending.move];

	let skip = false;

	if (isdef(move.noset)){
		if (move.noset == 'correct'){
			players[name].score += 1;
			let newCards = deckDeal(fen.deck, 1); //add 1 cards!
			if (!isEmpty(newCards))	fen.cards.push(newCards[0]);
			DA.pendingChanges = [['players', name, 'score'], ['fen']];
		}else{
			console.log('INCORRECT NOSET!!!!');
			players[name].score -= 1;
			DA.pendingChanges = [['players', name, 'score']];
			skip = name != getUname();
			modifyStat(name,'score',players[name].score); //mach ui changes gleich und skip

		}
	}else{
		let isSet = setCheckIfSet(move);
		if (isSet) {
			players[name].score += 1;

			//calc how to replace cards from set
			let toomany = Math.max(0, fen.cards.length - table.options.numCards);
			let need = Math.max(0, 3 - toomany);
			let newCards = deckDeal(fen.deck, need);
			for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, move[i], newCards[i]); else removeInPlace(fen.cards, move[i]);

			DA.pendingChanges = [['players', name, 'score'], ['fen']];
		}else{
			console.log('HALLO!!!!');
			DA.pendingChanges = [['players', name, 'score']];
			skip = name != getUname();
			modifyStat(name,'score',players[name].score); //mach ui changes gleich und skip
			
		}
	}


	// ***TODO*** nicht ganz correct hier!!!
	if (isEmpty(fen.deck)){
		table.winners = getPlayersWithMaxScore(table);
		table.status = 'over';
		table.turn = [];
		delete DA.pendingChanges;
	}
	return skip;
}

//#region 18.mai 24
async function showThemeEditor(){
	let d = mBy('dSettingsColor'); mClear(d);
  let sam=mDom(d,{margin:20,w:'80vw',h:'80vh',bg:'white'});
  let dnav=mDom(sam,{h:'20%',bg:'orange'});
  let drest=mDom(sam,{h:'80%'});
  let [dside,dmain]=mColFlex(drest,[1,5],['blue','green']);
  let [bg,bgImage,bgSize,bgBlend,bgRepeat,fg]=[U.bg,U.bgImage,U.bgSize,U.bgBlend,U.bgRepeat,U.fg];
}
function __animate(elem, aniclass, timeoutms) {
	mClass(elem, aniclass);
	TO.anim = setTimeout(() => mRemoveClass(elem, aniclass), timeoutms);
}
function __setup() {
	axiom = system.axiom;
	rules = system.rules;
	factor = valf(system.factor, 1);
	angle = radians(valf(system.angle, 60));
	sentence = axiom;
	let button = createButton("generate"); button.mousePressed(generate);
	button = createButton("animate"); button.mousePressed(() => interval_id = setInterval(generate, 500));
	createCanvas(400, 400);
	background(51);
	createP(axiom);
	turtle();
}
function createOpenTable(gamename, players, options) {
	let me = getUname();
	let playerNames = [me];
	assertion(me in players, "_createOpenTable without owner!!!!!")
	for (const name in players) { addIf(playerNames, name); }
	let pdict = {};
	for (const name of playerNames) { pdict[name] = players[name]; }
	// 	let o = {};
	// 	let pl = players[name];
	// 	for (const k in pl) {
	// 		if (k == gamename) { addKeys(pl[gamename], o); }
	// 		else if (k == options) { addKeys(pl.options, o); }
	// 		else if (!['div', 'isSelected'].includes(k)) o[k] = pl[k];
	// 	}
	// 	// let opts = pl.options; delete pl.options; addKeys(opts, pl);
	// 	pdict[name] = o;
	// }
	assertion(playerNames[0] == me, `_addTable: owner should be ${me} and first in ${playerNames.join(',')}`);

	//vielleicht sort player keys
	// //mach das hier schon dass die options aufgeteilt werden!!!
	// if (TESTING && gamename == 'setgame') {
	// 	let keys = ['playmode', 'score', 'level', 'name', 'color', 'key'];
	// 	let osorted = {};
	// 	for (const k of keys) { osorted[k] = o[k]; }
	// 	pdict[name] = osorted;
	// } else pdict[name] = o;

	console.log('pdict', jsCopy(pdict));

	let t = {
		status: 'open',
		id: generateTableId(),
		fen: null,
		game: gamename,
		owner: playerNames[0],
		friendly: generateTableName(),
		players: pdict,
		playerNames: playerNames,
		options
	};
	return t;
}
function collectPlayers() {
	let players = {};
	for (const name of DA.playerList) {
		// players[name] = allPlToPlayer(name);
		let o = {}
		let da = DA.allPlayers[name];
		for (const k in da) {
			if (k == 'options') { addKeys(da.options, o) }
			else if (k == 'div' || k == 'isSelected') continue;
			else o[k] = da[k];
		}
		players[name] = o;

	}
	return players;
}
function allPlayerToUser(name, gamename) {
	//assumes Serverdata.users is up-to-date!
	//converts from player back to user of gamename
	//all keys that are player options in gamename are copied back to user.games[gamename] object
	let poss = valf(getGamePlayerOptions(gamename), {});
	let optKeys = Object.keys(poss);

	let exceptKeys = ['div', 'isSelected', 'playmode'].concat(optKeys);

	let user = jsCopyExceptKeys(DA.allPlayers[name], exceptKeys);


}
function muell(name, gamename) {
	let pl = jsCopyExceptKeys(Serverdata.users[name], ['games']);
	let options = valf(getUserOptionsForGame(name, gamename), {});
	addKeys(options, pl);

	pl.playmode = playmode;

	//for all the player options in this game, if this user does not have the corresponding options,
	//copy the default value from game options	
	let poss = getGamePlayerOptions(gamename);
	console.log('poss', poss);
	for (const p in poss) {
		if (isdef(pl[p])) continue;
		let val = poss[p];
		let defval = arrLast(val.split(','));
		if (isNumber(defval)) defval = Number(defval);
		pl[p] = defval;
		//console.log('default for',p,'is',defval);
	}
	return pl;
}
async function saveAndUpdatePlayerOptions(allPl, gamename) {
	let name = allPl.name;
	let poss = getGamePlayerOptionsAsDict(gamename);

	// let allPlCopy = jsCopyExceptKeys(allPl, ['div', 'isSelected']);
	// console.log('___saveAndUpdatePlayerOptions', name, '\nallPl', allPlCopy, '\nposs', jsCopy(poss));

	if (nundef(poss)) return;

	let opts={};
	for (const p in poss) { 
		allPl[p] = getRadioValue(p); 
		if (p == 'playmode') continue;
		opts[p] =  allPl[p];
	}

	let id = 'dPlayerOptions'; mRemoveIfExists(id); //dont need UI anymore

	let oldOpts = valf(getUserOptionsForGame(name,gamename),{});

	let changed = false;
	for(const p in poss){
		if (p == 'playmode') continue;
		if (oldOpts[p]!=opts[p]) {changed = true; break;}
	}

	if (changed) {
		let games = valf(Serverdata.users[name].games,{});
		games[gamename] = opts;
		await postUserChange({name,games})
	}
}
function createGamePlayer(name, gamename, opts = {}) {
	let pl = jsCopy(Serverdata.users[name]);
	let plopts = valf(pl.options, {}); delete pl.options;
	copyKeys(opts, plopts);
	let defopts = Serverdata.config.games[gamename].ploptions;
	for (const k in defopts) {
		let val = plopts[k];
		if (nundef(val)) {
			let vals = defopts[k].split(',').map(x => x.trim());
			val = arrLast(vals);
			if (isNumeric(val)) val = Number(val);
			plopts[k] = val;
		}
	}
	copyKeys(plopts, pl);
	return pl;
}
async function collectPlayerOptions(allPl, gamename) {
	let name = allPl.name;
	let options = allPl.options;
	let poss = Serverdata.config.games[gamename].ploptions;

	console.log('___collectPlayerOptions',name,'\npl.options',jsCopy(allPl.options),'\nposs',jsCopy(poss))

	if (nundef(poss)) return options;
	for (const p in poss) {
		options[p] = getRadioValue(p);
	}
	//pl[gamename] = options;
	let id = 'dPlayerOptions'; mRemoveIfExists(id);//mRemove(d);
	let uold = Serverdata.users[allPl.name];
	let unew = {};
	for (const k in allPl) {
		if (['div', 'isSelected', 'playmode', 'options'].includes(k)) continue;
		unew[k] = jsCopy(allPl[k]);
	}
	lookupSetOverride(unew,['games',gamename],options);
	for (const k in unew.options) {
		if (k == 'playmode') continue;
		if (lookup(uold, ['games',gamename, k]) != lookup(unew, ['games',gamename, k])) {
			let res = await postUserChange(unew);
			let o=DA.allPlayers[name];
			copyKeys(res, o);
			o.options = lookup(res,['games',gamename]);
			delete o.games;
			delete o.options.playmode;
			DA.allPlayers[name] = o;
			return;
		}
	}
}
async function setPlayerPlaying(item, gamename) {
	let [name, da] = [item.name, item.div];
	addIf(DA.playerList, name);
	selectPlayerItem(item);
	await collectFromPrevious(gamename);
	let id = 'dPlayerOptions';
	DA.lastPlayerItem = item;
	let poss = getGamePlayerOptions(gamename);
	if (nundef(poss)) return;
	let dParent = mBy('dGameMenu'); //mBy('dMain'); //mBy('dGameMenu'); //document.body;
	let bg = getUserColor(name);
	let rounding = 6;
	let d1 = mDom(dParent, { bg: colorLight(bg, 50), border: `solid 2px ${bg}`, rounding, display: 'inline-block', hpadding: 3, rounding }, { id });
	mDom(d1, {}, { html: `${name}` }); //title
	d = mDom(d1, {}); mCenterFlex(d);
	mCenterCenter(d);
	for (const p in poss) {
		let key = p;
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let legend = formatLegend(key);
			let fs = mRadioGroup(d, {}, `d_${key}`, legend);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, false); }
			let userval = lookup(DA.allPlayers, [name, 'options', p]);
			let radio;
			let chi = fs.children;
			for (const ch of chi) {
				let id = ch.id;
				if (nundef(id)) continue;
				let radioval = stringAfterLast(id, '_');
				if (isNumber(radioval)) radioval = Number(radioval);
				if (userval == radioval) ch.firstChild.checked = true;
				else if (nundef(userval) && `${radioval}` == arrLast(list)) ch.firstChild.checked = true;
			}
			measureFieldset(fs);
		}
	}
	let r = getRectInt(da, mBy('dGameMenu'));
	let rp = getRectInt(d1);
	let [y, w, h] = [r.y - rp.h - 4, rp.w, rp.h];
	let x = r.x - rp.w / 2 + r.w / 2;
	if (x < 0) x = r.x - 22;
	if (x > window.innerWidth - w - 100) x = r.x - w + r.w + 14;
	mIfNotRelative(dParent);
	mPos(d1, x, y);
	mButtonX(d1, ev => collectPlayerOptions(item, gamename), 18, 3, 'dimgray');
}
async function showGamePlayers(dParent, users) {
	let me = getUname();
	mStyle(dParent, { wrap: true });
	let userlist = ['amanda','felix','mimi'];
	for(const name in users) addIf(userlist,name);
	for (const name of userlist) {
		let d = mDom(dParent, { align: 'center', padding: 2, cursor: 'pointer', border: `transparent` });
		d.setAttribute('username', name)
		let img = showUserImage(name, d, 40);
		let label = mDom(d, { matop: -4, fz: 12, hline: 12 }, { html: name });
		let item = jsCopy(users[name]); 

		
		delete item.games;
		let options = valf(lookup(users,[name,'games',DA.gamename]),{});
		item.options = jsCopy(options);
		item.div = d;
		item.isSelected = false;
		DA.allPlayers[name] = item;
		d.onclick = onclickGameMenuPlayer;
	}
	await clickOnPlayer(me);
}

function createOpenTable(gamename, players, options) {
	let me = getUname();
	let playerNames = [me];
	assertion(me in players, "createOpenTable without owner!!!!!")
	for (const name in players) { addIf(playerNames, name); }
	let pdict = {};
	for (const name of playerNames) {
		let o = {};
		let pl = players[name];
		for (const k in pl) {
			if (k == gamename) { addKeys(pl[gamename], o); }
			else if (!['div', 'isSelected'].includes(k)) o[k] = pl[k];
		}
		pdict[name]=o;
	}
	assertion(playerNames[0] == me, `_addTable: owner should be ${me} and first in ${playerNames.join(',')}`);

	// //mach das hier schon 
	// if (TESTING && gamename == 'setgame') {
	// 	let keys = ['playmode', 'score', 'level', 'name', 'color', 'key'];
	// 	let osorted = {};
	// 	for (const k of keys) { osorted[k] = o[k]; }
	// 	pdict[name] = osorted;
	// } else pdict[name] = o;


	let t = {
		status: 'open',
		id: generateTableId(),
		fen: null,
		game: gamename,
		owner: playerNames[0],
		friendly: generateTableName(),
		players: pdict,
		playerNames: playerNames,
		options
	};
	return t;
}

function button96() {

	function setup(table) {
		//console.log('setup:table',table)
		let fen = {};
		for (const name in table.players) {
			let pl = table.players[name];
			let opts = pl.options;
			delete pl.options;
			addKeys(opts, pl)
			pl.score = 0;
		}
		fen.cards = [1, 2, 3];
		fen.deck = range(4, 100); //[4, 5, 6, 7, 8, 9, 10];
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function resolvePending(table) {
		//console.log('resolvePending',table.pending)
		let [fen, players] = [table.fen, table.players];
		let pending = table.pending; delete table.pending;
		let [name, move] = [pending.name, pending.move];

		let best = arrMinMax(fen.cards).min; //check if the card is the best
		if (move == best) {
			players[name].score += 1;
			removeInPlace(fen.cards, move);
			let cardlist = deckDeal(fen.deck, 1); //console.log('new card(s)',cardlist);
			if (!isEmpty(cardlist)) fen.cards.push(cardlist[0]);
			DA.pendingChanges = [['players', name, 'score'], ['fen']];
		} else {
			players[name].score -= 1;
			DA.pendingChanges = [['players', name, 'score']];
		}

	}
	function present(table) {
		let [fen, players] = [table.fen, table.players];
		let d = mDom('dTable', { gap: 10, padding: 10 }); mCenterFlex(d);
		let items = [];
		for (const card of fen.cards) {
			//console.log('card',card)
			let item = cNumber(card);
			mAppend(d, iDiv(item));
			items.push(item);
			item.feno = card;
			//console.log(c);
		}
		return items;
	}
	function stats(table) {
		let [fen, me, players] = [table.fen, getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'rowflex', style)
		for (const plname in players) {
			let pl = players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') {
				mStyle(item.img, { rounding: 0 });
			}

			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d);
		}
	}
	async function activate(table, items) {
		let fen = table.fen;
		let instruction = 'must click a card';
		let html = (isMyTurn(table) ? `${get_waiting_html()}<span style="color:red;font-weight:bold;max-height:25px">You</span>` + "&nbsp;" + instruction : `waiting for: ${getTurnPlayers(table)}`);
		let dinst = mBy('dInstruction'); mClear(dinst);
		let style = { display: 'flex', 'justify-content': 'center', 'align-items': 'center' };
		if (isMyTurn(table)) style.maleft = -30;
		mDom(dinst, style, { html });

		if (!isMyTurn(table)) return;

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item);
		}

		if (amIHuman(table)) return;

		//bot move activation
		TO.bot = setInterval(async () => { 
			//console.log('BOT!!!',table.step);
			let list = sortBy(items, x => x.feno); //console.log(list);
			let item = list[0]; //rChoose(items);
			await onclickCard(table, item);
		}, rNumber(1000, 4000));

	}

	async function onclickCard(table, item) {
		mShield('dTable', { bg: 'transparent' });

		//highlight clicked card
		let d = iDiv(item);
		let ms = rChoose(range(300, 400));
		mClass(d, 'framedPicture'); TO.hallo = setTimeout(() => mClassRemove(d, 'framedPicture'), ms);
		try { await mSleep(ms); } catch (err) { console.log("ERR", err); return; }

		let id = table.id;
		let name = getUname();
		let move = item.feno;
		let step = table.step;
		let olist = [
			{ keys: ['pending'], val: { name, move } },
		];
		if (isdef(DA.pendingChanges)){
			for (const klist of DA.pendingChanges) {
				olist.push({ keys: klist, val: lookup(table, klist) });
			}
		}

		let o = { id, name, olist, step };
		let best = arrMinMax(table.fen.cards).min;

		if (move == best) o.stepIfValid = step + 1; // nur 1 kann punkt kriegen pro runde

		let res = await mPostRoute('olist', o); console.log(res);
	}

	return { setup, resolvePending, present, stats, activate }; //, activate, checkGameover, showStats, botMove };
}
async function testOnclickDeck0() {
	let tnew = jsCopy(T);
	tnew.fen.deck = [];
	let res = await sendMergeTable({ name: getUname(), id: tnew.id, table: tnew });
	console.log('res', res.fen.deck)
}
function checkInterrupt(items) {
	return isdef(T) && items[0] == T.items[0] && isdef(DA.Tprev) && T.items[0] == DA.Tprev.items[0];
}


//#region 17.mai 24
async function switchToUser(uname,menu) {
	if (!isEmpty(uname)) uname = normalizeString(uname);
	if (isEmpty(uname)) uname = 'guest';
	sockPostUserChange(U ? getUname() : '', uname); //das ist nur fuer die client id!
	U = await getUser(uname);
	localStorage.setItem('username', uname);
	iDiv(UI.user).innerHTML = uname;
	setTheme(U);
	menu = valf(menu,Clientdata.curMenu,localStorage.getItem('menu'),'home');
  switchToMainMenu(menu);
	if (menu == 'table') {
		assertion(Clientdata.table,"Table menu without table!!!!!!!")
		showTable(Clientdata.table.id);
	}	else await switchToMainMenu(menu);
}
function closeApps() {
	if (isdef(DA.calendar)) { closePopup(); delete DA.calendar; }
	mClear('dMain');
	mClear(dTitle);
}
function subscribeAsSpectator(id,name){
  mPostRoute('spectate',{id,name})
}
async function onclickCard(table, item) {
	//console.log('click!!!')
	//was soll denn jetzt passieren?
	let [fen, players] = [table.fen, table.fen.players];
	let card = item.feno;

	let d = iDiv(item);
	let ms = 500;
	mClass(d, 'framedPicture'); TO.hallo = setTimeout(()=>mClassRemove(d,'framedPicture'),ms);
	try{await mSleep(ms);}catch(err){console.log("ERR",err); return;}

	try{
		let best = arrMinMax(fen.cards).min;
		if (card == best) {
			mShield('dTable',{bg:'transparent'});
			let name = getUname();
			let move = card;
			table.pending = { name, move };
			//console.log('sending',table)
			let res = await mPostRoute('move', table); 
			console.log('res',res)
			//if (isString(res) && res.includes('INVALID')) console.log('...from server:', res)
		} else { 
			//console.log('fehler!');
			//was soll bei einem fehler passieren?
			//was wenn es ein bot war?
		}
	}catch(err){
		console.log(`wie bitte???!!!!!!!!!!!!!!!!!!`,err);
		if (isdef(TO.SLEEPTIMEOUT)) {
			clearTimeout(TO.SLEEPTIMEOUT);
			console.log('after clearTimeout',TO.SLEEPTIMEOUT);
		}
	}
	

}
var MergeCount = 0;
app.post('/mergeTable', (req, res) => { //partial override using olist, emits to players-name
	let name = req.body.name;
	if (nundef(name)) return res.json("ERRROR! no name provided for mergeTable!")
	let id = req.body.id;
	if (nundef(id)) return res.json("ERRROR! no id provided for mergeTable!")
	let tnew = req.body.table;
	let olist = req.body.olist;
	let table = lookup(Session, ['tables', id]);

	console.log(`__merge ${MergeCount++}:`, name);
	if (isdef(olist)) {
		//partial merge!
		for (const o of olist) {
			lookupSetOverride(table, o.keys, o.val);
			//let last = arrLast(o.keys);
			// console.log('override',last,isLiteral(o.val)?o.val:typeof o.val)
		}
	} else if (isdef(tnew)) {
		// console.log(Object.keys(tnew))
		table = tnew; //deepmergeOverride(table,tnew);
	}
	saveTable(id, table);
	// console.log('table',table)
	//io.emit('table', { msg, id, turn, isNew: false }) DAS WAR DER FEHLER!!!!!!!!!!!!!!!!!!!
	emitToPlayers(arrMinus(table.playerNames, name), 'merged', table);
	res.json(table);
});
var RaceCount = 0;
app.post('/raceTable0', (req, res) => { //ohne error, just 1 score point per step
	let name = req.body.name;
	if (nundef(name)) return res.json("ERRROR! no name provided for raceTable!")
	let id = req.body.id;
	if (nundef(id)) return res.json("ERRROR! no id provided for raceTable!")
	let step = req.body.step;
	if (nundef(step)) return res.json("ERRROR! no step provided for raceTable!")
	let tnew = req.body.table;
	let olist = req.body.olist;
	let table = lookup(Session, ['tables', id]);
	if (!assertion(table, `table ${id} does NOT exist`)) { res.json('ASSERTION ERROR'); return; }

	console.log(`__race ${RaceCount++}:`, name, step);

	let tcopy = jsCopy(table); //erstmal eine table copy machen
	if (isdef(olist)) {
		//partial merge!
		for (const o of olist) {
			lookupSetOverride(tcopy, o.keys, o.val);
			//let last = arrLast(o.keys); console.log('override',last,isLiteral(o.val)?o.val:typeof o.val);
		}
	} else if (isdef(tnew)) {
		// console.log(Object.keys(tnew))
		tcopy = tnew; //deepmergeOverride(table,tnew);
	}

	let sum = calcScoreSum(tcopy); //check if this new table is valid!
	let fen = tcopy.fen;
	let scores = tcopy.playerNames.map(x => fen.players[x].score).join(',')
	if (sum != step) {
		console.log('=>INVALID!\nstep', step, '\nsum', sum, '\nplayer', name, '\nscores', scores);
		//do NOT update table and do NOT send anything!!!
		res.json('INVALID');
		return;
	}
	saveTable(id, tcopy);
	//io.emit('table', { msg, id, turn, isNew: false }) DAS WAR DER FEHLER!!!!!!!!!!!!!!!!!!!
	emitToPlayers(arrMinus(tcopy.playerNames, name), 'merged', tcopy);
	res.json(tcopy);
});
app.post('/raceTable', (req, res) => { // 1 score poiint per step, -1 per error
	let name = req.body.name;
	if (nundef(name)) return res.json("ERRROR! no name provided for raceTable!")
	let id = req.body.id;
	if (nundef(id)) return res.json("ERRROR! no id provided for raceTable!")
	let tnew = req.body.table;
	let olist = req.body.olist;
	let table = lookup(Session, ['tables', id]);
	if (!assertion(table, `table ${id} does NOT exist`)) { res.json('ASSERTION ERROR'); return; }

	let step = valf(req.body.step, table.step);
	let errors = valf(req.body.errors, 0);

	let tcopy = jsCopy(table); //erstmal eine table copy machen
	if (isdef(olist)) {
		//partial merge!
		for (const o of olist) {
			lookupSetOverride(tcopy, o.keys, o.val);
			//let last = arrLast(o.keys); console.log('override',last,isLiteral(o.val)?o.val:typeof o.val);
		}
	} else if (isdef(tnew)) {
		// console.log(Object.keys(tnew))
		tcopy = tnew; //deepmergeOverride(table,tnew);
	}

	let sum = calcScoreSum(tcopy); //check if this new table is valid!
	let errsum = calcErrSum(tcopy);
	console.log(`__race ${RaceCount++}:`, name, step, `-${errors}`, sum, errsum);

	let scores = tcopy.playerNames.map(x => `${x}:${tcopy.fen.players[x].score}`).join(',')
	let allErrors = tcopy.playerNames.map(x => `${x}:${tcopy.fen.players[x].errors}`).join(',')
	if (sum != step - errsum) {
		console.log('=>INVALID!\nstep', step, sum + errsum, '\nerrsum', errsum, '\nsum', sum, '\nplayer', name, '\nscores', scores, '\nerrors', allErrors);
		//do NOT update table and do NOT send anything!!!
		res.json('INVALID');
		return;
	}
	saveTable(id, tcopy);
	//io.emit('table', { msg, id, turn, isNew: false }) DAS WAR DER FEHLER!!!!!!!!!!!!!!!!!!!
	// *** the following only works if players is only logged in ONCE!!!!!!
	emitToPlayers(arrMinus(tcopy.playerNames, name), 'merged', tcopy);
	res.json(tcopy);
});
app.post('/privateOlist', (req, res) => { //partial override using olist, noemit!
	let name = req.body.name;
	if (nundef(name)) return res.json("ERRROR! no name provided for privateOlist!")
	let id = req.body.id;
	if (nundef(id)) return res.json("ERRROR! no id provided for privateOlist!")
	let olist = req.body.olist;
	if (nundef(olist)) return res.json("ERRROR! no olist provided for privateOlist!")
	let table = lookup(Session, ['tables', id]);
	for (const o of olist) lookupSetOverride(table, o.keys, o.val);
	saveTable(id, table);
	res.json(table);
});
app.post('/move', (req, res) => { //send complete table! emits to all players!
	let table = req.body;
	let [step, id] = [table.step, table.id];
	let ti = Session.tableInfo[id];
	if (nundef(ti)) ti = Session.tableInfo[id] = table.step;
	if (step < ti) {
		//diese table ist veraltet!!!
		res.json(`INVALID!!!! step:${step} tableInfo:${ti}`);
	} else {
		Session.tableInfo[id] += 1;
		saveTableInfo();
		table.step += 1;
		saveTable(id, table);
		emitToPlayers(table.playerNames, 'pending', table);
		res.json(`YEAH!!!! step:${step} tableInfo:${ti}`);
	}
});
app.post('/spectate', (req, res) => { //emits id turn to everyone, fuer den anfang von einer table!
	let id = req.body.id;
	let name = req.body.name; 
	console.log('SPECTATE!!!',name)
	//lookupAddIfToList(Spectators,[id],name); console.log('Spectators',Spectators)
});



//#region CancelablePromise take 1
class CancelablePromise {
  constructor(executor) {
    this._hasCanceled = false;
    this.promise = new Promise((resolve, reject) => {
      this._reject = reject; // Store reject function to call it on cancel

      executor(
        (value) => {
          if (this._hasCanceled) {
            reject({ isCanceled: true });
          } else {
            resolve(value);
          }
        },
        (error) => {
          if (this._hasCanceled) {
            reject({ isCanceled: true });
          } else {
            reject(error);
          }
        }
      );
    });
  }

  cancel() {
    this._hasCanceled = true;
    this._reject({ isCanceled: true }); // Immediately reject with cancelation
  }
}

async function mySleep(ms) {
  return new CancelablePromise((resolve) => {
    const timeoutId = setTimeout(resolve, ms);
    // Clean up timeout if canceled
    this.promise.catch((err) => {
      if (err.isCanceled) {
        clearTimeout(timeoutId);
      }
    });
  });
}

// Usage example:
const sleep = mySleep(5000);

sleep.promise
  .then(() => console.log('Completed'))
  .catch((err) => {
    if (err.isCanceled) {
      console.log('Sleep was canceled');
    } else {
      console.error('Error:', err);
    }
  });

// To cancel the sleep
setTimeout(() => sleep.cancel(), 2000); // Cancels the sleep after 2 seconds
//#endregion

//#region CancelablePromise take 0
class CancelablePromise {
  constructor(executor) {
    this._hasCanceled = false;

    this.promise = new Promise((resolve, reject) => {
      executor(
        (value) => {
          if (this._hasCanceled) {
            reject({ isCanceled: true });
          } else {
            resolve(value);
          }
        },
        (error) => {
          if (this._hasCanceled) {
            reject({ isCanceled: true });
          } else {
            reject(error);
          }
        }
      );
    });
  }

  cancel() {
    this._hasCanceled = true;
  }
}

// Usage example
const cancelablePromise = new CancelablePromise((resolve, reject) => {
  setTimeout(() => resolve('Promise resolved'), 3000);
});

cancelablePromise.promise
  .then((value) => console.log(value))
  .catch((error) => {
    if (error.isCanceled) {
      console.log('Promise was canceled');
    } else {
      console.error('Promise error:', error);
    }
  });

// To cancel the promise
cancelablePromise.cancel();
//#endregion

//#endregion

//#region 16.mai 24
function button96() {

	function setup(table) {
		let fen = {};
		fen.players = {};
		for (const name in table.players) {
			let pl = fen.players[name] = table.players[name];
			let opts = pl.options;
			delete pl.options;
			addKeys(opts,pl)
			//pl.color = getUserColor(name)
			pl.score = 0;
		}
		fen.cards = [1, 2, 3];
		fen.deck = range(4,100); //[4, 5, 6, 7, 8, 9, 10];
		fen.plorder = jsCopy(table.playerNames);
		fen.turn = jsCopy(table.playerNames);
		return fen;
	}
	function resolvePending(table){
		let [fen,players] = [table.fen,table.fen.players];
		let pending = table.pending; delete table.pending;
		let [name,move] = [pending.name,pending.move];
		//console.log(name,move,fen.cards,fen.deck);
		removeInPlace(fen.cards,move);
		let cardlist = deckDeal(fen.deck,1); //console.log('new card(s)',cardlist);
		if (!isEmpty(cardlist))	fen.cards.push(cardlist[0]);
		players[name].score += 1;
		//table.step+=1;
	}
	function present(table) {
		//console.log(table)
		let [fen, players] = [table.fen, table.fen.players];
		console.log('players',players)
		let d = mDom('dTable', { gap: 10, padding: 10 }); mCenterFlex(d);
		let items = [];
		for (const card of fen.cards) {
			//console.log('card',card)
			let item = cNumber(card);
			mAppend(d, iDiv(item));
			items.push(item);
			item.feno = card;
			//console.log(c);
		}
		return items;
	}
	function stats(table) {
		let [fen, me] = [table.fen, getUname()];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(fen, me, 'dStats', 'rowflex', style)
		for (const plname in fen.players) {
			let pl = fen.players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') {
				mStyle(item.img, { rounding: 0 });
			}

			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d);
		}
	}
	async function activate(table, items) {
		let fen = table.fen;
		let instruction = 'must click a card';
		let html = (isMyTurn(fen) ? `${get_waiting_html()}<span style="color:red;font-weight:bold;max-height:25px">You</span>` + "&nbsp;" + instruction : `waiting for: ${getTurnPlayers(fen)}`);
		//html = 'was ist da eigentlich los???'
		//mDom('dInstruction',{className:'instruction',},{html})
		let dinst = mBy('dInstruction'); mClear(dinst);
		let style={	display: 'flex','justify-content': 'center','align-items': 'center'};
		if (isMyTurn(fen)) style.maleft=-30;
		 mDom(dinst,style,{html})

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev=>onclickCard(table,item);
		}
	}
	
	async function onclickCard(table,item) {
		//was soll denn jetzt passieren?
		let [fen,players] = [table.fen,table.fen.players];
		let card = item.feno;
		let best = arrMinMax(fen.cards).min;
		if (card == best){
			mShield('dTable');
			let name = getUname();
			let move = card;
			table.pending = {name,move};
			//console.log('sending',table)
			let res = await mPostRoute(`move`, table); console.log('from server:',res)
			//this should be the correct click!
			//sendmove to server;
			//if move is valid, 
		}else{console.log('fehler!')}


	}

	return { setup, resolvePending, present, stats, activate }; //, activate, checkGameover, showStats, botMove };
}

app.post('muell', (req, res) => {
	let step = req.body.table.step;

	let tnew=req.body;
	let id = tnew.id;
	let table =  lookup(Session, ['tables', id]);
	if (!table) { io.emit('tables', getTablesInfo()); return; } //as if deleted
	assertion(table.status == 'started',`ERROR: ${table.status} (condTable only valid for table with status started)`)
	let expected = diTableStep[id];
	if (nundef(expected)) diTableStep[id]=expected=0;
	//if (table.step != )
});

app.post('/muell', (req, res) => {
	let name = req.body.name;
	if (nundef(name)) return res.json("ERRROR! no name provided for raceTable!")
	let id = req.body.id;
	if (nundef(id)) return res.json("ERRROR! no id provided for raceTable!")
	let tnew = req.body.table;
	let olist = req.body.olist;
	let table =  lookup(Session, ['tables', id]);
	if (!assertion(table,`table ${id} does NOT exist`)) {res.json('ASSERTION ERROR'); return;}

	let step = valf(req.body.step,table.step); 
	let errors = valf(req.body.errors,0); 
	
	let tcopy = jsCopy(table); //erstmal eine table copy machen
	if (isdef(olist)){
		//partial merge!
		for(const o of olist){
			lookupSetOverride(tcopy,o.keys,o.val);
			//let last = arrLast(o.keys); console.log('override',last,isLiteral(o.val)?o.val:typeof o.val);
		}
	}else if (isdef(tnew)){
		// console.log(Object.keys(tnew))
		tcopy = tnew; //deepmergeOverride(table,tnew);
	}

	let sum = calcScoreSum(tcopy); //check if this new table is valid!
	let errsum = calcErrSum(tcopy);
	console.log(`__race ${RaceCount++}:`,name,step,`-${errors}`,sum,errsum);

	let scores = tcopy.playerNames.map(x=>`${x}:${tcopy.fen.players[x].score}`).join(',')
	let allErrors = tcopy.playerNames.map(x=>`${x}:${tcopy.fen.players[x].errors}`).join(',')
	if (sum!=step-errsum){
		console.log('=>INVALID!\nstep',step,sum+errsum,'\nerrsum',errsum,'\nsum',sum,'\nplayer',name,'\nscores',scores,'\nerrors',allErrors);
		//do NOT update table and do NOT send anything!!!
		res.json('INVALID');
		return;
	}
	saveTable(id, tcopy);
	//io.emit('table', { msg, id, turn, isNew: false }) DAS WAR DER FEHLER!!!!!!!!!!!!!!!!!!!
	// *** the following only works if players is only logged in ONCE!!!!!!
	emitToPlayers(arrMinus(tcopy.playerNames,name), 'merged', tcopy); 
	res.json(tcopy);
});
//#endregion

//#region 15.mai 24
async function showTable(table) {
	INTERRUPT(); //reentrance?!?!?
	DA.counter += 1; let me = getUname();
	if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); } 
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	Clientdata.table = table; DA.tsTable=DA.merged;

	clearEvents();
	showTitle(`${table.friendly}`);
	let func = DA.funcs[table.game];
	T = {};
	let items = T.items = await func.present('dMain',table);
	mRise('dMain');

	let playmode = getPlaymode(table,me);
	if (TESTING) testUpdateTestButtons();

	if (table.status == 'over') return showGameover(table);

	if (!table.fen.turn.includes(me)) return;

	if (playmode == 'bot') return await func.botMove(table, items, me);
	else return await func.activate(table, items);

}


//region 14.mai 24
async function showColors() {

  let d=mBy('dSettingsColor');mClear(d);
  let di = M.dicolor; //console.log('buckets',Object.keys(di).length);
	let bucketlist = 'yellow orangeyellow orange orangered red magentapink magenta bluemagenta blue cyanblue cyan greencyan green yellowgreen'.split(' ');
  for (const bucket of bucketlist) {
    let list = dict2list(di[bucket]);
    let clist = [];
    for (const c of list) {
      let o = w3color(c.value);
      o.name = c.id;
      o.hex = c.value;
      clist.push(o);
    }
    let sorted = sortByFunc(clist, x => -x.lightness);
    // mDom(d, {hpadding:10}, { html: `<br>${bucket}<br>`, class:'nav' });
    _showPaletteNames(d, sorted);
  }

  let divs = document.getElementsByClassName('colorbox');
  for (const div of divs) {
    mStyle(div,{cursor:'pointer'})
    div.onclick =async()=>onclickColor(div.getAttribute('dataColor')); 
  }
}

//#endregion

//region 13.mai 24
async function onclickSettColor(){
  console.log('set Color!!!')
  await showColors();
}
async function onclickSettFg(){
  console.log('set Color!!!')
  await showTextColors();
}
async function onclickSettBlendMode(){
  if (isEmpty(U.bgImage)) {
    showMessage('You need to set a Texture in order to set a Blend Mode!');
    return;
  }
	showBlendModes();
  setTexture({});
  for(const prop of ['bgImage','bgSize','bgBlend','bgRepeat']) delete U[prop];
  //console.log(U);
  await postUserChange(U,true)
}
async function onclickSettRemoveTexture(){
  if (isEmpty(U.bgImage)) return;
  setTexture({});
  for(const prop of ['bgImage','bgSize','bgBlend','bgRepeat']) delete U[prop];
  console.log(U);
  await postUserChange(U,true)
}
async function onclickSettTexture(){
  //console.log('set Texture!!!')
  await showTextures();
}
async function onclickTexture(item) {

	//console.log('item',item)
	//console.log('items',items)

	//console.log(U)

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
	//console.log(await postUserChange())


}
async function showColors(){
  //console.log('open Settings!!!'); 
	
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
      let c = div.getAttribute('dataColor');
      setColors(c);
      //let c=getCSSVariable('--bgBody');
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
      await postUserChange({name:U.name,fg:U.fg});
    
    }
    //console.log('HAAAAAAALLLO',div);break;

  }

}
async function showTextures(){
  mClear('dMain');
	let list=M.textures;
	let dTheme=mDom('dMain',{padding:12, gap:10}); mFlexWrap(dTheme);
  //console.log(list)
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
	UI.settBlendMode = mCommand(d, 'settBlendMode', 'Blend Mode'); mNewline(d, gap);
}

//#endregion

//#region 12.mai 24
function setColors(c, fg) {
  let hsl = colorHSL(c, true);
  let [hue, diff, wheel, p] = [hsl.h, 30, [], 20];
  let hstart = (hue + diff);
  for (i = hstart; i <= hstart + 235; i += 20) {
    let h = i % 360;
    let c1 = colorFromHSL(h, 100, 75);
    wheel.push(c1);
  }
  fg='red';
  let cc = 'white'; // valf(fg,idealTextColor(c)); console.log('!!!',fg);

  

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
}
async function prelims_old() {
  ColorThiefObject = new ColorThief();//console.log(ColorThiefObject);
  let t1 = performance.now();
  Serverdata = await mGetRoute('session'); //session ist: users,config,events
  let t2 = performance.now();
  await loadAssets();
  let t4 = performance.now();
  sockInit();
  UI.nav = showNavbar();
  UI.user = mCommand(UI.nav.r, 'user', null, onclickUser); iDiv(UI.user).classList.add('activeLink');
  UI.dTitle = mBy('dTitle');
  let t5 = performance.now();
  window.onkeydown = keyDownHandler;
  window.onkeyup = keyUpHandler;
  DA.funcs = { button96: button96() }; //implemented games!
  for (const gname in Serverdata.config.games) {
    if (isdef(DA.funcs[gname])) continue;
    DA.funcs[gname] = defaultGameFunc();
  }
  await switchToUser(localStorage.getItem('username'));
}
function hslTable(dParent,x,color) {
  let i, a='', match, same, comp, loopHSL, HSL;
  //var color = document.getElementById("colorhexDIV").innerHTML;
  let  hslObj = w3color(color);
  let h = hslObj.hue;
  let s = hslObj.sat;
  let l = hslObj.lightness;
  let arr = [];
  let lineno = (x == "hue")?12:10;
  let header = x.toUpperCase();
  for (i = 0; i <= lineno; i++) {
    let chue=`hsl(${(h+i*30)%360},${s},${l})`;
    if (x == "hue") { arr.push(w3color(chue)); }
    // if (x == "hue") { arr.push(w3color("hsl(" + (i * 15) + "," + s + "," + l + ")")); }
    else if (x == "sat") { arr.push(w3color("hsl(" + h + "," + (i * 0.05) + "," + l + ")")); }
    else if (x == "light") { arr.push(w3color("hsl(" + h + "," + s + "," + (i * 0.05) + ")")); }
  }
  // console.log('arr',arr); 
  if (x == "sat" || x == "light") { arr.reverse(); }
  a += "<div class='w3-responsive'>";
  a += "<table class='ws-table-all colorTable' style='width:100%;white-space: nowrap;font-size:14px;'>";
  a += "<tr>";
  a += `<td style='width:30px;'>${header}</td>`;
  for (i = 0; i < arr.length; i++) {
    a += `<tr><td style='cursor:pointer;background-color:${arr[i].toHexString()}' onclick='onclickColor("${arr[i].toHexString()}")'>${arr[i].toHexString()}</td></tr>`;
  }
  a += "</table></div>";
  dParent.innerHTML = a;
}
function hslTables(dParent,color) {
  let i, a='', match, same, comp, loopHSL, HSL;
  //var color = document.getElementById("colorhexDIV").innerHTML;
  let  hslObj = w3color(color);
  let h = hslObj.hue;
  let s = hslObj.sat;
  let l = hslObj.lightness;
  let arr = [];
  lineno=10;
  //let header = x.toUpperCase();
  for (i = 0; i <= lineno; i++) {
    let chue=`hsl(${(h-50+i*10)%360},${s},${l})`;
    let csat=`hsl(${h},${i*.1},${l})`;
    let clum=`hsl(${h},${s},${i*.1})`;
    arr.push({h:w3color(chue),s:w3color(csat),l:w3color(clum)});
  }
  // console.log('arr',arr); 
  a += "<div class='w3-responsive'>";
  a += "<table class='ws-table-all colorTable' style='width:100%;white-space: nowrap;font-size:14px;'>";
  a += "<tr>";
  a += `<td style='width:30px;'>Hue</td><td style='width:30px;'>Sat</td><td style='width:30px;'>Lum</td>`;
  for (i = 0; i < arr.length; i++) {
    let [hexh,hexs,hexl]=[arr[i].h.toHexString(),arr[i].s.toHexString(),arr[i].l.toHexString()];
    a += `
      <tr>
        <td style='cursor:pointer;background-color:${hexh}' onclick='onclickHue("${hexh}")'>${hexh}</td>
        <td style='cursor:pointer;background-color:${hexs}' onclick='onclickSat("${hexs}")'>${hexs}</td>
        <td style='cursor:pointer;background-color:${hexl}' onclick='onclickLum("${hexl}")'>${hexl}</td>
      </tr>`;
  }
  a += "</table></div>";
  dParent.innerHTML = a;
}
function mColorPickerBoard(dParent) {
	dParent = mDom(dParent); 

	//let board = drawHexBoard(7, 7, dParent, { bg: rColor(), padding:10, transition:'1s' }, {w:20,h:22, classes:'hexframe'}); //, {padding:10});
	let board = drawHexBoard(7, 7, dParent, { bg: 'transparent', padding: 10 }, { w: 20, h: 22 }); 
	board.dSample = mDom(dParent,{w:200,hmin:40,margin:'auto',align:'center'});
	let tables = mDom(dParent, {}, { id: 'dHslTable' });
	let colors = getColormapColors(); //console.log('colors', colors);

	let i = 0;
	for (const item of board.items) {
		let bg = colors[i++];
		item.color = bg;
		let dhex = iDiv(item);
		dhex.onmouseenter = () => onenterHex(item, board);
		dhex.onmouseleave = () => onleaveHex(item, board);
		dhex.onclick = () => onclickHex(item, board); //{mStyle(document.body, {bg});} 
		mStyle(dhex, { bg });
	}

	return board;
}
function sortColorsByHueAndLuminance(colors) {
	function _hexToHSL(hex) {
		// Convert hex to RGB first
		let r = parseInt(hex.slice(1, 3), 16) / 255;
		let g = parseInt(hex.slice(3, 5), 16) / 255;
		let b = parseInt(hex.slice(5, 7), 16) / 255;
		let cmin = Math.min(r, g, b),
				cmax = Math.max(r, g, b),
				delta = cmax - cmin,
				h = 0,
				s = 0,
				l = 0;
	
		if (delta === 0)
				h = 0;
		else if (cmax === r)
				h = ((g - b) / delta) % 6;
		else if (cmax === g)
				h = (b - r) / delta + 2;
		else
				h = (r - g) / delta + 4;
	
		h = Math.round(h * 60);
	
		// Make negative hues positive behind 360°
		if (h < 0)
				h += 360;
	
		l = (cmax + cmin) / 2;
	
		// Calculate saturation
		s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		
		// Multiply s and l by 100 to get the value in percentage, rather than [0,1]
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);
	
		return { h, s, l };
	}
	return colors.sort((a, b) => {
		const hslA = _hexToHSL(a);
		const hslB = _hexToHSL(b);
		if (hslA.h !== hslB.h) {
				return hslA.h - hslB.h;
		}
		// Sort by luminance if hues are equal
		return hslB.l - hslA.l; // Note: reverse to get light to dark if desired
	});
}
function sortColorsByLumHue(colors) {
	function _hexToHSL(hex) {
		// Convert hex to RGB first
		let r = parseInt(hex.slice(1, 3), 16) / 255;
		let g = parseInt(hex.slice(3, 5), 16) / 255;
		let b = parseInt(hex.slice(5, 7), 16) / 255;
		let cmin = Math.min(r, g, b),
				cmax = Math.max(r, g, b),
				delta = cmax - cmin,
				h = 0,
				s = 0,
				l = 0;
	
		if (delta === 0)
				h = 0;
		else if (cmax === r)
				h = ((g - b) / delta) % 6;
		else if (cmax === g)
				h = (b - r) / delta + 2;
		else
				h = (r - g) / delta + 4;
	
		h = Math.round(h * 60);
	
		// Make negative hues positive behind 360°
		if (h < 0)
				h += 360;
	
		l = (cmax + cmin) / 2;
	
		// Calculate saturation
		s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		
		// Multiply s and l by 100 to get the value in percentage, rather than [0,1]
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);
	
		return { h, s, l };
	}
	return colors.sort((a, b) => {
		const hslA = _hexToHSL(a);
		const hslB = _hexToHSL(b);
		if (hslA.l !== hslB.l) {
				return hslA.l - hslB.l;
		}
		// Sort by luminance if hues are equal
		return hslB.h - hslA.h; // Note: reverse to get light to dark if desired
	});
}
//#endregion

//#region 11.mai 24
function generateRYBColorHexagon() {
	const colors = [];
	const steps = 127;
	const huesPerStep = 360 / steps;
	
	for (let i = 0; i < steps; i++) {
			const hue = i * huesPerStep;
			const angle = hue * Math.PI / 180;
			// Generate RYB values based on the angle
			const ryb = [
					(Math.cos(angle) + 1) / 2 * 255,               // Red
					(Math.cos(angle - 2 * Math.PI / 3) + 1) / 2 * 255, // Yellow
					(Math.cos(angle + 2 * Math.PI / 3) + 1) / 2 * 255  // Blue
			];
			const rgb = rybToRgb(ryb);
			const hex = `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
			colors.push(hex);
	}
	
	return colors;
}
function rybToRgb(ryb) {
	const r = ryb[0] / 255, y = ryb[1] / 255, b = ryb[2] / 255;
	// Convert RYB directly to RGB
	const rgb = [
			1 * r + 1 * y + 0 * b, // Red
			0 * r + 1 * y + 0.5 * b, // Green
			0 * r + 0 * y + 1 * b // Blue
	];
	// Normalize the colors
	return rgb.map(c => Math.round(c * 255));
}

function sortByHue(colors){
  let list=colors.map(x=>w3color(x));
  list = sortBy(list,'hue');
  for(const c of list){c.hex=c.toHexString()}
  return list.map(x=>x.hex);
}
function sortByLum(colors){
  let list=colors.map(x=>w3color(x));
  list = sortBy(list,'lightness');
  for(const c of list){c.hex=c.toHexString()}
  return list.map(x=>x.hex);
}

function hslTable(dParent,x,color,cols) {
  var lineno, header, i, a, match, same, comp, loopHSL, HSL;
  //var color = document.getElementById("colorhexDIV").innerHTML;
  var hslObj = w3color(color);
  var h = hslObj.hue;
  var s = hslObj.sat;
  var l = hslObj.lightness;
  var arr = [];
  if (x == "hue") { header = "Hue"; lineno = 24; }
  if (x == "sat") { header = "Saturation"; lineno = 20; }
  if (x == "light") { header = "Lightness"; lineno = 20; }
  for (i = 0; i <= lineno; i++) {
    if (x == "hue") { arr.push(w3color("hsl(" + (i * 15) + "," + s + "," + l + ")")); }
    if (x == "sat") { arr.push(w3color("hsl(" + h + "," + (i * 0.05) + "," + l + ")")); }
    if (x == "light") { arr.push(w3color("hsl(" + h + "," + s + "," + (i * 0.05) + ")")); }
  }
  if (x == "sat" || x == "light") { arr.reverse(); }
  a = "<h3>" + header + "</h3>";
  a += "<div class='w3-responsive'>";
  a += "<table class='ws-table-all colorTable' style='width:100%;white-space: nowrap;font-size:14px;'>";
  a += "<tr>";
  a += "<td style='width:150px;'></td>";
  a += "<td style='text-align:right;text-transform:capitalize;'>" + x + "&nbsp;</td>";
  a += "<td>Hex</td>";
  a += "<td>Rgb</td>";
  a += "<td>Hsl</td>";
  a += "</tr>";
  match = 0;
  for (i = 0; i < arr.length; i++) {
    same = 0;
    if (x == "hue") {
      loopHSL = w3color(arr[i]).hue;
      HSL = h;
      if (i == arr.length - 1) { loopHSL = 360; }
      comp = (loopHSL > HSL);
    }
    if (x == "sat") {
      loopHSL = Math.round(w3color(arr[i]).sat * 100);
      HSL = Number(s * 100);
      HSL = Math.round(HSL);
      comp = (loopHSL < HSL);
      HSL = HSL + "%";
      loopHSL = loopHSL + "%";
    }
    if (x == "light") {
      loopHSL = Math.round(w3color(arr[i]).lightness * 100);
      HSL = Number(l * 100);
      HSL = Math.round(HSL);
      comp = (loopHSL < HSL);
      HSL = HSL + "%";
      loopHSL = loopHSL + "%";
    }
    if (HSL == loopHSL) {
      match++;
      same = 1;
    }
    if (comp) { match++; }
    if (match == 1) {
      a += "<tr class='ws-green'>";
      a += "<td style='background-color:" + hslObj.toHexString() + "'></td>";
      a += "<td style='text-align:right;'><b>" + HSL + "&nbsp;</b></td>";
      a += "<td><b>" + hslObj.toHexString() + "</b></td>";
      a += "<td><b>" + hslObj.toRgbString() + "</b></td>";
      a += "<td><b>" + hslObj.toHslString() + "</b></td>";
      a += "</tr>";
      match = 2;
    }
    if (same == 0) {
      a += "<tr>";
      a += "<td style='cursor:pointer;background-color:" + arr[i].toHexString() + "' onclick='clickColor(\"" + arr[i].toHexString() + "\")'></td>";
      a += "<td style='text-align:right;'>" + loopHSL + "&nbsp;</td>";
      a += "<td>" + arr[i].toHexString() + "</td>";
      a += "<td>" + arr[i].toRgbString() + "</td>";
      a += "<td>" + arr[i].toHslString() + "</td>";
      a += "</tr>";
    }
  }
  a += "</table></div>";
  dParent.innerHTML = a;
  // if (x == "hue") { document.getElementById("huecontainer").innerHTML = a; }
  // if (x == "sat") { document.getElementById("hslsatcontainer").innerHTML = a; }
  // if (x == "light") { document.getElementById("hsllumcontainer").innerHTML = a; }
}

function hslTable(dParent,x,color) {
  let i, a='', match, same, comp, loopHSL, HSL;
  //var color = document.getElementById("colorhexDIV").innerHTML;
  let  hslObj = w3color(color);
  let h = hslObj.hue;
  let s = hslObj.sat;
  let l = hslObj.lightness;
  let arr = [];
  let lineno = (x == "hue")?24:20;
  let header = x.toUpperCase();
  for (i = 0; i <= lineno; i++) {
    if (x == "hue") { arr.push(w3color("hsl(" + (i * 15) + "," + s + "," + l + ")")); }
    else if (x == "sat") { arr.push(w3color("hsl(" + h + "," + (i * 0.05) + "," + l + ")")); }
    else if (x == "light") { arr.push(w3color("hsl(" + h + "," + s + "," + (i * 0.05) + ")")); }
  }
  // console.log('arr',arr); 
  if (x == "sat" || x == "light") { arr.reverse(); }
  a += "<div class='w3-responsive'>";
  a += "<table class='ws-table-all colorTable' style='width:100%;white-space: nowrap;font-size:14px;'>";
  a += "<tr>";
  a += `<td style='width:30px;'>${header}</td>`;
  for (i = 0; i < arr.length; i++) {
    a += `<tr><td style='cursor:pointer;background-color:${arr[i].toHexString()}' onclick='onclickColor("${arr[i].toHexString()}")'>${arr[i].toHexString()}</td></tr>`;
  }
  a += "</table></div>";
  dParent.innerHTML = a;
}

function hsl360StringToHex79_(hsl) {
	let [h, s, l] = hsl.match(/\d+\.?\d*/g).map(Number);
	console.log('anfang',h,s,l);
	const hue = h/360;
	const saturation = s / 100;
	const lightness = l / 100;



	const [r, g, b] = hslToRgb__(h, s, l); //saturation, lightness);
	console.log('rgb',r,g,b)
	// Convert RGB to Hex
	const toHex = x => x.toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function hslToRgb__(h, s, l) {
	console.log('hallo')
	let c = (1 - Math.abs(2 * l - 1)) * s;
	let x = c * (1 - Math.abs((h / 60) % 2 - 1));
	let m = l - c / 2;
	let r = 0, g = 0, b = 0;

	if (h >= 0 && h < 60) {
		r = c; g = x; b = 0;
	} else if (h >= 60 && h < 120) {
		r = x; g = c; b = 0;
	} else if (h >= 120 && h < 180) {
		r = 0; g = c; b = x;
	} else if (h >= 180 && h < 240) {
		r = 0; g = x; b = c;
	} else if (h >= 240 && h < 300) {
		r = x; g = 0; b = c;
	} else if (h >= 300 && h < 360) {
		r = c; g = 0; b = x;
	}

	// Converting from 0-1 range to 0-255 range and adding m
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return [r, g, b];
}

async function mColorPicker(dParent) {
	let d = mDom(dParent,{bg:'black'});
	let img = await imgAsync(d, {}, { src: '../copi2/img_colormap.gif', usemap: '#colormap' });
	mStyle(d,{w:img.naturalWidth,h:img.naturalHeight});
	//console.log(img.naturalWidth, img.naturalHeight); let r = getRect(d); let ri = getRect(img); console.log('rect', r.w, r.h); console.log('ri', ri.w, ri.h);
	mAppend(d, colormapHtml());

	let dselect = mDom(d, { visibility: 'hidden', position: 'relative', w: 21, h: 21, bgImage: 'url("../copi2/img_selectedcolor.gif")' }, { id: 'selectedhexagon' });

	// <div id="selectedhexagon"
	// style='visibility:hidden;position:relative;width:21px;height:21px;background-image:url("../copi2/img_selectedcolor.gif")'>
	// </div>


	// d.innerHTML = `
	// 		<div style="display:inline-block;height:199px">
	// 			<img src='../copi2/img_colormap.gif' usemap='#colormap' alt='colormap' />
	// 			${map111()}				
	// 			${selecthexagon111()}				
	// 		</div>
	// `;
	console.log('rect', getRect(d));
	return d;
}
function drawHexBoard(topside,side,dParent,styles={},opts={}){
	addKeys({position:'relative'},styles);
	let d = mDom(dParent, styles, opts); // { position: 'relative', bg:'#222' });
	let [centers,rows,maxcols] = hexBoardCenters(topside,side);
	//console.log('centers',centers[0],centers)
	let sz = 20;
	let [w, h] = [sz, sz];
	let items = [];
	for(const c of centers){
		// let [x,y]=[w/2+c.x*w,h/2+c.y*h*.75];
		let dhex = hexFromCenter(d, {x:c.x*w,y:c.y*h}, { w:w-2, h:h-2, bg: 'pink' },{classes:'hop1'});
		dhex.onclick = ()=>mStyle(document.body, {bg:rColor()}); 
		let item = {div:dhex,cx:c.x,cy:c.y,row:c.row,col:c.col};
		items.push(item);
	}
	let [wBoard,hBoard]=[maxcols*w,rows*h*.75+h*.25];
	mStyle(d,{w:wBoard,h:hBoard}); //,'clip-path': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'});
	return {div:d,topside,side,centers,rows,maxcols,boardShape:'hex',w,h,wBoard,hBoard,items}

}
function drawHexBoard(topside,side,dParent,styles={},opts={}){
	addKeys({position:'relative'},styles);
	let d = mDom(dParent, styles, opts); // { position: 'relative', bg:'#222' });
	let [centers,rows,maxcols] = hexBoardCenters(topside,side);
	//console.log('centers',centers[0],centers)
	let sz = 20;
	let [w, h] = [sz, sz];
	let items = [];
	for(const c of centers){
		// let [x,y]=[w/2+c.x*w,h/2+c.y*h*.75];
		let dhex = hexFromCenter(d, {x:c.x*w,y:c.y*h}, { w:w-2, h:h-2, bg: 'pink' },{classes:'hop1'});
		dhex.onclick = ()=>mStyle(document.body, {bg:rColor()}); 
		let item = {div:dhex,cx:c.x,cy:c.y,row:c.row,col:c.col};
		items.push(item);
	}
	let [wBoard,hBoard]=[maxcols*w,rows*h*.75+h*.25];
	mStyle(d,{w:wBoard,h:hBoard}); //,'clip-path': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'});
	return {div:d,topside,side,centers,rows,maxcols,boardShape:'hex',w,h,wBoard,hBoard,items}

}
function drawHex(dParent, styles={}, opts={}) {
  //if (nundef(styles.w)) addKeys({ w: 100, h: 100, bg: 'blue' },styles);
	//styles.h=valf(styles.h,styles.w);//*.866);
  addKeys({ classes:'hop1' },opts);
	let d=mDom(dParent,styles,opts);
  // if (nundef(classes)) classes = ['frameOnHover'];
  // if (nundef(sizing)) sizing = { hgrow: true, wgrow: true };
  // let d = mDiv(dParent, styles, null, null, classes, sizing);
  mStyle(d, { 'clip-path': 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' });
  return d;
}
//#endregion

//#region clickColor progress from orig
function clickColor(hex, seltop, selleft, html5) {
  var c=hex;
  let cObj = w3color(c);
  let colorhex = cObj.toHexString();
	let colormap, areas, i, areacolor, cc;
  r = cObj.red;
  g = cObj.green;
  b = cObj.blue;

	//hier versucht er herauszufinden ob die color die via input eingegeben wurde im colorpicker existiert und setzt die coordinates falls ja!
  if (isdef(mBy('colornamDIV'))) {
    document.getElementById("colornamDIV").innerHTML = (cObj.toName() || "");
    document.getElementById("colorhexDIV").innerHTML = cObj.toHexString();
    document.getElementById("colorrgbDIV").innerHTML = cObj.toRgbString();
    document.getElementById("colorhslDIV").innerHTML = cObj.toHslString();
    if ((!seltop || seltop == -1) && (!selleft || selleft == -1)) {
      colormap = document.getElementById("colormap");
      areas = colormap.getElementsByTagName("AREA");
      for (i = 0; i < areas.length; i++) {
        areacolor = areas[i].getAttribute("onmouseover").replace('mouseOverColor("', '');
        areacolor = areacolor.replace('")', '');
        if (areacolor.toLowerCase() == colorhex) {
          cc = areas[i].getAttribute("onclick").replace(')', '').split(",");
          seltop = Number(cc[1]);
          selleft = Number(cc[2]);
        }
      }
    }
    document.getElementById("selectedcolor").style.backgroundColor = cObj.toHexString();
  }

  if ((seltop + 200) > -1 && selleft > -1) {
    document.getElementById("selectedhexagon").style.top = seltop + "px";
    document.getElementById("selectedhexagon").style.left = selleft + "px";
    document.getElementById("selectedhexagon").style.visibility = "visible";
  } else {
    document.getElementById("divpreview").style.backgroundColor = cObj.toHexString();
    document.getElementById("selectedhexagon").style.visibility = "hidden";
  }

  if (isdef(mBy('html5colorpicker'))) {
    document.getElementById("html5colorpicker").value = cObj.toHexString();
  }

  if (isdef(mBy('slideRed'))) {
    document.getElementById('slideRed').value = r;
    document.getElementById('slideGreen').value = g;
    document.getElementById('slideBlue').value = b;
    changeRed(r); changeGreen(g); changeBlue(b);
    changeColor();
    document.getElementById("fixed").style.backgroundColor = cObj.toHexString();
  }
}
function clickColor_orig(hex, seltop, selleft, html5) {
  var c, cObj, colormap, areas, i, areacolor, cc;
  if (html5 && html5 == 5) {
    c = document.getElementById("html5colorpicker").value;
  } else {
    if (hex == 0) {
      c = document.getElementById("entercolor").value;
      c = c.replace(/;/g, ","); //replace any semicolon with a comma
    } else {
      c = hex;
    }
  }
  cObj = w3color(c);
  colorhex = cObj.toHexString();
  if (cObj.valid) {
    clearWrongInput();
  } else {
    wrongInput();
    return;
  }

  r = cObj.red;
  g = cObj.green;
  b = cObj.blue;

  if (isdef(mBy('colornamDIV'))) {
    document.getElementById("colornamDIV").innerHTML = (cObj.toName() || "");
    document.getElementById("colorhexDIV").innerHTML = cObj.toHexString();
    document.getElementById("colorrgbDIV").innerHTML = cObj.toRgbString();
    document.getElementById("colorhslDIV").innerHTML = cObj.toHslString();
    if ((!seltop || seltop == -1) && (!selleft || selleft == -1)) {
      colormap = document.getElementById("colormap");
      areas = colormap.getElementsByTagName("AREA");
      for (i = 0; i < areas.length; i++) {
        areacolor = areas[i].getAttribute("onmouseover").replace('mouseOverColor("', '');
        areacolor = areacolor.replace('")', '');
        if (areacolor.toLowerCase() == colorhex) {
          cc = areas[i].getAttribute("onclick").replace(')', '').split(",");
          seltop = Number(cc[1]);
          selleft = Number(cc[2]);
        }
      }
    }
    document.getElementById("selectedcolor").style.backgroundColor = cObj.toHexString();
  }

  if ((seltop + 200) > -1 && selleft > -1) {
    document.getElementById("selectedhexagon").style.top = seltop + "px";
    document.getElementById("selectedhexagon").style.left = selleft + "px";
    document.getElementById("selectedhexagon").style.visibility = "visible";
  } else {
    document.getElementById("divpreview").style.backgroundColor = cObj.toHexString();
    document.getElementById("selectedhexagon").style.visibility = "hidden";
  }

  if (isdef(mBy('html5colorpicker'))) {
    document.getElementById("html5colorpicker").value = cObj.toHexString();
  }

  if (isdef(mBy('slideRed'))) {
    document.getElementById('slideRed').value = r;
    document.getElementById('slideGreen').value = g;
    document.getElementById('slideBlue').value = b;
    changeRed(r); changeGreen(g); changeBlue(b);
    changeColor();
    document.getElementById("fixed").style.backgroundColor = cObj.toHexString();
  }
}


//#endregion

//#region bad copi2 parts
function NOpart111(){
	let html = `
	<div class="w3-row">
		<div class="w3-col colorthird1" style="text-align:center;">
			${h3_111('Pick a Color:')}				
			<div style="margin:auto;width:236px;">
				<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${script111()}				
				${selecthexagon111()}				
				${previewDiv_111()}				
				${h3_111('Or Enter a Color')}				
				${entercolor111()}				
				${wrongInput_111()}
				<br>
				${html5Div_111()}
				<br>
				<br>
			</div>
		</div>
	`;
	return createFom(html);
}
function NOpart111(){
	let d=mDom(null,{},{classes:'w3-row'});
	let html = `
		<div class="w3-col colorthird1" style="text-align:center;">
			${h3_111('Pick a Color:')}				
			<div style="margin:auto;width:236px;">
				<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${script111()}				
				${selecthexagon111()}				
				${previewDiv_111()}				
				${h3_111('Or Enter a Color')}				
				${entercolor111()}				
				${wrongInput_111()}
				<br>
				${html5Div_111()}
				<br>
				<br>
			</div>
		</div>
	`;
	mAppend(d,createFom(html));
	return d;
}
function NOpart111(){
	let d=mDom(null,{},{classes:'w3-row'});
	let d1=mDom(d,{align:'center',w100:true},{classes:'w3-col',html:h3_111('Pick a Color:')});

	let html = `
		<div style="margin:auto;width:236px;">
			<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' />
			${map111()}				
			${script111()}				
			${selecthexagon111()}				
			${previewDiv_111()}				
			${h3_111('Or Enter a Color')}				
			${entercolor111()}				
			${wrongInput_111()}
			<br>
			${html5Div_111()}
			<br>
			<br>
		</div>
	`;
	mAppend(d1,createFom(html));
	return d;
}
function part111_2(){	
	let html = `
		<div class="w3-col colorthird2" style="text-align:center;">
			<h3>Selected Color:</h3>
			<div id="selectedcolor" class="w3-large">
				<br><br>
				<span class="w3-text-black">Black Text</span><br><br>
				<span class="w3-text-black" style="text-shadow:1px 1px 0 #444">Shadow</span><br><br>
				<span class="w3-text-white">White Text</span><br><br>
				<span class="w3-text-white" style="text-shadow:1px 1px 0 #444">Shadow</span>
			</div>
			<div id="colornamDIV" class="w3-margin-top"></div>
			<div><b><span id="colorhexDIV"></span></b></div>
			<div id="colorrgbDIV"></div>
			<div id="colorhslDIV"></div>
		</div>

		<div class="w3-col colorthird3">
			<div id="lumtopcontainer"></div>
		</div>
	</div>

	`;

	return mCreateFrom(html);

}
function col3_111(){
	return `
			<div class="w3-col colorthird3">
				<div id="lumtopcontainer"></div>
			</div>
		`;	
}
function col2_111(){
	return `
	<div class="w3-col colorthird2" style="text-align:center;">
		<h3>Selected Color:</h3>
		<div id="selectedcolor" class="w3-large">
			<br><br>
			<span class="w3-text-black">Black Text</span><br><br>
			<span class="w3-text-black" style="text-shadow:1px 1px 0 #444">Shadow</span><br><br>
			<span class="w3-text-white">White Text</span><br><br>
			<span class="w3-text-white" style="text-shadow:1px 1px 0 #444">Shadow</span>
		</div>
		<div id="colornamDIV" class="w3-margin-top"></div>
		<div><b><span id="colorhexDIV"></span></b></div>
		<div id="colorrgbDIV"></div>
		<div id="colorhslDIV"></div>
	</div>
`;	
}
function copi2_all111() {
	let html = `
	<div class="w3-col colorthird1" style="text-align:center;">
	<h3>Pick a Color:</h3>
	<div style="margin:auto;width:236px;">
		<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' /><map
			id='colormap' name='colormap' onmouseout='mouseOutMap()'><area style='cursor:pointer' shape='poly'
				coords='63,0,72,4,72,15,63,19,54,15,54,4' onclick='clickColor("#003366",-200,54)'
				onmouseover='mouseOverColor("#003366")' alt='#003366' /><area style='cursor:pointer' shape='poly'
				coords='81,0,90,4,90,15,81,19,72,15,72,4' onclick='clickColor("#336699",-200,72)'
				onmouseover='mouseOverColor("#336699")' alt='#336699' /><area style='cursor:pointer' shape='poly'
				coords='99,0,108,4,108,15,99,19,90,15,90,4' onclick='clickColor("#3366CC",-200,90)'
				onmouseover='mouseOverColor("#3366CC")' alt='#3366CC' /><area style='cursor:pointer' shape='poly'
				coords='117,0,126,4,126,15,117,19,108,15,108,4' onclick='clickColor("#003399",-200,108)'
				onmouseover='mouseOverColor("#003399")' alt='#003399' /><area style='cursor:pointer' shape='poly'
				coords='135,0,144,4,144,15,135,19,126,15,126,4' onclick='clickColor("#000099",-200,126)'
				onmouseover='mouseOverColor("#000099")' alt='#000099' /><area style='cursor:pointer' shape='poly'
				coords='153,0,162,4,162,15,153,19,144,15,144,4' onclick='clickColor("#0000CC",-200,144)'
				onmouseover='mouseOverColor("#0000CC")' alt='#0000CC' /><area style='cursor:pointer' shape='poly'
				coords='171,0,180,4,180,15,171,19,162,15,162,4' onclick='clickColor("#000066",-200,162)'
				onmouseover='mouseOverColor("#000066")' alt='#000066' /><area style='cursor:pointer' shape='poly'
				coords='54,15,63,19,63,30,54,34,45,30,45,19' onclick='clickColor("#006666",-185,45)'
				onmouseover='mouseOverColor("#006666")' alt='#006666' /><area style='cursor:pointer' shape='poly'
				coords='72,15,81,19,81,30,72,34,63,30,63,19' onclick='clickColor("#006699",-185,63)'
				onmouseover='mouseOverColor("#006699")' alt='#006699' /><area style='cursor:pointer' shape='poly'
				coords='90,15,99,19,99,30,90,34,81,30,81,19' onclick='clickColor("#0099CC",-185,81)'
				onmouseover='mouseOverColor("#0099CC")' alt='#0099CC' /><area style='cursor:pointer' shape='poly'
				coords='108,15,117,19,117,30,108,34,99,30,99,19' onclick='clickColor("#0066CC",-185,99)'
				onmouseover='mouseOverColor("#0066CC")' alt='#0066CC' /><area style='cursor:pointer' shape='poly'
				coords='126,15,135,19,135,30,126,34,117,30,117,19' onclick='clickColor("#0033CC",-185,117)'
				onmouseover='mouseOverColor("#0033CC")' alt='#0033CC' /><area style='cursor:pointer' shape='poly'
				coords='144,15,153,19,153,30,144,34,135,30,135,19' onclick='clickColor("#0000FF",-185,135)'
				onmouseover='mouseOverColor("#0000FF")' alt='#0000FF' /><area style='cursor:pointer' shape='poly'
				coords='162,15,171,19,171,30,162,34,153,30,153,19' onclick='clickColor("#3333FF",-185,153)'
				onmouseover='mouseOverColor("#3333FF")' alt='#3333FF' /><area style='cursor:pointer' shape='poly'
				coords='180,15,189,19,189,30,180,34,171,30,171,19' onclick='clickColor("#333399",-185,171)'
				onmouseover='mouseOverColor("#333399")' alt='#333399' /><area style='cursor:pointer' shape='poly'
				coords='45,30,54,34,54,45,45,49,36,45,36,34' onclick='clickColor("#669999",-170,36)'
				onmouseover='mouseOverColor("#669999")' alt='#669999' /><area style='cursor:pointer' shape='poly'
				coords='63,30,72,34,72,45,63,49,54,45,54,34' onclick='clickColor("#009999",-170,54)'
				onmouseover='mouseOverColor("#009999")' alt='#009999' /><area style='cursor:pointer' shape='poly'
				coords='81,30,90,34,90,45,81,49,72,45,72,34' onclick='clickColor("#33CCCC",-170,72)'
				onmouseover='mouseOverColor("#33CCCC")' alt='#33CCCC' /><area style='cursor:pointer' shape='poly'
				coords='99,30,108,34,108,45,99,49,90,45,90,34' onclick='clickColor("#00CCFF",-170,90)'
				onmouseover='mouseOverColor("#00CCFF")' alt='#00CCFF' /><area style='cursor:pointer' shape='poly'
				coords='117,30,126,34,126,45,117,49,108,45,108,34' onclick='clickColor("#0099FF",-170,108)'
				onmouseover='mouseOverColor("#0099FF")' alt='#0099FF' /><area style='cursor:pointer' shape='poly'
				coords='135,30,144,34,144,45,135,49,126,45,126,34' onclick='clickColor("#0066FF",-170,126)'
				onmouseover='mouseOverColor("#0066FF")' alt='#0066FF' /><area style='cursor:pointer' shape='poly'
				coords='153,30,162,34,162,45,153,49,144,45,144,34' onclick='clickColor("#3366FF",-170,144)'
				onmouseover='mouseOverColor("#3366FF")' alt='#3366FF' /><area style='cursor:pointer' shape='poly'
				coords='171,30,180,34,180,45,171,49,162,45,162,34' onclick='clickColor("#3333CC",-170,162)'
				onmouseover='mouseOverColor("#3333CC")' alt='#3333CC' /><area style='cursor:pointer' shape='poly'
				coords='189,30,198,34,198,45,189,49,180,45,180,34' onclick='clickColor("#666699",-170,180)'
				onmouseover='mouseOverColor("#666699")' alt='#666699' /><area style='cursor:pointer' shape='poly'
				coords='36,45,45,49,45,60,36,64,27,60,27,49' onclick='clickColor("#339966",-155,27)'
				onmouseover='mouseOverColor("#339966")' alt='#339966' /><area style='cursor:pointer' shape='poly'
				coords='54,45,63,49,63,60,54,64,45,60,45,49' onclick='clickColor("#00CC99",-155,45)'
				onmouseover='mouseOverColor("#00CC99")' alt='#00CC99' /><area style='cursor:pointer' shape='poly'
				coords='72,45,81,49,81,60,72,64,63,60,63,49' onclick='clickColor("#00FFCC",-155,63)'
				onmouseover='mouseOverColor("#00FFCC")' alt='#00FFCC' /><area style='cursor:pointer' shape='poly'
				coords='90,45,99,49,99,60,90,64,81,60,81,49' onclick='clickColor("#00FFFF",-155,81)'
				onmouseover='mouseOverColor("#00FFFF")' alt='#00FFFF' /><area style='cursor:pointer' shape='poly'
				coords='108,45,117,49,117,60,108,64,99,60,99,49' onclick='clickColor("#33CCFF",-155,99)'
				onmouseover='mouseOverColor("#33CCFF")' alt='#33CCFF' /><area style='cursor:pointer' shape='poly'
				coords='126,45,135,49,135,60,126,64,117,60,117,49' onclick='clickColor("#3399FF",-155,117)'
				onmouseover='mouseOverColor("#3399FF")' alt='#3399FF' /><area style='cursor:pointer' shape='poly'
				coords='144,45,153,49,153,60,144,64,135,60,135,49' onclick='clickColor("#6699FF",-155,135)'
				onmouseover='mouseOverColor("#6699FF")' alt='#6699FF' /><area style='cursor:pointer' shape='poly'
				coords='162,45,171,49,171,60,162,64,153,60,153,49' onclick='clickColor("#6666FF",-155,153)'
				onmouseover='mouseOverColor("#6666FF")' alt='#6666FF' /><area style='cursor:pointer' shape='poly'
				coords='180,45,189,49,189,60,180,64,171,60,171,49' onclick='clickColor("#6600FF",-155,171)'
				onmouseover='mouseOverColor("#6600FF")' alt='#6600FF' /><area style='cursor:pointer' shape='poly'
				coords='198,45,207,49,207,60,198,64,189,60,189,49' onclick='clickColor("#6600CC",-155,189)'
				onmouseover='mouseOverColor("#6600CC")' alt='#6600CC' /><area style='cursor:pointer' shape='poly'
				coords='27,60,36,64,36,75,27,79,18,75,18,64' onclick='clickColor("#339933",-140,18)'
				onmouseover='mouseOverColor("#339933")' alt='#339933' /><area style='cursor:pointer' shape='poly'
				coords='45,60,54,64,54,75,45,79,36,75,36,64' onclick='clickColor("#00CC66",-140,36)'
				onmouseover='mouseOverColor("#00CC66")' alt='#00CC66' /><area style='cursor:pointer' shape='poly'
				coords='63,60,72,64,72,75,63,79,54,75,54,64' onclick='clickColor("#00FF99",-140,54)'
				onmouseover='mouseOverColor("#00FF99")' alt='#00FF99' /><area style='cursor:pointer' shape='poly'
				coords='81,60,90,64,90,75,81,79,72,75,72,64' onclick='clickColor("#66FFCC",-140,72)'
				onmouseover='mouseOverColor("#66FFCC")' alt='#66FFCC' /><area style='cursor:pointer' shape='poly'
				coords='99,60,108,64,108,75,99,79,90,75,90,64' onclick='clickColor("#66FFFF",-140,90)'
				onmouseover='mouseOverColor("#66FFFF")' alt='#66FFFF' /><area style='cursor:pointer' shape='poly'
				coords='117,60,126,64,126,75,117,79,108,75,108,64' onclick='clickColor("#66CCFF",-140,108)'
				onmouseover='mouseOverColor("#66CCFF")' alt='#66CCFF' /><area style='cursor:pointer' shape='poly'
				coords='135,60,144,64,144,75,135,79,126,75,126,64' onclick='clickColor("#99CCFF",-140,126)'
				onmouseover='mouseOverColor("#99CCFF")' alt='#99CCFF' /><area style='cursor:pointer' shape='poly'
				coords='153,60,162,64,162,75,153,79,144,75,144,64' onclick='clickColor("#9999FF",-140,144)'
				onmouseover='mouseOverColor("#9999FF")' alt='#9999FF' /><area style='cursor:pointer' shape='poly'
				coords='171,60,180,64,180,75,171,79,162,75,162,64' onclick='clickColor("#9966FF",-140,162)'
				onmouseover='mouseOverColor("#9966FF")' alt='#9966FF' /><area style='cursor:pointer' shape='poly'
				coords='189,60,198,64,198,75,189,79,180,75,180,64' onclick='clickColor("#9933FF",-140,180)'
				onmouseover='mouseOverColor("#9933FF")' alt='#9933FF' /><area style='cursor:pointer' shape='poly'
				coords='207,60,216,64,216,75,207,79,198,75,198,64' onclick='clickColor("#9900FF",-140,198)'
				onmouseover='mouseOverColor("#9900FF")' alt='#9900FF' /><area style='cursor:pointer' shape='poly'
				coords='18,75,27,79,27,90,18,94,9,90,9,79' onclick='clickColor("#006600",-125,9)'
				onmouseover='mouseOverColor("#006600")' alt='#006600' /><area style='cursor:pointer' shape='poly'
				coords='36,75,45,79,45,90,36,94,27,90,27,79' onclick='clickColor("#00CC00",-125,27)'
				onmouseover='mouseOverColor("#00CC00")' alt='#00CC00' /><area style='cursor:pointer' shape='poly'
				coords='54,75,63,79,63,90,54,94,45,90,45,79' onclick='clickColor("#00FF00",-125,45)'
				onmouseover='mouseOverColor("#00FF00")' alt='#00FF00' /><area style='cursor:pointer' shape='poly'
				coords='72,75,81,79,81,90,72,94,63,90,63,79' onclick='clickColor("#66FF99",-125,63)'
				onmouseover='mouseOverColor("#66FF99")' alt='#66FF99' /><area style='cursor:pointer' shape='poly'
				coords='90,75,99,79,99,90,90,94,81,90,81,79' onclick='clickColor("#99FFCC",-125,81)'
				onmouseover='mouseOverColor("#99FFCC")' alt='#99FFCC' /><area style='cursor:pointer' shape='poly'
				coords='108,75,117,79,117,90,108,94,99,90,99,79' onclick='clickColor("#CCFFFF",-125,99)'
				onmouseover='mouseOverColor("#CCFFFF")' alt='#CCFFFF' /><area style='cursor:pointer' shape='poly'
				coords='126,75,135,79,135,90,126,94,117,90,117,79' onclick='clickColor("#CCCCFF",-125,117)'
				onmouseover='mouseOverColor("#CCCCFF")' alt='#CCCCFF' /><area style='cursor:pointer' shape='poly'
				coords='144,75,153,79,153,90,144,94,135,90,135,79' onclick='clickColor("#CC99FF",-125,135)'
				onmouseover='mouseOverColor("#CC99FF")' alt='#CC99FF' /><area style='cursor:pointer' shape='poly'
				coords='162,75,171,79,171,90,162,94,153,90,153,79' onclick='clickColor("#CC66FF",-125,153)'
				onmouseover='mouseOverColor("#CC66FF")' alt='#CC66FF' /><area style='cursor:pointer' shape='poly'
				coords='180,75,189,79,189,90,180,94,171,90,171,79' onclick='clickColor("#CC33FF",-125,171)'
				onmouseover='mouseOverColor("#CC33FF")' alt='#CC33FF' /><area style='cursor:pointer' shape='poly'
				coords='198,75,207,79,207,90,198,94,189,90,189,79' onclick='clickColor("#CC00FF",-125,189)'
				onmouseover='mouseOverColor("#CC00FF")' alt='#CC00FF' /><area style='cursor:pointer' shape='poly'
				coords='216,75,225,79,225,90,216,94,207,90,207,79' onclick='clickColor("#9900CC",-125,207)'
				onmouseover='mouseOverColor("#9900CC")' alt='#9900CC' /><area style='cursor:pointer' shape='poly'
				coords='9,90,18,94,18,105,9,109,0,105,0,94' onclick='clickColor("#003300",-110,0)'
				onmouseover='mouseOverColor("#003300")' alt='#003300' /><area style='cursor:pointer' shape='poly'
				coords='27,90,36,94,36,105,27,109,18,105,18,94' onclick='clickColor("#009933",-110,18)'
				onmouseover='mouseOverColor("#009933")' alt='#009933' /><area style='cursor:pointer' shape='poly'
				coords='45,90,54,94,54,105,45,109,36,105,36,94' onclick='clickColor("#33CC33",-110,36)'
				onmouseover='mouseOverColor("#33CC33")' alt='#33CC33' /><area style='cursor:pointer' shape='poly'
				coords='63,90,72,94,72,105,63,109,54,105,54,94' onclick='clickColor("#66FF66",-110,54)'
				onmouseover='mouseOverColor("#66FF66")' alt='#66FF66' /><area style='cursor:pointer' shape='poly'
				coords='81,90,90,94,90,105,81,109,72,105,72,94' onclick='clickColor("#99FF99",-110,72)'
				onmouseover='mouseOverColor("#99FF99")' alt='#99FF99' /><area style='cursor:pointer' shape='poly'
				coords='99,90,108,94,108,105,99,109,90,105,90,94' onclick='clickColor("#CCFFCC",-110,90)'
				onmouseover='mouseOverColor("#CCFFCC")' alt='#CCFFCC' /><area style='cursor:pointer' shape='poly'
				coords='117,90,126,94,126,105,117,109,108,105,108,94' onclick='clickColor("#FFFFFF",-110,108)'
				onmouseover='mouseOverColor("#FFFFFF")' alt='#FFFFFF' /><area style='cursor:pointer' shape='poly'
				coords='135,90,144,94,144,105,135,109,126,105,126,94' onclick='clickColor("#FFCCFF",-110,126)'
				onmouseover='mouseOverColor("#FFCCFF")' alt='#FFCCFF' /><area style='cursor:pointer' shape='poly'
				coords='153,90,162,94,162,105,153,109,144,105,144,94' onclick='clickColor("#FF99FF",-110,144)'
				onmouseover='mouseOverColor("#FF99FF")' alt='#FF99FF' /><area style='cursor:pointer' shape='poly'
				coords='171,90,180,94,180,105,171,109,162,105,162,94' onclick='clickColor("#FF66FF",-110,162)'
				onmouseover='mouseOverColor("#FF66FF")' alt='#FF66FF' /><area style='cursor:pointer' shape='poly'
				coords='189,90,198,94,198,105,189,109,180,105,180,94' onclick='clickColor("#FF00FF",-110,180)'
				onmouseover='mouseOverColor("#FF00FF")' alt='#FF00FF' /><area style='cursor:pointer' shape='poly'
				coords='207,90,216,94,216,105,207,109,198,105,198,94' onclick='clickColor("#CC00CC",-110,198)'
				onmouseover='mouseOverColor("#CC00CC")' alt='#CC00CC' /><area style='cursor:pointer' shape='poly'
				coords='225,90,234,94,234,105,225,109,216,105,216,94' onclick='clickColor("#660066",-110,216)'
				onmouseover='mouseOverColor("#660066")' alt='#660066' /><area style='cursor:pointer' shape='poly'
				coords='18,105,27,109,27,120,18,124,9,120,9,109' onclick='clickColor("#336600",-95,9)'
				onmouseover='mouseOverColor("#336600")' alt='#336600' /><area style='cursor:pointer' shape='poly'
				coords='36,105,45,109,45,120,36,124,27,120,27,109' onclick='clickColor("#009900",-95,27)'
				onmouseover='mouseOverColor("#009900")' alt='#009900' /><area style='cursor:pointer' shape='poly'
				coords='54,105,63,109,63,120,54,124,45,120,45,109' onclick='clickColor("#66FF33",-95,45)'
				onmouseover='mouseOverColor("#66FF33")' alt='#66FF33' /><area style='cursor:pointer' shape='poly'
				coords='72,105,81,109,81,120,72,124,63,120,63,109' onclick='clickColor("#99FF66",-95,63)'
				onmouseover='mouseOverColor("#99FF66")' alt='#99FF66' /><area style='cursor:pointer' shape='poly'
				coords='90,105,99,109,99,120,90,124,81,120,81,109' onclick='clickColor("#CCFF99",-95,81)'
				onmouseover='mouseOverColor("#CCFF99")' alt='#CCFF99' /><area style='cursor:pointer' shape='poly'
				coords='108,105,117,109,117,120,108,124,99,120,99,109' onclick='clickColor("#FFFFCC",-95,99)'
				onmouseover='mouseOverColor("#FFFFCC")' alt='#FFFFCC' /><area style='cursor:pointer' shape='poly'
				coords='126,105,135,109,135,120,126,124,117,120,117,109' onclick='clickColor("#FFCCCC",-95,117)'
				onmouseover='mouseOverColor("#FFCCCC")' alt='#FFCCCC' /><area style='cursor:pointer' shape='poly'
				coords='144,105,153,109,153,120,144,124,135,120,135,109' onclick='clickColor("#FF99CC",-95,135)'
				onmouseover='mouseOverColor("#FF99CC")' alt='#FF99CC' /><area style='cursor:pointer' shape='poly'
				coords='162,105,171,109,171,120,162,124,153,120,153,109' onclick='clickColor("#FF66CC",-95,153)'
				onmouseover='mouseOverColor("#FF66CC")' alt='#FF66CC' /><area style='cursor:pointer' shape='poly'
				coords='180,105,189,109,189,120,180,124,171,120,171,109' onclick='clickColor("#FF33CC",-95,171)'
				onmouseover='mouseOverColor("#FF33CC")' alt='#FF33CC' /><area style='cursor:pointer' shape='poly'
				coords='198,105,207,109,207,120,198,124,189,120,189,109' onclick='clickColor("#CC0099",-95,189)'
				onmouseover='mouseOverColor("#CC0099")' alt='#CC0099' /><area style='cursor:pointer' shape='poly'
				coords='216,105,225,109,225,120,216,124,207,120,207,109' onclick='clickColor("#993399",-95,207)'
				onmouseover='mouseOverColor("#993399")' alt='#993399' /><area style='cursor:pointer' shape='poly'
				coords='27,120,36,124,36,135,27,139,18,135,18,124' onclick='clickColor("#333300",-80,18)'
				onmouseover='mouseOverColor("#333300")' alt='#333300' /><area style='cursor:pointer' shape='poly'
				coords='45,120,54,124,54,135,45,139,36,135,36,124' onclick='clickColor("#669900",-80,36)'
				onmouseover='mouseOverColor("#669900")' alt='#669900' /><area style='cursor:pointer' shape='poly'
				coords='63,120,72,124,72,135,63,139,54,135,54,124' onclick='clickColor("#99FF33",-80,54)'
				onmouseover='mouseOverColor("#99FF33")' alt='#99FF33' /><area style='cursor:pointer' shape='poly'
				coords='81,120,90,124,90,135,81,139,72,135,72,124' onclick='clickColor("#CCFF66",-80,72)'
				onmouseover='mouseOverColor("#CCFF66")' alt='#CCFF66' /><area style='cursor:pointer' shape='poly'
				coords='99,120,108,124,108,135,99,139,90,135,90,124' onclick='clickColor("#FFFF99",-80,90)'
				onmouseover='mouseOverColor("#FFFF99")' alt='#FFFF99' /><area style='cursor:pointer' shape='poly'
				coords='117,120,126,124,126,135,117,139,108,135,108,124' onclick='clickColor("#FFCC99",-80,108)'
				onmouseover='mouseOverColor("#FFCC99")' alt='#FFCC99' /><area style='cursor:pointer' shape='poly'
				coords='135,120,144,124,144,135,135,139,126,135,126,124' onclick='clickColor("#FF9999",-80,126)'
				onmouseover='mouseOverColor("#FF9999")' alt='#FF9999' /><area style='cursor:pointer' shape='poly'
				coords='153,120,162,124,162,135,153,139,144,135,144,124' onclick='clickColor("#FF6699",-80,144)'
				onmouseover='mouseOverColor("#FF6699")' alt='#FF6699' /><area style='cursor:pointer' shape='poly'
				coords='171,120,180,124,180,135,171,139,162,135,162,124' onclick='clickColor("#FF3399",-80,162)'
				onmouseover='mouseOverColor("#FF3399")' alt='#FF3399' /><area style='cursor:pointer' shape='poly'
				coords='189,120,198,124,198,135,189,139,180,135,180,124' onclick='clickColor("#CC3399",-80,180)'
				onmouseover='mouseOverColor("#CC3399")' alt='#CC3399' /><area style='cursor:pointer' shape='poly'
				coords='207,120,216,124,216,135,207,139,198,135,198,124' onclick='clickColor("#990099",-80,198)'
				onmouseover='mouseOverColor("#990099")' alt='#990099' /><area style='cursor:pointer' shape='poly'
				coords='36,135,45,139,45,150,36,154,27,150,27,139' onclick='clickColor("#666633",-65,27)'
				onmouseover='mouseOverColor("#666633")' alt='#666633' /><area style='cursor:pointer' shape='poly'
				coords='54,135,63,139,63,150,54,154,45,150,45,139' onclick='clickColor("#99CC00",-65,45)'
				onmouseover='mouseOverColor("#99CC00")' alt='#99CC00' /><area style='cursor:pointer' shape='poly'
				coords='72,135,81,139,81,150,72,154,63,150,63,139' onclick='clickColor("#CCFF33",-65,63)'
				onmouseover='mouseOverColor("#CCFF33")' alt='#CCFF33' /><area style='cursor:pointer' shape='poly'
				coords='90,135,99,139,99,150,90,154,81,150,81,139' onclick='clickColor("#FFFF66",-65,81)'
				onmouseover='mouseOverColor("#FFFF66")' alt='#FFFF66' /><area style='cursor:pointer' shape='poly'
				coords='108,135,117,139,117,150,108,154,99,150,99,139' onclick='clickColor("#FFCC66",-65,99)'
				onmouseover='mouseOverColor("#FFCC66")' alt='#FFCC66' /><area style='cursor:pointer' shape='poly'
				coords='126,135,135,139,135,150,126,154,117,150,117,139' onclick='clickColor("#FF9966",-65,117)'
				onmouseover='mouseOverColor("#FF9966")' alt='#FF9966' /><area style='cursor:pointer' shape='poly'
				coords='144,135,153,139,153,150,144,154,135,150,135,139' onclick='clickColor("#FF6666",-65,135)'
				onmouseover='mouseOverColor("#FF6666")' alt='#FF6666' /><area style='cursor:pointer' shape='poly'
				coords='162,135,171,139,171,150,162,154,153,150,153,139' onclick='clickColor("#FF0066",-65,153)'
				onmouseover='mouseOverColor("#FF0066")' alt='#FF0066' /><area style='cursor:pointer' shape='poly'
				coords='180,135,189,139,189,150,180,154,171,150,171,139' onclick='clickColor("#CC6699",-65,171)'
				onmouseover='mouseOverColor("#CC6699")' alt='#CC6699' /><area style='cursor:pointer' shape='poly'
				coords='198,135,207,139,207,150,198,154,189,150,189,139' onclick='clickColor("#993366",-65,189)'
				onmouseover='mouseOverColor("#993366")' alt='#993366' /><area style='cursor:pointer' shape='poly'
				coords='45,150,54,154,54,165,45,169,36,165,36,154' onclick='clickColor("#999966",-50,36)'
				onmouseover='mouseOverColor("#999966")' alt='#999966' /><area style='cursor:pointer' shape='poly'
				coords='63,150,72,154,72,165,63,169,54,165,54,154' onclick='clickColor("#CCCC00",-50,54)'
				onmouseover='mouseOverColor("#CCCC00")' alt='#CCCC00' /><area style='cursor:pointer' shape='poly'
				coords='81,150,90,154,90,165,81,169,72,165,72,154' onclick='clickColor("#FFFF00",-50,72)'
				onmouseover='mouseOverColor("#FFFF00")' alt='#FFFF00' /><area style='cursor:pointer' shape='poly'
				coords='99,150,108,154,108,165,99,169,90,165,90,154' onclick='clickColor("#FFCC00",-50,90)'
				onmouseover='mouseOverColor("#FFCC00")' alt='#FFCC00' /><area style='cursor:pointer' shape='poly'
				coords='117,150,126,154,126,165,117,169,108,165,108,154' onclick='clickColor("#FF9933",-50,108)'
				onmouseover='mouseOverColor("#FF9933")' alt='#FF9933' /><area style='cursor:pointer' shape='poly'
				coords='135,150,144,154,144,165,135,169,126,165,126,154' onclick='clickColor("#FF6600",-50,126)'
				onmouseover='mouseOverColor("#FF6600")' alt='#FF6600' /><area style='cursor:pointer' shape='poly'
				coords='153,150,162,154,162,165,153,169,144,165,144,154' onclick='clickColor("#FF5050",-50,144)'
				onmouseover='mouseOverColor("#FF5050")' alt='#FF5050' /><area style='cursor:pointer' shape='poly'
				coords='171,150,180,154,180,165,171,169,162,165,162,154' onclick='clickColor("#CC0066",-50,162)'
				onmouseover='mouseOverColor("#CC0066")' alt='#CC0066' /><area style='cursor:pointer' shape='poly'
				coords='189,150,198,154,198,165,189,169,180,165,180,154' onclick='clickColor("#660033",-50,180)'
				onmouseover='mouseOverColor("#660033")' alt='#660033' /><area style='cursor:pointer' shape='poly'
				coords='54,165,63,169,63,180,54,184,45,180,45,169' onclick='clickColor("#996633",-35,45)'
				onmouseover='mouseOverColor("#996633")' alt='#996633' /><area style='cursor:pointer' shape='poly'
				coords='72,165,81,169,81,180,72,184,63,180,63,169' onclick='clickColor("#CC9900",-35,63)'
				onmouseover='mouseOverColor("#CC9900")' alt='#CC9900' /><area style='cursor:pointer' shape='poly'
				coords='90,165,99,169,99,180,90,184,81,180,81,169' onclick='clickColor("#FF9900",-35,81)'
				onmouseover='mouseOverColor("#FF9900")' alt='#FF9900' /><area style='cursor:pointer' shape='poly'
				coords='108,165,117,169,117,180,108,184,99,180,99,169' onclick='clickColor("#CC6600",-35,99)'
				onmouseover='mouseOverColor("#CC6600")' alt='#CC6600' /><area style='cursor:pointer' shape='poly'
				coords='126,165,135,169,135,180,126,184,117,180,117,169' onclick='clickColor("#FF3300",-35,117)'
				onmouseover='mouseOverColor("#FF3300")' alt='#FF3300' /><area style='cursor:pointer' shape='poly'
				coords='144,165,153,169,153,180,144,184,135,180,135,169' onclick='clickColor("#FF0000",-35,135)'
				onmouseover='mouseOverColor("#FF0000")' alt='#FF0000' /><area style='cursor:pointer' shape='poly'
				coords='162,165,171,169,171,180,162,184,153,180,153,169' onclick='clickColor("#CC0000",-35,153)'
				onmouseover='mouseOverColor("#CC0000")' alt='#CC0000' /><area style='cursor:pointer' shape='poly'
				coords='180,165,189,169,189,180,180,184,171,180,171,169' onclick='clickColor("#990033",-35,171)'
				onmouseover='mouseOverColor("#990033")' alt='#990033' /><area style='cursor:pointer' shape='poly'
				coords='63,180,72,184,72,195,63,199,54,195,54,184' onclick='clickColor("#663300",-20,54)'
				onmouseover='mouseOverColor("#663300")' alt='#663300' /><area style='cursor:pointer' shape='poly'
				coords='81,180,90,184,90,195,81,199,72,195,72,184' onclick='clickColor("#996600",-20,72)'
				onmouseover='mouseOverColor("#996600")' alt='#996600' /><area style='cursor:pointer' shape='poly'
				coords='99,180,108,184,108,195,99,199,90,195,90,184' onclick='clickColor("#CC3300",-20,90)'
				onmouseover='mouseOverColor("#CC3300")' alt='#CC3300' /><area style='cursor:pointer' shape='poly'
				coords='117,180,126,184,126,195,117,199,108,195,108,184' onclick='clickColor("#993300",-20,108)'
				onmouseover='mouseOverColor("#993300")' alt='#993300' /><area style='cursor:pointer' shape='poly'
				coords='135,180,144,184,144,195,135,199,126,195,126,184' onclick='clickColor("#990000",-20,126)'
				onmouseover='mouseOverColor("#990000")' alt='#990000' /><area style='cursor:pointer' shape='poly'
				coords='153,180,162,184,162,195,153,199,144,195,144,184' onclick='clickColor("#800000",-20,144)'
				onmouseover='mouseOverColor("#800000")' alt='#800000' /><area style='cursor:pointer' shape='poly'
				coords='171,180,180,184,180,195,171,199,162,195,162,184' onclick='clickColor("#993333",-20,162)'
				onmouseover='mouseOverColor("#993333")' alt='#993333' /></map>
		
		<script>
			var thistop = "-35";
			var thisleft = "135";
		</script>

		<div id='selectedhexagon'
			style='visibility:hidden;position:relative;width:21px;height:21px;background-image:url("../copi2/w3/img_selectedcolor.gif")'>
		</div>
		<div id='divpreview'>&nbsp;</div>
		<h3>Or Enter a Color:</h3>
		<div id="entercolorDIV">
			<input type="text" id="entercolor" placeholder="Color value" onkeydown="submitOnEnter(event)"
				onfocus="clearWrongInput();" style="z-index:0;"><button class="btn btn-default" type="button"
				onclick="clickColor(0,-1,-1)" style="z-index:0;">OK</button>
		</div>
		<div id="wronginputDIV">Wrong Input</div>
		<br>
		<div id="html5DIV">
			<h3>Or Use HTML5:</h3>
			<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000"
				style="width:85%;">
		</div>
		<br>
		<br>
	</div>
	</div>

		`;
	return mCreateFrom(html);
}
function copi2_ganzerColorpicker() {
	let html = `
		<div style="margin:auto;width:236px;">
			<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' /><map
				id='colormap' name='colormap' onmouseout='mouseOutMap()'><area style='cursor:pointer' shape='poly'
					coords='63,0,72,4,72,15,63,19,54,15,54,4' onclick='clickColor("#003366",-200,54)'
					onmouseover='mouseOverColor("#003366")' alt='#003366' /><area style='cursor:pointer' shape='poly'
					coords='81,0,90,4,90,15,81,19,72,15,72,4' onclick='clickColor("#336699",-200,72)'
					onmouseover='mouseOverColor("#336699")' alt='#336699' /><area style='cursor:pointer' shape='poly'
					coords='99,0,108,4,108,15,99,19,90,15,90,4' onclick='clickColor("#3366CC",-200,90)'
					onmouseover='mouseOverColor("#3366CC")' alt='#3366CC' /><area style='cursor:pointer' shape='poly'
					coords='117,0,126,4,126,15,117,19,108,15,108,4' onclick='clickColor("#003399",-200,108)'
					onmouseover='mouseOverColor("#003399")' alt='#003399' /><area style='cursor:pointer' shape='poly'
					coords='135,0,144,4,144,15,135,19,126,15,126,4' onclick='clickColor("#000099",-200,126)'
					onmouseover='mouseOverColor("#000099")' alt='#000099' /><area style='cursor:pointer' shape='poly'
					coords='153,0,162,4,162,15,153,19,144,15,144,4' onclick='clickColor("#0000CC",-200,144)'
					onmouseover='mouseOverColor("#0000CC")' alt='#0000CC' /><area style='cursor:pointer' shape='poly'
					coords='171,0,180,4,180,15,171,19,162,15,162,4' onclick='clickColor("#000066",-200,162)'
					onmouseover='mouseOverColor("#000066")' alt='#000066' /><area style='cursor:pointer' shape='poly'
					coords='54,15,63,19,63,30,54,34,45,30,45,19' onclick='clickColor("#006666",-185,45)'
					onmouseover='mouseOverColor("#006666")' alt='#006666' /><area style='cursor:pointer' shape='poly'
					coords='72,15,81,19,81,30,72,34,63,30,63,19' onclick='clickColor("#006699",-185,63)'
					onmouseover='mouseOverColor("#006699")' alt='#006699' /><area style='cursor:pointer' shape='poly'
					coords='90,15,99,19,99,30,90,34,81,30,81,19' onclick='clickColor("#0099CC",-185,81)'
					onmouseover='mouseOverColor("#0099CC")' alt='#0099CC' /><area style='cursor:pointer' shape='poly'
					coords='108,15,117,19,117,30,108,34,99,30,99,19' onclick='clickColor("#0066CC",-185,99)'
					onmouseover='mouseOverColor("#0066CC")' alt='#0066CC' /><area style='cursor:pointer' shape='poly'
					coords='126,15,135,19,135,30,126,34,117,30,117,19' onclick='clickColor("#0033CC",-185,117)'
					onmouseover='mouseOverColor("#0033CC")' alt='#0033CC' /><area style='cursor:pointer' shape='poly'
					coords='144,15,153,19,153,30,144,34,135,30,135,19' onclick='clickColor("#0000FF",-185,135)'
					onmouseover='mouseOverColor("#0000FF")' alt='#0000FF' /><area style='cursor:pointer' shape='poly'
					coords='162,15,171,19,171,30,162,34,153,30,153,19' onclick='clickColor("#3333FF",-185,153)'
					onmouseover='mouseOverColor("#3333FF")' alt='#3333FF' /><area style='cursor:pointer' shape='poly'
					coords='180,15,189,19,189,30,180,34,171,30,171,19' onclick='clickColor("#333399",-185,171)'
					onmouseover='mouseOverColor("#333399")' alt='#333399' /><area style='cursor:pointer' shape='poly'
					coords='45,30,54,34,54,45,45,49,36,45,36,34' onclick='clickColor("#669999",-170,36)'
					onmouseover='mouseOverColor("#669999")' alt='#669999' /><area style='cursor:pointer' shape='poly'
					coords='63,30,72,34,72,45,63,49,54,45,54,34' onclick='clickColor("#009999",-170,54)'
					onmouseover='mouseOverColor("#009999")' alt='#009999' /><area style='cursor:pointer' shape='poly'
					coords='81,30,90,34,90,45,81,49,72,45,72,34' onclick='clickColor("#33CCCC",-170,72)'
					onmouseover='mouseOverColor("#33CCCC")' alt='#33CCCC' /><area style='cursor:pointer' shape='poly'
					coords='99,30,108,34,108,45,99,49,90,45,90,34' onclick='clickColor("#00CCFF",-170,90)'
					onmouseover='mouseOverColor("#00CCFF")' alt='#00CCFF' /><area style='cursor:pointer' shape='poly'
					coords='117,30,126,34,126,45,117,49,108,45,108,34' onclick='clickColor("#0099FF",-170,108)'
					onmouseover='mouseOverColor("#0099FF")' alt='#0099FF' /><area style='cursor:pointer' shape='poly'
					coords='135,30,144,34,144,45,135,49,126,45,126,34' onclick='clickColor("#0066FF",-170,126)'
					onmouseover='mouseOverColor("#0066FF")' alt='#0066FF' /><area style='cursor:pointer' shape='poly'
					coords='153,30,162,34,162,45,153,49,144,45,144,34' onclick='clickColor("#3366FF",-170,144)'
					onmouseover='mouseOverColor("#3366FF")' alt='#3366FF' /><area style='cursor:pointer' shape='poly'
					coords='171,30,180,34,180,45,171,49,162,45,162,34' onclick='clickColor("#3333CC",-170,162)'
					onmouseover='mouseOverColor("#3333CC")' alt='#3333CC' /><area style='cursor:pointer' shape='poly'
					coords='189,30,198,34,198,45,189,49,180,45,180,34' onclick='clickColor("#666699",-170,180)'
					onmouseover='mouseOverColor("#666699")' alt='#666699' /><area style='cursor:pointer' shape='poly'
					coords='36,45,45,49,45,60,36,64,27,60,27,49' onclick='clickColor("#339966",-155,27)'
					onmouseover='mouseOverColor("#339966")' alt='#339966' /><area style='cursor:pointer' shape='poly'
					coords='54,45,63,49,63,60,54,64,45,60,45,49' onclick='clickColor("#00CC99",-155,45)'
					onmouseover='mouseOverColor("#00CC99")' alt='#00CC99' /><area style='cursor:pointer' shape='poly'
					coords='72,45,81,49,81,60,72,64,63,60,63,49' onclick='clickColor("#00FFCC",-155,63)'
					onmouseover='mouseOverColor("#00FFCC")' alt='#00FFCC' /><area style='cursor:pointer' shape='poly'
					coords='90,45,99,49,99,60,90,64,81,60,81,49' onclick='clickColor("#00FFFF",-155,81)'
					onmouseover='mouseOverColor("#00FFFF")' alt='#00FFFF' /><area style='cursor:pointer' shape='poly'
					coords='108,45,117,49,117,60,108,64,99,60,99,49' onclick='clickColor("#33CCFF",-155,99)'
					onmouseover='mouseOverColor("#33CCFF")' alt='#33CCFF' /><area style='cursor:pointer' shape='poly'
					coords='126,45,135,49,135,60,126,64,117,60,117,49' onclick='clickColor("#3399FF",-155,117)'
					onmouseover='mouseOverColor("#3399FF")' alt='#3399FF' /><area style='cursor:pointer' shape='poly'
					coords='144,45,153,49,153,60,144,64,135,60,135,49' onclick='clickColor("#6699FF",-155,135)'
					onmouseover='mouseOverColor("#6699FF")' alt='#6699FF' /><area style='cursor:pointer' shape='poly'
					coords='162,45,171,49,171,60,162,64,153,60,153,49' onclick='clickColor("#6666FF",-155,153)'
					onmouseover='mouseOverColor("#6666FF")' alt='#6666FF' /><area style='cursor:pointer' shape='poly'
					coords='180,45,189,49,189,60,180,64,171,60,171,49' onclick='clickColor("#6600FF",-155,171)'
					onmouseover='mouseOverColor("#6600FF")' alt='#6600FF' /><area style='cursor:pointer' shape='poly'
					coords='198,45,207,49,207,60,198,64,189,60,189,49' onclick='clickColor("#6600CC",-155,189)'
					onmouseover='mouseOverColor("#6600CC")' alt='#6600CC' /><area style='cursor:pointer' shape='poly'
					coords='27,60,36,64,36,75,27,79,18,75,18,64' onclick='clickColor("#339933",-140,18)'
					onmouseover='mouseOverColor("#339933")' alt='#339933' /><area style='cursor:pointer' shape='poly'
					coords='45,60,54,64,54,75,45,79,36,75,36,64' onclick='clickColor("#00CC66",-140,36)'
					onmouseover='mouseOverColor("#00CC66")' alt='#00CC66' /><area style='cursor:pointer' shape='poly'
					coords='63,60,72,64,72,75,63,79,54,75,54,64' onclick='clickColor("#00FF99",-140,54)'
					onmouseover='mouseOverColor("#00FF99")' alt='#00FF99' /><area style='cursor:pointer' shape='poly'
					coords='81,60,90,64,90,75,81,79,72,75,72,64' onclick='clickColor("#66FFCC",-140,72)'
					onmouseover='mouseOverColor("#66FFCC")' alt='#66FFCC' /><area style='cursor:pointer' shape='poly'
					coords='99,60,108,64,108,75,99,79,90,75,90,64' onclick='clickColor("#66FFFF",-140,90)'
					onmouseover='mouseOverColor("#66FFFF")' alt='#66FFFF' /><area style='cursor:pointer' shape='poly'
					coords='117,60,126,64,126,75,117,79,108,75,108,64' onclick='clickColor("#66CCFF",-140,108)'
					onmouseover='mouseOverColor("#66CCFF")' alt='#66CCFF' /><area style='cursor:pointer' shape='poly'
					coords='135,60,144,64,144,75,135,79,126,75,126,64' onclick='clickColor("#99CCFF",-140,126)'
					onmouseover='mouseOverColor("#99CCFF")' alt='#99CCFF' /><area style='cursor:pointer' shape='poly'
					coords='153,60,162,64,162,75,153,79,144,75,144,64' onclick='clickColor("#9999FF",-140,144)'
					onmouseover='mouseOverColor("#9999FF")' alt='#9999FF' /><area style='cursor:pointer' shape='poly'
					coords='171,60,180,64,180,75,171,79,162,75,162,64' onclick='clickColor("#9966FF",-140,162)'
					onmouseover='mouseOverColor("#9966FF")' alt='#9966FF' /><area style='cursor:pointer' shape='poly'
					coords='189,60,198,64,198,75,189,79,180,75,180,64' onclick='clickColor("#9933FF",-140,180)'
					onmouseover='mouseOverColor("#9933FF")' alt='#9933FF' /><area style='cursor:pointer' shape='poly'
					coords='207,60,216,64,216,75,207,79,198,75,198,64' onclick='clickColor("#9900FF",-140,198)'
					onmouseover='mouseOverColor("#9900FF")' alt='#9900FF' /><area style='cursor:pointer' shape='poly'
					coords='18,75,27,79,27,90,18,94,9,90,9,79' onclick='clickColor("#006600",-125,9)'
					onmouseover='mouseOverColor("#006600")' alt='#006600' /><area style='cursor:pointer' shape='poly'
					coords='36,75,45,79,45,90,36,94,27,90,27,79' onclick='clickColor("#00CC00",-125,27)'
					onmouseover='mouseOverColor("#00CC00")' alt='#00CC00' /><area style='cursor:pointer' shape='poly'
					coords='54,75,63,79,63,90,54,94,45,90,45,79' onclick='clickColor("#00FF00",-125,45)'
					onmouseover='mouseOverColor("#00FF00")' alt='#00FF00' /><area style='cursor:pointer' shape='poly'
					coords='72,75,81,79,81,90,72,94,63,90,63,79' onclick='clickColor("#66FF99",-125,63)'
					onmouseover='mouseOverColor("#66FF99")' alt='#66FF99' /><area style='cursor:pointer' shape='poly'
					coords='90,75,99,79,99,90,90,94,81,90,81,79' onclick='clickColor("#99FFCC",-125,81)'
					onmouseover='mouseOverColor("#99FFCC")' alt='#99FFCC' /><area style='cursor:pointer' shape='poly'
					coords='108,75,117,79,117,90,108,94,99,90,99,79' onclick='clickColor("#CCFFFF",-125,99)'
					onmouseover='mouseOverColor("#CCFFFF")' alt='#CCFFFF' /><area style='cursor:pointer' shape='poly'
					coords='126,75,135,79,135,90,126,94,117,90,117,79' onclick='clickColor("#CCCCFF",-125,117)'
					onmouseover='mouseOverColor("#CCCCFF")' alt='#CCCCFF' /><area style='cursor:pointer' shape='poly'
					coords='144,75,153,79,153,90,144,94,135,90,135,79' onclick='clickColor("#CC99FF",-125,135)'
					onmouseover='mouseOverColor("#CC99FF")' alt='#CC99FF' /><area style='cursor:pointer' shape='poly'
					coords='162,75,171,79,171,90,162,94,153,90,153,79' onclick='clickColor("#CC66FF",-125,153)'
					onmouseover='mouseOverColor("#CC66FF")' alt='#CC66FF' /><area style='cursor:pointer' shape='poly'
					coords='180,75,189,79,189,90,180,94,171,90,171,79' onclick='clickColor("#CC33FF",-125,171)'
					onmouseover='mouseOverColor("#CC33FF")' alt='#CC33FF' /><area style='cursor:pointer' shape='poly'
					coords='198,75,207,79,207,90,198,94,189,90,189,79' onclick='clickColor("#CC00FF",-125,189)'
					onmouseover='mouseOverColor("#CC00FF")' alt='#CC00FF' /><area style='cursor:pointer' shape='poly'
					coords='216,75,225,79,225,90,216,94,207,90,207,79' onclick='clickColor("#9900CC",-125,207)'
					onmouseover='mouseOverColor("#9900CC")' alt='#9900CC' /><area style='cursor:pointer' shape='poly'
					coords='9,90,18,94,18,105,9,109,0,105,0,94' onclick='clickColor("#003300",-110,0)'
					onmouseover='mouseOverColor("#003300")' alt='#003300' /><area style='cursor:pointer' shape='poly'
					coords='27,90,36,94,36,105,27,109,18,105,18,94' onclick='clickColor("#009933",-110,18)'
					onmouseover='mouseOverColor("#009933")' alt='#009933' /><area style='cursor:pointer' shape='poly'
					coords='45,90,54,94,54,105,45,109,36,105,36,94' onclick='clickColor("#33CC33",-110,36)'
					onmouseover='mouseOverColor("#33CC33")' alt='#33CC33' /><area style='cursor:pointer' shape='poly'
					coords='63,90,72,94,72,105,63,109,54,105,54,94' onclick='clickColor("#66FF66",-110,54)'
					onmouseover='mouseOverColor("#66FF66")' alt='#66FF66' /><area style='cursor:pointer' shape='poly'
					coords='81,90,90,94,90,105,81,109,72,105,72,94' onclick='clickColor("#99FF99",-110,72)'
					onmouseover='mouseOverColor("#99FF99")' alt='#99FF99' /><area style='cursor:pointer' shape='poly'
					coords='99,90,108,94,108,105,99,109,90,105,90,94' onclick='clickColor("#CCFFCC",-110,90)'
					onmouseover='mouseOverColor("#CCFFCC")' alt='#CCFFCC' /><area style='cursor:pointer' shape='poly'
					coords='117,90,126,94,126,105,117,109,108,105,108,94' onclick='clickColor("#FFFFFF",-110,108)'
					onmouseover='mouseOverColor("#FFFFFF")' alt='#FFFFFF' /><area style='cursor:pointer' shape='poly'
					coords='135,90,144,94,144,105,135,109,126,105,126,94' onclick='clickColor("#FFCCFF",-110,126)'
					onmouseover='mouseOverColor("#FFCCFF")' alt='#FFCCFF' /><area style='cursor:pointer' shape='poly'
					coords='153,90,162,94,162,105,153,109,144,105,144,94' onclick='clickColor("#FF99FF",-110,144)'
					onmouseover='mouseOverColor("#FF99FF")' alt='#FF99FF' /><area style='cursor:pointer' shape='poly'
					coords='171,90,180,94,180,105,171,109,162,105,162,94' onclick='clickColor("#FF66FF",-110,162)'
					onmouseover='mouseOverColor("#FF66FF")' alt='#FF66FF' /><area style='cursor:pointer' shape='poly'
					coords='189,90,198,94,198,105,189,109,180,105,180,94' onclick='clickColor("#FF00FF",-110,180)'
					onmouseover='mouseOverColor("#FF00FF")' alt='#FF00FF' /><area style='cursor:pointer' shape='poly'
					coords='207,90,216,94,216,105,207,109,198,105,198,94' onclick='clickColor("#CC00CC",-110,198)'
					onmouseover='mouseOverColor("#CC00CC")' alt='#CC00CC' /><area style='cursor:pointer' shape='poly'
					coords='225,90,234,94,234,105,225,109,216,105,216,94' onclick='clickColor("#660066",-110,216)'
					onmouseover='mouseOverColor("#660066")' alt='#660066' /><area style='cursor:pointer' shape='poly'
					coords='18,105,27,109,27,120,18,124,9,120,9,109' onclick='clickColor("#336600",-95,9)'
					onmouseover='mouseOverColor("#336600")' alt='#336600' /><area style='cursor:pointer' shape='poly'
					coords='36,105,45,109,45,120,36,124,27,120,27,109' onclick='clickColor("#009900",-95,27)'
					onmouseover='mouseOverColor("#009900")' alt='#009900' /><area style='cursor:pointer' shape='poly'
					coords='54,105,63,109,63,120,54,124,45,120,45,109' onclick='clickColor("#66FF33",-95,45)'
					onmouseover='mouseOverColor("#66FF33")' alt='#66FF33' /><area style='cursor:pointer' shape='poly'
					coords='72,105,81,109,81,120,72,124,63,120,63,109' onclick='clickColor("#99FF66",-95,63)'
					onmouseover='mouseOverColor("#99FF66")' alt='#99FF66' /><area style='cursor:pointer' shape='poly'
					coords='90,105,99,109,99,120,90,124,81,120,81,109' onclick='clickColor("#CCFF99",-95,81)'
					onmouseover='mouseOverColor("#CCFF99")' alt='#CCFF99' /><area style='cursor:pointer' shape='poly'
					coords='108,105,117,109,117,120,108,124,99,120,99,109' onclick='clickColor("#FFFFCC",-95,99)'
					onmouseover='mouseOverColor("#FFFFCC")' alt='#FFFFCC' /><area style='cursor:pointer' shape='poly'
					coords='126,105,135,109,135,120,126,124,117,120,117,109' onclick='clickColor("#FFCCCC",-95,117)'
					onmouseover='mouseOverColor("#FFCCCC")' alt='#FFCCCC' /><area style='cursor:pointer' shape='poly'
					coords='144,105,153,109,153,120,144,124,135,120,135,109' onclick='clickColor("#FF99CC",-95,135)'
					onmouseover='mouseOverColor("#FF99CC")' alt='#FF99CC' /><area style='cursor:pointer' shape='poly'
					coords='162,105,171,109,171,120,162,124,153,120,153,109' onclick='clickColor("#FF66CC",-95,153)'
					onmouseover='mouseOverColor("#FF66CC")' alt='#FF66CC' /><area style='cursor:pointer' shape='poly'
					coords='180,105,189,109,189,120,180,124,171,120,171,109' onclick='clickColor("#FF33CC",-95,171)'
					onmouseover='mouseOverColor("#FF33CC")' alt='#FF33CC' /><area style='cursor:pointer' shape='poly'
					coords='198,105,207,109,207,120,198,124,189,120,189,109' onclick='clickColor("#CC0099",-95,189)'
					onmouseover='mouseOverColor("#CC0099")' alt='#CC0099' /><area style='cursor:pointer' shape='poly'
					coords='216,105,225,109,225,120,216,124,207,120,207,109' onclick='clickColor("#993399",-95,207)'
					onmouseover='mouseOverColor("#993399")' alt='#993399' /><area style='cursor:pointer' shape='poly'
					coords='27,120,36,124,36,135,27,139,18,135,18,124' onclick='clickColor("#333300",-80,18)'
					onmouseover='mouseOverColor("#333300")' alt='#333300' /><area style='cursor:pointer' shape='poly'
					coords='45,120,54,124,54,135,45,139,36,135,36,124' onclick='clickColor("#669900",-80,36)'
					onmouseover='mouseOverColor("#669900")' alt='#669900' /><area style='cursor:pointer' shape='poly'
					coords='63,120,72,124,72,135,63,139,54,135,54,124' onclick='clickColor("#99FF33",-80,54)'
					onmouseover='mouseOverColor("#99FF33")' alt='#99FF33' /><area style='cursor:pointer' shape='poly'
					coords='81,120,90,124,90,135,81,139,72,135,72,124' onclick='clickColor("#CCFF66",-80,72)'
					onmouseover='mouseOverColor("#CCFF66")' alt='#CCFF66' /><area style='cursor:pointer' shape='poly'
					coords='99,120,108,124,108,135,99,139,90,135,90,124' onclick='clickColor("#FFFF99",-80,90)'
					onmouseover='mouseOverColor("#FFFF99")' alt='#FFFF99' /><area style='cursor:pointer' shape='poly'
					coords='117,120,126,124,126,135,117,139,108,135,108,124' onclick='clickColor("#FFCC99",-80,108)'
					onmouseover='mouseOverColor("#FFCC99")' alt='#FFCC99' /><area style='cursor:pointer' shape='poly'
					coords='135,120,144,124,144,135,135,139,126,135,126,124' onclick='clickColor("#FF9999",-80,126)'
					onmouseover='mouseOverColor("#FF9999")' alt='#FF9999' /><area style='cursor:pointer' shape='poly'
					coords='153,120,162,124,162,135,153,139,144,135,144,124' onclick='clickColor("#FF6699",-80,144)'
					onmouseover='mouseOverColor("#FF6699")' alt='#FF6699' /><area style='cursor:pointer' shape='poly'
					coords='171,120,180,124,180,135,171,139,162,135,162,124' onclick='clickColor("#FF3399",-80,162)'
					onmouseover='mouseOverColor("#FF3399")' alt='#FF3399' /><area style='cursor:pointer' shape='poly'
					coords='189,120,198,124,198,135,189,139,180,135,180,124' onclick='clickColor("#CC3399",-80,180)'
					onmouseover='mouseOverColor("#CC3399")' alt='#CC3399' /><area style='cursor:pointer' shape='poly'
					coords='207,120,216,124,216,135,207,139,198,135,198,124' onclick='clickColor("#990099",-80,198)'
					onmouseover='mouseOverColor("#990099")' alt='#990099' /><area style='cursor:pointer' shape='poly'
					coords='36,135,45,139,45,150,36,154,27,150,27,139' onclick='clickColor("#666633",-65,27)'
					onmouseover='mouseOverColor("#666633")' alt='#666633' /><area style='cursor:pointer' shape='poly'
					coords='54,135,63,139,63,150,54,154,45,150,45,139' onclick='clickColor("#99CC00",-65,45)'
					onmouseover='mouseOverColor("#99CC00")' alt='#99CC00' /><area style='cursor:pointer' shape='poly'
					coords='72,135,81,139,81,150,72,154,63,150,63,139' onclick='clickColor("#CCFF33",-65,63)'
					onmouseover='mouseOverColor("#CCFF33")' alt='#CCFF33' /><area style='cursor:pointer' shape='poly'
					coords='90,135,99,139,99,150,90,154,81,150,81,139' onclick='clickColor("#FFFF66",-65,81)'
					onmouseover='mouseOverColor("#FFFF66")' alt='#FFFF66' /><area style='cursor:pointer' shape='poly'
					coords='108,135,117,139,117,150,108,154,99,150,99,139' onclick='clickColor("#FFCC66",-65,99)'
					onmouseover='mouseOverColor("#FFCC66")' alt='#FFCC66' /><area style='cursor:pointer' shape='poly'
					coords='126,135,135,139,135,150,126,154,117,150,117,139' onclick='clickColor("#FF9966",-65,117)'
					onmouseover='mouseOverColor("#FF9966")' alt='#FF9966' /><area style='cursor:pointer' shape='poly'
					coords='144,135,153,139,153,150,144,154,135,150,135,139' onclick='clickColor("#FF6666",-65,135)'
					onmouseover='mouseOverColor("#FF6666")' alt='#FF6666' /><area style='cursor:pointer' shape='poly'
					coords='162,135,171,139,171,150,162,154,153,150,153,139' onclick='clickColor("#FF0066",-65,153)'
					onmouseover='mouseOverColor("#FF0066")' alt='#FF0066' /><area style='cursor:pointer' shape='poly'
					coords='180,135,189,139,189,150,180,154,171,150,171,139' onclick='clickColor("#CC6699",-65,171)'
					onmouseover='mouseOverColor("#CC6699")' alt='#CC6699' /><area style='cursor:pointer' shape='poly'
					coords='198,135,207,139,207,150,198,154,189,150,189,139' onclick='clickColor("#993366",-65,189)'
					onmouseover='mouseOverColor("#993366")' alt='#993366' /><area style='cursor:pointer' shape='poly'
					coords='45,150,54,154,54,165,45,169,36,165,36,154' onclick='clickColor("#999966",-50,36)'
					onmouseover='mouseOverColor("#999966")' alt='#999966' /><area style='cursor:pointer' shape='poly'
					coords='63,150,72,154,72,165,63,169,54,165,54,154' onclick='clickColor("#CCCC00",-50,54)'
					onmouseover='mouseOverColor("#CCCC00")' alt='#CCCC00' /><area style='cursor:pointer' shape='poly'
					coords='81,150,90,154,90,165,81,169,72,165,72,154' onclick='clickColor("#FFFF00",-50,72)'
					onmouseover='mouseOverColor("#FFFF00")' alt='#FFFF00' /><area style='cursor:pointer' shape='poly'
					coords='99,150,108,154,108,165,99,169,90,165,90,154' onclick='clickColor("#FFCC00",-50,90)'
					onmouseover='mouseOverColor("#FFCC00")' alt='#FFCC00' /><area style='cursor:pointer' shape='poly'
					coords='117,150,126,154,126,165,117,169,108,165,108,154' onclick='clickColor("#FF9933",-50,108)'
					onmouseover='mouseOverColor("#FF9933")' alt='#FF9933' /><area style='cursor:pointer' shape='poly'
					coords='135,150,144,154,144,165,135,169,126,165,126,154' onclick='clickColor("#FF6600",-50,126)'
					onmouseover='mouseOverColor("#FF6600")' alt='#FF6600' /><area style='cursor:pointer' shape='poly'
					coords='153,150,162,154,162,165,153,169,144,165,144,154' onclick='clickColor("#FF5050",-50,144)'
					onmouseover='mouseOverColor("#FF5050")' alt='#FF5050' /><area style='cursor:pointer' shape='poly'
					coords='171,150,180,154,180,165,171,169,162,165,162,154' onclick='clickColor("#CC0066",-50,162)'
					onmouseover='mouseOverColor("#CC0066")' alt='#CC0066' /><area style='cursor:pointer' shape='poly'
					coords='189,150,198,154,198,165,189,169,180,165,180,154' onclick='clickColor("#660033",-50,180)'
					onmouseover='mouseOverColor("#660033")' alt='#660033' /><area style='cursor:pointer' shape='poly'
					coords='54,165,63,169,63,180,54,184,45,180,45,169' onclick='clickColor("#996633",-35,45)'
					onmouseover='mouseOverColor("#996633")' alt='#996633' /><area style='cursor:pointer' shape='poly'
					coords='72,165,81,169,81,180,72,184,63,180,63,169' onclick='clickColor("#CC9900",-35,63)'
					onmouseover='mouseOverColor("#CC9900")' alt='#CC9900' /><area style='cursor:pointer' shape='poly'
					coords='90,165,99,169,99,180,90,184,81,180,81,169' onclick='clickColor("#FF9900",-35,81)'
					onmouseover='mouseOverColor("#FF9900")' alt='#FF9900' /><area style='cursor:pointer' shape='poly'
					coords='108,165,117,169,117,180,108,184,99,180,99,169' onclick='clickColor("#CC6600",-35,99)'
					onmouseover='mouseOverColor("#CC6600")' alt='#CC6600' /><area style='cursor:pointer' shape='poly'
					coords='126,165,135,169,135,180,126,184,117,180,117,169' onclick='clickColor("#FF3300",-35,117)'
					onmouseover='mouseOverColor("#FF3300")' alt='#FF3300' /><area style='cursor:pointer' shape='poly'
					coords='144,165,153,169,153,180,144,184,135,180,135,169' onclick='clickColor("#FF0000",-35,135)'
					onmouseover='mouseOverColor("#FF0000")' alt='#FF0000' /><area style='cursor:pointer' shape='poly'
					coords='162,165,171,169,171,180,162,184,153,180,153,169' onclick='clickColor("#CC0000",-35,153)'
					onmouseover='mouseOverColor("#CC0000")' alt='#CC0000' /><area style='cursor:pointer' shape='poly'
					coords='180,165,189,169,189,180,180,184,171,180,171,169' onclick='clickColor("#990033",-35,171)'
					onmouseover='mouseOverColor("#990033")' alt='#990033' /><area style='cursor:pointer' shape='poly'
					coords='63,180,72,184,72,195,63,199,54,195,54,184' onclick='clickColor("#663300",-20,54)'
					onmouseover='mouseOverColor("#663300")' alt='#663300' /><area style='cursor:pointer' shape='poly'
					coords='81,180,90,184,90,195,81,199,72,195,72,184' onclick='clickColor("#996600",-20,72)'
					onmouseover='mouseOverColor("#996600")' alt='#996600' /><area style='cursor:pointer' shape='poly'
					coords='99,180,108,184,108,195,99,199,90,195,90,184' onclick='clickColor("#CC3300",-20,90)'
					onmouseover='mouseOverColor("#CC3300")' alt='#CC3300' /><area style='cursor:pointer' shape='poly'
					coords='117,180,126,184,126,195,117,199,108,195,108,184' onclick='clickColor("#993300",-20,108)'
					onmouseover='mouseOverColor("#993300")' alt='#993300' /><area style='cursor:pointer' shape='poly'
					coords='135,180,144,184,144,195,135,199,126,195,126,184' onclick='clickColor("#990000",-20,126)'
					onmouseover='mouseOverColor("#990000")' alt='#990000' /><area style='cursor:pointer' shape='poly'
					coords='153,180,162,184,162,195,153,199,144,195,144,184' onclick='clickColor("#800000",-20,144)'
					onmouseover='mouseOverColor("#800000")' alt='#800000' /><area style='cursor:pointer' shape='poly'
					coords='171,180,180,184,180,195,171,199,162,195,162,184' onclick='clickColor("#993333",-20,162)'
					onmouseover='mouseOverColor("#993333")' alt='#993333' /></map>
			
			<script>
				var thistop = "-35";
				var thisleft = "135";
			</script>

			<div id='selectedhexagon'
				style='visibility:hidden;position:relative;width:21px;height:21px;background-image:url("../copi2/w3/img_selectedcolor.gif")'>
			</div>
			<div id='divpreview'>&nbsp;</div>
			<h3>Or Enter a Color:</h3>
			<div id="entercolorDIV">
				<input type="text" id="entercolor" placeholder="Color value" onkeydown="submitOnEnter(event)"
					onfocus="clearWrongInput();" style="z-index:0;"><button class="btn btn-default" type="button"
					onclick="clickColor(0,-1,-1)" style="z-index:0;">OK</button>
			</div>
			<div id="wronginputDIV">Wrong Input</div>
			<br>
			<div id="html5DIV">
				<h3>Or Use HTML5:</h3>
				<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000"
					style="width:85%;">
			</div>
			<br>
			<br>
		</div>

		`;
	return mCreateFrom(html);
}

function copi2_part() {
	let html = `

		`;
	return mCreateFrom(html);
}
function part111(){
	let html = `
	<div class="w3-row">
		<div class="w3-col colorthird1" style="text-align:center;">
			<h3>Pick a Color:</h3>
			<div style="margin:auto;width:236px;">
				<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				<script>
					var thistop = "-35";
					var thisleft = "135";
				</script>

				<div id='selectedhexagon'
					style='visibility:hidden;position:relative;width:21px;height:21px;background-image:url("../copi2/w3/img_selectedcolor.gif")'>
				</div>
				<div id='divpreview'>&nbsp;</div>
				<h3>Or Enter a Color:</h3>
				<div id="entercolorDIV">
					<input type="text" id="entercolor" placeholder="Color value" onkeydown="submitOnEnter(event)"
						onfocus="clearWrongInput();" style="z-index:0;"><button class="btn btn-default" type="button"
						onclick="clickColor(0,-1,-1)" style="z-index:0;">OK</button>
				</div>
				<div id="wronginputDIV">Wrong Input</div>
				<br>
				${html5Div_111()}
				<br>
				<br>
			</div>
		</div>

		<div class="w3-col colorthird2" style="text-align:center;">
			<h3>Selected Color:</h3>
			<div id="selectedcolor" class="w3-large">
				<br><br>
				<span class="w3-text-black">Black Text</span><br><br>
				<span class="w3-text-black" style="text-shadow:1px 1px 0 #444">Shadow</span><br><br>
				<span class="w3-text-white">White Text</span><br><br>
				<span class="w3-text-white" style="text-shadow:1px 1px 0 #444">Shadow</span>
			</div>
			<div id="colornamDIV" class="w3-margin-top"></div>
			<div><b><span id="colorhexDIV"></span></b></div>
			<div id="colorrgbDIV"></div>
			<div id="colorhslDIV"></div>
		</div>

		<div class="w3-col colorthird3">
			<div id="lumtopcontainer"></div>
		</div>
	</div>

	`;

	return mCreateFrom(html);

}
//#endregion

//#region 


//#endregion



