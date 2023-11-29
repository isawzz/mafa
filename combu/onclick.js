
async function onclickAdd() {
	showTitle('Add to Collections');
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

	Serverdata.config.events[id] = o;
	// console.log(id,o);

	let d1 = addEditable(ev.target, { w: '100%' }, { id: id, onEnter: onEventEdited });
	//console.log(d1);

	//trag dieses event ein!
	//soll ich das event hier eintragen oder erst wenn es einen content hat?
}
async function onclickItem(ev) {
	//the key of the superdi item should be saved in 'key' attribute
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
	showTitle('Calendar');
	let d1 = mDiv('dMain', { w: 800, h: 800 }); //, bg: 'white' })
	let x = DA.calendar = uiTypeCalendar(d1, null, null, getConfig('events'));
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
	showTitle('Collection:');
	dMenu = mDom(dTitle, { h: '100%' }); mFlexV(dMenu); mStyle(dMenu, { gap: 14 });
	let d1 = mDiv('dMain'); mFlex(d1);
	//mFlex('dMain');
	showSidebar(d1);

	M.rows = 5; M.cols = 7;
	M.grid = mGrid(M.rows, M.cols, d1, { 'align-self': 'start' });
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
	let o = Serverdata.config.events[id];
	let inp = mBy(id);
	if (inp.value) {
		//console.log('send value',inp.value,'to server')
		o.text = inp.value;
		await serverUpdate('event',o)
	}

	//console.log('event',id,o,inp)
	//ich moecht das event mit await an den node js server schicken,
	//dort saven mit der id oder einer neuen id

}
