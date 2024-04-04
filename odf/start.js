onload = start;

async function start() { test38(); }

async function test38(){
	await prelims();

	mButton('felix',()=>switchToUser('felix'),'dExtra')
	mButton('amanda',()=>switchToUser('amanda'),'dExtra')

	// mStyle('dMain',{opacity:0})
	await switchToMenu(UI.nav, 'play');
	await onclickTable(Serverdata.tables[0].id)
	
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
	//UI.gadgetUsername = mGadget('username', { right: 0, top: 30 });

	await switchToUser(localStorage.getItem('username'));

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
	async function stepComplete(table,o) {console.log(`integrate if step complete for ${table.friendly}`); }
	return { setup, activate, checkGameover, present, stepComplete };
}
