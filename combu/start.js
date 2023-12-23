onload = start;

async function start() { test48_nationsLoadCardInfo(); } //test42_toolbar(); }

//#region nations tests
async function test48_nationsLoadCardInfo(){
	let listOfTypes = ['advisor','battle','building','colony','event','military','natural','war','wonder'];
	let text = await mGetText('../assets/games/nations/advisor.csv');
	let list = csv2list(text, hasHeadings = true);
	console.log('list',list);
}
async function test47_oneCard(){
	await prelims();
	showTitle('NATIONS!!!');
	let age=1,name='axeman';
	await loadImageAsync(`../assets/games/nations/cards/age${age}_${name}.jpg`,mDom('dMain',{},{tag:'img'}));

	let miltext = await mGetText('../assets/games/nations/military.csv');
	let list = csv2list(miltext, hasHeadings = true);
	console.log('list',list);

	let info = list.find(x=>x.Name.toLowerCase() == name);
	console.log('info',info)

}
async function test46(){
	//just show a civ
	await prelims();
	await onclickNATIONS();

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



