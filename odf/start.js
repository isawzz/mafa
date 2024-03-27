onload = start;

async function start() { test33(); }

async function test33() {
	await prelims(); 
	await switchToMenu(UI.nav, 'play'); 
	showGameMenu('a_game');

	// let id = Serverdata.tables[0].id;
	// await onclickTable(id)
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

	DA.funcs={ a_game:a_game(), }; //implemented games!
	for(const gname in Serverdata.config.games){

		if (isdef(DA.funcs[gname])) continue;
		DA.funcs[gname] = defaultGameFunc();
	}
	//console.log(DA.funcs);


}
function defaultGameFunc(){
	function setup(table) { return {players:table.players,turn:table.owner}; } 
	function checkGameover(table) { return false; }
	function present(table, name) { mClear('dMain'); } //showMessage(`BINGO!!! ${table.friendly} view ${name}: NOT IMPLEMENTED!!!!!`,1000); } 
	return { setup, checkGameover, present };
}
