async function onclickCollections() {
  //let d = showTitle('Collection:'); mFlexV(d);
  dMenu = mDom('dTitle',{maleft:20},{className:'title'});//, { h: '100%' }); 
	mFlexV(dMenu); mStyle(dMenu, { gap: 14 });
  let d1 = mDiv('dMain'); mFlex(d1);
  M.rows = 5; M.cols = 7;
  M.grid = mGrid(M.rows, M.cols, d1, { 'align-self': 'start' });
  M.cells = [];
  let bg = mGetStyle('dNav', 'bg');
  for (let i = 0; i < M.rows * M.cols; i++) {
    let d = mDom(M.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    M.cells.push(d);
  }
  collInit(valf(localStorage.getItem('collection'), 'animals'));
}

function collInit(name) {
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
  let dlColl = mDatalist(dParent, colls, { onupdate: collectionAddEmpty });
  dlColl.inpElem.oninput = ev => collInit(ev.target.value);
  dlColl.inpElem.value = name;
  collInitFilter(list);
  mButton('prev', onclickPrev, dMenu, { w: 70, margin: 0 }, 'input');
  mButton('next', onclickNext, dMenu, { w: 70, margin: 0 }, 'input');
  M.keys = list;
  M.index = 0;
  showImageBatch();
}
function collInitFilter(list) {
  M.masterKeys = list;
  let cats = collectCats(list);
  cats.sort();
  // mDom(dMenu, {}, { html: 'Filter:' });
  mDom(dMenu, {maright:-6}, { html: '<h1>Filter:</h1>' });
  let dlCat = mDatalist(dMenu, cats, { edit: false });
  dlCat.inpElem.oninput = filterImages;
}
