
function collClear() { closeLeftSidebar(); clearMain(); }
function collFilterImages(ev) {
	let id = evToId(ev); console.log('id', id)
	let coll = UI[id];
	let s = ev.target.value.toLowerCase().trim();
	console.log('filter on', s)
	if (isEmpty(s)) return;
	let di = {};
	for (const k of coll.masterKeys) { di[k] = true; }
	let list = isdef(M.byCat[s]) ? M.byCat[s].filter(x => isdef(di[x])) : [];
	if (nundef(list) || isEmpty(list)) {
		list = [];
		for (const k of coll.masterKeys) {
			let o = M.superdi[k];
			if (k.includes(s) || o.friendly.includes(s)) list.push(k);
		}
		//if (isEmpty(list)) return;
	}
	coll.keys = list;
	coll.index = 0;
	showImageBatch(coll, 0, false);
}
function collInitCollection(name, coll) {
	let list = [];
	if (name == 'all' || isEmpty(name)) {
		list = Object.keys(M.superdi);
	} else if (isdef(M.byCollection[name])) {
		list = M.byCollection[name];
	} else list=[]; //return;
	if (coll == UI.collPrimary) localStorage.setItem('collection', name)
	let dMenu = coll.dMenu;
	mClear(dMenu);
	let d=mDom(dMenu);mFlexV(d);
	mDom(d, { fz:24,weight:'bold' }, { html: 'Collection:' });
	let colls = M.collections;
	// mDom(dMenu, {}, { html: '' });


	let dlColl = mDatalist(d, colls, { placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value, coll);
	dlColl.inpElem.value = name;


	coll.masterKeys = list;
	let cats = collectCats(list);
	cats.sort();
	d=mDom(dMenu);mFlexV(d);
	let wLabel=coll.cols<6?117:'auto';
	mDom(d, { fz:24,weight:'bold',w:wLabel,align:'right' }, { html: 'Filter:' });
	// mDom(d, {  }, { html: '<h2>Filter:</h2>' });
	let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>" });
	dlCat.inpElem.oninput = collFilterImages;

	//let wButtons=coll.w<650?'100%':'auto'; // mDom(dMenu,{h:1,w100:true})
	d=mDom(dMenu,{gap:10,align:'right'});
	if (coll.cols<6) mStyle(d,{w100:true}); //?true:false
	mButton('prev', onclickPrev, d, { w: 70, margin: 0 }, 'input');
	mButton('next', onclickNext, d, { w: 70, margin: 0, maleft:10 }, 'input');
	coll.keys = list;
	coll.index = 0;
	showImageBatch(coll);
	//showDiv(dMenu); return;
}
function showDiv(d){mStyle(d,{bg:rColor()}); console.log(d,mGetStyle(d,'w')); }
function collPresent(coll, rows,cols) {
	let d1=iDiv(coll);

	mClear(d1);
	let w=coll.w=140*cols;
	mStyle(d1,{wmax:w,w:w})
	let dMenu = coll.dMenu = mDom(d1, {padding:12,wmax:w,w:w}, { className: 'title' });
	mFlexVWrap(dMenu); 
	mStyle(dMenu, { gap: 10 });

	// mDom(d1,{w100:true,h:1});
	let dInstruction = coll.dInstruction = mDom(d1, { align: 'center', fg: getThemeFg() }, { html: '* press Control key when hovering to magnify image! *' })
	// mDom(d1,{w100:true,h:1});

	//coll = uiTypeCollection(5,6,)
	coll.rows = rows; coll.cols = cols;
	coll.grid = mGrid(coll.rows, coll.cols, d1, { 'align-self': 'start' });
	coll.cells = [];
	let bg = mGetStyle('dNav', 'bg');
	for (let i = 0; i < coll.rows * coll.cols; i++) {
		let d = mDom(coll.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		coll.cells.push(d);
	}
	mStyle(dInstruction, { w: mGetStyle(coll.grid, 'w') });

	collInitCollection(coll.name, coll);
}
async function onclickNext(ev) { 
  let id = evToId(ev); console.log('id',id)
	let coll = UI[id];
  showImageBatch(coll,1); 
}
async function onclickPrev(ev) { 
  let id = evToId(ev); console.log('id',id)
	let coll = UI[id];
  showImageBatch(coll,-1); 
}
function showImageBatch(coll,inc = 0,alertEmpty=false) {
  let [keys, index, x] = [coll.keys, coll.index, coll.rows * coll.cols];
  if (isEmpty(keys) && alertEmpty) showMessage('nothing has been added to this collection yet!'); 
  if (keys.length <= x) inc = 0;
  index += x * inc; if (index >= keys.length) index = 0; else if (index < 0) index += keys.length;
  let list = arrTakeFromTo(keys, index, index + x);
  coll.index = index;
  for (let i = 0; i < list.length; i++) {
    let d=coll.cells[i];
    mStyle(d, { opacity: 1 });
    mClass(d,'magnifiable')
    showImageInBatch(list[i], d);
  }
  for (let i = list.length; i < x; i++) {
    mStyle(coll.cells[i], { opacity: 0 })
  }
}
function showImageInBatch(key, dParent, styles = {}) {
  let o = M.superdi[key]; o.key=key; //console.log('o',o)
  addKeys({ bg: rColor() }, styles);
  mClear(dParent);
  [w, h] = [dParent.offsetWidth, dParent.offsetHeight];
  let [sz, fz] = [.9 * w, .8 * h];
  let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
  mCenterCenterFlex(d1)
  let el = null;
  if (isdef(o.img)) {
    if (o.cats.includes('card')) {
      el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
      mDom(d1, { h: 1, w: '100%' })
    } else {
      el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
    }
  }
  else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
  else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
  else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
  else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
  assertion(el, 'PROBLEM mit' + key);
	el.ondragstart = ()=>UI.draggedItem=o;
  let label = mDom(d1, { fz: 11 }, { html: key, className: 'ellipsis' }); //,w:'100%'
  mStyle(d1, { cursor: 'pointer' });
  d1.onclick = onclickItem;
  d1.setAttribute('key', key)
}


