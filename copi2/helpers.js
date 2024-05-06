function mInsert(dParent, el, index = 0) { dParent.insertBefore(el, dParent.childNodes[index]); return el; }
function findColor(colorhex) {
	let x, y;
	colormap = document.getElementById("colormap");
	areas = colormap.getElementsByTagName("AREA");
	for (i = 0; i < areas.length; i++) {
		areacolor = areas[i].getAttribute("onmouseover").replace('mouseOverColor("', '');
		areacolor = areacolor.replace('")', '');
		//console.log('areacolor',areacolor)
		if (areacolor.toLowerCase() == colorhex) {
			cc = areas[i].getAttribute("onclick").replace(')', '').split(",");
			y = Number(cc[1]);
			x = Number(cc[2]);
		}
	}
	return [x,y];

}