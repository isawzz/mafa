//#region checked out from closure
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
function showNavbar() {
	let nav = mMenu('dNav');
	let commands = {};
	commands.home = menuCommand(nav.l, 'nav', 'home', 'HOME', showDashboard, menuCloseHome);
	commands.settings = menuCommand(nav.l, 'nav', 'settings', null, settingsOpen, menuCloseSettings);
	commands.simple = menuCommand(nav.l, 'nav', 'simple', null, onclickSimple, menuCloseSimple);
	commands.collections = menuCommand(nav.l, 'nav', 'collections', null, onclickCollections, menuCloseColl);
	commands.play = menuCommand(nav.l, 'nav', 'play', 'Games', onclickPlay, menuCloseGames);
	commands.table = menuCommand(nav.l, 'nav', 'table', 'Table', onclickTableMenu, menuCloseTable);
	commands.plan = menuCommand(nav.l, 'nav', 'plan', 'Calendar', onclickPlan, menuCloseCalendar);
	nav.commands = commands;
	return nav;
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
async function onclickCollPrev(ev) {
	let coll = collFromElement(ev.target.parentNode)
	showImageBatch(coll, -1);
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


