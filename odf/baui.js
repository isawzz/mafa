async function switchToTables(){return await switchToMainMenu('play');}
async function switchToMainMenu(name){return await switchToMenu(UI.nav,name);}


function arrAllSameOrDifferent(arr) {
	if (arr.length === 0) {
		return true; // Consider an empty array as meeting the criteria
	}

	// Check if all elements are the same
	const allSame = arr.every(element => element === arr[0]);
	if (allSame) {
		return true;
	}

	// Check if all elements are unique
	const uniqueElements = new Set(arr);
	const allDifferent = uniqueElements.size === arr.length;

	return allDifferent;
}
function arrClear(arr) { arr.length = 0; return arr; }

function clearEvents() { for (const k in TO) clearTimeout(TO[k]); }
function clickOnElemWithAttr(prop,val){
	let d=document.querySelectorAll(`[${prop}="${val}"]`)[0];
	if (isdef(d)) d.click();
	return d;
}
async function clickOnGame(gamename){await showGameMenu(gamename);}
async function clickOnPlayer(name){return await showGameMenuPlayerDialog(name);}
function cBlank(dParent, styles = {}, opts = {}) {
	if (nundef(styles.h)) styles.h = valf(styles.sz, 100);
	if (nundef(styles.w)) styles.w = styles.h * .7;
	if (nundef(styles.bg)) styles.bg = 'white';
	styles.position = 'relative';
	if (nundef(styles.rounding)) styles.rounding = Math.min(styles.w, styles.h) * .05;
	addKeys({ className: 'card' }, opts);
	let d = mDom(dParent, styles, opts);
	opts.type = 'card';
	addKeys(styles, opts);
	let item = mItem(d ? { div: d } : {}, opts);
	return item;
}
function cLandscape(dParent, styles = {}, opts = {}) {
	if (nundef(styles.w)) styles.w = 100;
	if (nundef(styles.h)) styles.h = styles.w * .65;
	return cBlank(dParent, styles, opts);
}
function cNumber(ckey, styles = {}, opts = {}) { //h = 100, w = null, backcolor = BLUE, ov = .3) {
	addKeys({ border: 'silver', h: 100 }, styles);
	addKeys({ backcolor: BLUE, ov: .3, key: ckey, type: 'num' }, opts);
	let c = cPortrait(null, styles, opts); //get an empty card

	let sym = c.rank = stringBefore(ckey, '_');
	let color = c.suit = c.val = stringAfter(ckey, '_');
	let sz = c.h;
	let [sm, lg, w, h] = [sz / 8, sz / 4, c.w, c.h];

	let styleSmall = { fg: color, h: sm, fz: sm, hline: sm, weight: 'bold' };
	cPrintSym(c, sym, styleSmall, 'tl')
	cPrintSym(c, sym, styleSmall, 'tr')
	styleSmall.transform = 'rotate(180deg)';
	cPrintSym(c, sym, styleSmall, 'bl')
	cPrintSym(c, sym, styleSmall, 'br')

	let styleBig = { matop: (h - lg) / 2, family: 'algerian', fg: color, fz: lg, h: lg, w: w, hline: lg, align: 'center' }
	styleBig = { display: 'inline', family: 'algerian', fg: color, fz: lg, hline: lg }
	cPrintSym(c, sym, styleBig, 'cc')
	return c;
}
function cPortrait(dParent, styles = {}, opts = {}) {
	if (nundef(styles.h)) styles.h = 100;
	if (nundef(styles.w)) styles.w = styles.h * .7;
	return cBlank(dParent, styles, opts);
}
function cPrintSym(card, sym, styles, pos) {
	let d = iDiv(card);

	let opts = {};
	if (isNumber(sym)) {
		opts.html = sym;
	} else if (sym.includes('/')) {
		opts.tag = 'img';
		opts.src = sym;
	}

	let d1 = mDom(d, styles, opts);
	mPlace(d1, pos, pos[0] == 'c' ? 0 : 2, pos[1] == 'c' ? 0 : 2);
}
function cRound(dParent, styles = {}, opts = {}) {
	styles.w = valf(styles.w, 100);
	styles.h = valf(styles.h, 100);
	styles.rounding = '50%';
	return cBlank(dParent, styles, opts);
}
function deckDeal(deck, n) { return deck.splice(0, n); }

function draw_set_card_test(dParent) {
	let card = cLandscape(dParent, { w: 120 });
	let d = iDiv(card, { h: '100%' });
	mCenterCenterFlex(d);
	let sz = card.sz / 4;
	let bg = 'indigo'; //`linear-gradient(${RED},black`
	let styles = { w: sz, h: sz, bg, margin: 4 }; // sz / 10, border: `solid 3px ${GREEN}` };
	let d1 = drawShape('circle', d, styles); //mCenterCenterFlex(d1); mText('A', d1, { fz: sz / 4, fg: 'white' });
	drawShape('circle', d, styles);
	drawShape('circle', d, styles);
}
function drawShape(key, dParent, styles, classes, sizing) {
	if (nundef(styles)) styles = { w: 96, h: 96, bg: 'random' };
	if (nundef(sizing)) sizing = { hgrow: true, wgrow: true };
	let d = mDiv(dParent, styles, null, null, classes, sizing);
	if (key == 'circle' || key == 'ellipse') mStyle(d, { rounding: '50%' });
	else mStyle(d, { 'clip-path': PolyClips[key] });
	return d;
}
function getGameFriendly(game) { return Serverdata.config.games[game].friendly; }

function getPlayersWithMaxScore(fen) {
	let list = dict2list(fen.players, 'name');
	list = sortByDescending(list, 'score');
	maxlist = arrTakeWhile(list, x => x.score == list[0].score);
	return maxlist.map(x => x.name);
}
function logItems() { Object.keys(Items).sort().forEach(k => console.log('Items', Items[k])); }

function makeArrayWithParts(keys) {
	let arr = []; keys[0].split('_').map(x => arr.push([]));
	for (const key of keys) {
		let parts = key.split('_');
		for (let i = 0; i < parts.length; i++) arr[i].push(parts[i]);
	}
	return arr;
}
function makeSVG(tag, attrs) {
	var el = "<" + tag;
	for (var k in attrs)
		el += " " + k + "=\"" + attrs[k] + "\"";
	return el + "/>";
}
function mItem(liveprops = {}, opts = {}) {
	let id = valf(opts.id, getUID());
	let item = opts;
	item.live = liveprops;
	item.id = id;
	let d = iDiv(item); if (isdef(d)) d.id = id;
	Items[id] = item;
	return item;
}
function mPlace(elem, pos, offx, offy) {
	elem = toElem(elem);
	pos = pos.toLowerCase();
	let dParent = elem.parentNode; mIfNotRelative(dParent); //if (dParent.style.position != 'absolute') dParent.style.position = 'relative';
	let vert = valf(offx, 0);
	let hor = isdef(offy) ? offy : vert;
	if (pos[0] == 'c' || pos[1] == 'c') {


		let dpp = dParent.parentNode; //look if dParent is connected to DOM
		let opac = mGetStyle(dParent, 'opacity'); console.log('opac', opac);
		//console.log('parent of parent',dpp);
		if (nundef(dpp)) { mAppend(document.body, dParent); mStyle(dParent, { opacity: 0 }) }

		let rParent = getRect(dParent);
		let [wParent, hParent] = [rParent.w, rParent.h];
		//if (wParent == 0) [wParent,hParent] = [mGetStyle(dParent,'w'),mGetStyle(dParent,'h')]; // 
		let rElem = getRect(elem);
		let [wElem, hElem] = [rElem.w, rElem.h];
		// console.log(rParent,'wParent',wParent,'hParent',hParent);
		// console.log(rElem,wElem,hElem)

		if (nundef(dpp)) { dParent.remove(); mStyle(dParent, { opacity: valf(opac, 1) }) }

		switch (pos) {
			case 'cc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, top: vert + (hParent - hElem) / 2 }); break;
			case 'tc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, top: vert }); break;
			case 'bc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, bottom: vert }); break;
			case 'cl': mStyle(elem, { position: 'absolute', left: hor, top: vert + (hParent - hElem) / 2 }); break;
			case 'cr': mStyle(elem, { position: 'absolute', right: hor, top: vert + (hParent - hElem) / 2 }); break;
		}
		return;
	}
	let di = { t: 'top', b: 'bottom', r: 'right', l: 'left' };
	elem.style.position = 'absolute';
	elem.style[di[pos[0]]] = hor + 'px'; elem.style[di[pos[1]]] = vert + 'px';
}
async function onclickBot() {
	let name = getUname();
	let table = Clientdata.table;
	let plmode = table.fen.players[name].playmode;
	if (plmode == 'bot') return;
	let id = table.id;
	await mPostRoute('postPlayer', { id, name, playmode: 'bot' });
}
async function onclickHybrid() {
	let name = getUname();
	let table = Clientdata.table;
	let plmode = table.fen.players[name].playmode;
	if (plmode == 'hybrid') return;
	let id = table.id;
	await mPostRoute('postPlayer', { id, name, playmode: 'hybrid' });
}
async function onclickHuman() {
	let name = getUname();
	let table = Clientdata.table;
	let plmode = table.fen.players[name].playmode;
	if (plmode == 'human') return;
	let id = table.id;
	await mPostRoute('postPlayer', { id, name, playmode: 'human' });
}
async function onclickJoinTable(id) {
	//console.log(getUname(),'clicked join',id);
	let table = Serverdata.tables.find(x => x.id == id);
	let me = getUname();
	assertion(table.status == 'open', 'too late to join! game has already started!')
	assertion(!table.playerNames.includes(me), `${me} already joined!!!`);
	table.players.push(createHumanPlayer(me));
	table.playerNames = table.players.map(x => x.name);
	let res = await mPostRoute('postTable', { id, players: table.players, playerNames: table.playerNames });
	console.log('res', res);
}
async function onclickLeaveTable(id) {
	//console.log(getUname(),'clicked leave',id);
	let table = Serverdata.tables.find(x => x.id == id);
	let me = getUname();
	assertion(table.status == 'open', 'too late to leave! game has already started!')
	assertion(isdef(table.players.find(x => x.name == me)), 'not in joined players!!!!');
	//console.log('players',table.players);
	let player = table.players.find(x => x.name == me);
	removeInPlace(table.players, player);
	table.playerNames = table.players.map(x => x.name);
	let res = await mPostRoute('postTable', { id, players: table.players, playerNames: table.playerNames });
	console.log('res', res);
}
async function onclickOpenToJoinGame() {
	console.log('_____ onclickOpenToJoinGame')
	let options = collectOptions();
	let players = collectPlayers(options);
	let t = createOpenTable(DA.gamename, players, options);
	let res = await mPostRoute('postTable', t);
}
async function onclickStartGame() {
	//console.log('_____ onclickStartGame')
	let options = collectOptions(); console.log(options)
	let players = collectPlayers(options);

	if (TESTING && lookup(DA,['testOptions','justFelixAmanda'])) {
		//console.log(jsCopy(players))
		let me = getUname();
		let names = [me]; if (me == 'felix') names.push('amanda'); else names.push('felix');
		players = names.map(x => createHumanPlayer(x)); // TEST!
		//console.log(jsCopy(players))
	}

	await startGame(DA.gamename, players, options);
}
async function onclickStartTable(id) {
	console.log('_____ onclickStartTable')
	let table = Serverdata.tables.find(x => x.id == id); assertion(isdef(table), `table with id ${id} not in Serverdata!`);
	table = setTableToStarted(table);
	let res = await mPostRoute('postTable', table);
	//console.log('res', res);
}
async function onclickTable(id) {
	//console.log('_____ onclickTable')
	await showTable(id)
}
function openGameMenuFor(gamename){clickOnElemWithAttr('gamename',gamename);}
function showGameover(table) {
	let winners = table.winners;
	let msg = winners.length > 1 ? `GAME OVER - The winners are ${winners.join(', ')}!!!` : `GAME OVER - The winner is ${winners[0]}!!!`;
	let d = mBy('ribbon'); if (isdef(d)) d.remove();
	let bg = `linear-gradient(270deg, #fffffd, #00000080)`
	d = mDom(dTitle, { bg, mabottom: 10, align: 'center', padding: 10, fz: 40, w100: true }, { html: msg, id: 'ribbon' });
}

async function startGame(gamename, players, options) {
	let table = createOpenTable(gamename, players, options);
	table = setTableToStarted(table); //fen is created here!!!!
	let res = await mPostRoute('postTable', table);

}









