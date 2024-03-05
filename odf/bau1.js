

function uiGadgetTypeCheckList(form, content, styles, opts) {

	//was soll der content sein? wo soll der content berechnet werden?
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
	let dOuter = mDom(form, styles)
	// let d=mDom(form,{bg:'white'})
	let dParent = mDom(dOuter, { hmax: 510, wmax: 200, pabottom: 10, box: true }); //,bg:'blue',fg:'contrast'});

	console.log('content', content)
	let lst = content.map(x => x.name);
	console.log('lst', lst)

	let ui = uiTypeCheckList(lst, dParent, styles, opts);
	console.log('ui', ui)

	//onclick: () => form.setAttribute('proceed', 'yes')

	mButton('done', () => onclickCatListDone(form), dOuter, { classes: 'input', margin: 10 }); //da muss noch ein button dazu

	return () => form.getAttribute('proceed');

	//muss eine evalfunc returnen!!!
}



async function onclickAddCategories() {
	let selist = UI.selectedImages; console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let catlist = M.categories.map(x => ({ name: x, val: false }));

	// let arrs=keys.map(x=>M.superdi[x].cats); 
	// let inter = intersectionOfArrays(arrs);	console.log('inter',inter);
	// for(const c of catlist){c.val=inter.includes(c.name);	}

	let cats = await mGather(iDiv(UI.addCategories), {}, { content: catlist, type: 'checklist' });
	cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(cats)) { console.log('nothing added'); collClearSelections(); return; }
	console.log('add cats:', cats);

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
async function onclickEditCategories() {
	let selist = UI.selectedImages; console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let catlist = M.categories.map(x => ({ name: x }));
	let arrs = keys.map(x => M.superdi[x].cats);
	let inter = intersectionOfArrays(arrs); console.log('inter', inter);
	for (const c of catlist) { c.val = inter.includes(c.name); }

	let cats = await mGather(iDiv(UI.editCategories), {}, { content: catlist, type: 'checklist' });
	cats = cats.split('@');
	console.log('user selected', cats, typeof cats);

	//jetzt muss ich nur noch all die selected zu diesen cats setzen

}
function collClearSelections() {
	//find all visible uis for selected images
	let x = document.getElementsByClassName('framedPicture');
	for (const el of x) {
		console.log('el', el);
		collUnselect(el);
	}
	UI.selectedImages = [];
	collDisableListCommands();
}
async function onclickRemoveCategories() {
	//hier soll in der liste NUR intersein!
	let selist = UI.selectedImages; console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	//let catlist = M.categories.map(x => ({ name: x }));
	let arrs = keys.map(x => M.superdi[x].cats);
	let lst = intersectionOfArrays(arrs); console.log('inter', lst);
	let catlist = lst.map(x => ({ name: x, val: true }));

	let cats = await mGather(iDiv(UI.removeCategories), {}, { content: catlist, type: 'checklist' });
	let remolist=arrMinus(catlist,cats)
	console.log('remove cats', remolist);
}

function unionOfArrays() {
	// arguments should be lists or one list of lists
	let arrs = arguments[0]; console.log('arrs', arrs);
	if (!arrs.every(Array.isArray)) arrs = Array.from(arguments);
	const flattenedArray = arrs.flat();
	return [...new Set(flattenedArray)];
}
function intersectionOfArrays() {
	// Check if the input is an array of arrays
	let arrs = arguments[0]; console.log('arrs', arrs);
	if (!arrs.every(Array.isArray)) arrs = Array.from(arguments);
	return arrs.reduce((acc, array) => acc.filter(element => array.includes(element)));
}

async function hallo() {
	return;
	let cat = await mGather(iDiv(UI.editCategories), {}, { content: M.categories, type: 'select' });
	console.log('selected cat', cat); return;
	//console.log('addCategpory', selist);
	let di = {};
	for (const k of selist) {
		let o = collKeyCollnameFromSelkey(k);
		let key = o.key;
		await collDeleteOrRemove(key, collname, di, deletedKeys[collname]);
	}
	let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: [] });
	console.log('postUpdateSuperdi', k, res)
	await loadAssets();
	collPostReload();
	UI.selectedImages = [];
}











