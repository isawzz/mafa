
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
async function onclickColors() {
	showTitle('Set Color Theme');
	//showColors('dMain', M.playerColors, onclickColor);
	let d = mDom('dMain', { hpadding:20, display: 'flex', gap: '2px 4px', wrap: true });

	let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
	list = M.playerColors.concat(grays);

	//3x3x3x5 colors sind es + 15 grays
	let i = 0;
	for (const c of list) {
		let dc = mDom(d, { w: 50, h: 50, bg: c, fg: idealTextColor(c) });
		dc.onclick = onclickColor; 
		mStyle(dc, { cursor: 'pointer' }); 
		i++; if (i % 15 == 0) mDom(d, { w: '100%', h: 0 });
	}
}
async function onclickColor(ev) {
	let c = ev.target.style.background;
	c = colorHex(c);
	setColors(c);
	if (U){
		U.color = c;
		await postUserChange();
	}
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
async function onclickSchedule() { showCalendarApp(); }
function showCalendarApp(){

	//if no user, set user to shared
	if (!U) {console.log('you have to be logged in to use this menu!!!'); return;}
	showTitle('Calendar');
	let d1 = mDiv('dMain', { w: 800, h: 800 }); //, bg: 'white' })
	let x = DA.calendar = uiTypeCalendar(d1, U?U.color:rColor(),null, null, getEvents());
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
async function onclickUser() {
	let uname = await mPrompt(); //returns null if invalid!
	console.log('onclickUser:', uname);
	if (isdef(uname) && (!U || U.name != uname)) {		await switchToUser(uname);	}
	await showUser(uname);
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
	//find out nav color = frame color
	let bg=mGetStyle('dNav','bg');

	for (let i = 0; i < M.rows * M.cols; i++) {
		let d = mDom(M.grid, { bg: bg, box: true, padding: 8, margin: 8, w: 128, h: 128, overflow: 'hidden' });
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
