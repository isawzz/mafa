
function mAdjustPage(){
	let hwin = window.innerHeight;
	let r = getRect('dBuffer'); 
	let r2 = getRect('dExtra');
	//console.log(r,r2)
	let [w,h]=[window.innerWidth,window.innerHeight - (r.h+r2.h)];
	mStyle('dMain',{w,h});
	mStyle('dPage',{w,h});
}
function rBgFor(){for(const d of Array.from(arguments)){mStyle(d,{bg:rColor()})}}
function mDom100(dParent,styles={},opts={}){copyKeys({w100:true,h100:true,box:true},styles);return mDom(dParent,styles,opts);}
async function onclickSimple() {

	let name = valf(localStorage.getItem('collection'),'tierspiel'); //console.log(name);

	mAdjustPage();
	let div = mDom100('dMain'); 
	//window.onresize = onclickSimple;

	let coll = UI.simple = {name,div};

	let [w,h,bg,fg]=[coll.w,coll.h,coll.bg,coll.fg] = [mGetStyle(div,'w'),mGetStyle(div,'h'),getNavBg(),getThemeFg()];

	let d1=mDom(div);mCenterFlex(d1)

	let dMenu = coll.dMenu = mDom(d1, { gap: 10, padding: 12 }, { className: 'title' });
	mFlexVWrap(dMenu);

	let dInstruction = coll.dInstruction = mDom(d1, { w100:true, align: 'center', fg }, { html: '* press Control key when hovering to magnify image! *' })

	let dBatch = coll.dBatch = mDom(d1);

	let cellStyles = { bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' };
	let o = createBatchGridCells(d1,w*.9,h*.9,cellStyles);
	addKeys(o,coll);

	mStyle(dInstruction, { w: mGetStyle(coll.dGrid, 'w') });

	coll.dPageIndex = mDom(d1, { w100:true, fg: fg, padding: 10, align: 'right' },{html:'page X/XYZ'});

	//console.log(coll);

	collInit(name, coll);
	
	coll.isOpen = true;
	coll.dInstruction.innerHTML = '* drag images into the shaded area *'
	let grid = coll.dGrid;
	mStyle(grid, { bg: '#00000030' })
	enableImageOrItemDrop(grid, collOnDropImage);
	//rBgFor(coll.div,coll.dMenu,coll.dBatch,coll.dGrid); //damit man sieht was der macht mit div sizing
}
function presentBatch(coll){
}
function createBatchGridCells(d,w,h,styles={},opts={}){
	let cols = Math.floor((w-20)/140);
	let rows = Math.floor((h-20)/140);
	let dGrid = mGrid(rows,cols,d,{margin:'auto',gap:4})
	let cells = [];
	for (let i = 0; i < rows * cols; i++) {
		let d = mDom(dGrid, styles,opts);
		mCenterCenterFlex(d);
		cells.push(d);
	}
	return {dGrid,cells,rows,cols};
}
function rest(coll){
	collInitCollection(coll.name, coll);
	coll.isOpen = true;
	coll.dInstruction.innerHTML = '* drag images into the shaded area *'
	let grid = coll.dGrid;
	mStyle(grid, { bg: '#00000030' })
	enableImageOrItemDrop(grid, collOnDropImage);
	// cmdDisable(UI.asSecondary.key);
}
function menuCloseSimple() { clearMain(); } //	window.onresize = null;}
























