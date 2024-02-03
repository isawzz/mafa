async function onclickCollections() {
  dMenu = mDom('dTitle',{maleft:100},{className:'title'});
	mFlexV(dMenu); mStyle(dMenu, { gap: 14 });

	collSidebar();
	UI.coll={};

	let d1 = mDiv('dMain'); mFlex(d1);
  //showSidebar(d1);
  UI.coll.rows = 5; UI.coll.cols = 7;
  UI.coll.grid = mGrid(UI.coll.rows, UI.coll.cols, d1, { 'align-self': 'start' });
  UI.coll.cells = [];
  let bg = mGetStyle('dNav', 'bg');
  for (let i = 0; i < UI.coll.rows * UI.coll.cols; i++) {
    let d = mDom(UI.coll.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    UI.coll.cells.push(d);
  }
  collInitCollection(valf(localStorage.getItem('collection'), 'animals'));
}
function collInitCollection(name) {
  let list = [];
  if (name == 'all' || isEmpty(name)) {
    list = Object.keys(M.superdi);
  } else if (isdef(M.byCollection[name])) {
    list = M.byCollection[name];
  } else return;
  localStorage.setItem('collection', name)
  mClear(dMenu);
  mDom(dMenu, {maleft:10,maright:-20}, { html: '<h1>Collection:</h1>' });
  let dParent = dMenu;
  let colls = M.collections;
  mDom(dParent, {}, { html: '' });
  let dlColl = mDatalist(dParent, colls, { onupdate: collectionAddEmpty, placeholder:"<select from list>" });
  dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value);
  dlColl.inpElem.value = name;

  initFilter(list);
  // UI.coll.masterKeys = list;
  // let cats = collectCats(list);
  // cats.sort();
  // mDom(dMenu, {maright:-6}, { html: '<h1>Filter:</h1>' });
  // let dlCat = mDatalist(dMenu, cats, { edit: false, placeholder:"<enter value>" });
  // dlCat.inpElem.oninput = filterImages;
  
	mButton('prev', onclickPrev, dMenu, { w: 70, margin: 0 }, 'input');
  mButton('next', onclickNext, dMenu, { w: 70, margin: 0 }, 'input');
  UI.coll.keys = list;
  UI.coll.index = 0;
  showImageBatch();
}
function initFilter(list) {
  UI.coll.masterKeys = list;
  let cats = collectCats(list);
  cats.sort();
  mDom(dMenu, {maright:-6}, { html: '<h1>Filter:</h1>' });
	let dlCat = mDatalist(dMenu, cats, { edit: false, placeholder:"<enter value>" });//  let dlCat = mDatalist(dMenu, cats, { edit: false });
  dlCat.inpElem.oninput = filterImages;
}
function mDatalist(dParent, list, opts = {}) {
  var mylist = list;
  var opts = opts;
  addKeys({ alpha: true, filter: 'contains' }, opts);
  let d = mDiv(toElem(dParent));
  let optid = getUID('dl');
  mDom(d, { w: 200 }, { tag: 'input', className: 'input', placeholder: valf(opts.placeholder,'') });
  mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
  var elem = d;
  var inp = elem.firstChild;
  var datalist = elem.lastChild;
  for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }
  inp.setAttribute('list', optid);
  if (opts.onupdate) inp.addEventListener('keyup', opts.onupdate);
  inp.onmousedown = () => inp.value = ''
  return {
    list: mylist,
    elem: elem,
    inpElem: inp,
    listElem: datalist,
    opts: opts,
  }
}
