onload = start;

async function start() { TESTING = false; await prelims(); await switchToMenu(UI.nav, 'play'); }
async function start() { TESTING = true; test51(); }//test47_olist(); }

async function test51() {
	await prelims(); 
	let table = await testShowFirstTableFelixAmanda(); if (nundef(table)) return;
	testShowTestButtons(table);
	await switchToTables();
	await clickOnGame('setgame'); //how do I click on the div with attr gamename setgame
	//await clickOnPlayer(getUname());

	//was soll fuer ein player menu kommen?
	//wie mach ich einen dialog?

	




	// console.log('game',Serverdata.config.games[table.game]);
}
async function test50() {
	await prelims();
	let table = await testShowFirstTableFelixAmanda(); if (nundef(table)) return;
	testShowTestButtons(table);

	console.log('game',Serverdata.config.games[table.game]);
}
async function test49() {
	await prelims();
	let table = await testShowFirstTableFelixAmanda(); if (nundef(table)) return;
	testShowTestButtons(table);
}

async function test48() {
	await prelims();
	await testShowFirstTableFelixAmanda();
	testShowTestButtons();

		// table.fen.deck = []; await sendMergeTable();
	// let tnew = jsCopy(table); tnew.status = 'over'; await mPostRoute('mergeTable', tnew);
	// let x = mergeCombine(table, tnew); console.log(x.status, x.turn)

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
async function testOnclickDeck0(){
	let tnew = jsCopy(Clientdata.table);
	tnew.fen.deck=[]; 

	//let x=deepmergeOverride(Clientdata.table,tnew); console.log(x.fen.deck); return;
	let res = await sendMergeTable(tnew);
	console.log('res',res.fen.deck)
}
function testShowTestButtons(table) {
	let dExtra = mDom('dExtra', { display: 'flex', gap: 10 });
	UI.bTestBot=mButton('bot', testOnclickBot, dExtra);
	//mButton('hybrid', onclickHybrid, dExtra);
	UI.bTestHuman=mButton('human', testOnclickHuman, dExtra);
	UI.bTestFelix=mButton('felix', testOnclickFelix, dExtra);
	UI.bTestAmanda=mButton('amanda', () => switchToUser('amanda'), dExtra);

	let [name,playmode]=[getUname(),getPlaymode(table)];
	if (name == 'felix')	mStyle(UI.bTestFelix,{bg:'red',fg:'white'});
	else if (name == 'amanda')	mStyle(UI.bTestAmanda,{bg:'red',fg:'white'});

	if (playmode == 'bot')	mStyle(UI.bTestBot,{bg:'red',fg:'white'});
	else if (playmode == 'human')	mStyle(UI.bTestHuman,{bg:'red',fg:'white'});
	//else if (playmode == 'hybrid')	mStyle(UI.bTestHybrid,{bg:'red',fg:'white'});
	//mButton('deck 0', testOnclickDeck0, dExtra);
}
async function testShowFirstTableFelixAmanda() {
	await switchToOtherUser('amanda', 'felix');
	await switchToMenu(UI.nav, 'play');
	let table = lookup(Serverdata.tables, [0]); //console.log('table',table); return;
	if (table) await onclickTable(table.id);
	return Clientdata.table;

}
async function testOnclickBot(ev){
	//unselect bot and human buttons (TODO: hybrid)
	for(const b of [UI.bTestBot,UI.bTestHuman,UI.bTestHybrid]){
		if (isdef(b)) mStyle(b,{bg:'silver',fg:'black'});
	}
	mStyle(UI.bTestBot,{bg:'red',fg:'white'});
	await onclickBot();
}
async function testOnclickHybrid(ev){
	//unselect bot and human buttons (TODO: hybrid)
	for(const b of [UI.bTestBot,UI.bTestHuman,UI.bTestHybrid]){
		if (isdef(b)) mStyle(b,{bg:'silver',fg:'black'});
	}
	mStyle(UI.bTestHybrid,{bg:'red',fg:'white'});
	await onclickHybrid();
}
async function testOnclickHuman(ev){
	//unselect bot and human buttons (TODO: hybrid)
	for(const b of [UI.bTestBot,UI.bTestHuman,UI.bTestHybrid]){
		if (isdef(b)) mStyle(b,{bg:'silver',fg:'black'});
	}
	mStyle(UI.bTestHuman,{bg:'red',fg:'white'});
	await onclickHuman();
}
async function testOnclickFelix(ev){
	//unselect bot and human buttons (TODO: hybrid)
	for(const b of [UI.bTestFelix,UI.bTestAmanda,UI.bTestMimi]){
		if (isdef(b)) mStyle(b,{bg:'silver',fg:'black'});
	}
	mStyle(UI.bTestFelix,{bg:'red',fg:'white'});
	await switchToUser('felix');
}
async function testOnclickAmanda(ev){
	//unselect bot and human buttons (TODO: hybrid)
	for(const b of [UI.bTestFelix,UI.bTestAmanda,UI.bTestMimi]){
		if (isdef(b)) mStyle(b,{bg:'silver',fg:'black'});
	}
	mStyle(UI.bTestAmanda,{bg:'red',fg:'white'});
	await switchToUser('amanda');
}















