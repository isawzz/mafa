onload = start;

async function start() { test33(); }

async function test33() {
	await prelims(); return;
	await switchToMenu(UI.nav, 'play'); 
	showGameMenu('a_game');

	let id = Serverdata.tables[0].id;
	await onclickTable(id)
}
async function test32_userpics(){
	await prelims(); 

	let users = await mGetRoute('users');
	console.log('users',users);

	let d=mDom('dMain',{display:'flex',gap:6})
	for(const name in users) showUserImage(name,d,40);
}
async function test31_dirpics(){
	await prelims(); 
	await showDirPics(`../assets/img/amanda`,'dMain')
}
async function test30_userdirpics(){
	await prelims(); 
	let imgs=await mGetFiles('../assets/img/users');
	//console.log(imgs); return;
	for(const fname of imgs){
		let src=`../assets/img/users/${fname}`;
		let sz=100;
		let styles = {'object-position': 'center top','object-fit':'cover',h:sz,w:sz,round:true,border:`${rColor()} 2px solid`}
		let img=mDom('dMain',styles,{tag:'img',src}); 

	}
}
async function test29_userpic(){
	await prelims(); 

	let users = await mGetRoute('users');
	console.log('users',users);
	for(const name in users) showUserImage(name,'dMain',40);
}
async function test28_userpic(){
	await prelims(); //return;
	switchToUser('max');

	let users = await mGetRoute('users');
	console.log('users',users);
	showUserImage('amanda','dMain',40);
}
async function test27_userpic(){
	await prelims(); //return;
	switchToUser('max');

	let users = await mGetRoute('users');
	console.log('users',users);

	let u=users.felix; //rChoose(users);	console.log('pick user',u)
	showim1(u.key,'dMain',{round:true,border:`${u.color} 3px solid`});

}
async function test26_userpic(){

	await prelims(); //return;

	switchToUser('max');

	let users = await mGetRoute('users');
	console.log('users',users);

	//let u=rChoose(users);	console.log('pick user',u)

	let src=M.superdi.felix.img;
	let img=mDom('dMain',{round:true,border:'white 3px solid'},{tag:'img',src}); return;

	for(const uname in users){
		let u=users[uname];
		assertion(isdef(u.key),`user ${u.name} has no key!!!!!!!!!!!!!`);
		let d1=mDom('dMain');
		showim(u.key,d1,{sz:100,round:true})
		break;
	}

}
async function test25() {
	await prelims();

	//await natCreateGame();
	await switchToMenu(UI.nav, 'play');
	showGameMenu('bluff')
  //await showTables(); 

	//console.log('events',Serverdata.events,Serverdata)
	//await onclickNewCollection('critters');
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
	console.log(`total prelims time:${Math.round(t5 - t1)}`);

	window.onkeydown = keyDownHandler;
	window.onkeyup = keyUpHandler;

	DA.funcs={ a_game:a_game(), }; //implemented games!
	for(const gname in Serverdata.config.games){

		if (isdef(DA.funcs[gname])) continue;
		DA.funcs[gname] = defaultGameFunc();
	}
	console.log(DA.funcs);


}
function defaultGameFunc(){
	function setup(table) { return {players:table.players,turn:table.owner}; } 
	function checkGameover(table) { return false; }
	function present(table, name) { showMessage(`BINGO!!! ${table.friendly} view ${name}: NOT IMPLEMENTED!!!!!`); } 
	return { setup, checkGameover, present };
}
