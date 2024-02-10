async function test7() {
	await prelims();

	window.onkeydown = keyDownHandler;
	window.onkeyup = keyUpHandler;

	await switchToMenu(UI.nav,'collections');
	onclickNewCollection('owls')
	//await switchToUser();

}
async function test6(){
	//prelimsfast kann man auch so machen: load m.yaml, mach die schleiffe

	//await prelims('slow');
	await prelims('fast');
	// await prelims('new');
	console.log('M',M)


}
async function test5_performance(){
	//await prelims();
	await prelims('slow');

	//fuer alle values in byCollection, add key to superdi.coll
	//coll in superdi wird eine list!
	let dinew={};
	for(const coll in M.byCollection){
		for(const k of M.byCollection[coll]) {
			let o=M.superdi[k];
			let onew=dinew[k]={};
			if (nundef(o.coll)) o.coll = coll;
			for(const prop in o){
				if (prop == 'coll') {lookupAddIfToList(onew,['colls'],o.coll); continue;}
				if (prop == 'img'){
					if (isdef(o.path)) onew.img = o.path;
					else if (!o.img.includes('/')) {console.log('img prop is NOT a path',o); return;}
					continue;
				}
				if (prop == 'path' && nundef(o.img)) {console.log('path without img',o); return;}
				if (['ext','key','path'].includes(prop)) continue;
				onew[prop]=o[prop];
			}
		}
	}

	//add c52 mit svg to dinew
	//add civs to dinew! =>nations_progress,nations_civs,nations_events
	//sort dinew by key!!!!
	//=>ich hab einfach nur ein superdi und sonst nichts!

	let m={superdi:dinew};

	//downloadAsYaml(m,'superdi');
	return;

	//hier werden diColl,diFriendly und diCat generiert!!!!!
	let t1 = performance.now();
	let t5 = performance.now();
	console.log(`test time:${Math.round(t5 - t1)}`);

	console.log(dinew);
}
async function test4() {
	await prelims();

	window.onkeydown = keyDownHandler;
	window.onkeyup = keyUpHandler;

	await switchToMenu(UI.nav,'collections');
	onclickNewCollection('hallo')
	//await switchToUser();

}
async function test3_modal(){
	await prelims();

	onclickUser();
}
async function test2_modal(){
	let gadget = UI.gadget; //mModalInput('username',{right:0,top:50});
	let res = await mPrompt(gadget);
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
	await prelims();

	showNavbar();

	//jetzt brauch ich einen user!!!!
	//await switchToUser('felix')



}
