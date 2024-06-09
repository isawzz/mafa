

async function onclickSimple() {
	let collName = valf(localStorage.getItem('collection'),'tierspiel');

	let div = mDom('dMain',{bg:'green',wmin:200,hmin:200});

	let hwin = window.innerHeight;
	let r = getRect('dBuffer'); 
	let r2 = getRect('dExtra');
	console.log(r,r2)
	let [w,h]=[r.w,window.innerHeight - (r.h+r2.h) - 10];
	mStyle(div,{w,h});
	mStyle(document.body,{w,h});
	mStyle('dMain',{w,h});
}
async function rest(){
	//let top = r.h+r2.h; console.log('top',top)
	//let hmax = hwin - top - 20;

	//mStyle(div,{bg:'green',h:hmax});

	let coll = UI.simple = {collName,div};

	return;
	//collPresent(d,collName, rows, cols);
	let d1 = iDiv(coll);
	mClear(d1);
	mStyle(d1,{w:window.innerWidth,h:'100vh',padding:10});
	let d=mDom(d1,{w100:true,h100:true,box:true,bg:'blue'})
	return;
	
	if (nundef(rows)) rows = coll.rows;
	if (nundef(cols)) cols = coll.cols;
	mClear(d1);
	let w = coll.w = 140 * cols;
	mStyle(d1, { wmax: w, w: w })
	let dMenu = coll.dMenu = mDom(d1, { padding: 12, wmax: w, w: w }, { className: 'title' });
	mFlexVWrap(dMenu);
	mStyle(dMenu, { gap: 10 });
	let fg = getThemeFg();
	let dInstruction = coll.dInstruction = mDom(d1, { align: 'center', fg: fg }, { html: '* press Control key when hovering to magnify image! *' })
	coll.rows = rows; coll.cols = cols;
	coll.grid = mGrid(coll.rows, coll.cols, d1, { maleft: 10, 'align-self': 'start' });
	coll.cells = [];
	let bg = getNavBg();
	for (let i = 0; i < coll.rows * coll.cols; i++) {
		let d = mDom(coll.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		coll.cells.push(d);
	}
	mStyle(dInstruction, { w: mGetStyle(coll.grid, 'w') });
	coll.dPageIndex = mDom(d1, { fg: fg, padding: 10, align: 'right' });
	collInitCollection(coll.name, coll);

	coll.isOpen = true;
	coll.dInstruction.innerHTML = '* drag images into the shaded area *'
	let grid = coll.grid;
	mStyle(grid, { bg: '#00000030' })
	enableImageOrItemDrop(grid, collOnDropImage);
	cmdDisable(UI.asSecondary.key);
}
function menuCloseSimple() { clearMain(); }
























