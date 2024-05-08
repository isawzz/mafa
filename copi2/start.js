window.onload = start;

async function start() { test7_hexboard(); }

async function test7_hexboard(){
	let d=mDom(document.body,{position:'relative'});
	let szSide=100;
	let [w,h]=[100,110];
	let dhex=drawHex(d,{w,h,x:0,y:0,bg:'green',position:'absolute'}); 
	let center = {x:w/2,y:h/2};
	circleFromCenter(d,center,{w:10,h:10,bg:'lime'});

	let dx = w;
	let nextCenter = {x:center.x+dx,y:center.y};
	drawHex(d,{w,h,x:nextCenter.x-w/2,y:nextCenter.y-h/2,bg:'orange',position:'absolute'})
	circleFromCenter(d,nextCenter,{w:10,h:10,bg:'orangered'});

	let dy = h*.75;
	nextCenter = {x:center.x+dx/2,y:center.y+dy};
	drawHex(d,{w,h,x:nextCenter.x-w/2,y:nextCenter.y-h/2,bg:'pink',position:'absolute'})
	circleFromCenter(d,nextCenter,{w:10,h:10,bg:'hotpink'});
}
function drawHex(dParent, styles={}, opts={}) {
  addKeys({ classes:'hop1' },opts);

	let d=mDom(dParent,styles,opts);
  mStyle(d, { 'clip-path': 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' });
  return d;
}
function drawHexAtCenter(dParent,x,y,w,h,bg){
	if (nundef(bg)) bg=rColor();
	return drawHex(dParent,{w,h,x,y,bg});
}
function circleFromCenter(dParent,center,styles={}){
	let [left,top]=[center.x-styles.w/2,center.y-styles.h/2];
	let d=mDom(dParent,{position:'absolute',left,top,round:true});
	mStyle(d,styles);
}
async function muell(){
	return;
	let centers=calculateHexCenters(2,2,szSide);
	console.log('centers',centers);console.log(Math.sqrt(3));
	//let [w,h]=[szSide*1.5,szSide*.75];
	//let w=szSide*Math.sqrt(3);
	for(const c of centers){
		console.log(c)
		let hex=drawHex(d,{bg:'red',w,h,top:c.x,left:c.y,position:'absolute'});
		console.log(hex)
		//break;
	}
	//let dHex=drawHex(d,{bg:'red'}); console.log(dHex)
}
async function test6_hexboard(){
	let d=mDom(document.body);
	let x=hexCenters(5,5,50);
	console.log('centers',x);
	let dHex=drawHex(d,{bg:'red'}); console.log(dHex)
}
async function test5_hexboard(){
	let d=mDom(document.body);
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
			mStyleX(dOuter, { position: 'absolute', left: dx + c * wHex, top: r * (hline-12) });
			hlist.push(dInner);
		}
	}
	function oneHex(dParent, w, h, bg) {
		let d1 = mDiv(dParent, { w: w, h: h, display: 'inline', position: 'relative' });
		let d2 = mDiv(d1, { w: w, h: h, display: 'inline', position: 'absolute', left: 0, top: 0 });
		let g = aSvgg(d2);
		let wgap = 8, hgap = 0;
		// let hex1 = agShape(g, 'hex', w - 2 * wgap, h - 2 * hgap, bg);
		let gap=0;
		let hex1 = agShape(g, 'hex', w-gap, h-gap, colorTrans(rColor(),.5)); // - 2 * wgap, h - 2 * hgap, bg);
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
	let d=mDom(document.body,{gap:10,padding:10},{id:'dMain'});
	mCenterFlex('dMain');

	for(const i of range(10))
	await mColorPicker(d,c=>mStyle(document.body,{bg:c}));

	// mAppend(d, part111()); //GEHT!
	clickColor('blue'); //colorObj.toHexString());
}

async function test3() {
	let i = 0;
	let d;
	// let maindivs = copi2_maindivs(); mInsert(document.body, maindivs, i++);
	// let dMain = d = mBy('dMain');

	d=mDom(document.body,{bg:'blue',hmax:199},{id:'dMain'})
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
