//*** collections tests */
async function YES_test19_besser(){
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
async function YES_test7_calendar(){
	await prelims();

	showTitle('Add to Collections');

	mClear('dMain');

	let d1 = mDiv('dMain', { w: 800, h: 800, bg: 'white' });
	Config.events = [
		
	]
  let x = DA.calendar = uiTypeCalendar(d1, null, null, Config.events);

}
async function test6_showAll() {
	if (nundef(M.emos)) {
		M = await mGetYaml('../assets/mhuge.yaml');
		console.log('M', M);
		showNavbar('M', ['view', 'add', 'play', 'create']);
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
		showNavbar('M', ['view', 'add', 'play', 'create']);
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
		showNavbar('M', ['view', 'add', 'play', 'create']);
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
