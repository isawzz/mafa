window.onload = start;

async function start() { test12_colorPicker(); }

async function test12_colorPicker(){
	let d = clearBodyReset100({ gap: 10 }); mCenterFlex(d);
	let cpi = mColorPicker(d,onclickColor);
}
async function test11_extractColors() {
	async function onclickColor(item,items){
		let selitems = items.filter(x=>x.isSelected==true); selitems.map(x=>toggleItemSelection(x))
		toggleItemSelection(item);
		mClassRemove(iDiv(item),'hexframe')
		mStyle(document.body,{bg:item.color});
	}
	async function onenterColor(item,board){	
		mStyle(iDiv(board),{bg:item.color});
	}
	async function onleaveColor(item,board){	
		let selitem = board.items.find(x=>x.isSelected==true); 
		if (isdef(selitem)) mStyle(iDiv(board),{bg:selitem.color});
	}
	
	let d = clearBodyReset100({ gap: 10 }); mCenterFlex(d);
	//let cpi = mColorPicker(d,onclickColor);
	let board = drawHexBoard(7, 7, d, { bg: rColor(), padding:10, transition:'1s' }, {w:20,h:22, classes:'hexframe'}); //, {padding:10});
	//let board = drawHexBoard(7, 7, d, { bg: rColor(), padding:10 }, {w:20,h:22, classes:'hexframe'}); //, {padding:10});
	let colors = getColormapColors(); console.log('colors', colors);
	let i = 0;
	for (const item of board.items) {
		let bg = colors[i++];
		item.color = bg;
		let dhex=iDiv(item);
		dhex.onmouseenter = ()=>onenterColor(item,board);
		dhex.onmouseleave = ()=>onleaveColor(item,board);
		dhex.onclick = ()=>onclickColor(item,board.items); //{mStyle(document.body, {bg});} 
		mStyle(dhex, { bg });
	}
	console.log('board', board);
}

async function test10_hexboard() {
	let d = clearBodyReset100({ gap: 10 }); mCenterFlex(d);
	for (const i of range(2)) {
		let board = drawHexBoard(rChoose(range(1, 3)), rChoose(range(1, 5)), d, { bg: rColor() });
		console.log('board', board);
	}
}
async function test9_hexboard() {
	let d = clearBodyReset100({ gap: 10 }); mCenterFlex(d);
	let board = drawHexBoard(4, 4, d, { bg: rColor() });
	drawHexBoard(4, 5, d, { bg: rColor() });
	drawHexBoard(5, 5, d, { bg: rColor() });
	drawHexBoard(5, 4, d, { bg: rColor() });
}
async function test8_hexboard() {
	let d = mDom(document.body, { position: 'relative', bg: '#222' });
	let sz = 100; let [w, h] = [sz, sz]; let center = { x: w / 2, y: h / 2 }; let [x, y] = [w / 2, h / 2];
	let boardsz = 6; let [dx, dy, rows, cols] = [w, h * .75, boardsz * 2 - 1, boardsz];
	let colarr = _calc_hex_col_array(rows, cols); let maxcols = arrMax(colarr); console.log(colarr);

	let rmid = Math.floor(rows / 2); console.log(rows, rmid)
	let xmin = 100000, xmax = -1, ymin = 1000000, ymax = -1;
	for (const r of range(rows)) {
		let skip = maxcols - colarr[r] / 2 - boardsz + 1;
		x = skip * w; y = h * .75 * r + h / 2;
		if (x < xmin) xmin = x; if (y < ymin) ymin = y; if (x > xmax) xmax = x; if (y > ymax) ymax = y;
		console.log(`${x} ${y} (${colarr[r]})`)
		for (const c of range(colarr[r])) {
			//if (c<skip) {x+=w;continue;}
			//hexFromCenter(d, {x,y}, { w, h, bg: rColor() });
			let dhex = hexFromCenter(d, { x, y }, { w: w - 2, h: h - 2, bg: 'pink' }, { classes: 'hop1' });
			dhex.onclick = () => mStyle(document.body, { bg: rColor() });

			//drawHex(d, { w, h, x, y, bg: 'orange', position: 'absolute', border: 'dimgray' });
			//circleFromCenter(d, {x,y}, { w: 10, h: 10, bg: 'orangered' });
			x += w;
		}

	}
	console.log('')
	mStyle(d, { w: maxcols * w, h: rows * h * .75 + h * .25, 'clip-path': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' });
}
async function test7_hexboard() {
	let d = mDom(document.body, { position: 'relative' });
	let szSide = 100;
	let [w, h] = [100, 110];
	let dhex = drawHex(d, { w, h, x: 0, y: 0, bg: 'green', position: 'absolute' });
	let center = { x: w / 2, y: h / 2 };
	circleFromCenter(d, center, { w: 10, h: 10, bg: 'lime' });

	let dx = w;
	let nextCenter = { x: center.x + dx, y: center.y };
	drawHex(d, { w, h, x: nextCenter.x - w / 2, y: nextCenter.y - h / 2, bg: 'orange', position: 'absolute' })
	circleFromCenter(d, nextCenter, { w: 10, h: 10, bg: 'orangered' });

	let dy = h * .75;
	nextCenter = { x: center.x + dx / 2, y: center.y + dy };
	drawHex(d, { w, h, x: nextCenter.x - w / 2, y: nextCenter.y - h / 2, bg: 'pink', position: 'absolute' })
	circleFromCenter(d, nextCenter, { w: 10, h: 10, bg: 'hotpink' });
}
async function test6_hexboard() {
	let d = mDom(document.body);
	let x = hexCenters(5, 5, 50);
	console.log('centers', x);
	let dHex = drawHex(d, { bg: 'red' }); console.log(dHex)
}
async function test5_hexboard() {
	let d = mDom(document.body);
	hexBoard(d);
}
async function test4() {
	let i = 0;
	let d = mDom(document.body, { gap: 10, padding: 10 }, { id: 'dMain' });
	mCenterFlex('dMain');

	for (const i of range(10))
		await mColorPicker(d, c => mStyle(document.body, { bg: c }));

	// mAppend(d, part111()); //GEHT!
	clickColor('blue'); //colorObj.toHexString());
}
async function test3() {
	let i = 0;
	let d;
	// let maindivs = copi2_maindivs(); mInsert(document.body, maindivs, i++);
	// let dMain = d = mBy('dMain');

	d = mDom(document.body, { bg: 'blue', hmax: 199 }, { id: 'dMain' })
	mAppend(d, part111()); //GEHT!
	clickColor('blue'); //colorObj.toHexString());
}
async function test2() {
	let i = 0;
	let d;
	//mInsert(document.body,copi2_navbar(),i++); //GEHT!
	//mInsert(document.body,copi2_sidebar(),i++); //GEHT!
	let maindivs = copi2_maindivs();
	mInsert(document.body, maindivs, i++);
	let dMain = d = mBy('dMain');
	// mAppend(d, copi2_title()); //GEHT!
	// mAppend(d, copi2_prevNextButtons()); //GEHT!
	// mAppend(d, copi2_horizontalLine()); //GEHT!
	mAppend(d, part111()); //GEHT!

	console.log(colorObj); clickColor('#ffff00'); //colorObj.toHexString());
	// let dRow1 = d = copi2_row();
	// mAppend(d, copi2_all111()); 

	// let dCol11 = d = copi2_col();
	// mAppend(dRow1, dCol11);
	// mAppend(d, copi2_titleh3('Pick a Color:')); //GEHT!

	// let dImgMap = d = mDom(d,{w:236,margin:'auto',bg:'red'});

	// mDom(d,{},{tag:'img',src:'../copi2/w3/img_colormap.gif'})
	// mAppend(d,copi2_imgForUsemap('../copi2/w3/img_colormap.gif','colormap'));
	// mAppend(d, copi2_usemap('colormap')); 




}
async function test1() {
	//let d=clearBodyDiv(); mAppend(d,copi2_navbar()); //GEHT!! aber urviele fehlermeldungen!!!
	//mAppend(document.body,copi2_navbar()); // GEHT!
	mInsert(document.body, copi2_navbar()); //GEHT!
	mInsert(document.body, copi2_sidebar(), 1); //GEHT!
	let maindivs = copi2_maindivs();
	mInsert(document.body, maindivs, 2);
	let dMain = mBy('dMain');


}
async function test0() {
	prelims_orig();
}

function prelims_orig() {
	var x = document.createElement("input");
	x.setAttribute("type", "color");
	if (x.type == "text") {
		document.getElementById("html5DIV").style.visibility = "hidden";
	}
	// setThemeMode(); //scheinbar garnicht gebraucht - vielleicht spaeter!
	// setThemeCheckboxes();
}
