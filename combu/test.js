//*** collections tests */
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
async function test3_createMHuge() {
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
