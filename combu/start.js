onload = start;

async function start() { test48_nationsLoadCardInfo(); } //test42_toolbar(); }

//#region nations tests
async function test48_nationsLoadCardInfo(){
	let listOfTypes = ['advisor','battle','building','colony','military','natural','war','wonder','event'];
	let list=[];
	for(const type of listOfTypes){
		list = list.concat(await natCollectTypes(type));
	}
	let realList = []
	for(const c of list){
		if (isEmpty(c.Name)) console.log('no name',c); else realList.push(c);

	}
	console.log('final',realList.map(x=>x.Name));
	let final = list2dict(realList,'key');
	downloadAsYaml(final,'nationsCards')
	//advisors:battles:32
}
async function natCollectTypes(type){
	let text = await mGetText(`../assets/games/nations/${type}.csv`);
	let list = csv2list(text, hasHeadings = true);
	console.log('list',list.length);
	//let card = rChoose(list);
	//console.log('card',card);
	let diStage = {I:1,II:2,III:3,IV:4,'II II':4};
	let di={},newlist=[];
	for(const card of list){
		if (type == 'event' && (isdef(card['Name of Event 1']) || isdef(card['Name of Event 2']))) {
			let name1= card['Name of Event 1'];
			let name2 = card['Name of Event 2'];
			card.Name = isdef(name1)?name1:isdef(name2)?name2:null;
		}
		if (nundef(card.Name)) {console.log('no',card.Name);continue;}
		let key = normalizeString(card.Name.toLowerCase());
		let age = valf(diStage[card.Stage],0);
		let fname= isdef(card.Stage)? `age${age}_`:'';
		fname+=key; //normalizeString(card.Name.toLowerCase());
		fname+='.jpg';
		//console.log('n',fname);
		card.Path = fname;
		card.Type = type;
		card.key = key;
		if (isdef(age)) card.age = age; else console.log('no age',key)
		if (isdef(di[key])) console.log('duplicate',key)
		di[key]=card;
		newlist.push(card)
	}
	return newlist;
	//downloadAsYaml(list,'cards');

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



