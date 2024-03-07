
function collInitCollection(name, coll) {
	let isReload = isdef(coll.index) && coll.name == name;
	console.log('_________ init',name,isReload,'\ncoll',coll.name,coll.index,coll.pageIndex,coll.filter);
	if (!isReload) {
		coll.index = 0; coll.pageIndex = 1; coll.name = name; coll.filter = null;
	}
	
	console.log('coll',coll.name,coll.index,coll.pageIndex,coll.filter);

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
	coll.masterKeys = list; 
	coll.keys = coll.filter?collFilterImages(coll,coll.filter):list;

	//filter
	let cats = collectCats(coll.keys);
	cats.sort();
	d = mDom(dMenu); mFlexV(d);
	let wLabel = coll.cols < 6 ? 117 : 'auto';
	mDom(d, { fz: 24, weight: 'bold', w: wLabel, align: 'right' }, { edit:true, html: 'Filter:' });
	let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>", value:coll.filter });
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










