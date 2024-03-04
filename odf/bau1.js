async function onclickCollItemLabel(ev) {
  evNoBubble(ev);
  let o = evToAttrElem(ev, 'key');
  if (!o) return;
  let [key, elem] = [o.val, o.elem];
  if (nundef(key)) { console.log('no key'); return; }
	let collname = elem.getAttribute('collname');
	console.log('clicked',key,collname);
	let newfriendly = await mGather(ev.target);
	if (!newfriendly) return;


	if (isEmpty(newfriendly)){ // || !isAlphanumeric(newfriendly)){
		showMessage(`ERROR: name invalid: ${newfriendly}`);
		return;
	}

	console.log('rename friendly to',newfriendly)
	let item=M.superdi[key];
	item.friendly=newfriendly;
	let resp=await mPostRoute('postUpdateItem', { key: key, item: item });
	console.log(resp);
	ev.target.innerHTML=newfriendly;

}

function collInitCollection(name, coll) {
	coll.name = name;
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
	// mDom(dMenu, {}, { html: '' });

	let dlColl = mDatalist(d, colls, { placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value, coll);
	//dlColl.inpElem.onlostfocus = ev => ev.target.value=coll.name;
	dlColl.inpElem.value = name;


	coll.masterKeys = list; 
	let cats = collectCats(list);
	cats.sort();
	d = mDom(dMenu); mFlexV(d);
	let wLabel = coll.cols < 6 ? 117 : 'auto';
	mDom(d, { fz: 24, weight: 'bold', w: wLabel, align: 'right' }, { edit:true, html: 'Filter:' });
	// mDom(d, {  }, { html: '<h2>Filter:</h2>' });
	let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>" });
	dlCat.inpElem.oninput = collFilterImages;

	//let wButtons=coll.w<650?'100%':'auto'; // mDom(dMenu,{h:1,w100:true})
	d = mDom(dMenu, { gap: 10, align: 'right' });
	if (coll.cols < 6) mStyle(d, { w100: true }); //?true:false
	if (coll == UI.collSecondary) mButton('done', onclickCollDone, d, { w: 70, margin: 0, maleft: 10 }, 'input');
	mButton('prev', onclickCollPrev, d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bPrev');
	mButton('next', onclickCollNext, d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bNext');
	coll.keys = list;
	coll.index = 0; coll.pageIndex = 1; UI.selectedImages = [];
	showImageBatch(coll);
	//showDiv(dMenu); return;
}











