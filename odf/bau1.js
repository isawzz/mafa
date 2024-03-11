
function mCheckbox(dg,name){
	let di = mDom(dg, { display: 'inline-block' });
	let chk = mDom(di, {}, { tag: 'input', type: 'checkbox', id: getUID('c'), name:name });
	let label = mDom(di, {}, { tag: 'label', html: name, for: chk.id });
	return di;

}
function mGrid(rows, cols, dParent, styles = {}) {

	//dParent.innerHTML = '';
	addKeys({display:'inline-grid',gridCols:'repeat(' + cols + ',1fr)'},styles);
	if (rows) styles.gridRows = 'repeat(' + rows + ',auto)';
	else styles.overy = 'auto';

  let d = mDiv(dParent, styles);

  return d;
}
function mGridFromItems(dParent, items, maxHeight, numColumns){return mGridFromElements(dParent, items.map(x=>iDiv(x)),maxHeight,numColumns);}
function mGridFromElements(dParent, elems, maxHeight, numColumns) {
	dParent.innerHTML = '';
	let cols=`repeat(${numColumns}, 1fr)`; //'repeat(auto-fill, minmax(0, 1fr))';
	let grid=mDom(dParent,{display:'inline-grid',gridCols:cols,gap:10,padding:4,overy:'auto',hmax:maxHeight})
	elems.forEach(x => mAppend(grid,x));
	return grid;
}
function measureHeight(elem){return mGetStyle(elem, 'h')}
function measureWidth(elem){return mGetStyle(elem, 'w')}












