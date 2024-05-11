
function mColorPickerHex(dParent,colors) {
	dParent = mDom(dParent); 

	//let board = drawHexBoard(7, 7, dParent, { bg: rColor(), padding:10, transition:'1s' }, {w:20,h:22, classes:'hexframe'}); //, {padding:10});
	let board = drawHexBoard(7, 7, dParent, { bg: 'transparent', padding: 10 }, { w: 20, h: 22 }); 
	board.dSample = mDom(dParent,{w:200,hmin:40,margin:'auto',align:'center'});
	let tables = mDom(dParent, {}, { id: 'dHslTable' });
	//let colors = getColormapColors(); //console.log('colors', colors);

	let i = 0;
	for (const item of board.items) {
		let bg = colors[i++];
		item.color = bg;
		let dhex = iDiv(item);
		dhex.onmouseenter = () => onenterHex(item, board);
		dhex.onmouseleave = () => onleaveHex(item, board);
		dhex.onclick = () => onclickHex(item, board); //{mStyle(document.body, {bg});} 
		mStyle(dhex, { bg });
	}

	return board;
}

function mColorPickerBoard(dParent) {
	dParent = mDom(dParent); 

	//let board = drawHexBoard(7, 7, dParent, { bg: rColor(), padding:10, transition:'1s' }, {w:20,h:22, classes:'hexframe'}); //, {padding:10});
	let board = drawHexBoard(7, 7, dParent, { bg: 'transparent', padding: 10 }, { w: 20, h: 22 }); 
	board.dSample = mDom(dParent,{w:200,hmin:40,margin:'auto',align:'center'});
	let tables = mDom(dParent, {}, { id: 'dHslTable' });
	let colors = getColormapColors(); //console.log('colors', colors);

	let i = 0;
	for (const item of board.items) {
		let bg = colors[i++];
		item.color = bg;
		let dhex = iDiv(item);
		dhex.onmouseenter = () => onenterHex(item, board);
		dhex.onmouseleave = () => onleaveHex(item, board);
		dhex.onclick = () => onclickHex(item, board); //{mStyle(document.body, {bg});} 
		mStyle(dhex, { bg });
	}

	return board;
}
function toggleItemSelectionUnique(item, items) {
	let selitems = items.filter(x => x.isSelected == true); selitems.map(x => toggleItemSelection(x))
	toggleItemSelection(item);

}
function onclickHex(item, board) { 
	toggleItemSelectionUnique(item, board.items); 
	if (isdef(board.handler)) board.handler(item, board); 
}
function onenterHex(item, board) { 
	colorSample(board.dSample,item.color);
}
function onleaveHex(item, board) { 
	let selitem = board.items.find(x => x.isSelected == true); //console.log(selitem)
	if (nundef(selitem)) return;
	colorSample(board.dSample,selitem.color);
}
function colorSample(d,color){
	if (nundef(d)) return;
	mStyle(d, { bg: color }); //, fg:idealTextColor(color) });  
	d.innerHTML = `${color}<br>${w3color(color).toHslString()}`;
}

