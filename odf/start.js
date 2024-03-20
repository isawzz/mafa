onload = start;

async function start() { test26_userpic(); }

async function test26_userpic(){

	await prelims(); //return;
	let dParent = clearBodyDiv();
	let users = await mGetRoute('users');
	let list = dict2list(users);

	//console.log('users',list);return;
	list=list.filter(x=>isdef(M.superdi[x.key]));
	list.map(x=>x.img=M.superdi[x.key].img)
	assertion(list.every(x=>isdef(x.img)),"FAIL!!!!");

	let user=rChoose(list);

	let key = user.key;
	let img = user.img;

	showImage(key,dParent,{h:200,round:true});
	return;


	//let o = user = userToM(user)
	console.log('name',user.name);
	mDom(dParent,{},{tag:'img',src:user.img})

	let d=mDom(dParent,{w:130,h:130,box:true,rounding:'50%',overflow:'hidden',outline:'solid white 3px'})
	let el = mDom(d, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: user.img });	

	let d1=mDom(dParent,{w:130,h:130,box:true,rounding:'50%',overflow:'hidden',border:'solid white 3px'})
	let el1 = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: user.img });	

	let pic=get_user_pic_and_name(user.name,dParent);
	

	//users sollen auch in superdi sein!!! mit einem spezialtype 'user'
	//oder nicht?
	//gibt es irgendeinen grund dass users nicht in superdi sein sollten?
	//kann ich es auf einfache art getrennt halten?

	//ok ich muss die weireden raushauen!!!

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



}
