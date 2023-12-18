onload = start;

async function start() { test42_toolbar(); }

async function test42_toolbar(){
	await prelims();
	await onclickView();
}

async function test41_allNewApp(){
	await prelims();
	await onclickSchedule();
}

//function openChat(){mStyle(mBy('dPage')}
async function prelims() {
	if (nundef(M.superdi)) {
		Serverdata = await mGetRoute('session'); //hier wird gesamte session geladen!!!
		await loadCollections();
		loadPlayerColors();

		let nav = UI.nav = mNavbar('dNav', {}, 'COMBU', ['add', 'play', 'schedule', 'view', 'colors']);
		nav.disable('play');

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })

		dUser = mDom(nav.ui, {}, { id: 'dUser' });

		let uname = localStorage.getItem('username');
		//console.log('uname',uname)
		if (isdef(uname)) U = await getUser(uname);
		await showUser(uname);

		let server = getServerurl();
		Socket = io(server);
		Socket.on('message', showChatMessage);
		Socket.on('disconnect', x => console.log('>>disconnect:', x));
		Socket.on('update', x => console.log('>>update:', x));
	
		showChatWindow();

		let d=mBy('dToolbar');mFlex(d);mStyle('dToolbar',{gap:12});
		let t1=toggleAdd('left','arrow_left_long',{w:0,wmin:0},{wmin:100});
		let t2=toggleAdd('right','arrow_right_long',{w:0},{w:300});
	
	}
}



