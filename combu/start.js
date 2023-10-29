onload = start

async function start() { test3_mhuge(); }

async function test3_mhuge(){
	let M = await mGetYaml('../assets/mhuge.yaml');
	console.log('M',M)
}
async function test2_theRealM() {
	await loadCollections();
	console.log(M)
	//downloadAsYaml(M,'mhuge');
}
async function mGetAnimals(server = 'http://localhost:3000') {
	let dir = "../assets/img/animals";
	let dirs = await mGetFiles(server, dir);
	let di = {};
	for (const subdir of dirs) {
		let path = `${dir}/${subdir}`;
		let files = await mGetFiles(server, path);
		for (const fname of files) {
			let o = filenameToObject(fname, path, ['animals', subdir]);
			di[o.key] = o;
		}
	}
	return di;
}
function filenameToObject(fname, path, cats) {
	let parts = fname.split('.');
	if (parts.length != 2) console.log('file', path, fname, 'wrong name');
	let [k, ext] = parts;
	let o = { key: k, ext: ext, cats: cats, path: `${path}/${fname}}`, img: fname, friendly: k.replace(/[^a-zA-Z]/g, '') };
	return o;
}
async function test1_showCollection() {
	await loadCollections();
	let [emos, cats] = [M.emos,M.categories];
	dTitle.innerHTML = 'View Collections';
	mClear('dMain')
}

async function test0_addToCollection() {
	await loadCollections();
	let [emos, cats] = [M.emos,M.categories];
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
async function onclickView() { test1_showCollection(); }
async function onclickAdd() { test0_addToCollection(); }
async function onclickPlay() { test0_addToCollection(); }
async function onclickCreate() { test0_addToCollection(); }
async function onclickUpload() {
	console.log('onclickUpload');
	let img = UI.img;

	let name = valnwhite(UI.imgName.value, rUID('img'));
	let unique = isdef(M.index[name]) ? rUID('img') : name;

	console.log('cat', isdef(UI.imgCat.value), typeof (UI.imgCat.value), isEmpty(UI.imgCat.value))
	let cat = valnwhite(UI.imgCat.value, 'other');
	console.log('name', name, 'cat', cat)
	let data = await uploadImg(img, unique, cat, name);
	console.log('uploaded', data)
}
async function ondropPreviewImage(url) {
	let dParent = UI.dDrop;
	let dButtons = UI.dButtons;
	dParent.innerHTML = '';
	dButtons.innerHTML = '';
	let img = UI.img = mDom(dParent, {}, { tag: 'img', src: url });
	img.onload = async () => {
		img.onload = null;
		//await resizeImage(img, 300);
		UI.img_orig = new Image(img.offsetWidth, img.offsetHeight);
		UI.url = url;
		let tool = UI.cropper = mCropResizePan(dParent, img);
		addToolX(tool, dButtons)
		// UI.cropTool = addCropTool(dButtons,img,UI.cropper.setSize);
		//resizePreviewImage(dParent,img);

		mDom(dButtons, { w: 120 }, { tag: 'button', html: 'Upload', onclick: onclickUpload, className: 'input' })
		mButton('Restart', () => ondropPreviewImage(url), dButtons, { w: 120, maleft: 12 }, 'input');
	}
}

