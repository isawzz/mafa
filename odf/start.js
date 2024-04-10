onload = start;

async function start() { TESTING=false;await prelims(); } 
async function start() { TESTING=true; test42(); }

async function test42(){
	await prelims();
	//await switchToOtherUser('amanda','felix');
	await switchToMenu(UI.nav, 'play');
	if (Serverdata.tables.length > 0) await onclickTable(Serverdata.tables[0].id);

	mButton('bot',onclickBot,dExtra)
	mButton('human',onclickHuman,dExtra)
}
async function test41_timer(){
	await prelims();
	let cd = createCountdownG('dMain',{}, 5000, ()=>{console.log('DONE!');removeCountdownG();});
	console.log('timer',cd);
}
async function test40(){
	await prelims();
	await switchToOtherUser('amanda','felix');
	await switchToMenu(UI.nav, 'play');
	if (Serverdata.tables.length > 0) await onclickTable(Serverdata.tables[0].id);

	mButton('bot',onclickBot,dExtra)
	mButton('human',onclickHuman,dExtra)
}

async function test39(){
	await prelims();
	await switchToOtherUser('amanda','felix');
	await switchToMenu(UI.nav, 'play');
	if (Serverdata.tables.length > 0) await onclickTable(Serverdata.tables[0].id);
}
async function test38(){
	await prelims();

	mButton('felix',()=>switchToUser('felix'),'dExtra')
	mButton('amanda',()=>switchToUser('amanda'),'dExtra')

	await switchToOtherUser('amanda','felix');
	
	// mStyle('dMain',{opacity:0})
	await switchToMenu(UI.nav, 'play');
	if (Serverdata.tables.length > 0) await onclickTable(Serverdata.tables[0].id)
	
	// //return;
	
	// //how to start a game of set?
	// let players = ['amanda', 'mimi'].map(x => createHumanPlayer(x));
	// await startGame('setgame', players, { winning_score: 1 });

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
	//console.log(DA.funcs);


}
function defaultGameFunc() {
	function setup(table) { return { players: table.players, turn: table.owner }; }
	async function activate(table) {console.log('activate for',getUname())}
	function checkGameover(table) { return false; }
	async function present(table) { mClear('dMain'); } //showMessage(`BINGO!!! ${table.friendly} view ${name}: NOT IMPLEMENTED!!!!!`,1000); } 
	async function robotMove(table) {console.log('robot moves for',getUname())}
	async function stepComplete(table,o) {console.log(`integrate if step complete for ${table.friendly}`); }
	return { setup, activate, checkGameover, present, robotMove, stepComplete };
}
