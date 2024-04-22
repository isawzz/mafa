function setgame() {
	function setup(table) {
		let fen = {};
		fen.players = {};
		for (const name in table.players) {
			let pl = fen.players[name] = table.players[name];
			pl.color = getUserColor(name)
			pl.score = 0;
		}
		fen.deck = setCreateDeck();
		fen.cards = deckDeal(fen.deck, table.options.numCards);
		fen.plorder = jsCopy(table.playerNames);
		fen.turn = jsCopy(table.playerNames); // alle zugleich dran
		delete table.players;
		return fen;
	}
	async function activate(table) { await setActivate(); } //console.log('activate for',getUname());}
	function checkGameover(table) {
		return table.playerNames.some(x => x.score == table.options.winning_score);
	}
	async function present(table) { await setPresent(table); }
	async function hybridMove(table) { await setHybridMove(table); } //console.log('activate for',getUname());}
	async function botMove(table) { await setBotMove(table); } //console.log('activate for',getUname());}
	async function stepComplete(table, o) { }// await setStepComplete(table, o); }
	return { setup, activate, checkGameover, present, hybridMove, botMove, stepComplete };
}
async function setActivate() {
	try {
		T.sets = setFindAllSets(T.items);
		[T.bNoSet, T.bHint] = setShowButtons();
		setActivateCards();
		let use_level = getGameOption('use_level'); //console.log('use_level',use_level)
		if (use_level == 'no') { setHintHide(); return; }
		let level = getPlayerProp('level');
		T.numHints = level <= 4 ? 2 : 1;
		if (level == 1) { await mSleep(2000); await T.bHint.click(); if (isEmpty(T.sets)) return; await mSleep(3000); await T.bHint.click(); }
		else if (level == 2) { await mSleep(3000); await T.bHint.click(); if (isEmpty(T.sets)) return; await mSleep(10000); await T.bHint.click(); }
		else if (level == 3) { await mSleep(7000); await T.bHint.click(); }
		else if (level == 4) { await mSleep(10000); await T.bHint.click(); }
		else if (level == 5) {  }
		//else if (level == 6) { }
		else { setHintHide(); }
	} catch { console.log('human: please reload!') }
}
function setActivateCards() {
	for (const item of T.items) {
		let d = iDiv(item);
		d.onclick = () => setOnclickCard(item, T.items, true);
		mStyle(d, { cursor: 'pointer' })

	}
}
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
	//card eg purple_squiggle_2_open	
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
	return result;
}
function setGameover(table) {
	table.status = 'over';
	table.winners = getPlayersWithMaxScore(table.fen);
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
function scaleAnimation(element) {
	let ani = element.animate([
		{ transform: 'scale(1)' },
		{ transform: 'scale(1.3)' },
	], {
		duration: 1000,
		easing: 'ease-in-out',
		iterations: 2,
		direction: 'alternate'

	});
	return ani;
}
async function setPresent(table) {
	T = {};
	const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' }; //'#4b0082' //'#8e44ed' }; //'blueviolet' }; //'#8e44ad' };
	setLoadPatterns('dPage', colors);
	mClear('dMain');
	let d = mDom('dMain', { margin: 10 }); //, bg: '#00000080' }); mCenterFlex(d)
	[dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(d);
	// mCenterCenterFlex(dOben);
	//mDom(d, { fz: 100, fg: 'white' }, { html: `we are playing ${getGameFriendly(table.game)}!!!!` })

	let [fen, playerNames, players, turn] = [table.fen, table.playerNames, table.fen.players, table.fen.turn];
	let cards = fen.cards;
	let dp = mDom(dOpenTable, { w100: true }); mCenterFlex(dp);
	let dBoard = T.dBoard = mGrid(cards.length / 3, 3, dp, { gap: 14 });
	let items = T.items = [];
	for (const c of cards) {
		//mDom(dBoard,{},{html:c})
		let d = setDrawCard(c, dBoard, colors, TESTING ? 80 : 100);
		let item = mItem({ div: d }, { key: c });
		items.push(item);
	}

	//setStats(table.fen, dRechts,'col');
	setStats(table.fen, dOben, 'rowflex', false)

}
function setShowButtons() {
	let buttons = mDom(dOpenTable, { w100: true, gap: 10, matop: 20 }); mCenterCenterFlex(buttons);
	let bno = mButton('NO Set', setOnclickNoSet, buttons, { w: 80 }, 'input');
	let bhint = mButton('Hint', setOnclickHint, buttons, { w: 80 }, 'input');
	return [bno, bhint]

}
function setStats(fen, dParent, layout, showTurn = true) {
	let me = getUname();
	let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
	let player_stat_items = uiTypePlayerStats(fen, me, dParent, layout, style)
	//console.log(Clientdata.table)
	let uselevel = getGameOption('use_level');
	for (const plname in fen.players) {
		let pl = fen.players[plname]; //console.log('player',pl1)
		let item = player_stat_items[plname];
		let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
		playerStatCount('star', pl.score, d);
		// playerStatCount('stairs', pl1.level, d);
		// mDom(d, { h: 6, w: '100%' });
		// if (showTurn && fen.turn.includes(plname)) { show_hourglass(plname, d, 30, { left: -3, top: 0 }); }
		// show_hourglass(plname, d, 30, { left: -3, top: 0 });
		//console.log('setStats',Clientdata.table)
		if (uselevel != 'yes') continue;

		mDom(d, { fz: 11, round: true, hpadding: 3, fg: 'contrast', bg: getLevelColor(pl.level), position: 'absolute', top: 1, right: 2 }, { html: pl.level })
	}
}
function getLevelColor(n) {
	const levelColors = [LIGHTGREEN, LIGHTBLUE, YELLOW, 'orange', RED,
		GREEN, BLUE, PURPLE, YELLOW2, 'deepskyblue', 'deeppink', //** MAXLEVEL 10 */
		TEAL, ORANGE, 'seagreen', FIREBRICK, OLIVE, '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', 'gold', 'orangered', 'skyblue', 'pink', 'palegreen', '#e6194B'];

	return levelColors[n - 1]; //['skyblue','lime','gold','orange','red'][n-1];
}
