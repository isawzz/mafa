onload = start;

async function start() { test42_toolbar(); }

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

//function openChat(){mStyle(mBy('dPage')}
async function prelims() {
	if (nundef(M.superdi)) {
		Serverdata = await mGetRoute('session'); //hier wird gesamte session geladen!!!
		await loadCollections();
		loadPlayerColors();

		let nav = UI.nav = mNavbar('dNav', {}, 'COMBU', ['add', 'play', 'schedule', 'view', 'colors']);
		console.log('nav',nav)
		nav.disable('play');

		dUser = mDom(nav.ui, {}, { id: 'dUser' });

		let dt=iDiv(nav);
		console.log('dt',dt)
		let t1=toggleAdd('left','arrow_down_long',dt,{hpadding:9,vpadding:5},{w:0,wmin:0},{wmin:100});
		mInsert(dt.firstChild,t1.button,0)
		let t2=toggleAdd('right','arrow_down_long',dt, {hpadding:9,vpadding:5},{w:0},{w:300});
		//mInsert(dt,t2.button,0)
		// let t2=toggleAdd('right','arrow_right_long',{w:0},{w:300});

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })


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

		//let d=mBy('dToolbar');mFlex(d);mStyle('dToolbar',{gap:12});
		// let t1=toggleAdd(UI.nav,'left','arrow_left_long',{w:0,wmin:0},{wmin:100});
		// let t2=toggleAdd('right','arrow_right_long',{w:0},{w:300});
	
	}
}



