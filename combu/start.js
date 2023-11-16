onload = start;

async function start() { test25_user(); } //onclickView(); }

async function test25_user() {
	await prelims();
	let nav = UI.nav.ui;
	dUser = mDom(nav,{ 'align-self': 'end' , fz: 20, bg:'red', h:'100%'});
	let styles = { family: 'fa6','align-self': 'end', fg: 'grey', cursor: 'pointer' };
	let fa = mDom(dUser, styles, { html: String.fromCharCode('0x' + M.superdi.user.fa6) })
	fa.onclick = onclickUser;
	console.log('fa', fa)
}

async function onclickUser(){
	console.log(U); //null am anfang!
	if (!U) {
		let uname = prompt('Enter name: ');
		console.log('uname',uname);
		let result  = await addNewUser(uname);
		console.log('result',result);
		if (!result) {alert('login failed!'); return;}
		U=result.session.users[uname];
		mClear(dUser);
		let d=mDom(dUser,{fg:U.color,cursor:'pointer'},{html:U.name});
		d.onclick=onclickUser;
	}else {
		//this user is logging out
		U=null;
		onclickUser();
	}
}

async function prelims(){
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
function onclickDay(ev) {
	//id kann ja nur die day id sein!!!!
	let tsDay = evToId(ev); //ev.target.getAttribute('date'); //evToTargetAttribute(ev,'date'); //ts for this day
	let tsCreated = Date.now()
	let id = generateEventId(tsDay, tsCreated);
	let o = { id: id, created: tsCreated, day: tsDay, from: null, to: null, title: '', text: '', user: ClientData.userid, subscribers: [] };
	Config.events[id] = o;
	// console.log(id,o);

	let d1 = addEditable(ev.target, { w: '100%' }, { id: id, onEnter: onEventEdited });
	//console.log(d1);

	//trag dieses event ein!
	//soll ich das event hier eintragen oder erst wenn es einen content hat?
}
async function onclickItem(ev) {
	//the key of the superdi item should be saved in 'key' attribute
	//goto showImage
	let elem = ev.target;
	console.log('elem', elem)
	let key = ev.target.getAttribute('key');
	console.log('clicked on item', key);

	if (nundef(Items[key])) {
		let o = M.superdi[key];
		Items[key] = { selected: false };
		addKeys(o, Items[key]);
	}
	Items[key].div = elem.parentNode;
	if (nundef(M.selectedImages)) M.selectedImages = [];
	toggleSelectionOfPicture(Items[key], M.selectedImages);
	console.log('item', Items[key], 'selectedImages', M.selectedImages)
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
	dMenu = mDom(dTitle, { h: '100%' }); mFlexV(dMenu); mStyle(dMenu, { gap: 14 });

	mClear('dMain');

	mFlex('dMain');
	showSidebar('dMain');


	M.rows = 5; M.cols = 7;
	M.grid = mGrid(M.rows, M.cols, 'dMain', { 'align-self': 'start' });
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
async function onEventEdited(ev) {
	let id = evToId(ev);
	let o = Config.events[id];
	let inp = mBy(id);
	if (inp.value) {
		//console.log('send value',inp.value,'to server')
		o.text = inp.value;
		let resp = await uploadJson('event', o)
		console.log('response', resp)
	}

	//console.log('event',id,o,inp)
	//ich moecht das event mit await an den node js server schicken,
	//dort saven mit der id oder einer neuen id

}
