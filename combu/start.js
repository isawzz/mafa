onload = start;

async function start() { test43(); } //test42_toolbar(); }

async function test43(){
	await prelims();

	//onclickPlay
  showTitle('Nations');
  let d = mDom('dMain', { hpadding: 20, display: 'flex', gap: '2px 4px', wrap: true });
	

}
async function test42_toolbar(){
	await prelims();
	await onclickAdd();
	UI.imgName.value='dadadha das ist gut';
	UI.imgColl.value='all';
}

async function test41_allNewApp(){
	await prelims();
	await onclickSchedule();
}

async function prelims() {
	if (nundef(M.superdi)) {
		Serverdata = await mGetRoute('session'); //hier wird gesamte session geladen!!!
		await loadCollections();
		loadPlayerColors();

		showNavbar();

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })

		let uname = localStorage.getItem('username');
		if (isdef(uname)) U = await getUser(uname);
		await showUser(uname);

		let server = getServerurl();
		Socket = io(server);
		Socket.on('message', showChatMessage);
		Socket.on('disconnect', x => console.log('>>disconnect:', x));
		Socket.on('update', x => console.log('>>update:', x));
	
		showChatWindow();

	}
}



