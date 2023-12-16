async function test40_socketio() {
  await prelims();
  console.log('Serverdata', Serverdata)
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
async function test36_loadAllEvents(){
	await prelims();
}
async function test35_light() {
	await prelims();
	UI.nav.activate('schedule'); onclickSchedule();

	//wie krieg ich das erste event?
	let evs = getEvents();
	if (nundef(evs)) return;
	console.log('events', evs)
	let n = Object.values(evs).length;
	console.log('events for', U.name, evs, n)
	if (n < 2) return;
	let e = Object.values(evs)[1];
	console.log('e', e)
	showEventOpen(e.id);
	// Example usage
	//onclick=openPopup;
	//let d=mPopup('Hallo','dMain',{})
	//M.playerColors.map(x=>console.log(x,colorHSL(x,true).l * 100,colorLum(x,true)))
}
async function test34_colorjs_YES() {
	await prelims();
	UI.nav.activate('schedule'); onclickSchedule();
}
async function test33_colorjs(){
	await prelims();
	UI.nav.activate('schedule');
	onclickSchedule();



	let c,hsl,c1,c2,c3,c4,c5,hsl1,hsl2,hsl3;
	c=U.color;
	hsl=colorHSL(c,true);

	//console.log(colorHex('yellow'))
	function wh(c1,c2){return generateArrayColors(colorHex(c1), colorHex(c2), 10);}
	let wheel = wh(c,'yellow').concat(wh('yellow','red')); //generateArrayColors(c, '#ffff00', 10); //arrRepeat(12,'orange');
	//wheel = wh('yellow','red')

	function whh(c1,c2){return generateArrayColors(colorHex(c1), colorHex(c2), 10);}
	function genc(c,hinc){	let hsl=colorHSL(c,true);return colorHSLBuild((hsl.h+hinc)%360,hsl.s*100,hsl.l*100);}
	function cinc(c,hinc,sinc,linc){let hsl=colorHSL(c,true);return colorHSLBuild((hsl.h+hinc)%360,clamp(hsl.s*100+sinc,0,100),clamp(hsl.l*100+linc,0,100));}
	function arrd(c,hinc,sinc,linc,n){let r=[];for(let i=0;i<n;i++){r.push(cinc(c,hinc*i,sinc*i,linc*i));}return r;}

	function light(c,lper=75){let hsl=colorHSL(c,true);return colorHSLBuild(hsl.h,hsl.s*100,lper);}
	function sat(c,sper=100){let hsl=colorHSL(c,true);return colorHSLBuild(sper,hsl.s*100,hsl.l*100);}
	function hue(c,hdeg){let hsl=colorHSL(c,true);return colorHSLBuild(hdeg,hsl.s*100,hsl.l*100);}

	c=light(c,75);
	c=cinc(c,30,0,0);
	wheel=arrd(c,30,0,0,12);
	console.log(wheel);

	hsl=colorHSL(c,true);
	console.log('hsl',hsl);
	c1=colorHSLBuild(hsl.h,hsl.s*100,hsl.l*100);
	hsl1=colorHSL(c1,true);
	console.log('hsl1',hsl1);
	c2=genc(c1,30); console.log('c2 raw',c2)
	hsl2=colorHSL(c2,true);
	console.log('hsl2',hsl2);

	c3=cinc(c2,30,10,20);
	hsl3=colorHSL(c3,true);
	console.log('hsl3',hsl3);

	//console.log(genc('red',0));
	//return;
	//console.log('wheel',wheel)
	showWheel(wheel, 'white'); // hat 12 colors
}
async function test32_colorjs(){
	await prelims();
	UI.nav.activate('schedule');
	onclickSchedule();

	let wheel = arrRepeat(12,'orange');

	var rainbow = new Rainbow();

	let c1=U.color; //BLUEGREEN;
	console.log('color',c1);
	let c2=getMatchingColor(c1,90);
	let c3=getMatchingColor(c2,90);
	c3=getComplementaryColor(c1);


	//return;

	rainbow.setSpectrum(c1,c3); //rColor(75),rColor(75)); //'red','green'); //'#ffffff', '#3E296B');
	rainbow.setNumberRange(1, 12); 
	//rainbow.colourAt(number); // based on the numbers from your array, this would return the color you want
	wheel=[];
	for(let i=0;i<12;i++) wheel.push('#'+rainbow.colourAt(i));
	//shuffle(wheel)
	console.log('wheel',wheel)

	// wheel = generateGradientColor(colorToNumber('red'),colorToNumber('blue'),5); //rColor(75,.5), rColor(75,.5), 12);
	// console.log('wheel',wheel)
	// wheel=wheel.map(x=>numberToColor(x));
	// console.log('wheel',wheel)
	showWheel(wheel, 'white'); // hat 12 colors
}
async function test31_colorjs(){
	await prelims();
	UI.nav.activate('colors');
	onclickColors();
}
async function test30_palette(){
	let pal = getPalette('red');
	console.log('pal',pal);
	for(const c of pal){
		mDom('dMain',{w:50,h:50,bg:c},{html:c})
	}
	//nimm pal[4]=orig color, pal[2]=dark, pal[6] und pal[7]
	//buildPaletteA('dMain',['violet']);
}
async function test29_user(){
	//localStorage.setItem('username','felix');
	await prelims();
}
async function test28_allColors() {
	await prelims();
	showColors(M.playerColors,onclickColor)
}
function test26_rColors() {
	loadPlayerColors();
	let d = mBy('dMain'); mFlexWrap(d);
	for (const c of plColors) { mDom(d, { w: 90, h: 25, bg: c, fg: 'white' }, { html: colorFrom(c) }); }
}
async function test24_newPrelims(){
	if (nundef(M.superdi)) {
		Config = await mGetYaml('../y/config.yaml');
		M = {};
		M.superdi = await mGetYaml('../assets/superdi.yaml');

		M.byCollection={};
		M.byCat={};
		M.byFriendly={};
		M.collections = ['all'];
		M.categories = [];
		M.names = [];
		for(const k in M.superdi){
			let o = M.superdi[k];
			if (isdef(o.coll)) {lookupAddIfToList(M.byCollection,[o.coll],o.key);addIf(M.collections,o.coll);}
			o.cats.map(x=>{lookupAddIfToList(M.byCat,[x],o.key);addIf(M.categories,x);});
			if (isdef(o.friendly)) {lookupAddIfToList(M.byFriendly,[o.friendly],o.key);	addIf(M.names,o.friendly);}
		}
		M.collections.sort();
		M.categories.sort();
		M.names.sort();

		await updateCollections();

		//console.log('M', M, 'Config', Config);
		let nav = UI.nav = mNavbar('COMBU', ['add', 'play', 'schedule', 'view'], ['user']);
		//console.log('nav',nav)
		nav.disable('play');
		dTitle = mDom(document.body); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
		mInsert(document.body, dTitle, 1);

	}

}
async function test23_integratefa6(){
	await prelims();
	let difa = await mGetYaml('../assets/fa6.yaml');
	for(const k in difa){
		let onew=difa[k];
		let o=M.superdi[k];
		if (nundef(o)) M.superdi[k]=onew;
		else {
			for(const c of onew.cats) addIf(o.cats,c);
			addKeys(onew,o);
		}
	}

	let keys = Object.keys(M.superdi);
	keys.sort();
	let difinal={}
	for(const k of keys){
		difinal[k]=M.superdi[k]
	}
	downloadAsYaml(difinal,'mhuge');

}
async function YES_test22_coolHackFa() {
	await prelims();
	let text = await mGetText('../basejs/alibs/fa/all.css');
	//console.log('text', text.substring(0, 200));

	let lines = text.split('\n');
	//console.log('lines', lines.length);
	let di = {}, codes = {};
	let count = 0;

	let byUni = {};
	for (const k in M.superdi) {
		let o = M.superdi[k];
		if (nundef(o.fa) && nundef(o.ga)) continue;
		let key = (o.fa ?? o.ga).toLowerCase();
		byUni[key] = o;
	}

	//let unicodes = Object.values(M.superdi).filter(x=>isdef(x.fa)||isdef(x.ga)).map(x=>(x.fa??x.ga).toLowerCase());
	//console.log('unicodes',unicodes);
	for (let i = 1; i < lines.length; i++) {
		let l = lines[i];
		let lprev = lines[i - 1];
		if (l.includes('content')) {
			let key = stringAfter(lprev, '.fa-');
			key = stringBefore(key, ':');
			if (key.length == 1) continue;
			let code = stringAfter(l, 'content: "\\');
			code = stringBefore(code, '"')
			if (isdef(codes[code])) continue;
			//if (nundef(byUni[code])) { console.log('new', code) }
			codes[code] = key;
			let o = di[key] = { key: key, code: code, family: 'fa6' };

			//drawFa6(o);

			//if (++count % 9 == 0) mDom('dMain',{},{html:'<br>'});
			if (key == 'level-up-alt' || key == 'turn-up') break;
		}
	}
	//console.log(Object.keys(di))

	let dinew = {};
	let [allnew,same,codeexists,keyexists]=[{},{},{},{}];
	for (const k in di) {
		let k1 = replaceAll(k, '-', '_');
		let o = M.superdi[k1];
		let onew = di[k];
		let code = onew.code;
		//if (k == 'user') {			console.log('user',di[k],M.superdi[k]); return;		}
		if (nundef(o) && nundef(byUni[code])) {
			//console.log('new key w/ new code:', onew);
			allnew[k1]={key:k1,friendly:k,cats:['symbol'],coll:'fa6',fa6:code}
		} else if (nundef(o)) {
			//console.log('code exists in superdi w/ different key', k, code);
			o=byUni[code];
			codeexists[k1]={key:k1,friendly:o.friendly,cats:o.cats,coll:'fa6',fa6:code}
		} else if (isdef(o) && isdef(byUni[code])) {
			//console.log('in superdi w/ same code', k1, code)
			same[k1]={key:k1,friendly:o.friendly,cats:o.cats,coll:'fa6',fa6:code}
		} else if (isdef(o)) {
			let ocode = isdef(o.fa) || isdef(o.ga) ? (o.fa ?? o.ga).toLowerCase() : '';
			keyexists[k1]={key:k1,friendly:o.friendly,cats:o.cats,coll:o.coll,fa6:code}
			//console.log('in superdi w/ diff code', k1, code, ocode)
		}
		//drawFa6(onew); drawFaga(byUni[onew.code]); mDom('dMain')
		//dinew[k1] = di[k];
	}
	console.log('new',Object.keys(allnew))
	console.log('same',Object.keys(same))
	console.log('code exists',Object.keys(codeexists))
	console.log('key exists',Object.keys(keyexists))

	dinew.allnew = allnew;
	dinew.same = same;
	dinew.codeexists = codeexists;
	dinew.keyexists = keyexists;

	//mach besseres friendly!
	let di2={};
	for(const k in dinew){
		let di=dinew[k];
		for(const k1 in di){
			let o=di[k1];
			o.cats.push(k);
			addIf(o.cats,'fa6');

			if (k1.includes('arrow') || (k1.includes('down')||k1.includes('up')) && (k1.includes('left')||k1.includes('right'))) o.friendly='arrow';
			else if (k1.includes('plant')) o.friendly='plant';
			else if (k1.includes('_')) o.friendly = stringBefore(k1,'_');

			di2[k1] = o;
		}
	}
	//mach ein fakeys???

	//console.log(Object.keys(dinew))
	//downloadAsYaml(di2,'fa6')

}
async function test21_user() {
	await prelims();
	let nav = UI.nav.ui;
	console.log('nav', nav)

	html = `
		<li class="nav-item">
			<a class="nav-link a" href="#" onclick="onclickUser()">
				<i class="fa fa-user">
			</a>
		</li>
	`;

	html = `
			<a class="nav-link a" href="#" onclick="onclickUser()">
				<i class="fa fa-user">
			</a>
	`;

	html = `
			<a href="#" onclick="onclickUser()">
				<i class="fa fa-user">
			</a>
	`;
	html = `
				<i class="nav-item nav-link fa fa-user fa-2x">
	`;

	//mDom(nav,{'align-self':'end',fg:'grey'},{html:html}); //`<i class="fa fa-user">`});

	//let fa = mDom(nav,{'align-self':'end',fg:'grey',fz:20,cursor:'pointer'},{tag:'i',className:'nav-item nav-link fa fa-user'}); 

	let styles = { 'align-self': 'end', fg: 'grey', fz: 20, cursor: 'pointer' };
	addKeys({ family: 'fa6' }, styles)
	let fa = mDom(nav, styles, { html: String.fromCharCode('0x' + M.superdi.user.fa) })

	console.log('fa', fa)
}
async function test20_sidebar() {
	onclickView(); //calls showSidebar TODO!
}
async function YES_test19_BEST(){
	let d=mBy('dMain');
	let path = '../y/img/minoutest.png';
	let img = await imgAsync(d,{},{tag:'img',src:path});
	let dataUrl = imgToDataUrl(img);
	let o = { data: {image:dataUrl}, path: path, mode: 'wi' };
	let resp = await uploadJson('save',o)
	console.log('response',resp)
}
async function test18_nochBesser(){
	let d=mBy('dMain');
	let path = '../y/img/minoutest.png';

	let img = await loadImageAsync(path);
	mAppend(d,img);

	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	const dataUrl = canvas.toDataURL('image/png');
	let o = { data: {image:dataUrl}, path: path, mode: 'wi' };
	let resp = await uploadJson('save',o)
}
async function test17_awaitOnload(){
	let d=mBy('dMain');
	let path = '../y/img/minoutest.png';
	let img = await loadImageAsync(path);
	mAppend(d,img);
	//let img = mDom(d,{},{tag:'img'});
	let resp = await ximage(img,path);
	console.log('response',resp);
}
async function __ximage(img,path){
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	const dataUrl = canvas.toDataURL('image/png');
	let o = { data: {image:dataUrl}, path: path, mode: 'wi' };
	let resp = await uploadJson('save',o)
	return resp;
}
async function test16_uploadBase64(){ //geht nachdem added app.use(bodyParser.json({ limit: '200mb' })); //works!!!
	let d=mBy('dMain');
	let path = '../y/img/minoutest.png';
	let img = mDom(d,{},{tag:'img',src:path});
	img.onload = async ()=>console.log(await uploadImg2(img,path));
}
async function test15_simpleImageUpload(){ //geht jetzt!
	let d=mBy('dMain');
	let path = '../y/img/minoutest.png';
	let img = mDom(d,{},{tag:'img',src:path});
	img.onload = async()=>{
		// uploadImg2(img);
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		const dataUrl = canvas.toDataURL('image/png');
		let o = { data: {image:dataUrl}, path: path, mode: 'wi' };
		let resp = await uploadJson('save',o)
		console.log('response',resp);
	}
}
async function test14_uploadBase64(){ //YEAH!!!!
	let d=mBy('dMain');
	let img = mDom(d,{},{tag:'img',src:'../assets/img/emo/unicorn.png'});
	img.onload = async ()=>console.log(await uploadImg2(img));
}
async function YES_test13_save(){
	let o = {path:'',data:{text:'I am TOMAS',pos:22},mode:'ac'};
	let resp = await uploadJson('save',o)
	console.log('response',resp);

}
async function YES_test12_save(){
	//a ... append text/json
	//ay ... append as yaml mit addKeys (existing keys ignored!)
	//wy ... append as yaml mit copyKeys (existing keys overwritten!)
	//w ... override text/json
	//wi ... override image
	//oy ... override yaml
	//as ... addKeys to session object
	//ws ... copyKeys to session object
	//ac ... addKeys to config object and save config
	//wc ... copyKeys to config object and save config
	//_ac ... addKeys to config object without saving!!!
	//_wc ... copyKeys to config object without saving!!!
	//c ... just save config file and reload
	let o = {path:'../combu/test.txt',data:{text:'I am Sam',pos:22},mode:'a'};
	let resp = await uploadJson('save',o)
	console.log('response',resp);

}
async function test11_altviewer(){
	await prelims();

	showTitle('Collection:'); 
	dMenu = mDom(dTitle,{h:'100%'});mFlexV(dMenu); mStyle(dMenu, { gap: 14 });

	mClear('dMain');
	M.rows = 5; M.cols = 8;
	M.grid = mGrid(M.rows, M.cols, 'dMain');
	M.cells = [];
	for (let i = 0; i < M.rows * M.cols; i++) {
		let d = mDom(M.grid, { bg: 'sienna', box: true, padding: 8, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		M.cells.push(d);
	}

	initCollection('all');
}
async function YES_test10_showMessage(){
	showFleetingMessage('HALLO!!!!','dMessage',{bg:'pink'})
}
async function YES_test9_correctMHuge(){
	M = await mGetYaml('../assets/mhuge.yaml');
	for(const k in M.superdi){
		let o=M.superdi[k];
		if (isdef(o.text)) o.coll = 'emo';
		else if (isdef(o.ga) || isdef(o.fa)) o.coll = 'icon';
		else if (isdef(o.path) && o.path.includes('amanda')) o.coll = 'amanda';
		else if (isdef(o.path) && o.path.includes('airport')) o.coll = 'big';
		else if (isdef(o.path) && o.path.includes('animal')) o.coll = 'animals';
		else if (isdef(o.path) && o.path.includes('emo')) o.coll = 'emo';
		else console.log('OTHER!!!!!!',k);
	}
	M.collections = ['amanda','animals','big','emo','icon'];
	//downloadAsYaml(M,'mhuge');
}
async function test8_addDrop(){
	await onclickAdd();
	ondropPreviewImage('../y/bubblebath.png')
}
async function NO_test7_calendar(){
	await prelims();

	showTitle('Add to Collections');

	mClear('dMain');

	let d1 = mDiv('dMain', { w: 800, h: 800, bg: 'white' });
	Config.events = [
		
	]
  let x = DA.calendar = uiTypeCalendar(d1);

}
async function test6_showAll() {
	if (nundef(M.emos)) {
		M = await mGetYaml('../assets/mhuge.yaml');
		console.log('M', M);
		mNavbar('M', ['view', 'add', 'play', 'create']);
		dTitle = mDom(document.body, { margin: 16 }, { tag: 'h1', html: 'Add to Collection' });
		mInsert(document.body, dTitle, 1)
	}
	dTitle.innerHTML = 'View Collections';
	mClear('dMain');

	M.rows = 5; M.cols = 8;
	M.grid = mGrid(M.rows, M.cols, 'dMain');
	M.cells = [];
	for (let i = 0; i < M.rows * M.cols; i++) {
		let d = mDom(M.grid, { bg: 'sienna', box: true, padding: 8, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		M.cells.push(d);
	}

	M.keys = Object.keys(M.superdi);
	M.index = 0;
	M.grid.onclick = () => showNextBatch();
	showNextBatch();
}
async function test5_showImage() {
	if (nundef(M.emos)) {
		M = await mGetYaml('../assets/mhuge.yaml');
		console.log('M', M);
		mNavbar('M', ['view', 'add', 'play', 'create']);
		dTitle = mDom(document.body, { margin: 16 }, { tag: 'h1', html: 'Add to Collection' });
		mInsert(document.body, dTitle, 1)
	}

	dTitle.innerHTML = 'View Collections';
	mClear('dMain')
	let cat = rChoose(M.categories);
	mDom('dMain', {}, { tag: 'h2', html: `Collection: ${cat}` })
	for (const k of M.byCat[cat]) {
		console.log('k', M.superdi[k]);
		showImage(k, 'dMain')
	}
}
async function test4_checkpath() {
	if (nundef(M.emos)) {
		M = await mGetYaml('../assets/mhuge.yaml');
		console.log('M', M);
		mNavbar('M', ['view', 'add', 'play', 'create']);
		dTitle = mDom(document.body, { margin: 16 }, { tag: 'h1', html: 'Add to Collection' });
		mInsert(document.body, dTitle, 1)
	}
	for (const k in M.superdi) {
		let o = M.superdi[k];

		if (isdef(o.img)) {
			if (!o.path.endsWith(o.ext)) console.log('path corrupt:', k, o.path);
			else if (stringCount(o.path, '.') != 3) console.log('path contains not exactly 3!!!', k, o.path);
			// else console.log('ok',k);

		}
	}
}
async function YES_test3_createMHuge() {
	M = await loadCollections();
	downloadAsYaml(M, 'mhuge')
}
async function test2_theRealM() {
	await loadCollections();
	console.log(M)
	//downloadAsYaml(M,'mhuge');
}
async function test1_showCollection() {
	await loadCollections();
	let [emos, cats] = [M.emos, M.categories];
	dTitle.innerHTML = 'View Collections';
	mClear('dMain')
}
async function test0_addToCollection() {
	await loadCollections();
	let [emos, cats] = [M.emos, M.categories];
	dTitle.innerHTML = 'Add to Collection';
	mClear('dMain')
	let d = mDom('dMain', { margin: 10 }); mFlexWrap(d);
	let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' }); mDropZone(dDrop, ondropPreviewImage);

	let dForm = mDom(d, { padding: 12 }, { tag: 'form', onsubmit: ev => { console.log('H!'); ev.preventDefault(); return false; } });

	mDom(dForm, {}, { html: 'Category:' }); let dl = mDatalist(dForm, cats);
	mDom(dForm, {}, { html: 'Name:' }); let inpName = mDom(dForm, {}, { tag: 'input', name: 'imgname', type: 'text', value: '', className: 'input', placeholder: "<enter value>" });
	mDom(dForm, { h: 10 })

	UI.dDrop = dDrop; mClass(dDrop, 'previewContainer');
	UI.dForm = dForm;
	UI.dButtons = mDom(dForm, { display: 'inline-block' });
	UI.imgCat = dl.inpElem;
	UI.imgName = inpName;

}
