
async function clickOnItem(elem, key) {
	if (nundef(UI.selectedImages)) UI.selectedImages = [];
	let collname = elem.getAttribute('collname');
	let selist = UI.selectedImages;
	let selkey = collGenSelkey(key, collname);
	toggleSelectionOfPicture(elem, selkey, UI.selectedImages);
	if (isEmpty(selist)) { collDisableListCommands(); collDisableItemCommands(); }
	else if (selist.length == 1) { collEnableListCommands(); collEnableItemCommands(); }
	else { collDisableItemCommands(); collEnableListCommands(); }
}
async function collAddItem(coll, key, item) {
	if (isdef(M.superdi[key])) addIf(item.colls, coll.name);
	let di = {}; di[key] = item;
	await updateSuperdi(di);
	collPostReload();

}
function collInitCollection(name, coll) {
	let isReload = isdef(coll.index) && coll.name == name;
	if (!isReload) {
		coll.index = 0; coll.pageIndex = 1; coll.name = name; coll.filter = null;
	}
	let list = [];
	if (name == 'all' || isEmpty(name)) {
		list = Object.keys(M.superdi);
	} else if (isdef(M.byCollection[name])) {
		list = M.byCollection[name];
	} else list = [];
	if (coll == UI.collPrimary) localStorage.setItem('collection', name)
	let dMenu = coll.dMenu;
	mClear(dMenu);
	let d = mDom(dMenu); mFlexV(d);
	mDom(d, { fz: 24, weight: 'bold' }, { html: 'Collection:' });
	let colls = M.collections;
	let dlColl = mDatalist(d, colls, { placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value, coll);
	dlColl.inpElem.value = name;
	list = sortByFunc(list, x => M.superdi[x].friendly);
	coll.masterKeys = list;
	coll.keys = coll.filter ? collFilterImages(coll, coll.filter) : list;
	let cats = collectCats(coll.keys);
	cats.sort();
	d = mDom(dMenu); mFlexV(d);
	let wLabel = coll.cols < 6 ? 117 : 'auto';
	mDom(d, { fz: 24, weight: 'bold', w: wLabel, align: 'right' }, { edit: true, html: 'Filter:' });
	let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>", value: coll.filter });
	dlCat.inpElem.oninput = oninputCollFilter;
	d = mDom(dMenu, { gap: 10, align: 'right' });
	//if (coll.cols < 6) mStyle(d, { w100: true });
	if (coll == UI.collSecondary) mButton('done', onclickCollDone, d, { w: 70, margin: 0, maleft: 10 }, 'input');
	mButton('prev', onclickCollPrev, d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bPrev');
	mButton('next', onclickCollNext, d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bNext');
	collClearSelections();
	showImageBatch(coll);
}
async function collOnDroppedItem(item, coll) {
	assertion(isdef(item.key), 'NO KEY!!!!!');
	await collAddItem(coll, item.key, item);
	collOpenSecondary(4, 2);
	showImageBatch(coll, 0);
}
async function collOnDropImage(url, dDrop) {
	let item = UI.draggedItem;
	UI.draggedItem = null;
	let coll = UI.collSecondary;
	if (isdef(item)) return await collOnDroppedItem(item, coll);
	else return await collOnDroppedUrl(url, coll);
}
async function collOnDroppedUrl(url, coll) {
	let m = await imgMeasure(url); console.log('collOnDroppedUrl!!! sz', m);
	let dPopup = mDom(document.body, { position: 'fixed', top: 0, left: 0, wmin: 400, hmin: 400, bg: 'pink' });
	let [img, wOrig, hOrig, sz] = [m.img, m.w, m.h, 300];
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
	let k = coll.masterKeys.find(x => x == `${coll.name}${iDefault}`);
	while (isdef(k)) { iDefault++; k = coll.masterKeys.find(x => x == `${coll.name}${iDefault}`); }
	defaultName = `${coll.name}${iDefault}`;
	inpFriendly.value = defaultName;
	mDom(dinp, { h: 1 });
	mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
	let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });
	let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
	mButton('cancel', () => collCancelEditing(dPopup), db2, { w: 70 }, 'input');
	mButton('OK', () => collFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, coll), db2, { w: 70 }, 'input');
}
function collOpenPrimary(rows, cols=4) {
	collPresent(UI.collPrimary, rows, cols);
	UI.collPrimary.isOpen = true;
}
function collOpenSecondary(rows, cols=2) {
	let coll = UI.collSecondary;
	let d = iDiv(coll);
	mStyle(d, { wmin: 300, border: 'white' });
	collPresent(coll, rows, cols);
	coll.isOpen = true;
	coll.dInstruction.innerHTML = '* drag images into the shaded area *'
	let grid = coll.grid;
	mStyle(grid, { bg: '#00000030' })
	enableImageOrItemDrop(grid, collOnDropImage);
	cmdDisable(UI.asSecondary.key);
}
function collPostReload() {
	if (UI.collPrimary.isOpen) { collInitCollection(UI.collPrimary.name, UI.collPrimary); }
	if (UI.collSecondary.isOpen) { collInitCollection(UI.collSecondary.name, UI.collSecondary); }
	collClearSelections();
}
function collPreReload(name) { if (name == UI.collSecondary.name) { collCloseSecondary(); UI.collSecondary.name = null; } }

function collPresent(coll, rows, cols) {
	let d1 = iDiv(coll);
	if (nundef(rows)) rows = coll.rows;
	if (nundef(cols)) cols = coll.cols;
	mClear(d1);
	let w = coll.w = 140 * cols;
	mStyle(d1, { wmax: w, w: w })
	let dMenu = coll.dMenu = mDom(d1, { padding: 12, wmax: w, w: w }, { className: 'title' });
	mFlexVWrap(dMenu);
	mStyle(dMenu, { gap: 10 });
	let fg = getThemeFg();
	let dInstruction = coll.dInstruction = mDom(d1, { align: 'center', fg: fg }, { html: '* press Control key when hovering to magnify image! *' })
	coll.rows = rows; coll.cols = cols;
	coll.grid = mGrid(coll.rows, coll.cols, d1, { maleft: 10, 'align-self': 'start' });
	coll.cells = [];
	let bg = getNavBg();
	for (let i = 0; i < coll.rows * coll.cols; i++) {
		let d = mDom(coll.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		coll.cells.push(d);
	}
	mStyle(dInstruction, { w: mGetStyle(coll.grid, 'w') });
	coll.dPageIndex = mDom(d1, { fg: fg, padding: 10, align: 'right' });
	collInitCollection(coll.name, coll);
}
function collCancelEditing(d) { d.remove(); }

function collClearSelections() {
	let arr = Array.from(document.getElementsByClassName('framedPicture'));//find all visible uis for selected images
	arr.forEach(mUnselect);
	UI.selectedImages = [];
	collDisableListCommands();
	collDisableItemCommands();
}
function collClosePrimary() { let d = iDiv(UI.collPrimary); mClear(d); UI.collPrimary.isOpen = false; }

function collCloseSecondary() {
	let d = iDiv(UI.collSecondary);
	mClear(d);
	mStyle(d, { w: 0, wmin: 0, border: 'transparent' });
	UI.collSecondary.isOpen = false;
	cmdEnable(UI.asSecondary.key);
}
async function collDelete(collname) {
	if (collLocked(collname) || !collExists(collname)) return;
	let keys = M.byCollection[collname];
	collPreReload(collname);
	let di = {}, deletedKeys = [];
	for (const k of keys) {
		await collDeleteOrRemove(k, collname, di, deletedKeys);
	}
	let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys, collname, deletedCollection: true });
	await loadAssets();
	collPostReload();
}
async function collDeleteOrRemove(k, collname, di, deletedKeys) {
	let item = M.superdi[k];
	let colls = item.colls;
	assertion(colls.includes(collname), `item ${k} from coll ${collname} does not have ${collname} in colls!!!!!!`)
	if (colls.length == 1) {
		console.log('deleting', k, '!!!!!!!!!!!!');
		deletedKeys.push(k);
	} else if (isdef(item.img) && item.img.includes(`/${collname}/`)) {
		removeInPlace(item.colls, collname);
		let olddir = collname;
		let newdir = item.colls[0];
		let filename = stringAfterLast(item.img, '/');
		item.img = item.img.replace(olddir, newdir);
		let resp = await mPostRoute('moveImage', { olddir, newdir, filename });
		if (isdef(resp.newpath)) item.img = resp.newpath;
		console.log('moveImage:', resp)
		di[k] = item;
	} else {
		removeInPlace(item.colls, collname);
		di[k] = item;
	}
}
function collDisableItemCommands() {
	for (const cmd of [UI.asAvatar, UI.editCollItem]) {
		if (nundef(cmd)) continue;
		cmdDisable(cmd.key);
	}
}
function collDisableListCommands() {
	for (const cmd of [UI.collClearSelections, UI.deleteSelected, UI.addSelected, UI.removeSelected, UI.editCategories, UI.addCategory, UI.removeCategory]) {
		if (nundef(cmd)) continue;
		cmdDisable(cmd.key);
	}
}
function collEnableItemCommands() {
	for (const cmd of [UI.asAvatar, UI.editCollItem]) {
		if (nundef(cmd)) continue;
		cmdEnable(cmd.key);
	}
}
function collEnableListCommands() {
	for (const cmd of [UI.collClearSelections, UI.addSelected, UI.editCategories, UI.addCategory, UI.removeCategory]) {
		if (nundef(cmd)) continue;
		cmdEnable(cmd.key);
	}
	let selist = UI.selectedImages;
	let colls = selist.filter(x => !collLocked(stringAfter(x, '@')));
	if (isEmpty(colls)) return;
	for (const cmd of [UI.deleteSelected, UI.removeSelected,]) {
		if (nundef(cmd)) continue;
		cmdEnable(cmd.key);
	}
}
function collExists(collname) { return isdef(M.byCollection[collname]); }

function collFindEmptyCell(coll) {
	let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
	if (nundef(cell)) {
		coll.index++;
		coll.cells.map(x => { mClear(x); mStyle(x, { opacity: 0 }); });
		cell = coll.cells[0];
	}
	return cell;
}
async function collFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, coll) {
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
	let o = { image: dataUrl, coll: coll.name, filename };
	let resp = await mPostRoute('postImage', o); //console.log('resp', resp); //sollte path enthalten!
	let key = stringBefore(filename, '.');
	let imgPath = `../assets/img/${coll.name}/${filename}`;
	let item = { key: key, friendly: friendly, img: imgPath, cats: cats, colls: [coll.name] };
	dPopup.remove();
	await collOnDroppedItem(item, coll);
}
function collFromElement(elem) {
	let id = findAttributeInAncestors(elem, 'id'); 
	let coll = id == 'collPrimary' ? UI.collPrimary : id == 'collSecondary' ? UI.collSecondary : null;
	return coll;
}
function collGenSelkey(key, collname) { return `${key}@${collname}`; }

function collKeyCollnameFromElem(elem) { return { key: elem.getAttribute('key'), collname: elem.getAttribute('collname') }; }

function collKeyCollnameFromSelkey(selkey) { return { key: stringBefore(selkey, '@'), collname: stringAfter(selkey, '@') }; }

function collLocked(collname) {
	if (getUname() != '____unsafe' && ['all', 'amanda', 'animals', 'big', 'emo', 'fa6', 'icon', 'nations', 'users'].includes(collname)) {
		return true;
	}
	return false;
}
async function collRename(oldname, newname) {
	if (collLocked(oldname) || !collExists(oldname) || !isAlphanumeric(newname)) {
		showMessage(`Cannot rename collection ${oldname} to ${newname}`);
		return;
	}
	console.log('rename collection', oldname, 'to', newname)
	collPreReload(oldname);
	let needToRenameDir = false;
	let di = {};
	for (const k of M.byCollection[oldname]) {
		let item = M.superdi[k];
		let path = item.img;
		if (isString(path) && path.includes(`img/${oldname}/`)) {
			item.img = `../assets/img/${newname}/${stringAfterLast(path, '/')}`;
			needToRenameDir = true;
		}
		removeInPlace(item.colls, oldname)
		item.colls.push(newname);
		di[k] = item;
	}
	if (needToRenameDir) {
		let resp = await mPostRoute('renameImgDir', { oldname, newname });
		console.log('response from server', resp)
	}
	let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: [] }); console.log('response from server', res)
	await loadAssets();
	if (UI.collPrimary.name == oldname) UI.collPrimary.name = newname;
	if (UI.collSecondary.name == oldname) UI.collSecondary.name = newname;
	collPostReload();
}
function collSelect(elem) { mClass(elem, 'framedPicture'); }

async function collShowImageInCell(cell, src) {
	mStyle(cell, { opacity: 1 });
	mClass(cell, 'magnifiable');
	let img = mDom(cell, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img' });
	await loadImageAsync(src, img);
	return img;
}
function collSidebar() {
	let wmin = 170;
	mStyle('dLeft', { wmin: wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 100, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
	let gap = 5;
	UI.collSelectAll = mCommand(d, 'collSelectAll', 'Select All'); mNewline(d, gap);
	UI.collSelectPage = mCommand(d, 'collSelectPage', 'Select Page'); mNewline(d, gap);
	UI.collClearSelections = mCommand(d, 'collClearSelections', 'Clear Selection'); mNewline(d, gap);
	UI.editCategories = mCommand(d, 'editCategories', 'Edit Categories'); mNewline(d, gap);
	UI.removeCategory = mCommand(d, 'removeCategory', 'Remove Category'); mNewline(d, gap);
	UI.addCategory = mCommand(d, 'addCategory', 'Add Category'); mNewline(d, gap);
	UI.addSelected = mCommand(d, 'addSelected', 'Add Selected'); mNewline(d, gap);
	UI.removeSelected = mCommand(d, 'removeSelected', 'Remove Selected'); mNewline(d, gap);
	UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete Selected'); mNewline(d, 3 * gap);
	collDisableListCommands();
	UI.newCollection = mCommand(d, 'newCollection', 'New Collection'); mNewline(d, gap);
	UI.asSecondary = mCommand(d, 'asSecondary', 'Edit Collection'); mNewline(d, gap);
	UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection'); mNewline(d, gap);
	UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection'); mNewline(d, 3 * gap);
	UI.asAvatar = mCommand(d, 'asAvatar', 'Set Avatar'); mNewline(d, gap);
}
function enableImageOrItemDrop(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border;
	elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping
	elem.addEventListener('drop', function (event) {
		event.preventDefault();
		elem.style.border = originalBorderStyle;
		if (isdef(UI.draggedItem)) {
			onDropCallback(null, elem);
			return;
		}
		const files = event.dataTransfer.files;
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = evReader => {
				onDropCallback(evReader.target.result, elem);
			};
			reader.readAsDataURL(files[0]);
		}
	});
}
function menuCloseColl() { closeLeftSidebar(); clearMain(); }

async function onclickAddCategory() {
	let selist = UI.selectedImages;
	let keys = selist.map(x => stringBefore(x, '@'));
	let catlist = M.categories.map(x => ({ name: x, value: false }));
	let cats = await mGather(iDiv(UI.addCategory), {}, { content: catlist, type: 'checkList' });
	if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
	cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(cats)) { console.log('nothing added'); collClearSelections(); return; }
	let di = {}, changed = false;
	for (const kc of selist) {
		let key = stringBefore(kc, '@');
		let o = M.superdi[key];
		for (const cat of cats) {
			if (o.cats.includes(cat)) continue;
			changed = true;
			o.cats.push(cat);
			di[key] = o;
		}
	}
	if (!changed) { console.log('nothing added'); collClearSelections(); return; }
	console.log('items changed:', Object.keys(di));
	await updateSuperdi(di);
	collPostReload();

}
async function onclickAddSelected() {
	let selist = UI.selectedImages;
	let keys = selist.map(x => stringBefore(x, '@'));
	let collist = M.collections.filter(x => !collLocked(x)).map(x => ({ name: x, value: false }));
	let colls = await mGather(iDiv(UI.addSelected), {}, { content: collist, type: 'checkList' });
	if (!colls) { console.log('CANCELLED!!!'); collClearSelections(); return; }
	colls = colls.split('@');
	colls = colls.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(colls)) { console.log('nothing added'); collClearSelections(); return; }
	let di = {}, changed = false;
	for (const kc of selist) {
		let key = stringBefore(kc, '@');
		let o = M.superdi[key];
		for (const collname of colls) {
			if (o.colls.includes(collname)) continue;
			changed = true;
			o.colls.push(collname);
			di[key] = o;
		}
	}
	if (!changed) { console.log('nothing added'); collClearSelections(); return; }
	console.log('items changed:', Object.keys(di));
	await updateSuperdi(di);
	collPostReload();

}
async function onclickAsAvatar(ev) {
	let item = UI.selectedImages[0];
	console.log('item', item)
	let o = collKeyCollnameFromSelkey(item);
	let key = o.key;
	let m = M.superdi[key];
	U.imgKey = key;
	let res = await postUserChange(U);
	console.log('res', res)
}
async function onclickAsSecondary(ev) {
	console.log('onclickAsSecondary')
	let name = UI.collPrimary.name;
	if (name == 'all' || collLocked(name)) {
		showMessage(`ERROR! collection ${name} cannot be altered!`);
		return;
	}
	if (nundef(M.byCollection[name])) {
		showMessage(`ERROR! collection ${name} not found!`);
		return;
	}
	UI.collSecondary.name = name;
	UI.collPrimary.name = 'animals';
	collOpenSecondary(4, 2);
	collOpenPrimary(4, 2);
}
async function onclickCollClearSelections(ev) {
	let colls = [UI.collPrimary];
	if (UI.collSecondary.isOpen) colls.push(UI.collSecondary);
	for (const coll of colls) {
		for (const cell of coll.cells) {
			let d = cell.firstChild;
			mUnselect(d);
		}
	}
	UI.selectedImages = [];
	collDisableListCommands();
}
function onclickCollDone() {
	collCloseSecondary();
	UI.collPrimary.name = UI.collSecondary.name;
	collOpenPrimary(5, 7);
}
async function onclickCollItem(ev) {
	evNoBubble(ev);
	let o = evToAttrElem(ev, 'key');
	if (!o) return;
	let [key, elem] = [o.val, o.elem];
	if (nundef(key)) { console.log('no key'); return; }
	await clickOnItem(elem, key);
}
async function onclickCollNext(ev) {
	let coll = collFromElement(ev.target.parentNode)
	showImageBatch(coll, 1);
}
async function onclickCollPrev(ev) {
	let coll = collFromElement(ev.target.parentNode)
	showImageBatch(coll, -1);
}
async function onclickCollSelectAll(ev) {
	let coll = UI.collSecondary.isOpen ? UI.collSecondary : UI.collPrimary;
	for (const cell of coll.cells) {
		let d = cell.firstChild;
		if (nundef(d)) break;
		collSelect(d);
	}
	for (const k of coll.keys) {
		addIf(UI.selectedImages, collGenSelkey(k, coll.name));
	}
	collEnableListCommands();
}
async function onclickCollSelectPage(ev) {
	let coll = UI.collSecondary.isOpen ? UI.collSecondary : UI.collPrimary;
	for (const cell of coll.cells) {
		let d = cell.firstChild;
		if (nundef(d)) break;
		collSelect(d);
		let o = collKeyCollnameFromElem(d);
		addIf(UI.selectedImages, collGenSelkey(o.key, o.collname));
	}
	collEnableListCommands();
}
async function onclickCollections() {
	let dPanes = mDom('dMain'); mFlex(dPanes);
	let dSecondary = mDom(dPanes, { wmin: 0, w: 0 }, { id: 'collSecondary', className: 'translow' }); //mFlexWrap(dPlus);
	let dPrimary = mDom(dPanes, {}, { id: 'collPrimary' }); //mFlexWrap(d1);
	collSidebar();
	let collName = localStorage.getItem('collection');
	if (nundef(collName) || !M.collections.includes(collName)) collName = 'tierspiel'
	UI.collPrimary = { div: dPrimary, name: collName };
	UI.collSecondary = { div: dSecondary, name: null };
	collOpenPrimary(5);
}
async function onclickCollItemLabel(ev) {
	evNoBubble(ev);
	let o = evToAttrElem(ev, 'key');
	if (!o) return;
	let [key, elem] = [o.val, o.elem];
	if (nundef(key)) { console.log('no key'); return; }
	let collname = elem.getAttribute('collname');
	console.log('clicked', key, collname);
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
	// let resp = await mPostRoute('postUpdateItem', { key: key, item: item });
	// console.log(resp);
	ev.target.innerHTML = newfriendly;
}
async function onclickEditCategories() {
	let selist = UI.selectedImages;
	let keys = selist.map(x => stringBefore(x, '@'));
	let arrs = keys.map(x => M.superdi[x].cats);
	let lst = unionOfArrays(arrs);
	let catlist = M.categories.map(x => ({ name: x, value: lst.includes(x) }));
	sortByDescending(catlist, 'value');
	let cats = await mGather(iDiv(UI.editCategories), {}, { content: catlist, type: 'checkListInput' });
	if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(cats)) { console.log('nothing removed'); collClearSelections(); return; }
	let di = {}, changed = false;
	for (const kc of selist) {
		let key = stringBefore(kc, '@');
		let o = M.superdi[key];
		if (sameList(cats, o.cats)) continue;
		changed = true;
		o.cats = cats;
		di[key] = o;
	}
	if (!changed) { console.log('categories unchanged!', cats); collClearSelections(); return; }
	console.log('items changed:', Object.keys(di));
	await updateSuperdi(di);
	collPostReload();

}
async function onclickEditCollItem() {
	let selist = UI.selectedImages;
	let key = selist.map(x => stringBefore(x, '@'))[0];
	let item = M.superdi[key];
	let catlist = M.categories.map(x => ({ name: x, value: item.cats.includes(x) }));
	sortByDescending(catlist, 'value');
	let cats = await mGather(iDiv(UI.addCategory), {}, { content: catlist, type: 'checkListInput' });
	if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
	cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x));
	if (sameList(item.cats, cats)) { console.log('no change'); collClearSelections(); return; }
	console.log(`cats of item ${key} set to`, cats);
	item.cats = cats;
	let di = {}; di[key] = item;
	await updateSuperdi(di);
	collPostReload();

}
async function onclickNewCollection(name='tierspiel') {
	if (nundef(name)) name = await mGather(iDiv(UI.newCollection));
	if (!name) return;
	if (isEmpty(name)) {
		showMessage(`ERROR! you need to enter a valid name!!!!`);
		return;
	}
	if (collLocked(name)) {
		showMessage(`collection ${name} is Read-Only!`);
		return;
	}
	M.collections.push(name); M.collections.sort();
	UI.collSecondary.name = name;
	collOpenSecondary(4, 2);
	collOpenPrimary(4, 2);
}
async function onclickRemoveCategory() {
	let selist = UI.selectedImages;
	let keys = selist.map(x => stringBefore(x, '@'));
	let arrs = keys.map(x => M.superdi[x].cats);
	let lst = unionOfArrays(arrs); lst.sort();
	let catlist = lst.map(x => ({ name: x, value: false }));
	let cats = await mGather(iDiv(UI.removeCategory), {}, { content: catlist, type: 'checkList' });
	if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
	cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(cats)) { console.log('nothing removed'); collClearSelections(); return; }
	let remolist = cats;
	console.log('remove cats', remolist);
	let di = {}, changed = false;
	for (const kc of selist) {
		let key = stringBefore(kc, '@');
		let o = M.superdi[key];
		for (const cat of cats) {
			if (!o.cats.includes(cat)) continue;
			changed = true;
			removeInPlace(o.cats, cat);
			di[key] = o;
		}
	}
	if (!changed) { console.log('ERROR: none of selected elements has cat in', remolist); collClearSelections(); return; }
	console.log('items changed:', Object.keys(di));
	await updateSuperdi(di);
	collPostReload();

}
async function onclickRemoveSelected() {
	let selist = UI.selectedImages;
	let di = {};
	for (const k of selist) {
		let o = collKeyCollnameFromSelkey(k);
		let key = o.key;
		let collname = o.collname;
		if (collLocked(collname)) continue;
		let item = M.superdi[key];
		removeInPlace(item.colls, collname);
		di[key] = item;
	}
	if (isEmpty(di)) {
		showMessage(`ERROR: cannot delete selected items!!!`);
		collClearSelections();
		return;
	}
	await updateSuperdi(di);
	collPostReload();

}
async function onclickRenameCollection(oldname, newname) {
	if (nundef(oldname)) oldname = UI.collSecondary.isOpen ? UI.collSecondary.name : collLocked(UI.collPrimary.name) ? null : UI.collPrimary.name;
	if (nundef(newname)) {
		let di = await mGather(iDiv(UI.renameCollection), {}, { content: { oldname: valf(oldname, ''), newname: '' }, type: 'multi' });
		if (!di) return;
		[oldname, newname] = [di.oldname, di.newname];
	}
	newname = newname.toLowerCase();
	if (isEmpty(newname)) {
		showMessage(`ERROR! you need to enter a valid new name!!!!`);
		return;
	}
	if (!isAlphanumeric(newname)) {
		showMessage(`ERROR! ${newname} needs to be alphanumeric starting with a letter!`);
		return;
	}
	if (collLocked(oldname)) { showMessage(`ERROR: Collection ${oldname} is Read-Only!`); return; }
	if (!collExists(oldname)) {
		showMessage(`ERROR: Collection ${oldname} not found!`);
		return;
	}
	if (isdef(M.byCollection[newname])) {
		showMessage(`ERROR! Collection ${newname} already exists!!!!`);
		return;
	}
	await collRename(oldname, newname);
}
async function oninputCollFilter(ev) {
	let id = evToId(ev);
	let coll = UI[id];
	let s = ev.target.value.toLowerCase().trim();
	let list = collFilterImages(coll, s);
	coll.keys = list;
	coll.filter = s;
	coll.index = 0; coll.pageIndex = 1; collClearSelections();
	showImageBatch(coll, 0, false);
}
function showImageBatch(coll, inc = 0, alertEmpty = false) {
	let [keys, index, numCells] = [coll.keys, coll.index, coll.rows * coll.cols];
	if (isEmpty(keys) && alertEmpty) showMessage('nothing has been added to this collection yet!');
	if (keys.length <= numCells) inc = 0;
	let newPageIndex = coll.pageIndex + inc;
	let numItems = keys.length;
	let maxPage = Math.max(1, Math.ceil(numItems / numCells));
	if (newPageIndex > maxPage) newPageIndex = 1;
	if (newPageIndex < 1) newPageIndex = maxPage;
	index = numCells * (newPageIndex - 1);
	let list = arrTakeFromTo(keys, index, index + numCells);
	coll.index = index; coll.pageIndex = newPageIndex;
	for (let i = 0; i < list.length; i++) {
		let d = coll.cells[i];
		mStyle(d, { opacity: 1 });
		mClass(d, 'magnifiable')
		let d1 = showImageInBatch(list[i], d, {}, {prefer:coll.name == 'emo'?'img':'photo'});
		d1.setAttribute('collname', coll.name);
		let selkey = collGenSelkey(list[i], coll.name);
		if (isList(UI.selectedImages) && UI.selectedImages.includes(selkey)) collSelect(d1);
	}
	for (let i = list.length; i < numCells; i++) {
		mStyle(coll.cells[i], { opacity: 0 })
	}
	coll.dPageIndex.innerHTML = `page ${coll.pageIndex}/${maxPage}`;
	let [dNext, dPrev] = [mBy('bNext'), mBy('bPrev')];
	if (maxPage == 1) { mClass(dPrev, 'disabled'); mClass(dNext, 'disabled'); }
	else { mClassRemove(dPrev, 'disabled'); mClassRemove(dNext, 'disabled'); }
}
function showImageInBatch(key, dParent, styles = {}, opts = {}) {
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
	label.onclick = onclickCollItemLabel;
	mStyle(d1, { cursor: 'pointer' });
	d1.onclick = onclickCollItem;
	d1.setAttribute('key', key);
	d1.setAttribute('draggable', true)
	d1.ondragstart = () => { UI.draggedItem = o; };
	return d1;
}
