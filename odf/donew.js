function createOpenTable(gamename, players, options) {
	let playerNames = players.map(x => x.name);
	assertion(playerNames[0] == U.name, `_addTable: owner should be ${U.name} and first in ${playerNames.join(',')}`);
	let t={
		status: 'open',
		id: generateTableId(),
		fen: null,
		game: gamename,
		owner: playerNames[0],
		friendly: generateTableName(),
		players: players,
		playerNames: playerNames,
		options
	};
	return t;

}
function adjustCropper(img, dc, sz) {
	let [w, h] = [img.width, img.height]; console.log('sz', w, h,)
	let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
	mStyle(dc, { left: cx - radx, top: cy - rady, w: sz, h: sz });

}
function adjustCropperBySimple(dc, x, y, dx, dy) { mStyle(dc, { left: x + dx, top: y + dy }); }

function adjustCropperBy(dc, x, y, dx, dy, wImg, hImg, szIdeal) {
	// let [w,h]=[img.width,img.height];	console.log('sz',w,h,)
	// let [cx,cy,radx,rady,rad]=[w/2,h/2,sz/2,sz/2,sz/2];
	console.log('_________\ndx', dx, 'dy', dy)
	//let [x,y]=[mGetStyle(dc,'left'),mGetStyle(dc,'top')]

	if (nundef(wImg)) {
		//no change in cropper size!
		mStyle(dc, { left: x + dx, top: y + dy }); //,w:sz,h:sz});
		return;
	}

	console.log('image sz', wImg, hImg)
	let [l, t, w, h] = [mGetStyle(dc, 'left'), mGetStyle(dc, 'top'), mGetStyle(dc, 'w'), mGetStyle(dc, 'h')]; console.log('dims', l, t, w, h);
	let [cx, cy] = [l + w / 2, t + h / 2];
	//let curDist=Math.min(l,t,wImg-(l+w),hImg-(t+h));	console.log('curDist',curDist)
	let [cxNew, cyNew] = [cx + dx, cy + dy]; console.log('new center', cxNew, cyNew)
	//min distance of cropper center to any image boundary
	let newDist = Math.min(cxNew, cyNew, wImg - cxNew, hImg - cyNew); console.log('newDist', newDist)
	//size of cropper should be:
	let wNew = Math.min(szIdeal, newDist * 2);
	let hNew = Math.min(szIdeal, newDist * 2);
	let xNew = cxNew - wNew / 2;
	let yNew = cyNew - hNew / 2;
	//dist is the min distance the cropper is currently 

	mStyle(dc, { left: xNew, top: yNew, w: wNew, h: hNew }); //,w:sz,h:sz});


}
function adjustComplex(panData) {
	//initial pos of cropper:
	let [x0, y0] = [panData.posStart.x, panData.posStart.y];

	//how much moved the mouse:
	let [dx, dy] = [panData.mouse.x - panData.mouseStart.x, panData.mouse.y - panData.mouseStart.y];

	//image size: (constant)
	let [wImg, hImg] = [panData.img.width, panData.img.height];

	//ideal size: (since cropping square initial width of cropper suffices):
	let ideal = panData.cropStartSize.w;

	//cropper initial center:
	let [cx0, cy0] = [panData.cropStartPos.l + ideal / 2, panData.cropStartPos.t + ideal / 2];

	//theoretically, cropper initial center should be moved by dx,dy
	let [cx, cy] = [cx0 + dx, cy0 + dy];
	//cx = clamp(cx, 0, wImg); cy = clamp(cy, 0, hImg); console.log('center', cx, cy)
	cx = clamp(cx, ideal / 2, wImg - ideal / 2); cy = clamp(cy, ideal / 2, hImg - ideal / 2); //console.log('center', cx, cy)

	//where should the new left of the cropper be? at least 0, at most wImg, ideally:cx-ideal/2
	let lNew = clamp(cx - ideal / 2, 0, wImg); //console.log('lNew is', lNew);
	let tNew = clamp(cy - ideal / 2, 0, hImg); //console.log('tNew is', tNew);
	let rNew = clamp(cx + ideal / 2, 0, wImg); //console.log('rNew is', rNew);
	let bNew = clamp(cy + ideal / 2, 0, hImg); //console.log('bNew is', bNew);

	//what will the new size be once I have lNew and tNew?
	let wNew = Math.min(Math.abs(cx - lNew) * 2, Math.abs(rNew - cx) * 2);
	let hNew = Math.min(Math.abs(cy - tNew) * 2, Math.abs(bNew - cy) * 2); //console.log('wNew,hNew', wNew, hNew)

	mStyle(panData.dCrop, { left: cx - wNew / 2, top: cy - hNew / 2, w: wNew, h: hNew });
}
function checkToInput(ev, inp, grid) {
	let checklist = Array.from(grid.querySelectorAll('input[type="checkbox"]')); //chks=items.map(x=>iDiv(x).firstChild);
	let names = checklist.filter(x => x.checked).map(x => x.name);
	sortCheckboxes(grid);
	names.sort();
	inp.value = names.join(', ') + ', ';
}
function clearBodyDiv(styles = {}, opts = {}) { document.body.innerHTML = ''; return mDom(document.body, styles, opts) }

function clearCell(cell) { mClear(cell); mStyle(cell, { opacity: 0 }); }

function clearMain() { clear_timeouts(); mClear('dMain'); mClear('dTitle'); }

function clearParent(ev) { mClear(ev.target.parentNode); }

function closeLeftSidebar() { mClear('dLeft'); mStyle('dLeft', { w: 0, wmin: 0 }) }

function cmdDisable(cmd) { mClass(iDiv(cmd), 'disabled') }

function cmdEnable(cmd) { mClassRemove(iDiv(cmd), 'disabled') }

async function collAddItem(coll, key, item) {
	//console.log('adding', key, item, 'to collection', coll);
	if (nundef(M.superdi[key])) {
		//need to add to superdi and save superdi!
		M.superdi[key] = item;
		let res = await mPostRoute('postNewItem', { key: key, item: item });
		//console.log('<=server:', res);
	} else {
		addIf(item.colls, coll.name);
		//console.log('item collections are', item.colls);
		let res = await mPostRoute('postUpdateItem', { key: key, item: item });
		//console.log('<=server:', res);
	}
	for (const cat of item.cats) lookupAddIfToList(M.byCat, [cat], key);
	for (const coll of item.colls) lookupAddIfToList(M.byCollection, [coll], key);
	lookupAddIfToList(M.byFriendly, [item.friendly], key)
	M.categories = Object.keys(M.byCat); M.categories.sort();
	M.collections = Object.keys(M.byCollection); M.collections.sort();
	M.names = Object.keys(M.byFriendly); M.names.sort();
}
function collCancelEditing(d) { d.remove(); }

function collClear() { closeLeftSidebar(); clearMain(); }

function collClearSelections() {
	let arr = Array.from(document.getElementsByClassName('framedPicture'));//find all visible uis for selected images
	//console.log('selected elements',arr)
	arr.forEach(collUnselect);
	UI.selectedImages = [];
	collDisableListCommands();
	collDisableItemCommands();
}
function collClosePrimary() { let d = iDiv(UI.collPrimary); mClear(d); UI.collPrimary.isOpen = false; }

function collCloseSecondary() {
	let d = iDiv(UI.collSecondary);
	mClear(d);
	mStyle(d, { w: 0, wmin: 0, border: 'transparent' });
	//console.log('d', d)
	UI.collSecondary.isOpen = false;
	cmdEnable(UI.asSecondary);

}
async function collDelete(collname) {
	if (collLocked(collname) || !collExists(collname)) return;
	let keys = M.byCollection[collname];
	//console.log('_________delete collection', keys)
	collPreReload(collname);
	let di = {}, deletedKeys = []; //,needToRenameImgDir=false,newdir=null;
	for (const k of keys) {
		await collDeleteOrRemove(k, collname, di, deletedKeys);
	}

	let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys, collname, deletedCollection: true });
	//console.log('postUpdateSuperdi', res)
	await loadAssets();

	collPostReload(); //	delete M.byCollection[collname];


}
async function collDeleteOrRemove(k, collname, di, deletedKeys) {
	let item = M.superdi[k];
	//console.log('item', item)
	let colls = item.colls;
	//console.log('colls', colls)
	assertion(colls.includes(collname), `item ${k} from coll ${collname} does not have ${collname} in colls!!!!!!`)
	if (colls.length == 1) {
		console.log('deleting', k, '!!!!!!!!!!!!');
		deletedKeys.push(k);
	} else if (isdef(item.img) && item.img.includes(`/${collname}/`)) {
		removeInPlace(item.colls, collname);
		//move this img to other collname, create it if it does not exist!!!
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
		cmdDisable(cmd);
	}
}
function collDisableListCommands() {
	for (const cmd of [UI.collClearSelections, UI.deleteSelected, UI.addSelected, UI.removeSelected, UI.editCategories, UI.addCategory, UI.removeCategory]) {
		if (nundef(cmd)) continue;
		cmdDisable(cmd);
	}
}
function collEnableItemCommands() {
	for (const cmd of [UI.asAvatar, UI.editCollItem]) {
		if (nundef(cmd)) continue;
		cmdEnable(cmd);
	}
}
function collEnableListCommands() {
	for (const cmd of [UI.collClearSelections, UI.addSelected, UI.editCategories, UI.addCategory, UI.removeCategory]) {
		if (nundef(cmd)) continue;
		cmdEnable(cmd);
	}
	let selist = UI.selectedImages;
	//console.log('selist',selist);
	let colls = selist.filter(x => !collLocked(stringAfter(x, '@')));
	if (isEmpty(colls)) return;

	for (const cmd of [UI.deleteSelected, UI.removeSelected,]) {
		if (nundef(cmd)) continue;
		cmdEnable(cmd);
	}
}
function collectOptions() {
	let poss = Serverdata.config.games[DA.gamename].options;
	if (nundef(poss)) return;
	let options = DA.options = {};
	for (const p in poss) {
		let fs = mBy(`d_${p}`);
		let val = get_checked_radios(fs)[0];
		options[p] = isNumber(val) ? Number(val) : val;
	}
	return options;
}
function collectPlayers(options) {

	let players = [];
	if (isList(DA.playerlist)) players = DA.playerlist.map(x => ({ name: x.name, playmode: x.playmode, strategy: valf(x.strategy, options.strategy, 'random') }));
	// : rPlayers(U.name,valf(options.nplayers-1);
	// let players = DA.playerlist.map(x => ({ name: x.uname, playmode: x.playmode }));
	// for (const pl of players) { if (isEmpty(pl.strategy)) pl.strategy = valf(options.strategy, 'random'); }
	return players;
	// startgame(game, players, options); hide('dMenu');
}
function collExists(collname) { return isdef(M.byCollection[collname]); }

function collFilterImages(coll, s) {
	//console.log('filter on', s)
	//if (isEmpty(s)) list = coll.masterKeys; //return;
	let di = {};
	for (const k of coll.masterKeys) { di[k] = true; }
	let list = isEmpty(s) ? Object.keys(di) : isdef(M.byCat[s]) ? M.byCat[s].filter(x => isdef(di[x])) : [];
	if (nundef(list) || isEmpty(list)) {
		list = [];
		for (const k of coll.masterKeys) {
			let o = M.superdi[k];
			if (k.includes(s) || o.friendly.toLowerCase().includes(s)) list.push(k);
		}
		//if (isEmpty(list)) return;
	}
	return list;
}
function collFindEmptyCell(coll) {
	let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
	//console.log('free cell', cell);
	if (nundef(cell)) {
		coll.index++;
		coll.cells.map(x => { mClear(x); mStyle(x, { opacity: 0 }); });
		cell = coll.cells[0];
	}
	return cell;
}
async function collFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, coll) {
	// crop image to cropper
	//const canvas = document.createElement('canvas');
	let dims = mGetStyles(dc, ['left', 'top', 'w', 'h']); //console.log('dims', dims);

	let wScale = img.width / wOrig;
	let hScale = img.height / hOrig;
	//console.log('scale', wScale, hScale, wOrig, hOrig, img.width, img.height)

	let d1 = mDom(document.body, { margin: 10 });
	let canvas = mDom(d1, {}, { tag: 'canvas', width: dims.w, height: dims.h });
	const ctx = canvas.getContext('2d');

	//ctx.fillStyle='yellow';	ctx.fillRect(0,0,dims.w,dims.h);

	// ctx.drawImage(img,dims.left,dims.top,img.width*scale,img.height*scale,0,0,dims.w,dims.h)
	//ctx.drawImage(img, 50, 50, 300, 300, 0, 0, 300, 300);
	//ctx.clearRect(0,0,dims.w,dims.h);

	ctx.drawImage(img, dims.left / wScale, dims.top / hScale, (dims.w) / wScale, img.height / hScale, 0, 0, dims.w, dims.h)

	const dataUrl = canvas.toDataURL('image/png'); //davon jetzt die dataUrl!

	if (isEmpty(inpFriendly.value)) inpFriendly.value = 'pic'
	//if (isEmpty(inpCats.value)) inpCats.value='animal'

	let friendly = inpFriendly.value;
	let cats = extractWords(valf(inpCats.value, ''));
	//console.log('cats', cats)
	//paste dataUrl into cell
	let filename = (isdef(M.superdi[friendly]) ? 'i' + get_timestamp() : friendly) + '.png'; //console.log('filename', filename);
	let o = { image: dataUrl, coll: coll.name, path: filename };
	let resp = await mPostRoute('postImage', o); //console.log('resp', resp); //sollte path enthalten!

	//jetzt hab ich das complete item und kann es zu coll adden!
	let key = stringBefore(filename, '.');
	let imgPath = `../assets/img/${coll.name}/${filename}`;
	let item = { key: key, friendly: friendly, img: imgPath, cats: cats, colls: [coll.name] };

	dPopup.remove();
	await collOnDroppedItem(item, coll);
}
function collFromElement(elem) {
	let id = findAttributeInAncestors(elem, 'id'); //console.log('ancestor is',id);//find Ancestor with id collPrimary or collSecondary
	let coll = id == 'collPrimary' ? UI.collPrimary : id == 'collSecondary' ? UI.collSecondary : null;
	return coll;
}
function collGenSelkey(key, collname) { return `${key}@${collname}`; }

function collInitCollection(name, coll) {
	let isReload = isdef(coll.index) && coll.name == name;
	//console.log('_________ init',name,isReload,'\ncoll',coll.name,coll.index,coll.pageIndex,coll.filter);
	if (!isReload) {
		coll.index = 0; coll.pageIndex = 1; coll.name = name; coll.filter = null;
	}

	//console.log('coll',coll.name,coll.index,coll.pageIndex,coll.filter);

	let list = [];
	if (name == 'all' || isEmpty(name)) {
		list = Object.keys(M.superdi);
	} else if (isdef(M.byCollection[name])) {
		list = M.byCollection[name];
	} else list = []; //return;
	if (coll == UI.collPrimary) localStorage.setItem('collection', name)
	let dMenu = coll.dMenu;
	mClear(dMenu);

	let d = mDom(dMenu); mFlexV(d);
	mDom(d, { fz: 24, weight: 'bold' }, { html: 'Collection:' });
	let colls = M.collections;
	let dlColl = mDatalist(d, colls, { placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value, coll);
	dlColl.inpElem.value = name;
	list = sortByFunc(list, x => M.superdi[x].friendly); // ***sorting by name!
	coll.masterKeys = list;
	coll.keys = coll.filter ? collFilterImages(coll, coll.filter) : list;

	//filter
	let cats = collectCats(coll.keys);
	cats.sort();
	d = mDom(dMenu); mFlexV(d);
	let wLabel = coll.cols < 6 ? 117 : 'auto';
	mDom(d, { fz: 24, weight: 'bold', w: wLabel, align: 'right' }, { edit: true, html: 'Filter:' });
	let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>", value: coll.filter });
	dlCat.inpElem.oninput = oninputCollFilter;

	d = mDom(dMenu, { gap: 10, align: 'right' });
	if (coll.cols < 6) mStyle(d, { w100: true });
	if (coll == UI.collSecondary) mButton('done', onclickCollDone, d, { w: 70, margin: 0, maleft: 10 }, 'input');
	mButton('prev', onclickCollPrev, d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bPrev');
	mButton('next', onclickCollNext, d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bNext');

	collClearSelections();
	showImageBatch(coll);
	//showDiv(dMenu); return;
}
function collKeyCollnameFromElem(elem) { return { key: elem.getAttribute('key'), collname: elem.getAttribute('collname') }; }

function collKeyCollnameFromSelkey(selkey) { return { key: stringBefore(selkey, '@'), collname: stringAfter(selkey, '@') }; }

function collLocked(collname) {
	if (U.name != '____unsafe' && ['all', 'amanda', 'animals', 'big', 'emo', 'fa6', 'icon', 'nations', 'users'].includes(collname)) {
		//console.log(`LOCKED collection ${collname}`);
		return true;
	}
	return false;
}
async function collOnDropImage(url, dDrop) {
	let item = UI.draggedItem;
	//console.log('dropped', item); //return;
	UI.draggedItem = null;
	let coll = UI.collSecondary;

	if (isdef(item)) return await collOnDroppedItem(item, coll);
	else return await collOnDroppedUrl(url, coll);
}
async function collOnDroppedUrl(url, coll) {

	//now this is the case when item is NOT defined!
	//let cell = collFindEmptyCell(coll);//find an empty cell to put the picture in!
	// let img = await collShowImageInCell(cell, url); // ist zwar gut aber ich will gleich den editor!
	// NO! mButton('edit', async => { imgEditor1(url); }, cell, { position: 'absolute' }); //add an edit button to image

	//await imgEditor(cell,url);
	let m = await imgMeasure(url); console.log('sz', m);

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
async function collOnDroppedItem(item, coll) {
	//user dragged from an item on the page
	assertion(isdef(item.key), 'NO KEY!!!!!');
	await collAddItem(coll, item.key, item);

	collOpenSecondary(4, 3);
	showImageBatch(coll, -1);
}
function collOpenPrimary(rows, cols) { collPresent(UI.collPrimary, rows, cols); UI.collPrimary.isOpen = true; }
function collOpenSecondary(rows, cols) {
	let coll = UI.collSecondary;
	let d = iDiv(coll);
	mStyle(d, { wmin: 450, border: 'white' });
	collPresent(coll, rows, cols);
	coll.isOpen = true;
	coll.dInstruction.innerHTML = '* drag images into the shaded area *'
	let grid = coll.grid;
	mStyle(grid, { bg: '#00000030' })
	enableImageOrItemDrop(grid, collOnDropImage);
	cmdDisable(UI.asSecondary);
}
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

	// mDom(d1,{w100:true,h:1});
	let fg = getThemeFg();
	let dInstruction = coll.dInstruction = mDom(d1, { align: 'center', fg: fg }, { html: '* press Control key when hovering to magnify image! *' })
	// mDom(d1,{w100:true,h:1});

	//coll = uiTypeCollection(5,6,)
	coll.rows = rows; coll.cols = cols;
	coll.grid = mGrid(coll.rows, coll.cols, d1, { maleft: 10, 'align-self': 'start' });
	coll.cells = [];
	let bg = mGetStyle('dNav', 'bg');
	for (let i = 0; i < coll.rows * coll.cols; i++) {
		let d = mDom(coll.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		coll.cells.push(d);
	}
	mStyle(dInstruction, { w: mGetStyle(coll.grid, 'w') });

	coll.dPageIndex = mDom(d1, { fg: fg, padding: 10, align: 'right' });

	collInitCollection(coll.name, coll);
}
function collPreReload(name) { if (name == UI.collSecondary.name) { collCloseSecondary(); UI.collSecondary.name = null; } }
function collPostReload() {
	if (UI.collPrimary.isOpen) { collInitCollection(UI.collPrimary.name, UI.collPrimary); }
	if (UI.collSecondary.isOpen) { collInitCollection(UI.collSecondary.name, UI.collSecondary); }
	collClearSelections();

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
		//let res = await mPostRoute('postUpdateItem',{key:k,item:item}); console.log(res)
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
function collUnselect(elem) { mClassRemove(elem, 'framedPicture'); }
async function collShowImageInCell(cell, src) {
	mStyle(cell, { opacity: 1 });
	mClass(cell, 'magnifiable');

	//will ich jetzt awaitable!
	let img = mDom(cell, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img' });
	await loadImageAsync(src, img);

	return img;

}
function collSidebar() {

	// console.log('r',getRect('dLeft'))
	//mClear('dLeft');
	let wmin = 170;
	mStyle('dLeft', { wmin: wmin, });
	let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 160, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
	let gap = 5;

	// *** selection commands ***
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

	// *** collectino commands ***
	UI.newCollection = mCommand(d, 'newCollection', 'New Collection'); mNewline(d, gap);
	UI.asSecondary = mCommand(d, 'asSecondary', 'Open DragDrop'); mNewline(d, gap);
	UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection'); mNewline(d, gap);
	UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection'); mNewline(d, 3 * gap);

	UI.asAvatar = mCommand(d, 'asAvatar', 'Set Avatar'); mNewline(d, gap);

	//onclickCollClearSelections	//cmdDisable(UI.collSelectAll);
	// UI.addCategory = mCommand(d, 'addCategory', 'Add Categories'); mNewline(d);
	// cmdDisable(UI.addCategory);


	// UI.sortCollection = mCommand(d, 'sortBy', 'Sort By'); mNewline(d);
}
function colorContrast(dDrop, list = ['white', 'black']) {
	let bg = mGetStyle(dDrop, 'bg'); return bestContrastingColor(bg, list);
}
async function cropOrExpandImageAndGetDataUrl_trial1_W(imageSrc) {
	return new Promise((resolve, reject) => {
		// Create an image object
		const img = new Image();
		img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
		img.onload = () => {
			// Canvas setup
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = 300;
			canvas.height = 300;

			// Determine scaling needed to "cover" 300x300
			const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
			const scaledWidth = img.width * scale;
			const scaledHeight = img.height * scale;

			// Calculate the center position
			const dx = (canvas.width - scaledWidth) / 2;
			const dy = (canvas.height - scaledHeight) / 2;

			// Draw the image centered and covering
			ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);

			// Get the data URL of the canvas
			const dataUrl = canvas.toDataURL();
			resolve(dataUrl);
		};
		img.onerror = (error) => reject(error);

		// Set the source of the image
		img.src = imageSrc;
	});
}
async function cropOrExpandImageAndGetDataUrl(imageSrc, x, y) {
	return new Promise((resolve, reject) => {
		// Create an image object
		const img = new Image();
		img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
		img.onload = () => {
			// Canvas setup
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = 300;
			canvas.height = 300;

			// Determine scaling needed to "cover" 300x300
			const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
			const scaledWidth = img.width * scale;
			const scaledHeight = img.height * scale;

			// Calculate the center position
			const dx = isdef(x) ? x * scale : (canvas.width - scaledWidth) / 2;
			const dy = isdef(y) ? y * scale : (canvas.height - scaledHeight) / 2;

			// Draw the image centered and covering
			ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);

			// Get the data URL of the canvas
			const dataUrl = canvas.toDataURL();
			resolve(dataUrl);
		};
		img.onerror = (error) => reject(error);

		// Set the source of the image
		img.src = imageSrc;
	});
}
function createHumanPlayer(name) { return { name, playmode: 'human', strategy: 'random' }; }
function createScaledCanvasFromImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			// Calculate the scale to ensure the smaller side is 300px
			const scale = 300 / Math.min(img.width, img.height);
			const scaledWidth = img.width * scale;
			const scaledHeight = img.height * scale;

			// Create a canvas and set its width and height
			const canvas = document.createElement('canvas');
			canvas.width = scaledWidth;
			canvas.height = scaledHeight;

			// Draw the image onto the canvas with the new size
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

			// Resolve the promise with the canvas
			resolve(canvas);
		};
		img.onerror = reject;
		img.src = src;
	});
}
async function deleteEvent(id) {
	let result = await simpleUpload('postEvent', { id });
	delete Items[id];
	mBy(id).remove();
}
function deleteKeyFromLocalSuperdi(k) {
	delete M.superdi[k];

	let fri = item.friendly;
	//remove the key from M.byFriendly, if M.byFriendly[item.friendly] empty also delete it from names and byFriendly
	let lst = M.byFriendly[fri];
	removeInPlace(lst, k); if (isEmpty(lst)) { delete M.byFriendly[fri]; removeInPlace(M.names, fri); }

	//for each cat: remove the key from M.byCat, if M.byFriendly[item.friendly] empty also delete it from names and byFriendly
	for (const cat of item.cats) {
		let lst = M.byCat[cat];
		removeInPlace(lst, k); if (isEmpty(lst)) { delete M.byCat[cat]; removeInPlace(M.categories, cat); }
	}
}
function doYourThing(inp, grid) {
	//console.log('______ ',inp.value)
	let words = extractWords(inp.value, ' ').map(x => x.toLowerCase());
	//console.log('words', words);

	let checklist = Array.from(grid.querySelectorAll('input[type="checkbox"]')); //chks=items.map(x=>iDiv(x).firstChild);
	let allNames = checklist.map(x => x.name);
	let names = checklist.filter(x => x.checked).map(x => x.name);

	//console.log('names',allNames,names);
	// let needToSortChildren = false;
	for (const w of words) {
		if (!allNames.includes(w)) {
			//add this word to the options
			//console.log('a new name!', w);
			//how do I add another checkbox?
			let div = mCheckbox(grid, w);
			let chk = div.firstChild;
			chk.checked = true;
			chk.addEventListener('click', ev => checkToInput(ev, inp, grid))
			needToSortChildren = true;

		} else {
			//console.log('got it:', w);
			let chk = checklist.find(x => x.name == w);
			if (!chk.checked) chk.checked = true;

		}
	}

	for (const name of names) {
		if (!words.includes(name)) {
			let chk = checklist.find(x => x.name == name);
			chk.checked = false;
		}
	}
	sortCheckboxes(grid);
	words.sort();
	inp.value = words.join(', ') + ', ';
}
function enableImageDrop(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border; // Store the original border style to restore it later

	elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping

	// Restore the original border and call the callback function when an image is dropped
	elem.addEventListener('drop', function (event) {
		event.preventDefault(); // Prevent the browser's default file open behavior
		elem.style.border = originalBorderStyle; // Restore the original border style

		const files = event.dataTransfer.files; // Get the files that were dropped
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = evReader => {
				onDropCallback(evReader.target.result, elem);
			};
			reader.readAsDataURL(files[0]);
		}
	});
}
function enableImageOrItemDrop(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border; // Store the original border style to restore it later

	elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping

	// Restore the original border and call the callback function when an image is dropped
	elem.addEventListener('drop', function (event) {
		event.preventDefault(); // Prevent the browser's default file open behavior
		elem.style.border = originalBorderStyle; // Restore the original border style

		if (isdef(UI.draggedItem)) {
			//console.log('dropping item',UI.draggedItem); 
			onDropCallback(null, elem);
			return;
		}
		const files = event.dataTransfer.files; // Get the files that were dropped
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = evReader => {
				onDropCallback(evReader.target.result, elem);
			};
			reader.readAsDataURL(files[0]);
		}
	});
}
function enableImageDrop_trial1_W(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border; // Store the original border style to restore it later

	elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping

	// Restore the original border and call the callback function when an image is dropped
	elem.addEventListener('drop', function (event) {
		event.preventDefault(); // Prevent the browser's default file open behavior
		elem.style.border = originalBorderStyle; // Restore the original border style

		const files = event.dataTransfer.files; // Get the files that were dropped
		if (files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) { // Check if the dropped file is an image
				onDropCallback(file); // Call the provided callback function with the image file
			}
		}
	});
}
function extractWords(s, allowed) {
	let specialChars = toLetters(' ,-.!?;:');
	if (isdef(allowed)) specialChars = arrMinus(specialChars, toLetters(allowed));
	let parts = splitAtAnyOf(s, specialChars.join('')).map(x => x.trim());
	return parts.filter(x => !isEmpty(x));
}
function generateRandomWords(n, unique = false) {
	// Sample words to pick from
	const sampleWords = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'victoria plum', 'watermelon', 'xigua', 'yuzu', 'zucchini'];

	// Generate the array
	let randomWords = [];
	for (let i = 0; i < n; i++) {
		// Pick a random word from the sampleWords array
		const randomWord = sampleWords[Math.floor(Math.random() * sampleWords.length)];
		randomWords.push(randomWord);
	}
	return randomWords;
}
function generateTableId() { return rUniqueId(20); }
function generateTableName(n) {
	let existing = Serverdata.tables.map(x => x.friendly);
	while (true) {
		let cap = rChoose(M.capital);
		let parts = cap.split(' ');
		if (parts.length == 2) cap = stringBefore(cap, ' '); else cap = stringBefore(cap, '-');
		cap = cap.trim();
		let arr = ['battle of ', 'rally of ', 'showdown in ', 'summit of ', 'joust of ', 'tournament of ', 'rendezvous in ', 'soirée in ', 'festival of '];//,'encounter in ']; //['battle of ', 'war of ']
		//let s = rChoose(['meetup in ','carnival of ','summit of ','tournament of ','forum of ','rendezvous in ','soirée in ']) + cap;
		let s = (n == 2 ? 'duel of ' : rChoose(arr)) + cap;
		if (!existing.includes(s)) return s;
	}
}
function getCheckedNames(dParent) {
	let checks = Array.from(dParent.querySelectorAll('input[type="checkbox"]')); //dParent.getElementsByTagName('input'));
	let res = [];
	for (const ch of checks) {
		if (ch.checked) res.push(ch.name);
	}
	return res;
}
function getGameColor(gamename) { return Serverdata.config.games[gamename].color; }
function getMouseCoordinatesRelativeToElement(ev, elem) {
	// Get the bounding rectangle of the element
	if (nundef(elem)) elem = ev.target;
	const rect = elem.getBoundingClientRect();

	// Calculate the click's coordinates relative to the element
	const x = ev.clientX - rect.left;
	const y = ev.clientY - rect.top;

	return { x, y };
}
function getUserColor(uname) { return Serverdata.users[uname].color; }
async function imgAsIsInDiv(url, dParent) {
	let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	let sz = 300;
	let img = await imgAsync(d, {}, { tag: 'img', src: url });
	let [w, h] = [img.width, img.height]; console.log('sz', w, h);
	let scale = sz / img.height;
	return [img, scale];
}
async function imgCrop(img, dc, wOrig, hOrig) {
	// crop image to cropper
	//const canvas = document.createElement('canvas');
	let dims = mGetStyles(dc, ['left', 'top', 'w', 'h']); console.log('dims', dims);

	let wScale = img.width / wOrig;
	let hScale = img.height / hOrig;
	console.log('scale', wScale, hScale, wOrig, hOrig, img.width, img.height)

	let d1 = mDom(document.body, { margin: 10 });
	let canvas = mDom(d1, {}, { tag: 'canvas', width: dims.w, height: dims.h });
	const ctx = canvas.getContext('2d');

	//ctx.fillStyle='yellow';	ctx.fillRect(0,0,dims.w,dims.h);

	// ctx.drawImage(img,dims.left,dims.top,img.width*scale,img.height*scale,0,0,dims.w,dims.h)
	//ctx.drawImage(img, 50, 50, 300, 300, 0, 0, 300, 300);
	//ctx.clearRect(0,0,dims.w,dims.h);

	ctx.drawImage(img, dims.left / wScale, dims.top / hScale, (dims.w) / wScale, img.height / hScale, 0, 0, dims.w, dims.h)
}
function imgExpand(img, dc, sz) { img.width += 20; adjustCropper(img, dc, sz); return [img.width, img.height]; }
function imgReset(img, dc, sz, w, h) { img.width = w; img.height = h; adjustCropper(img, dc, sz); return [w, h]; }
function imgSquish(img, dc, sz) { let w = mGetStyle(dc, 'w'); if (img.width == w) return; else { img.width = Math.max(img.width - 20, w); adjustCropper(img, dc, sz); return [img.width, img.height]; } }
async function imgMeasure(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
		img.onload = () => {
			resolve({ img: img, w: img.width, h: img.height });
		};
		img.onerror = (error) => {
			reject(error);
		};
		img.src = src;
	});
}
async function imgScaledToHeightInDiv(url, dParent, sz = 300) {
	let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });

	let img = await imgAsync(d, {}, { tag: 'img', src: url });
	let [w, h] = [img.width, img.height]; console.log('orig', w, h);
	let scale = sz / img.height;
	img.width *= scale;
	img.height *= scale;
	mStyle(img, { w: img.width, h: img.height })
	return [img, scale];
}
function inpToChecklist(ev, grid) {
	let key = ev.key;
	let inp = ev.target;

	if (key == 'Backspace') {
		let s = inp.value;
		let cursorPos = inp.selectionStart;
		let ch = cursorPos == 0 ? null : inp.value[cursorPos - 1];
		if (!ch || isWhiteSpace(ch)) {
			doYourThing(inp, grid);
		}
		console.log('Backspace', ch);
		return;
	}

	if (key == 'Enter') ev.preventDefault();
	if (isExpressionSeparator(key) || key == 'Enter') doYourThing(inp, grid);
}
function intersectionOfArrays() {
	// Check if the input is an array of arrays
	let arrs = arguments[0]; console.log('arrs', arrs);
	if (!arrs.every(Array.isArray)) arrs = Array.from(arguments);
	return arrs.reduce((acc, array) => acc.filter(element => array.includes(element)));
}
function isPointOutsideOf(form, x, y) { const r = form.getBoundingClientRect(); return (x < r.left || x > r.right || y < r.top || y > r.bottom); }
function isExpressionSeparator(ch) { return ',-.!?;:'.includes(ch); }
function isWordSeparator(ch) { return ' ,-.!?;:'.includes(ch); }
function keyDownHandler(ev) {
	if (IsControlKeyDown && MAGNIFIER_IMAGE) return;
	if (!MAGNIFIER_IMAGE && ev.key == 'Control') {
		//console.log('control key down!!')
		IsControlKeyDown = true;
		let hoveredElements = document.querySelectorAll(":hover");
		let cand = Array.from(hoveredElements).find(x => mHasClass(x, 'magnifiable'));
		//console.log('magnifiable',cand);
		if (isdef(cand)) mMagnify(cand);
	}
}
function keyUpHandler(ev) {
	if (ev.key == 'Control') {
		//console.log('control key release!')
		IsControlKeyDown = false;
		mMagnifyOff();
	}
}
async function loadAssets() {
	M = await mGetYaml('../y/m.yaml');
	//superdi hat nations coll (cards) aber nicht civs
	let [di, byColl, byFriendly, byCat] = [M.superdi, {}, {}, {}];
	for (const k in di) {
		let o = di[k];
		//console.log('k',o)
		for (const cat of o.cats) lookupAddIfToList(byCat, [cat], k);
		for (const coll of o.colls) lookupAddIfToList(byColl, [coll], k);
		lookupAddIfToList(byFriendly, [o.friendly], k)
	}
	M.byCat = byCat;
	M.byCollection = byColl;
	M.byFriendly = byFriendly;
	M.categories = Object.keys(byCat); M.categories.sort();
	M.collections = Object.keys(byColl); M.collections.sort();
	M.names = Object.keys(byFriendly); M.names.sort();
}
function mCheckbox(dg, name, value) {
	let di = mDom(dg, { display: 'inline-block' });
	let chk = mDom(di, {}, { tag: 'input', type: 'checkbox', id: getUID('c'), name: name });
	if (isdef(value)) chk.checked = value;
	let label = mDom(di, {}, { tag: 'label', html: name, for: chk.id });
	return di;

}
function mCommand(dParent, key, html, open, close) {
	if (nundef(html)) html = capitalize(key);
	if (nundef(open)) open = window[`onclick${capitalize(key)}`];
	if (nundef(close)) close = () => { console.log('close', key) }
	let d = mDom(dParent, { display: 'inline-block' }, { key: key });
	let a = mDom(d, {}, { key: `${key}`, tag: 'a', href: '#', html: html, className: 'nav-link', onclick: onclickCommand })

	return { dParent, elem: d, div: a, key, open, close };
}
function mDatalist(dParent, list, opts = {}) {
	var mylist = list;
	var opts = opts;
	addKeys({ alpha: true, filter: 'contains' }, opts);
	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	let inp = mDom(d, { w: 180, maleft: 4 }, { tag: 'input', className: 'input', placeholder: valf(opts.placeholder, '') });
	if (isdef(opts.value)) inp.value = opts.value;
	let datalist = mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
	var elem = d;
	for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }
	inp.setAttribute('list', optid);
	if (opts.onupdate) {
		inp.addEventListener('keyup', opts.onupdate);
	} else if (isdef(opts.edit)) {
		//console.log('sssssssssssssssssssssssss')
		inp.onmousedown = () => inp.value = '';
	} else {
		inp.onblur = () => {
			const isValueSelected = list.includes(inp.value);
			if (!isValueSelected) {
				inp.value = inp.getAttribute('prev_value'); // Restore the previous value if no selection is made
			}
		}
		inp.onmousedown = () => { inp.setAttribute('prev_value', inp.value); inp.value = ''; }
	}
	return {
		list: mylist,
		elem: elem,
		inpElem: inp,
		listElem: datalist,
		opts: opts,
	}
}
function mDropZone1(dropZone, onDrop) {
	//newer version: enableImageDrop
	dropZone.addEventListener('dragover', function (event) {
		event.preventDefault();
		dropZone.style.border = '2px dashed #007bff';
	});
	dropZone.addEventListener('dragleave', function (event) {
		event.preventDefault();
		dropZone.style.border = '2px dashed #ccc';
	});
	dropZone.addEventListener('drop', function (evDrop) {
		evDrop.preventDefault();
		dropZone.style.border = '2px dashed #ccc';
		const files = evDrop.dataTransfer.files;
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = evReader => {
				onDrop(evReader.target.result, dropZone);
			};
			reader.readAsDataURL(files[0]);
		}
	});
	return dropZone;
}
function mGrid(rows, cols, dParent, styles = {}) {

	//dParent.innerHTML = '';
	addKeys({ display: 'inline-grid', gridCols: 'repeat(' + cols + ',1fr)' }, styles);
	if (rows) styles.gridRows = 'repeat(' + rows + ',auto)';
	else styles.overy = 'auto';

	let d = mDiv(dParent, styles);

	return d;
}
function mGridFromItems(dParent, items, maxHeight, numColumns) { return mGridFromElements(dParent, items.map(x => iDiv(x)), maxHeight, numColumns); }
function mGridFromElements(dParent, elems, maxHeight, numColumns) {
	dParent.innerHTML = '';
	let cols = `repeat(${numColumns}, 1fr)`; //'repeat(auto-fill, minmax(0, 1fr))';
	let grid = mDom(dParent, { display: 'inline-grid', gridCols: cols, gap: 10, padding: 4, overy: 'auto', hmax: maxHeight })
	elems.forEach(x => mAppend(grid, x));
	return grid;
}
function menuCommand(dParent, menuKey, key, html, open, close) {
	let cmd = mCommand(dParent, key, html, open, close);
	let a = iDiv(cmd);
	a.setAttribute('key', `${menuKey}_${key}`);
	a.onclick = onclickMenu;
	cmd.menuKey = menuKey;
	return cmd;
}
function menuCloseCurrent(menu) {
	let curKey = lookup(menu, ['cur']);
	//console.log('current',menu,curKey)
	if (curKey) {
		let cur = menu.commands[curKey];
		mClassRemove(iDiv(cur), 'activeLink'); //unselect cur command
		cur.close();

	}
}
function menuDisable(menu, key) { mClass(iDiv(menu.commands[key]), 'disabled') }
function menuEnable(menu, key) { mClassRemove(iDiv(menu.commands[key]), 'disabled') }
async function menuOpen(menu, key) {
	let cmd = menu.commands[key];	//console.log('clicked',menu,cmd);
	menu.cur = key;
	mClass(iDiv(cmd), 'activeLink'); //console.log('cmd',cmd)
	await cmd.open();
}
function measureHeight(elem) { return mGetStyle(elem, 'h') }
function measureWidth(elem) { return mGetStyle(elem, 'w') }
function mGadget(name, styles = {}, opts = {}) {
	let d = document.body;
	let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog', id: `modal_${name}` });
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
	let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: name, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${name}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return { name, dialog, form, inp }
}
async function mGather(dAnchor, styles = {}, opts = {}) {
	return new Promise((resolve, _) => {
		let [content, type, align] = [valf(opts.content, 'name'), valf(opts.type, 'text'), valf(opts.align, 'bl')];

		let d = document.body;
		let dialog = mDom(d, { bg: '#00000040', box: true, w: '100vw', h: '100vh' }, { tag: 'dialog' });

		let rect = dAnchor.getBoundingClientRect();

		let [v, h] = [align[0], align[1]];
		let vPos = v == 'b' ? { top: rect.bottom } : v == 'c' ? { top: rect.top } : { bottom: rect.top };
		let hPos = h == 'l' ? { left: rect.left } : v == 'c' ? { left: rect.left } : { right: window.innerWidth - rect.right };

		let formStyles = { position: 'absolute' };
		addKeys(vPos, formStyles);
		addKeys(hPos, formStyles); //,top:rect.bottom,right:}; //,bg:'red'}; //,w:100,h:100};
		let form = mDom(dialog, formStyles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
		dialog.addEventListener('mouseup', ev => {
			if (isPointOutsideOf(form, ev.clientX, ev.clientY)) {
				//console.log('clicked point outside!!!',ev.clientX,ev.clientY)
				resolve(null);
				dialog.remove();
			}
		});
		dialog.addEventListener('keydown', ev => { if (ev.key === 'Escape') { dialog.remove(); resolve(null); } });

		//console.log('type',type)
		let evalFunc;
		if (type == 'multi') evalFunc = uiGadgetTypeMulti(form, content, styles, opts);
		else if (type == 'text') evalFunc = uiGadgetTypeText(form, content, styles, opts);
		else if (type == 'yesno') evalFunc = uiGadgetTypeYesNo(form, content, styles, opts);
		else if (type == 'select') evalFunc = uiGadgetTypeSelect(form, content, styles, opts);
		else if (type == 'checklist') evalFunc = uiGadgetTypeCheckList(form, content, styles, opts);
		else if (type == 'checklistinput') evalFunc = uiGadgetTypeCheckListInput(form, content, styles, opts);

		//console.log('evalFunc',evalFunc)
		dialog.showModal();
		form.onsubmit = (ev) => {
			//console.log('submitting!!!!!!!!!!!!!!!')
			ev.preventDefault();
			let val = evalFunc();
			//console.log('val',val)
			dialog.remove();
			resolve(val);
		};
	});
}
function mLMR(dParent) {
	dParent = toElem(dParent);
	let d = mDom(dParent, { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
	let stflex = { gap: 10, display: 'flex', 'align-items': 'center' };
	let [l, m, r] = [mDom(d, stflex), mDom(d, stflex), mDom(d, stflex)];
	return [d, l, m, r];
}
function mMagnify(elem, scale = 5) {
	elem.classList.add(`topmost`);
	MAGNIFIER_IMAGE = elem;

	const rect = elem.getBoundingClientRect();

	let [w, h] = [rect.width * scale, rect.height * scale];
	let [cx, cy] = [rect.width / 2 + rect.left, rect.height / 2 + rect.top];
	let [l, t, r, b] = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];

	// console.log(l,t,r,b);

	let originX = 'center';
	let originY = 'center';
	let [tx, ty] = [0, 0];
	if (l < 0) { tx = -l / scale; } //originX = 'left'; 
	if (t < 0) { ty = -t / scale; } //originY = 'top'; 
	if (r > window.innerWidth) { tx = -(r - window.innerWidth) / scale; } //originX = 'right'; 
	if (b > window.innerHeight) { ty = -(b - window.innerHeight) / scale; } //originY = 'bottom'; 

	elem.style.transform = `scale(${scale}) translate(${tx}px,${ty}px)`;
	elem.style.transformOrigin = `${originX} ${originY}`;
}
function mMagnifyOff() {
	if (!MAGNIFIER_IMAGE) return;
	let elem = MAGNIFIER_IMAGE;
	MAGNIFIER_IMAGE = null;
	elem.classList.remove(`topmost`); //magnify4`); 
	elem.style.transform = null;
}
function mMenu(dParent, key) { let [d, l, m, r] = mLMR(dParent); return { dParent, elem: d, l, m, r, key, cur: null }; }

function mNewline(d, gap = 1) { mDom(d, { h: gap }); }

async function mPrompt(gadget) {
	return new Promise((resolve, reject) => {
		gadget.dialog.showModal();
		gadget.form.onsubmit = (ev) => {
			ev.preventDefault();
			resolve(gadget.inp.value);
			gadget.inp.value = '';
			gadget.dialog.close();
		};
	});
}
async function mSleep(ms = 1000) {
	return new Promise(
		(res, rej) => {
			if (ms <= 3000) {
				setTimeout(res, ms);
			} else {
				console.log('param should be less than 3001');
			}
		});
}
async function ondropSaveUrl(url) {
	console.log('save dropped url to config:', url);
	Serverdata.config = mPostRoute('postConfig', { url: url });
}
async function ondropShowImage(url, dDrop) {
	mClear(dDrop);
	let img = await imgAsync(dDrop, { hmax: 300 }, { src: url });

	console.log('img dims', img.width, img.height); //works!!!

	mStyle(dDrop, { w: img.width, h: img.height + 30, align: 'center' });
	mDom(dDrop, { fg: colorContrast(dDrop, ['blue', 'lime', 'yellow']) }, { className: 'blink', html: 'DONE! now click on where you think the image should be centered!' })
	console.log('DONE! now click on where you think the image should be centered!')

	img.onclick = storeMouseCoords;
}
async function postEventChange(data) {
	return Serverdata.events[data.id] = await mPostRoute('postEvent', data);
}
async function postImage(img, path) {
	let dataUrl = imgToDataUrl(img);
	let o = { image: dataUrl, path: path };
	let resp = await mPostRoute('postImage', o);
	console.log('resp', resp); //sollte path enthalten!
}
function presentImageCropper(url) {
	let d = mDom('dMain', { position: 'absolute', h: 500, w: 500, bg: 'navy' });
	let img = mDom(d, { w: 300, h: 300, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: url });
}
function rWords(n = 1) {
	let words = getColorNames().map(x => x.toLowerCase());
	let arr = rChoose(words, n);
	return arr;
}
async function showColors() {
	showTitle('Set Color Theme');
	let sz = 30;
	let d = mDom('dMain', { wmax: (sz + 4) * 15, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
	let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
	list = M.playerColors.concat(grays);
	for (const c of list) {
		let dc = mDom(d, { w: sz, h: sz, bg: c, fg: idealTextColor(c) });
		dc.onclick = onclickColor;
		mStyle(dc, { cursor: 'pointer' });
	}
}
async function showDashboard() {
	mDom('dMain', { fg: getThemeFg() }, { html: `hi, ${U.name}! this is your dashboard` })
}
async function showDirPics(dir, dParent) {
	let imgs = await mGetFiles(dir);
	//console.log(imgs); return;
	for (const fname of imgs) {
		let src = `${dir}/${fname}`;
		let sz = 200;
		let styles = { 'object-position': 'center top', 'object-fit': 'cover', h: sz, w: sz, round: true, border: `${rColor()} 2px solid` }
		let img = mDom(dParent, styles, { tag: 'img', src });

	}
}
function showDiv(d) { mStyle(d, { bg: rColor() }); console.log(d, mGetStyle(d, 'w')); }
function showEventOpen(id) {
	let e = Items[id];
	if (!e) return;
	let date = new Date(Number(e.day));
	let [day, month, year] = [date.getDate(), date.getMonth(), date.getFullYear()];
	let time = e.time;
	let popup = openPopup();
	let d = mBy(id);
	let [x, y, w, h, wp, hp] = [d.offsetLeft, d.offsetTop, d.offsetWidth, d.offsetHeight, 300, 180];
	let [left, top] = [Math.max(10, x + w / 2 - wp / 2), Math.min(window.innerHeight - hp - 60, y + h / 2 - hp / 2)]
	mStyle(popup, { left: left, top: top, w: wp, h: hp });
	let dd = mDom(popup, { display: 'inline-block', fz: '80%', maleft: 3, pabottom: 4 }, { html: `date: ${day}.${month}.${year}` });
	let dt = mDom(popup, { display: 'inline-block', fz: '80%', maleft: 20, pabottom: 4 }, { html: `time:` });
	let inpt = mDom(popup, { fz: '80%', maleft: 3, mabottom: 4, w: 60 }, { tag: 'input', value: e.time });
	mOnEnter(inpt);
	console.log('event text:', e.text)
	let ta = mDom(popup, { rounding: 4, matop: 7, box: true, w: '100%', vpadding: 4, hpadding: 10, }, { tag: 'textarea', rows: 7, value: e.text });

	let line = mDom(popup, { matop: 6, w: '100%' }); //,'align-items':'space-between'});
	let buttons = mDom(line, { display: 'inline-block' });
	let bsend = mButton('Save', () => onEventEdited(id, ta.value, inpt.value), buttons);
	mButton('Cancel', () => closePopup(), buttons, { hmargin: 10 })
	mButton('Delete', () => { deleteEvent(id); closePopup(); }, buttons, { fg: 'red' })
	mDom(line, { fz: '90%', maright: 5, float: 'right', }, { html: `by ${e.user}` });
}
async function showGameMenu(gamename) {
	//let dMenu = mBy('dMenu'); iClear(dMenu);
	let dMenu = mBy('dGameMenu'); if (isdef(dMenu)) { mClear(dMenu); } else dMenu = mDom('dMain', {}, { className: 'section', id: 'dGameMenu' });
	mText(`<h2>game options</h2>`, dMenu, { maleft: 12 });
	// show_standard_title(dMenu, 'Game Options');
	let d = mDiv(dMenu, { align: 'center' }, 'fMenuInput');
	let style = { display: 'flex', justify: 'center', w: '100%', gap: 10, matop: 10 };
	let dPlayers = mDiv(d, style, 'dMenuPlayers'); mCenterFlex(dPlayers);
	let dOptions = mDiv(d, style, 'dMenuInput'); mCenterFlex(dOptions);
	let dButtons = mDiv(d, style, 'dMenuButtons');
	DA.gamename = gamename;
	await showGamePlayers(dPlayers, gamename);
	await showGameOptions(dOptions, gamename);
	let astart = mButton('Start', onclickStartGame, dButtons, {}, ['button', 'input']);
	let ajoin = mButton('Open to Join', onclickOpenToJoinGame, dButtons, {}, ['button', 'input']);
	let acancel = mButton('Cancel', () => mClear(dMenu), dButtons, {}, ['button', 'input']);
	let bclear = mButton('Clear Players', onclickClearPlayers, dButtons, {}, ['button', 'input']);

}
async function showGameOptions(dParent, game) {
	mRemoveChildrenFromIndex(dParent, 2);
	let poss = Serverdata.config.games[game].options;
	if (nundef(poss)) return;
	for (const p in poss) {
		let key = p; //console.log('key',key)
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let legend = key.includes('per') ? stringBefore(key, '_') + '/' + stringAfterLast(key, '_') : key;
			let fs = mRadioGroup(dParent, {}, `d_${key}`, legend);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
			measure_fieldset(fs);
		}
	}
}
async function showGamePlayers(dParent, gamename) {
	let users = await mGetRoute('users');
	//console.log('users',users);

	let d = mDom(dParent, { display: 'flex', gap: 6, wrap: true })
	DA.playerlist = [];
	DA.allPlayers = [];
	DA.lastName = null;
	let params = [gamename, DA.playerlist];
	let funcs = [style_not_playing, style_playing_as_human, style_playing_as_bot];

	for (const name in users) {
		let d1 = mDom(d, { cursor: 'pointer' });
		d1.setAttribute('username', name)
		let img = showUserImage(name, d1, 40); //for(const i of range(3))showUserImage(name,d,40);
		let label = mDom(d1, { matop: -4, fz: 12, hline: 12 }, { html: name });

		let item = { name, div: d1, state: 0, strategy: '', isSelected: false };
		DA.allPlayers.push(item);
		if (name == U.name) { toggle_select(item, funcs, gamename, DA.playerlist); DA.lastName = name; }
		else d1.onclick = ev => {
			if (ev.shiftKey) {
				console.log('shift!!!')
				let list = DA.allPlayers;
				if (nundef(DA.lastName)) DA.lastName = list[0].name;
				console.log(DA.lastName, list)
				let x1 = list.find(x => x.name == DA.lastName);
				let i1 = list.indexOf(x1);
				let x2 = list.find(x => x.name == item.name);
				let i2 = list.indexOf(x2);
				if (i1 == i2) return;
				if (i1 > i2) [i1, i2] = [i2, i1];
				assertion(i1 < i2, "NOT IN CORRECT ORDER!!!!!")
				for (let i = i1; i <= i2; i++) {
					let xitem = DA.allPlayers[i];
					if (xitem.isSelected) continue;
					style_playing_as_human(xitem, gamename, DA.playerlist);
				}
				DA.lastName = item.uname;
			} else {
				toggle_select(item, funcs, gamename, DA.playerlist);
				if (item.isSelected) DA.lastName = item.name;
			}
		}

	}
}
function showGames(ms = 500) {
	//let dParent = mBy('dGames');mClear(dParent);
	let dParent = mBy('dGameList'); if (isdef(dParent)) { mClear(dParent); } else dParent = mDom('dMain', {}, { className: 'section', id: 'dGameList' });

	mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });
	let d = mDiv(dParent, { fg: 'white', animation: 'appear 1s ease both' }, 'game_menu'); mFlexWrap(d);

	let gamelist = 'accuse aristo bluff ferro nations spotit wise'; if (DA.TEST0) gamelist += ' a_game'; gamelist = toWords(gamelist);
	//gamelist = dict2list(Serverdata.config.games, 'key'); gamelist = sortBy(gamelist, 'friendly').map(x => x.key);
	gamelist = ['spotit','a_game']
	//console.log('gamelist', gamelist)
	

	for (const gname of gamelist) {
		let g = Serverdata.config.games[gname];
		let [sym, bg, color, id] = [M.superdi[g.logo], g.color, null, getUID()];
		let d1 = mDiv(d, { cursor: 'pointer', rounding: 10, margin: 10, padding: 0, patop: 10, w: 140, height: 100, bg: bg, position: 'relative' }, g.id);
		d1.setAttribute('gamename', gname);
		d1.onclick = onclickGameMenuItem;
		mCenterFlex(d1);

		let o = M.superdi[g.logo];
		let el = mDom(d1, { matop: 0, mabottom: 6, fz: 65, hline: 65, family: 'emoNoto', fg: 'white', display: 'inline-block' }, { html: o.text });

		//showImage(g.logo,d1,{bg:'transparent',fg:'orange',hline:100},true); //mDiv(d1, { fz: 50, family: sym.family, 'line-height': 55 }, null, sym.text);
		mLinebreak(d1);
		mDiv(d1, { fz: 18, align: 'center' }, null, g.friendly);
	}
}
function showim(key, dParent, styles = {}, imgFit = 'fill', useSymbol = false) {
	//values for imgFit: fill, cover, contain, none, scale-down
	let o = M.superdi[key];
	let h = valf(styles.h, styles.sz, 100);
	let w = valf(styles.w, styles.sz, 'auto');
	let fz = h * .9;
	let hline = fz;
	addKeys({ w, h, fz, hline }, styles);
	let d1 = mDom(dParent, styles);
	let el;
	if (!useSymbol && isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': imgFit, 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: hline, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz - 2, hline: hline, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoGame', bg: valf(styles.bg, 'beige'), fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': imgFit, 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	return el;
}
function showim1(key, d, styles = {}, opts = {}) {
	let src = M.superdi[key].img;
	let img = mDom(d, styles, { tag: 'img', src });
	return img;
}
function showImageBatch(coll, inc = 0, alertEmpty = false) {
	let [keys, index, numCells] = [coll.keys, coll.index, coll.rows * coll.cols];
	if (isEmpty(keys) && alertEmpty) showMessage('nothing has been added to this collection yet!');
	if (keys.length <= numCells) inc = 0;
	let newPageIndex = coll.pageIndex + inc;
	let numItems = keys.length;
	let maxPage = Math.max(1, Math.ceil(numItems / numCells)); //console.log('maxPage', maxPage, numItems, numCells)
	if (newPageIndex > maxPage) newPageIndex = 1;
	if (newPageIndex < 1) newPageIndex = maxPage;
	index = numCells * (newPageIndex - 1); //here need 0 based
	let list = arrTakeFromTo(keys, index, index + numCells);
	coll.index = index; coll.pageIndex = newPageIndex;
	for (let i = 0; i < list.length; i++) {
		let d = coll.cells[i];
		mStyle(d, { opacity: 1 });
		mClass(d, 'magnifiable')
		let d1 = showImageInBatch(list[i], d);
		d1.setAttribute('collname', coll.name);
		let selkey = collGenSelkey(list[i], coll.name);
		if (isList(UI.selectedImages) && UI.selectedImages.includes(selkey)) collSelect(d1);
	}
	for (let i = list.length; i < numCells; i++) {
		mStyle(coll.cells[i], { opacity: 0 })
	}
	coll.dPageIndex.innerHTML = `page ${coll.pageIndex}/${maxPage}`;

	//next and prev button activate or deactivate!
	let [dNext, dPrev] = [mBy('bNext'), mBy('bPrev')];
	if (maxPage == 1) { mClass(dPrev, 'disabled'); mClass(dNext, 'disabled'); }
	else { mClassRemove(dPrev, 'disabled'); mClassRemove(dNext, 'disabled'); }
}
function showImageInBatch(key, dParent, styles = {}) {
	let o = M.superdi[key]; o.key = key; //console.log('o',o)
	addKeys({ bg: rColor() }, styles);
	mClear(dParent);
	[w, h] = [dParent.offsetWidth, dParent.offsetHeight];
	let [sz, fz] = [.9 * w, .8 * h];
	let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	if (isdef(o.img)) {
		if (o.cats.includes('card')) {
			el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
			mDom(d1, { h: 1, w: '100%' })
		} else {
			el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
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
	d1.ondragstart = () => { UI.draggedItem = o; }; // console.log('drag',UI.draggedItem);};
	return d1;
}
function showNavbar() {
	let nav = mMenu('dNav');
	let commands = {};
	commands.home = menuCommand(nav.l, 'nav', 'home', 'HOME', showDashboard, clearMain);
	commands.colors = menuCommand(nav.l, 'nav', 'colors', null, showColors, clearMain);
	commands.collections = menuCommand(nav.l, 'nav', 'collections', null, onclickCollections, collClear);
	commands.play = menuCommand(nav.l, 'nav', 'play', 'Tables', onclickPlay, clearMain);
	commands.plan = menuCommand(nav.l, 'nav', 'plan', 'Calendar', onclickPlan, clearMain);
	nav.commands = commands;
	// console.log(commands)
	return nav;
}
async function showTables() {
	Clientdata.table = null;
	assertion(Clientdata.curUser == U.name,"ShowTables!!!!!!!")
	let me = U.name;
	// let tables=Serverdata.tables;
	let tables = Serverdata.tables = await mGetRoute('tables');
	//console.log('tables', tables);
	//return;
	tables.map(x => x.prior = x.status == 'open' ? 0 : x.turn.includes(me) ? 1 : x.playerNames.includes(me) ? 2 : 3);
	sortBy(tables, 'prior');

	let dParent = mBy('dTableList');
	if (isdef(dParent)) { mClear(dParent); }
	else dParent = mDom('dMain', {}, { className: 'section', id: 'dTableList' });

	if (isEmpty(tables)) { mText('no active game tables', dParent); return []; }
	tables.map(x => x.game_friendly = capitalize(Serverdata.config.games[x.game].friendly));
	// tables.map(x => x.playerNames = x.players.map(y => y.name));
	mText(`<h2>game tables</h2>`, dParent, { maleft: 12 })
	let t = mDataTable(tables, dParent, null, ['friendly', 'game_friendly', 'playerNames'], 'tables', false);

	mTableCommandify(t.rowitems.filter(ri => ri.o.status == 'started'), {
		0: (item, val) => hFunc(val, 'onclickTable', item.o.id, item.id),
	});
	mTableStylify(t.rowitems.filter(ri => ri.o.status == 'open'), { 0: { fg: 'blue' }, });

	let d = iDiv(t);
	for (const ri of t.rowitems) {
		let r = iDiv(ri);
		let id = ri.o.id; //console.log('id', id)
		//console.log('ri',ri)
		if (ri.o.prior == 1) mDom(r, {}, { tag: 'td', html: get_waiting_html(24) }); //'my turn!'});

		if (ri.o.status == 'open') {
			//join or leave button!
			//depending on U.name status!
			let playerNames = ri.o.playerNames;
			if (playerNames.includes(me)) {
				let h1 = hFunc('leave', 'onclickLeaveTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
			} else {
				let h1 = hFunc('join', 'onclickJoinTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
			}
		}
		if (ri.o.owner != me) continue;
		let h = hFunc('delete', 'onclickDeleteTable', id); let c = mAppend(r, mCreate('td')); c.innerHTML = h;
		if (ri.o.status == 'open') { let h1 = hFunc('start', 'onclickStartTable', id); let c1 = mAppend(r, mCreate('td')); c1.innerHTML = h1; }

	}
}
function showUserImage(uname, d, sz = 40) {
	//values for imgFit: fill, cover, contain, none, scale-down
	let u = Serverdata.users[uname];
	return showim1(u.key, d, { 'object-position': 'center top', 'object-fit': 'cover', h: sz, w: sz, round: true, border: `${u.color} 2px solid` });
}
function sortCheckboxes(grid) {
	let divs = arrChildren(grid);
	divs.map(x => x.remove());

	let chyes = divs.filter(x => x.firstChild.checked == true);
	let chno = divs.filter(x => !chyes.includes(x));

	chyes = sortByFunc(chyes, x => x.firstChild.name);
	chno = sortByFunc(chno, x => x.firstChild.name);
	for (const d of chyes) { mAppend(grid, d) }
	for (const d of chno) { mAppend(grid, d) }
}
function startPanning(ev) {
	console.log('_________startPanning!')
	const panData = {};
	function panStart(ev) {
		evNoBubble(ev);
		assertion(nundef(panData.panning), panData)
		let dc = panData.dCrop = ev.target;
		panData.cropStartSize = { w: mGetStyle(dc, 'w'), h: mGetStyle(dc, 'h') }
		panData.cropStartPos = { l: mGetStyle(dc, 'left'), t: mGetStyle(dc, 'top') }
		panData.elParent = panData.dCrop.parentNode;
		panData.img = panData.elParent.querySelector('img, canvas');//console.log('img',panData.img);
		panData.panning = true;
		panData.counter = -1;
		panData.mouseStart = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
		panData.posStart = { x: mGetStyle(dc, 'left'), y: mGetStyle(dc, 'top') };
		addEventListener('mouseup', panEnd);
		panData.elParent.addEventListener('mousemove', panMove);
		console.log('panStart!', panData.mouseStart);
	}
	function panMove(ev) {
		evNoBubble(ev);
		if (!panData.panning || ++panData.counter % 3) return;
		panData.mouse = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
		let [x, y] = [panData.posStart.x, panData.posStart.y];
		let [dx, dy] = [panData.mouse.x - panData.mouseStart.x, panData.mouse.y - panData.mouseStart.y];
		[dx, dy] = [Math.round(dx / 10) * 10, Math.round(dy / 10) * 10];

		// adjustCropperBySimple(panData.dCrop, x, y, dx, dy, panData.img.width, panData.img.height, panData.cropStartSize.w, panData.cropStartSize.h);
		adjustComplex(panData)

		// console.log(panData.mouse);
	}
	function panEnd(ev) {
		//evNoBubble(ev);
		assertion(panData.panning == true);
		let d = evToClass(ev, 'imgWrapper');
		if (d == panData.elParent) {
			evNoBubble(ev);
			panData.mouse = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
			console.log('SUCCESS!', panData.mouse)
		}
		removeEventListener('mouseup', panEnd);
		panData.elParent.removeEventListener('mousemove', panMove);
		panData.panning = false;
		console.log('* THE END *', panData)
	}
	panStart(ev);
}
function style_not_playing(item, game, list) {
	let ui = iDiv(item); let uname = ui.getAttribute('username');
	mStyle(ui, { bg: 'transparent', fg: 'black' });
	arrLast(arrChildren(ui)).innerHTML = uname;
	item.ifunc = 0; item.playmode = 'none'; removeInPlace(list, item);
	item.isSelected = false;
}
function style_playing_as_bot(item, game, list) {
	let ui = iDiv(item); let uname = ui.getAttribute('username'); let bg = getGameColor(game);
	mStyle(ui, { bg: bg, fg: colorIdealText(bg) });
	arrLast(arrChildren(ui)).innerHTML = uname.substring(0, 3) + 'bot';
	item.ifunc = 2; item.playmode = 'bot';
	item.isSelected = true;
}
function style_playing_as_human(item, game, list) {
	//console.log('item',item,game,list)
	let ui = iDiv(item); let uname = ui.getAttribute('username');
	let color = getUserColor(uname);
	mStyle(ui, { bg: color, fg: colorIdealText(color) });
	arrLast(arrChildren(ui)).innerHTML = uname;
	item.ifunc = 1; item.playmode = 'human'; list.push(item);
	item.isSelected = true;
}
async function switchToMenu(menu, key) {
	menuCloseCurrent(menu);
	Clientdata.curMenu = key; //console.log('switchToMenu',Clientdata)
	await menuOpen(menu, key);
}
async function switchToUser(uname) {
	if (!isEmpty(uname)) uname = normalizeString(uname);
	if (isEmpty(uname)) uname = 'guest';
	sockPostUserChange(U ? U.name : '', uname); //das ist nur fuer die client id!
	U = await getUser(uname);
	Clientdata.curUser = uname;
	localStorage.setItem('username', uname);

	iDiv(UI.user).innerHTML = uname;
	setColors(U.color);

	if (uname == 'guest') { await switchToMenu(UI.nav, 'home'); menuDisable(UI.nav, 'plan'); }
	else {
		menuEnable(UI.nav, 'plan');
		let t = Clientdata.table;
		let cur = Clientdata.curMenu; //UI.nav.cur; //console.log('current menu is', cur);
		if (cur == 'play' && isdef(t) && t.playerNames.includes(uname) && t.status == 'started') await showTable(t, uname);
		else await switchToMenu(UI.nav, valf(cur, 'home'));
	}
}
function toggle_select(item, funcs) {
	let params = [...arguments];
	let ifunc = (valf(item.ifunc, 0) + 1) % funcs.length; let f = funcs[ifunc]; f(item, ...params.slice(2));
}
function toggleSelectionOfPicture(elem, selkey, selectedPics, className = 'framedPicture') {
	//console.log('HALLO!',selkey)
	if (selectedPics.includes(selkey)) {
		removeInPlace(selectedPics, selkey); collUnselect(elem);
	} else {
		selectedPics.push(selkey); collSelect(elem);
	}
}
function uiGadgetTypeCheckList(form, content, styles, opts) {

	//was soll der content sein? wo soll der content berechnet werden?
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
	let dOuter = mDom(form, styles)
	// let d=mDom(form,{bg:'white'})
	let dParent = mDom(dOuter, { hmax: 510, wmax: 200, pabottom: 10, box: true }); //,bg:'blue',fg:'contrast'});

	// console.log('content', content)
	// let lst = content.map(x => x.name);
	// console.log('lst', lst)

	let ui = uiTypeCheckList(content, dParent, styles, opts);
	//console.log('ui', ui)

	//onclick: () => form.setAttribute('proceed', 'yes')

	mButton('done', () => onclickCatListDone(form), dOuter, { classes: 'input', margin: 10 }); //da muss noch ein button dazu

	return () => form.getAttribute('proceed');

	//muss eine evalfunc returnen!!!
}
function uiGadgetTypeCheckListInput(form, content, styles, opts) {
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, box: true }, styles)
	let dOuter = mDom(form, styles)
	let dParent = mDom(dOuter, { pabottom: 10, box: true });
	let ui = uiTypeCheckListInput(content, dParent, styles, opts);
	return () => DA.formResult;
}
function uiGadgetTypeMulti(form, dict, styles = {}, opts = {}) {
	let inputs = [];
	for (const k in dict) {
		let [content, val] = [k, dict[k]];
		let inp = mDom(form, styles, { className: 'input', name: content, tag: 'input', type: 'text', value: val, placeholder: `<enter ${content}>` });
		inputs.push({ name: content, inp: inp });
		mNewline(form)
	}
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return () => {
		let di = {};
		inputs.map(x => di[x.name] = x.inp.value);
		return di;
	};
}
function uiGadgetTypeSelect(form, dict, styles = {}, opts = {}) {
	let select = DA.select = mDom(form, styles, { className: 'input', tag: 'select' });
	//console.log('dict',dict);
	if (isList(dict)) dict = list2dict(dict);
	mDom(select, {}, { tag: 'option', html: '' });

	//console.log('dict',dict)
	for (const k in dict) {
		let [content, val] = [k, dict[k]];
		mDom(select, {}, { tag: 'option', html: content, value: val });
	}
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	select.addEventListener('change', () => form.submit());
	return () => { console.log('selected', DA.select, DA.select.value); return DA.select.value; }
}
function uiGadgetTypeText(form, content, styles = {}, opts = {}) {
	let inp = mDom(form, styles, { className: 'input', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return () => inp.value;
}
function uiGadgetTypeYesNo(form, content, styles = {}, opts = {}) {
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
	let dOuter = mDom(form, styles)
	let dq = mDom(dOuter, { mabottom: 7 }, { html: capitalize(content) });
	let db = mDom(dOuter, { w100: true, box: true, display: 'flex', 'justify-content': 'space-between', gap: 10 })
	let bYes = mDom(db, { w: 70, classes: 'input' }, { html: 'Yes', tag: 'button', onclick: () => form.setAttribute('proceed', 'yes') })
	let bNo = mDom(db, { w: 70, classes: 'input' }, { html: 'No', tag: 'button', onclick: () => form.setAttribute('proceed', 'no') })

	return () => form.getAttribute('proceed') == 'yes';
}
function uiTypeCheckList(lst, dParent, styles = {}, opts = {}) {
	let d = mDom(dParent, { overy: 'auto' }); //hier drin kommt die liste!
	//console.log('lst',lst)
	lst.forEach((o, index) => {
		let [text, value] = [o.name, o.value];
		let dcheck = mDom(d, {}, { tag: 'input', type: 'checkbox', name: text, value: text, id: `ch_${index}`, checked: value });
		//dcheck.checked = value;
		let dlabel = mDom(d, {}, { tag: 'label', for: dcheck.id, html: text });
		mNewline(d, 0);
	});
	let r = getRect(d); //console.log('r',r); //soviel braucht die liste
	let rp = getRect(dParent); //console.log('rp',rp);
	let hParent = rp.h;
	if (hParent == 0) hParent = mGetStyle(dParent, 'max-height');
	//console.log('hParent',hParent);
	let p = mGetStyle(dParent, 'pabottom'); //console.log('pb',p,mGetStyle(dParent,'padding'))
	let h = hParent - r.y; //-p;
	mStyle(d, { hmax: h });//,pabottom:10,box:true});
	return d;
	//check all the boxes that are set for this element

	//mButton('done',)
}
function uiTypeCheckListInput(lst, dParent, styles = {}, opts = {}) {

	mStyle(dParent, { w: 1000 })
	let dg = mDom(dParent);
	let list = lst; // lst.map(x=>x.name); list.sort();
	//console.log('list',list)

	let items = []; //make measured checkbox items
	for (const o of list) {
		let div = mCheckbox(dg, o.name, o.value);
		items.push({ nam: o.name, div, w: mGetStyle(div, 'w'), h: mGetStyle(div, 'h') });
	}
	let wmax = arrMax(items, 'w'); //console.log('wmax',wmax); //measure max width of items
	let cols = 3;
	let wgrid = wmax * cols + 100; //(wmax+15) * (cols) + 10;
	dg.remove();

	dg = mDom(dParent);
	// *** input ***
	let inp = mDom(dg, { w100: true, box: true, mabottom: 10 }, { className: 'input', tag: 'input', type: 'text' });

	// *** buttons ***
	let db = mDom(dg, { w100: true, box: true, align: 'right', mabottom: 4 });
	mButton('cancel', () => DA.formResult = null, db, {}, 'input');
	mButton('clear', ev => { ev.preventDefault(); onclickClear(inp, grid) }, db, { maleft: 10 }, 'input');
	mButton('done', () => DA.formResult = extractWords(inp.value, ' '), db, { maleft: 10 }, 'input');

	// *** grid ***
	mStyle(dg, { w: wgrid, box: true, padding: 10 }); //, w: wgrid })

	//let grid = mGridFromItems(dg,items,500,cols); //createItemsGrid(dg, items, 500, cols);
	let grid = mGrid(null, cols, dg, { w100: true, gap: 10, matop: 4, hmax: 500 });
	items.map(x => mAppend(grid, iDiv(x)));

	//when checkbox val changes inp needs to change and checkboxes need to be rearranged! possibly new checkboxes created!
	let chks = Array.from(dg.querySelectorAll('input[type="checkbox"]')); //chks=items.map(x=>iDiv(x).firstChild);
	//console.log('cheks',chks)
	for (const chk of chks) {
		chk.addEventListener('click', ev => checkToInput(ev, inp, grid))
	}

	inp.value = list.filter(x => x.value).map(x => x.name).join(', ');
	inp.addEventListener('keypress', ev => inpToChecklist(ev, grid));
	//when inp is changed, checkboxes need to be modified
	//only when pressing enter in input box OR when entering a comma?

	return { dg, inp, grid };

}
function uiTypeEvent(dParent, o, styles = {}) {
	Items[o.id] = o;
	let id = o.id;
	let ui = mDom(dParent, styles, { id: id }); //, className:'no_events'}); //onclick:ev=>evNoBubble(ev) }); 
	mStyle(ui, { overflow: 'hidden', display: 'flex', gap: 2, padding: 2, 'align-items': 'center' }); //,'justify-items':'center'})
	let [wtotal, wbutton, h] = [mGetStyle(dParent, 'w'), 17, styles.hmin];
	let fz = 15;
	let stInput = { overflow: 'hidden', hline: fz * 4 / 5, fz: fz, h: h, border: 'solid 1px silver', box: true, margin: 0, padding: 0 };
	let inp = mDom(ui, stInput, { html: o.text, tag: 'input', className: 'no_outline', onclick: ev => { evNoBubble(ev) } }); //;selectText(ev.target);}});
	inp.value = getEventValue(o);
	inp.addEventListener('keyup', ev => { if (ev.key == 'Enter') { mDummyFocus(); onEventEdited(id, inp.value); } });
	fz = 14;
	let stButton = { overflow: 'hidden', hline: fz * 4 / 5, fz: fz, box: true, fg: 'silver', bg: 'white', family: 'pictoFa', display: 'flex' };
	let b = mDom(ui, stButton, { html: String.fromCharCode('0x' + M.superdi.pen_square.fa) });
	ui.onclick = ev => { evNoBubble(ev); onclickExistingEvent(ev); }
	mStyle(inp, { w: wtotal - wbutton });
	return { ui: ui, inp: inp, id: id };
}
function unionOfArrays() {
	// arguments should be lists or one list of lists
	let arrs = arguments[0]; //console.log('arrs', arrs);
	if (!arrs.every(Array.isArray)) arrs = Array.from(arguments);
	const flattenedArray = arrs.flat();
	return [...new Set(flattenedArray)];
}
