onload = start;

async function start() { test36(); }

async function test36(){
	let d=clearBodyDiv();
	setDrawCard(d,'red_diamond_1_solid');
}
async function test35(){
	await prelims();
	await switchToMenu(UI.nav,'play');
	//how to start a game of set?
	let players = ['amanda','mimi'].map(x=>createHumanPlayer(x));
	await startGame('setgame',players,{winning_score:1});
}

async function test34_makeACard(){
	await loadAssets();
	let d=mDom('dMain',{display:'flex',wrap:true,gap:10,valign:'center',justify:'start'});
	cBlank(d); 
	cRound(d,{w:100,h:100})
	cPortrait(d)
	cLandscape(d)
	//logItems();
	//let c=get_number_card('23_red'); mAppend(d,iDiv(c)); console.log(c);
	let c1=cNumber('24_blue');mAppend(d,iDiv(c1));console.log(c1);

	//cSet
	let cset=cLandscape(d);
	let d1=iDiv(cset);
	let style={w:20,h:30,bg:'indigo'};
	let d2=drawShape('circle', d1, style); mPlace(d2,'cc');
	let d3=drawShape('circle', d1, style); mPlace(d3,'cl',0,10,0);
	let d4=drawShape('circle', d1, style); mPlace(d4,'cr',0,10,0);

	//draw_set_card_test(d)
	
}
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

	DA.funcs={ a_game:a_game(),setgame:setgame(), }; //implemented games!
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
