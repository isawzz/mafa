onload = start;

async function start() { test72_civSpots(); } //test70_game(); } //natCardsFinalProcessing(); } //test69_event(); } 

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



