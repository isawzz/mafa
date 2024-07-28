function button96() {
	function setup(table) {
		let fen = {};
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
		}
		fen.cards = [1, 2, 3];
		fen.deck = range(4, table.options.numCards);
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
		mStyle('dTable', { padding: 25, w: 400, h: 400 });
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
		await instructionStandard(table, 'must click a card'); //browser tab and instruction if any
		if (!isMyTurn(table)) { return; }
		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item, items);
		}
		if (isEmpty(table.fen.cards)) return gameoverScore(table);
		if (amIHuman(table) && table.options.gamemode == 'multi') return;
		let name = amIHuman(table) && table.options.gamemode == 'solo' ? someOtherPlayerName(table) : getUname();
		if (nundef(name)) return;
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
function fishgame() {
	function setup(table) { wsSetup(table); }
	function stats(table) { wsStats(table); }
	function present(table) { wsPresent(table); }
	async function activate(table, items) {
		await instructionStandard(table, 'may pick your initial cards'); //browser tab and instruction if any
		for (const item of items) {
			let d = iDiv(item);
			d.onclick = wsOnclickCard;
		}
		return;
		if (!isMyTurn(table)) { return; }
		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item, items);
		}
		if (isEmpty(table.fen.cards)) return gameoverScore(table);
		if (amIHuman(table) && table.options.gamemode == 'multi') return;
		let name = amIHuman(table) && table.options.gamemode == 'solo' ? someOtherPlayerName(table) : getUname();
		if (nundef(name)) return;
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
function generatePizzaSvg(sz) {
	let colors = Array.from(arguments).slice(1);
	let numSlices = colors.length;
	const radius = sz / 2;
	const centerX = radius;
	const centerY = radius;
	const angleStep = (2 * Math.PI) / numSlices;
	const svgParts = [];
	svgParts.push(`<svg width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}" xmlns="http://www.w3.org/2000/svg">`);
	for (let i = 0; i < numSlices; i++) {
		const startAngle = i * angleStep;
		const endAngle = (i + 1) * angleStep;
		const x1 = centerX + radius * Math.cos(startAngle);
		const y1 = centerY + radius * Math.sin(startAngle);
		const x2 = centerX + radius * Math.cos(endAngle);
		const y2 = centerY + radius * Math.sin(endAngle);
		const largeArcFlag = angleStep > Math.PI ? 1 : 0;
		const pathData = [
			`M ${centerX},${centerY}`, // Move to the center
			`L ${x1},${y1}`,           // Line to the start of the arc
			`A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`, // Arc to the end of the slice
			`Z`                        // Close the path
		].join(' ');
		svgParts.push(`<path d="${pathData}" fill="${colors[i]}" />`);
	}
	svgParts.push('</svg>');
	return svgParts.join('\n');
}
function getAbstractSymbol(n) {
	if (nundef(n)) n = rChoose(range(1, 100));
	else if (isList(n)) n = rChoose(n);
	return `abstract_${String(n).padStart(3, '0')}`;
}
function getDetailedSuperdi(key) {
	let o = M.superdi[key];
	let details = valf(M.details[key], M.details[o.friendly]);
	if (nundef(details)) return null;
	addKeys(details, o);
	o.key = key;
	o.class = o.class.toLowerCase();
	if (isdef(o.lifespan)) o.olifespan = calcLifespan(o.lifespan);
	if (isdef(o.food)) {
		[o.foodlist, o.foodtype] = extractFoodAndType(o.food);
		let foodTokens = [];
		if (['berries', 'fruit'].some(x => o.foodlist.includes(x))) foodTokens.push('cherries');
		if (['fish', 'shrimp', 'squid'].some(x => o.foodlist.includes(x))) foodTokens.push('fish');
		if (['wheat', 'grain', 'crops'].some(x => o.foodlist.includes(x))) foodTokens.push('grain');
		if (o.foodtype.startsWith('insect')) foodTokens.push('worm');
		else if (o.foodtype.startsWith('carni')) foodTokens.push('mouse');
		else if (o.foodtype.startsWith('omni')) foodTokens.push('omni');
		else if (o.foodtype.startsWith('herbi')) foodTokens.push('seedling');
		o.foodTokens = arrTake(foodTokens, 3);
	}
	if (isdef(o.offsprings)) o.ooffsprings = calcOffsprings(o.offsprings);
	if (isdef(o.weight)) { o.oweight = calcWeight(o.weight); o.nweight = o.oweight.avg; }
	if (isdef(o.size)) { o.osize = calcSize(o.size); o.nsize = o.osize.avg; }
	if (isdef(o.species)) {
		let x = o.species; o.longSpecies = x; o.species = extractSpecies(x);
	}
	if (isdef(o.habitat)) {
		let text = o.habitat;
		let hlist = o.hablist = extractHabitat(text, ['coastal']);
		let habTokens = [];
		if (['wetland'].some(x => hlist.includes(x))) { habTokens.push('wetland'); } //colors.push('lightblue'); imgs.push('../assets/games/wingspan/wetland.png'); }
		if (['dwellings', 'grassland', 'desert'].some(x => hlist.includes(x))) { habTokens.push('grassland'); } //{ colors.push('goldenrod'); imgs.push('../assets/games/wingspan/grassland2.png'); }
		if (['forest', 'mountain', 'ice'].some(x => hlist.includes(x))) { habTokens.push('forest'); } //{ colors.push('emerald'); imgs.push('../assets/games/wingspan/forest1.png'); }
		o.habTokens = habTokens;
	}
	let colors = ['turquoise', 'bluegreen', 'teal', 'brown', 'gray', 'green', 'violet', 'blue', 'black', 'yellow', 'white', 'lavender', 'orange', 'buff', 'red', 'pink', 'golden', 'cream', 'grey', 'sunny', 'beige'];
	if (isdef(o.color)) o.colors = extractColors(o.color, colors);
	o = sortDictionary(o);
	return o;
}
async function homeOnclickDeleteBlog() {
	let ta = mByTag('textarea');
	if (nundef(ta)) return;
	let val = ta.value;
	let me = getUname();
	if (isEmptyOrWhiteSpace(val)) return;
	U.blog = [];
	await postUserChange();
}
async function homeOnclickEditBlog() {
	let ta = mByTag('textarea');
	if (nundef(ta)) return;
	ta.value = U.blog.map(x => x.text).join('\n');
}
async function homeOnclickSaveBlog() {
	let ta = mByTag('textarea');
	if (nundef(ta)) return;
	let val = ta.value;
	let me = getUname();
	if (isEmptyOrWhiteSpace(val)) return;
	lookupAddToList(U, ['blog'], { text: val, ts: getNow() });
	await postUserChange();
}
function homeSidebar(wmin = 150) {
	mStyle('dLeft', { wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, matop: 20, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
	let gap = 5;
	let stylesTitles = { matop: 10, bg: '#ffffff80', fg: 'black' };
	let cmds = {};
	cmds.homeNew = mCommand(d, 'homeNew', 'New Entry'); mNewline(d, gap);
	UI.commands = cmds;
}
function isColor(s) { return isdef(M.colorByName[s]); }

function isFilename(s) { return s.includes('../'); }

function mByTag(tag) { return document.getElementsByTagName(tag)[0]; }

async function onclickHomeNew() {
	let d = mDom('dMain'); mCenterCenterFlex(d);
	let dt = mDom(d, { fg: getThemeFg(), box: true, w100: true, padding: 20 }, { html: `${me}'s blog` });
	mDom(dt, { w100: true, margin: 'auto' }, { tag: 'textarea', rows: 15 });
	let db = mDom(dt);
	mButton('Save', homeOnclickSaveBlog, db, {}, 'button');
}
function playerStatCount(key, n, dParent, styles = {}, opts = {}) {
	let sz = valf(styles.sz, 16);
	addKeys({ display: 'flex', margin: 4, dir: 'column', hmax: 2 * sz, 'align-content': 'center', fz: sz, align: 'center' }, styles);
	let d = mDiv(dParent, styles);
	let o = M.superdi[key];
	if (typeof key == 'function') key(d, { h: sz, hline: sz, w: '100%', fg: 'grey' });
	else if (isFilename(key)) showim2(key, d, { h: sz, hline: sz, w: '100%', fg: 'grey' }, opts);
	else if (isdef(o)) showim2(key, d, { h: sz, hline: sz, w: '100%', fg: 'grey' }, opts);
	else mText(key, d, { h: sz, fz: sz, w: '100%' });
	d.innerHTML += `<span ${isdef(opts.id) ? `id='${opts.id}'` : ''} style="font-weight:bold;color:inherit">${n}</span>`;
	return d;
}
function pluralOf(s, n) {
	di = { food: '', child: 'ren' };
	return s + (n == 0 || n > 1 ? valf(di[s.toLowerCase()], 's') : '');
}
function presentStandardBGA() {
	let dTable = mDom('dMain');
	mClass('dPage', 'wood');
	let [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(dTable); mFlexWrap(dOpenTable)
	mDom(dRechts, {}, { id: 'dStats' });
}
function presentStandardRoundTable() {
	d = mDom('dMain'); mCenterFlex(d);
	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction
	mDom(d, {}, { id: 'dStats' }); mLinebreak(d);
	let minTableSize = 400;
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
}
function setgame() {
	function setup(table) {
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
		presentStandardRoundTable(table);
		const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' };
		setLoadPatterns('dPage', colors);
		let fen = table.fen;
		mStyle('dTable', { padding: 50, wmin: 500 });
		let d = mDom('dTable', { gap: 10, padding: 0 }); mCenterFlex(d);
		let rows = Math.ceil(fen.cards.length / 3);
		let gap = 10;
		let sz = rows <= 4 ? 80 : rows == 5 ? 70 : rows == 6 ? 68 : rows == 7 ? 65 : rows == 8 ? 62 : 60;
		let dBoard = T.dBoard = mGrid(rows, 3, d, { gap });
		let items = [];
		for (const c of fen.cards) {
			let dc = setDrawCard(c, dBoard, colors, sz);
			let item = mItem({ div: dc }, { key: c });
			items.push(item);
		}
		let oset = setFindOneSet(items); console.log('=>', oset ? oset.keys[0] : 'NO SET');
		return items;
	}
	async function activate(table, items) {
		instructionStandard(table);
		if (!isMyTurn(table)) { return; }
		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item, items);
		}
		let dParent = mBy('dTable').parentNode; mIfNotRelative(dParent);
		let bNoSet = mButton('No Set', () => onclickNoSet(getUname(), table, items), dParent, {}, 'button', 'bNoSet');
		mPos(bNoSet, window.innerWidth / 2 + 180, 110);
		if (amIHuman(table) && getGameOption('use_level') == 'yes' && getPlayerProp('level') <= 2) {
			let bHint = mButton('Hint', () => onclickHint(table, items), dParent, {}, 'button', 'bHint');
			mPos(bHint, window.innerWidth / 2 - 200 - 80, 110);
		}
		if (isEmpty(table.fen.cards)) return gameoverScore(table);
		if (amIHuman(table) && table.options.gamemode == 'multi') return;
		let name = amIHuman(table) && table.options.gamemode == 'solo' ? someOtherPlayerName(table) : getUname();
		if (nundef(name)) return;
		await botMove(name, table, items);
	}
	async function botMove(name, table, items) {
		let oset = setFindOneSet(items);
		let avg = calcBotLevel(table);
		let ms = avg ? 18000 - avg * 2000 : 1000;
		if (!oset) ms += 2000;
		TO.bot = setTimeout(async () => {
			if (!oset) await onclickNoSet(name, table, items);
			else {
				for (const item of oset.items) toggleItemSelection(item);
				TO.bot1 = setTimeout(async () => await evalMove(name, table, oset.keys), 1000);
			}
		}, rNumber(ms, ms + 2000));
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
					if (setCheckIfSet(keys)) return { items: list, keys };
				}
			}
		}
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
			await evalMove(getUname(), table, keys);
		}
	}
	async function onclickHint(table, items) {
		let oset = setFindOneSet(items);
		let bHint = mBy('bHint');
		disableButton('bHint');
		if (!oset) {
			ANIM.button = scaleAnimation('bNoSet');
		} else {
			let item = rChoose(oset.items);
			await onclickCard(table, item, items);
		}
	}
	async function onclickNoSet(name, table, items) {
		clearEvents();
		mShield('dTable', { bg: 'transparent' });
		let id = table.id;
		let step = table.step;
		let oset = setFindOneSet(items);
		if (!oset) {
			table.players[name].score += 1;
			let fen = table.fen;
			let newCards = deckDeal(fen.deck, 1);
			if (!isEmpty(newCards)) fen.cards.push(newCards[0]); else return await gameoverScore(table);
		} else {
			table.players[name].score -= 1;
		}
		lookupAddToList(table, ['moves'], { step, name, move: ['noSet'], change: oset ? '-1' : '+1', score: table.players[name].score });
		let o = { id, name, step, table };
		if (!oset) o.stepIfValid = step + 1;
		let res = await mPostRoute('table', o); //console.log(res);
	}
	async function evalMove(name, table, keys) {
		clearEvents();
		mShield('dTable', { bg: 'transparent' });
		let id = table.id;
		let step = table.step;
		let isSet = setCheckIfSet(keys);
		if (isSet) {
			table.players[name].score += 1;
			let fen = table.fen;
			let toomany = Math.max(0, fen.cards.length - table.options.numCards);
			let need = Math.max(0, 3 - toomany);
			let newCards = deckDeal(fen.deck, need);
			for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, keys[i], newCards[i]); else removeInPlace(fen.cards, keys[i]);
		} else {
			table.players[name].score -= 1;
		}
		lookupAddToList(table, ['moves'], { step, name, move: keys, change: isSet ? '+1' : '-1', score: table.players[name].score });
		let o = { id, name, step, table };
		if (isSet) o.stepIfValid = step + 1;
		let res = await mPostRoute('table', o); //console.log(res);
	}
	return { setup, present, stats, activate };
}
async function showDashboard() {
	let me = getUname();
	if (me == 'guest') { mDom('dMain', { align: 'center', className: 'section' }, { html: 'click username in upper right corner to log in' }); return; }
	homeSidebar(150);
	mAdjustPage(150);
	let div = mDom100('dMain');
	let d1 = mDom(div); mCenterFlex(d1)
	let dta = mDom(d1, { gap: 10, padding: 12 }, { className: 'section' });
	let dblog = mDom(d1, { w100: true, align: 'center' });
	let blog = U.blog;
	if (nundef(blog)) return;
	for (const bl of blog) {
		let dx = mDom(dblog, {}, { className: 'section', html: bl.text });
	}
}
function showGameover(table, dParent) {
  let winners = table.winners;
  let msg = winners.length > 1 ? `GAME OVER - The winners are ${winners.join(', ')}!!!` : `GAME OVER - The winner is ${winners[0]}!!!`;
  let d = showRibbon(dParent, msg);
  updateTestButtonsLogin(table.playerNames);
  mDom(d, { h: 12 }, { html: '<br>' })
  mButton('PLAY AGAIN', () => onclickStartTable(table.id), d, { className: 'button', fz: 24 });
}
function showGames(ms = 500) {
  let dParent = mBy('dGameList'); if (isdef(dParent)) { mClear(dParent); } else dParent = mDom('dMain', {}, { className: 'section', id: 'dGameList' });
  mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });
  let d = mDiv(dParent, { fg: 'white' }, 'game_menu'); mFlexWrap(d);
  let gamelist = 'accuse aristo bluff ferro nations spotit wise'; if (DA.TEST0) gamelist += ' a_game'; gamelist = toWords(gamelist);
  gamelist = ['setgame','crazu'] //, 'fishgame'];//, 'button96'];
  for (const gname of gamelist) {
    let g = getGameConfig(gname);
    let [sym, bg, color, id] = [M.superdi[g.logo], g.color, null, getUID()];
    let d1 = mDiv(d, { cursor: 'pointer', rounding: 10, margin: 10, padding: 0, patop: 10, w: 140, height: 100, bg: bg, position: 'relative' }, g.id);
    d1.setAttribute('gamename', gname);
    d1.onclick = onclickGameMenuItem;
    mCenterFlex(d1);
    let o = M.superdi[g.logo];
    let el = mDom(d1, { matop: 0, mabottom: 6, fz: 65, hline: 65, family: 'emoNoto', fg: 'white', display: 'inline-block' }, { html: o.text });
    mLinebreak(d1);
    mDiv(d1, { fz: 18, align: 'center' }, null, g.friendly);
  }
}
function showNavbar() {
	let nav = mMenu('dNav');
	let commands = {};
	commands.home = menuCommand(nav.l, 'nav', 'home', 'HOME', showDashboard, menuCloseHome);
	commands.settings = menuCommand(nav.l, 'nav', 'settings', null, settingsOpen, menuCloseSettings);
	commands.simple = menuCommand(nav.l, 'nav', 'simple', 'Collection', onclickSimple, menuCloseSimple);
	commands.play = menuCommand(nav.l, 'nav', 'play', 'Games', onclickPlay, menuCloseGames);
	commands.table = menuCommand(nav.l, 'nav', 'table', 'Table', onclickTableMenu, menuCloseTable);
	commands.plan = menuCommand(nav.l, 'nav', 'plan', 'Calendar', onclickPlan, menuCloseCalendar);
	nav.commands = commands;
	return nav;
}
async function showTable(id) {
	let me = getUname();
	let table = await mGetRoute('table', { id });  //console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
	let func = DA.funcs[table.game];
	T = table;
	clearMain();
	let d = mBy('dExtraLeft');
	d.innerHTML = `<h2>${getGameProp('friendly').toUpperCase()}: ${table.friendly} (${table.step})</h2>`; // title
	let items = func.present(table);
	func.stats(table);
	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }
	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);
	await updateTestButtonsPlayers(table);
	func.activate(table, items);
}
function showim1(imgKey, d, styles = {}, opts = {}) {
	let o = lookup(M.superdi, [imgKey]);
	let src;
	if (nundef(o) && imgKey.includes('.')) src = imgKey;
	else if (isdef(o) && isdef(opts.prefer)) src = valf(o[opts.prefer], o.img);
	else if (isdef(o)) src = valf(o.img, o.photo)
	if (nundef(src)) src = rChoose(M.allImages).path;
	let [w, h] = mSizeSuccession(styles, 40);
	addKeys({ w, h }, styles)
	let img = mDom(d, styles, { tag: 'img', src });
	return img;
}
function showim2(imgKey, d, styles = {}, opts = {}) {
	let o = lookup(M.superdi, [imgKey]);
	let src;
	if (isFilename(imgKey)) src = imgKey;
	else if (isdef(o) && isdef(opts.prefer)) src = valf(o[opts.prefer], o.img);
	else if (isdef(o)) src = valf(o.img, o.photo)
	let [w, h] = mSizeSuccession(styles, 40);
	addKeys({ w, h }, styles);
	if (nundef(o) && nundef(src)) src = rChoose(M.allImages).path;
	if (isdef(src)) return mDom(d, styles, { tag: 'img', src });
	fz = .8 * h;
	let [family, html] = isdef(o.text) ? ['emoNoto', o.text] : isdef(o.fa) ? ['pictoFa', String.fromCharCode('0x' + o.fa)] : isdef(o.ga) ? ['pictoGame', String.fromCharCode('0x' + o.ga)] : isdef(o.fa6) ? ['fa6', String.fromCharCode('0x' + o.fa6)] : ['algerian', o.friendly];
	addKeys({ family, fz, hline: fz, display: 'inline' }, styles);
	let el = mDom(d, styles, { html }); mCenterCenterFlex(el);
	return el;
	if (isdef(o.text)) el = mDom(d, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	return el;
}
function simpleShowImageInBatch(key, dParent, styles = {}, opts = {}) {
	let o = M.superdi[key]; o.key = key;
	addKeys({ bg: rColor() }, styles);
	mClear(dParent);
	[w, h] = [dParent.offsetWidth, dParent.offsetHeight];
	let [sz, fz] = [.9 * w, .8 * h];
	let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	let src = (opts.prefer == 'photo' && isdef(o.photo)) ? o.photo : valf(o.img, null);
	if (isdef(src)) {
		if (o.cats.includes('card')) {
			el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src });
			mDom(d1, { h: 1, w: '100%' })
		} else {
			el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src });
		}
	}
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	assertion(el, 'PROBLEM mit' + key);
	let label = mDom(d1, { fz: 11, cursor: 'pointer' }, { html: o.friendly, className: 'ellipsis hoverHue' });
	label.onclick = simpleOnclickLabel;
	mStyle(d1, { cursor: 'pointer' });
	d1.onclick = simpleOnclickItem;
	d1.setAttribute('key', key);
	d1.setAttribute('draggable', true)
	d1.ondragstart = ev => { ev.dataTransfer.setData('itemkey', key); }
	return d1;
}
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
	let ch = op;
	for (let i = 0; i < tokens.length; i++) {
		let t = tokens[i];
		let d1 = wsPrintSymbol(d, sz, t);
		if (i < tokens.length - 1) mDom(d, { fz: sz * .7, weight: 'bold' }, { html: ch });
	}
}
function wsFromNormalized(s, sep = '_') {
	let x = replaceAll(s, sep, ' '); return x;
}
function wsGenerateCardInfo(key) {
	let bg = rChoose(['white', 'sienna', 'pink', 'lightblue']);
	let palette = wsGetColorRainbow();
	let fg = rChoose(palette);
	sym = getAbstractSymbol([2, 8, 10, 23, 26]);
	power = wsGetPower(bg);
	valueFactor = rChoose(range(1, 3));
	op = rChoose(['+', '/']); //console.log('op',op)
	return wsFenFromItem({ key, valueFactor, power, colorPower: bg, abstract: sym, colorSym: fg, op });
}
function wsGetChildInline(item, color) {
	let type = item.class;
	let key = type == 'mammal' ? 'paw' : 'big_egg';
	let o = M.superdi[key];
	let [fam, sym] = isdef(o.fa6) ? ['fa6', 'fa6'] : isdef(o.fa) ? ['pictoFa', 'fa'] : ['pictoGame', 'ga'];
	let fg = valf(color, colorIdealText(item.colorPower, true));
	return `<span style="color:${fg};vertical-align:middle;line-height:80%;font-size:${item.fz * 1.5}px;font-family:${fam}">${String.fromCharCode('0x' + M.superdi[key][sym])}</span>`;
}
function wsGetColorRainbow() { return ['gold', 'limegreen', 'orangered', 'dodgerblue', 'indigo', 'hotpink']; }

function wsGetColorRainbowText(color) { return { gold: 'gold', limegreen: 'green', orangered: 'red', hotpink: 'pink', indigo: 'violet', dodgerblue: 'blue' }[color]; }

function wsGetFoodlist() { return ['cherries', 'fish', 'grain', 'mouse', 'seedling', 'worm'] }

function wsGetIcon(sym, sz = 30) {
	let html;
	if (nundef(sym)) sym = 'leaf';//rChoose(['omni', 'fish', 'mouse', 'wheat', 'worm', 'cherry']);
	if (sym == 'omni') {
		let colors = toWords('british_racing_green yellow sangria azure gray', true).map(x => colorFrom(x));
		html = generatePizzaSvg(sz, ...colors);
	} else if (sym == 'fish') {
		html = `
      <svg width="${sz}" height="${sz}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
          <g transform="matrix(1,0,0,1,-700,-300)">
              <g transform="matrix(-10.1636,-1.24469e-15,1.24469e-15,-10.1636,756.948,402.109)">
                  <g id="ws-4">
                      <path id="fish" d="M0,0.092C0,-0.238 0.267,-0.506 0.598,-0.506C0.927,-0.506 1.195,-0.238 1.195,0.092C1.195,0.422 0.927,0.69 0.598,0.69C0.267,0.69 0,0.422 0,0.092M-11.442,-1.15L-11.442,-1.088C-11.442,-1.037 -11.42,-0.992 -11.408,-0.945C-11.275,-0.465 -10.779,-0.016 -10.771,0.305C-10.756,0.912 -11.504,1.256 -11.586,1.625C-11.586,1.625 -11.667,1.904 -11.559,2.025C-11.499,2.092 -11.42,2.102 -11.337,2.094C-9.921,1.954 -8.259,1.047 -7.839,1.24C-7.419,1.433 -5.796,3.438 -2.936,3.63C-1.327,3.738 1.139,3.412 2.135,2.096C2.368,1.819 2.579,1.517 2.783,1.224C2.876,1.09 2.97,0.957 3.065,0.825C3.225,0.596 3.097,0.387 3.056,0.337C2.902,0.146 2.75,-0.056 2.602,-0.253C2.27,-0.693 1.927,-1.148 1.529,-1.524C-0.167,-3.129 -2.469,-3.646 -4.806,-2.897C-5.842,-2.565 -7.774,-0.907 -7.775,-0.907C-8.289,-0.579 -10.235,-1.284 -11.139,-1.405C-11.214,-1.415 -11.286,-1.421 -11.346,-1.37C-11.406,-1.32 -11.442,-1.237 -11.442,-1.15" style="fill:rgb(0,121,159);fill-rule:nonzero;"/>
                  </g>
              </g>
          </g>
      </svg>
    `;
	} else if (sym == 'mouse') {
		html = `
        <svg width="${sz}" height="${sz}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
            <g transform="matrix(1,0,0,1,-500,-300)">
                <g transform="matrix(9.09451,0,0,9.09451,670.98,392.954)">
                    <g id="ws-5">
                        <path id="mouse" d="M0,0.136C-0.705,-0.412 -2.127,-0.236 -2.867,-0.095C-2.803,-2.905 -7.442,-5.024 -10.299,-2.45L-11.797,-2.233C-11.131,-3.613 -12.9,-3.994 -13.312,-2.346L-15.426,-0.406C-16.451,0.4 -16.105,1.031 -15.189,1.031C-14.876,1.031 -11.897,1.617 -11.472,2.094C-11.535,2.206 -11.852,2.384 -11.773,2.995L-5.978,3.179C-4.286,2.679 -3.368,1.772 -3.023,0.768C-2.195,0.57 -0.921,0.449 -0.497,0.777C-0.434,0.826 -0.369,0.899 -0.369,1.063C-0.369,1.549 -0.767,1.699 -1.744,1.949C-2.445,2.129 -3.24,2.332 -3.749,2.912C-4.156,3.376 -4.309,3.827 -4.202,4.25C-4.05,4.859 -3.429,5.107 -3.359,5.134C-3.312,5.152 -3.264,5.16 -3.216,5.16C-3.052,5.16 -2.897,5.059 -2.837,4.896C-2.758,4.687 -2.864,4.452 -3.074,4.374C-3.131,4.352 -3.371,4.228 -3.415,4.053C-3.452,3.907 -3.354,3.692 -3.139,3.447C-2.796,3.057 -2.159,2.893 -1.542,2.735C-0.658,2.509 0.442,2.227 0.442,1.063C0.442,0.681 0.289,0.36 0,0.136" style="fill:rgb(116,100,91);fill-rule:nonzero;"/>
                    </g>
                </g>
            </g>
        </svg>
      `;
	} else if (sym == 'worm') {
		html = `
        <svg width="${sz}" height="${sz}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
            <g transform="matrix(1,0,0,1,-300,-100)">
                <g transform="matrix(7.14802,0,0,7.14802,-2977.16,-1174.38)">
                    <g id="ws-1">
                        <g id="worm">
                            <g transform="matrix(1,0,0,1,467.653,195.772)">
                                <path d="M0,-8.535C-0.018,-8.351 -0.038,-8.047 -0.036,-7.798C-0.033,-7.536 -0.021,-7.275 0.007,-7.021C0.06,-6.511 0.179,-6.031 0.35,-5.619C0.432,-5.41 0.538,-5.226 0.648,-5.059C0.75,-4.905 0.789,-4.895 0.869,-4.838C1.013,-4.757 1.318,-4.665 1.782,-4.653C2.239,-4.635 2.789,-4.679 3.406,-4.729C3.718,-4.754 4.049,-4.779 4.42,-4.788C4.792,-4.794 5.204,-4.792 5.732,-4.686C6.694,-4.473 7.445,-4.057 8.093,-3.608C8.416,-3.38 8.716,-3.139 8.999,-2.886C9.14,-2.758 9.278,-2.629 9.413,-2.493C9.556,-2.348 9.664,-2.238 9.84,-2.031L9.993,-1.85C10.704,-1.01 10.599,0.248 9.758,0.959C8.918,1.67 7.66,1.564 6.95,0.724C6.866,0.626 6.79,0.513 6.729,0.404C6.711,0.373 6.616,0.251 6.548,0.17C6.473,0.08 6.394,-0.009 6.313,-0.096C6.152,-0.269 5.983,-0.43 5.815,-0.575C5.479,-0.863 5.134,-1.063 4.895,-1.148C4.821,-1.18 4.615,-1.217 4.37,-1.231C4.125,-1.248 3.839,-1.252 3.535,-1.254C2.922,-1.259 2.237,-1.25 1.464,-1.348C0.709,-1.447 -0.233,-1.666 -1.075,-2.345C-1.479,-2.669 -1.84,-3.145 -2.029,-3.534C-2.22,-3.903 -2.374,-4.283 -2.48,-4.66C-2.701,-5.417 -2.79,-6.164 -2.792,-6.886C-2.795,-7.247 -2.774,-7.603 -2.74,-7.957C-2.701,-8.323 -2.657,-8.633 -2.563,-9.056C-2.408,-9.76 -1.711,-10.205 -1.007,-10.049C-0.355,-9.906 0.075,-9.297 0.011,-8.649L0,-8.535Z" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(-0.516885,-0.856055,-0.856055,0.516885,474.654,198.339)">
                                <path d="M-0.369,-0.653C-0.561,-0.652 -0.716,-0.461 -0.716,-0.223C-0.716,0.015 -0.561,0.208 -0.369,0.208C-0.177,0.208 -0.021,0.016 -0.021,-0.223C-0.021,-0.46 -0.177,-0.653 -0.369,-0.653" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(1,0,0,1,474.892,196.692)">
                                <path d="M0,1.752C0.014,1.561 0.041,1.419 0.072,1.26C0.114,1.108 0.14,0.954 0.209,0.811C0.272,0.66 0.356,0.52 0.439,0.401C0.515,0.27 0.593,0.149 0.661,0L1.046,0.377C0.917,0.433 0.806,0.524 0.705,0.613C0.614,0.715 0.525,0.806 0.489,0.922C0.451,1.042 0.417,1.168 0.427,1.297C0.431,1.42 0.458,1.564 0.518,1.653L0,1.752Z" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(0.516885,0.856055,0.856055,-0.516885,479.321,195.111)">
                                <path d="M0.369,-0.208C0.561,-0.208 0.716,-0.015 0.716,0.222C0.716,0.461 0.56,0.653 0.369,0.653C0.176,0.653 0.021,0.46 0.021,0.222C0.021,-0.016 0.177,-0.208 0.369,-0.208" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(1,0,0,1,479.355,194.874)">
                                <path d="M0,0.679C-0.051,0.585 -0.166,0.495 -0.273,0.434C-0.382,0.364 -0.51,0.336 -0.633,0.314C-0.753,0.293 -0.874,0.329 -1.008,0.362C-1.134,0.41 -1.266,0.465 -1.375,0.554L-1.53,0.038C-1.367,0.047 -1.223,0.034 -1.072,0.028C-0.927,0.01 -0.764,0 -0.602,0.015C-0.443,0.02 -0.295,0.069 -0.14,0.102C0.015,0.148 0.152,0.191 0.329,0.267L0,0.679Z" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
        `;
	} else if (sym == 'wheat') {
		html = `
        <svg width="${sz}" height="${sz}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
            <g transform="matrix(1,0,0,1,-300,-500)">
                <g transform="matrix(7.70232,0,0,7.70232,-3403,-873.691)">
                    <g id="ws-6">
                        <g id="wheat">
                            <g transform="matrix(1,0,0,1,487.796,189.11)">
                                <path d="M0,-2.293C0.445,-1.498 1.102,-0.729 1.282,-0.522C1.462,-0.316 3.41,-0.035 4.113,0.01C3.948,-0.403 3.671,-0.749 3.079,-1.281C2.586,-1.724 2.109,-1.963 1.47,-2.084C1.11,-2.152 0.279,-2.303 0,-2.293" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(0.807192,0.590289,0.590289,-0.807192,489.51,186.325)">
                                <path d="M0.599,0.015C0.869,0.113 1.467,0.126 1.68,0.173C1.017,0.749 0.85,1.614 0.599,1.67C0.348,1.727 -0.747,1.767 -1.127,1.674C-1.066,1.536 -0.423,0.405 0.599,0.015" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(1,0,0,1,493.462,188.018)">
                                <path d="M0,-0.85C-0.107,-1.338 -1.235,-2.168 -1.841,-2.459C-1.935,-2.155 -2.079,-1.594 -2.053,-1.056C-2.024,-0.467 -1.76,0.211 -1.407,0.615C-1.055,1.019 -0.183,1.515 0.13,1.609C0.128,1.597 0.126,1.586 0.124,1.574C-0.042,0.499 0.107,-0.361 0,-0.85" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(1,0,0,1,493.524,194.883)">
                                <path d="M0,-2.513C-1.031,-2.522 -1.653,-2.448 -2.565,-2.524C-2.161,-1.814 -1.315,-0.599 -0.557,-0.253C0.201,0.094 1.4,-0.3 2.482,-0.291C2.697,-0.289 3.439,-0.2 3.657,-0.152C3.551,-0.509 3.087,-1.833 2.6,-2.147C1.889,-2.607 1.577,-2.5 0,-2.513" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(1,0,0,1,496.22,189.606)">
                                <path d="M0,-0.012C-0.375,-1.259 -1.609,-2.115 -2.317,-2.551C-2.342,-1.879 -2.343,-1.374 -2.21,-0.514C-2.049,0.535 -1.946,0.574 -1.451,1.053C-1.175,1.319 -0.283,2.43 0.145,2.539C0.145,2.539 0.144,0.467 0,-0.012" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(-0.506442,0.862274,0.862274,0.506442,497.305,197.132)">
                                <path d="M-1.454,-1.812C-0.793,-3.066 -0.232,-3.44 0.202,-4.508C0.816,-2.36 0.396,0.388 -1.454,1.136C-1.693,1.232 -0.925,0.982 -1.454,1.136C-1.409,0.584 -2.027,-0.726 -1.454,-1.812" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(1,0,0,1,496.942,193.86)">
                                <path d="M0,-2.164C-0.197,-0.955 0.514,0.481 0.88,0.901C1.246,1.32 1.926,2.192 2.218,2.336C3.808,0.963 1.265,-2.639 0.213,-3.845C0.017,-4.069 -0.193,-4.287 -0.415,-4.5C-0.415,-4.5 -0.002,-3.337 0,-2.164" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(0.658061,-0.752964,-0.752964,-0.658061,489.682,185.285)">
                                <path d="M-1.083,-0.492C-0.929,-0.19 -0.7,0.149 -0.362,0.372C-0.023,0.597 -1.083,2.385 -1.083,2.385C-1.083,2.385 -1.281,0.976 -1.678,0.238C-1.494,0.048 -1.282,-0.197 -1.083,-0.492" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(1,0,0,1,493.645,189.424)">
                                <path d="M0,2.503C0.135,2.509 1.42,2.539 1.55,2.55C1.235,2.005 0.612,1.245 0.031,0.771C-0.532,0.313 -1.45,0.27 -2.369,0.204C-2.97,0.161 -3.964,-0.039 -4.563,-0.047C-4.309,0.6 -3.575,1.878 -3.04,2.181C-2.504,2.485 -1.165,2.457 0,2.503" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                            </g>
                            <g transform="matrix(1,0,0,1,498.162,197.672)">
                                <path d="M0,-0.974C0.138,-0.91 0.295,-0.809 0.427,-0.701C0.564,-0.594 0.684,-0.467 0.803,-0.344C0.906,-0.218 0.995,-0.088 1.06,0.052C1.119,0.181 1.236,0.44 1.251,0.547L2.018,-0.089C1.867,-0.346 1.481,-0.74 1.316,-0.866C0.983,-1.134 0.56,-1.408 0.317,-1.521L0,-0.974Z" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
      `;
	} else if (sym == 'mouse') {
		html = `
              <svg width="${sz}" height="${sz}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                  <g transform="matrix(1,0,0,1,-500,-300)">
                      <g transform="matrix(9.09451,0,0,9.09451,670.98,392.954)">
                          <g id="ws-5">
                              <path id="mouse" d="M0,0.136C-0.705,-0.412 -2.127,-0.236 -2.867,-0.095C-2.803,-2.905 -7.442,-5.024 -10.299,-2.45L-11.797,-2.233C-11.131,-3.613 -12.9,-3.994 -13.312,-2.346L-15.426,-0.406C-16.451,0.4 -16.105,1.031 -15.189,1.031C-14.876,1.031 -11.897,1.617 -11.472,2.094C-11.535,2.206 -11.852,2.384 -11.773,2.995L-5.978,3.179C-4.286,2.679 -3.368,1.772 -3.023,0.768C-2.195,0.57 -0.921,0.449 -0.497,0.777C-0.434,0.826 -0.369,0.899 -0.369,1.063C-0.369,1.549 -0.767,1.699 -1.744,1.949C-2.445,2.129 -3.24,2.332 -3.749,2.912C-4.156,3.376 -4.309,3.827 -4.202,4.25C-4.05,4.859 -3.429,5.107 -3.359,5.134C-3.312,5.152 -3.264,5.16 -3.216,5.16C-3.052,5.16 -2.897,5.059 -2.837,4.896C-2.758,4.687 -2.864,4.452 -3.074,4.374C-3.131,4.352 -3.371,4.228 -3.415,4.053C-3.452,3.907 -3.354,3.692 -3.139,3.447C-2.796,3.057 -2.159,2.893 -1.542,2.735C-0.658,2.509 0.442,2.227 0.442,1.063C0.442,0.681 0.289,0.36 0,0.136" style="fill:rgb(116,100,91);fill-rule:nonzero;"/>
                          </g>
                      </g>
                  </g>
              </svg>
            `;
	} else if (sym == 'leaf') {
		html = `<img width="${sz}" height="${sz}" src='../assets/img/emo/seedling.png' />`;
	} else {
		html = `
        <svg width="${sz}" height="${sz}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
            <g transform="matrix(1,0,0,1,-300,-300)">
                <g transform="matrix(8.59167,0,0,8.59167,432.85,422.626)">
                    <g id="ws-3">
                        <path id="berries" d="M0,-5.356C-0.427,-5.356 -0.825,-5.247 -1.184,-5.07L-1.487,-6.86C-1.18,-7.11 -0.839,-7.331 -0.47,-7.508C0.341,-7.901 1.273,-8.154 2.148,-8.241L2.17,-8.243C2.227,-8.249 2.283,-8.262 2.338,-8.282C2.695,-8.415 2.877,-8.811 2.745,-9.168C2.612,-9.524 2.216,-9.706 1.859,-9.574C0.872,-9.208 -0.018,-8.809 -0.897,-8.288C-1.327,-8.022 -1.751,-7.73 -2.127,-7.365C-2.478,-7.028 -2.813,-6.676 -3.154,-6.309C-3.37,-6.078 -3.566,-5.826 -3.752,-5.566C-3.756,-5.566 -3.759,-5.568 -3.763,-5.568L-5.106,-5.582C-5.308,-6.864 -6.41,-7.847 -7.749,-7.847C-9.233,-7.847 -10.435,-6.645 -10.435,-5.162C-10.435,-3.679 -9.233,-2.476 -7.749,-2.476C-6.304,-2.476 -5.134,-3.62 -5.074,-5.051L-4.184,-4.886C-4.394,-4.515 -4.579,-4.131 -4.719,-3.739C-4.942,-3.129 -5.117,-2.511 -5.27,-1.883C-6.879,-1.753 -8.148,-0.421 -8.148,1.221C-8.148,2.949 -6.748,4.35 -5.019,4.35C-3.291,4.35 -1.89,2.949 -1.89,1.221C-1.89,-0.297 -2.973,-1.562 -4.408,-1.846C-4.278,-2.39 -4.122,-2.933 -3.938,-3.457C-3.647,-4.336 -3.233,-5.136 -2.609,-5.816C-2.452,-5.994 -2.279,-6.162 -2.1,-6.327L-1.724,-4.714C-2.307,-4.221 -2.686,-3.493 -2.686,-2.67C-2.686,-1.187 -1.483,0.016 0,0.016C1.484,0.016 2.686,-1.187 2.686,-2.67C2.686,-4.153 1.484,-5.356 0,-5.356" style="fill:rgb(152,21,49);fill-rule:nonzero;"/>
                    </g>
                </g>
            </g>
        </svg>
      `;
	}
	return mCreateFrom(html);
}
function wsGetMission() {
	let missions = {
		class: [],
		food_only: [],
		food_specific: [],
		size_atMost: [],
		size_arLeast: [],
		weight_AtMost: [],
		weight_AtLeast: [],
		cards_hand: [],
		cards_board: [],
		cards_habitat: [],
		habitat_only: [],
		tuck: [],
		powerColor: [],
	}
	return rChoose(Object.keys(missions));
}
function wsGetPower(colorOrKey, prop) {
	let powers = {
		_child_1_sym: [],
		_child_2_sym: [],
		_child_1_class: [],
		_child_2_class: [],
		_child_1_color: [],
		_child_2_color: [],
		_draw_1_card_deck: [],
		_draw_2_card_return_1: [],
		_draw_2_card_1: [],
		_tuck_1_pick_feeder: [],
		_tuck_1_pick_supply: [],
		_tuck_1_draw_tray: [],
		_tuck_1_draw_deck: [],
		_tuck_1_place: [],
		_food_1_supply: [],
		_food_1_feeder: [],
		_food_2_supply: [],
		_food_2_tray: [],
		_discard_1_child_pick_2_food_feeder: [],
		_discard_1_child_pick_1_food_supply: [],
		_discard_1_child_draw_2_card: [],
		_discard_1_food_draw_1_card: [],
		_discard_1_card_pick_1_food_supply: [],
		_repeat: [],
		_hunt_food_mouse: [],
		_hunt_food_fish: [],
		_hunt_card_sym: [],
		pink_draw_mission_pick_1_food_feeder: [],
		pink_place_child_pick_1_food_feeder: [],
		pink_hunt_successfully_pick_1_food_feeder: [],
		pink_draw_mission_draw_1_card_deck: [],
		pink_place_child_draw_1_card_deck: [],
		pink_hunt_successfully_draw_1_card_deck: [],
		white_draw_2_mission_return_1: [],
		white_collect_fish: [],
		white_collect_mouse: [],
		white_collect_worm: [],
		white_collect_cherries: [],
		white_child_sym: [],
		white_child_color: [],
		white_child_class: [],
		lightblue_feeder: [],
		lightblue_tray: [],
	};
	let list = Object.keys(powers);
	if (isColor(colorOrKey)) return rChoose(list.filter(x => colorOrKey == 'sienna' ? x.startsWith('_') : x.startsWith(colorOrKey)));
	else if (nundef(colorOrKey)) return rChoose(list);
	else if (nundef(prop)) return powers[colorOrKey];
	else return lookup(powers, [colorOrKey, prop]);
}
function wsGetRandomCards(n = 1, deck = null) {
	if (!deck) deck = jsCopy(M.byCollection.tierspiel).map(x => wsGenerateCardInfo(x)); console.log(deck.length);
	let list = rChoose(deck, n);
	return list.length == 1 ? wsItemFromFen(list[0]) : list.map(x => wsItemFromFen(x));
}
function wsGetSymbolFilename(key) {
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
	return files[key];
}
function wsGetSymbolInline(key, fz) { return `&nbsp;<span style="vertical-align:middle;line-height:80%;font-size:${fz * 1.5}px;font-family:pictoGame">${String.fromCharCode('0x' + M.superdi[key].ga)}</span>`; }

function wsHabitat(tokens, dtop, sz) {
	for (let i = 0; i < tokens.length; i++) {
		let t = tokens[i];
		if (i == 2) mLinebreak(dtop);
		let d = wsPrintSymbol(dtop, sz, t);
		if (i == 2) mStyle(d, { matop: -sz * 3 / 2 });
	}
}
function wsHowMany(deck, prop, val, op) {
}
function wsItemFromFen(fen) {
	let [key, valueFactor, power, colorPower, sym, colorSym, op] = fen.split('@');
	let o = getDetailedSuperdi(key);
	let item = jsCopy(o);
	let bg = item.colorPower = colorPower;
	let palette = wsGetColorRainbow();
	let fg = item.colorSym = colorSym;
	sym = item.abstract = sym;
	item.power = power;
	valueFactor = item.valueFactor = valueFactor;
	item.op = op;
	item.value = valueFactor * (item.op == '+' ? 1 : item.foodTokens.length);
	return item;
}
function wsOffspringSymbol(dParent, styles = {}) {
	console.log(styles)
	let [w, h] = [styles.h, styles.h];
	console.log(w, h)
	let d = mDom(dParent, { w, h, box: true });//,bg:'orange'}); //w100:true,h100:true,bg:'lime'});
	let fz = styles.h; let hline = fz;
	mIfNotRelative(d);
	let o = M.superdi.big_egg;
	let [fam, sym] = isdef(o.fa6) ? ['fa6', 'fa6'] : isdef(o.fa) ? ['pictoFa', 'fa'] : ['pictoGame', 'ga'];
	let dEgg = mDom(d, { fg: 'grey', family: fam, fz, padding: 0, hline }, { html: String.fromCharCode('0x' + o[sym]) });
	o = M.superdi.paw;
	[fam, sym] = isdef(o.fa6) ? ['fa6', 'fa6'] : isdef(o.fa) ? ['pictoFa', 'fa'] : ['pictoGame', 'ga'];
	let dPaw = mDom(d, { w100: true, fg: 'black', family: fam, fz: 8, hline }, { html: String.fromCharCode('0x' + o[sym]) });
	mCenterFlex(dPaw)
	mPlace(dPaw, 'tc')
}
async function wsOnclickCard(table, item, items) { }

function wsPowerText(item, d, styles = {}) {
	mClear(d)
	let key = item.power; if (key.startsWith('_')) key = 'sienna' + key;
	let parts = key.split('_'); //console.log(parts)
	let s = '';
	let color = parts[0];
	if (color == 'sienna') s += 'WHEN ACTIVATED: ';
	else if (color == 'pink') s += 'ONCE BETWEEN TURNS: ';
	else if (color == 'white') s += 'WHEN PLAYED: ';
	else if (color == 'lightblue') s += 'ROUND END: ';
	copyKeys({ bg: color }, styles); mStyle(d, { bg: color, fg: 'contrast' });
	let what = parts[1];
	let verb = '';
	let n = Number(parts[2]);
	if (color == 'sienna') {
		if (what == 'child') {
			verb = 'place';
			s += `${capitalize(verb)} ${n} ${pluralOf('child', n)} on any`;
			let prop = parts[3];
			switch (prop) {
				case 'color':
					s += ` ${n == 1 ? 'card' : '2 cards'} with color <span style="border-radius:${item.fz}px;padding-left:${item.fz / 2}px;padding-right:${item.fz / 2}px;background-color:white;color:${colorFrom(item.colorSym)}">${wsGetColorRainbowText(item.colorSym)}</span>.`; break;
				case 'class':
					s += ` ${item.class}.`; break;
				case 'sym':
				default:
					s += ` ${n == 1 ? 'card' : '2 cards'} with symbol ${wsGetSymbolInline(item.abstract, item.fz)}.`;
			}
			if (n == 2) s += ` Other players may place 1 ${what}.`
		} else if (what == 'draw') {
			verb = 'draw';
			what = parts[3];
			s += `${capitalize(verb)} ${n} ${pluralOf(what, n)}`;
			let prop = parts[4];
			switch (prop) {
				case 'tray':
				case 'deck': s += ` from ${prop}.`; break;
				case 'return': s += `, return 1 at the end of action.`; break;
				case '1': s += ` Other players may draw 1.`; break;
				default: s += '.'; break;
			}
		} else if (what == 'tuck') {
			verb = what;
			what = parts[3];
			s += `${capitalize(verb)} ${n} ${pluralOf('card', n)}`;
			let prop = parts[3];
			switch (prop) {
				case 'pick': s += ` to ${prop} 1 food from ${parts[4]}.`; break;
				case 'draw': s += ` to ${prop} 1 card from ${parts[4]}.`; break;
				case 'place': s += ` to ${prop} 1 child on any card.`; break;
				default:
			}
		} else if (what == 'food') {
			verb = 'pick';
			s += `${capitalize(verb)} ${n} ${what} from ${parts[3]}.`;
			if (n == 2) s += ` Other players ${verb} 1 ${what}.`
		} else if (what == 'all') {
			s += `All players ${parts[2]} ${parts[3]} ${what}.`;
		} else if (what == 'discard') {
			let n1 = Number(parts[5])
			s += `You may ${what} ${n} ${parts[3]} to ${parts[4]}`;
			if (parts.length > 5) {
				let n1 = Number(parts[5]);
				s += ` ${n1} ${pluralOf(parts[6], n1)}`;
				s += parts.length > 7 ? ` from ${parts[7]}.` : '.';
			} else s += '.';
		} else if (what == 'repeat') {
			s += `Repeat another brown power on this habitat.`;
		} else if (what == 'hunt') {
			let verb = what; what = parts[2];
			if (what == 'food') {
				s += `Roll dice in feeder. If there is a ${parts[3]}, keep it.`;
			} else if (what == 'card') {
				s += `Draw a card. `;
				switch (parts[3]) {
					case 'sym':
					default: s += `If it has symbol ${wsGetSymbolInline(item.abstract, item.fz)}, tuck it.`; break;
				}
			}
		}
	}
	if (color == 'pink') {
		let [verb1, what1, verb2, n, what2, from] = parts.slice(1);
		s += `When another player ${verb1}s ${what1}, ${verb2} ${n} ${what2}`;
		s += isdef(from) ? ` from ${from}.` : '.';
	}
	if (color == 'white') {
		if (what == 'draw') {
			verb = 'draw';
			what = parts[3];
			s += `${capitalize(verb)} ${n} ${pluralOf(what, n)}`;
			let prop = parts[4];
			switch (prop) {
				case 'tray':
				case 'deck': s += ` from ${prop}.`; break;
				case 'return': s += `, return 1`; s += what == 'card' ? ` at the end of action.` : '.'; break;
				case '1': s += ` Other players may draw 1.`; break;
				default: s += '.'; break;
			}
		} else if (what == 'collect') {
			s += `Collect all ${parts[2]} from feeder.`
		} else if (what == 'child') {
			s += `Place 1 child on each of your cards with `;
			what = parts[2];
			switch (what) {
				case 'sym': s += `symbol ${wsGetSymbolInline(item.abstract, item.fz)}.`; break;
				case 'class': s += `class ${item.class}.`; break;
				case 'color': s += `color <span style="color:${colorFrom(item.colorSym)}">${wsGetColorRainbowText(item.colorSym)}</span>.`; break;
			}
		}
	}
	if (color == 'lightblue') {
		if (what == 'feeder') s += `Collect all food in feeder.`
		else if (what == 'tray') s += `Collect a card from tray.`
	}
	s = replaceAll(s, 'child', wsGetChildInline(item));
	d.innerHTML = s;
	return d;
}
async function wsPreAction(table, items) {
	let [fen, me] = [table.fen, getUname()]
	let [phase, stage, round, pl, plorder, turn] = [fen.phase, fen.stage, fen.round, table.players[me], table.plorder, table.turn];
	console.log()
}
function wsPresent(table) {
	presentStandardBGA();
	return;
	let fen = table.fen;
	let me = getUname();
	let pl = table.players[me];
	let d = mBy('dTable');
	d.style = '';
	d.className = '';
	mStyle(d, { hmin: 500, w: '90%', margin: 20 });
	d.innerHTML = ' '; mCenterFlex(d)
	let dCards = mDom(d, { gap: 8 }); mCenterFlex(dCards);
	let items = [];
	for (const fencard of pl.cards) {
		let ocard = wsItemFromFen(fencard);
		wsShowCardItem(ocard, dCards, .5);
		items.push(ocard);
	}
	mLinebreak(d, 25)
	let [w, h] = [1467, 1235].map(x => x * .67);
	let bg = U.color;
	let db = mDom(d, { w, h, bg, padding: 10, position: 'relative' });
	let da = mDom(db, { 'transform-origin': 'center', transform: 'rotate( -.3deg )', position: 'relative', w, h });
	let ibg = mDom(da, { position: 'absolute', left: 0, top: 0, w, h }, { tag: 'img', src: '../ode/wsboard1.jpg' });
	let dBoard = mDom(db, { position: 'absolute', left: -2, top: 0, w: w - 18, h: h - 12, wbox: true, border: `20px ${bg} solid` });
	let gap = 12;
	let grid = mGrid(3, 5, dBoard, { paleft: gap / 2, patop: gap, w: w - 52 }); //,position:'absolute'});
	let sym = ['food', 'child', 'card'];
	let n = [1, 1, 2, 2, 3];
	let cost = [0, 1, 1, 2, 2];
	let addon = [0, 1, 0, 1, 0];
	let list = wsGetRandomCards(15, fen.deck);
	for (const i of range(3)) {
		for (const j of range(5)) {
			let d = mDom(grid, { w: 172, h: 250, bg: rColor(), mabottom: 20 }); //,{html:'card'});
			let item = wsShowCardItem(list[i + 3 * j], d, .5)
		}
	}
	return items;
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
	let src = valf(files[key], key == 'food' ? files[rChoose(keys)] : null);
	if (src) return mDom(dParent, styles, { tag: 'img', width: sz, height: sz, src: files[valf(key, rChoose(keys))] });
	let o = M.superdi[key];
	return showim2(key, dParent, styles);
}
function wsSetup(table) {
	let fen = {};
	fen.deck = jsCopy(M.byCollection.tierspiel).map(x => wsGenerateCardInfo(x));
	arrShuffle(fen.deck);
	for (const name in table.players) {
		let pl = table.players[name];
		pl.score = 0;
		pl.cards = deckDeal(fen.deck, 5);
		pl.missions = [];
		pl.offsprings = 0;
		wsGetFoodlist().map(x => pl[x] = 0);
		pl.forest = [];
		pl.grassland = [];
		pl.wetland = [];
	}
	fen.round = 0;
	fen.phase = 'init';
	fen.stage = 'pick_cards';
	table.plorder = jsCopy(table.playerNames);
	table.turn = jsCopy(table.playerNames);
	return fen;
}
function wsShowCardItem(item, d, fa) {
	let [w, h, sztop, sz, gap, fz] = [340, 500, 100, 30, 8, 16].map(x => x * fa);
	item.fz = fz;
	let [card, dCard] = wsCard(d, w, h);
	let dtop = wsTopLeft(dCard, sztop, card.rounding);
	addKeys(card, item);
	let [bg, fg] = [item.colorPower, item.colorSym];
	wsHabitat(item.habTokens, dtop, sz * 1.1); mLinebreak(dtop, sz / 5);
	wsFood(item.foodTokens, item.op, dtop, sz * .8);
	wsTitle(item, dCard, sztop, fz, gap);
	let [szPic, yPic] = [h / 2, sztop + gap]
	let d1 = showim2(item.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tr', gap, yPic);
	let leftBorderOfPic = w - (szPic + gap);
	let dleft = mDom(dCard, { w: leftBorderOfPic, h: szPic }); mPlace(dleft, 'tl', gap / 2, sztop + gap);
	mCenterCenterFlex(dleft);
	let dval = mDom(dleft, { fg, w: sz * 1.2, align: 'center', fz: fz * 1.8, weight: 'bold' }, { html: item.value });
	mLinebreak(dleft, 2 * gap)
	let szSym = sz * 1.5;
	let a = showim2(item.abstract, dleft, { w: szSym, h: szSym, fg });
	mLinebreak(dleft, 3 * gap)
	let dPlaetze = item.live.dPlaetze = showPlaetze(dleft, item, gap * 2);
	item.dpower = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: sztop + szPic + gap * 3, w100: true, bg, fg: 'contrast', box: true });
	wsPowerText(item, item.dpower, { fz: item.fz })
	let dinfo = mDom(dCard, { fz, hpadding: gap, box: true, w100: true });
	mPlace(dinfo, 'bl'); mFlexLine(dinfo, 'space-between');
	mDom(dinfo, {}, { html: item.class });
	mDom(dinfo, {}, { html: item.olifespan.text });
	mDom(dinfo, {}, { html: item.osize.text });
	return item;
}
function wsStats(table) {
	let [me, players] = [getUname(), table.players];
	let style = { patop: 8, mabottom: 20, bg: 'beige', fg: 'contrast' };
	let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'colflex', style)
	for (const plname in players) {
		let pl = players[plname];
		let item = player_stat_items[plname];
		if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
		let d = iDiv(item);
		mStyle(d, { wmin: 200, padding: 12 })
		mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
		let d1 = mDom(d); mCenterFlex(d1);
		wsGetFoodlist().map(x => playerStatCount(wsGetSymbolFilename(x), pl[x], d1));
		mLinebreak(d, 10);
		let d2 = mDom(d); mCenterFlex(d2);
		playerStatCount('star', pl.score, d2, null, { useSymbol: true }); //, {}, {id:`stat_${plname}_score`});
		playerStatCount('hand_with_fingers_splayed', pl.cards.length, d2, null, { useSymbol: true });
		playerStatCount(wsOffspringSymbol, pl.offsprings, d2);
		if (table.turn.includes(plname)) { mDom(d, { position: 'absolute', left: -3, top: 0 }, { html: getWaitingHtml() }); }
	}
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
