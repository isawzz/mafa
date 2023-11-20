onload = start;

async function start() { test28_allColors(); } //test25_user(); } //onclickView(); }
async function test28_allColors() {
	await prelims();
	//return;
	//loadPlayerColors();
	ensureColorDict();
	ensureColorNames();

	let allColors = Object.values(ColorDi).map(x => x.c);
	let list = Object.values(M.knownUsers).concat(M.playerColors.concat(allColors).concat(Object.values(ColorNames)));
	console.log('colors', list.length)
	list = list.filter(x => colorLum(x) < .85);
	list = list.filter(x => !isGrayColor(x));
	let s = new Set(list);
	console.log('list was', list.length, 'set is', Array.from(s).length)
	list = Array.from(s);
	let hsllist = list.map(x => colorHSL(x, true));
	sortByMultipleProperties(hsllist, 'h', 'l');
	list = hsllist.map(x => colorHex(x));

	showColors(list, onclickColor);
	return;

	console.log(list[0])
	console.log('list colors', list.length);

	let list2 = sortByHueWithoutGrays(list);
	console.log('list2 colors', list2.length);

	showColors(list2);
	//list.sort();
	//list.sort((a,b)=>colorHue(a)-colorHue(b))
	//for (const c of list) {		mDom(d, { w: 90, h: 25, bg: c, fg: 'white' }, { html: colorFrom(c) });	}
}
function onclickColor(ev) {
	let c = ev.target.style.background;
	c = colorHex(c)
	mStyle(document.body,{bg:c});
	return;
	console.log('clicked on', c);
	if (isdef(U)) {
		U.color = c;
		showUser();
	}

}
function showColors(list, fOnclick, fHtml) {
	if (nundef(fHtml)) fHtml = x => '';
	let d = mBy('dMain'); mFlexWrap(d); mStyle(d, { padding:10,gap: 10 })
	for (const c of list) {
		let dc = mDom(d, { w: 50, h: 50, bg: c, fg: idealTextColor(c) }, { html: fHtml(c) });
		if (isdef(fOnclick)) {dc.onclick = fOnclick; mStyle(dc,{cursor:'pointer'}); }
	} //colorLum(c).toFixed(2) });	}
	//mDom(d, { w: '100%' }, { html: 'HALLO<br>' })
	//	for (const c of list2) {		mDom(d, { w: 90, h: 25, bg: c, fg: idealTextColor(c) }, { html: c}); } //colorLum(c).toFixed(2) });	}
}
async function test27_user() {
	await prelims();
	let nav = UI.nav.ui;
	dUser = mDom(nav, { fz: 20 }, { id: 'dUser' }); //, bg:'red', 'align-self': 'end' , 'justify-self':'center'},{id:'dUser'});
	showUser();
}
function test26_rColors() {
	loadPlayerColors();
	let d = mBy('dMain'); mFlexWrap(d);
	for (const c of M.playerColors) { mDom(d, { w: 90, h: 25, bg: c, fg: 'white' }, { html: colorFrom(c) }); }
}

async function test25_user() {
	await prelims();
	let nav = UI.nav.ui;
	dUser = mDom(nav, { fz: 20 }, { id: 'dUser' }); //, bg:'red', 'align-self': 'end' , 'justify-self':'center'},{id:'dUser'});
	showUser();
}

async function prelims() {
	if (nundef(M.superdi)) {

		await loadCollections();
		loadPlayerColors();

		//console.log('M', M, 'Config', Config);
		let nav = UI.nav = mNavbar('COMBU', ['add', 'play', 'schedule', 'view'], ['user']);
		
		//console.log('nav',nav)
		nav.disable('play');
		dTitle = mDom(document.body); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
		mInsert(document.body, dTitle, 1);

		dUser = mDom(nav.ui, { fz: 20 }, { id: 'dUser' }); //, bg:'red', 'align-self': 'end' , 'justify-self':'center'},{id:'dUser'});
		showUser();


	}

}

async function onclickAdd() {
	await prelims();

	showTitle('Add to Collections');

	mClear('dMain');

	let colls = M.collections;
	let d = mDom('dMain', { margin: 10 }); mFlexWrap(d);
	let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' }); mDropZone(dDrop, ondropPreviewImage);

	let dForm = mDom(d, { padding: 12 }, { tag: 'form', onsubmit: ev => { ev.preventDefault(); return false; } });

	mDom(dForm, {}, { html: 'Collection:' }); let dl = mDatalist(dForm, colls);
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
	//console.log('elem', elem)
	let key = ev.target.getAttribute('key');
	//console.log('clicked on item', key);

	if (nundef(Items[key])) {
		let o = M.superdi[key];
		Items[key] = { selected: false };
		addKeys(o, Items[key]);
	}
	Items[key].div = elem.parentNode;
	if (nundef(M.selectedImages)) M.selectedImages = [];
	toggleSelectionOfPicture(Items[key], M.selectedImages);
	//console.log('item', Items[key], 'selectedImages', M.selectedImages)
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
