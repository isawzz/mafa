
async function collOnDroppedItem(item, coll) {
	assertion(isdef(item.key), 'NO KEY!!!!!');
	await collAddItem(coll, item.key, item);
	collOpenSecondary(4, 2);
	showImageBatch(coll, 0);
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

	let di={};
	di[key]=item;
	// await updateSuperdi(di,key)
	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	// let resp = await mPostRoute('postUpdateItem', { key: key, item: item });
	// console.log(resp);
	ev.target.innerHTML = newfriendly;
}
async function updateSuperdi(di,key){
	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();

	//er soll zu der page gehen wo key visible ist!



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
function keyUpHandler(ev) {
	if (ev.key == 'Control') {
		IsControlKeyDown = false;
		mMagnifyOff();
		if (isdef(mBy('hallo'))) mBy('hallo').remove();
	}
}
function fromNormalized(s){
	let x=replaceAll(s,'_',' ');
	let words = toWords(x).map(x=>capitalize(x)).join(' ');
	return words;
}
function showDetailsAndMagnify(elem){

	//show details soll besser werden!
	let key = elem.firstChild.getAttribute('key')
	if (nundef(key)){mMagnify(elem);return;}
	MAGNIFIER_IMAGE = elem;
	let d=mPopup(null,{},{id:'hallo'});
	let o=M.superdi[key];
	addKeys(M.details[key],o);
	addKeys(M.details[o.friendly],o)
	//console.log(o);

	//title is friendly name or name
	let title=fromNormalized(valf(o.name,o.friendly));
	mDom(d,{},{tag:'h1',html:title});
	mDom(d,{},{tag:'img',src:valf(o.photo,o.img)});
	for(const k in o){
		if ('cats colls fa fa6 img photo text key friendly ga name'.includes(k)) continue;
		let val = o[k];

		if (!isLiteral(val)) continue;
		mDom(d,{},{html:`${k}:${val}`})
	}

	// showObject(o,)	


	// //console.log(elem.firstChild);
	// mMagnify(elem);
	// console.log('key',key)
	// if (isdef(M.details[key])){
	// 	console.log('details',M.details[key]);
	// }
}





















