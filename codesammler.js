
//#region integrate 18.mai 24 baui.js


//#region bau3, bau4

function isSameTableOpen(id){return T && T.id == id;}
async function onsockMerged(x) {
	if (!isSameTableOpen(x.id)) return;
	await showTable(x);
}
async function onsockTable(x) {
	let [msg, id, turn, isNew] = [x.msg, x.id, x.turn, x.isNew];
	let menu = getMenu();
	let me = getUname();
	if (turn.includes(me) && menu == 'play') {Tid = id;await switchToMainMenu('table');}
	else if (menu == 'table') await showTable(id);
	else if (menu == 'play') await showTables();
}
async function onsockTables(x) { //passiert nur bei deleteTable!
	let menu = getMenu();
	if (menu == 'play') await showTables('onsockTables');
	else if (menu == 'table') {
		assertion(isdef(T),"menu table but no table!!!")
		let id = T.id;
		let exists = x.find(t => t.id == id);
		if (nundef(exists)) {Tid=T=null; await switchToMenu(UI.nav, 'play');}
	}
}
async function onsockPending(id) { 
	if (!isSameTableOpen(id)) return;
	await showTable(id);
}
async function sendMergeTable(o, cond = 'merge') {
	if (nundef(o)) {
		let table = Cliendata.table;
		let name = getUname();
		let id = table.id;
		o = { name, id, table };
	} else if (nundef(o.name)) {
		let table = o;
		let name = getUname();
		let id = table.id;
		o = { name, id, table };
	}
	let table = await mPostRoute(`${cond}Table`, o);
	if (!isDict(table)) { console.log('from server', table); } //INVALID!!!
	else await showTable(table);
}
async function sendRaceError(table, name, errors = 1) {
	let data = {
		id: table.id,
		name,
		errors,
		olist: [
			{ keys: ['players', name, 'score'], val: table.players[name].score - errors },
			{ keys: ['players', name, 'errors'], val: valf(table.players[name].errors, 0) + errors }
		]
	}
	let res = await sendMergeTable(data, 'race');
}
async function sendRaceStepScore(table, name, score = 1, olist = []) {
	let step = table.step + 1;
	olist.push({ keys: ['step'], val: step });
	olist.push({ keys: ['players', name, 'score'], val: table.players[name].score + score });
	let data = { id: table.id, name, step, olist };
	let res = await sendMergeTable(data, 'race');
}

async function onclickTable(id) {
	Tid = id;
	await switchToMainMenu('table');
	//await showTable(id);
}
async function onclickTableMenu() {
	let id = getTid();
	if (nundef(id)){
		let me = getUname();
		let table = Serverdata.tables.find(x => x.status == 'started' && x.turn.includes(me));
		if (nundef(table)) table = Serverdata.tables.find(x => x.status == 'started' && x.playerNames.includes(me));
		if (nundef(table)) table = Serverdata.tables.find(x => x.status != 'open' && x.playerNames.includes(me));
		if (nundef(table)) table = Serverdata.tables.find(x => x.status != 'open');
		if (isdef(table)) id=table.id;
	}
  //console.log('id',id)
	if (isdef(id)) {Tid=null;await showTable(id); } else await switchToMainMenu('play');
}
async function switchToMainMenu(name) { return await switchToMenu(UI.nav, name); }

async function switchToMenu(menu, key) {
	menuCloseCurrent(menu);
	Menu = {key}; localStorage.setItem('menu',key);
	await menuOpen(menu, key);
}
async function switchToOtherUser() {
	let uname = await mGetRoute('otherUser', arguments);
	await switchToUser(uname);
}
async function switchToTables() { return await switchToMainMenu('play'); }

async function switchToUser(uname,menu) {
	if (!isEmpty(uname)) uname = normalizeString(uname);
	if (isEmpty(uname)) uname = 'guest';
	sockPostUserChange(U ? getUname() : '', uname); //das ist nur fuer die client id!
	U = await getUser(uname);
	localStorage.setItem('username', uname);
	iDiv(UI.user).innerHTML = uname;
	setTheme(U);
	menu = valf(menu,getMenu(),localStorage.getItem('menu'),'home');
  switchToMainMenu(menu);
}



//#endregion


//#region showTables NEW
async function showTables(from) {
	await updateTestButtonsLogin();
	let me = getUname();
	let tables = Serverdata.tables = await mGetRoute('tables');
	tables.map(x => x.prior = x.status == 'open' ? 0 : x.turn.includes(me) ? 1 : x.playerNames.includes(me) ? 2 : 3);
	sortBy(tables, 'prior');
	let dParent = mBy('dTableList');
	if (isdef(dParent)) { mClear(dParent); }
	else dParent = mDom('dMain', {}, { className: 'section', id: 'dTableList' });
	if (isEmpty(tables)) { mText('no active game tables', dParent); return []; }
	tables.map(x => x.game_friendly = capitalize(getGameFriendly(x.game)));
	mText(`<h2>game tables</h2>`, dParent, { maleft: 12 })
	let t = UI.tables = mDataTable(tables, dParent, null, ['friendly', 'game_friendly', 'playerNames'], 'tables', false);
	mTableCommandify(t.rowitems.filter(ri => ri.o.status != 'open'), {
		0: (item, val) => hFunc(val, 'onclickTable', item.o.id, item.id),
	});
	mTableStylify(t.rowitems.filter(ri => ri.o.status == 'open'), { 0: { fg: 'blue' }, });
	let d = iDiv(t);
	for (const ri of t.rowitems) {
		let r = iDiv(ri);
		let id = ri.o.id;
		if (ri.o.prior == 1) mDom(r, {}, { tag: 'td', html: getWaitingHtml(24) });
		if (ri.o.status == 'open') {
			let playerNames = ri.o.playerNames;
			if (playerNames.includes(me)) {
				if (ri.o.owner != me) {
					let h1 = hFunc('leave', 'onclickLeaveTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
				}
			} else {
				let h1 = hFunc('join', 'onclickJoinTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
			}
		}
		if (ri.o.owner != me) continue;
		let h = hFunc('delete', 'onclickDeleteTable', id); let c = mAppend(r, mCreate('td')); c.innerHTML = h;
		if (ri.o.status == 'open') { let h1 = hFunc('start', 'onclickStartTable', id); let c1 = mAppend(r, mCreate('td')); c1.innerHTML = h1; }
	}
}
function showGames(ms = 500) {
	let dParent = mBy('dGameList'); if (isdef(dParent)) { mClear(dParent); } else dParent = mDom('dMain', {}, { className: 'section', id: 'dGameList' });
	mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });
	let d = mDiv(dParent, { fg: 'white' }, 'game_menu'); mFlexWrap(d);
	let gamelist = 'accuse aristo bluff ferro nations spotit wise'; if (DA.TEST0) gamelist += ' a_game'; gamelist = toWords(gamelist);
	gamelist = ['button96']; //'button99','button98','button97','setgame']
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

//#endregion

//#region game menu
function allPlToPlayer(name){
	let allPl = DA.allPlayers[name];
	return jsCopyExceptKeys(allPl,['div','isSelected']);
}
function collectPlayers() {
	let players = {};
	for (const name of DA.playerList) {		players[name] = allPlToPlayer(name);}
	return players;
}
function createGamePlayer(name, gamename, opts = {}) {
	let pl = userToPlayer(name, gamename);
	copyKeys(opts, pl);
	return pl;
}
function createOpenTable(gamename, players, options) {
	let me = getUname();
	let playerNames = [me];
	assertion(me in players, "_createOpenTable without owner!!!!!")
	for (const name in players) { addIf(playerNames, name); }

	let table = {
		status: 'open',
		id: generateTableId(),
		fen: null,
		game: gamename,
		owner: playerNames[0],
		friendly: generateTableName(),
		players,
		playerNames: playerNames,
		options
	};
	return table;
}
function highlightPlayerItem(item) { mStyle(iDiv(item), { bg: getUserColor(item.name), fg: 'white', border: `white` }); }

async function saveDataFromPlayerOptionsUI(gamename) {
	let id = 'dPlayerOptions';
	let lastAllPl = DA.lastAllPlayerItem;
	let dold = mBy(id);
	if (isdef(dold)) { await saveAndUpdatePlayerOptions(lastAllPl, gamename); dold.remove(); }
}
async function saveAndUpdatePlayerOptions(allPl, gamename) {
	let name = allPl.name;
	let poss = getGamePlayerOptionsAsDict(gamename);
	if (nundef(poss)) return;

	let opts = {};
	for (const p in poss) { allPl[p] = getRadioValue(p); if (p != 'playmode') opts[p] = allPl[p]; }

	let id = 'dPlayerOptions'; mRemoveIfExists(id); //dont need UI anymore

	let oldOpts = valf(getUserOptionsForGame(name, gamename), {});

	let changed = false;
	for (const p in poss) {
		if (p == 'playmode') continue;
		if (oldOpts[p] != opts[p]) { changed = true; break; }
	}

	if (changed) {
		let games = valf(Serverdata.users[name].games, {});
		games[gamename] = opts;
		await postUserChange({ name, games })
	}
}
async function setPlayerPlaying(allPlItem, gamename) {
	let [name, da] = [allPlItem.name, allPlItem.div];
	addIf(DA.playerList, name);
	highlightPlayerItem(allPlItem);

	await saveDataFromPlayerOptionsUI(gamename);

	let id = 'dPlayerOptions';
	DA.lastAllPlayerItem = allPlItem;

	let poss = getGamePlayerOptions(gamename);
	if (nundef(poss)) return;

	//console.log('item', allPlItem)

	let dParent = mBy('dGameMenu');
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
			let userval = lookup(DA.allPlayers, [name, p]);
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
	mButtonX(d1, ev => saveAndUpdatePlayerOptions(allPlItem, gamename), 18, 3, 'dimgray');
}
async function showGameOptions(dParent, gamename) {
	let poss = getGameOptions(gamename);
	if (nundef(poss)) return;
	for (const p in poss) {
		let key = p;
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let legend = formatLegend(key);
			let fs = mRadioGroup(dParent, {}, `d_${key}`, legend);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
			measureFieldset(fs);
		}
	}
	let inpsolo = mBy(`i_gamemode_solo`);//console.log('HALLO',inpsolo)
	let inpmulti = mBy(`i_gamemode_multi`);
	if (isdef(inpsolo)) inpsolo.onclick = setPlayersToSolo;
	if (isdef(inpmulti)) inpmulti.onclick = setPlayersToMulti;
}
async function showGamePlayers(dParent, users) {
	let me = getUname();
	mStyle(dParent, { wrap: true });
	let userlist = ['amanda', 'felix', 'mimi'];
	for (const name in users) addIf(userlist, name);
	for (const name of userlist) {
		let d = mDom(dParent, { align: 'center', padding: 2, cursor: 'pointer', border: `transparent` });
		let img = showUserImage(name, d, 40);
		let label = mDom(d, { matop: -4, fz: 12, hline: 12 }, { html: name });
		d.setAttribute('username', name)
		d.onclick = onclickGameMenuPlayer;

		let item = userToPlayer(name, DA.gamename); item.div = d; item.isSelected = false;

		DA.allPlayers[name] = item;
	}
	await clickOnPlayer(me);
}
function userToPlayer(name, gamename, playmode = 'human') {
	//assumes Serverdata.users is up-to-date!!!
	let user = Serverdata.users[name];
	let pl = jsCopyExceptKeys(user, ['games']);
	let options = valf(getUserOptionsForGame(name, gamename), {});
	addKeys(options, pl);

	pl.playmode = playmode;

	//for all the player options in this game, if this user does not have the corresponding options,
	//copy the default value from game options	
	let poss = getGamePlayerOptions(gamename);
	//console.log('poss', poss);
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


//#endregion

function amIHuman(table){  return isPlayerHuman(table,getUname());}
function calcHeightLeftUnder(div) {
  let hwin = window.innerHeight;
  let r = getRect(div);
  let top = r.b; //console.log('top',top)
  let h = hwin - top;
  return h;
}
function get_waiting_html(sz = 30) { return `<img src="../assets/icons/active_player.gif" height="${sz}" style="margin:0px ${sz / 3}px" />`; }
function isPlayerHuman(table,name){return table.players[name].playmode != 'bot';}
function mFlexLine(d,startEndCenter='center'){mStyle(d,{display: 'flex','justify-content': startEndCenter,'align-items': 'center'});}
function mSwitch(dParent,styles={},opts={}) {
  addKeys({id:'dSwitch',val:''},opts);
  let inpid=`inp${opts.id}`
  let html = `
      <label class="switch">
        <input id='${inpid}' type="checkbox" ${opts.val}>
        <span class="slider round"></span>
      </label>
    `;
  opts.html=html
  let d=mDom(dParent,styles,opts);
  return {div:d,inp:mBy(inpid)};
}
async function onchangeBotSwitch(ev) {
  let elem = ev.target;
  assertion(T,"NO TABLE!!!!!!!!!!!!!!!")
  let name=getUname();
  let id = T.id;
  let playmode = (elem.checked) ? 'bot':'human';
  let olist = [{keys: ['players', name, 'playmode'], val: playmode}];
  let res=await mPostRoute(`olist`, {id,name,olist}); console.log(res)
}
async function resetUsers() {
  for (const name in Serverdata.users) {
    let uold = Serverdata.users[name];
    let unew = {};
    let list = ['name', 'key', 'color', 'bgImage', 'bgBlend', 'bgRepeat', 'bgSize'];
    for (const s of list) unew[s] = uold[s];
    //let unew = {name,color:uold.color,key:uold.key};
    await postUserChange(unew, true);
  }
  console.log(Serverdata.users);
}
//#endregion





