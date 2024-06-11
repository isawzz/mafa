
function menuCloseSimple() { closeLeftSidebar(); clearMain(); } //	window.onresize = null;}

async function onclickSimple() {
	let name = valf(localStorage.getItem('sisi'),'tierspiel'); //console.log(name);
	simpleSidebar(150);
	mAdjustPage(150);
	let div = mDom100('dMain'); 
	let sisi = UI.simple = {name,div};
	let [w,h,bg,fg]=[sisi.w,sisi.h,sisi.bg,sisi.fg] = [mGetStyle(div,'w'),mGetStyle(div,'h'),getNavBg(),getThemeFg()];

	let d1=mDom(div);mCenterFlex(d1)
	let dMenu = sisi.dMenu = mDom(d1, { gap: 10, padding: 12 }, { className: 'title' });mFlexVWrap(dMenu);
	let dInstruction = sisi.dInstruction = mDom(d1, { w100:true, align: 'center', fg }, { html: '* press Control key when hovering to magnify image! *' })

	let dBatch = sisi.dBatch = mDom(d1);
	let cellStyles = { bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' };
	let o = createBatchGridCells(dBatch,w*.9,h*.9,cellStyles);
	addKeys(o,sisi);

	mStyle(dInstruction, { w: mGetStyle(sisi.dGrid, 'w') });

	mLinebreak(d1)
	sisi.dPageIndex = mDom(d1,{fg});

	simpleInit(name, sisi);
	
	sisi.isOpen = true;
	sisi.dInstruction.innerHTML = '* drag images into the shaded area *'
	let grid = sisi.dGrid;
	mStyle(grid, { bg: '#00000030' })
	enableDataDrop(grid, simpleOnDropImage)
	//rBgFor(sisi.div,sisi.dMenu,sisi.dBatch,sisi.dGrid); //damit man sieht was der macht mit div sizing
}
async function onclickSimpleClearSelections(ev) { simpleClearSelections(); }

async function onclickSimpleNew(name) {
	if (nundef(name)) name = await mGather(iDiv(UI.simpleNew));
	if (!name) return;
	name = normalizeString(name);
	if (isEmpty(name)) {
		showMessage(`ERROR! you need to enter a valid name!!!!`);
		return;
	}
	if (M.collections.includes(name)) {
		showMessage(`collection ${name} already exists!`);
	}
	M.collections.push(name); M.collections.sort();
	if (name != UI.simple) simpleInit(name,UI.simple);
}
async function onclickSimpleSelectAll(ev) {
	let sisi = UI.simple;
	for (const cell of sisi.cells) {
		let d = cell.firstChild;
		if (nundef(d)) break;
		mSelect(d);
	}
	for (const k of sisi.keys) { addIf(UI.selectedImages, k); }
	simpleEnableListCommands();
}
async function onclickSimpleSelectPage(ev) {
	let sisi = UI.simple;
	for (const cell of sisi.cells) {
		let d = cell.firstChild;
		if (nundef(d)) break;
		mSelect(d);
		let o = sisi.items[d.id];
		addIf(UI.selectedImages, o.key);
	}
	simpleEnableListCommands();
}
async function onclickSetAvatar(ev) { await simpleSetAvatar(UI.selectedImages[0]); }

function simpleClearSelections() {
	mClearAllSelections();
	simpleDisableListCommands();
}
async function simpleFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, sisi) {
	let dims = mGetStyles(dc, ['left', 'top', 'w', 'h']); //console.log('dims', dims);
	let wScale = img.width / wOrig;
	let hScale = img.height / hOrig;
	let d1 = mDom(document.body, { margin: 10 });
	let canvas = mDom(d1, {}, { tag: 'canvas', width: dims.w, height: dims.h });
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, dims.left / wScale, dims.top / hScale, (dims.w) / wScale, img.height / hScale, 0, 0, dims.w, dims.h)
	const dataUrl = canvas.toDataURL('image/png'); //davon jetzt die dataUrl!
	if (isEmpty(inpFriendly.value)) inpFriendly.value = 'pic'
	let friendly = inpFriendly.value;
	let cats = extractWords(valf(inpCats.value, ''));
	let filename = (isdef(M.superdi[friendly]) ? 'i' + getTimestamp() : friendly) + '.png'; //console.log('filename', filename);
	let o = { image: dataUrl, coll: sisi.name, path: filename };
	let resp = await mPostRoute('postImage', o); //console.log('resp', resp); //sollte path enthalten!
	let key = stringBefore(filename, '.');
	let imgPath = `../assets/img/${sisi.name}/${filename}`;
	let item = { key: key, friendly: friendly, img: imgPath, cats: cats, colls: [sisi.name] };
	dPopup.remove();
	await simpleOnDroppedItem(item, sisi);
}
function simpleInit(name, sisi) {
	if (nundef(name) && isdef(UI.simple)) {sisi=UI.simple;name=sisi.name;}
	let isReload = isdef(sisi.index) && sisi.name == name;
	if (!isReload) { sisi.index = 0; sisi.pageIndex = 1; sisi.name = name; sisi.filter = null; }

	let list = [];
	if (name == 'all' || isEmpty(name)) { list = Object.keys(M.superdi); }
	else if (isdef(M.byCollection[name])) { list = M.byCollection[name]; }
	else list = [];
	
	localStorage.setItem('sisi', name)

	let dMenu = sisi.dMenu;
	mClear(dMenu);
	let d = mDom(dMenu); mFlexV(d);
	mDom(d, { fz: 24, weight: 'bold' }, { html: 'Collection:' });

	let collNames = M.collections; 
	let dlColl = mDatalist(d, collNames, { placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => {console.log(sisi.name,ev.target.value);simpleInit(ev.target.value, sisi);}
	dlColl.inpElem.value = name;

	list = sortByFunc(list, x => M.superdi[x].friendly);
	sisi.masterKeys = list;
	sisi.keys = sisi.filter ? collFilterImages(sisi, sisi.filter) : list;
	
	let cats = collectCats(sisi.keys);
	cats.sort();
	d = mDom(dMenu); mFlexV(d);
	let wLabel = sisi.cols < 6 ? 117 : 'auto';
	mDom(d, { fz: 24, weight: 'bold', w: wLabel, align: 'right' }, { edit: true, html: 'Filter:' });
	let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>", value: sisi.filter });
	dlCat.inpElem.oninput = ev =>{
		let coll = UI.simple;
		let s = ev.target.value.toLowerCase().trim();
		let list = collFilterImages(coll, s);
		coll.keys = list;
		coll.filter = s;
		coll.index = 0; coll.pageIndex = 1; simpleClearSelections();
		simpleShowImageBatch(coll, 0, false);
	};
	
	d = mDom(dMenu, { gap: 10, align: 'right' });
	mButton('prev', ()=>simpleShowImageBatch(sisi,-1), d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bPrev');
	mButton('next', ()=>simpleShowImageBatch(sisi,1), d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bNext');
	simpleClearSelections();
	simpleShowImageBatch(sisi);
}
async function simpleOnclickItem(ev) {
	let id=evToId(ev);
	let item = UI.simple.items[id]; if (nundef(item)) return;
	//console.log('clicked label of',item);
	if (nundef(UI.selectedImages)) UI.selectedImages = [];
	//let collname = item.name;
	let selist = UI.selectedImages;
	let selkey = item.key;
	toggleSelectionOfPicture(iDiv(item), selkey, UI.selectedImages);
	if (isEmpty(selist)) { simpleDisableListCommands(); simpleDisableItemCommands(); }
	else if (selist.length == 1) { simpleEnableListCommands(); simpleEnableItemCommands(); }
	else { simpleDisableItemCommands(); simpleEnableListCommands(); }
}
async function simpleOnclickLabel(ev) {
	evNoBubble(ev);
	let id=evToId(ev); console.log('id',id)
	let o = lookup(UI.simple,['items',id]);
	if (!o) return;
	console.log('clicked label of',o);
	let [key,elem,collname]=[o.key,o.name,iDiv(o)];

	let newfriendly = await mGather(ev.target);
	if (!newfriendly) return;
	if (isEmpty(newfriendly)) {
		showMessage(`ERROR: name invalid: ${newfriendly}`);
		return;
	}
	console.log('rename friendly to', newfriendly)
	let item = M.superdi[key];
	item.friendly = newfriendly;

	let di = {};
	di[key] = item;
	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	ev.target.innerHTML = newfriendly;
}
async function simpleOnDropImage(ev,elem) {
	let dt=ev.dataTransfer;
	console.log('dropped',ev.dataTransfer); 

	console.log('types',dt.types); 
	//console.log('items',dt.items); 
	console.log('files',dt.files); 

	if (dt.types.includes('itemkey')) {
		let data = ev.dataTransfer.getData('itemkey');

		console.log('itemkey',data)
	}else {
		const files = ev.dataTransfer.files;
		console.log('drop',ev.dataTransfer);
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = async (evReader) => {
				let data = evReader.target.result;
				await simpleOnDroppedUrl(data, UI.simple);
				//onDropCallback(, files[0].name, elem);
			};
			reader.readAsDataURL(files[0]);
		}

	}
	//console.log('dropped',ev.dataTransfer); 

	return;
	if (isString(file) && isdef(M.superdi[file])){
		console.log('YEAH!!!!!!!!!!!! ein key',file)
		await simpleOnDroppedItem(M.superdi[file], UI.simple)
	}else if (isDict(file) && isdef(M.allImages[file.name])) {
		assertion(false,"DROP IMAGE FROM KEY ist aber file instead!!!!!!!!!!!!!!!!")
		//hab ein eigenes item gedropped!!!!
		//muss ueberhaupt kein item adden!
		//nur in die neue collection integrieren!
		console.log('NOOOOOOOOO!!!!!!!!!!!! ein eigenes img',M.allImages[file.name])
	}else {
		assertion(!isDict(file),'MUSS VON WO ANDERS KOMMEN!!!!!')
		console.log('from somewhere else!!!!',file);

		//await simpleOnDroppedUrl(data, UI.simple);
	}
	// return 
}
async function simpleOnDroppedItem(item, sisi) {
	let key = item.key;
	assertion(isdef(key), 'NO KEY!!!!!');
	let o=M.superdi[key];
	assertion(nundef(o) || o == item,"DISPARITY!!!!!!!!!!!!!!!!!!!!!")
	let list = item.colls;
	if (isdef(o) && list.includes(sisi.name)) {console.log(`HA! ${key} already there`); return; }// dropped item into same collection!!!
	lookupAddIfToList(item,['colls'],sisi.name);
	addIf(item.colls,sisi.name);
	let di = {}; di[key] = item;
	await updateSuperdi(di);
	simpleInit(sisi.name,sisi)
}
async function simpleOnDroppedUrl(url, sisi) {
	//console.log(url,sisi); //return;
	let m = await imgMeasure(url); console.log('simpleOnDroppedUrl!!! sz', m);
	let [img, wOrig, hOrig, sz] = [m.img, m.w, m.h, 400];
	let dPopup = mDom(document.body, { position: 'fixed', top: 40, left: 0, wmin: sz+80, hmin: sz+80, bg: 'pink' });
	let d = mDom(dPopup, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	mIfNotRelative(d);
	mStyle(img, { h: sz });
	mAppend(d, img);
	let [w0, h0] = [img.width, img.height];
	let dc = mDom(d, { position: 'absolute', left: (w0 - sz) / 2, top: (h0 - sz) / 2, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;
	let db1 = mDom(dPopup, { bg: 'red', padding: 10, display: 'flex', gap: 10, 'justify-content': 'center' });
	mButton('restart', () => imgReset(img, dc, sz, w0, h0), db1, { w: 70 }, 'input');
	mButton('squish', () => imgSquish(img, dc, sz), db1, { w: 70 }, 'input');
	mButton('expand', () => imgExpand(img, dc, sz), db1, { w: 70 }, 'input');
	let dinp = mDom(dPopup, { padding: 10, align: 'right', display: 'inline-block' })
	mDom(dinp, { display: 'inline-block' }, { html: 'Name: ' });
	let inpFriendly = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'friendly', tag: 'input', type: 'text', placeholder: `<enter name>` });
	let defaultName = '';
	let iDefault = 1;
	let k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`);
	while (isdef(k)) { iDefault++; k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`); }
	defaultName = `${sisi.name}${iDefault}`;
	inpFriendly.value = defaultName;
	mDom(dinp, { h: 1 });
	mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
	let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });
	let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
	mButton('cancel', () => dPopup.remove(), db2, { w: 70 }, 'input');
	mButton('OK', () => simpleFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, sisi), db2, { w: 70 }, 'input');
}
async function simpleSetAvatar(key){
	U.imgKey = key;
	let res = await postUserChange(U);
	//console.log('res', res)
}
function simpleShowImageBatch(sisi, inc = 0, alertEmpty = false) {
	let [keys, index, numCells] = [sisi.keys, sisi.index, sisi.rows * sisi.cols];
	if (isEmpty(keys) && alertEmpty) showMessage('nothing has been added to this collection yet!');
	if (keys.length <= numCells) inc = 0;
	let newPageIndex = sisi.pageIndex + inc;
	let numItems = keys.length;
	let maxPage = Math.max(1, Math.ceil(numItems / numCells));
	if (newPageIndex > maxPage) newPageIndex = 1;
	if (newPageIndex < 1) newPageIndex = maxPage;
	index = numCells * (newPageIndex - 1);
	let list = arrTakeFromTo(keys, index, index + numCells);
	sisi.index = index; sisi.pageIndex = newPageIndex;
	sisi.items = {};
	let name = sisi.name;
	for (let i = 0; i < list.length; i++) {
		let key = list[i];
		let d = sisi.cells[i];
		mStyle(d, { opacity: 1 });
		mClass(d, 'magnifiable')
		let id = getUID();
		let d1 = simpleShowImageInBatch(key, d, {}, {prefer:sisi.name == 'emo'?'img':'photo'});
		d1.id = id;
		let item = {div:d1,key,name,id,index:i,page:newPageIndex};
		sisi.items[id]=item;
		// d1.setAttribute('collname', sisi.name);
		// let selkey = collGenSelkey(key, sisi.name);
		if (isList(UI.selectedImages) && UI.selectedImages.includes(key)) mSelect(d1);
	}
	for (let i = list.length; i < numCells; i++) {
		mStyle(sisi.cells[i], { opacity: 0 })
	}
	sisi.dPageIndex.innerHTML = `page ${sisi.pageIndex}/${maxPage}`;
	let [dNext, dPrev] = [mBy('bNext'), mBy('bPrev')];
	if (maxPage == 1) { mClass(dPrev, 'disabled'); mClass(dNext, 'disabled'); }
	else { mClassRemove(dPrev, 'disabled'); mClassRemove(dNext, 'disabled'); }
}
function simpleShowImageInBatch(key, dParent, styles = {}, opts = {}) {
	let o = M.superdi[key]; o.key = key;
	addKeys({ bg: rColor() }, styles);
	mClear(dParent);
	[w, h] = [dParent.offsetWidth, dParent.offsetHeight];
	let [sz, fz] = [.9 * w, .8 * h];
	let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	let src = (opts.prefer == 'photo' && isdef(o.photo)) ? o.photo : valf(o.img, null);
	if (isdef(src)) {
		if (o.cats.includes('card')) {
			el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src });
			mDom(d1, { h: 1, w: '100%' })
		} else {
			el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src });
		}
	}
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	assertion(el, 'PROBLEM mit' + key);
	let label = mDom(d1, { fz: 11, cursor: 'pointer' }, { html: o.friendly, className: 'ellipsis hoverHue' });
	label.onclick = simpleOnclickLabel;
	mStyle(d1, { cursor: 'pointer' });
	d1.onclick = simpleOnclickItem;
	//console.log('.......key',key)
	d1.setAttribute('key', key);
	d1.setAttribute('draggable', true)
	d1.ondragstart = ev => { ev.dataTransfer.setData('itemkey', key); }
	// d1.ondragstart = ev => { 
	// 	ev.dataTransfer.setData('text/uri-list', draggableImage.src);
        
	// 	// The "text/html" format is useful for dragging the image as HTML
	// 	ev.dataTransfer.setData('text/html', `<img src="${draggableImage.src}" alt="Draggable Image">`);
	// 	ev.dataTransfer.setData('hallo','mySpecialData');
	// 	// // Optionally, you can set a custom drag image
	// 	// const dragIcon = new Image();
	// 	// dragIcon.src = 'path/to/drag-icon.png'; // Optional custom drag icon
	// 	// ev.dataTransfer.setDragImage(dragIcon, 10, 10); // Adjust x and y offset as needed

	// 	UI.draggedItem = o; 
	// };
	return d1;
}


