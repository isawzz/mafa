
function collInit(name, coll) {
	let isReload = isdef(coll.index) && coll.name == name;
	if (!isReload) { coll.index = 0; coll.pageIndex = 1; coll.name = name; coll.filter = null; }

	let list = [];
	if (name == 'all' || isEmpty(name)) { list = Object.keys(M.superdi); }
	else if (isdef(M.byCollection[name])) { list = M.byCollection[name]; }
	else list = [];
	
	localStorage.setItem('collection', name)

	let dMenu = coll.dMenu;
	mClear(dMenu);
	let d = mDom(dMenu); mFlexV(d);
	mDom(d, { fz: 24, weight: 'bold' }, { html: 'Collection:' });

	let collNames = M.collections; 
	let dlColl = mDatalist(d, collNames, { placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => {console.log(coll.name,ev.target.value);collInit(ev.target.value, coll);}
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
	dlCat.inpElem.oninput = ev =>{
		let coll = UI.simple;
		let s = ev.target.value.toLowerCase().trim();
		let list = collFilterImages(coll, s);
		coll.keys = list;
		coll.filter = s;
		coll.index = 0; coll.pageIndex = 1; collClearSelections();
		showImageBatch(coll, 0, false);
	};
	
	d = mDom(dMenu, { gap: 10, align: 'right' });
	mButton('prev', ()=>showImageBatch(coll,-1), d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bPrev');
	mButton('next', ()=>showImageBatch(coll,1), d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bNext');
	collClearSelections();
	showImageBatch(coll);
}

