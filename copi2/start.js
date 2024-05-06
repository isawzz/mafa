window.onload = start;

async function start() { test3(); }

async function test3() {
	let i = 0;
	let d;
	let maindivs = copi2_maindivs();
	mInsert(document.body, maindivs, i++);
	let dMain = d = mBy('dMain');
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
