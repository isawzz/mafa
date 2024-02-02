onload = start;

async function start() { test3_modal(); }

async function test4() {
	await prelimsFast();

	UI.nav = showNavbar();
	UI.user = mCommand(UI.nav.r, 'user', null, onclickUser);

	//jetzt brauch ich einen user!!!!
	//await switchToUser('felix')




}

async function test3_modal(){
	await prelimsFast();

	onclickUser();
}
async function test2_modal(){
	let gadget = mModalInput('username',{right:0,top:50});
	let res = await gadget();
	console.log('username is',res)

}
async function test1_modal(){

	let d=document.body;
	mClear(d);
	let d1=mDom(d,{position:'absolute',top:0,left:0,bg:'silver',w:300,h:200});
	openDialog(d1)

	//let res = await mModal('Enter username');
}
async function test0() {
	await prelimsFast();

	showNavbar();

	//jetzt brauch ich einen user!!!!
	//await switchToUser('felix')



}


async function prelimsFast() {
	let t1 = performance.now();
	Serverdata = await mGetRoute('session'); //session ist: users,config,

	let t2 = performance.now();

	// *** in prelims, uncomment the following lines and comment the line after t3 line! ***
	// await loadCollections();
	// loadPlayerColors();
	// let info = await mGetYaml('../assets/info.yaml');
	// addKeys(info,M);
	// M.c52 = await mGetYaml('../assets/c52.yaml');

	let t3 = performance.now();

	M = await mGetYaml('../odf/mnew.yaml'); //mnew includes natLoadAssets and c52!

	let t4 = performance.now();
	sockInit();
	let t5 = performance.now();

	showNavbar();

	//downloadAsYaml(M,'mnew');
	// for (s of 'Clientdata DA Items M Serverdata Session Socket TO U UI Z'.split(' ')) conslog(s)

	// console.log(`session:${Math.round(t2 - t1)} \nload:${Math.round(t3 - t2)} \nfast load:${Math.round(t4 - t3)} \nsock:${Math.round(t5 - t4)}`)
	// console.log(`total prelims time:${Math.round(t5 - t1)}`);

}
