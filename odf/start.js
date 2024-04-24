onload = start;

async function start() { TESTING = false; await prelims(); await switchToMenu(UI.nav, 'play'); }
async function start() { TESTING = true; test51(); }//test47_olist(); }

async function test51() {
	//TESTING = 'felixAmanda';
	//console.log('T',T)
	await prelims();
	//console.log('T',T)
	//T wird in setPresent gesetzt auf {}
	await switchToOtherUser('mimi', 'amanda','gul');
	await switchToMenu(UI.nav, 'play');
	//await clickOnGame('setgame');
	//await clickFirstTable();
	//await onclickTable('Paris');
}
async function clickFirstTable() {
	let table = Serverdata.tables.find(x => x.status == 'started' && x.playerNames.includes(getUname()));
	//console.log('table',table)
	if (table) { await onclickTable(table.id); return Clientdata.table; }
	//else console.log('no table!',Serverdata.tables)
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

	//let x=rChoose(range(1,100,10)); console.log('x',x);	await mSleep(x);
	// let name=await mGetRoute('lastUser'); console.log('lastUser',name);
	// let uname = name == 'felix'?'amanda':'felix';	//immer verschiedenen user verwenden
	// await switchToUser(uname);

	//await switchToOtherUser('amanda','felix');

	let t5 = performance.now();

	//downloadAsYaml(M,'mnew'); 
	// for (s of 'Clientdata DA Items M Serverdata Session Socket TO U UI Z'.split(' ')) conslog(s)
	// console.log(`session:${Math.round(t2 - t1)} \nload:${Math.round(t3 - t2)} \nfast load:${Math.round(t4 - t3)} \nsock+rest:${Math.round(t5 - t4)}`)
	//console.log(`total prelims time:${Math.round(t5 - t1)}`);

	window.onkeydown = keyDownHandler;
	window.onkeyup = keyUpHandler;

	DA.funcs = { setgame: setgame(), }; //implemented games!
	for (const gname in Serverdata.config.games) {

		if (isdef(DA.funcs[gname])) continue;
		DA.funcs[gname] = defaultGameFunc();
	}
	DA.counter = 0;
	//console.log(DA.funcs);


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
async function testOnclickDeck0() {
	let tnew = jsCopy(Clientdata.table);
	tnew.fen.deck = [];

	//let x=deepmergeOverride(Clientdata.table,tnew); console.log(x.fen.deck); return;
	let res = await sendMergeTable({name:getUname(),id:tnew.id,table:tnew});
	console.log('res', res.fen.deck)
}
function getButtonCaptionName(name){ return `bTest${name}`;}
function getButtonCaptionNames(table){	return isdef(table) ? table.playerNames : ['felix', 'gul', 'amanda', 'lauren', 'mimi'];}
async function testOnclickBot(ev) {
	//unselect bot and human buttons (TODO: hybrid)
	for (const b of [UI.bTestBot, UI.bTestHuman, UI.bTestHybrid]) {
		if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
	}
	mStyle(UI.bTestBot, { bg: 'red', fg: 'white' });
	await onclickBot();
}
async function testOnclickHybrid(ev) {
	//unselect bot and human buttons (TODO: hybrid)
	for (const b of [UI.bTestBot, UI.bTestHuman, UI.bTestHybrid]) {
		if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
	}
	mStyle(UI.bTestHybrid, { bg: 'red', fg: 'white' });
	await onclickHybrid();
}
async function testOnclickHuman(ev) {
	//unselect bot and human buttons (TODO: hybrid)
	for (const b of [UI.bTestBot, UI.bTestHuman, UI.bTestHybrid]) {
		if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
	}
	mStyle(UI.bTestHuman, { bg: 'red', fg: 'white' });
	await onclickHuman();
}
async function testOnclickCaption(ev) {
	let x = ev.target.innerHTML; //console.log(ev.target,'clicked on',x)
	let b = UI[getButtonCaptionName(name)];
	for (const name of getButtonCaptionNames(Clientdata.table)){
		let b=UI[getButtonCaptionName(name)];
		if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
	}
	mStyle(UI[getButtonCaptionName(x)], { bg: 'red', fg: 'white' });
	await switchToUser(x);
}
function testUpdateTestButtons_() {
	//nur den playmode fuer diesen player kann man aendern
	let table = Clientdata.table;
	let id = 'dTestButtons'; mRemoveIfExists(id); let dExtra = mDom('dExtra', { display: 'flex', gap: 10 }, { id });
	let me = getUname();
	let names = getButtonCaptionNames(table);
	for (const name of names) {
		let idname = getButtonCaptionName(name);
		let b = UI[idname] = mButton(name, testOnclickCaption, dExtra);
		if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
	}
	// UI.bTestFelix = mButton('felix', testOnclickFelix, dExtra);
	// UI.bTestAmanda = mButton('amanda', testOnclickAmanda, dExtra);
	// UI.bTestMimi = mButton('mimi', testOnclickMimi, dExtra);
	// if (me == 'felix') mStyle(UI.bTestFelix, { bg: 'red', fg: 'white' });
	// else if (me == 'amanda') mStyle(UI.bTestAmanda, { bg: 'red', fg: 'white' });
	// else if (me == 'mimi') mStyle(UI.bTestMimi, { bg: 'red', fg: 'white' });

	if (nundef(table)) return;
	let playmode = getPlaymode(table, me); //console.log("==>I'm a",playmode)
	if (nundef(playmode)) return;

	UI.bTestBot = mButton('bot', testOnclickBot, dExtra);
	UI.bTestHuman = mButton('human', testOnclickHuman, dExtra);
	if (playmode == 'bot') mStyle(UI.bTestBot, { bg: 'red', fg: 'white' });
	else if (playmode == 'human') mStyle(UI.bTestHuman, { bg: 'red', fg: 'white' });
}
function testUpdateTestButtons() {
	let table = Clientdata.table;
	let id = 'dTestButtons'; mRemoveIfExists(id); let dExtra = mDom('dExtra', { display: 'flex', gap: 10 }, { id });
	let me = getUname();
	let names = isdef(table)? []:['amanda', 'felix', 'lauren', 'mimi', 'gul'];
	for (const name of names) {
		let idname = getButtonCaptionName(name);
		let b = UI[idname] = mButton(name, testOnclickCaption, dExtra);
		if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
	}
	if (nundef(table)) return;

	let playmode = getPlaymode(table, me); 
	if (nundef(playmode)) return;
	mDom(dExtra,{},{html:`I'm a ${playmode}`});
	let caption = `Make me ${playmode == 'bot'?'human':'bot'}`;
	UI.bPlaymode = mButton(caption, testOnclickPlaymode, dExtra); 
}
async function testOnclickPlaymode(ev) {
	let b=UI.bPlaymode;
	let caption = b.innerHTML;
	//console.log('caption',caption,caption.includes('human'))
	if (caption.includes('human')) await onclickHuman(); 
	else await onclickBot(); 
}















