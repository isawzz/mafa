
function mColorPickerHex(dParent,colors) {
	dParent = mDom(dParent); 

	//let board = drawHexBoard(7, 7, dParent, { bg: rColor(), padding:10, transition:'1s' }, {w:20,h:22, classes:'hexframe'}); //, {padding:10});
	let board = drawHexBoard(7, 7, dParent, { bg: 'transparent', padding: 10 }, { w: 20, h: 22 }); 
	//return board;
	board.dSample = mDom(dParent,{w:200,hmin:40,margin:'auto',align:'center'});
	//let tables = mDom(dParent, {}, { id: 'dHslTable' });
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
	mStyle(d, { bg: color, fg:idealTextColor(color) }); //, fg:idealTextColor(color) });  
	d.innerHTML = `${color}<br>${w3color(color).toHslString()}`;
}


function sortColorsByHueAndLuminance(colors) {
	function _hexToHSL(hex) {
		// Convert hex to RGB first
		let r = parseInt(hex.slice(1, 3), 16) / 255;
		let g = parseInt(hex.slice(3, 5), 16) / 255;
		let b = parseInt(hex.slice(5, 7), 16) / 255;
		let cmin = Math.min(r, g, b),
				cmax = Math.max(r, g, b),
				delta = cmax - cmin,
				h = 0,
				s = 0,
				l = 0;
	
		if (delta === 0)
				h = 0;
		else if (cmax === r)
				h = ((g - b) / delta) % 6;
		else if (cmax === g)
				h = (b - r) / delta + 2;
		else
				h = (r - g) / delta + 4;
	
		h = Math.round(h * 60);
	
		// Make negative hues positive behind 360°
		if (h < 0)
				h += 360;
	
		l = (cmax + cmin) / 2;
	
		// Calculate saturation
		s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		
		// Multiply s and l by 100 to get the value in percentage, rather than [0,1]
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);
	
		return { h, s, l };
	}
	return colors.sort((a, b) => {
		const hslA = _hexToHSL(a);
		const hslB = _hexToHSL(b);
		if (hslA.h !== hslB.h) {
				return hslA.h - hslB.h;
		}
		// Sort by luminance if hues are equal
		return hslB.l - hslA.l; // Note: reverse to get light to dark if desired
	});
}
function sortColorsByLumHue(colors) {
	function _hexToHSL(hex) {
		// Convert hex to RGB first
		let r = parseInt(hex.slice(1, 3), 16) / 255;
		let g = parseInt(hex.slice(3, 5), 16) / 255;
		let b = parseInt(hex.slice(5, 7), 16) / 255;
		let cmin = Math.min(r, g, b),
				cmax = Math.max(r, g, b),
				delta = cmax - cmin,
				h = 0,
				s = 0,
				l = 0;
	
		if (delta === 0)
				h = 0;
		else if (cmax === r)
				h = ((g - b) / delta) % 6;
		else if (cmax === g)
				h = (b - r) / delta + 2;
		else
				h = (r - g) / delta + 4;
	
		h = Math.round(h * 60);
	
		// Make negative hues positive behind 360°
		if (h < 0)
				h += 360;
	
		l = (cmax + cmin) / 2;
	
		// Calculate saturation
		s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		
		// Multiply s and l by 100 to get the value in percentage, rather than [0,1]
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);
	
		return { h, s, l };
	}
	return colors.sort((a, b) => {
		const hslA = _hexToHSL(a);
		const hslB = _hexToHSL(b);
		if (hslA.l !== hslB.l) {
				return hslA.l - hslB.l;
		}
		// Sort by luminance if hues are equal
		return hslB.h - hslA.h; // Note: reverse to get light to dark if desired
	});
}
