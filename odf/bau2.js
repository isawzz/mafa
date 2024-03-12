
async function onclickEditCategories() {
	let selist = UI.selectedImages; //console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let arrs = keys.map(x => M.superdi[x].cats);
	let lst = unionOfArrays(arrs); //console.log('inter', lst);
	let catlist = M.categories.map(x => ({ name: x, value: lst.includes(x) }));
	sortByDescending(catlist,'value');

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
		if (sameList(cats,o.cats)) continue;
		changed = true;
		o.cats=cats;
		di[key] = o;
	}

	if (!changed) { console.log('categories unchanged!',cats); collClearSelections(); return; }
	console.log('items changed:',Object.keys(di));

	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();
}

function uiGadgetTypeCheckListInput(form, content, styles, opts) {
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, box: true }, styles)
	let dOuter = mDom(form, styles)
	let dParent = mDom(dOuter, { pabottom: 10, box: true }); 
	let ui = uiTypeCheckListInput(content, dParent, styles, opts);
	return () =>DA.formResult;
}










