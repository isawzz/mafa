
async function onclickCatListDone(ui){
	//let ui=ev.target.parentNode;
	let checks=Array.from(ui.getElementsByTagName('input'));
	//console.log('checkboxes',checks,checks[0]);
	DA.x = checks[0];
	let cats=[];
	for(const ch of checks) {
		if (ch.checked) cats.push(ch.name);
	}
	//console.log('cats',cats);

	ui.setAttribute('proceed',cats.join('@'));

}
function onclickCollDone(){
	collCloseSecondary();
	console.log('sec',UI.collSecondary)
	UI.collPrimary.name = UI.collSecondary.name;
	collOpenPrimary();
}
async function onclickCollItem(ev) {
  evNoBubble(ev);
  let o = evToAttrElem(ev, 'key');
  if (!o) return;
  let [key, elem] = [o.val, o.elem];
  if (nundef(key)) { console.log('no key'); return; }
  if (nundef(UI.selectedImages)) UI.selectedImages = [];
	let collname = elem.getAttribute('collname');
	let selist = UI.selectedImages;
	let selkey=collGenSelkey(key,collname); //`${key}@${collname}`; //collFromElement(elem).name}`;
	//console.log('vor toggle:',selist); //,key,selkey);
  toggleSelectionOfPicture(elem,selkey, UI.selectedImages);
	//console.log('nach toggle',UI.selectedImages)
	if (isEmpty(selist)) {collDisableListCommands(); collDisableItemCommands();}
	else if (selist.length == 1) {collEnableListCommands();collEnableItemCommands();}
	else{collDisableItemCommands();collEnableListCommands();}
}
async function onclickCollItemLabel(ev) {
  evNoBubble(ev);
  let o = evToAttrElem(ev, 'key');
  if (!o) return;
  let [key, elem] = [o.val, o.elem];
  if (nundef(key)) { console.log('no key'); return; }
	let collname = elem.getAttribute('collname');
	console.log('clicked',key,collname);
	let newfriendly = await mGather(ev.target);
	if (!newfriendly) return;


	if (isEmpty(newfriendly)){ // || !isAlphanumeric(newfriendly)){
		showMessage(`ERROR: name invalid: ${newfriendly}`);
		return;
	}

	console.log('rename friendly to',newfriendly)
	let item=M.superdi[key];
	item.friendly=newfriendly;
	let resp=await mPostRoute('postUpdateItem', { key: key, item: item });
	console.log(resp);
	ev.target.innerHTML=newfriendly;

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

	UI.collPrimary = { div: dPrimary, name: collName }; //{name:'amanda'};
	UI.collSecondary = { div: dSecondary, name: null };
	collOpenPrimary(4, 4);
}
async function onclickColor(ev) {
  let c = ev.target.style.background;
  c = colorHex(c);
  setColors(c);
  U.color = c;
  await postUserChange();
}
function onclickCommand(ev) {
	let key = evToAttr(ev, 'key');
	//console.log('click command',key)
	assertion(isdef(UI[key]), `command ${key} not in UI!!!`)
	let cmd = UI[key];
	cmd.open();
}
function onclickDay(d, styles) {
  let tsDay = d.id; 
  let tsCreated = Date.now();
  let id = generateEventId(tsDay, tsCreated);
  let uname = U ? U.name : 'guest';
  let o = { id: id, created: tsCreated, day: tsDay, time: '', text: '', user: uname, shared: false, subscribers: [] };
  Items[id] = o;
  let x = uiTypeEvent(d, o, styles); 
  x.inp.focus();
}
async function onclickDeleteCollection(name) {
	if (nundef(name) && UI.collSecondary.isOpen) name = UI.collSecondary.name;
	if (nundef(name)) name = await mGather(iDiv(UI.deleteCollection), 'name');
	if (!name) return;

	let proceed = await mGather(iDiv(UI.deleteCollection), {}, { type: 'yesno', content: `delete collection ${name}?` });

	// console.log('...',(proceed?'will':'will NOT'),`delete collection ${name}`);
	if (proceed) await collDelete(name);
}
function onclickExistingEvent(ev) { evNoBubble(ev); showEventOpen(evToId(ev)); }
async function onclickHome() { UI.nav.activate(); await showDashboard(); }
function onclickMenu(ev) {
	let keys = evToAttr(ev, 'key');
	let [menuKey, cmdKey] = keys.split('_');
	let menu = UI[menuKey];
	menuCloseCurrent(menu);
	menuOpen(menu, cmdKey);
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
      let [dx,dy,dw,dh]=[10,10,15,20]
      let d = mDom(dciv, { box: true, w: r.w+dw, h: r.h+dh, left: r.x-dx, top: r.y-dy, position: 'absolute', overflow: 'hidden' });
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

	if (isEmpty(name)){
		showMessage(`ERROR! you need to enter a valid name!!!!`);
		return;
	}
	if (collLocked(name)) {
		showMessage(`collection ${name} is Read-Only!`);
		return;
	}
	UI.collSecondary.name = name; 
	collOpenSecondary(4, 3);
}
async function onclickPlan() { showCalendarApp(); }
async function onclickPlay() { showTables(); }
async function onclickRenameCollection(oldname, newname) {
	if (nundef(oldname)) oldname = UI.collSecondary.isOpen?UI.collSecondary.name:UI.collPrimary.name;
	if (nundef(newname)) {
		//console.log('HALLO!!!!')
		let di = await mGather(iDiv(UI.renameCollection), {},{content:{ oldname: valf(oldname, ''), newname: '' },type:'multi'});
		//console.log('di', di);
		if (!di) return;
		[oldname,newname]=[di.oldname,di.newname];
	}

	newname = newname.toLowerCase();
	if (isEmpty(newname)){
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
	if (isdef(M.byCollection[newname])){
		showMessage(`ERROR! Collection ${newname} already exists!!!!`);
		return;
	}

	//console.log(`would rename collection ${oldname} to ${newname}`);return;
	await collRename(oldname, newname);
}
async function onclickTable(id) { await switchToTable(id); }
async function onclickTest() { console.log('nations!!!!'); }
async function onclickUser() {
	let uname = await mGather(iDiv(UI.user),{w:100,margin:0},{content:'username',align:'br',placeholder:' <username> '});
	if (!name) return;
	await switchToUser(uname);
}
async function oninputCollFilter(ev){
	let id = evToId(ev); //console.log('id', id)
	let coll = UI[id];
	let s = ev.target.value.toLowerCase().trim(); 
	let list = collFilterImages(coll,s);
	coll.keys = list;
	coll.filter = s;
	coll.index = 0; coll.pageIndex = 1; collClearSelections();
	showImageBatch(coll, 0, false);

}
