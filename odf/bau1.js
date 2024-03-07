
async function onclickEditCollItem() {
	let selist = UI.selectedImages; //console.log('selist', selist)
	let key = selist.map(x => stringBefore(x, '@'))[0];
	let item = M.superdi[key];

	let catlist = M.categories.map(x => ({ name: x, value: item.cats.includes(x) }));

	let cats = await mGather(iDiv(UI.addCategories), {}, { content: catlist, type: 'checklist' });
	if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
	cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x));

	if (sameList(item.cats,cats)){ console.log('no change'); collClearSelections(); return; }

	console.log(`cats of item ${key} set to`,cats);
	item.cats = cats;
	let di={};di[key]=item;

	let res = await mPostRoute('postUpdateSuperdi', { di }); 
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();
}

async function onclickAddCategories() {
	let selist = UI.selectedImages; //console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let catlist = M.categories.map(x => ({ name: x, value: false }));

	let cats = await mGather(iDiv(UI.addCategories), {}, { content: catlist, type: 'checklist' });
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
	console.log('items changed:',Object.keys(di));

	let res = await mPostRoute('postUpdateSuperdi', { di }); 
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();
}
async function onclickRemoveCategories() {
	let selist = UI.selectedImages; //console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let arrs = keys.map(x => M.superdi[x].cats);
	let lst = unionOfArrays(arrs); //console.log('inter', lst);
	let catlist = lst.map(x => ({ name: x, value: false }));

	let cats = await mGather(iDiv(UI.removeCategories), {}, { content: catlist, type: 'checklist' });
	if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
	cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(cats)) { console.log('nothing removed'); collClearSelections(); return; }

	let remolist=cats; //arrMinus(catlist.map(x=>x.name),cats)
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

	if (!changed) { console.log('ERROR: none of selected elements has cat in',remolist); collClearSelections(); return; }
	console.log('items changed:',Object.keys(di));

	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();

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
	if (isEmpty(di) && Object.keys(deletedKeys).every(x=>isEmpty(deletedKeys[x]))){
		showMessage(`ERROR: cannot delete selected items!!!`);
		collClearSelections();
		return;

	}

	console.log('deletedKeys dict: ', deletedKeys);
	for (const k in deletedKeys) {
		let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: deletedKeys[k], collname: k });
		console.log('postUpdateSuperdi', k, res)
		di={}; //keys have been updated already
	}

	await loadAssets();
	collPostReload();
}













