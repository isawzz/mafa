
async function onclickAddCategories() {
	let selist = UI.selectedImages; console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let catlist = M.categories.map(x => ({ name: x, value: false }));

	// let arrs=keys.map(x=>M.superdi[x].cats); 
	// let inter = intersectionOfArrays(arrs);	console.log('inter',inter);
	// for(const c of catlist){c.val=inter.includes(c.name);	}

	let cats = await mGather(iDiv(UI.addCategories), {}, { content: catlist, type: 'checklist' });
	cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(cats)) { console.log('nothing added'); collClearSelections(); return; }
	console.log('add cats:', cats);
	return;

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

	let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: [] });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();
	//collClearSelections();
	UI.selectedImages = [];



}
async function onclickRemoveCategories() {
	//hier soll in der liste NUR intersein!
	let selist = UI.selectedImages; console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	//let catlist = M.categories.map(x => ({ name: x }));
	let arrs = keys.map(x => M.superdi[x].cats);
	let lst = intersectionOfArrays(arrs); console.log('inter', lst);
	let catlist = lst.map(x => ({ name: x, value: true }));

	let cats = await mGather(iDiv(UI.removeCategories), {}, { content: catlist, type: 'checklist' });
	let remolist=arrMinus(catlist,cats)
	console.log('remove cats', remolist);
}













