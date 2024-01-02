onload = start;

async function start() { test58_edgedetect(); } //test42_toolbar(); }

//#region nations tests
async function test58_edgedetect(){
	let type = 'military';
	let diColors = {advisor:'orange',battle:'grey',building:'deepskyblue',colony:'green',event:'purple',golden_age:'gold',military:'red',war:'black',natural:'brown',wonder:'brown'};
	let natCards = M.nationsCards = await mGetYaml('../assets/games/nations/cards.yaml');
	let i=0;
	let list = Object.keys(natCards).filter(x=>natCards[x].Type == type);
	//bottom edge missing: handging_gardens, bottom&right: bread_and_games
	//left: antikythera_mechanism, 
	list = ['antikythera_mechanism','hanging_gardens', 'bread_and_games']; //'solomons_temple']; // 'immortal']; //
	
	// list = rChoose(Object.keys(natCards),6); //['archer']; 
	//list = Object.keys(natCards).filter(x=>natCards[x].Type != 'event');
	//list = rChoose(list,4); //['archer']; 
	// list.push('trireme');
	let result=[];
	for(const k of list){ //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________',k)
		let c=natCards[k];
		if (c.age == 0) {console.log('age 0',c.key); continue; }
		let src = c.Path;
		let color= diColors[c.Type];
		let res = await natDetectBoundingBox(k,src,color,i++,c.Type);
		if (!res) console.log('NOT FOUND',k); else console.log(res)
		let o={key:k,src:src,color:color,path:`y/nat/${type}/${k}.png`}; addKeys(res,o);result.push(o);
		// await imgToServer(o.cv,o.path);
	}
	//console.log('result',result[0]);
}

async function test57_military(){
	let type = 'military';
	let diColors = {advisor:'orange',battle:'grey',building:'deepskyblue',colony:'green',event:'purple',golden_age:'gold',military:'red',war:'black',natural:'brown',wonder:'brown'};
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards',natCards);
	let i=0;
	let list = Object.keys(natCards).filter(x=>natCards[x].Type == type);
	console.log('list',list);
	let result=[];
	//list =['brewery']; // 'urban_center'];//'university']; //, 'urban_center'];
	//list = ['department_store','coffee_house','hippodrome']; //,]; //['aqueduct','shantytown','coal_mine'];//['coal_mine']; // 
	let dims={advisor:{dx:150,y:75,xmin:80,top:91,bot:151},building:{dx:250,y:240,xmin:180,top:176,bot:67}
	,hippodrome:{dx:250,y:230,xmin:180,top:176,bot:67},urban_center:{dx:245,y:230,xmin:180,top:176,bot:67},
	military:{dx:250,y:240,xmin:180,top:176,bot:67}};
	for(const k of list){ //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________',k)
		let c=natCards[k];
		if (c.age == 0) {console.log('age 0',c.key); continue; }
		let path = c.Path;
		let color= diColors[c.Type];
		let dim = valf(dims[k],dims[type]); 
		let canvas = await natModCard(path,color,i++,dim);
		//result.push({cv:canvas,card:c,path:`y/nat/${type}/${k}.png`});
		console.log('path',path);
		continue;

		let realPath = `y/nat/${type}/${k}.png`;
		if (canvas) {}//await imgToServer(canvas,realPath);
		else{
			let img = await imgAsync('dExtra', {}, { src: path, tag: 'img', id: `im${k}` });
			let cv = imgRotate90(img);
			// await imgToServer(cv,realPath);
		}
		//break;
	}
}
async function saveYamlDictInAlphaOrder(path){
	if (nundef(path)) path = '../assets/games/nations/cards.yaml';
	let di = await mGetYaml(path);
	console.log('di',di)
	let dinew = {};
	let keys = Object.keys(di);
	keys.sort();
	for(const k of keys){dinew[k]=di[k]}
	downloadAsYaml(dinew,'dinew');
}
async function test56_portrait_buildings(){
	//das betrifft NUR den ziggurat
	let type = 'building';
	let diColors = {advisor:'orange',battle:'grey',building:'deepskyblue',colony:'green',event:'purple',golden_age:'gold',military:'red',war:'black',natural:'brown',wonder:'brown'};
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards',natCards);
	let i=0;
	let list = Object.keys(natCards).filter(x=>natCards[x].Type == type);
	console.log('list',list);
	let result=[];
	//list =['brewery']; // 'urban_center'];//'university']; //, 'urban_center'];	//list = ['department_store','coffee_house','hippodrome']; //,]; //['aqueduct','shantytown','coal_mine'];//['coal_mine']; // 
	//list = ['adobe'];
	let dims={advisor:{dx:150,y:75,xmin:80,top:91,bot:151},building:{dx:250,y:240,xmin:180,top:176,bot:67}
	,hippodrome:{dx:250,y:230,xmin:180,top:176,bot:67},urban_center:{dx:245,y:230,xmin:180,top:176,bot:67}};
	for(const k of list){ //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________',k)
		let c=natCards[k];
		if (c.age == 0) {console.log('age 0',c.key); continue; }
		let path = c.Path;
		let color= diColors[c.Type];
		let img = await imgAsync('dExtra', {}, { src: `../assets/games/nations/cards/${path}`, tag: 'img', id: `im${k}` });
		if (img.width>img.height) {img.remove(); continue; }
		let cv = imgRotate90('dExtra',img);
		let realPath = `y/nat/${type}/${k}.png`;
		await imgToServer(cv,realPath);
	}
}
async function test55_buildings(){
	let type = 'building';
	let diColors = {advisor:'orange',battle:'grey',building:'deepskyblue',colony:'green',event:'purple',golden_age:'gold',military:'red',war:'black',natural:'brown',wonder:'brown'};
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards',natCards);
	let i=0;
	let list = Object.keys(natCards).filter(x=>natCards[x].Type == type);
	console.log('list',list);
	let result=[];
	//list =['brewery']; // 'urban_center'];//'university']; //, 'urban_center'];
	//list = ['department_store','coffee_house','hippodrome']; //,]; //['aqueduct','shantytown','coal_mine'];//['coal_mine']; // 
	let dims={advisor:{dx:150,y:75,xmin:80,top:91,bot:151},building:{dx:250,y:240,xmin:180,top:176,bot:67}
	,hippodrome:{dx:250,y:230,xmin:180,top:176,bot:67},urban_center:{dx:245,y:230,xmin:180,top:176,bot:67}};
	for(const k of list){ //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________',k)
		let c=natCards[k];
		if (c.age == 0) {console.log('age 0',c.key); continue; }
		let path = c.Path;
		let color= diColors[c.Type];
		let dim = valf(dims[k],dims[type]); 
		let canvas = await natModCard(path,color,i++,dim);
		//result.push({cv:canvas,card:c,path:`y/nat/${type}/${k}.png`});
		console.log('path',path);
		let realPath = `y/nat/${type}/${k}.png`;
		if (canvas) {}//await imgToServer(canvas,realPath);
		else{
			let img = await imgAsync('dExtra', {}, { src: path, tag: 'img', id: `im${k}` });
			let cv = imgRotate90(img);
			// await imgToServer(cv,realPath);
		}
		//break;
	}
}
async function test54_redo_cards() {

	let di = await natLoadCardInfo();
	console.log('list',di);
	//let di = list2dict(list,'key');
	//downloadAsYaml(di,'cards.yaml');
	return;
}
async function test53_advisors(){
	let diColors = {advisor:'orange',battle:'grey',building:'blue',colony:'green',event:'purple',golden_age:'gold',military:'red',war:'black',natural:'brown',wonder:'brown'};
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards',natCards);
	let i=0;
	let list = Object.keys(natCards).filter(x=>natCards[x].Type == 'advisor');
	console.log('list',list);
	let result=[];
	//return;
	for(const k of list){ //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		console.log('___________',k)
		let c=natCards[k];
		//if (c.Type != 'advisor') continue;
		//if (c.age == 0) {console.log('age 0',c.key); continue; }
		let path = c.Path;
		let color= diColors[c.Type];//if (nundef(color)) console.log('no color for',k,c)
		let canvas = await natModCard(path,color,i++);
		result.push({cv:canvas,card:c,path:`y/advisor/${k}.png`});
		console.log('path',path)
		//await imgToServer(canvas,'combu/img/advisor/'+path);

		//break;
	}
	//console.log('cvs',cvs);
	//let adv=arrLast(result);console.log(adv);
	for(const adv of result){
		await imgToServer(adv.cv,adv.path);
	}
	//console.log(arrLast(cvs));

}

async function test52_cards() {
	let list1 = ['adobe','aeneid','antikythera_mechanism','aqueduct','archer', 'archimedes','armenia','augustus'];//,'babylonia','battle_of_cannae','battle_of_issus','battle_of_kadesh','battle_of_thermophylae'];
	let list2 = ['skyblue','gold','gold','skyblue','red', 'orange', 'green','orange'];
	let listrot = [0,-90, 90, 90, 90, 90, 90, 90];
	let listyBound =[true,false,true,true,true,true,true];
	let listxBound =[true,true,false,true,true,true,true];
	let listyExtra =[false,false,true,false,true,false,true];
	let listxend =[true,true,true,true,true,true,false];

	for (let i = 0; i < list1.length-1; i++) {

		await present(`age1_${list1[i]}`, list2[i], i, listrot[i],listyBound[i],listxBound[i],listyExtra[i],listxend[i]);
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



