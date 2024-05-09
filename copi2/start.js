window.onload = start;

async function start() { test10_hexboard(); }

async function test10_hexboard() {
	let d=clearBodyReset100({gap:10}); mCenterFlex(d);
	for(const i of range(2)){
		let board=drawHexBoard(rChoose(range(1,3)),rChoose(range(1,5)),d,{bg:rColor()});
		console.log('board',board.items);
	}
}
async function test9_hexboard() {
	let d=clearBodyReset100({gap:10}); mCenterFlex(d);
	let board=drawHexBoard(4,4,d,{bg:rColor()});
	drawHexBoard(4,5,d,{bg:rColor()});
	drawHexBoard(5,5,d,{bg:rColor()});
	drawHexBoard(5,4,d,{bg:rColor()});
}
function drawHexBoard(topside,side,dParent,styles={},opts={}){
	addKeys({position:'relative'},styles, opts);
	let d = mDom(dParent, styles); // { position: 'relative', bg:'#222' });
	let [centers,rows,maxcols] = hexBoardCenters(topside,side);
	//console.log('centers',centers[0],centers)
	let sz = 20;
	let [w, h] = [sz, sz];
	let items = [];
	for(const c of centers){
		// let [x,y]=[w/2+c.x*w,h/2+c.y*h*.75];
		let dhex = hexFromCenter(d, {x:c.x*w,y:c.y*h}, { w:w-2, h:h-2, bg: 'pink' },{classes:'hop1'});
		dhex.onclick = ()=>mStyle(document.body, {bg:rColor()}); 
		let item = {div:dhex,cx:c.x,cy:c.y,row:c.row,col:c.col};
		items.push(item);
	}
	let [wBoard,hBoard]=[maxcols*w,rows*h*.75+h*.25];
	mStyle(d,{w:wBoard,h:hBoard}); //,'clip-path': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'});
	return {div:d,topside,side,centers,rows,maxcols,boardShape:'hex',w,h,wBoard,hBoard,items}

}
async function test8_hexboard() {
	let d = mDom(document.body, { position: 'relative', bg:'#222' });
	let sz = 100;	let [w, h] = [sz, sz];	let center = { x: w / 2, y: h / 2 };	let [x, y] = [w / 2, h / 2];
	let boardsz=6;	let [dx, dy, rows, cols] = [w, h * .75, boardsz*2-1, boardsz];
	let colarr = _calc_hex_col_array(rows,cols);let maxcols = arrMax(colarr); console.log(colarr);

	let rmid=Math.floor(rows/2); console.log(rows,rmid)
	let xmin=100000,xmax=-1,ymin=1000000,ymax=-1;
	for (const r of range(rows)) {
		let skip=maxcols-colarr[r]/2-boardsz+1;
		x = skip*w; y = h * .75 * r + h / 2; 
		if (x<xmin) xmin=x;if (y<ymin) ymin=y;if (x>xmax) xmax=x;if (y>ymax) ymax=y;
		console.log(`${x} ${y} (${colarr[r]})`)
		for (const c of range(colarr[r])) {
			//if (c<skip) {x+=w;continue;}
			//hexFromCenter(d, {x,y}, { w, h, bg: rColor() });
			let dhex = hexFromCenter(d, {x,y}, { w:w-2, h:h-2, bg: 'pink' },{classes:'hop1'});
			dhex.onclick = ()=>mStyle(document.body, {bg:rColor()}); 
			
			//drawHex(d, { w, h, x, y, bg: 'orange', position: 'absolute', border: 'dimgray' });
			//circleFromCenter(d, {x,y}, { w: 10, h: 10, bg: 'orangered' });
			x+=w;
		}

	}
	console.log('')
	mStyle(d,{w:maxcols*w,h:rows*h*.75+h*.25,'clip-path': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'});
}

function muell() {
	let dx = w;
	let nextCenter = { x: center.x + dx, y: center.y };
	drawHex(d, { w, h, x: nextCenter.x - w / 2, y: nextCenter.y - h / 2, bg: 'orange', position: 'absolute' })
	circleFromCenter(d, nextCenter, { w: 10, h: 10, bg: 'orangered' });

	let dy = h * .75;
	nextCenter = { x: center.x + dx / 2, y: center.y + dy };
	drawHex(d, { w, h, x: nextCenter.x - w / 2, y: nextCenter.y - h / 2, bg: 'pink', position: 'absolute' })
	circleFromCenter(d, nextCenter, { w: 10, h: 10, bg: 'hotpink' });
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
function hexFromCenter(dParent, center, styles = {}, opts = {}) {
	let [w, h] = mSizeSuccession(styles);
	let [left, top] = [center.x - w / 2, center.y - h / 2];
	let d = mDom(dParent, { position: 'absolute', left, top, 'clip-path': 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }, opts);
	mStyle(d, styles);
	return d;
}
function drawHex(dParent, styles = {}, opts = {}) {
	addKeys({ classes: 'hop1' }, opts);
	let d = mDom(dParent, styles, opts);
	mStyle(d, { 'clip-path': 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' });
	return d;
}
function mSizeSuccession(styles = {}, szDefault = 100, fromWidth = true) {
	let [w, h] = [styles.w, styles.h];
	if (fromWidth) {
		w = valf(w, styles.sz, h, szDefault);
		h = valf(h, styles.sz, w, szDefault);
	} else {
		h = valf(h, styles.sz, w, szDefault);
		w = valf(w, styles.sz, h, szDefault);
	}
	return [w, h];
}
function circleFromCenter(dParent, center, styles = {}) {
	mSizeSuccession(styles);
	let [left, top] = [center.x - styles.w / 2, center.y - styles.h / 2];
	let d = mDom(dParent, { position: 'absolute', left, top, round: true });
	mStyle(d, styles);
	return d;
}
async function muell() {
	return;
	let centers = calculateHexCenters(2, 2, szSide);
	console.log('centers', centers); console.log(Math.sqrt(3));
	//let [w,h]=[szSide*1.5,szSide*.75];
	//let w=szSide*Math.sqrt(3);
	for (const c of centers) {
		console.log(c)
		let hex = drawHex(d, { bg: 'red', w, h, top: c.x, left: c.y, position: 'absolute' });
		console.log(hex)
		//break;
	}
	//let dHex=drawHex(d,{bg:'red'}); console.log(dHex)
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
function hexBoard(dParent, rows = 5, cols = 5, wHex = 100) {
	let hline = (wHex / .866) * .75;
	dParent = mDiv(dParent, { position: 'relative', w: wHex * cols, h: hline * (rows + .5), display: 'inline-block' });
	let hlist = [];
	let xOffset = 0;//-20;
	for (let r = 0; r < rows; r++) {
		let curCols = r % 2 ? cols - 1 : cols;
		let dx = r % 2 ? wHex / 2 : 0;
		dx += xOffset;
		for (let c = 0; c < curCols; c++) {
			let [dOuter, dInner] = oneHex(dParent, wHex, wHex, '#ff000080'); //'#ffffff10');
			mStyleX(dOuter, { position: 'absolute', left: dx + c * wHex, top: r * (hline - 12) });
			hlist.push(dInner);
		}
	}
	function oneHex(dParent, w, h, bg) {
		let d1 = mDiv(dParent, { w: w, h: h, display: 'inline', position: 'relative' });
		let d2 = mDiv(d1, { w: w, h: h, display: 'inline', position: 'absolute', left: 0, top: 0 });
		let g = aSvgg(d2);
		let wgap = 8, hgap = 0;
		// let hex1 = agShape(g, 'hex', w - 2 * wgap, h - 2 * hgap, bg);
		let gap = 0;
		let hex1 = agShape(g, 'hex', w - gap, h - gap, colorTrans(rColor(), .5)); // - 2 * wgap, h - 2 * hgap, bg);
		let offx = 16;
		let offy = 20;
		let d3 = mDiv(d1, { w: w, h: h, display: 'inline', position: 'absolute', left: 0, top: 0 });
		let d4 = mDiv(d3, { left: `${offx / 2}%`, top: `${offy / 2}%`, w: `${100 - offx}%`, h: `${100 - offy}%`, rounding: '50%', display: 'inline', position: 'absolute' });
		return [d1, d4];
	}

	return hlist;
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
	setThemeCheckboxes();
}

function setThemeCheckboxes() {
	var x = localStorage.getItem("preferredmode");
	var y = localStorage.getItem("preferredpagemode");
	if (x == "dark") {
		document.getElementById("radio_darkcode").checked = true;

	}
	if (y == "dark") {
		document.getElementById("radio_darkpage").checked = true;
	}
}

function setThemeMode() {
	var x = localStorage.getItem("preferredmode");
	var y = localStorage.getItem("preferredpagemode");
	if (x == "dark") {
		document.body.className += " darktheme";
	}
	if (y == "dark") {
		document.body.className += " darkpagetheme";
	}
}
