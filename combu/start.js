onload = start;

async function start() { test41_allNewApp(); }

async function test41_allNewApp(){
	await prelims();
	onclickSchedule();
	//was will ich als naechstes? fix calendar!
}

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
	
		let dChat = mDom('dChat');
		UI.chatInput = mInput(dChat, {}, '<your message>', 'input');
		UI.chatWindow = mDom(dChat, { hmax: 300 }, { id: 'dChatWindow' });
		mOnEnter(UI.chatInput, ev => Socket.emit('message', ev.target.value));
	
	}
}



