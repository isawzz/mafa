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

//#region interrupt zeug
//_#endregion

//#region game menu
async function showGameMenu(gamename) {
	let users = Serverdata.users = await mGetRoute('users');//console.log('users',users);
	//for(const name in users){		console.log('',name,users[name][gamename]);	}
	mRemoveIfExists('dGameMenu');
	let dMenu = mDom('dMain', {}, { className: 'section', id: 'dGameMenu' });
	mDom(dMenu, { maleft: 12 }, { html: `<h2>game options</h2>` });
	let style = { display: 'flex', justify: 'center', w: '100%', gap: 10, matop: 6 };
	let dPlayers = mDiv(dMenu, style, 'dMenuPlayers'); //mCenterFlex(dPlayers);
	let dOptions = mDiv(dMenu, style, 'dMenuOptions'); //mCenterFlex(dOptions);
	let dButtons = mDiv(dMenu, style, 'dMenuButtons');
	DA.gamename = gamename;
	DA.gameOptions = {};
	DA.playerList = [];
	DA.allPlayers = {};
	DA.lastName = null;
	await showGamePlayers(dPlayers, users);
	await showGameOptions(dOptions, gamename);
	let astart = mButton('Start', onclickStartGame, dButtons, {}, ['button', 'input']);
	let ajoin = mButton('Open to Join', onclickOpenToJoinGame, dButtons, {}, ['button', 'input']);
	let acancel = mButton('Cancel', () => mClear(dMenu), dButtons, {}, ['button', 'input']);
	let bclear = mButton('Clear Players', onclickClearPlayers, dButtons, {}, ['button', 'input']);
}
async function showGamePlayers(dParent, users) {
	let me = getUname();
	mStyle(dParent, { wrap: true })
	for (const name in users) {
		let d = mDom(dParent, { align: 'center', padding: 2, cursor: 'pointer', border: `transparent` });
		d.setAttribute('username', name)
		let img = showUserImage(name, d, 40); //for(const i of range(3))showUserImage(name,d,40);
		let label = mDom(d, { matop: -4, fz: 12, hline: 12 }, { html: name });
		let item = jsCopy(users[name]);
		item.div = d;
		item.isSelected = false;
		DA.allPlayers[name] = item;
		d.onclick = onclickGameMenuPlayer;
	}
	await clickOnPlayer(me);
}
async function onclickClearPlayers() {
	let me = getUname();
	DA.playerList = [me];
	for (const name in DA.allPlayers) {
		if (name != me) unselectPlayerItem(DA.allPlayers[name]);
	}
	assertion(!isEmpty(DA.playerList), "uname removed from playerList!!!!!!!!!!!!!!!")
	DA.lastName = me;
	mRemoveIfExists('dPlayerOptions')

}
async function onclickGameMenuPlayer(ev) {
	let name = evToAttr(ev, 'username'); //console.log('name',name); return;
	let shift = ev.shiftKey;
	await showGameMenuPlayerDialog(name, shift);
}
async function showGameMenuPlayerDialog(name, shift = false) {
	let item = DA.allPlayers[name];
	let gamename = DA.gamename;
	let da = iDiv(item);
	if (!DA.playerList.includes(name)) await setPlayerPlaying(item, gamename);
	else await setPlayerNotPlaying(item, gamename);
	//console.log(DA.playerList);
}
function getGamePlayerOptions(gamename) { return Serverdata.config.games[gamename].ploptions; }

async function collectFromPrevious(gamename){
	let id = 'dPlayerOptions';
	let lastpl = DA.lastPlayerItem;
	let dold = mBy(id);
	if (isdef(dold)) { await collectPlayerOptions(lastpl, gamename); dold.remove(); }

}
async function setPlayerPlaying(item, gamename) {
	let [name, da] = [item.name, item.div]; //console.log('da',da)
	addIf(DA.playerList, name);
	selectPlayerItem(item);
	await collectFromPrevious(gamename);
	let id = 'dPlayerOptions';
	DA.lastPlayerItem = item;

	//if player options window is open collect

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
		let key = p; //console.log('key', key)
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let legend = formatLegend(key);
			//console.log('key',key,'to',legend)
			let fs = mRadioGroup(d, {}, `d_${key}`, legend);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, false); }

			//set radio elem with value of this player to true
			//let is_on = lookup(DA.allPlayers,[name,gamename,p]); is_on = is_on?true:false;
			let userval = p == 'playmode'?'human':lookup(DA.allPlayers, [name, gamename, p]);
			let radio;
			let chi = fs.children;
			for (const ch of chi) {
				//console.log(ch);
				let id = ch.id;
				if (nundef(id)) continue;
				let radioval = stringAfterLast(id, '_');
				if (isNumber(radioval)) radioval = Number(radioval);
				//console.log('val',radioval);
				if (userval == radioval) ch.firstChild.checked = true;
				else if (nundef(userval) && `${radioval}` == arrLast(list)) ch.firstChild.checked = true;
			}

			measure_fieldset(fs);
		}
	}

	let r = getRectInt(da, mBy('dGameMenu'));
	let rp = getRectInt(d1);
	let [y, w, h] = [r.y - rp.h - 4, rp.w, rp.h];
	let x = r.x - rp.w / 2 + r.w / 2;
	if (x < 0) x = r.x - 22;
	if (x > window.innerWidth - w - 100) x = r.x - w + r.w + 14;
	//console.log('pos',x,y,w,h);
	mIfNotRelative(dParent);
	mPos(d1, x, y);
	mButtonX(d1, ev => collectPlayerOptions(item, gamename), 18, 3, 'dimgray');
}

async function setPlayerNotPlaying(item, gamename) {
	await collectFromPrevious(gamename);
	removeInPlace(DA.playerList, item.name);
	mRemoveIfExists('dPlayerOptions');
	unselectPlayerItem(item);

}
function selectPlayerItem(item) { mStyle(iDiv(item), { bg: getUserColor(item.name), fg: 'white', border: `white` }); }
function unselectPlayerItem(item) { mStyle(iDiv(item), { bg: 'transparent', fg: 'black', border: `transparent` }); }

//#endregion game menu

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

function clearEvents() { 
	for (const k in TO) {clearTimeout(TO[k]);TO[k]=null;} 
	for (const k in ANIM) {if (isdef(ANIM[k])) ANIM[k].cancel();ANIM[k]=null;} 
}
function clickOnElemWithAttr(prop, val) {
	let d = document.querySelectorAll(`[${prop}="${val}"]`)[0];
	if (isdef(d)) d.click();
	return d;
}
async function clickOnGame(gamename) { await showGameMenu(gamename); }
async function clickOnPlayer(name) { return await showGameMenuPlayerDialog(name); }
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
function collectPlayers() {
	let players = {};
	if (isList(DA.playerList)) {
		for (const name of DA.playerList) {
			players[name] = DA.allPlayers[name];
		}
	}

	if (TESTING == 'felixAmanda') {
		if (nundef(players.felix)) players.felix = createGamePlayer('felix', DA.gamename)
		if (nundef(players.amanda)) players.amanda = createGamePlayer('amanda', DA.gamename)
	}

	return players;
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
function createGamePlayer(name, gamename, opts = {}) {
	let pl = jsCopy(Serverdata.users[name]);

	let plopts = valf(pl[gamename], {}); delete pl[gamename];

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
function createOpenTable(gamename, players, options) {
	let me = getUname();
	let playerNames = [me];
	//'a' in {a:1,b:2}
	//console.log('players',players)
	assertion(me in players, "createOpenTable without owner!!!!!")

	for (const name in players) { addIf(playerNames, name); }
	//console.log('players',players)

	let pdict = {};
	for (const name of playerNames) {
		let o = {};
		let pl = players[name];
		for (const k in pl) {
			if (k == gamename) { addKeys(pl[gamename], o); }
			else if (!['div', 'isSelected'].includes(k)) o[k] = pl[k];
		}

		if (TESTING && gamename == 'setgame') {
			let keys = ['playmode','score','level','name','color','key'];
			let osorted={};
			for (const k of keys) {osorted[k]=o[k];			}
			pdict[name]=osorted;
		}else	pdict[name] = o;
	}

	assertion(playerNames[0] == me, `_addTable: owner should be ${me} and first in ${playerNames.join(',')}`);
	//console.log('pdict', pdict)

	console.log('creating table with',pdict); //das geht

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

function getGameOption(prop) { return lookup(Clientdata, ['table', 'options', prop]); }
function getGameProp(prop) { return Serverdata.config.games[Clientdata.table.game][prop]; }
function getPlayerProp(prop) { let pl = Clientdata.table.fen.players[getUname()]; return pl[prop]; }
function getPlayersWithMaxScore(fen) {
	let list = dict2list(fen.players, 'name');
	list = sortByDescending(list, 'score');
	maxlist = arrTakeWhile(list, x => x.score == list[0].score);
	return maxlist.map(x => x.name);
}
function getPlaymode(idOrTable, name) {
	if (isDict(idOrTable)) {
		let table = idOrTable;
		return isdef(table.fen) ? table.fen.players[name].playmode : 'no fen';
	} else if (Clientdata.table) {
		return Clientdata.table.id == idOrTable ? Clientdata.table.fen.players[name].playmode : 'wrong table';
	} else return 'NO table!';
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
function mExists(d) { return isdef(toElem(d)); }
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
async function mSleep(ms = 1000) {
	return new Promise(
		(res, rej) => {
			if (ms > 10000) { ms = 10000; }
			if (isdef(TO.SLEEPTIMEOUT)) clearTimeout(TO.SLEEPTIMEOUT);
			TO.SLEEPTIMEOUT = setTimeout(res, ms);
		});
}
async function onclickBot() {
	let name = getUname();
	let table = Clientdata.table;
	let plmode = table.fen.players[name].playmode;
	if (plmode == 'bot') return;
	let id = table.id;
	let overrideList = [];
	overrideList.push({ keys: ['fen', 'players', name, 'playmode'], val: 'bot' });
	let res = await sendMergeTable({ id, name, overrideList });
	//await mPostRoute('postPlayer', { id, name, playmode: 'bot' });
}
async function onclickHuman() {
	let name = getUname();
	let table = Clientdata.table;
	let plmode = table.fen.players[name].playmode;
	if (plmode == 'human') return;
	let id = table.id;
	let overrideList = [];
	overrideList.push({ keys: ['fen', 'players', name, 'playmode'], val: 'human' });
	let res = await sendMergeTable({ id, name, overrideList });
}
async function onclickJoinTable(id) {
	//console.log(getUname(),'clicked join',id);
	let table = Serverdata.tables.find(x => x.id == id);
	let me = getUname();
	assertion(table.status == 'open', 'too late to join! game has already started!')
	assertion(!table.playerNames.includes(me), `${me} already joined!!!`);
	table.players[me] = createGamePlayer(me, table.game);
	// console.log('created', jsCopy(table.players[me]));
	table.playerNames.push(me);
	let res = await mPostRoute('postTable', { id, players: table.players, playerNames: table.playerNames });
	// console.log('table', table.players)
	// console.log('res', res);
}
async function onclickLeaveTable(id) {
	//console.log(getUname(),'clicked leave',id);
	let table = Serverdata.tables.find(x => x.id == id);
	let me = getUname();
	assertion(table.status == 'open', 'too late to leave! game has already started!')
	assertion(table.playerNames.includes(me), `${me} NOT in joined players!!!!`);
	//console.log('players',table.players);
	delete table.players[me];
	removeInPlace(table.playerNames, me);
	let res = await mPostRoute('postTable', { id, players: table.players, playerNames: table.playerNames });
	//console.log('res', res);
}
async function onclickOpenToJoinGame() {
	let options = collectOptions();
	let players = collectPlayers();
	mRemove('dGameMenu');
	//console.log('onclickOpenToJoinGame: players', players)
	let t = createOpenTable(DA.gamename, players, options);
	let res = await mPostRoute('postTable', t);
}
async function onclickStartGame() {
	//console.log('_____ onclickStartGame')
	await collectFromPrevious(DA.gamename);
	let options = collectOptions(); //console.log(options)
	let players = collectPlayers();

	await startGame(DA.gamename, players, options);
}
async function onclickStartTable(id) {
	//console.log('_____ onclickStartTable')
	let table = Serverdata.tables.find(x => x.id == id); assertion(isdef(table), `table with id ${id} not in Serverdata!`);
	table = setTableToStarted(table);
	let res = await mPostRoute('postTable', table);
	//console.log('res', res);
}
async function onclickTable(id) {
	//console.log('_____ onclickTable')
	await showTable(id)
}
function openGameMenuFor(gamename) { clickOnElemWithAttr('gamename', gamename); }
function showGameover(table) {
	let winners = table.winners;
	let msg = winners.length > 1 ? `GAME OVER - The winners are ${winners.join(', ')}!!!` : `GAME OVER - The winner is ${winners[0]}!!!`;
	let d = mBy('ribbon'); if (isdef(d)) d.remove();
	let bg = `linear-gradient(270deg, #fffffd, #00000080)`
	d = mDom(dTitle, { bg, mabottom: 10, align: 'center', padding: 10, fz: 40, w100: true }, { html: msg, id: 'ribbon' });
}

async function startGame(gamename, players, options) {
	//console.log('startGame: players',players)
	let table = createOpenTable(gamename, players, options);

	table = setTableToStarted(table); //fen is created here!!!!
	let res = await mPostRoute('postTable', table);

}









