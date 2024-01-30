onload = start;

async function start() { test73_game(); } //test70_game(); } //natCardsFinalProcessing(); } //test69_event(); } 

async function test100_odf(){
	Serverdata = await mGetRoute('session'); //session ist: users,config,
	Info = await mGetYaml('../assets/info.yaml');
	await loadCollections();
	loadPlayerColors();
	sockInit();

	console.log('M',M,'\nServerdata',Serverdata,'\nClientdata',Clientdata,'\nDA',DA,Session,TO,window.TO)

}
async function test78_allcommands(){
	await prelims();
	//let fg=getCSSVariable('--fgButtonHover');	mDom('dMain',{fg:fg},{html:'HALOOOOOOOOOOOO'});	console.log('===>',fg);	console.log('bg',getThemeBg('dMain')); return;
	//let elem=mBy('dNav');	console.log(':::',getStyleProp(elem, 'background-color'),getStyleProp(elem, 'background'));
	// await switchToMenu('home')
	// console.log('logged in as',Clientdata.lastUser,'menu',Clientdata.lastMenu)
	// await switchToUser(U.name == 'felix'?'amanda':'felix');
	// console.log('logged in as',Clientdata.lastUser,'menu',Clientdata.lastMenu)
	// await switchToMenu('play');
	// await switchToTable('Roseau');
	// await switchToUser(U.name == 'felix'?'amanda':'felix');

	//showMessage('HALLO!')

}
async function test77_showTables(){
	await prelims();
	await natLoadAssets(); 
	await natCreateGame();

	await showTables(); return;
}
async function test76_simplestuff(){
	await prelims();
	await switchToUser('mac');
	await switchToMenu('plan');
	//await switchToUser();
}
async function test75_login(){
	await prelims();
	console.log('user is',U.name)
	await switchToUser(U.name == 'felix'?'amanda':'felix');
	console.log('user now:',U.name)
}
async function test74_svgImage(){
	let d=mBy('dMain');
	let img = mDom(d,{h:200},{tag:'img',src:'../assets/games/nations/templates/book.svg'});

}
async function test73_game(){

	//console.log("You are using: " + getBrowser()); console.log('UI',isdef(UI),UI);return;

	await prelims(); if (!U) {console.log('no user!');await switchToUser('felix')}
	await natLoadAssets(); //load nations info: cards.yaml => M.natCards, M.civs

	mButton('START',natCreateGame,'dMain');
}
async function natCreateGame(){
	//felix is starting a nations game:
	let fen = natCreate(U.name,['felix','amanda']); //{felix:{level:'emperor'},lili:{civ:'rome'},lauren:{civ:'mongolia'}});
	let s=JSON.stringify(fen);
	let res=await mPostRoute('postNewTable',{id:fen.id,fen:fen, game:'nations',friendly:generate_table_name(fen.numPlayers)});
	//console.log('res',res)
	//console.log('fen',s.length,fen);
}
async function natGameView(fen,plname){

	clear_timeouts();
	natTitle();
	await natPresent(fen,plname);

	//der rest nur wenn der player turn hat!
	if (!fen.turn.includes(plname)) {

		return;
	}
	selPrep(fen);
	natPreAction()
	//mStyle('dNav',{display:'none'})

}
function natTitle(){
	//aus gamesfull/index.html
	// <div id="dTitle" style="display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; height: 42px; width: 100%">
	// <div id="dTitleLeft" style="display: flex; justify-content: space-evenly; align-items: center; padding-left: 10px"></div>
	// <div id="dTitleMiddle"></div>
	// <div id="dTitleRight" style="min-width: 200px; display: flex; justify-content: end; align-items: center; box-sizing: border-box"></div>
	// </div>
	mClear(dTitle);
	mStyle(dTitle,{display:'flex','justify-content':'space-between','align-items':'center',box:true,h:42,w:'100%'})
	mDom(dTitle,{display:'flex','justify-content':'space-evenly','align-items':'center',paleft:10},{id:'dTitleLeft'})
	mDom(dTitle,{},{id:'dTitleMiddle'})
	mDom(dTitle,{display:'flex','justify-content':'end','align-items':'center',box:true, wmin:200},{id:'dTitleRight'})
}
function natPreAction(){
	let [fen,phase]=[Clientdata.fen,Clientdata.fen.phase];

	//let dInstruction = mBy('dSelections0'); mDom(dInstruction,{h:30},{tag:'img',src:`../assets/games/nations/templates/book.svg`}); return;
	//mDom('dTitleLeft',{bg:mGetStyle(dTitle,'bg'),fg:'contrast'},{html:`age:${fen.age} round:${fen.round} phase: <b style='color:orange'>${phase}</b> player:${U.name}`})
	mDom('dTitleLeft',{bg:mGetStyle(dTitle,'bg'),fg:'contrast'},{html:`Age ${fen.age}.${fen.round}: <b style='color:orange'>${phase}</b> (${U.name})`})

	switch(phase){
		case 'growth': selectAddItems(natSelItemsGrowth(fen), natSelectedGrowth,'g'); break;// 'must select your growth'); break; 
	}
}
function sendMyMove(key){
	let name = U.name;
	let table = Clientdata.fen.id;
	sockPostMove(table,name,key);
}
function natSelectedGrowth(ev){
	let [A, fen] = [Clientdata.A, Clientdata.fen];
	let id=evToId(ev)
	//console.log(id)
	A.selected=A.di[id];
	console.log('selects',A.selected);

	//hier koennt ich jetzt in die commit frage gehen und das selected item einfach nur highlighten, oder direct committen
	//simplest: immediate commit
	//soll fen schon veraendert werden?
	//nein weil sonst koennen collisions passieren!
	//jeder player sendet seinen choice zu server
	//server muss integrieren bis jeder aus turn daten hat
	//dann muss server die neue fen broadcasten
	sendMyMove(A.selected.key)

}
function natSelItemsGrowth(){
	let fen=Clientdata.fen;	let pl=fen.players[U.name];	assertion(pl,`PLAYER DOES NOT EXIST ${U.name}`);

	let items = [], i = 0;
  for (const cmd of ['gold','food','stone','book']) {
    let item = { o: M.superdi[cmd], a: cmd, key: cmd, friendly: cmd, path:null, index:i }; // src: `../assets/games/nations/templates/${cmd}.${cmd=='book'?'svg':'png'}`, index: i };
    i++;
    items.push(item);
  }
	//gibt es fuer diesen player noch extraworkers?
	let w=pl.extraWorkers;
	//console.log('extra workers',w)
	if (!isEmpty(w)) {
		let wWoDuplicates=arrRemoveDuplicates(w);
		//console.log(w.length,wWoDuplicates);
		for(const w1 of wWoDuplicates){
			let item=uiTypeExtraWorker(w1); items.push(item);item.index=i++;
		}
	}
  return items;
}
function selPrep(fen,autosubmit=false){
	Clientdata.A = { level: 0, di: {}, ll: [], items: [], selected: [], tree: null, breadcrumbs: [], sib: [], command: null, autosubmit: autosubmit };
	Clientdata.fen=fen;

}







async function test72_civSpots(){
	await prelims();
	onclickNATIONS();
}
async function test71_civDetect(){

	let orange=`#F17D2D`;
	let blue=`#0F9AD7`;
	let green=`#429F47`; // `#6CAA3F`
	let red=`#BA1B35`;
	let brown=`#996142`; // `#BC6A33`

	M.civs=['america','arabia','china','egypt','ethiopia','greece','india','japan','korea','mali','mongolia','persia','poland','portugal','rome','venice','vikings'];
	let player=M.player = {civ:'persia'}; //rChoose(M.civs)};
	let dciv=mDom('dMain');
	let img=await loadImageAsync(`../assets/games/nations/civs/civ_${player.civ}.png`, mDom(dciv, {position:'absolute'}, { tag: 'img' }));
	let [wImg, hImg] = [img.width, img.height]; //console.log('w', w, 'h', h);

	//find a bar on the board that is orange
	let dParentBad = toElem('dPageTitle');
	let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
	let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
	ctx1.drawImage(img, 0, 0, wImg, hImg);

	// let r=cardRect(ctx1,0,0,orange)
	// console.log('advisor',r); 
	let rAdvisor={x:11,y:27,w:87,h:136}; //von persia
	// rAdvisor={x:10,y:29,w:87,h:137}; //von mongolia
	// rAdvisor={x:12,y:25,w:87,h:136}; //von vikings

	let yUnten=rAdvisor.y+rAdvisor.h+5;
	// let rColony1=cardRect(ctx1,0,yUnten,green)
	// console.log('rColony1',rColony1);
	let rColony1={x:10,y:193,w:87,h:137}; //von japan

	// let xColony2=rColony1.x+rColony1.w+10;
	// let rColony2=cardRect(ctx1,xColony2,yUnten,green)
	// console.log('rColony2',rColony2);
	let rColony2={x:122,y:192,w:87,h:136}; //von india

	// let rBuilding1=cardRect(ctx1,rColony2.x,0,blue)
	// console.log('rBuilding1',rBuilding1);
	// rBuilding1={x:131,y:26,w:88,h:137}; //von america
	let rBuilding1={x:132,y:26,w:87,h:136}; //von portugal

	//let rColonyUpPersia=cardRect(ctx1,rAdvisor.x+rAdvisor.w,0,green)
	let rColonyUpPersia={x:122,y:26,w:87,h:136}; //von portugal
	console.log('rColonyUpPersia',rColonyUpPersia);
	// let rBuilding1Persia=cardRect(ctx1,rAdvisor.x+rAdvisor.w+100,0,blue)
	let rBuilding1Persia={x:243,y:26,w:87,h:136}; //von persia
	console.log('rBuilding1Persia',rBuilding1Persia);

	let xBuilding2=rBuilding1.x+rBuilding1.w+5;
	// let rBuilding2=cardRect(ctx1,xBuilding2,0,blue)
	// console.log('rBuilding2',rBuilding2);
	let rBuilding2={x:243,y:28,w:87,h:136};
	let dxBuildings=rBuilding2.x-(rBuilding1.x+rBuilding1.w);
	console.log('dx buildings',dxBuildings)

	// let rWic=cardRect(ctx1,650,0,brown);
	// console.log('rWic',rWic)
	let rWic={x:700,y:26,w:87,h:136}; //calculated

	let rLastWonder={x:700,y:193,w:87,h:136};

	// let rWonder=cardRect(ctx1,600,180,brown);
	// console.log('rWonder',rWonder)
	let rWonder={x:674,y:193,w:87,h:136};

	let dxWonders=26;

	// let res=findNextBar(ctx1,0,20,60,80,colorRGB(orange,true),10);
	// console.log('res',res)

	// res=findNextBar(ctx1,res.x+20,res.x+150,60,80,colorRGB(orange,true),15);
	// console.log('res',res)
	// //zuerst will ich einen punkt auf x=10,y=200 in rot zeichnen
	// drawPix(ctx1,10,60,'red')
	// drawPix(ctx1,10,220,'red')

	// let res2=findNextBar(ctx1,0,20,220,240,colorRGB(green,true),10);
	// console.log('res',res2)

}
async function test70_game(){
 await prelims();
 onclickNATIONS();
 
}
async function test69_event() {
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml'); return;
	let dParentGood = toElem('dExtra');
	let dParentBad = toElem('dPageTitle');
	DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
	let di = {second_boer_war:'right',opium_war:'right',balkan_wars:'right', antikythera_mechanism:'left',uluru:null,mount_kailash:null,terracotta_army: 'top', uraniborg: 'left', great_barrier_reef: 'right', hawaii:'left' };
	let list=Object.keys(di);
	list=['second_boer_war','opium_war','balkan_wars']; // all done!
	for (const k of list) {
		let card = M.natCards[k];
		let path = `../assets/games/nations/cards/${card.Path}`;
		let type = card.Type;
		let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
		let [wImg, hImg] = [img.width, img.height]; //console.log('w', w, 'h', h);
		let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
		let [wCanvas, hCanvas] = [wImg, hImg];
		let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
		let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
		ctx1.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);

		console.log('____________', k)
		let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
		mDom(dParentGood, { h: 10 });
		let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
		let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
		ctx11.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);

		let noside = di[k];

		let xStart = type == 'war'?20:0;

		let left = noside == 'left' ? 0 : findLeftLine(ctx1, wCanvas, hCanvas, cgoal,xStart); console.log('left', left)
		let right = noside == 'right' ? wCanvas : findRightLine(ctx1, wCanvas, hCanvas, cgoal); console.log('right', right)
		let top = noside == 'top' ? 0 : findTopLine(ctx1, wCanvas, hCanvas, cgoal); console.log('top', top)
		let bot = noside == 'bottom'||type=='war' ? hCanvas : findBottomLine(ctx1, wCanvas, hCanvas, cgoal); console.log('bot', bot)
		let [x1, x2, y1, y2, dx, dy, factw, facth] = [left, right, top, bot, 8, 8, 2, 2];

		if (k == 'hawaii') {dx=16; factw=1.2}
		else if (k.includes('antiky')) {dx=16; factw=1.1; dy=10;}
		ctx.drawImage(cv1, x1, y1, x2 - x1, y2 - y1, dx, dy, w - factw * dx, h - facth * dy);
		let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'maroon', wonder: 'sienna' };
		ctx.strokeStyle = diColors[card.Type];
		ctx.lineWidth = 28;
		ctx.strokeRect(0, 0, w, h);
		await imgToServer(canvas, `y/nat/${type}/${k}.png`);

	}
	function findLeftLine(ct, w, h, cgoal, xStart=0) {

		let [restlist, _] = findPointsBoth(ct, xStart, xStart+40, 0, h, cgoal, 20);
		let o = nextBar(ct, restlist, 'red');
		return o.val;
	}
	function findRightLine(ct, w, h, cgoal) {
		let [restlist, _] = findPointsBoth(ct, w - 40, w, 0, h, cgoal, 20);
		let o = nextBar(ct, restlist, 'orange');
		return o.val;
	}
	function findTopLine(ct, w, h, cgoal) {
		let [_, restlist] = findPointsBoth(ct, 0, w, 0, 40, cgoal, 20);
		let o = nextLine(ct, restlist, 'blue');
		return o.val;
	}
	function findBottomLine(ct, w, h, cgoal) {
		let [_, restlist] = findPointsBoth(ct, 0, w, h - 30, h, cgoal, 20);
		let o = nextLine(ct, restlist, 'green');
		return o.val;
	}
}
async function prelims() {
	if (nundef(M.superdi)) {
		Serverdata = await mGetRoute('session'); //session ist: users,config,
		Info = await mGetYaml('../assets/info.yaml');
		await loadCollections();
		loadPlayerColors();

		showNavbar();

		sockInit();

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })

		await switchToUser(localStorage.getItem('username'));  //danach ist U IMMER gesetzt!!!!
		await switchToMenu('home')

		//showChatWindow();

	}
}



