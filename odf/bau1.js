
function uiTypeCheckListInput(lst, dParent, styles = {}, opts = {}) {

	mStyle(dParent,{w:1000})
	let dg = mDom(dParent);
	let list = lst; // lst.map(x=>x.name); list.sort();
	//console.log('list',list)

	let items = []; //make measured checkbox items
	for (const o of list) {
		let div = mCheckbox(dg,o.name,o.value);
		items.push({ nam:o.name, div, w: mGetStyle(div, 'w'), h: mGetStyle(div, 'h') });
	}
	let wmax = arrMax(items,'w'); //console.log('wmax',wmax); //measure max width of items
	let cols=3; 
	let wgrid=wmax*cols+100; //(wmax+15) * (cols) + 10;
	dg.remove();

	dg = mDom(dParent);
	// *** input ***
	let inp = mDom(dg, {w100:true,box:true,mabottom:10}, { className: 'input', tag: 'input', type: 'text' });

	// *** buttons ***
	let db=mDom(dg,{w100:true,box:true,align:'right',mabottom:4});
	mButton('cancel',()=>DA.formResult=null,db,{},'input');
	mButton('clear',ev=>{ev.preventDefault();onclickClear(inp,grid)},db,{maleft:10},'input');
	mButton('done',()=>DA.formResult=extractWords(inp.value,' '),db,{maleft:10},'input');

	// *** grid ***
	mStyle(dg, { w:wgrid,box:true,padding:10 }); //, w: wgrid })
	
	//let grid = mGridFromItems(dg,items,500,cols); //createItemsGrid(dg, items, 500, cols);
	let grid = mGrid(null,cols,dg,{w100:true,gap:10,matop:4,hmax:500});	
	items.map(x=>mAppend(grid,iDiv(x)));

	//when checkbox val changes inp needs to change and checkboxes need to be rearranged! possibly new checkboxes created!
	let chks=Array.from(dg.querySelectorAll('input[type="checkbox"]')); //chks=items.map(x=>iDiv(x).firstChild);
	//console.log('cheks',chks)
	for(const chk of chks){
		chk.addEventListener('click',ev=>checkToInput(ev,inp,grid))
	}

	inp.value = list.filter(x=>x.value).map(x=>x.name).join(', ');
	inp.addEventListener('keypress',ev=>inpToChecklist(ev, grid));
	//when inp is changed, checkboxes need to be modified
	//only when pressing enter in input box OR when entering a comma?

	return {dg,inp,grid};

}














