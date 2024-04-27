//region von ode/closure.js

function clearMain() { DA.counter = 0; clearEvents(); mClear('dMain'); mClear('dTitle'); }
function defaultGameFunc() {
  function setup(table) { let fen = { players: table.players, turn: [table.owner] }; delete table.players; }
  async function activate(table) { console.log('activate for', getUname()) }
  function checkGameover(table) { return false; }
  async function present(table) { mClear('dMain'); } //showMessage(`BINGO!!! ${table.friendly} view ${name}: NOT IMPLEMENTED!!!!!`,1000); } 
  async function hybridMove(table) { console.log('hybrid moves for', getUname()) }
  async function botMove(table) { console.log('robot moves for', getUname()) }
  async function stepComplete(table, o) { console.log(`integrate if step complete for ${table.friendly}`); }
  return { setup, activate, checkGameover, present, hybridMove, botMove, stepComplete };
}
function INTERRUPT() {
  DA.merged = getNow(); 
  if (isdef(TO.SLEEPTIMEOUT)) { clearEvents(); } 
  DA.Tprev = T; T = null;
  delete DA.stopAutobot;
}
async function prelims() {
  let t1 = performance.now();
  Serverdata = await mGetRoute('session'); //session ist: users,config,events
  let t2 = performance.now();
  await loadAssets();
  let t4 = performance.now();
  sockInit();
  UI.nav = showNavbar();
  UI.user = mCommand(UI.nav.r, 'user', null, onclickUser); iDiv(UI.user).classList.add('activeLink');
  dTitle = mBy('dTitle');
  await switchToUser(localStorage.getItem('username'));
  let t5 = performance.now();
  window.onkeydown = keyDownHandler;
  window.onkeyup = keyUpHandler;
  DA.funcs = { setgame: setgame(), button: button() }; //implemented games!
  for (const gname in Serverdata.config.games) {
    if (isdef(DA.funcs[gname])) continue;
    DA.funcs[gname] = defaultGameFunc();
  }
  DA.counter = 0;
}
async function sendMergeTable(o) { 
  if (nundef(o)) {
    let table = Cliendata.table;
    let name = getUname();
    let id = table.id;
    o={name,id,table};
  }else if (nundef(o.name)){
    let table = o;
    let name = getUname();
    let id = table.id;
    o={name,id,table};
  }
  let table =  await mPostRoute('mergeTable', o); 
  await showTable(table);
}
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
    fen.turn = jsCopy(table.playerNames);
    delete table.players;
    return fen;
  }
  async function activate(table, items) { await setActivate(items); }
  function checkGameover(table) {
    return table.playerNames.some(x => x.score == table.options.winning_score);
  }
  async function present(dParent, table) { return await setPresent(dParent, table); }
  async function hybridMove(table) { await setHybridMove(table); }
  async function botMove(table, items, name) { await setBotMove(table, items, name); }
  async function stepComplete(table, o) { }
  return { setup, activate, checkGameover, present, hybridMove, botMove, stepComplete };
}
async function showTable(table) {
  INTERRUPT(); 
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

//#region ode bau3 after integrate
async function collectPlayerOptions(pl, gamename) {
  let name = pl.name;
  let options = valf(pl[gamename], {});
  let poss = Serverdata.config.games[gamename].ploptions;
  if (nundef(poss)) return options;
  for (const p in poss) {
    options[p] = getRadioValue(p);
  }
  pl[gamename] = options;
  let id = 'dPlayerOptions'; mRemoveIfExists(id);//mRemove(d);
  let uold = Serverdata.users[pl.name];
  let unew = {};
  for (const k in pl) {
    if (['div', 'isSelected', 'playmode'].includes(k)) continue;
    unew[k] = jsCopy(pl[k]);
  }
  for (const k in unew[gamename]) {
    if (lookup(uold, [gamename, k]) != unew[gamename][k]) {
      let res = await postUserChange(unew);
      copyKeys(res,DA.allPlayers[name]);
      return;
    }
  }
}
function defaultGameFunc() {
  function setup(table) { let fen = { players: table.players, turn: [table.owner] }; delete table.players; }
  async function activate(table) { console.log('activate for', getUname()) }
  function checkGameover(table) { return false; }
  async function present(table) { mClear('dMain'); } //showMessage(`BINGO!!! ${table.friendly} view ${name}: NOT IMPLEMENTED!!!!!`,1000); } 
  async function hybridMove(table) { console.log('hybrid moves for', getUname()) }
  async function botMove(table) { console.log('robot moves for', getUname()) }
  async function stepComplete(table, o) { console.log(`integrate if step complete for ${table.friendly}`); }
  return { setup, activate, checkGameover, present, hybridMove, botMove, stepComplete };
}
function getRadioValue(prop) {
	let fs = mBy(`d_${prop}`);
  if (nundef(fs)) return null;
	let val = getCheckedRadios(fs)[0]; //console.log(p,val)
	return isNumber(val) ? Number(val) : val;
}
function setRadioValue(prop, val) {
	let input = mBy(`i_${prop}_${val}`);
  if (nundef(input)) return;
	input.checked = true;
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
      let userval = lookup(DA.allPlayers, [name, gamename, p]);
      //console.log('val',userval,DA.allPlayers[name])
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
function setPlayersToMulti() {
	for (const name in DA.allPlayers) {
		DA.allPlayers[name][DA.gamename].playmode = 'human';
		let el = document.querySelector(`div[username="${name}"]`);
		let img = el.getElementsByTagName('img')[0];
		mStyle(img, { round: true });
	}
	setRadioValue('playmode', 'human');
}
function setPlayersToSolo() {
	for (const name in DA.allPlayers) {
		if (name == getUname()) continue;
		DA.allPlayers[name][DA.gamename].playmode = 'bot';
		let el = document.querySelector(`div[username="${name}"]`);
		let img = el.getElementsByTagName('img')[0];
		mStyle(img, { rounding: 2 });
	}
	let popup = mBy('dPlayerOptions');
	if (isdef(popup) && popup.firstChild.innerHTML.includes(getUname())) return;
	setRadioValue('playmode', 'bot');
}

//#endregion

function mGridFromAreas(d, m, cols, rows, cellstyles = {}) {
  //m is a matrix, eg. ['A B C','A D E']
  let gta = '';
  let words = [];
  for (const line of m) {
    gta = gta + `'${line}' `;
    let warr = toWords(line);
    for (const w of warr) if (!words.includes(w)) words.push(w);
  }
  let dParent = mDom100(d, { display: 'grid', 'grid-template-areas': gta });
  dParent.style.gridTemplateColumns = cols;
  dParent.style.gridTemplateRows = rows;
  for (const w of words) {
    let style = copyKeys({ 'grid-area': w, bg: rColor(50) }, cellstyles);
    let cell = window[w] = mDom(dParent, style, { id: w });
  }
  return dParent;
}

//#region 25.4.24 V
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





//#region 21.4.24 bot move trial 1
function checkInterrupt(items) { return isdef(T) && items[0] == T.items[0] && isdef(DA.Tprev) && T.items[0] == DA.Tprev.items[0]; } //DA.counterBot > DA.counter + 1; }
function INTERRUPT() {
	DA.merged = get_now(); //console.log('ts', DA.merged);
	if (isdef(TO.SLEEPTIMEOUT)) { clearTimeout(TO.SLEEPTIMEOUT); TO.SLEEPTIMEOUT = null; }
	DA.Tprev = T; T = null;
}
async function setBotMove(table) {
	try {
		let items=T.items;
		//console.log('bot move:', DA.counterBot, DA.inAutomove);
		if (isNaN(DA.counterBot) || nundef(DA.counterBot)) DA.counterBot = DA.counter;
		if (DA.counterBot < DA.counter) { DA.counterBot = DA.counter; DA.inAutomove = false; }

		[T.bNoSet, T.bHint] = setShowButtons();
		mShield(dOpenTable, { bg: '#00000010' });
		// await setAutoMove(table);
		//if (DA.inAutomove) {DA.inAutomove = false; return;}
		while (DA.inAutomove) { await mSleep(10); }
		DA.inAutomove = true;
		DA.counterBot += 1; //=DA.counter; console.log('==>',DA.counter,DA.counterBot);
		await mSleep(2000); if (checkInterrupt(items)) { console.log('!sleep 1'); DA.inAutomove = false; return; }
		T.sets = setFindAllSets(items);
		if (isEmpty(T.sets)) await setOnclickNoSet();
		else {
			let list = rChoose(T.sets); //console.log('set', list);
			await setOnclickCard(list[0], items);
			await mSleep(2000); if (checkInterrupt(items)) { console.log('!!sleep 2'); DA.inAutomove = false; return; }
			await setOnclickCard(list[1], items);
			await mSleep(2000); if (checkInterrupt(items)) { console.log('!!!sleep 3'); DA.inAutomove = false; return; }
			await setOnclickCard(list[2], items);

		}
		console.log('* END OF AUTOMOVE *');
		DA.inAutomove = false;
	} catch { console.log('please reload!') }

}
//#endregion
//#region 21.4.24 bot move trial 0
function checkInterrupt() { return DA.counterBot > DA.counter + 1; }
async function setAutoMove(table) {
	//if (DA.inAutomove) {DA.inAutomove = false; return;}
	while (DA.inAutomove) { await mSleep(10); }
	DA.inAutomove = true;
	DA.counterBot += 1; //=DA.counter; console.log('==>',DA.counter,DA.counterBot);
	await mSleep(2000); if (checkInterrupt()) { console.log('!sleep 1');DA.inAutomove = false; return; }
	T.sets = setFindAllSets(T.items);
	if (isEmpty(T.sets)) await setOnclickNoSet();
	else {
		let list = rChoose(T.sets); //console.log('set', list);
		await setOnclickCard(list[0], T.items);

		await mSleep(2000); if (checkInterrupt()) { console.log('!!sleep 2');DA.inAutomove = false; return; }
		await setOnclickCard(list[1], T.items);
		await mSleep(2000); if (checkInterrupt()) { console.log('!!!sleep 3');DA.inAutomove = false; return; }
		await setOnclickCard(list[2], T.items);

	}
	console.log('* END OF AUTOMOVE *');
	DA.inAutomove = false;
}
async function _setBotMove(table) {
	//console.log('bot move:', DA.counterBot, DA.inAutomove);
	if (isNaN(DA.counterBot) || nundef(DA.counterBot)) DA.counterBot = DA.counter;
	if (DA.counterBot < DA.counter) { DA.counterBot = DA.counter; DA.inAutomove = false; }

	[T.bNoSet,T.bHint] = setShowButtons();
	mShield(dOpenTable, { bg: '#00000010' });
	await setAutoMove(table);
}
async function setHybridMove(table) {
	[T.bNoSet,T.bHint] = setShowButtons();
	setActivateCards();
	await setAutoMove(table);
}
async function setGhostMove(table) {
	T.sets = setFindAllSets(T.items);

}
function setStopAutoHints(){
	//remove T.set
	T.noMoreHints = true;
}
//**************************** */
async function sendMyMove(move, type) {
  let name = getUname();
  let table = Clientdata.table;
  let id = table.id;
  let friendly = table.friendly;
  let step = table.step;
  let turn = table.fen.turn;
  //console.log('___sendMyMove',step,name); //type,move,turn)
  let res = await mPostRoute('move', { id, friendly, name, move, type, step, turn });
  //console.log('result',res)
  // sockPostMove(table, me, o);
}
async function sendMoveComplete(fen) {
  let name = getUname();
  let table = Clientdata.table;
  let id = table.id;
  let friendly = table.friendly;
  let step = table.step;
  let turn = fen.turn;
  //console.log('___sendMoveComplete',step,name); //type,move,turn)
  let res = await mPostRoute('moveComplete', { id, friendly, name, fen, step, turn });
  //console.log('result',res)
  // sockPostMove(table, me, o);
}
Socket.on('move', onsockReceiveMove);
async function onsockReceiveMove(o) {
  let [e, mlist] = [o.event, o.moves];
  console.log('___ onsockReceiveMove', e.step, e.name, e.ts, mlist); return;
  let [id, friendly, name, move, type, step, turn, ts] = [e.id, e.friendly, e.name, e.move, e.type, e.step, e.turn, e.ts];
  let table = Clientdata.table;
  if (!table || table.id != id) { console.log(`not playing at table ${id}`); return; }

  let func = DA.funcs[table.game];
  //console.log('...process',type,turn,friendly);
  //somebody moved but fen has not changed

  //checkIfStepComplete
  // if (type == 'r1'){

  // 	table.step=step;
  // 	//stepComplete
  // 	//console.log('game',table.game)
  // 	func.stepComplete(table,o)
  // }

}

//#endregion
//#region set timer
function formatDate3(d) { 
	if (nundef(d)) d = new Date(); 
	return d.toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " "); 
}

function setShowTimer(){	
	let d=mBy('dTimer'); 
	if (nundef(d)) d=mDom(dOpenTable,{},{id:'dTimer'});
	d.innerHTML = formatDate3();
}
function setRemoveTimer(){	let d=mBy('dTimer'); if (isdef(d)) d.remove();}
//#endregion
//#region lock
function setLock(){console.log('locked');DA.LOCK=true;}
function resetLock(){console.log('frei');DA.LOCK=false;}
function isLocked(){return DA.LOCK==true;}
async function waitForUnlocked(){
	while(isLocked()){
		console.log('.')
	}
	return;
}
//#endregion
//#region NEW!
function getActivePlayer(fen) { if (fen.playerNames.includes(U.name)) return U.name; else return fen.turn[0]; }
function _sendMyMove(key) {
  let name = getUname();
  let table = Clientdata.fen.id;
  sockPostMove(table, name, key);
}
async function switchToTable(id) {
  console.log('_switchToTable!!!',id)
  let res = await mGetRoute('table', { id });
  await showTable(res, getUname())
}
//#region games
function a_game() {
	function setup(table) {
		let fen = {};
		fen.players = {};
		for (const pl of table.players) {
			fen.players[pl.name] = pl;
		}
		fen.turn = jsCopy(table.playerNames); // alle zugleich dran
		return fen;
	}
	function checkGameover(table) { return false; }
	function present(table) { a_game_present(table); } 
	return { setup, checkGameover, present };
}
function a_game_present(table, name) {

	//was soll passieren?
	//erstmal clear page I guess
	mClear('dMain');
	let d = mDom('dMain', { margin: 10, bg: '#00000080' }); mCenterCenterFlex(d)
	mDom(d, { fz: 100, fg: 'white' }, { html: `we are playing ${getGameFriendly(table.game)}!!!!` })

}
//#endregion

//#region nat
function approx(n, goal, delta) { return Math.abs(n - goal) <= delta; }
function allDarkPoints(ctx, w, dims) {
	let [y, xmin, top, bot] = [dims.y, dims.xmin, dims.top, dims.bot];
	let xlist = [];
	let n = 243; xmin = 120; //y -= 5;
	for (let x = 0; x < w; x++) { if (isPixDark(ctx, x, y)) { xlist.push(x); } }
	//console.log('list', xlist);
	//xlist.map(x => { drawPix(ctx, x, y, 'red', 2) });
	let diffs = [];
	for (let i = 0; i < xlist.length - 1; i++) {
		if (xlist[i] < xmin) continue;
		// if (isLightBefore(ctx, xlist[i], y)) { console.log('YES!', xlist[i]) } else { console.log('NO', xlist[i]); continue; }
		if (!isLightBefore(ctx, xlist[i], y)) continue;
		for (let j = i + 1; j < xlist.length; j++) {
			let pix = xlist[j];
			// if (isLightAfter(ctx, pix, y)) { console.log('YES!', pix) } else { console.log('NO', pix); continue; }
			if (!isLightAfter(ctx, pix, y)) continue;
			let d = xlist[j] - xlist[i];
			diffs.push({ i: i, j: j, d: d })
			//console.log('d', xlist[i], xlist[j], d)
			if (d >= n - 2 && d <= n + 2) { //} 243){
				//console.log('X BINGO!!!!!!!!!!!!!!!!!!!', xlist[i], xlist[y], y)
				let doben = xlist[i] - xlist[i - 1]; console.log('doben=' + doben)
				let dunten = arrLast(xlist) - xlist[j]; console.log('dunten=' + dunten)

				let test90 = pixTest90(ctx, y, xlist[i] - top, xlist[j] + bot);
				rot = test90 ? 90 : -90;
				xstart = test90 ? xlist[i] - top : xlist[i] - bot;
				xend = test90 ? xlist[j] + bot : xlist[j] + top;

				drawPix(ctx, xlist[i], y, 'green')
				drawPix(ctx, xlist[j], y, 'green')
				return [xstart, xlist[i], xlist[j], xend, xlist, rot]
			}
		}
	}
	console.log('diffs', diffs)
	return [0, 0, w, w, xlist, 0];
}
function _calcBoundingBox(ctx,w,h,type){
	let [cgoal,clight,lighting]=type=='event'?['#6C4F64','#E7BB97',false]:['#59544E','#DBCEBE',true];

	let toplight = findRectSample(ctx, 20, w, 0, 0, clight, 4); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	//console.log('top edge missing', toplight);
	let bottomlight = findRectSample(ctx, 20, w, h - 5, h - 5, clight, 4, true); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	//console.log('bottom edge missing', bottomlight);
	let leftlight = findRectSample(ctx, 0, 0, 10, h, clight, 4); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	//console.log('left edge missing', leftlight);
	let rightlight = findRectSample(ctx, w-5, w-5, 20, h-15, clight, 4, true); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	//console.log('right edge missing', rightlight);

	let rect={};

	let [yoff1,yoff2,dyblank]=[0,20,lighting?20:0];
	let [xoff1,xoff2,dxblank]=[0,30,lighting?20:0];
	let top, bottom;
	if (toplight) {
		rect.top=0;
		//console.log('top:', 0)
		//if top edge is missing then bottom edge will be higher up!
		bottom = findEdgeVert(ctx, h-yoff2-dyblank-5, h - yoff1 -dyblank, w, cgoal, lighting); 
		//console.log('bottom',lighting,bottom,)
		bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.bottom=bottom[0].y; 
		//console.log('bottom', bottom[0].y, bottom.length)
	} else if (bottomlight) {
		rect.bottom=h;
		top = findEdgeVert(ctx, yoff1+dyblank, yoff2+dyblank, w, cgoal, lighting); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		//console.log('top', top[0].y, top.length)
		rect.top=top[0].y;
		//console.log('bottom', h);
	} else {
		top = findEdgeVert(ctx, yoff1, yoff2, w, cgoal, lighting); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		bottom = findEdgeVert(ctx, h-yoff2, h - yoff1, w, cgoal, lighting); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		// top = findTopEdge(ctx, w, h, cgoal, 0, lighting); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		// bottom = findBottomEdge(ctx, w, h, cgoal, h, lighting); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.top=top[0].y;
		rect.bottom=bottom[0].y; 
		//console.log('top', top[0].y, top.length)
		//console.log('bottom', bottom[0].y, bottom.length)
	}

	let left,right;
	if (leftlight) {
		rect.left=0;
		//console.log('left:', 0)
		//if top edge is missing then bottom edge will be higher up!
		// right = findRightEdge(ctx, w-10, h, cgoal, w-10, lighting); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		right = findEdgeHor(ctx, w-xoff2-dxblank, w - xoff1-dxblank, h, cgoal, lighting); 
		right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		//console.log('right', right[0].x, right.length)
		rect.right=right[0].x; 
	} else if (rightlight) {
		//left = findLeftEdge(ctx, w, h, cgoal, 10, lighting); 
		left = findEdgeHor(ctx, xoff1+dxblank, xoff2+dxblank, h, cgoal, lighting); 
		left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		//console.log('left', left[0].x, left.length)
		rect.left=left[0].x; 
		//console.log('right', w);
		rect.right=w; 
	} else {
		// left = findLeftEdge(ctx, w, h, cgoal, 0, lighting); left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		// right = findRightEdge(ctx, w, h, cgoal,w,lighting); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		left = findEdgeHor(ctx, xoff1, xoff2, h, cgoal, lighting); 
		left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		right = findEdgeHor(ctx, w-xoff2, w - xoff1, h, cgoal, lighting); 
		right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		//console.log('left', left[0].x, left.length)
		//console.log('right', right[0].x, right.length)
		rect.left=left[0].x; 
		rect.right=right[0].x; 
	}

	// left = findLeftEdge(ctx, w, h, cgoal); left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	// right = findRightEdge(ctx, w, h, cgoal); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	// console.log('left', left.length)
	// console.log('right', right.length)

	rect.x=rect.left;rect.y=rect.top;rect.w=rect.right-rect.left;rect.h=rect.bottom-rect.top;

	return [rect,toplight,bottomlight,leftlight,rightlight]; // [resx, resy];

}
function calcBoundingBox(ctx,w,h,type){
	let [cgoal,clight,lighting]=type=='event'?['#6C4F64','#E7BB97',false]:['#59544E','#DBCEBE',true];

	findDarkLines(ctx,w,h,cgoal);

}
function _calcBoundingBox(ctx,w,h,type){

	let toplight = findRectSample(ctx, 20, w, 1, 1, clight, 4); 
	let bottomlight = findRectSample(ctx, 20, w, h - 5, h - 5, clight, 4, true); 
	let leftlight = findRectSample(ctx, 0, 0, 10, h, clight, 4); 
	let rightlight = findRectSample(ctx, w-5, w-5, 20, h-15, clight, 4, true); 

	let rect={};

	let [yoff1,yoff2,dyblank]=[0,20,lighting?20:0];
	let [xoff1,xoff2,dxblank]=[0,30,lighting?20:0];
	let top, bottom;
	if (toplight) {
		rect.top=0;
		bottom = findEdgeVert(ctx, h-yoff2-dyblank-5, h - yoff1 -dyblank, w, cgoal, lighting); 
		bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.bottom=bottom[0].y; 
	} else if (bottomlight) {
		rect.bottom=h;
		top = findEdgeVert(ctx, yoff1+dyblank, yoff2+dyblank, w, cgoal, lighting); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.top=top[0].y;
	} else {
		top = findEdgeVert(ctx, yoff1, yoff2, w, cgoal, lighting); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		bottom = findEdgeVert(ctx, h-yoff2, h - yoff1, w, cgoal, lighting); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.top=top[0].y;
		rect.bottom=bottom[0].y; 
	}

	let left,right;
	if (leftlight) {
		rect.left=0;
		right = findEdgeHor(ctx, w-xoff2-dxblank, w - xoff1-dxblank, h, cgoal, lighting); 
		right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.right=right[0].x; 
	} else if (rightlight) {
		left = findEdgeHor(ctx, xoff1+dxblank, xoff2+dxblank, h, cgoal, lighting); 
		left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.left=left[0].x; 
		rect.right=w; 
	} else {
		left = findEdgeHor(ctx, xoff1, xoff2, h, cgoal, lighting); 
		left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		right = findEdgeHor(ctx, w-xoff2, w - xoff1, h, cgoal, lighting); 
		right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.left=left[0].x; 
		rect.right=right[0].x; 
	}
	rect.x=rect.left;rect.y=rect.top;rect.w=rect.right-rect.left;rect.h=rect.bottom-rect.top;

	return [rect,toplight,bottomlight,leftlight,rightlight]; // [resx, resy];

}
function calcBoundsY(ctx, x, h, n = 261) {
	let ystart = -1, yend = -1, y, countlines = 0, prevy = [], ymin = 0, hbound = h - 20;
	let isRotated = false;
	let y1, y2;
	let gotit = false;

	for (y = ymin; y < h; y++) {
		if (gotit) {
			let wt = isPixWhiteOrTransparent(ctx, x, y);

			if (wt) return [ystart, y1, y2, y - 1, isRotated, prevy];
		}
		if (isPixDark(ctx, x, y)) {
			if (isDarkLine(ctx, x, y, h, y < h / 2, y > h / 2)) {

				if (gotit) {
					console.log('====>y', y)
					return [ystart, y1, y2, y, isRotated];
				}

				ctx.fillStyle = 'black';
				yother = null;
				for (const py of prevy) {
					let dy = y - py;
					// console.log('dy', dy)
					if (dy > n - 3 && dy < n + 3) {
						gotit = true;
						isRotated = true;
						y1 = yother = py;
						y2 = y;
						console.log('BINGO!!!! zweites middle ding');
						ctx.fillStyle = 'red';
					}
				}
				prevy.push(y);
				// console.log('______', countlines++, y);
				ctx.fillRect(x - 2, y - 2, 5, 5);
				if (yother) {
					ctx.fillRect(x - 2, yother - 2, 5, 5);
					let i1 = prevy.indexOf(y1);
					console.log('i1', i1)
					ystart = i1 > 0 ? prevy[i1 - 1] : 0;
				}

				// if (ystart < 0) ystart = y; else if (y > hbound) { yend = y; break; }
				y += 5;
			}
		}
	}
	return [ystart, y1, y2, h, isRotated, prevy];
}
function convertToRgb() {
	let result = [];
	for (const a of arguments) {
		if (isString(a)) result.push(colorRGB(a.toLowerCase(), true)); else result.push(a);
	}
	if (result.length == 1) return result[0];
	return result;
}
function condDarkEdgesVertical(pt, list) {
	let [d, delta] = [261, 4];
	for (const p1 of list) {
		let dist = Math.abs(pt.y, p1.y);
		let ok = isWithinDelta(dist, d, delta);
		if (ok) {
			let [pt1, pt2] = [p1, pt];
			ok &&= isColorBefore(ctx, pt1.x, pt1.y, '#DDD3CA', 15)
			ok &&= isColorAfter(ctx, pt2.x, pt2.y, '#DDD3CA', 15)
			if (ok) return ok;
		}
	}
	return false;
}
function _drawPix(ctx, x, y, color = 'red', sz = 5) {
	ctx.fillStyle = color;
	ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz)
}
function _drawPixFrame(ctx, x, y, color = 'red', sz = 5) {
	ctx.strokeStyle = color;
	ctx.strokeRect(x - sz / 2, y - sz / 2, sz, sz)
}
async function doit(k) {
	//let k = 'solomons_temple'; //'hanging_gardens';
	let [canvas, ctx, w, h] = await natGetEmptyCardCanvas('dExtra');
	let card = M.natCards[k];
	let [rect, cv1, ctx1, tmiss, bmiss, lmiss, rmiss] = await natDetectBB(card, 'dExtra');

	let toff = tmiss ? h - cv1.height : 5;
	let loff = lmiss ? w - cv1.width : 7;
	console.log('_______', k);
	console.log('top edge missing', tmiss);
	console.log('left edge missing', lmiss);

	ctx.drawImage(cv1, loff, toff);
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
	ctx.strokeStyle = diColors[card.Type];
	ctx.lineWidth = 28;
	ctx.strokeRect(0, 0, w, h);

	//zuerst rotate canvas!
	mDom('dExtra', { h: 4 })
	let cv2 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
	let ctx2 = cv2.getContext('2d');
	ctx2.translate(h, 0)
	ctx2.rotate(90 * Math.PI / 180);
	ctx2.drawImage(canvas, 0, 0, w, h);

	mDom('dExtra', { h: 4 })
	let cv3 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
	let ctx3 = cv3.getContext('2d');
	ctx3.drawImage(cv2, 0, 0);

	let x = cv3.width / 2;
	let y = cv3.height; // - 10; // Adjust 10 as needed for padding
	ctx3.fillStyle = 'white';
	ctx3.font = '20px Arial';
	ctx3.textAlign = 'center';
	let text = card.Stage;
	ctx3.fillText(text, x, y);

	//ctx3 ist super!
}
function findBottomEdge(ctx, w, h, cgoal) {
	let [ptsy, pts] = findPoints(ctx, 0, w, h * .9, h, cgoal, 10); //console.log(pts)
	//return ptsy;
	let list = pts.filter(o => isLightAfterV(ctx, o.x, o.y) && isLightBeforeV(ctx, o.x, o.y));
	let vfreq = findMostFrequentVal(list, 'y'); //console.log('y', vfreq)
	return list.filter(o => o.y == vfreq);
}
function _findEdgesApart(list, dx, dy, prop) {
	list.map(o => o.nei = findPointAtDistance(o, dx, dy, list, 10))
	//console.log(list)
	list = list.filter(o => o.nei)

	let vfreq = findMostFrequentVal(list, prop); console.log(prop, vfreq)
	let good = list.filter(o => isWithinDelta(o[prop], vfreq, 3));
	let rest = list.filter(o => !isWithinDelta(o[prop], vfreq, 3));
	vfreq = findMostFrequentVal(rest, prop); console.log(prop, vfreq)
	let good2 = list.filter(o => o[prop] == vfreq);
	list = good.concat(good2);
	return list;
}
function _findEdgeHor(ctx,x1,x2,h,cgoal,lighting=true){
	let [list, _] = findPoints(ctx, x1, x2, 0, h, cgoal, 20); //console.log(pts)
	if (lighting) list = list.filter(o => isLightAfter(ctx, o.x, o.y) && isLightBefore(ctx, o.x, o.y));
	let vfreq = findMostFrequentVal(list, 'x'); //console.log('x', vfreq)
	return list.filter(o => o.x == vfreq);
}
function _findEdgeVert(ctx,y1,y2,w,cgoal,lighting=true){
	let [_, list] = findPoints(ctx, 0, w, y1, y2, cgoal, 20); 

	//console.log(jsCopy(list))

	//if (lighting) list = list.filter(o => isLightAfterV(ctx, o.x, o.y) && isLightBeforeV(ctx, o.x, o.y));
	//console.log(jsCopy(list))

	let vfreq = findMostFrequentVal(list, 'y'); //console.log('y', vfreq)


	return list.filter(o => o.y == vfreq);
}
function findHorizontal(ctx, x1, x2, y1, y2, cgoal, minlen = 10, delta = 20) {
	let p;
	cgoal = colorRGB(cgoal, true); console.log(cgoal)
	for (let y = y1; y < y2; y++) {
		for (let xStart = x1; xStart < x2; xStart++) {
			let found = true;
			for (let x = xStart; x < xStart + minlen; x++) {
				p = isPix(ctx, x, y, cgoal, delta);
				if (!p) { found = false; break; }
			}
			if (found) return { x: xStart, y: y, color: p };
		}
	}
	return null;// { x: null, color: null }
}
function findLeftEdge(ctx, w, h, cgoal, xStart = 0, lighting=true) {
	let [list, _] = findPoints(ctx, xStart, w * .1, 0, h, cgoal, 20); //console.log(pts)
	if (lighting) list = list.filter(o => isLightAfter(ctx, o.x, o.y) && isLightBefore(ctx, o.x, o.y));
	let vfreq = findMostFrequentVal(list, 'x'); //console.log('x', vfreq)
	return list.filter(o => o.x == vfreq);
}
function _findMostFrequentVal(arr,prop,delta=0) {
	if (!Array.isArray(arr) || arr.length === 0) {
		return null; // Return null for invalid input
	}

	let frequencyMap = new Map();

	// Count frequencies of y values
	for (let i = 0; i < arr.length; i++) {
		const val = arr[i][prop];
		frequencyMap.set(val, (frequencyMap.get(val) || 0) + 1);
		// for(let v=val-delta;v<=val+delta;v++)	frequencyMap.set(v, (frequencyMap.get(v) || 0) + 1);
	}

	// Find the y value with the maximum frequency
	let mostFrequentY;
	let maxFrequency = 0;

	for (let [val, frequency] of frequencyMap) {
		if (frequency > maxFrequency) {
			//console.log('val',val)
			mostFrequentY = val;
			maxFrequency = frequency;
		}
	}

	// Return the most frequent y value
	return mostFrequentY;
}
function findPixels(ctx, x1, x2, y1, y2, arr, maxdelta) {
	console.log('params', x1, x2, y1, y2)
	console.log('arr', arr)
	let prev = [];
	// let [x, y, c, cond, i] = [x1, y1, 0]; //, arr[0].c, arr[0].cond, 1]; // convertToRgb(arr[0].c), arr[0].cond, 1];
	// console.log('c', c)
	let [x, y, i] = [x1, y1, 0];
	let results = [];
	let MAXX = 100000, cnt = 0;
	let [c, cond] = [arr[i].c, arr[i].cond];
	while (x <= x2 && y <= y2) {
		if (cnt++ > MAXX) { console.log('MAXX!!!!!!!!!!!!!!!'); return null; }
		//console.log('testing',x,y)
		let pi = isPixSim(ctx, x, y, c, maxdelta);
		if (pi) {
			let [p, acc] = [pi.p, pi.acc];
			//console.log('found pixel color', acc, colorHex(p), arr[i].c, x, y)
			//drawPixFrame(ctx,x,y,'red',5)
			//return {x,y};
			let pt = { x, y };
			let res = cond(pt, prev);
			if (res) {
				console.log('cond erfuellt!!!')
				drawPixFrame(ctx, x, y, 'red', 15)
				prev.push(pt);
				results.push({ x: x, y: y, color: p, csim: arr[i].c });
				if (results.length == arr.length) return results;
				//c = arr[i].c; //convertToRgb(arr[i].c);
				//cond = arr[i].cond;
				//console.log('c updated to', i, c); //maxdelta*=2;
				i++; if (i >= arr.length) { console.log('i MAX', i); return null; }
				[c, cond] = [arr[i].c, arr[i].cond];
				x += 30
			}
		}
		x++;
		if (x >= x2) { results = [];[x, y, i] = [x1, y + 1, 0];[c, cond] = [arr[i].c, arr[i].cond]; } //convertToRgb(arr[0].c), arr[0].cond, 1]; }

	}
	return null;
}
function _findPoints(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
	let p;
	let resy = [], resx = [];
	cgoal = colorRGB(cgoal, true);
	for (let y = y1; y < y2; y++) {
		for (let x = x1; x < x2; x++) {
			p = isPixDark(ctx, x, y, cgoal, delta);
			if (p) {
				let l = isLightBeforeV(ctx, x, y);
				let d = isLightAfterV(ctx, x, y);
				if (l || d) resy.push({ x, y })
				l = isLightBefore(ctx, x, y);
				d = isLightAfter(ctx, x, y);
				if (l || d) resx.push({ x, y })
			}
		}
	}

	return [resx, resy];
}
function _findPointAtDistance(pt, dx, dy, list, delta = 0) {
	for (const p1 of list) {
		if (isWithinDelta(Math.abs(pt.x - p1.x), dx, delta) && isWithinDelta(Math.abs(pt.y - p1.y), dy, delta)) return p1;
	}
	return null;
}
function findRightEdge(ctx, w, h, cgoal) {
	let [ptsy, pts] = findPoints(ctx, w * .9, w, 0, h, cgoal, 10); //console.log(pts)
	// //return ptsy;
	// let vfreq = findMostFrequentVal(ptsy,'x'); console.log('x',vfreq)
	let list = ptsy.filter(o => isLightAfter(ctx, o.x, o.y) && isLightBefore(ctx, o.x, o.y));
	let vfreq = findMostFrequentVal(list, 'x'); //console.log('x', vfreq)
	return list.filter(o => o.x == vfreq);
}
function _findRectSample(ctx, x1, x2, y1, y2, cgoal, sz = 4, lightCounts = false) {
	let p;
	cgoal = colorRGB(cgoal, true);
	for (let yStart = y1; yStart <= y2; yStart += sz) {
		for (let xStart = x1; xStart <= x2; xStart += sz) {
			let found = true;
			for (let x = xStart; x < xStart + sz; x++) {
				for (let y = yStart; y < yStart + sz; y++) {
					//console.log(x,y,cgoal)
					p = isPix(ctx, x, y, cgoal, 20); // || isPixLight(ctx,x,y);
					if (lightCounts && isPix(ctx, x, y, 'white', 10)) p = true;
					//console.log(p)
					if (!p) { found = false; break; }
				}
				if (!found) break;
			}
			if (found) return true; // { x: xStart, y: y, color: p };
		}
	}
	return false; //null;// { x: null, color: null }

}
function findSimPixXSequence(ctx, x1, x2, y, clist, xmaxlist, maxdelta) {
	clist = convertToRgb(clist)
	let [x, i] = [x1, 0];
	let results = [];
	let prev = null;
	while (x <= x2 && i < clist.length) {
		let p = isPixSim(ctx, x, y, clist[i], maxdelta);
		if (p) {
			let abstand = !prev ? 0 : x - prev.x;
			//console.log('abstand', abstand, xmaxlist[i])
			if (abstand <= xmaxlist[i]) { prev = { x: x, y: y, color: p, csim: clist[i] }; results.push(prev); i++; }
		}
		x++;
	}
	if (results.length == clist.length) return results; else return null;
}
function findSimPixX(ctx, x1, x2, y, cgoal) {
	cgoal = convertToRgb(cgoal)
	for (let x = x1; x < x2; x++) {
		let p = isPixSim(ctx, x, y, cgoal); if (p) return { x: x, color: p };
	}
	return { x: null, color: null }
}
function findSimPixXY(ctx, x1, x2, y1, y2, cgoal) {
	cgoal = convertToRgb(cgoal)
	for (let y = y1; y < y2; y++) {
		for (let x = x1; x < x2; x++) {
			let p = isPixSim(ctx, x, y, cgoal); if (p) return { x: x, y: y, color: p };
		}
	}
	return { x: null, color: null }
}
function findSimPixLineHor(ctx, x1, x2, y1, y2, cgoal, minlen = 10, maxdelta = 20) {
	let p;
	cgoal = convertToRgb(cgoal)
	for (let y = y1; y < y2; y++) {
		for (let xStart = x1; xStart < x2; xStart++) {
			let found = true;
			for (let x = xStart; x < xStart + minlen; x++) {
				p = isPixSim(ctx, x, y, cgoal); if (!p) { found = false; break; }
			}
			if (found) return { x: xStart, y: y, color: p };
		}
	}
	return null;// { x: null, color: null }
}
function findTopEdge(ctx, w, h, cgoal, yStart = 0) {
	let [_, list] = findPoints(ctx, 0, w, yStart, yStart + h / 5, cgoal, 10); //console.log(pts)
	list = list.filter(o => isLightAfterV(ctx, o.x, o.y) && isLightBeforeV(ctx, o.x, o.y));
	let vfreq = findMostFrequentVal(list, 'y'); //console.log('y', vfreq)
	return list.filter(o => o.y == vfreq);
}
function getPixAvg(arr) {
	let rsum = 0, gsum = 0, bsum = 0, n = arr.length;
	for (const el of arr) {
		rsum += el.r; gsum += el.g; bsum += el.b;
	}
	return { r: rsum / n, g: gsum / n, b: bsum / n };
}
function getPixHex(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	return colorHex(`rgb(${red},${green},${blue})`);

}
function getPixLineAtX(ctx, x, y1, y2) {
	let res = [];
	for (let y = y1; y <= y2; y++) res.push(getPixRgb(ctx, x, y))
	return res;
}
function getPixRgb(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	return { r: red, g: green, b: blue };
	//return colorHex(`rgb(${red},${green},${blue})`);

}
async function imgAsync(dParent, styles, opts) {
	let path = opts.src;
	delete opts.src;
	addKeys({ tag: 'img' }, opts); //if forget

	return new Promise((resolve, reject) => {
		const img = mDom(dParent, styles, opts);
		// const img = new Image();
		img.onload = () => {
			resolve(img);
		};
		img.onerror = (error) => {
			reject(error);
		};
		img.src = path;
	});
}
function imgAsCanvas(img, dParent) {
	dParent = toElem(dParent);
	mClear(dParent);
	let canvas = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
	return canvas;
}
function imgRotate90(dParent, img) {

	let canvas = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
	let ctx = canvas.getContext('2d');
	// ctx.translate(img.height, 0)
	ctx.translate(0, img.width);
	ctx.rotate(-90 * Math.PI / 180);

	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
	ctx.drawImage(img, 0, 0, img.width, img.height);
	return canvas;


}
async function imgToPortrait(src, width, dParent, sendToServer = false, path = null, downloadAtClient = false) { //}, path, viewParent, imgParent, sendToServer, downloadAtClient) {
	if (isdef(mBy('img1'))) mBy('img1').remove();
	let img = mDom(document.body, { position: 'absolute', top: '70vh', h: width }, { tag: 'img', id: 'img1' });
	await loadImageAsync(src, img); //hier ist img loaded!!!
	//return img; 
	dParent = toElem(dParent);
	mClear(dParent);
	let canvas = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
	let ctx = canvas.getContext('2d');
	ctx.translate(0, img.width);
	ctx.rotate(-90 * Math.PI / 180);
	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
	ctx.drawImage(img, 0, 0, img.width, img.height)
	if (downloadAtClient) downloadCanvas(canvas);
	if (sendToServer) {
		let dataUrl = canvas.toDataURL('image/png');
		let o = { image: dataUrl, path: path };
		let resp = await mPostRoute('postImage', o);
		return resp; //console.log('resp', resp);
	}
	return 'image NOT sent to server!'
}
async function imgSaveAsLandscape(src, width, path, viewParent, imgParent, sendToServer, downloadAtClient) {
	if (isdef(mBy('img1'))) mBy('img1').remove();
	let img = mDom(imgParent, { position: 'absolute', top: '100vh', h: width }, { tag: 'img', id: 'img1' });
	await loadImageAsync(src, img); //hier ist img loaded!!!
	mClear(viewParent);
	let canvas = mDom(viewParent, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
	let ctx = canvas.getContext('2d');
	ctx.translate(img.height, 0)
	ctx.rotate(90 * Math.PI / 180);
	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
	ctx.drawImage(img, 0, 0, img.width, img.height)
	if (downloadAtClient) downloadCanvas(canvas);
	if (sendToServer) {
		let dataUrl = canvas.toDataURL('image/png');
		let o = { image: dataUrl, path: path };
		let resp = await mPostRoute('postImage', o);
		return resp; //console.log('resp', resp);
	}
	return 'image NOT sent to server!'
}
function isBetween(n, a, b) { return n >= a && n <= b }
function isDarkLine(ctx, x, y, h, before = true, after = true) {
	let almost1 = false, almost2 = false;
	let d = 3;
	if (before) {
		for (let yy = Math.max(0, y - d); yy < y; yy++) { //Math.min(y+5,h);yy++)	{
			let p = ctx.getImageData(x, yy, 1, 1).data;
			if (p[0] + p[1] + p[2] > 520) almost1 = true;
			// console.log(p[0],p[1],p[2]);
		}
	} else almost1 = true;
	if (after) {
		for (let yy = y + 1; yy < Math.min(y + 5, h); yy++) { //Math.min(y+5,h);yy++)	{
			let p = ctx.getImageData(x, yy, 1, 1).data;
			if (p[0] + p[1] + p[2] > 520) almost2 = true;
			// console.log(p[0],p[1],p[2]);
		}
	} else almost2 = true;
	return almost1 && almost2;
}
function isDarkBar(ctx, x, y, w, before = true, after = true) {
	let almost1 = false, almost2 = false;
	let d = 3;
	if (before) {
		for (let xx = Math.max(0, x - d); xx < x; xx++) { //Math.min(y+5,h);yy++)	{
			let p = ctx.getImageData(xx, y, 1, 1).data;
			if (p[0] + p[1] + p[2] > 520) almost1 = true;
			// console.log(p[0],p[1],p[2]);
		}
	} else almost1 = true;
	if (after) {
		for (let xx = x + 1; xx < Math.min(x + 5, w); xx++) { //Math.min(y+5,h);yy++)	{
			let p = ctx.getImageData(x, xx, 1, 1).data;
			if (p[0] + p[1] + p[2] > 520) almost2 = true;
			// console.log(p[0],p[1],p[2]);
		}
	} else almost2 = true;
	return almost1 && almost2;
}
function isLightAfter(ctx, x, y) {
	for (let p = x + 1; p < x + 4; p++) if (isPixLight(ctx, p, y)) return true;
	return false;
}
function isLightBefore(ctx, x, y) {
	for (let p = x - 4; p < x - 1; p++) if (isPixLight(ctx, p, y)) return true;
	return false;
}
function isLightAfterV(ctx, x, y) {
	for (let p = y + 1; p < y + 4; p++) if (isPixLight(ctx, x, p)) return true;
	return false;
}
function isLightBeforeV(ctx, x, y) {
	for (let p = y - 4; p < y - 1; p++) if (isPixLight(ctx, x, p)) return true;
	return false;
}
function isPix(ctx, x, y, color, delta=10) {
	let rgb = isString(color) ? colorRGB(color, true) : color;
	//console.log('rgb',rgb)
	let p = getPixRgb(ctx, x, y);
	let found = isWithinDelta(p.r, rgb.r, delta) && isWithinDelta(p.g, rgb.g, delta) && isWithinDelta(p.b, rgb.b, delta);
	return found?p:null;
}
function isPixGB(ctx, x, y, color, delta=10) {
	let rgb = isString(color) ? colorRGB(color, true) : color;
	//console.log('rgb',rgb)
	let p = getPixRgb(ctx, x, y);
	let found = isWithinDelta(p.g, rgb.g, delta) && isWithinDelta(p.b, rgb.b, delta);
	return found?p:null;
}
function isPixDark(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	return green < 100 && blue < 100;
}
function isPixLight(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	return red + green + blue > 520;
}
function _isPixSim(ctx, x, y, hexcolor) {
	let p = getPixHex(ctx, x, y);
	return p[1] == hexcolor[1] && p[3] == hexcolor[3] && p[5] == hexcolor[5] ? p : null;
}
function _isPixSim2(ctx, x, y, color, delta = 10) {
	let rgb = isString(color) ? colorRGB(color, true) : color;
	let p = getPixRgb(ctx, x, y);
	return isWithinDelta(p.r, rgb.r, delta) && isWithinDelta(p.g, rgb.g, delta) && isWithinDelta(p.b, rgb.b, delta) ? p : null;
}
function isPixSim(ctx, x, y, color, maxdelta) {
	let deltas = range(Math.max(0, maxdeltas / 2), maxdelta, 4);
	for (const delta of deltas) {
		let rgb = isString(color) ? colorRGB(color, true) : color;
		//console.log('rgb',rgb)
		let p = getPixRgb(ctx, x, y);
		let found = isWithinDelta(p.r, rgb.r, delta) && isWithinDelta(p.g, rgb.g, delta) && isWithinDelta(p.b, rgb.b, delta);
		if (found) return { p, acc: delta };
	}
	return null;
}
function isColorAfter(ctx, x, y, c, maxdelta) {
	for (let p = x + 1; p < x + 4; p++) if (isPixSim(ctx, p, y, c, maxdelta)) return true;
	return false;
}
function isColorBefore(ctx, x, y, c, maxdelta) {
	for (let p = x - 4; p < x - 1; p++) if (isPixSim(ctx, p, y, c, maxdelta)) return true;
	return false;
}
function isPix(ctx, x, y, color, delta=10) {
	let rgb = isString(color) ? colorRGB(color, true) : color;
	//console.log('rgb',rgb)
	let p = getPixRgb(ctx, x, y);
	let found = isWithinDelta(p.r, rgb.r, delta) && isWithinDelta(p.g, rgb.g, delta) && isWithinDelta(p.b, rgb.b, delta);
	//if (found) found&&=p.r+p.g+p.b
	return found?p:null;
}
function isPixWhiteOrTransparent(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	//console.log('pix',red,green,blue,red + green + blue > 3*250)
	return red + green + blue > 3 * 250;
}
function isWithinDelta(n, goal, delta) { return isBetween(n, goal - delta, goal + delta) }
async function natCivsToLandscape() {
	async function civSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient) {
		let path = `assets/games/nations/civs/civ_${name}.png`;
		return imgSaveAsLandscape(src, width, path, viewParent, imgParent, sendToServer, downloadAtClient);
	}

	let dbody = document.body; dbody.innerHTML = '';
	let viewParent = mDom(dbody, { bg: 'skyblue', hmin: '100vh' }, { id: 'd1' });
	// let dhidden = mDom(dbody);
	let civlist = ['america', 'arabia', 'china', 'egypt', 'ethiopia', 'greece', 'india', 'japan', 'korea', 'mali', 'mongolia', 'persia', 'poland', 'portugal', 'rome', 'venice', 'vikings'];
	for (const civ of ['vikings']) {
		let src = `../assets/games/nations/civs_old/${civ}.jpg`;
		let width = 800;
		let name = civ;
		let viewParent = viewParent;
		let imgParent = dbody;
		let sendToServer = true;
		let downloadAtClient = false;
		await civSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient);
		// let img = await imgSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient);
		// await onloadCiv(img, src, width, name, viewParent, imgParent, sendToServer, downloadAtClient);

	}
}
async function natGetEmptyCardCanvas(dParent){
	dParent = toElem(dParent);
	if (nundef(DA.eimg)){
		M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
		DA.eimg = await imgAsync(dParent, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
		mDom(dParent,{h:10});
		//console.log('w', DA.eimg.width, 'h', DA.eimg.height);
	}
	let eimg = DA.eimg;
	let [w, h] = [eimg.width, eimg.height];
	let canvas = mDom(dParent, {}, { tag: 'canvas', width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });
	ctx.drawImage(eimg, 0, 0, w, h);
	return [canvas,ctx,w,h];
}
async function natDetectBoundingBox(k, src, border, idx) {

	let path = `../assets/games/nations/cards/${src}`; 
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
	let [w, h] = [img.width, img.height]; console.log('w', w, 'h', h);

	//only consider images in landscape form
	if (h > w) { img.remove(); console.log(`NOT in landscape! ${k} ${src}`); return; }

	//als erstes brauch ich einen canvas!
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });

	ctx.drawImage(img, 0, 0, w, h);

	//fuer start suche: #D8BEAF rgb(215,189,174), D5BFB2 rgb(214,192,179), D3BDAF = rgb(208,189,174)
	// let corner2 = findSimPixLineHor(ctx, 5, 90, 5, 80, { r: 215, g: 189, b: 174 }, 10, 10);
	let corner2 = findSimPixLineHor(ctx, 5, 90, 5, 80,'#a18b81', 6, 14);
	if (!corner2) {console.log('no start!!!!');img.style.display = 'none';return null;}

	drawPixFrame(ctx, corner2.x, corner2.y, 'green', 7);
	let [x, y1, cgoal] = [corner2.x, corner2.y, { r: 167, g: 158, b: 151 }]; //colorRGB('#a18b81', true)];
	let result;
	for (let y = y1; y < y1 + 10; y++) {
		result = findSimPixXSequence(ctx, x, w, y,
			[{ r: 167, g: 158, b: 151 }, { r: 220, g: 216, b: 213 }, { r: 167, g: 158, b: 151 }],
			[0, 8, 50], 15)
		//console.log('result', result);

		if (result) { result.map(o => drawPixFrame(ctx, o.x, o.y, 'red', 7)); break; }
	}
	img.style.display = 'none';
	return result;
}
async function _natDetectBB(card,dParent){
	dParent = toElem(dParent);
	let path = `../assets/games/nations/cards/${card.Path}`;
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img' })
	let [w, h] = [img.width, img.height]; //console.log('w', w, 'h', h);
	//return 
	//only consider images in landscape form
	if (h > w) { img.remove(); console.log(`NOT in landscape! ${k} ${src}`); return; }

	//als erstes brauch ich einen canvas!
	let canvas = mDom(dParent, {}, { tag: 'canvas', width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });
	ctx.drawImage(img, 0, 0, w, h);

	//event: 6C4F64
	// let edgecolor=type=='event'?'#382428':'#59544E'; //'#544744';
	let edgecolor=card.Type=='event'?'#6C4F64':'#59544E'; //'#544744';
	let lightcolor=card.Type=='event'?'#E7BB97':'#DBCEBE';
	let [rect,tmiss,bmiss,lmiss,rmiss]=calcBoundingBox(ctx,w,h,edgecolor,lightcolor);

	let cv1 = mDom(dParent, {}, { tag: 'canvas', width: rect.w, height: rect.h });
	let ct1 = cv1.getContext('2d', { willReadFrequently: true });
	ct1.drawImage(img,-rect.left,-rect.top);

	//jetzt hol ich mir das empty sample
	// img.remove();canvas.remove();

	return [rect,cv1,ct1,tmiss,bmiss,lmiss,rmiss];
}
async function natDetectBoundingBox(k, src, border, idx, type) {

	let path = `../assets/games/nations/cards/${src}`;
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
	let [w, h] = [img.width, img.height]; console.log('w', w, 'h', h);

	//only consider images in landscape form
	if (h > w) { img.remove(); console.log(`NOT in landscape! ${k} ${src}`); return; }

	//als erstes brauch ich einen canvas!
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });
	ctx.drawImage(img, 0, 0, w, h);

	//event: 6C4F64
	// let edgecolor=type=='event'?'#382428':'#59544E'; //'#544744';
	let edgecolor=type=='event'?'#6C4F64':'#59544E'; //'#544744';
	let lightcolor=type=='event'?'#E7BB97':'#DBCEBE';
	let rect=calcBoundingBox(ctx,w,h,edgecolor,lightcolor);

	let cv1 = mDom(dParent, {}, { tag: 'canvas', width: rect.w, height: rect.h });
	let ct1 = cv1.getContext('2d', { willReadFrequently: true });
	ct1.drawImage(img,-rect.left,-rect.top);

	//jetzt hol ich mir das empty sample
	// img.remove();canvas.remove();

	return [rect,cv1];

}
function pixShow(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	console.log('pix', x, y, red, green, blue, red + green + blue, isPixDark(ctx, x, y));
	if (isPixDark(ctx, x, y)) {
		drawPix(ctx, x, y);
		return true;
	}
	return false;
}
function pixTest90(ctx, y, x1, x2) {
	let x1ja = false, x2ja = false;
	// for (let x = x1 - 2; x <= x1 + 2; x++) if (isPixDark(ctx, x, y) && isLightAfter(ctx,x,y)) x1ja = true;
	for (let x = x1 - 2; x <= x1 + 2; x++) if (x == 0 || isPixDark(ctx, x, y)) x1ja = true;
	for (let x = x2 - 2; x <= x2 + 2; x++) if (isPixDark(ctx, x, y)) x2ja = true;
	return x1ja && x2ja; // isPixDark(ctx,x1,y) && isPixDark(ctx,x2,y)
}
//#endregion

//#region aus aroot games / vorversion
function get_user_pic_and_name(uname, dParent, sz = 50, border = 'solid medium white') {
	let u = Serverdata.users[uname];
	let src = M.superdi[u.key].img;
	console.log('src', src, u)
	let html = `
      <div username='${uname}' style='text-align:center;font-size:${sz / 2.8}px'>
        <img src='${src}' width='${sz}' height='${sz}' class='img_person' style='margin:0;border:${border}'>
        <div style='margin-top:${-sz / 6}px'>${uname}</div>
      </div>`;
	let elem = mCreateFrom(html);
	mAppend(dParent, elem);
	return elem;
}
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
function startGame() {
	let gamename = DA.gamename;
	// let options = collect_game_specific_options(gamename);
	//console.log(Serverdata,DA)
	let poss = Serverdata.config.games[gamename].options;
	if (nundef(poss)) return;
	let options = {};
	for (const p in poss) {
		let fs = mBy(`d_${p}`);
		let val = get_checked_radios(fs)[0];
		options[p] = isNumber(val) ? Number(val) : val;
	}
	let players = DA.playerlist ? DA.playerlist.map(x => ({ name: x.name, playmode: x.playmode, strategy: valf(x.strategy, options.strategy, 'random') })) : create_random_players(options.nplayers);
	//console.log('DA',DA);
	//console.log(gamename,players,options);
	//_start_game(gamename, players, options); hide('dMenu');
}
function startgame(game, players, options = {}) {
	if (nundef(game)) game = 'a_game';
	let default_options = {}; for (const k in Config.games[game].options) default_options[k] = arrLast(Config.games[game].options[k].split(','));
	addKeys(default_options, options); //ensure options
	if (nundef(players)) players = rChoose(Serverdata.users, 2).map(x => ({ name: x.name })); //, playmode: 'human', strategy:valf(options.strategy,'random') })); //ensure players
	let playernames = players.map(x => x.name);
	let fen = window[game]().setup(playernames, options);
	if (nundef(fen.round)) fen.round = 1;
	if (nundef(fen.phase)) fen.phase = '';
	if (nundef(fen.stage)) fen.stage = 0;
	if (nundef(fen.step)) fen.step = 0;
	if (nundef(fen.turn)) fen.turn = [fen.plorder[0]]; else if (DA.TESTSTART1 && fen.turn.length == 1) fen.turn = [playernames[0]];
	players.map(x => { let pl = fen.players[x.name]; pl.playmode = valf(x.playmode, 'human'); pl.strategy = valf(x.strategy, valf(options.strategy, 'random')); });
	if (options.mode == 'solo') {
		let me = isdef(U) && isdef(fen.players[U.name]) ? U.name : rChoose(playernames);
		for (const plname of playernames) {
			if (plname == me) continue;
			fen.players[plname].playmode = 'bot';
		}
		options.mode = 'hotseat';
	}
	for (const k in options) { if (isNumber(options[k])) options[k] = parseInt(options[k]); }
	let o = {
		friendly: generate_table_name(players.length), game: game, host: playernames[0], players: playernames,
		fen: fen, options: options
	};
	ensure_polling(); // macht einfach nur Pollmode = 'auto'
	phpPost(o, 'startgame');
}


//#endregion

function arrInsertAt(arr, x, i) {
	arr.splice(i, 0, x);
	return arr;
}
function arrRemoveDuplicates(arr) { return Array.from(new Set(arr)); }
function addIfAlpha(arr, val) {
	console.log('arr', arr, 'val', val)
	let i = 0;
	for (const v of arr) {
		if (v == val) { break; } //console.log('found val', v); break; }
		else if (v > val) { arrInsertAt(arr, val, i); break; }
		else if (i == arr.length - 1) arr.push(val);
		i++;
	}
	console.log('i', i, 'len', arr.length, arr)
	return i;
}
function calendarOpenDay(date, d, ev) {
  if (isdef(ev) && ev.target != d) return;
  console.log('open event on', typeof date, date)
  let d1 = addEditable(d, { w: 50 }, {
    onEnter: ev => {
      let inp = ev.target;
      let o = { date: date.getTime(), text: inp.value, title: firstWord(inp.value) };
      onEventEdited(o, inp);
    }
  });
  return d1;
}
function collectionAddEmpty(ev) {
  if (ev.key != 'Enter') return;
  console.log('onupdate', ev.target, ev.target.value);
  let val = ev.target.value;
  addIf(M.collections, val);
  M.collections.sort()
  M.byCollection[val] = [];
  collInitCollection(val);
}
async function collectAddDir(dir, coll, cat) {
  let filenames = await mGetFiles(dir);
  addIf(M.collections, coll);
  addIf(M.categories, cat);
  for (const name of filenames) {
    let img = name;
    let path = `../assets/${dir}/${name}`;
    let k = stringBefore(name, '.');
    let friendly = k;
    if (isdef(M.superdi[k])) {
      k = `${coll}_${k}`;
    }
    M.superdi[k] = { key: k, friendly: friendly, cats: [cat], ext: stringAfter(name, '.'), img: `${name}`, path: path };
    addIf(M.names, friendly);
    lookupAddIfToList(M.byCat, [cat], k);
    lookupAddIfToList(M.byFriendly, [friendly], k);
    lookupAddIfToList(M.byCollection, [coll], k);
  }
}
async function collectAddUploadedImages() {
  let imgs = await mGetYaml('../y/m2.yaml');
  for (const k in imgs) {
    if (isdef(M.superdi[k])) continue;
    let o = imgs[k];
    M.superdi[k] = { key: k, friendly: o.name, cats: [o.cat], ext: o.ext, img: `${k}.${o.ext}`, path: `../y/img/${k}.${o.ext}` };
    addIf(M.collections, o.coll);
    addIf(M.categories, o.cat);
    addIf(M.names, o.name);
    lookupAddIfToList(M.byCat, [o.cat], k);
    lookupAddIfToList(M.byFriendly, [o.name], k);
    lookupAddIfToList(M.byCollection, [o.coll], k);
  }
}
function cvRot90(img, canvas, ctx, w, h, border, diff) {
	let rot = 90
	ctx.translate(canvas.width, 0); //-canvas.height/2) //img.width);
	ctx.rotate(rot * Math.PI / 180); //ctx.rotate(-90 * Math.PI / 180);
	// ctx.translate(-8, 6) //erstes:- verschiebt nacht oben, zweites: + verschiebt nach links
	ctx.drawImage(img, 0, 0, img.width, img.height)
	ctx.beginPath();
	//ctx.rect(12, 5, canvas.height, canvas.width) //15, -4, 290, 180);
	// ctx.rect(15, -4, 290, 180);
	ctx.stroke();
}
function cvRot270(img, canvas, ctx, w, h, border, diff) {
	let rot = -90
	if (rot == -90) {
		ctx.translate(0, img.width);
		ctx.rotate(-90 * Math.PI / 180); //ctx.rotate(-90 * Math.PI / 180);
		ctx.translate(-4, 15)
		ctx.drawImage(img, 0, 0, img.width, img.height)
		ctx.beginPath();
		ctx.lineWidth = "10";
		ctx.strokeStyle = color;
		ctx.rect(15, -4, 290, 180);
		ctx.stroke();
	} else if (rot == 90) {
	} else {
		ctx.drawImage(img, 0, 0, img.width, img.height)
	}



	//let cv = imgAsCanvas(img,'dMain');
}
function downloadCanvas(canvas) {
	//var canvas = document.getElementById('myCanvas');
	var dataURL = canvas.toDataURL('image/png');

	// Create a temporary link element
	var link = document.createElement('a');
	link.href = dataURL;
	link.download = 'canvas_image.png';

	// Append the link to the body and simulate a click
	document.body.appendChild(link);
	link.click();

	// Remove the link from the body
	document.body.removeChild(link);
}
function drawFa6(o) {
	let fz = 50;
	let d = mDom('dMain', { w: 120, h: 80, margin: 4, align: 'center', display: 'inline-block' });
	let el = mDom(d, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor() }, { html: String.fromCharCode('0x' + o.fa6) });
	let t = mDom(d, { fz: 11 }, { html: o.key });

}
function drawFaga(o) {
	let fz = 50;
	let [code, family] = isdef(o.fa) ? [o.fa, 'pictoFa'] : [o.ga, 'pictoGame'];
	//console.log('family:',family)
	let d = mDom('dMain', { w: 120, h: 80, margin: 4, align: 'center', display: 'inline-block' });
	let el = mDom(d, { fz: fz, hline: fz, family: family, bg: 'transparent', fg: rColor() }, { html: String.fromCharCode('0x' + code) });
	let t = mDom(d, { fz: 11 }, { html: o.key });

}
function drawRoundedRect(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + width, y, x + width, y + height, radius);
	ctx.arcTo(x + width, y + height, x, y + height, radius);
	ctx.arcTo(x, y + height, x, y, radius);
	ctx.arcTo(x, y, x + width, y, radius);
	ctx.closePath();

	// Fill and stroke the rounded rectangle
	ctx.fill();
	ctx.stroke();
}
function drawRoundedRect(ctx, x, y, width, height, radius, stroke, fill, thickness) {
	if (stroke) ctx.strokeStyle = stroke;
	if (fill) ctx.fillStyle = fill;
	if (thickness) ctx.lineWidth = thickness;
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.moveTo(x + width - radius, y);
	ctx.arcTo(x + width, y, x + width, y + radius, radius);
	ctx.moveTo(x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	// ctx.arcTo(x + width, y + height, x, y + height, radius);
	// ctx.arcTo(x, y + height, x, y, radius);
	// ctx.arcTo(x, y, x + width, y, radius);
	ctx.closePath();

	// Fill and stroke the rounded rectangle
	if (fill) ctx.fill();
	if (stroke) ctx.stroke();
}
function filenameToObject(fname, path, cats) {
	let parts = fname.split('.');
	if (parts.length != 2) console.log('file', path, fname, 'wrong name');
	let [k, ext] = parts;
	let o = { key: k, ext: ext, cats: cats, path: `${path}/${fname}`, img: fname, friendly: k.replace(/[^a-zA-Z]/g, '') };
	return o;
}
function focusNextSiblingOrSubmitOnEnter(ev, id) {
	if (ev.key === 'Enter') {
		ev.preventDefault();
		let el = mBy(id); let tag = el.tagName.toLowerCase();
		if (tag == 'input') el.focus();
		else if (tag == 'form') {
			el.submit();
		}
	}
}
function formatDate(date) {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
	const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

	return `${day}_${month}_${year}`;
}
function getConfig() { return lookup(Serverdata.config, Array.from(arguments)); }
function getSession() { return lookup(Serverdata.session, Array.from(arguments)); }
async function loadCollections() {
  M = {};
  M.superdi = await mGetYaml('../assets/superdi.yaml');
  M.byCollection = {};
  M.byCat = {};
  M.byFriendly = {};
  M.collections = ['all'];
  M.categories = [];
  M.names = [];
  for (const k in M.superdi) {
    let o = M.superdi[k];
    if (isdef(o.coll)) { lookupAddIfToList(M.byCollection, [o.coll], o.key); addIf(M.collections, o.coll); }
    o.cats.map(x => { lookupAddIfToList(M.byCat, [x], o.key); addIf(M.categories, x); });
    if (isdef(o.friendly)) { lookupAddIfToList(M.byFriendly, [o.friendly], o.key); addIf(M.names, o.friendly); }
  }
  await collectAddUploadedImages();
  await collectAddDir('img/users', 'users', 'user');
  await collectAddDir('games/nations/cards', 'nations', 'card');
  await collectAddDir('games/nations/templates', 'nations', 'symbol');
  M.collections.sort();
  M.categories.sort();
  M.names.sort();
}
async function loadAssets(timing){
	// *** in prelims, uncomment the following lines and comment the line after t3 line! ***
	if (timing == 'slow'){
		showMessage('DEPRECATED'); assertion(false,'prelims(slow) DEPRECATED'); return;
		await loadCollections();
		loadPlayerColors();
		let info = await mGetYaml('../assets/info.yaml');
		addKeys(info,M);
		M.c52 = await mGetYaml('../assets/c52.yaml');
		await natLoadAssets();
	}else if (timing == 'fast') {
		M = await mGetYaml('../odf/mnew.yaml'); //mnew includes natLoadAssets and c52!
	}else if (timing == 'new'){
		M = await mGetYaml('../odf/m.yaml'); 
		//superdi hat NICHT sorted keys!
		//superdi hat nations coll (cards) aber nicht civs
		let [di,byColl,byFriendly,byCat] = [M.superdi,{},{},{}];
		for(const k in di){
			let o=di[k];
			//console.log('k',o)
			for(const cat of o.cats) lookupAddIfToList(byCat,[cat],k);
			for(const coll of o.colls) lookupAddIfToList(byColl,[coll],k);
			lookupAddIfToList(byFriendly,[o.friendly],k)
		}
		M.byCat = byCat;
		M.byCollection = byColl;
		M.byFriendly = byFriendly;
		M.categories = Object.keys(byCat);M.categories.sort();
		M.collections = Object.keys(byColl);M.collections.sort();
		M.names = Object.keys(byFriendly);M.names.sort();
	}
}
async function loadCollectionsFromDirs() {
	if (nundef(M.emos)) {
		let server = getServerurl();
		let emos = await mGetYaml('../assets/m.yaml');
		let amanda = await mGetFiles(server, '../assets/img/amanda')
		let airport = await mGetFiles(server, '../assets/img/airport');
		let animals = await mGetAnimals(server);

		let di = animals;
		for (const k in emos) {
			let o = emos[k];
			let onew = { key: k, friendly: k };
			addKeys(o, onew);
			if (isdef(o.img)) { onew.path = '../assets/img/emo/' + o.img; onew.ext = stringAfter(o.img, '.'); }
			di[k] = onew;
		}
		for (const fname of amanda) {
			let o = filenameToObject(fname, '../assets/img/amanda', ['art', 'amanda']);
			if (isdef(di[o.key])) console.log('ACHTUNG!!! duplicate', o.key)
			di[o.key] = o;
		}
		for (const fname of airport) {
			let o = filenameToObject(fname, '../assets/img/airport', ['wallpaper', 'airport']);
			if (isdef(di[o.key])) console.log('ACHTUNG!!! duplicate', o.key)
			di[o.key] = o;
		}
		let superdi = sortKeysAlphabetically(di);

		M.superdi = {};
		for (const k in superdi) {
			let o = {};
			addKeys(superdi[k], o);
			M.superdi[k] = o;
		}

		//downloadAsYaml(M.superdi,'superdi');

		//indexing superdi!
		let bycat = {}, byfriendly = {};
		for (const k in superdi) {
			let o = superdi[k];
			lookupAddIfToList(byfriendly, [o.friendly], o.key);
			o.cats.map(x => lookupAddIfToList(bycat, [x], o.key));
		}

		M.byCat = sortKeysAlphabetically(bycat);
		M.byFriendly = sortKeysAlphabetically(byfriendly);
		M.names = Object.keys(M.byFriendly);
		M.categories = Object.keys(M.byCat);

		mNavbar('M', ['view', 'add', 'play', 'create']);
		dTitle = mDom(document.body, { margin: 16 }, { tag: 'h1', html: 'Add to Collection' });
		mInsert(document.body, dTitle, 1)
	}
	return M;
}
async function loadUserdata(uname) {
  let data = await mGetRoute('user', uname);
  console.log('data',data)
  if (!data) { data = await postUserChange({ name: uname, color: rChoose(M.playerColors) }); }
  else Serverdata.users[uname] = data;
  return data;
}
function mAppearH(d,h,ms,callback,delay=0){
  //mStyle(d,{fg:getThemeFg(),h:mGetStyle(d,'height')}); console.log('fading!',d,d.style.height);

  mAnimateList(d, { height: 0, opacity: 0 }, () => { mClear(d); if (callback) callback(); }, ms, 'ease-out', delay);

  // return mAnimateTo(d, 'height', 0, () => { mClear(d); if (callback) callback(); }, ms, 'ease-out');//, delay = ms/2);

}
function mCropper(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	//console.log('w', worig, 'h', horig);
	//console.log('dParent', dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, { bg: '#ffffff80', fg: 'black' });
	const centerBox = mDom(cropBox, { bg: 'red', w: 10, h: 10, rounding: '50%', position: 'absolute' });
	let isCropping = false;
	let cropStartX;
	let cropStartY;

	function addCropTool(dParent, img, setSizeFunc) {
		let d = dParent;
		let rg = mRadioGroup(d, {}, 'rSizes', 'Crop to: '); mClass(rg, 'input')
		mRadio('manual', [0, 0], 'rSizes', rg, {}, setSizeFunc, 'rSizes', true)
		let [w, h] = [img.offsetWidth, img.offsetHeight];
		if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w / .7];
			let [w2, h2] = [h * .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (card)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (card)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		}
		if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w * .7];
			let [w2, h2] = [h / .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (landscape)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (landscape)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		}
		mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
		return rg;
	}
	function startCrop(e) {
		e.preventDefault();
		isCropping = true;
		cropStartX = e.clientX - dParent.offsetLeft;
		cropStartY = e.clientY - dParent.offsetTop;
		document.addEventListener('mousemove', crop); //cropCenter);
		document.addEventListener('mouseup', stopCrop);
	}
	function crop(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	function cropX(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = 300; //Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = 0; //Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	function cropCenter(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const radiusX = Math.abs(mouseX - cropStartX);
			const radiusY = Math.abs(mouseY - cropStartY);
			const centerX = cropStartX; // (mouseX + cropStartX) / 2;
			const centerY = cropStartY; //(mouseY + cropStartY) / 2;

			const width = radiusX * 2;
			const height = radiusY * 2;
			const left = centerX - radiusX;
			const top = centerY - radiusY;
			setRect(left, top, width, height);
		}
	}
	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}
	function cropImage() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		//console.log('x,y,w,h', x, y, w, h);
		let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = imgDataUrl;
		img.width = w;
		img.height = h;
		mStyle(dParent, { w: w, h: h });
		setRect(0, 0, w, h);
		return imgDataUrl;
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		mStyle(cropBox, { left: left, top: top, w: width, h: height });
		messageBox.innerHTML = `size: ${width} x ${height}`;
		mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
		//console.log('new rect',left,top,width,height,width/2,height/2);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		//console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];

		//console.log('old rect', x, y, w, h, cx, cy);

		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];


		setRect(xnew, ynew, wnew, hnew);

	}


	setRect(0, 0, worig, horig);
	cropBox.addEventListener('mousedown', startCrop);
	var tool = addCropTool(dButtons, img, setSize);
	var button = mButton('Crop', cropImage, tool, { w: 120, maleft: 12 }, 'input');

	return {
		button: button,
		crop: cropImage,
		elem: cropBox,
		messageBox: messageBox,
		img: img,
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		setSize: setSize,
		tool: tool,
	}
}
function mCropResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, { bg: '#ffffff80', fg: 'black' });

	let sz = 16;
	const centerBox = mDom(cropBox, { bg: 'red', w: sz, h: sz, rounding: '50%', position: 'absolute' });
	const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, top: '50%', rounding: '50%', position: 'absolute' });
	const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	const whHandle = mDom(cropBox, { cursor: 'nwse-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	let isResizing = null;
	let resizeStartW;
	let resizeStartH;
	let isCropping = false;
	let cropStartX;
	let cropStartY;
	function startResize(e) {
		e.preventDefault(); evNoBubble(e);
		isResizing = e.target == wHandle ? 'w' : e.target == hHandle ? 'h' : 'wh';
		[resizeStartW, resizeStartH] = [parseInt(cropBox.style.width), parseInt(cropBox.style.height)];
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}
	function resize(e) {
		if (!isResizing) return;
		e.preventDefault(); evNoBubble(e);
		let newWidth, newHeight;
		if (isResizing == 'w') {
			newWidth = e.clientX;
			newHeight = img.height;
		} else if (isResizing == 'h') {
			newWidth = img.width;
			newHeight = e.clientY;
		} else if (isResizing == 'wh') {
			newHeight = e.clientY;
			let aspectRatio = img.width / img.height;
			newWidth = aspectRatio * newHeight;
		}
		[img, dParent].map(x => mStyle(x, { w: newWidth, h: newHeight }));
		setRect(0, 0, newWidth, newHeight);
		//messageBox.innerHTML = `size: ${Math.round(newWidth)} x ${Math.round(newHeight)}`;
	}
	function stopResize() {
		isResizing = null;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		let [wnew, hnew] = [parseInt(cropBox.style.width), parseInt(cropBox.style.height)]
		redrawImage(img, dParent, 0, 0, resizeStartW, resizeStartH, wnew, hnew, () => setRect(0, 0, wnew, hnew))
	}

	function addCropTool(dParent, img, setSizeFunc) {
		let d = dParent;
		let rg = mRadioGroup(d, {}, 'rSizes', 'Crop to: '); mClass(rg, 'input')
		mRadio('manual', [0, 0], 'rSizes', rg, {}, setSizeFunc, 'rSizes', true)
		let [w, h] = [img.offsetWidth, img.offsetHeight];
		if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w / .7];
			let [w2, h2] = [h * .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (card)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (card)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		}
		if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w * .7];
			let [w2, h2] = [h / .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (landscape)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (landscape)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		}
		mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
		return rg;
	}
	function startCrop(e) {
		e.preventDefault();
		isCropping = true;
		cropStartX = e.clientX - dParent.offsetLeft;
		cropStartY = e.clientY - dParent.offsetTop;
		document.addEventListener('mousemove', crop); //cropCenter);
		document.addEventListener('mouseup', stopCrop);
	}
	function crop(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	//#region unused
	function cropX(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = 300; //Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = 0; //Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	function cropCenter(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const radiusX = Math.abs(mouseX - cropStartX);
			const radiusY = Math.abs(mouseY - cropStartY);
			const centerX = cropStartX; // (mouseX + cropStartX) / 2;
			const centerY = cropStartY; //(mouseY + cropStartY) / 2;

			const width = radiusX * 2;
			const height = radiusY * 2;
			const left = centerX - radiusX;
			const top = centerY - radiusY;
			setRect(left, top, width, height);
		}
	}
	//#endregion
	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}
	function cropImage() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		redrawImage(img, dParent, x, y, w, h, w, h, () => setRect(0, 0, w, h))
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		mStyle(cropBox, { left: left, top: top, w: width, h: height });
		//messageBox.innerHTML = `size: ${width} x ${height}`;
		messageBox.innerHTML = `size: ${Math.round(width)} x ${Math.round(height)}`;
		mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
		//console.log('________\nsetRect',left,top,width,height,'\ncenter',width/2,height/2);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		//console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];

		//console.log('old rect', x, y, w, h, cx, cy);

		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];


		setRect(xnew, ynew, wnew, hnew);

	}

	wHandle.addEventListener('mousedown', startResize);
	hHandle.addEventListener('mousedown', startResize);
	whHandle.addEventListener('mousedown', startResize);

	setRect(0, 0, worig, horig);
	cropBox.addEventListener('mousedown', startCrop);
	var tool = addCropTool(dButtons, img, setSize);
	var button = mButton('Crop', cropImage, tool, { w: 120, maleft: 12 }, 'input');

	return {
		button: button,
		crop: cropImage,
		elem: cropBox,
		messageBox: messageBox,
		img: img,
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		setSize: setSize,
		tool: tool,
	}
}
function mFadeHClear(d,ms,callback,delay=0){
  mStyle(d,{fg:getThemeFg(),h:mGetStyle(d,'height')}); console.log('fading!',d,d.style.height);

  mAnimateList(d, { height: 0, opacity: 0 }, () => { mClear(d); if (callback) callback(); }, ms, 'ease-out', delay);

  // return mAnimateTo(d, 'height', 0, () => { mClear(d); if (callback) callback(); }, ms, 'ease-out');//, delay = ms/2);

}
function mFlexLine(d, bg = 'white', fg = 'contrast') {
	mStyle(d, { bg: bg, fg: fg, display: 'flex', valign: 'center', hmin: measureHeight(d) });
	mDiv(d, { fg: 'transparent' }, null, '|')
}
async function mGetAnimals(server = 'http://localhost:3000') {
	let dir = "../assets/img/animals";
	let dirs = await mGetFiles(server, dir);
	let di = {};
	for (const subdir of dirs) {
		let path = `${dir}/${subdir}`;
		let files = await mGetFiles(server, path);
		for (const fname of files) {
			let o = filenameToObject(fname, path, ['animals', subdir]);
			di[o.key] = o;
		}
	}
	return di;
}
async function mGetFiles(server, dir) {
	let data = await mGetJsonCors(`${server}/filenames?directory=${dir}`);
	return data.files;
}
async function mGetJsonCors(url) {
	let res = await fetch(url, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors' // Set CORS mode to enable cross-origin requests
	});
	let json = await res.json();
	//console.log('json', json)
	return json;
}
function mResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, { bg: '#ffffff80', fg: 'black' });
	let sz = 25;
	const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, top: '50%', rounding: '50%', position: 'absolute' });
	const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	const whHandle = mDom(cropBox, { cursor: 'nwse-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, bottom: -sz / 2, rounding: '50%', position: 'absolute' });

	let isResizing = null;

	function startResize(e) {
		e.preventDefault(); evNoBubble(e);
		isResizing = e.target == wHandle ? 'w' : e.target == hHandle ? 'h' : 'wh';
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}
	function resize(e) {
		if (!isResizing) return;
		e.preventDefault(); evNoBubble(e);
		let newWidth, newHeight;
		if (isResizing == 'w') {
			newWidth = e.clientX;
			newHeight = img.height;
		} else if (isResizing == 'h') {
			newWidth = img.width;
			newHeight = e.clientY;
		} else if (isResizing == 'wh') {
			newHeight = e.clientY;
			let aspectRatio = img.width / img.height;
			newWidth = aspectRatio * newHeight;
		}
		[img, cropBox, dParent].map(x => mStyle(x, { w: newWidth, h: newHeight }));
		messageBox.innerHTML = `size: ${Math.round(newWidth)} x ${Math.round(newHeight)}`;
	}
	function stopResize() {
		isResizing = null;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		resizeImage(img, parseInt(cropBox.style.height))
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		mStyle(cropBox, { left: left, top: top, w: width, h: height });
		messageBox.innerHTML = `size: ${width} x ${height}`;
	}
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		//console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];
		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];
		setRect(xnew, ynew, wnew, hnew);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }

	setRect(0, 0, worig, horig);
	wHandle.addEventListener('mousedown', startResize);
	hHandle.addEventListener('mousedown', startResize);
	whHandle.addEventListener('mousedown', startResize);
	//var tool = addResizeTool(dButtons,img,setSize);
	// var button = mButton('Resize', cropImage, tool, { w: 120, maleft: 12 }, 'input');

	return {
		//button: button,
		//crop: cropImage,
		elem: cropBox,
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		setSize: setSize,
		//tool: tool,
	}
}
function mTooltip(elem, content) {
	mIfNotRelative(elem);
	let d = mDom(elem, { display: 'none', rounding: 6, padding: 2, h: 60, wmin: 120, bg: 'dimgrey', fg: 'white', position: 'absolute', bottom: 22 }, { html: content });

	elem.onmouseover = () => d.style.display = 'block';
	elem.onmouseout = () => d.style.display = 'none';

}
async function onclickView() {
  showTitle('Collection:');
  dMenu = mDom(dTitle, { h: '100%' }); mFlexV(dMenu); mStyle(dMenu, { gap: 14 });
  let d1 = mDiv('dMain'); mFlex(d1);
  UI.coll.rows = 5; UI.coll.cols = 7;
  UI.coll.grid = mGrid(UI.coll.rows, UI.coll.cols, d1, { 'align-self': 'start' });
  UI.coll.cells = [];
  let bg = mGetStyle('dNav', 'bg');
  for (let i = 0; i < UI.coll.rows * UI.coll.cols; i++) {
    let d = mDom(UI.coll.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    UI.coll.cells.push(d);
  }
  collInitCollection(valf(localStorage.getItem('collection'), 'animals'));
}
async function prelims(timing='new') {
	let t1 = performance.now();

	Serverdata = await mGetRoute('session'); //session ist: users,config,

	let t2 = performance.now();

	await loadAssets(timing);

	let t4 = performance.now();

	sockInit();

	UI.nav = showNavbar();
	UI.user = mCommand(UI.nav.r, 'user', null, onclickUser); iDiv(UI.user).classList.add('activeLink');
	UI.gadgetUsername = mGadget('username',{right:0,top:30});

	await switchToUser(localStorage.getItem('username'));

	let t5 = performance.now();

	//downloadAsYaml(M,'mnew'); 
	// for (s of 'Clientdata DA Items M Serverdata Session Socket TO U UI Z'.split(' ')) conslog(s)
	// console.log(`session:${Math.round(t2 - t1)} \nload:${Math.round(t3 - t2)} \nfast load:${Math.round(t4 - t3)} \nsock+rest:${Math.round(t5 - t4)}`)
	console.log(`total prelims time:${Math.round(t5 - t1)}`);

}
async function postUserChange(data) {
	data = valf(data, U)
	return Serverdata.users[data.name] = await mPostRoute('postUser', data);
}
function removeChildrenFromIndex(element, startIndex) {
	// Ensure the element is valid
	if (!element || !element.children || startIndex < 0) {
		console.error('Invalid arguments');
		return;
	}

	// Remove children starting from the specified index
	while (element.children.length > startIndex) {
		element.removeChild(element.children[startIndex]);
	}
}
async function resizeImage(img, newHeight) {
	return new Promise((resolve, reject) => {
		//console.log('resizing...')
		const aspectRatio = img.width / img.height;
		const newWidth = aspectRatio * newHeight;
		const canvas = document.createElement('canvas');
		canvas.width = newWidth;
		canvas.height = newHeight;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, newWidth, newHeight);
		const resizedDataURL = canvas.toDataURL('image/png');
		img.onload = function () {
			img.onload = null;

			let data = { message: 'hallo' };
			resolve(data);
		};
		img.onerror = function (error) { console.log('error', error); reject(error); };
		img.src = resizedDataURL;
	});
}
function rotateImage(img, degree) {
	let canvas = mBy('canvas')
	var ctx = canvas.getContext('2d');
	var cw, ch, cx, cy;
	//var cw = img.width/2, ch = img.height/2, cx = 0, cy = 0;

	//   Calculate new canvas size and x/y coorditates for image
	switch (degree) {
		case 90:
			cw = img.height / 2;
			ch = img.width / 2;
			cx = 100; //(img.width/2);
			cy = 100; //(img.height/2) * (-1);
			break;
		case 180:
			cx = img.width * (-1);
			cy = img.height * (-1);
			break;
		case 270:
			cw = img.height;
			ch = img.width;
			cx = img.width * (-1);
			break;
	}

	//  Rotate image            
	canvas.setAttribute('width', cw);
	canvas.setAttribute('height', ch);

	degree = 20;
	cw = img.height / 2;
	ch = img.width / 2;
	cx = 100; //(img.width/2);
	cy = 100; //(img.height/2) * (-1);
	//ctx.rotate(degree * Math.PI / 180);
	//cContext.drawImage(img, cx, cy);
	//console.log('dim',cx,cy,cw,ch);
	ctx.fillStyle = 'red';
	ctx.fillRect
	//ctx.drawImage(img, cx, cy,cw,ch);

	//downloadCanvas(canvas);
	//document.getElementById('download').setAttribute('href',canvas.toDataURL())
}
async function saveCiv(name, sz = 800) {

	let dParent = mBy('dMain');
	let img = mDom(dParent, {}, { tag: 'img', src: `../assets/games/nations/civs/${name}.jpg`, height: sz });
	img.style.transform = `rotate(90deg) translateY(-${sz}px)`;
	img.style.transformOrigin = 'top left';

	img.onload = async () => {
		const canvas = document.createElement('canvas');
		mAppend(dParent, canvas);
		console.log('w,h', img.width, img.height);
		canvas.width = img.height;
		canvas.height = img.width;
		const ctx = canvas.getContext('2d');

		// ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transformation matrix
		// ctx.translate(0, 800); // Apply the translation
		// ctx.rotate((90 * Math.PI) / 180); // Apply the rotation
		ctx.drawImage(img, 0, 0, 800, 400); // Draw the image


		//ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		const dataUrl = canvas.toDataURL('image/png');
		return dataUrl;

	};

	return;

	img.onload = async () => {

		let dataUrl = imgToDataUrl(img);
		let unique = `civ_${name}_${rName()}`;
		let o = { image: dataUrl, name: name, unique: unique, coll: 'nations', path: unique + '.png', ext: 'png' };
		console.log('dataUrl');
		let resp = await mPostRoute('postImage', o);
		console.log('resp', resp)
	};

}
async function saveCanvas() {
	let o = { key: k, src: src, color: color, path: `y/nat/${type}/${k}.png` }; addKeys(res, o); result.push(o);
	await imgToServer(o.cv, o.path);
}
async function serverUpdate(route, o) { Serverdata = await uploadJson(route, o); }
function showWheel(list, bg) {
	mClear('dMessage');
	let dw1 = mDom('dMessage', { display: 'flex', 'flex-wrap': 'wrap', gap: 5, bg: bg, matop: 5, padding: 5 });
	for (const x of list) { mDom(dw1, { w: 90, h: 50, bg: x, fg: idealTextColor(x.substring(0, 7)) }, { html: x }); }
	return dw1;
}
function showSidebar(dParent) {

	dSidebar = mDom(dParent, { 'align-self': 'stretch', hmin: '100vh' }, { id: 'dSidebar' });
	dLeiste = mDiv(dParent);
	mStyle(dLeiste, { wmin: 70, hmin: '100vh', display: 'flex', 'flex-flow': 'column wrap' });
	//da kommen jetzt die tools drauf!

	//wenn ich eines selecte kann ich edit,remove,delete,edit categories,edit name,add to collection machen
	//wenn ich mehrere selecte kann ich remove,delete,add category,add to collection machen

	//soll jetzt ein user sich ausweisen muessen? ja mindestens einloggen!

}
function sortKeysAlphabetically(dinew) {
	let keys = Object.keys(dinew); keys.sort();
	let difinal = {};
	for (const k of keys) {
		difinal[k] = dinew[k];
	}
	return difinal;
}
async function srcToDataUrl(src, h) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "Anonymous"; // Enable cross-origin resource sharing (CORS) for the image
		img.onload = function () {
			// Calculate new width and height while preserving aspect ratio
			let aspectRatio, newWidth, newHeight;
			if (isdef(h)) {
				aspectRatio = img.width / img.height;
				newHeight = h;
				newWidth = aspectRatio * newHeight;
			} else {
				newHeight = img.height;
				newWidth = img.width;
			}
			const canvas = document.createElement('canvas');
			canvas.width = newWidth;
			canvas.height = newHeight;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, newWidth, newHeight);
			const dataUrl = canvas.toDataURL('image/png');
			resolve(dataUrl);
		};
		img.onerror = function (error) {
			reject(error);
		};
		img.src = src;
	});
}
function style_not_playing(item, game, list) {
	let ui = iDiv(item); let uname = ui.getAttribute('username');
	mStyle(ui, { bg: 'transparent', fg: 'black' });
	arrLast(arrChildren(ui)).innerHTML = uname;
	item.ifunc = 0; item.playmode = 'none'; removeInPlace(list, item);
	item.isSelected = false;
}
function style_playing_as_bot(item, game, list) {
	let ui = iDiv(item); let uname = ui.getAttribute('username'); let bg = getGameColor(game);
	mStyle(ui, { bg: bg, fg: colorIdealText(bg) });
	arrLast(arrChildren(ui)).innerHTML = uname.substring(0, 3) + 'bot';
	item.ifunc = 2; item.playmode = 'bot';
	item.isSelected = true;
}
function style_playing_as_human(item, game, list) {
	//console.log('item',item,game,list)
	let ui = iDiv(item); let uname = ui.getAttribute('username');
	let color = getUserColor(uname);
	mStyle(ui, { bg: color, fg: colorIdealText(color) });
	arrLast(arrChildren(ui)).innerHTML = uname;
	item.ifunc = 1; item.playmode = 'human'; list.push(item);
	item.isSelected = true;
}
async function uploadAll(data, path, mode = 'w') {
	//a ... append text/json
	//w ... override text/json
	//wi ... override image (in this case data param should be img!!!)
	//ay ... append as yaml mit addKeys (existing keys ignored!)
	//wy ... append as yaml mit copyKeys (existing keys overwritten!)
	//oy ... override yaml
	//as ... addKeys to session object
	//ws ... copyKeys to session object
	//ac ... addKeys to config object and save config
	//wc ... copyKeys to config object and save config
	//_ac ... addKeys to config object without saving!!!
	//_wc ... copyKeys to config object without saving!!!
	//c ... ac
	//s ... as
	//ss ... save session
	let o;
	if (mode == 'wi') {
		//data interpreted as img!!!!
		let dataUrl = imgToDataUrl(data);
		o = { data: { image: dataUrl }, path: path, mode: 'wi' };

	} else o = { path: path, data: o, mode: mode };
	let resp = await uploadJson('save', o)
	console.log('response', resp);

}
async function uploadImg2(img, path) {
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	const dataUrl = canvas.toDataURL('image/png');
	//console.log(dataUrl);
	let o = { data: { image: dataUrl }, path: valf(path, 'out.png'), mode: 'wi' };

	return await uploadJson('save', o);
	let server = getServerurl();
	server += `/save`;
	const response = await fetch(server, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors',
		body: JSON.stringify(o)
	});
	return await response.json();
}
async function uploadJson(route, o) {
	let server = getServerurl();
	server += `/${route}`;

	try {
		const response = await fetch(server, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			mode: 'cors',
			body: JSON.stringify(o)
		});

		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			return 'ERROR 1';
		}
	} catch (error) {
		return 'ERROR 2';
	}
}
//#region colors
function sortByHue(colors) {
	const hslColors = colors.map(AhexToHSL);
	hslColors.sort((a, b) => a.hue - b.hue);
	const sortedHexColors = hslColors.map(AhslToHex);
	return sortedHexColors;
}
function isGrayColor(color, diff = 60) {
	const rgb = AhexToRgb(color);
	//return rgb.r === rgb.g && rgb.g === rgb.b;

	return Math.abs(rgb.r - rgb.g) + Math.abs(rgb.r - rgb.b) + Math.abs(rgb.g - rgb.b) < 3 * diff;
}
function AhexToHSL(hex) {
	const rgb = AhexToRgb(hex);
	const hsl = ArgbToHsl(rgb.r, rgb.g, rgb.b);
	return hsl;
}
function AhslToHex(hsl) {
	const rgb = AhslToRgb(hsl.hue, hsl.saturation, hsl.lightness);
	return ArgbToHex(rgb.r, rgb.g, rgb.b);
}
function AhexToRgb(hex) {
	// Remove the hash character if present
	hex = hex.replace(/^#/, '');

	// Parse the hex values to RGB
	const bigint = parseInt(hex, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return { r, g, b };
}
function ArgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max === min) {
		h = s = 0;
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6;
	}

	return { hue: h, saturation: s, lightness: l };
}
function AhslToRgb(h, s, l) {
	let r, g, b;

	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
function ArgbToHex(r, g, b) {
	return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

//#endregion

//#region fleetingMessage
function clearFleetingMessage() {
	if (isdef(dFleetingMessage)) {
		dFleetingMessage.remove();
		dFleetingMessage = null;
	}
}
function showFleetingMessage(msg, dParent, styles = {}, ms = 3000, msDelay = 0, fade = true) {
	clearFleetingMessage();

	dFleetingMessage = mDiv(dParent);
	if (msDelay) {
		TOFleetingMessage = setTimeout(() => fleetingMessage(msg, dFleetingMessage, styles, ms, fade), msDelay);
	} else {
		TOFleetingMessage = setTimeout(() => fleetingMessage(msg, dFleetingMessage, styles, ms, fade), 10);
	}
}
function mFleetingMessage(msg, styles, ms, fade) {
	if (isString(msg)) {
		dFleetingMessage.innerHTML = msg;
		mStyle(dFleetingMessage, styles);
	} else {
		mAppend(dFleetingMessage, msg);
	}
	if (fade) Animation1 = mAnimate(dFleetingMessage, 'opacity', [1, .4, 0], null, ms, 'ease-in', 0, 'both');
	return dFleetingMessage;
}
//#endregion

























