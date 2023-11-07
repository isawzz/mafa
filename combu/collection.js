function initCollection(name){
	let list=[];
	if (name == 'all' || isEmpty(name)){
		list = Object.keys(M.superdi);
	}else if (isdef(M.byCollection[name])){
		list = M.byCollection[name];
	}else return;

	mClear(dMenu);
	let dParent = dMenu;
	let colls = M.collections; //['all'].concat(M.collections); 
	//colls.sort();
	mDom(dParent, {}, { html: '' }); 
	let dlColl = mDatalist(dParent, colls, {onupdate:collectionAddEmpty});
	dlColl.inpElem.oninput = ev=>initCollection(ev.target.value);
	dlColl.inpElem.value = name;


	initFilter(list);

	//add buttons!
	mButton('prev', onclickPrev, dMenu, { w: 70, margin: 0 }, 'input');
	mButton('next', onclickNext, dMenu, { w: 70, margin: 0 }, 'input');


	M.keys = list;
	M.index = 0;
	showImageBatch();
}
function initFilter(list){

	//need to find all cats for list elements
	M.masterKeys = list;
	let cats = collectCats(list);
	cats.sort();
	mDom(dMenu, {}, { html: 'Filter:' }); 
	let dlCat = mDatalist(dMenu, cats, {edit:false});
	dlCat.inpElem.oninput = filterImages;

}
async function updateCollections() {

	//integrate m2.yaml
	let imgs = await mGetYaml('../y/m2.yaml');
	for (const k in imgs) {
		if (isdef(M.superdi[k])) continue;
		let o = imgs[k];
		M.superdi[k] = { key: k, friendly: o.name, cats: [o.cat], ext: o.ext, img: `${k}.${o.ext}`, path: `../y/img/${k}.${o.ext}` };
		addIf(M.collections, o.coll);
		addIf(M.categories, o.cat);
		addIf(M.names, o.name);
		//console.log('o.cat', o.cat, k)
		lookupAddIfToList(M.byCat, [o.cat], k);
		lookupAddIfToList(M.byFriendly, [o.name], k);
		lookupAddIfToList(M.byCollection, [o.coll], k);
	}
	//sort all the dicts alphabetically
	M.categories.sort();
	M.names.sort();
	M.collections.sort();
	
}
