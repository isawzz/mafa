//change: 2 geteiltes showTable wieder zusammengegeben:
async function showTable(id) {
	//INVALID TABLES KOMMEN GARNICHT HIERHER!!!
	let me = getUname();
	let table = await mGetRoute('table', { id });
	//console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game];

	if (table.status == 'started' && isdef(table.pending)) {
		func.resolvePending(table); // deterministic!!! (table.pending)
		if (table.status == 'over') { mPostRoute('postTable', table); return; }
	}

	let items = tablePresentation(table, func);

	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }

	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);

	await updateTestButtonsPlayers(table); // right side buttons

	func.activate(table, items); // activate

}
function tablePresentation(table, func) {
	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2>${table.friendly} (${table.step})</h2>`; // title

	//let tableSize = calcHeightLeftUnder('dExtra') - 40; //height visible in browser
	d = mDom('dMain'); mCenterFlex(d); //console.log(getRect('dMain'))

	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction

	mDom(d, {}, { id: 'dStats' }); mLinebreak(d); func.stats(table); // player stats

	let minTableSize = 400; // present
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);

	return items;
}

//change: remove TESTING clause
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


//change: remove 0.clientid = client.id
function emitToPlayers(namelist, msgtype, o) {
	for (const name of namelist) {
		let idlist = byUsername[name]; //console.log('name', name, '\nid', idlist);
		if (nundef(idlist)) continue;
		// console.log('ids for',name,idlist)
		for (const id of idlist) {
			let client = clients[id]; //console.log(name, client.id); //isdef(client),Object.keys(client))
			o.clientid = client.id;
			if (client) client.emit(msgtype, o);
		}
	}
}

//change: remove 'shields' list
function mShield(dParent, styles = {}, id = null, classnames = null, hideonclick = false) {
	addKeys({ bg: '#00000020' },styles);
	dParent = toElem(dParent);
	let d = mDiv(dParent, styles, id, classnames);
	lookupAddIfToList(DA, ['shields'], d);
	mIfNotRelative(dParent);
	mStyle(d, { position: 'absolute', left: 0, top: 0, w: '100%', h: '100%' });
	if (hideonclick) d.onclick = ev => { evNoBubble(ev); d.remove(); };
	else d.onclick = ev => { evNoBubble(ev); };
	mClass(d, 'topmost');
	return d;
}


//#region tableLayout
function tableLayout(dParent) {
  clearElement(dParent);
  let d = mGrid(1, 2, dParent);
  let [dMiddle, dRechts] = [mDom(d), mDom(d)];
  let dOben = mDom(dMiddle, { mabottom: 10 }, { id: 'dOben' });
  let dOpenTable = mDom(dMiddle, {}, { id: 'dOpenTable' });
  return [dOben, dOpenTable, dRechts];
}
function tableLayoutMR(dParent) {
  clearElement(dParent);
  let d = mGrid(1, 2, dParent);
  let [dMiddle, dRechts] = [mDom(d), mDom(d)];
  let dOben = mDom(dMiddle, { mabottom: 10 }, { id: 'dOben' });
  let dOpenTable = mDom(dMiddle, {}, { id: 'dOpenTable' });
  return [dOben, dOpenTable, dRechts];
}
function tableLayoutMR(dParent) {
  clearElement(dParent);
  let d = mGrid(1, 2, dParent);
  //let d=mDom(dParent,{w100:true,display:'grid'});
  //d.style.gridTemplateColumns = 2;
  let [dMiddle, dRechts] = [mDom(d), mDom(d)];
  //mCenterFlex(dMiddle, false);
  let dOben = mDom(dMiddle, { mabottom: 10 }, { id: 'dOben' });
  let dOpenTable = mDom(dMiddle, {}, { id: 'dOpenTable' });
  return [dOben, dOpenTable, dRechts];
}

//endregion

//#region button96
function button96() {
  function setup(table) {
    let fen = {};
    fen.players = {};
    for (const name in table.players) {
      let pl = fen.players[name] = table.players[name];
      pl.color = getUserColor(name)
      pl.score = 0;
    }
    fen.number = 0;
    fen.plorder = jsCopy(table.playerNames);
    fen.turn = jsCopy(table.playerNames);
    delete table.players;
    return fen;
  }
  function checkGameover(table) {
    let score_sum = calcScoreSum(table);
    //console.log('___check score sum',score_sum);
    if (score_sum >= 5) {
      table.winners = getPlayersWithMaxScore(table.fen);
      table.status = 'over';
      return true;
    } else return false;
    //return table.playerNames.some(x => x.score == table.options.winning_score);
  }
  function present(T) {
    // //assumes that me is player at this table!!!
    // //assertion(calcScoreSum(table) == table.fen.number, "SCORE MISMATCH!!!! present")
    // //mClear(dParent);
    // let dInstruction = mDom(dParent,{className:'instruction'},{html:`Waiting for ${table.fen.turn.join(', ')}`});
    // let dStats = mDom(dParent);
    // let div = mDom(dParent, { margin: 12, align: 'center' }, { id: 'dGameDiv' }); //for shield! 

    // let bYes = mDom(div, { fz: 100, wmin: 200, margin:10, className: 'button' }, { tag: 'button', html: `Step:${table.step}` });
    // let bNo = mDom(div, { fz: 100, wmin: 200, margin:10,className: 'button' }, { tag: 'button', html: `Error!` });

    // if (nundef(name)) name=getUname(); //eingeloggter user perspective is default!

    // return { div, bYes, bNo, dInstruction, dStats, table, name };
  }
  function showStats(T) { button96Stats(T); }
  async function activate(T) {
    dInstruction.innerHTML = "click one of the buttons!"
    T.bYes.onclick = () => button96OnclickYes(T, true);
    T.bNo.onclick = () => button96OnclickNo(T, true);
  }
  async function botMove(T) {
    TO.button = setTimeout(() => button96BotMove(T), rChoose([1000, 2000, 3000]));
  }
  return { setup, activate, checkGameover, present, showStats, botMove };
}
function button96Stats(T) {
  let [fen, name, dStats] = [T.table.fen, T.name, T.dStats];
  let layout = 'rowflex';
  let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
  let player_stat_items = uiTypePlayerStats(fen, name, dStats, layout, style)
  for (const plname in fen.players) {
    let pl = fen.players[plname];
    let item = player_stat_items[plname];
    if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
    let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
    playerStatCount('star', pl.score, d);
  }
}
async function button96OnclickYes(T, direct = false) {
  let b = T.bYes;
  if (direct) clearEvents();
  disableUI(); //disableButton(b);

  await sendRaceStepScore(T.table, T.name);
}
async function button96OnclickNo(T, direct = false) {
  let b = T.bNo;
  if (direct) clearEvents();
  disableUI(); //disableButton(b);

  await sendRaceError(T.table, T.name);
}
async function button96BotMove(T) {
  if (coin(80)) await button96OnclickYes(T); else await button96OnclickNo(T);
}
//#endregion

//change: einfach switchToUser inlined bei updateTestButtons...
async function testOnclickCaption(ev) {
	let name = ev.target.innerHTML;
	let b = UI[getButtonCaptionName(name)];
	for (const name of getButtonCaptionNames(Clientdata.table)) {
		let b = UI[getButtonCaptionName(name)];
		if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
	}
	mStyle(UI[getButtonCaptionName(x)], { bg: 'red', fg: 'white' });
	await switchToUser(x);
}

//change: guest is like any other user
async function switchToUser(uname) {
	if (!isEmpty(uname)) uname = normalizeString(uname);
	if (isEmpty(uname)) uname = 'guest';
	sockPostUserChange(U ? getUname() : '', uname); //das ist nur fuer die client id!
	U = await getUser(uname);
	Clientdata.curUser = uname;
	localStorage.setItem('username', uname);
	iDiv(UI.user).innerHTML = uname;
	setTheme(U);
	if (uname == 'guest') {
		await switchToMenu(UI.nav, 'home');
		menuDisable(UI.nav, 'plan');
	} else {
		menuEnable(UI.nav, 'plan');
		let t = Clientdata.table;
		let cur = Clientdata.curMenu;
		if (cur == 'play' && isdef(t) && t.playerNames.includes(uname) && t.status == 'started') await showTable(t.id);
		else await switchToMenu(UI.nav, valf(cur, 'home'));
	}
}
//change: simplified
function testUpdateTestButtons(dParent, styles = {}) {
	let table = Clientdata.table;
	dParent = toElem(dParent);
	let id = 'dTestButtons'; mRemoveIfExists(id);
	mIfNotRelative(dParent);
	if (dParent.id == 'dExtra') mStyle(dParent,{hmin:26});
	addKeys({ display: 'flex', gap: 10, vpadding: 2, position: 'absolute', right: 8, top: 0 }, styles);
	let dBotHuman = mDom(dParent, styles, { id });
	let me = getUname();
	let names = isdef(table) ? [] : ['amanda', 'felix', 'lauren', 'mimi', 'gul'];
	for (const name of names) {
		let idname = getButtonCaptionName(name);
		let b = UI[idname] = mButton(name, testOnclickCaption, dBotHuman);
		if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
	}
	if (nundef(table)) return dBotHuman;;
	let playmode = getPlaymode(table, me);
	if (nundef(playmode)) return dBotHuman;;
	let [playmodeKey, sz, bg, matop, patop] = [playmode == 'human' ? 'skullcap' : 'robot', 25, 'transparent', 2, 0];
	showImage(playmodeKey, dBotHuman, { fg: 'white', sz, round: true, bg, matop, patop });// , 'line-height': sz });
	let caption = `Make me ${playmode == 'bot' ? 'human' : 'bot'}`;
	UI.bPlaymode = mButton(caption, testOnclickPlaymode, dBotHuman, { w: 130 });
	return dBotHuman;
}
