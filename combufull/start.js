onload = start;

async function start() { test40_socketio(); }

async function test40_socketio() {

	await prelims();

	console.log('Serverdata',Serverdata)
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
function showChatMessage() {
	for (const arg of [...arguments]) {
		console.log('arg', arg);
		let d = mBy('dChatWindow');
		if (d) mDom(d, {}, { html: arg })
	}
}
async function test39_calendar() {
	await prelims();
	UI.nav.activate('schedule'); onclickSchedule();
}
async function test38_newprelims() {
	if (nundef(M.superdi)) {
		Serverdata = await mGetRoute('session');
		await loadCollections();
		loadPlayerColors();

		let nav = UI.nav = mNavbar('dNav', {}, 'COMBU', ['add', 'play', 'schedule', 'view', 'colors']);
		nav.disable('play');

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })

		dUser = mDom(nav.ui, {}, { id: 'dUser' });

		U = getUser(localStorage.getItem('username'));
		await showUser(U ? U.name : null);
	}
}
async function YES_test37_allesNeu() {
	Serverdata = await mGetRoute('config');
	console.log('Serverdata', Serverdata);

	//change something in Serverdata
	//repost Serverdata
	Serverdata.users.max = { name: 'max', color: 'orange' };
	Serverdata = await mPostRoute('postConfig', Serverdata);
	console.log('updated', Serverdata.users.max);
}
async function prelims() {
	if (nundef(M.superdi)) {
		Serverdata = await mGetRoute('session');
		await loadCollections();
		loadPlayerColors();

		let nav = UI.nav = mNavbar('dNav', {}, 'COMBU', ['add', 'play', 'schedule', 'view', 'colors']);
		nav.disable('play');

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })

		dUser = mDom(nav.ui, {}, { id: 'dUser' });

		U = getUser(localStorage.getItem('username'));
		await showUser(U ? U.name : null);

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



