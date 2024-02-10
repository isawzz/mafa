onload = start;

async function start() { test11_showUrl(); }

async function test11_showUrl(){
	Serverdata = await mGetRoute('session'); //console.log(Serverdata); 
	let url = Serverdata.config.url; //console.log('url',url)
	let d=clearBodyDiv({bg:'pink',padding:12,margin:12,wmin:128,hmin:128,display:'inline-block'});
	ondropShowImage(url,d);

}
async function test10_enableDrop(){
	let d=clearBodyDiv({bg:'pink',padding:12,margin:12,wmin:128,hmin:128,display:'inline-block'});
	enableImageDrop(d,ondropShowImage); //x=>console.log('result',x));

}
async function test9_imgEdit(){
	Serverdata = await mGetRoute('session'); console.log(Serverdata); //session ist: users,config,
	
	let url = Serverdata.config.url; console.log('url',url)

	//drop url onto d
	let d=clearBodyDiv({w:400,h:300,bg:'pink',margin:12});
	mDropZone1(d,ondropShowImage);
	//await ondropShowImage(url,d); //works!
}
async function test8_imgEdit(){

	let d=clearBodyDiv({w:400,h:300,bg:'pink',margin:12});

	//dragdrop img from source
	mDropZone1(d,ondropSaveUrl);


}


async function prelims() {
	let t1 = performance.now();

	Serverdata = await mGetRoute('session'); //session ist: users,config,

	let t2 = performance.now();

	await loadAssets();

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
