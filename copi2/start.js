window.onload = start;

function start() {
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
