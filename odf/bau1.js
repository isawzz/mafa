
async function deleteTable(id) {
	let res = await mPostRoute('deleteTable', { id });
	console.log('res', res, Serverdata.tables)
}
function generateTableName(n) {
	let existing = Serverdata.tables.map(x => x.friendly);
	while (true) {
		let cap = rChoose(M.capital);
		let parts = cap.split(' ');
		if (parts.length == 2) cap = stringBefore(cap, ' '); else cap = stringBefore(cap, '-');
		cap = cap.trim();
		let s = (n == 2 ? 'duel of ' : rChoose(['battle of ', 'war of '])) + cap;
		if (!existing.includes(s)) return s;
	}
}
function onclickGameMenuItem(ev) {
	let gamename = evToAttr(ev, 'gamename');
	//stop_game();
	showGameOptionsMenu(gamename);
}
function showGameOptions(dParent, game) {
	mRemoveChildrenFromIndex(dParent, 2);
	let poss = Serverdata.config.games[game].options;
	if (nundef(poss)) return;
	for (const p in poss) {
		let key = p;
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let fs = mRadioGroup(dParent, {}, `d_${key}`, key);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
			measure_fieldset(fs);
		}
	}
}
function showGameOptionsMenu(gamename) {
	//let dMenu = mBy('dMenu'); iClear(dMenu);
	let dMenu = mBy('dOptionsMenu'); if (isdef(dMenu)) { mClear(dMenu); } else dMenu = mDom('dMain', {}, { className: 'section', id: 'dOptionsMenu' });
	mText(`<h2>game options</h2>`, dMenu, { maleft: 12 });
	// show_standard_title(dMenu, 'Game Options');
	let d = mDiv(dMenu, { align: 'center' }, 'fMenuInput');
	let dOptions = mDiv(d, {}, 'dMenuInput'); mCenterFlex(dOptions);
	let dButtons = mDiv(d, { display: 'flex', justify: 'center', w: '100%' }, 'dMenuButtons');
	DA.playerlist = null;
	showGameOptions(dOptions, gamename);
	let astart = maButton('Start', start_game, dButtons);
	let acancel = maButton('Cancel', ()=>mClear(dMenu), dButtons);
}
function showGames(ms = 500) {
	//let dParent = mBy('dGames');mClear(dParent);
	let dParent = mBy('dGameList'); if (isdef(dParent)) { mClear(dParent); } else dParent = mDom('dMain', {}, { className: 'section', id: 'dGameList' });

	mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });
	let d = mDiv(dParent, { fg: 'white', animation: 'appear 1s ease both' }, 'game_menu'); mFlexWrap(d);

	let gamelist = 'accuse aristo bluff ferro nations spotit wise'; if (DA.TEST0) gamelist += ' a_game'; gamelist = toWords(gamelist);
	gamelist = dict2list(Serverdata.config.games, 'key'); gamelist = sortBy(gamelist, 'friendly').map(x => x.key);
	console.log('gamelist', gamelist)


	for (const gname of gamelist) {
		let g = Serverdata.config.games[gname];
		let [sym, bg, color, id] = [M.superdi[g.logo], g.color, null, getUID()];
		let d1 = mDiv(d, { cursor: 'pointer', rounding: 10, margin: 10, padding: 0, patop: 10, w: 140, height: 100, bg: bg, position: 'relative' }, g.id);
		d1.setAttribute('gamename', gname);
		d1.onclick = onclickGameMenuItem;
		mCenterFlex(d1);

		let o = M.superdi[g.logo];
		let el = mDom(d1, { matop: 0, mabottom: 6, fz: 65, hline: 65, family: 'emoNoto', fg: 'white', display: 'inline-block' }, { html: o.text });

		//showImage(g.logo,d1,{bg:'transparent',fg:'orange',hline:100},true); //mDiv(d1, { fz: 50, family: sym.family, 'line-height': 55 }, null, sym.text);
		mLinebreak(d1);
		mDiv(d1, { fz: 18, align: 'center' }, null, g.friendly);
	}
}
async function showTables() {
	Clientdata.table = null;
	Serverdata.tables = tables = await mGetRoute('tables');
	console.log('tables', tables);
	tables.map(x => x.prior = x.turn.includes(U.name) ? 1 : x.players.includes(U.name) ? 2 : 3);
	sortBy(tables, 'prior');

	let dParent = mBy('dTableList');
	if (isdef(dParent)) { mClear(dParent); }
	else dParent = mDom('dMain', {}, { className: 'section', id: 'dTableList' });

	if (isEmpty(tables)) { mText('no active game tables', dParent); return []; }
	tables.map(x => x.game_friendly = capitalize(x.game));
	mText(`<h2>game tables</h2>`, dParent, { maleft: 12 })
	let t = mDataTable(tables, dParent, null, ['friendly', 'game_friendly', 'players'], 'tables', false);
	mTableCommandify(t.rowitems, {
		0: (item, val) => hFunc(val, 'onclickTable', item.o.id, item.id),
	});
	let d = iDiv(t);
	for (const ri of t.rowitems) {
		let r = iDiv(ri);
		//console.log('ri',ri)
		if (ri.o.prior == 1) mDom(r, {}, { tag: 'td', html: get_waiting_html(24) }); //'my turn!'});
		let h = hFunc('delete', 'deleteTable', ri.o.id);
		c = mAppend(r, mCreate('td'));
		c.innerHTML = h;
	}
}













