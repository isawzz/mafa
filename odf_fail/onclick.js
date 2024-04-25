//#region collections
async function onclickAddCategory() {
	let selist = UI.selectedImages; //console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let catlist = M.categories.map(x => ({ name: x, value: false }));

	let cats = await mGather(iDiv(UI.addCategory), {}, { content: catlist, type: 'checklist' });
	if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
	cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(cats)) { console.log('nothing added'); collClearSelections(); return; }
	//console.log('add cats:', cats);
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

	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();
}
async function onclickAddSelected() {
	let selist = UI.selectedImages; //console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let collist = M.collections.filter(x => !collLocked(x)).map(x => ({ name: x, value: false }));

	let colls = await mGather(iDiv(UI.addSelected), {}, { content: collist, type: 'checklist' });
	if (!colls) { console.log('CANCELLED!!!'); collClearSelections(); return; }
	colls = colls.split('@');
	colls = colls.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(colls)) { console.log('nothing added'); collClearSelections(); return; }
	//console.log('add cats:', cats);
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

	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();
}
async function onclickAsAvatar(ev) {
	let item = UI.selectedImages[0];
	console.log('item', item)
	let o = collKeyCollnameFromSelkey(item);
	let key = o.key;
	let m = M.superdi[key];
	U.key = key;
	let res = await postUserChange(U);
	console.log('res', res)
}
async function onclickAsSecondary(ev) {

	name = UI.collPrimary.name;
	if (name == 'all' || collLocked(name)) {
		showMessage(`ERROR! collection ${name} cannot be altered!`);
		return;
	}
	if (nundef(M.byCollection[name])) {
		showMessage(`ERROR! collection ${name} not found!`);
		return;
	}

	UI.collSecondary.name = name;
	UI.collPrimary.name = 'all';
	collOpenSecondary(4, 3);
	//collClosePrimary();
	collOpenPrimary(4, 3);
}
async function onclickCatListDone(ui) { ui.setAttribute('proceed', getCheckedNames(ui).join('@')); }

function onclickClear(inp, grid) {

	inp.value = '';
	let checklist = Array.from(grid.querySelectorAll('input[type="checkbox"]'));
	checklist.map(x => x.checked = false);
	sortCheckboxes(grid);
}
function onclickCollDone() {
	collCloseSecondary();
	//console.log('sec',UI.collSecondary)
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
async function clickOnItem(elem, key) {
	if (nundef(UI.selectedImages)) UI.selectedImages = [];
	let collname = elem.getAttribute('collname');
	let selist = UI.selectedImages;
	let selkey = collGenSelkey(key, collname); //`${key}@${collname}`; //collFromElement(elem).name}`;
	//console.log('vor toggle:',selist); //,key,selkey);
	toggleSelectionOfPicture(elem, selkey, UI.selectedImages);
	//console.log('nach toggle',UI.selectedImages)
	if (isEmpty(selist)) { collDisableListCommands(); collDisableItemCommands(); }
	else if (selist.length == 1) { collEnableListCommands(); collEnableItemCommands(); }
	else { collDisableItemCommands(); collEnableListCommands(); }
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


	if (isEmpty(newfriendly)) { // || !isAlphanumeric(newfriendly)){
		showMessage(`ERROR: name invalid: ${newfriendly}`);
		return;
	}

	console.log('rename friendly to', newfriendly)
	let item = M.superdi[key];
	item.friendly = newfriendly;
	let resp = await mPostRoute('postUpdateItem', { key: key, item: item });
	console.log(resp);
	ev.target.innerHTML = newfriendly;

}
async function onclickCollClearSelections(ev) {
	let colls = [UI.collPrimary];
	if (UI.collSecondary.isOpen) colls.push(UI.collSecondary);
	for (const coll of colls) {
		for (const cell of coll.cells) {
			let d = cell.firstChild;
			collUnselect(d);
		}
	}
	UI.selectedImages = [];
	collDisableListCommands();
}
async function onclickCollNext(ev) {
	// let id = evToId(ev); console.log('id', id)
	// let coll = UI[id];
	let coll = collFromElement(ev.target.parentNode)
	showImageBatch(coll, 1);
}
async function onclickCollPrev(ev) {
	// let id = evToId(ev); console.log('id', id)
	// let coll = UI[id];
	let coll = collFromElement(ev.target.parentNode)
	showImageBatch(coll, -1);
}
async function onclickCollections() {

	let dPanes = mDom('dMain'); mFlex(dPanes);
	let dSecondary = mDom(dPanes, { wmin: 0, w: 0 }, { id: 'collSecondary', className: 'translow' }); //mFlexWrap(dPlus);
	let dPrimary = mDom(dPanes, {}, { id: 'collPrimary' }); //mFlexWrap(d1);

	collSidebar();

	let collName = localStorage.getItem('collection');
	if (nundef(collName) || !M.collections.includes(collName)) collName = 'animals'

	UI.collPrimary = { div: dPrimary, name: collName };
	UI.collSecondary = { div: dSecondary, name: null };
	collOpenPrimary(5, 7);
}
async function onclickCollSelectAll(ev) {
	//if secondary is open, use that, otherwise use primary
	let coll = UI.collSecondary.isOpen ? UI.collSecondary : UI.collPrimary;

	//all visible images are selected and framed
	for (const cell of coll.cells) {
		let d = cell.firstChild;
		if (nundef(d)) break; //page not full!
		collSelect(d);
	}
	//all keys entered into UI.selectedImages
	for (const k of coll.keys) {
		addIf(UI.selectedImages, collGenSelkey(k, coll.name));
	}
	collEnableListCommands();
}
async function onclickCollSelectPage(ev) {
	//if secondary is open, use that, otherwise use primary
	let coll = UI.collSecondary.isOpen ? UI.collSecondary : UI.collPrimary;

	//all visible images are selected and framed
	for (const cell of coll.cells) {
		let d = cell.firstChild;
		if (nundef(d)) break; //page not full!
		collSelect(d);
		let o = collKeyCollnameFromElem(d);
		addIf(UI.selectedImages, collGenSelkey(o.key, o.collname));
	}
	collEnableListCommands();
}
async function onclickDeleteCollection(name) {
	if (nundef(name) && UI.collSecondary.isOpen) name = UI.collSecondary.name;
	if (nundef(name)) name = await mGather(iDiv(UI.deleteCollection), 'name');
	if (!name) return;

	let proceed = await mGather(iDiv(UI.deleteCollection), {}, { type: 'yesno', content: `delete collection ${name}?` });

	// console.log('...',(proceed?'will':'will NOT'),`delete collection ${name}`);
	if (proceed) await collDelete(name);
	if (UI.collSecondary.isOpen && UI.collSecondary.name == name) collCloseSecondary();
	if (UI.collPrimary.name == name) { UI.collPrimary.name = 'all'; collOpenPrimary(); }
}
async function onclickDeleteSelected() {
	let selist = UI.selectedImages;

	//console.log('delete', selist);
	let di = {}, deletedKeys = {};
	for (const k of selist) {
		let o = collKeyCollnameFromSelkey(k);
		let key = o.key;
		let collname = o.collname;

		// *** SAFETY CHECK!!!!! ***
		if (collLocked(collname)) continue;

		if (nundef(deletedKeys[collname])) deletedKeys[collname] = [];
		await collDeleteOrRemove(key, collname, di, deletedKeys[collname]);
	}

	//let empty=Object.keys(deletedKeys).every(x=>isEmpty(deletedKeys[x]));
	//console.log('empty?',di); //empty,di,deletedKeys)
	if (isEmpty(di) && Object.keys(deletedKeys).every(x => isEmpty(deletedKeys[x]))) {
		showMessage(`ERROR: cannot delete selected items!!!`);
		collClearSelections();
		return;

	}

	console.log('deletedKeys dict: ', deletedKeys);
	for (const k in deletedKeys) {
		let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: deletedKeys[k], collname: k });
		console.log('postUpdateSuperdi', k, res)
		di = {}; //keys have been updated already
	}

	await loadAssets();
	collPostReload();
}
async function onclickEditCategories() {
	let selist = UI.selectedImages; //console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let arrs = keys.map(x => M.superdi[x].cats);
	let lst = unionOfArrays(arrs); //console.log('inter', lst);
	let catlist = M.categories.map(x => ({ name: x, value: lst.includes(x) }));
	sortByDescending(catlist, 'value');

	let cats = await mGather(iDiv(UI.editCategories), {}, { content: catlist, type: 'checklistinput' });
	if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
	//cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(cats)) { console.log('nothing removed'); collClearSelections(); return; }

	//console.log('cats', cats);
	//console.log('*BREAK*');	return;

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

	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();
}
async function onclickEditCollItem() {
	let selist = UI.selectedImages; //console.log('selist', selist)
	let key = selist.map(x => stringBefore(x, '@'))[0];
	let item = M.superdi[key];

	let catlist = M.categories.map(x => ({ name: x, value: item.cats.includes(x) }));
	sortByDescending(catlist, 'value');

	let cats = await mGather(iDiv(UI.addCategory), {}, { content: catlist, type: 'checklistinput' });
	if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
	cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x));

	if (sameList(item.cats, cats)) { console.log('no change'); collClearSelections(); return; }

	console.log(`cats of item ${key} set to`, cats);
	item.cats = cats;
	let di = {}; di[key] = item;

	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();
}
async function onclickRemoveCategory() {
	let selist = UI.selectedImages; //console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let arrs = keys.map(x => M.superdi[x].cats);
	let lst = unionOfArrays(arrs); lst.sort(); //console.log('inter', lst);
	let catlist = lst.map(x => ({ name: x, value: false }));


	let cats = await mGather(iDiv(UI.removeCategory), {}, { content: catlist, type: 'checklist' });
	if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
	cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(cats)) { console.log('nothing removed'); collClearSelections(); return; }

	let remolist = cats; //arrMinus(catlist.map(x=>x.name),cats)
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

	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();

}
async function onclickRemoveSelected() {
	let selist = UI.selectedImages;

	//console.log('delete', selist);
	let di = {};
	for (const k of selist) {
		let o = collKeyCollnameFromSelkey(k);
		let key = o.key;
		let collname = o.collname;

		// *** SAFETY CHECK!!!!! ***
		if (collLocked(collname)) continue;

		let item = M.superdi[key];
		removeInPlace(item.colls, collname);
		di[key] = item;
	}

	//let empty=Object.keys(deletedKeys).every(x=>isEmpty(deletedKeys[x]));
	//console.log('empty?',di); //empty,di,deletedKeys)
	if (isEmpty(di)) {
		showMessage(`ERROR: cannot delete selected items!!!`);
		collClearSelections();
		return;

	}

	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)

	await loadAssets();
	collPostReload();
}
async function onclickRenameCollection(oldname, newname) {
	if (nundef(oldname)) oldname = UI.collSecondary.isOpen ? UI.collSecondary.name : UI.collPrimary.name;
	if (nundef(newname)) {
		//console.log('HALLO!!!!')
		let di = await mGather(iDiv(UI.renameCollection), {}, { content: { oldname: valf(oldname, ''), newname: '' }, type: 'multi' });
		//console.log('di', di);
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
	if (collLocked(oldname)) {
		showMessage(`ERROR: Collection ${oldname} is Read-Only!`);
		return;
	}
	if (!collExists(oldname)) {
		showMessage(`ERROR: Collection ${oldname} not found!`);
		return;
	}
	if (isdef(M.byCollection[newname])) {
		showMessage(`ERROR! Collection ${newname} already exists!!!!`);
		return;
	}

	//console.log(`would rename collection ${oldname} to ${newname}`);return;
	await collRename(oldname, newname);
}
async function oninputCollFilter(ev) {
	let id = evToId(ev); //console.log('id', id)
	let coll = UI[id];
	let s = ev.target.value.toLowerCase().trim();
	let list = collFilterImages(coll, s);
	coll.keys = list;
	coll.filter = s;
	coll.index = 0; coll.pageIndex = 1; collClearSelections();
	showImageBatch(coll, 0, false);

}
async function onsockSuperdi(x) {
	console.log('SOCK::superdi', x)
	//TODO: update superdi!
	//M.superdi[x.id]=x;
}
//#endregion

//#region play
async function onclickDeleteTable(id) {
	let res = await mPostRoute('deleteTable', { id });
	//console.log('res', res, Serverdata.tables)
}
async function onclickGameMenuItem(ev) {
	let gamename = evToAttr(ev, 'gamename');
	//stop_game();
	await showGameMenu(gamename);
}
async function onclickPlay() {
	await showTables('onclickPlay');
	showGames();
}

//#endregion

//#region plan
function onclickDay(d, styles) {
	let tsDay = d.id;
	let tsCreated = Date.now();
	let id = generateEventId(tsDay, tsCreated);
	let uname = U ? getUname() : 'guest';
	let o = { id: id, created: tsCreated, day: tsDay, time: '', text: '', user: uname, shared: false, subscribers: [] };
	Items[id] = o;
	let x = uiTypeEvent(d, o, styles);
	x.inp.focus();
}
function onclickExistingEvent(ev) { evNoBubble(ev); showEventOpen(evToId(ev)); }
async function onclickPlan() { await showCalendarApp(); }
async function onEventEdited(id, text, time) {
	console.log('onEventEdited', id, text, time)
	let e = Items[id];
	if (nundef(time)) {
		[time, text] = extractTime(text);
	}
	e.time = time;
	e.text = text;
	let result = await simpleUpload('postUpdateEvent', e);
	console.log('result', result)
	Items[id] = lookupSetOverride(Serverdata, ['events', id], e);
	mBy(id).firstChild.value = getEventValue(e);
	closePopup();
}
async function onsockEvent(x) {
	console.log('SOCK::event', x)
	Serverdata.events[x.id] = x;
	//TODO: if calendar app is open refreshEvents!
}
//#endregion

async function onclickColor(ev) {
	let c = ev.target.style.background;
	c = colorHex(c);
	setColors(c);
	U.color = c;
	await postUserChange();
}
async function onclickCommand(ev) {
	let key = evToAttr(ev, 'key');
	//console.log('click command',key)
	assertion(isdef(UI[key]), `command ${key} not in UI!!!`)
	let cmd = UI[key];
	await cmd.open();
}
async function onclickHome() { UI.nav.activate(); await showDashboard(); }
function onclickMenu(ev) {
	let keys = evToAttr(ev, 'key');
	let [menuKey, cmdKey] = keys.split('_');
	let menu = UI[menuKey];

	switchToMenu(menu, cmdKey);
	// menuCloseCurrent(menu);
	// menuOpen(menu, cmdKey);
}
async function onclickNATIONS() {
	if (nundef(M.natCards)) M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	M.civs = ['america', 'arabia', 'china', 'egypt', 'ethiopia', 'greece', 'india', 'japan', 'korea', 'mali', 'mongolia', 'persia', 'poland', 'portugal', 'rome', 'venice', 'vikings'];
	let player = M.player = { civ: rChoose(M.civs) };
	M.ages = { 1: { events: [], progress: [] }, 2: { events: [], progress: [] }, 3: { events: [], progress: [] }, 4: { events: [], progress: [] } };
	for (const k in M.natCards) {
		let c = M.natCards[k];
		if (c.age == 0) continue;
		let age = c.age == 0 ? 1 : c.age;
		if (c.Type == 'event') M.ages[age].events.push(k); else M.ages[age].progress.push(k);
	}
	M.age = 1;
	M.events = M.ages[M.age].events;
	M.progress = M.ages[M.age].progress;
	arrShuffle(M.progress);
	arrShuffle(M.events);
	let d1 = mDiv('dMain'); mFlex(d1);
	UI.coll.rows = 3; UI.coll.cols = 7;
	let bg = mGetStyle('dNav', 'bg');
	let h = 180;
	let dcost = M.costGrid = mGrid(UI.coll.rows, 1, d1, { 'align-self': 'start' });
	for (let cost = 3; cost >= 1; cost--) {
		let d2 = mDom(dcost, { display: 'flex', 'justify-content': 'center', 'flex-flow': 'column', box: true, margin: 2, h: h, overflow: 'hidden' }, {});
		for (let i = 0; i < cost; i++) mDom(d2, { h: 40 }, { tag: 'img', src: `../assets/games/nations/templates/gold.png` });
	}
	UI.coll.grid = mGrid(UI.coll.rows, UI.coll.cols, d1, { 'align-self': 'start' });
	UI.coll.cells = [];
	for (let i = 0; i < UI.coll.rows * UI.coll.cols; i++) {
		let d = mDom(UI.coll.grid, { box: true, margin: 2, h: h, overflow: 'hidden' });
		mCenterCenterFlex(d);
		UI.coll.cells.push(d);
	}
	let n = UI.coll.rows * UI.coll.cols;
	M.market = [];
	for (let i = 0; i < n; i++) {
		let k = M.progress.shift();
		M.market.push(k);
		let card = M.natCards[k];
		let img = mDom(UI.coll.cells[i], { h: h, w: 115 }, { tag: 'img', src: `../assets/games/nations/cards/${k}.png` });
		img.setAttribute('key', k)
		img.onclick = buyProgressCard;
	}
	mDom('dMain', { h: 20 })
	let dciv = mDom('dMain', { w: 800, h: 420, maleft: 52, bg: 'red', position: 'relative' });
	let iciv = await loadImageAsync(`../assets/games/nations/civs/civ_${player.civ}.png`, mDom(dciv, { position: 'absolute' }, { tag: 'img' }));
	M.civCells = [];
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 7; j++) {
			let r = getCivSpot(player.civ, i, j);
			let [dx, dy, dw, dh] = [10, 10, 15, 20]
			let d = mDom(dciv, { box: true, w: r.w + dw, h: r.h + dh, left: r.x - dx, top: r.y - dy, position: 'absolute', overflow: 'hidden' });
			mCenterCenterFlex(d);
			M.civCells.push(d);
			d.onclick = () => selectCivSpot(d);
		}
	}
}
async function onclickNewCollection(name) {

	// if (nundef(name)) name=await mGather1(iDiv(UI.newCollection),'name');
	if (nundef(name)) name = await mGather(iDiv(UI.newCollection));
	if (!name) return;
	//console.log('would open new Collection',name); return;

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
	collOpenSecondary(4, 3);
	collOpenPrimary(4, 3);
}
async function onclickTest() { console.log('nations!!!!'); }
async function onclickUser() {
	let uname = await mGather(iDiv(UI.user), { w: 100, margin: 0 }, { content: 'username', align: 'br', placeholder: ' <username> ' });
	if (!uname) return;
	await switchToUser(uname);
}
