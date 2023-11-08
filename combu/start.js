onload = start;

async function start() { test19_besser(); } //test15_simpleImageUpload();} //onclickView(); }//test8_addDrop(); }

async function test19_besser(){
	let d=mBy('dMain');
	let path = '../y/img/minoutest.png';
	let img = await imgAsync(d,{},{tag:'img',src:path});
	let dataUrl = imgToDataUrl(img);
	let o = { data: {image:dataUrl}, path: path, mode: 'wi' };
	let resp = await uploadJson('save',o)
	console.log('response',resp)
}
function imgToDataUrl(img){
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	const dataUrl = canvas.toDataURL('image/png');
	return dataUrl;
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
async function ximage(img,path){
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
async function test13_save(){
	let o = {path:'',data:{text:'I am TOMAS',pos:22},mode:'ac'};
	let resp = await uploadJson('save',o)
	console.log('response',resp);

}
async function test12_save(){
	//a ... append text/json
	//ay ... append as yaml mit addKeys (existing keys ignored!)
	//oy ... append as yaml mit copyKeys (existing keys overwritten!)
	//w ... override text/json
	//wi ... override image
	//wy ... override yaml
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
async function prelims() {
	if (nundef(M.superdi)) {
		Config = await mGetYaml('../y/config.yaml');
		M = await mGetYaml('../assets/mhuge.yaml');

		M.byCollection = {};
		M.collections = ['all'];
		for(const k in M.superdi){
			let o=M.superdi[k];
			lookupAddIfToList(M.byCollection,[o.coll],k);
			addIf(M.collections,o.coll);
		}

		await updateCollections();

		//console.log('M', M, 'Config', Config);
		showNavbar('COMBU', ['add', 'play', 'schedule', 'view']);
		navbarDeactivate('play');
		dTitle = mDom(document.body); mFlexV(dTitle); mStyle(dTitle, { gap: 14, padding: 14 }) //, { margin: 16 }, { html: '<h1>Add to Collection' });
		mInsert(document.body, dTitle, 1);
	}

}


async function onclickAdd() {
	await prelims();

	showTitle('Add to Collections');

	mClear('dMain');
	let cats = M.categories;
	let d = mDom('dMain', { margin: 10 }); mFlexWrap(d);
	let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' }); mDropZone(dDrop, ondropPreviewImage);

	let dForm = mDom(d, { padding: 12 }, { tag: 'form', onsubmit: ev => { ev.preventDefault(); return false; } });

	mDom(dForm, {}, { html: 'Category:' }); let dl = mDatalist(dForm, cats);
	mDom(dForm, { h: 10 })
	mDom(dForm, {}, { html: 'Name:' }); let inpName = mDom(dForm, {}, { tag: 'input', name: 'imgname', type: 'text', value: '', className: 'input', placeholder: "<enter value>" });
	mDom(dForm, { h: 10 })
	UI.dTool = mDom(dForm)

	UI.dDrop = dDrop; mClass(dDrop, 'previewContainer');
	UI.dForm = dForm;

	UI.dButtons = mDom(dTitle, { display: 'inline-block' });
	UI.imgCat = dl.inpElem;
	UI.imgName = inpName;


}
function onclickDay(ev){
	//id kann ja nur die day id sein!!!!
	let tsDay = evToId(ev); //ev.target.getAttribute('date'); //evToTargetAttribute(ev,'date'); //ts for this day
	let tsCreated = Date.now()
	let id = generateEventId(tsDay,tsCreated);
	let o={id:id,created:tsCreated,day:tsDay,from:null,to:null,title:'',text:'',user:ClientData.userid,subscribers:[]};
	Config.events[id]=o;
	// console.log(id,o);

  let d1 = addEditable(ev.target, { w: '100%' }, { id:id, onEnter: onEventEdited });
	//console.log(d1);

	//trag dieses event ein!
	//soll ich das event hier eintragen oder erst wenn es einen content hat?
}
async function onclickItem(ev){
	//the key of the superdi item should be saved in 'key' attribute
	//goto showImage
	let elem=ev.target;
	console.log('elem',elem)
	let key = ev.target.getAttribute('key');
	console.log('clicked on item',key);

	if (nundef(Items[key])){
		let o = M.superdi[key];
		Items[key]={selected:false};
		addKeys(o,Items[key]);
	} 
	Items[key].div = elem.parentNode;
	if (nundef(M.selectedImages)) M.selectedImages = [];
	toggleSelectionOfPicture(Items[key],M.selectedImages);
	console.log('item',Items[key],'selectedImages',M.selectedImages)
}
async function onclickPlay() { alert('COMING SOON!'); } //test0_addToCollection(); }
async function onclickPrev() { showImageBatch(-1); }
async function onclickNext() { showImageBatch(1); }
async function onclickSchedule() { 
	await prelims();

	showTitle('Calendar');

	mClear('dMain');

	let d1 = mDiv('dMain', { w: 800, h: 800, bg: 'white' })
  let x = DA.calendar = uiTypeCalendar(d1, null, null, Config.events);
} 
async function onclickUpload() {
	//console.log('onclickUpload');
	let img = UI.img;

	let name = valnwhite(UI.imgName.value, rUID('img'));
	let unique = isdef(M.superdi[name]) ? rUID('img') : name;

	//console.log('cat', isdef(UI.imgCat.value), typeof (UI.imgCat.value), isEmpty(UI.imgCat.value))
	let cat = valnwhite(UI.imgCat.value, 'other');
	//console.log('name', name, 'cat', cat)
	let data = await uploadImg(img, unique, cat, name);
	//console.log('uploaded', data);
	await updateCollections();

}
async function onclickView() {
	await prelims();

	showTitle('Collection:'); 
	dMenu = mDom(dTitle,{h:'100%'});mFlexV(dMenu); mStyle(dMenu, { gap: 14 });

	mClear('dMain');
	M.rows = 5; M.cols = 8;
	M.grid = mGrid(M.rows, M.cols, 'dMain');
	M.cells = [];
	for (let i = 0; i < M.rows * M.cols; i++) {
		let d = mDom(M.grid, { bg: 'sienna', box: true, padding: 8, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		//d.onclick = onclickItem;
		mCenterCenterFlex(d);
		M.cells.push(d);
	}

	initCollection('animals');
}
async function ondropPreviewImage(url, key) {
	if (isdef(key)) {
		let o = M.superdi[key];
		UI.imgCat.value = o.cats[0];
		UI.imgName.value = o.friendly;
	}
	let dParent = UI.dDrop;
	let dButtons = UI.dButtons;
	let dTool = UI.dTool;
	dParent.innerHTML = '';
	dButtons.innerHTML = '';
	dTool.innerHTML = '';

	let img = UI.img = mDom(dParent, {}, { tag: 'img', src: url });
	img.onload = async () => {
		img.onload = null;
		//await resizeImage(img, 300);
		UI.img_orig = new Image(img.offsetWidth, img.offsetHeight);
		UI.url = url;
		let tool = UI.cropper = mCropResizePan(dParent, img);
		addToolX(tool, dTool)
		// UI.cropTool = addCropTool(dButtons,img,UI.cropper.setSize);
		//resizePreviewImage(dParent,img);

		mDom(dButtons, { w: 120 }, { tag: 'button', html: 'Upload', onclick: onclickUpload, className: 'input' })
		mButton('Restart', () => ondropPreviewImage(url), dButtons, { w: 120, maleft: 12 }, 'input');
	}
}
async function onEventEdited(ev){
	let id = evToId(ev);
	let o = Config.events[id];
	let inp = mBy(id);
	if (inp.value){
		//console.log('send value',inp.value,'to server')
		o.text=inp.value;
		let resp = await uploadJson('event',o)
		console.log('response',resp)
	}

	//console.log('event',id,o,inp)
	//ich moecht das event mit await an den node js server schicken,
	//dort saven mit der id oder einer neuen id

}
