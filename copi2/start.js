window.onload = start;

async function start() { test2();	}
async function test2(){
	let i=0;
	//mInsert(document.body,copi2_navbar(),i++); //GEHT!
	//mInsert(document.body,copi2_sidebar(),i++); //GEHT!
	let maindivs=copi2_maindivs();
	mInsert(document.body,maindivs,i++);
	let dMain=mBy('dMain');
	mAppend(dMain,copi2_title()); //GEHT!
	mAppend(dMain,copi2_prevNextButtons()); //GEHT!
	
	
}
async function test1(){
	//let d=clearBodyDiv(); mAppend(d,copi2_navbar()); //GEHT!! aber urviele fehlermeldungen!!!
	//mAppend(document.body,copi2_navbar()); // GEHT!
	mInsert(document.body,copi2_navbar()); //GEHT!
	mInsert(document.body,copi2_sidebar(),1); //GEHT!
	let maindivs=copi2_maindivs();
	mInsert(document.body,maindivs,2);
	let dMain=mBy('dMain');
	
	
}
async function test0(){
	prelims_orig();
}

function prelims_orig(){
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
