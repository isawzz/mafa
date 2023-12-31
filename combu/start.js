onload = start;

async function start() { test61_lines(); } //test42_toolbar(); }

//#region nations tests
async function test61_lines() {
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	let list = rChoose(Object.keys(M.natCards), 6);
	list = ['aeneid']; //,'hanging_gardens','solomons_temple','university',];//,'','','','','','','',''];
	let dParentGood = toElem('dExtra');
	let dParentBad = toElem('dPageTitle');
	DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
	mDom(dParent,{h:10});
	let dims = {
		advisor: { dx: 150, y: 75, xmin: 80, top: 91, bot: 151 }, 
		golden_age: {diffleft: 91, diffright: 148},
		building: { diffleft: 193, diffright: 84, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }, 
		hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 }, 
		urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
		military: { dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
	};
	for (const k of list) {
		let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentBad);
		let card = M.natCards[k];
		let path = `../assets/games/nations/cards/${card.Path}`;
		let type = card.Type;
		let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
		let [wImg, hImg] = [img.width, img.height]; //console.log('w', w, 'h', h);
		let [cgoal,clight,lighting]=type=='event'?['#6C4F64','#E7BB97',false]:['#59544E','#DBCEBE',true];		
		let cv1 = mDom(dParentGood, {}, { tag: 'canvas', width: wImg, height: hImg });
		let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
		ctx1.drawImage(img, 0, 0, wImg, hImg);
	
		// let [y1,y2,y3,y4]=findDarkLines(ctx1,wImg,hImg,cgoal);
		// console.log(y1,y2,y3,y4);
		// let d1=Math.abs(y1,y2);
		// let toff=d1<24?24-d1:0;

		//let diffleft = 193, diffright = 84;
		let [diffleft,diffright]=isdef(dims[type])?[dims[type].diffleft,dims[type].diffright]:[120,200];
		let [x1,x2,x3,x4,l,m1,m2,r]=findDarkBars(ctx1,wImg,hImg,cgoal,diffleft,diffright);
		//displacement:

		console.log(x1,x2,x3,x4);
		console.log(l,m1,m2,r)
		//console.log(l.val,l.color,m1.val,m1.color,m2.val,m2.color,r.val,r.color);
	}
}
async function mist(){

	let [canvas, ctx, w, h] = await natGetEmptyCardCanvas('dExtra');
	let [rect, cv1, ctx1, tmiss, bmiss, lmiss, rmiss] = await natDetectBB(card, 'dExtra');

		let toff = tmiss ? h - cv1.height : 5;
		let loff = lmiss ? w - cv1.width : 7;
		console.log('_______', k);
		console.log('top edge missing', tmiss);
		console.log('left edge missing', lmiss);

		ctx.drawImage(cv1, loff, toff);
		let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
		ctx.strokeStyle = diColors[card.Type];
		ctx.lineWidth = 28;
		ctx.strokeRect(0, 0, w, h);

		//zuerst rotate canvas!
		mDom('dExtra', { h: 4 })
		let cv2 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
		let ctx2 = cv2.getContext('2d');
		ctx2.translate(h, 0)
		ctx2.rotate(90 * Math.PI / 180);
		ctx2.drawImage(canvas, 0, 0, w, h);

		mDom('dExtra', { h: 4 })
		let cv3 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
		let ctx3 = cv3.getContext('2d');
		ctx3.drawImage(cv2, 0, 0);

		let x = cv3.width / 2;
		let y = cv3.height; // - 10; // Adjust 10 as needed for padding
		ctx3.fillStyle = 'white';
		ctx3.font = '20px Arial';
		ctx3.textAlign = 'center';
		let text = card.Stage;
		ctx3.fillText(text, x, y);

		//ctx3 ist super!
}
async function test60_empty() {
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	let list = rChoose(Object.keys(M.natCards), 6);
	//list = ['university','aeneid','hanging_gardens','solomons_temple'];//,'','','','','','','',''];
	for (const k of list) {

		await doit(k)
	}
}
async function doit(k) {
	//let k = 'solomons_temple'; //'hanging_gardens';
	let [canvas, ctx, w, h] = await natGetEmptyCardCanvas('dExtra');
	let card = M.natCards[k];
	let [rect, cv1, ctx1, tmiss, bmiss, lmiss, rmiss] = await natDetectBB(card, 'dExtra');

	let toff = tmiss ? h - cv1.height : 5;
	let loff = lmiss ? w - cv1.width : 7;
	console.log('_______', k);
	console.log('top edge missing', tmiss);
	console.log('left edge missing', lmiss);

	ctx.drawImage(cv1, loff, toff);
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
	ctx.strokeStyle = diColors[card.Type];
	ctx.lineWidth = 28;
	ctx.strokeRect(0, 0, w, h);

	//zuerst rotate canvas!
	mDom('dExtra', { h: 4 })
	let cv2 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
	let ctx2 = cv2.getContext('2d');
	ctx2.translate(h, 0)
	ctx2.rotate(90 * Math.PI / 180);
	ctx2.drawImage(canvas, 0, 0, w, h);

	mDom('dExtra', { h: 4 })
	let cv3 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
	let ctx3 = cv3.getContext('2d');
	ctx3.drawImage(cv2, 0, 0);

	let x = cv3.width / 2;
	let y = cv3.height; // - 10; // Adjust 10 as needed for padding
	ctx3.fillStyle = 'white';
	ctx3.font = '20px Arial';
	ctx3.textAlign = 'center';
	let text = card.Stage;
	ctx3.fillText(text, x, y);

	//ctx3 ist super!
}
async function mist() {
	ctx2.save();


	let x = canvas.width / 2;
	let y = canvas.height - 10; // Adjust 10 as needed for padding
	ctx2.fillStyle = 'yellow'
	ctx2.translate(x, y);
	ctx2.rotate(-Math.PI / 2);

	ctx2.font = '20px Arial';
	ctx2.textAlign = 'center';
	let text = 'Hello, World!';
	ctx2.fillText(text, x, y);
	//ctx.drawText('I',)
	ctx2.restore();

	//unten in der mitte schreibe das roman numeral!


	// drawPixFrame(ctx, 0, 0, color = 'red', sz = 5) {

	//now draw a frame around

}
async function test59_empty() {
	let src = 'age1_hanging_gardens.jpg', idx = 0;
	let path = `../assets/games/nations/cards/${src}`;
	path = '../assets/games/nations/empty_inner_card.png';
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' })
	mDom(dParent, { h: 10 })
	let [w, h] = [img.width, img.height]; console.log('w', w, 'h', h);
	let canvas = mDom(dParent, {}, { tag: 'canvas', width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });
	ctx.drawImage(img, 0, 0, w, h);
	//img.remove();

	//jetzt paste hanging gardens drauf!
	let k = 'hanging_gardens'
	path = `../assets/games/nations/cards/age1_hanging_gardens.jpg`;
	let [rect, cv] = natDetectBoundingBox('hanging_gardens', src, border, idx, type)

}
async function mist() {
	let dParent = mBy('dExtra');
	let img2 = await imgAsync(dParent, {}, { tag: 'img', src: '../assets/games/nations/empty_inner_card.png' });
	let [w, h] = [img2.width, img2.height]; //das war der fehler!!!!!!!!!!!!!!! omg!!!
	let cv2 = mDom(dParent, {}, { tag: 'canvas', width: w, height: h });
	let ct2 = cv2.getContext('2d', { willReadFrequently: true });
	ct2.drawImage(img2, 0, 0, w, h);

}
async function test58_edgedetect() {
	let type = 'military';
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'brown' };
	let natCards = M.nationsCards = await mGetYaml('../assets/games/nations/cards.yaml');
	let i = 0;
	let list = Object.keys(natCards).filter(x => natCards[x].Type == type);
	//bottom edge missing: handging_gardens, bottom&right: bread_and_games
	//left: antikythera_mechanism, 
	list = ['antikythera_mechanism'];//,'hanging_gardens', 'bread_and_games']; //'solomons_temple']; // 'immortal']; //

	// list = rChoose(Object.keys(natCards),6); //['archer']; 
	//list = Object.keys(natCards).filter(x=>natCards[x].Type != 'event');
	//list = rChoose(list,4); //['archer']; 
	// list.push('trireme');
	let result = [];
	for (const k of list) { //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________', k)
		let c = natCards[k];
		if (c.age == 0) { console.log('age 0', c.key); continue; }
		let src = c.Path;
		let color = diColors[c.Type];
		let res = await natDetectBoundingBox(k, src, color, i++, c.Type);
		if (!res) console.log('NOT FOUND', k); else console.log(res)
		let o = { key: k, src: src, color: color, path: `y/nat/${type}/${k}.png` }; addKeys(res, o); result.push(o);
		// await imgToServer(o.cv,o.path);
	}
	//console.log('result',result[0]);
}

async function test57_military() {
	let type = 'military';
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'brown' };
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards', natCards);
	let i = 0;
	let list = Object.keys(natCards).filter(x => natCards[x].Type == type);
	console.log('list', list);
	let result = [];
	//list =['brewery']; // 'urban_center'];//'university']; //, 'urban_center'];
	//list = ['department_store','coffee_house','hippodrome']; //,]; //['aqueduct','shantytown','coal_mine'];//['coal_mine']; // 
	let dims = {
		advisor: { dx: 150, y: 75, xmin: 80, top: 91, bot: 151 }, building: { dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
		, hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 }, urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
		military: { dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
	};
	for (const k of list) { //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________', k)
		let c = natCards[k];
		if (c.age == 0) { console.log('age 0', c.key); continue; }
		let path = c.Path;
		let color = diColors[c.Type];
		let dim = valf(dims[k], dims[type]);
		let canvas = await natModCard(path, color, i++, dim);
		//result.push({cv:canvas,card:c,path:`y/nat/${type}/${k}.png`});
		console.log('path', path);
		continue;

		let realPath = `y/nat/${type}/${k}.png`;
		if (canvas) { }//await imgToServer(canvas,realPath);
		else {
			let img = await imgAsync('dExtra', {}, { src: path, tag: 'img', id: `im${k}` });
			let cv = imgRotate90(img);
			// await imgToServer(cv,realPath);
		}
		//break;
	}
}
async function saveYamlDictInAlphaOrder(path) {
	if (nundef(path)) path = '../assets/games/nations/cards.yaml';
	let di = await mGetYaml(path);
	console.log('di', di)
	let dinew = {};
	let keys = Object.keys(di);
	keys.sort();
	for (const k of keys) { dinew[k] = di[k] }
	downloadAsYaml(dinew, 'dinew');
}
async function test56_portrait_buildings() {
	//das betrifft NUR den ziggurat
	let type = 'building';
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'brown' };
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards', natCards);
	let i = 0;
	let list = Object.keys(natCards).filter(x => natCards[x].Type == type);
	console.log('list', list);
	let result = [];
	//list =['brewery']; // 'urban_center'];//'university']; //, 'urban_center'];	//list = ['department_store','coffee_house','hippodrome']; //,]; //['aqueduct','shantytown','coal_mine'];//['coal_mine']; // 
	//list = ['adobe'];
	let dims = {
		advisor: { dx: 150, y: 75, xmin: 80, top: 91, bot: 151 }, building: { dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
		, hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 }, urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 }
	};
	for (const k of list) { //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________', k)
		let c = natCards[k];
		if (c.age == 0) { console.log('age 0', c.key); continue; }
		let path = c.Path;
		let color = diColors[c.Type];
		let img = await imgAsync('dExtra', {}, { src: `../assets/games/nations/cards/${path}`, tag: 'img', id: `im${k}` });
		if (img.width > img.height) { img.remove(); continue; }
		let cv = imgRotate90('dExtra', img);
		let realPath = `y/nat/${type}/${k}.png`;
		await imgToServer(cv, realPath);
	}
}
async function test55_buildings() {
	let type = 'building';
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'brown' };
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards', natCards);
	let i = 0;
	let list = Object.keys(natCards).filter(x => natCards[x].Type == type);
	console.log('list', list);
	let result = [];
	//list =['brewery']; // 'urban_center'];//'university']; //, 'urban_center'];
	//list = ['department_store','coffee_house','hippodrome']; //,]; //['aqueduct','shantytown','coal_mine'];//['coal_mine']; // 
	let dims = {
		advisor: { dx: 150, y: 75, xmin: 80, top: 91, bot: 151 }, building: { dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
		, hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 }, urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 }
	};
	for (const k of list) { //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________', k)
		let c = natCards[k];
		if (c.age == 0) { console.log('age 0', c.key); continue; }
		let path = c.Path;
		let color = diColors[c.Type];
		let dim = valf(dims[k], dims[type]);
		let canvas = await natModCard(path, color, i++, dim);
		//result.push({cv:canvas,card:c,path:`y/nat/${type}/${k}.png`});
		console.log('path', path);
		let realPath = `y/nat/${type}/${k}.png`;
		if (canvas) { }//await imgToServer(canvas,realPath);
		else {
			let img = await imgAsync('dExtra', {}, { src: path, tag: 'img', id: `im${k}` });
			let cv = imgRotate90(img);
			// await imgToServer(cv,realPath);
		}
		//break;
	}
}
async function test54_redo_cards() {

	let di = await natLoadCardInfo();
	console.log('list', di);
	//let di = list2dict(list,'key');
	//downloadAsYaml(di,'cards.yaml');
	return;
}
async function test53_advisors() {
	let diColors = { advisor: 'orange', battle: 'grey', building: 'blue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'brown' };
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards', natCards);
	let i = 0;
	let list = Object.keys(natCards).filter(x => natCards[x].Type == 'advisor');
	console.log('list', list);
	let result = [];
	//return;
	for (const k of list) { //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		console.log('___________', k)
		let c = natCards[k];
		//if (c.Type != 'advisor') continue;
		//if (c.age == 0) {console.log('age 0',c.key); continue; }
		let path = c.Path;
		let color = diColors[c.Type];//if (nundef(color)) console.log('no color for',k,c)
		let canvas = await natModCard(path, color, i++);
		result.push({ cv: canvas, card: c, path: `y/advisor/${k}.png` });
		console.log('path', path)
		//await imgToServer(canvas,'combu/img/advisor/'+path);

		//break;
	}
	//console.log('cvs',cvs);
	//let adv=arrLast(result);console.log(adv);
	for (const adv of result) {
		await imgToServer(adv.cv, adv.path);
	}
	//console.log(arrLast(cvs));

}

async function test52_cards() {
	let list1 = ['adobe', 'aeneid', 'antikythera_mechanism', 'aqueduct', 'archer', 'archimedes', 'armenia', 'augustus'];//,'babylonia','battle_of_cannae','battle_of_issus','battle_of_kadesh','battle_of_thermophylae'];
	let list2 = ['skyblue', 'gold', 'gold', 'skyblue', 'red', 'orange', 'green', 'orange'];
	let listrot = [0, -90, 90, 90, 90, 90, 90, 90];
	let listyBound = [true, false, true, true, true, true, true];
	let listxBound = [true, true, false, true, true, true, true];
	let listyExtra = [false, false, true, false, true, false, true];
	let listxend = [true, true, true, true, true, true, false];

	for (let i = 0; i < list1.length - 1; i++) {

		await present(`age1_${list1[i]}`, list2[i], i, listrot[i], listyBound[i], listxBound[i], listyExtra[i], listxend[i]);
		//break;
	}
}
async function test51_cards(name) {
	//do this for each card:
	if (isdef(mBy('img1'))) mBy('img1').remove();
	//let name = `age1_aeneid`;
	let path = `../assets/games/nations/cards/${name}.jpg`;

	let img = await imgAsync(document.body, { position: 'absolute', top: '70vh', h: 200 }, { src: path, tag: 'img', id: 'img1' })
	console.log('img', img)

	let dir = 'portrait';
	let rotate = img.width > img.height;
	let dView = 'dMain';

	let dParent = toElem(dView);
	mClear(dParent);
	let [w, h] = rotate ? [img.height, img.width] : [img.width, img.height];
	// let canvas = mDom(dParent, { border: '10px solid yellow', box:true }, { tag: 'canvas', id: 'canvas',width: w, height: h });
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas', width: w - 4, height: h - 6 });

	let ctx = canvas.getContext('2d');
	if (rotate) {
		ctx.translate(0, img.width);
		ctx.rotate(-90 * Math.PI / 180);
		ctx.translate(-4, 14)
		ctx.drawImage(img, 0, 0, img.width, img.height)
		ctx.beginPath();
		ctx.lineWidth = "10";
		ctx.strokeStyle = "gold";
		ctx.rect(15, -4, 290, 180);
		ctx.stroke();

		// ctx.fillStyle = 'blue';
		// ctx.strokeStyle = 'red';
		// ctx.linewidth = 15;
		// console.log(w,h)
		// ctx.fillRect(0,0,h,w);
		// ctx.strokeRect(0,0,h-15,w-15)
	} else {
		ctx.drawImage(img, 0, 0, img.width, img.height)
	}

	//await imgToServer(canvas,`combu/${name}.png`);
	//await mSleep(1000);
	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);


	//let cv = imgAsCanvas(img,'dMain');
}
async function test50_imgToLandscape() {
	let path = `../assets/games/nations/cards/age1_aeneid.jpg`;
	// let resp = await imgToPortrait(path, 200, 'dMain', true, `combu/age1_aeneid.jpg`);	console.log('resp',resp)
	let resp = await imgToPortrait(path, 200, 'dMain'); console.log('resp', resp);


}
async function test49_schircheCard() {
	let path = '../assets/games/nations/cards/age1_aeneid.jpg';
	//let img = mDom('dMain',{},{tag:'img',src:path});
	let img = await loadImageAsync(path, mDom('dMain', {}, { tag: 'img' }));
	console.log('img', img);


}
async function test47_oneCard() {
	await prelims();
	showTitle('NATIONS!!!');
	let age = 1, name = 'axeman';
	await loadImageAsync(`../assets/games/nations/cards/age${age}_${name}.jpg`, mDom('dMain', {}, { tag: 'img' }));

	let miltext = await mGetText('../assets/games/nations/military.csv');
	let list = csv2list(miltext, hasHeadings = true);
	console.log('list', list);

	let info = list.find(x => x.Name.toLowerCase() == name);
	console.log('info', info)

}
async function test46() {
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



