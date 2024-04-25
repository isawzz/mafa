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
	function checkGameover(table) { return table.playerNames.some(x => x.score == table.options.winning_score); }

	async function activate(vid) { await setActivate(vid); } 
	async function botMove(vid) { await setBotMove(vid); } 
	async function presentTable(dParent, table, name, sz) { return await setPresentTable(dParent, table, name, sz); }
	async function presentPlayer(vid) { return await setPresentPlayer(vid); }
	async function presentStats(dParent,vid) { return await setPresentStats(dParent,vid); }
	return { setup, checkGameover, activate, botMove, presentTable, presentPlayer, presentStats };
}
async function setActivate(vid) {
	let view = V[vid]; //console.log('view',view)
	let items = view.items;
	//try {
		view.sets = setFindAllSets(items);
		[view.bNoSet, view.bHint] = setShowButtons(items);
		setActivateCards(items);
		let use_level = getGameOption('use_level'); if (use_level == 'no') { view.bHint.remove(); return; }

		let level = getPlayerProp('level',view.name);
		let noset = isEmpty(view.sets);
		view.numHints = level <= 3 ? noset ? 1 : 2 : level <= 5 ? 1 : 0;

		if (level > 5) { view.bHint.remove(); }
		else if (level == 1) { view.autoHints = noset ? 1 : 2; view.hintTimes = [noset ? 10000 : 2000, 5000]; }
		else if (level == 2) { view.autoHints = noset ? 1 : 2; view.hintTimes = [noset ? 10000 : 3000, 8000]; }
		else if (level == 3) { view.autoHints = 1; view.hintTimes = [noset ? 10000 : 4000]; }
		else if (level == 4) { view.autoHints = 1; view.hintTimes = [noset ? 10000 : 8000]; }

		let i = 0;
		while (i < view.autoHints) {
			await mSleep(view.hintTimes[i]);
			//if (checkInterrupt(vid)) { console.log(`autoHint ${i}`); return; }
			if (DA.stopAutobot == true) { console.log(`autoHint ${i}`); return; }
			await setOnclickHint(items);
			i++;
		}
	//} catch { console.log('human: please reload!') }
}
function setActivateCards(items) {
	for (const item of items) {
		let d = iDiv(item);
		d.onclick = () => setOnclickCard(item, items, true);
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
	if (isEmpty(result)) console.log('no set!')
	return result;
}
function setGameover(table) {
	table.status = 'over';
	table.winners = getPlayersWithMaxScore(table.fen);
}
function setHintHide(vid) { let view = V[vid]; mClass(view.bHint, 'disabled'); } //mStyle(view.bHint,{display:'hidden'}); } //view.bHint.remove();}
function setLoadPatterns(dParent, colors) {
	dParent = toElem(dParent);
	let id = "setpatterns";
	if (isdef(mBy(id))) { return; } //prevent multiple loading!
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
async function setPresentPlayer(vid){
	let view = V[vid];
	let [table, name, dOben]=[view.table,view.name,view.dOben];
	mDom(dOben,{},{html:name});
}
async function setPresentStats(dParent,vid){
	let view = V[vid];
	view.dStats=dParent;
	setStats(view.table, view.name, dParent, 'rowflex', false);
	//setStats(table.fen, dRechts,'col');
}
function setShowButtons(items) {
	let buttons = mDom(dOpenTable, { w100: true, gap: 10, matop: 20 }); mCenterCenterFlex(buttons);
	let bno = mButton('NO Set', () => setOnclickNoSet(items, true), buttons, { w: 80 }, 'input');
	let bhint = mButton('Hint', () => setOnclickHint(items, true), buttons, { w: 80 }, 'input');
	return [bno, bhint];
}
function setStats(table, name, dParent, layout, showTurn = true) {
	let [fen, me] = [table.fen, name];
	let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
	let player_stat_items = uiTypePlayerStats(fen, me, dParent, layout, style)
	//console.log(Clientdata.table)
	let uselevel = getGameOption('use_level');
	let botLevel = Math.floor(calcBotLevel(table)); //console.log('botLevel',botLevel);
	for (const plname in fen.players) {
		let pl = fen.players[plname]; //console.log('player',pl1)
		let item = player_stat_items[plname];

		//console.log('item',item)
		if (pl.playmode == 'bot') {
			let c = getLevelColor(botLevel);
			mStyle(item.img, { rounding: 0, border: `${c} ${botLevel}px solid` });
			//mStyle(iDiv(item),{bg:getLevelColor(botLevel)}); 
		}

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
	const levelColors = [LIGHTBLUE, BLUE, GREEN, YELLOW, 'orange', RED, '#222',
		GREEN, BLUE, PURPLE, YELLOW2, 'deepskyblue', 'deeppink', //** MAXLEVEL 10 */
		TEAL, ORANGE, 'seagreen', FIREBRICK, OLIVE, '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', 'gold', 'orangered', 'skyblue', 'pink', 'palegreen', '#e6194B'];

	return levelColors[n - 1]; //['skyblue','lime','gold','orange','red'][n-1];
}
