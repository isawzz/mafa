onload = start;

async function start() { test42_toolbar(); }

async function test42_toolbar(){
	await prelims();

	mStyle('dMain',{bg:'#ffffff40'})
	let dChat = mDom('dRight',{padding:10,fg:'white',box:true},{id:'dChat',html:'Chatbox'});
	//UI.chatInput = mInput(dChat, {}, '<your message>', 'input');
	UI.chatInput = mInput(dChat, { w:260 }, 'inpChat', '<your message>', 'input', 1);
	UI.chatWindow = mDom(dChat, {  }, { id: 'dChatWindow' });
	mOnEnter(UI.chatInput, ev => {
		let inp = ev.target;
		Socket.emit('message', {user:U.name,msg:ev.target.value});
		ev.target.value = '';

	});

	let d=mBy('dToolbar');mFlex(d);mStyle('dToolbar',{gap:12});
	let t1=toggleAdd('left','arrow_left_long',{w:0,wmin:0},{wmin:100});
	let t2=toggleAdd('right','arrow_right_long',{w:0},{w:300});
	// t2.state=0;
	// toggleShow(t2,0)
}

function onclickChat(ev){
	let ison=UI.toggler.toggle('dChat',ev.target);
	let dChat = mDom('dChat');mClear(dChat);
	if (ison){
		mStyle('dPage',{'grid-template-columns':`${UI.toggler.isOn('sidebar')?70:20}px auto 200px`});

		UI.chatInput = mInput(dChat, {}, '<your message>', 'input');
		UI.chatWindow = mDom(dChat, { hmax: 300 }, { id: 'dChatWindow' });
		mOnEnter(UI.chatInput, ev => Socket.emit('message', ev.target.value));
	}else{
		mStyle('dPage',{'grid-template-columns':`${UI.toggler.isOn('sidebar')?70:20}px auto 20px`});

	}

}
async function test41_allNewApp(){
	await prelims();
	await onclickSchedule();
	//was will ich als naechstes? fix calendar!

	// let dParent = document.body;
	// dChatbar = mDom(dParent, { 'float': 'right', w:240, hmin: '100vh', bg:'#ffffff80' }, { id: 'dChatbar' });
  // let d = mDiv(dChatbar);
  // mStyle(d, { wmin: 70, hmin: '100vh', display: 'flex', 'flex-flow': 'column wrap', bg:'#ffffff80' });


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
	
		// let dChat = mDom('dChat');
		// UI.chatInput = mInput(dChat, {}, '<your message>', 'input');
		// UI.chatWindow = mDom(dChat, { hmax: 300 }, { id: 'dChatWindow' });
		// mOnEnter(UI.chatInput, ev => Socket.emit('message', ev.target.value));
	
	}
}



