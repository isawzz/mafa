onload = start;

async function start() { test73_game(); } //test70_game(); } //natCardsFinalProcessing(); } //test69_event(); } 

async function test73_game(){

	await prelims();
	await natLoadAssets(); //load nations info: cards.yaml => M.natCards, M.civs

	let fen = natCreate(U.name,['felix','lili','amanda']); //{felix:{level:'emperor'},lili:{civ:'rome'},lauren:{civ:'mongolia'}});
	let s=JSON.stringify(fen);
	console.log('fen',s.length,fen);

	await natPresent(fen);

}
async function natPresent(fen){
	let dParent = mDiv('dMain')
	let [owner,players,age,round,phase]=[fen.owner,fen.players,fen.age,fen.round,fen.phase]
	let pl = players[owner];
	let [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(dParent);

	natPresentMarket(dOpenTable,fen.market);
	mDom(dOpenTable, { h: 20,w:'100%' })
	await natPresentCiv(dOpenTable,pl);

	natStats(fen,pl,dRechts)

}
function natStats(fen,pl,dParent){
	let player_stat_items = uiTypePlayerStats(fen,pl,dParent,{},{wmin:260,bg:'beige',fg:'contrast'})
	for (const plname in fen.players) {
		let pl1 = fen.players[plname];
		let item = player_stat_items[plname];
		let d = iDiv(item); mCenterFlex(d); mLinebreak(d);
		//d.style.backgroundImage = `../assets/games/nations/civs/civ_${pl1.civ}.png`;
		d.style.backgroundImage = `url('../assets/games/nations/civs/civ_${pl1.civ}.png')`;
		d.style.backgroundSize = 'cover'

		console.log('pl',pl1)
		playerStatCount('strength', pl1.military, d);
		playerStatCount('stability', pl1.stability, d);
		playerStatCount('gold', pl1.gold, d);
		playerStatCount('food', pl1.food, d);
		playerStatCount('stone', pl1.stone, d);
		playerStatCount('green_book', pl1.book, d);
		playerStatCount('VP', pl1.vp, d);
		playerStatCount('worker', pl1.workers, d);
		//playerStatCount('coin', pl1.gold, d, {fg:'white'});
		// item.dCoin = dCoin.firstChild;
		// item.dAmount = dCoin.children[1];
	}
}
function playerStatCount(key, n, dParent, styles = {}) {
  let sz = valf(styles.sz, 16);
  addKeys({ display: 'flex', margin: 4, dir: 'column', hmax: 2 * sz, 'align-content': 'start', fz: sz, align: 'center' }, styles);
  let d = mDiv(dParent, styles);

	let o=M.superdi[key];
  if (isdef(o)) showImage(key, d, { h: sz, 'line-height': sz, w: '100%' }); //mSym(key, d, { h: sz, 'line-height': sz, w: '100%' });
  else mText(key, d, { h: sz, fz: sz, w: '100%' });
  d.innerHTML += `<span style="font-weight:bold;color:inherit">${n}</span>`;
  return d;
}

function mistStats(){
		if (plname == herald) {
			//console.log('d', d, d.children[0]); let img = d.children[0];
			mSym('tied-scroll', d, { fg: 'gold', fz: 24, padding: 4 }, 'TR');
		}
		if (exp_church(Z.options)) {
			if (isdef(pl.tithes)) {
				player_stat_count('cross', pl.tithes.val, d);

			}
		}
		let dCoin = player_stat_count('coin', pl.coins, d);
		item.dCoin = dCoin.firstChild;
		item.dAmount = dCoin.children[1];

		let list = pl.hand.concat(pl.stall);
		let list_luxury = list.filter(x => x[2] == 'l');
		player_stat_count('pinching hand', list.length, d);
		let d1 = player_stat_count('hand-holding-usd', list_luxury.length, d);
		mStyle(d1.firstChild, { fg: 'gold', fz: 20 })

		if (!isEmpty(fen.players[plname].stall) && fen.stage >= 5 && fen.stage <= 6) {
			player_stat_count('shinto shrine', !fen.actionsCompleted.includes(plname) || fen.stage < 6 ? calc_stall_value(fen, plname) : '_', d);
		}
		player_stat_count('star', plname == U.name || isdef(fen.winners) ? ari_calc_real_vps(fen, plname) : ari_calc_fictive_vps(fen, plname), d);

		if (fen.turn.includes(plname)) {
			show_hourglass(plname, d, 30, { left: -3, top: 0 }); //'calc( 50% - 36px )' });
		}
}
function uiTypePlayerStats(fen,pl, dParent,outerStyles={}, innerStyles = {}) {
	//let player_stat_items = UI.player_stat_items = ui_player_info(dParent); 
	addKeys({dir:'column',display:'flex'},outerStyles);
  // if (nundef(outerStyles.display)) outerStyles.display = 'flex';
  mStyle(dParent, outerStyles);
  let items = {};
  let styles = jsCopy(innerStyles); 
	addKeys({ rounding: 10, bg: '#00000050', margin: 4, padding: 4, patop: 12, box: true, 'border-style': 'solid', 'border-width': 6 }, styles);
  
  let show_first = pl.name;
  let order = arrCycle(fen.plorder, fen.plorder.indexOf(show_first));
	//console.log('order',order)

  for (const name of order) {
    let pl = fen.players[name];
    let imgPath = `../assets/img/users/${pl.icon}.jpg`;
    styles['border-color'] = pl.color;
		let d = mDom(dParent, styles, {id:name2id(name)})
    let picstyle = { w: 50, h: 50, box: true };
    let ucolor = pl.color;
    if (pl.playmode == 'bot') {
      copyKeys({ rounding: 0, border: `double 6px ${ucolor}` }, picstyle);
    } else {
      copyKeys({ rounding: '50%', border: `solid 2px white` }, picstyle);
    }
    let img = mImage(imgPath, d, picstyle, 'img_person');
    items[name] = {div:d,name:name};
  }
  return items;
}
async function natPresentCiv(dParent,pl){
	//erstmal das board
	let dciv = mDom(dParent, { w: 800, h: 420, maleft: 52, bg: 'red', position: 'relative' });
	let iciv = await loadImageAsync(`../assets/games/nations/civs/civ_${pl.civ}.png`, mDom(dciv, { position: 'absolute' }, { tag: 'img' }));

	//hierr kommen jetzt all die cards dazu, extraWorkers adjusten,...
}
function natPresentMarket(dParent,market){
	let d1 = mDiv(dParent); mFlex(d1);
	let [rows,cols]=[3,market.length/3]; 
	let h = 180;

	let dcost = mGrid(rows, 1, d1, { 'align-self': 'start' });
	for (let cost = 3; cost >= 1; cost--) {
		let d2 = mDom(dcost, { display: 'flex', 'justify-content': 'center', 'flex-flow': 'column', box: true, margin: 2, h: h, overflow: 'hidden' }, {});
		for (let i = 0; i < cost; i++) mDom(d2, { h: 40 }, { tag: 'img', src: `../assets/games/nations/templates/gold.png` });
	}

	let grid = mGrid(rows, cols, d1, { 'align-self': 'start' });
	let cells = [];
	for (let i = 0; i < rows * cols; i++) {
		let d = mDom(grid, { box: true, margin: 2, h: h, overflow: 'hidden' });
		mCenterCenterFlex(d);
		cells.push(d);
	}
	let n = rows * cols;
	for (let i = 0; i < n; i++) {
		let k=market[i];
		if (k=='_') continue;
		let img = mDom(cells[i], { h: h, w: 115 }, { tag: 'img', src: `../assets/games/nations/cards/${k}.png` });
		img.setAttribute('key', k)
		img.onclick = buyProgressCard;
	}

}

async function natLoadAssets(){
	if (isdef(M.natCards)) return;
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	M.civs = await mGetYaml('../assets/games/nations/civs.yaml');
	M.civNames = Object.keys(M.civs); // ['america', 'arabia', 'china', 'egypt', 'ethiopia', 'greece', 'india', 'japan', 'korea', 'mali', 'mongolia', 'persia', 'poland', 'portugal', 'rome', 'venice', 'vikings'];
	M.levels = ['chieftain', 'prince', 'king', 'emperor'];

}
function natCreate(owner,players){
	if (isList(players)) {
		let list=players;
		players={};
		list.map(x=>players[x]={});
	}
	let fen={id:rUniqueId(20),owner:owner,players:players}
	let playerNames = fen.playerNames = Object.keys(players);
	let numPlayers = fen.numPlayers = playerNames.length;

	fen.age = 1;
	fen.events = [];
	fen.progress = [];
	for (const k in M.natCards) {
		let c = M.natCards[k];
		if (c.age != fen.age) continue;
		//console.log('k',k)
		if (c.Type == 'event') fen.events.push(k); else fen.progress.push(k);
	}
	arrShuffle(fen.progress);
	fen.progress = arrTake(fen.progress,42);//brauch nicht mehr als 2x full market
	arrShuffle(fen.events);
	fen.market = [];
	for(let i=0;i<21;i++) {
		let k=fen.progress.shift(); //console.log(k)
		fen.market.push(k); //coin()?'_':k);
	}
	//console.log('fen.market',fen.market); return;
	console.log('prog',arrTake(fen.progress,10))
	let civs = rChoose(M.civNames,numPlayers);
	let i=0;
	for(const name in fen.players){
		let pl=fen.players[name];
		pl.name = name;
		assertion(isdef(Serverdata.users[name]),`unknown user ${name}`);
		addKeys(Serverdata.users[name],pl); //pl.color = lookup(Serverdata.users,[name,'color']);
		if (nundef(pl.civ)) pl.civ=civs[i++];
		if (nundef(pl.level)) pl.level=rChoose(M.levels);
		let civ=M.civs[pl.civ];
		addKeys(civ.res,pl);
		pl.book=0;
		pl.cards=jsCopy(civ.cards);
		pl.extraWorkers=jsCopy(civ.workers);
	}
	let plorder=fen.plorder = jsCopy(playerNames); arrShuffle(plorder);

	fen.round = 1;
	fen.phase = 'market'; // growth newEvent action production turnOrder war events  
	fen.turn = jsCopy(fen.playerNames);

	return fen;
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



