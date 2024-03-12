onload = start;

async function start() { test1(); }

async function test1() {

	let dg = clearBodyDiv();

	let n = 125; let list = rWords(n); list.sort();// generateRandomWords(n); list.sort(); //words
	//console.log(list); return;

	let items = []; //make measured checkbox items
	for (const name of list) {
		let div = mCheckbox(dg,name);
		items.push({ name, div, w: mGetStyle(div, 'w'), h: mGetStyle(div, 'h') });
	}

	let wmax = arrMax(items,'w'); console.log('wmax',wmax); //measure max width of items
	let cols=3; 
	let wgrid=wmax*cols+100; //(wmax+15) * (cols) + 10;
	dg.remove();

	dg=clearBodyDiv();

	// *** input ***
	let inp = mDom(dg, {w100:true,box:true,mabottom:10}, { className: 'input', tag: 'input', type: 'text' });

	// *** buttons ***
	let db=mDom(dg,{w100:true,box:true,align:'right',mabottom:4});
	mButton('cancel',null,db,{},'input');
	mButton('clear',()=>onclickClear(inp,grid),db,{maleft:10},'input');
	mButton('done',()=>console.log('sending',extractWords(inp.value)),db,{maleft:10},'input');

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

	inp.addEventListener('keyup',ev=>inpToChecklist(ev, grid))
	//when inp is changed, checkboxes need to be modified
	//only when pressing enter in input box OR when entering a comma?


}

async function test0() {
	// const words = generate['Hello', 'World', 'This', 'Is', 'A', 'Simple', 'Test', 'Of', 'The', 'Grid'];
	// const d = document.getElementById('wordsGridContainer');

	let [w, h] = [400, 400];
	let d = clearBodyDiv({ w: w, h: h });

	let n = 125;
	let list = generateRandomWords(n); list.sort();

	createWordsGrid(d, list, h, 2);

}