
async function collOnDroppedItem(item, coll) {
	assertion(isdef(item.key), 'NO KEY!!!!!');
	await collAddItem(coll, item.key, item);
	collOpenSecondary(4, 2);
	showImageBatch(coll, 0);
}
async function collAddItem(coll, key, item) {
	if (nundef(M.superdi[key])) {
		M.superdi[key] = item;
		let res = await mPostRoute('postNewItem', { key: key, item: item });
	} else {
		addIf(item.colls, coll.name);
		let res = await mPostRoute('postUpdateItem', { key: key, item: item });
	}
	for (const cat of item.cats) lookupAddIfToList(M.byCat, [cat], key);
	for (const coll of item.colls) lookupAddIfToList(M.byCollection, [coll], key);
	lookupAddIfToList(M.byFriendly, [item.friendly], key)
	M.categories = Object.keys(M.byCat); M.categories.sort();
	M.collections = Object.keys(M.byCollection); M.collections.sort();
	M.names = Object.keys(M.byFriendly); M.names.sort();
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


function keyDownHandler(ev) {
	if (IsControlKeyDown && MAGNIFIER_IMAGE) return;
	if (!MAGNIFIER_IMAGE && ev.key == 'Control') {
		IsControlKeyDown = true;
		let hoveredElements = document.querySelectorAll(":hover");
		let cand = Array.from(hoveredElements).find(x => mHasClass(x, 'magnifiable'));
		if (isdef(cand)) showDetailsAndMagnify(cand);
	}
}
function showDetailsAndMagnify(elem){
	//console.log(elem.firstChild);
	mMagnify(elem);
	let key = elem.firstChild.getAttribute('key')
	console.log('key',key)
	if (isdef(M.details[key])){
		console.log('details',M.details[key]);
	}
}





















