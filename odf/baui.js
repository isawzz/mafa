
function show_game_menu(gamename) {
	stopgame();
	show('dMenu'); mClear('dMenu');
	let dMenu = mBy('dMenu');
	let dForm = mDiv(dMenu, { align: 'center' }, 'fMenuInput');
	let dInputs = mDiv(dForm, {}, 'dMenuInput');
	let dButtons = mDiv(dForm, {}, 'dMenuButtons');
	let bstart = mButton('start', () => {
		let players = DA.playerlist.map(x => ({ name: x.uname, playmode: x.playmode }));
		let game = gamename;
		let options = collect_game_specific_options(game);
		for (const pl of players) { if (isEmpty(pl.strategy)) pl.strategy = valf(options.strategy, 'random'); }
		startgame(game, players, options); hide('dMenu');
	}, dButtons, {}, ['button', 'enabled']);
	let bcancel = mButton('cancel', () => { hide('dMenu'); }, dButtons, {}, ['button', 'enabled']);
	let bclear = mButton('clear players', clearPlayers, dButtons, {}, ['button', 'enabled']);
	let d = dInputs; mClear(d); mCenterFlex(d);
	let dPlayers = mDiv(d, { gap: 6 });
	mCenterFlex(dPlayers);
	DA.playerlist = [];
	DA.allPlayers = [];
	DA.lastName = null;
	let params = [gamename, DA.playerlist];
	let funcs = [style_not_playing, style_playing_as_human, style_playing_as_bot];
	for (const u of Serverdata.users) {
		let d = get_user_pic_and_name(u.name, dPlayers, 40);
		mStyle(d, { w: 60, cursor: 'pointer'})
		//mStyle(d, { cursor: 'pointer' })
		let item = { uname: u.name, div: d, state: 0, strategy: '', isSelected: false };
		DA.allPlayers.push(item);
		if (is_loggedin(u.name)) { toggle_select(item, funcs, gamename, DA.playerlist); DA.lastName = U.name; }
		else d.onclick = ev => {
			if (ev.shiftKey) {
				let list = Serverdata.users;
				if (nundef(DA.lastName)) DA.lastName = list[0].name;
				let x1 = list.find(x => x.name == DA.lastName);
				let i1 = list.indexOf(x1);
				let x2 = list.find(x => x.name == item.uname);
				let i2 = list.indexOf(x2);
				if (i1 == i2) return;
				if (i1 > i2) [i1, i2] = [i2, i1];
				assertion(i1 < i2, "NOT IN CORRECT ORDER!!!!!")
				for (let i = i1; i <= i2; i++) {
					let xitem = DA.allPlayers[i];
					if (xitem.isSelected) continue;
					style_playing_as_human(xitem, gamename, DA.playerlist);
				}
				DA.lastName = item.uname;
			} else {
				toggle_select(item, funcs, gamename, DA.playerlist);
				if (item.isSelected) DA.lastName = item.uname;
			}
		}
	}
	mDiv(d, { w: '100%', fz: 11, fg: '#444' }, null, '(use SHIFT to multi-select players)'); //'SHIFT<br>multiselect');
	mLinebreak(d, 1);
	show_game_options(d, gamename);
	mFall('dMenu');
}
function show_game_options(dParent, game) {
	mRemoveChildrenFromIndex(dParent, 2);
	let poss = Config.games[game].options;
	if (nundef(poss)) return;
	for (const p in poss) {
		let key = p;
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(','); // make a list 
			if (list.length <= 1) continue;
			let fs = mRadioGroup(dParent, {}, `d_${key}`, key);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
			measure_fieldset(fs);
		}
	}
}
function show_games(ms = 500) {
	let dParent = mBy('dGames');
	mClear(dParent);
	mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });
	let d = mDiv(dParent, { fg: 'white', animation: 'appear 1s ease both' }, 'game_menu'); mFlexWrap(d);
	let gamelist = 'accuse aristo bluff wise spotit ferro'; if (DA.TEST0) gamelist += ' a_game';
	for (const gname of toWords(gamelist)) {
		let g = Config.games[gname];
		let [sym, bg, color, id] = [Syms[g.logo], g.color, null, getUID()];
		let d1 = mDiv(d, { cursor: 'pointer', rounding: 10, margin: 10, padding: 0, patop: 15, wmin: 140, height: 90, bg: bg, position: 'relative' }, g.id);
		d1.setAttribute('gamename', gname);
		d1.onclick = onclick_game_menu_item;
		mCenterFlex(d1);
		mDiv(d1, { fz: 50, family: sym.family, 'line-height': 55 }, null, sym.text);
		mLinebreak(d1);
		mDiv(d1, { fz: 18, align: 'center' }, null, g.friendly);
	}
}

















