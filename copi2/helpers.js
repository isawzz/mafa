function drawHexFlat(dParent, styles={},opts={}) {
  if (nundef(styles.w)) addKeys({ w: 100, h: 100, bg: 'blue' },styles);
	styles.h=valf(styles.h,styles.w);//*.866);
  addKeys({ classes:'hop1' },opts);
	let d=mDom(dParent,styles,opts);
  mStyle(d, { 'clip-path': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' });
  return d;
}
function getCenters(layout, rows, cols, wCell, hCell,) {
  if (layout == 'quad') { return quadCenters(rows, cols, wCell, hCell); }
  else if (layout == 'hex') { return hexCenters(rows, cols, wCell, hCell); }
  else if (layout == 'hex1') { info = hex1Centers(rows, cols, wCell, hCell); }
  else if (layout == 'circle') { return circleCenters(rows, cols, wCell, hCell); }
}
function calculateHexCenters(rows, cols, sideLength) {
	const centers = [];
	const sqrt3 = Math.sqrt(3);
	const verticalSpacing = sqrt3 * sideLength;
	const horizontalSpacing = 1.5 * sideLength;

	for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
					let x = j * horizontalSpacing + (i % 2 ? sideLength * 0.75 : 0);
					let y = i * verticalSpacing;
					centers.push({ x, y });
			}
	}
	return centers;
}
function hexCenters(rows, cols, wCell = 100, hCell) {
  if (nundef(hCell)) hCell = (wCell / .866);
  let hline = hCell * .75;
  let offX = wCell / 2, offY = hCell / 2;
  let centers = [];
  let startSmaller = Math.floor(rows / 2) % 2 == 1;
  let x = 0; y = 0;
  for (let r = 0; r < rows; r++) {
    let isSmaller = startSmaller && r % 2 == 0 || !startSmaller && r % 2 == 1;
    let curCols = isSmaller ? cols - 1 : cols;
    let dx = isSmaller ? wCell / 2 : 0;
    dx += offX;
    for (let c = 0; c < curCols; c++) {
      let center = { x: dx + c * wCell, y: offY + r * hline };
      centers.push(center);
    }
  }
  return [centers, wCell * cols, hCell / 4 + rows * hline];
}
function findColor(colorhex) {
	let x, y;
	colormap = document.getElementById("colormap");
	areas = colormap.getElementsByTagName("area");
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
function mInsert(dParent, el, index = 0) { dParent.insertBefore(el, dParent.childNodes[index]); return el; }
function setRect(elem, options) {
  let r = getRect(elem);
  elem.rect = r;
  elem.setAttribute('rect', `${r.w} ${r.h} ${r.t} ${r.l} ${r.b} ${r.r}`);
  if (isDict(options)) {
    if (options.hgrow) mStyle(elem, { hmin: r.h });
    else if (options.hfix) mStyle(elem, { h: r.h });
    else if (options.hshrink) mStyle(elem, { hmax: r.h });
    if (options.wgrow) mStyle(elem, { wmin: r.w });
    else if (options.wfix) mStyle(elem, { w: r.w });
    else if (options.wshrink) mStyle(elem, { wmax: r.w });
  }
  return r;
}


//#region _SVG/g shapes
function agColoredShape(g, shape, w, h, color) {
	//console.log(shape)
	let shapeFuncs = {	'circle': agCircle,	'hex': agHex,	'rect': agRect,}

	shapeFuncs[shape](g, w, h);
	gBg(g, color);
}
function agShape(g, shape, w, h, color, rounding) {
	let sh = gShape(shape, w, h, color, rounding);
	g.appendChild(sh);
	return sh;
}
function gShape(shape, w = 20, h = 20, color = 'green', rounding) {
	//console.log(shape)
	let el = gG();
	if (nundef(shape)) shape = 'rect';
	if (shape != 'line') agColoredShape(el, shape, w, h, color);
	else gStroke(el, color, w); //agColoredLine(el, w, color);

	if (isdef(rounding) && shape == 'rect') {
		let r = el.children[0];
		gRounding(r, rounding);
		//console.log(rounding,r);
		// r.setAttribute('rx', rounding); // rounding kann ruhig in % sein!
		// r.setAttribute('ry', rounding);
	}

	return el;
}

function gCreate(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }
function gPos(g, x, y) { g.style.transform = `translate(${x}px, ${y}px)`; }
function gSize(g, w, h, shape = null, iChild = 0) {
	//console.log(getTypeOf(g))
	let el = (getTypeOf(g) != 'g') ? g : g.children[iChild];
	let t = getTypeOf(el);
	//console.log('g', g, '\ntype of g child', el, 'is', t);
	switch (t) {
		case 'rect': el.setAttribute('width', w); el.setAttribute('height', h); el.setAttribute('x', -w / 2); el.setAttribute('y', -h / 2); break;
		case 'ellipse': el.setAttribute('rx', w / 2); el.setAttribute('ry', h / 2); break;
		default:
			if (shape) {
				switch (shape) {
					case 'hex': let pts = size2hex(w, h); el.setAttribute('points', pts); break;
				}
			}
	}
	return el;
}
function gBg(g, color) { g.setAttribute('fill', color); }
function gFg(g, color, thickness) { g.setAttribute('stroke', color); if (thickness) g.setAttribute('stroke-width', thickness); }
function gRounding(r, rounding) {
	//let r = el.children[0];
	//console.log(rounding,r);
	r.setAttribute('rx', rounding); // rounding kann ruhig in % sein!
	r.setAttribute('ry', rounding);

}
function gStroke(g, color, thickness) { g.setAttribute('stroke', color); if (thickness) g.setAttribute('stroke-width', thickness); }
function gSvg() { return gCreate('svg'); } //document.createElementNS('http://www.w3.org/2000/svg', 'svg'); }
function gG() { return gCreate('g'); }// document.createElementNS('http://www.w3.org/2000/svg', 'g'); }
function gHex(w, h) { let pts = size2hex(w, h); return gPoly(pts); }
function gPoly(pts) { let r = gCreate('polygon'); if (pts) r.setAttribute('points', pts); return r; }
function gRect(w, h) { let r = gCreate('rect'); r.setAttribute('width', w); r.setAttribute('height', h); r.setAttribute('x', -w / 2); r.setAttribute('y', -h / 2); return r; }
function gEllipse(w, h) { let r = gCreate('ellipse'); r.setAttribute('rx', w / 2); r.setAttribute('ry', h / 2); return r; }
function gLine(x1, y1, x2, y2) { let r = gCreate('line'); r.setAttribute('x1', x1); r.setAttribute('y1', y1); r.setAttribute('x2', x2); r.setAttribute('y2', y2); return r; }

function gCanvas(area, w, h, color, originInCenter = true) {
	let dParent = mBy(area);
	let div = stage3_prepContainer(dParent);
	div.style.width = w + 'px';
	div.style.height = h + 'px';

	let svg = gSvg();
	let style = `margin:0;padding:0;position:absolute;top:0px;left:0px;width:100%;height:100%;`
	svg.setAttribute('style', style);
	mColor(svg, color);
	div.appendChild(svg);

	let g = gG();
	if (originInCenter) g.style.transform = "translate(50%, 50%)";
	svg.appendChild(g);

	return g;

}

function agCircle(g, sz) { let r = gEllipse(sz, sz); g.appendChild(r); return r; }
function agEllipse(g, w, h) { let r = gEllipse(w, h); g.appendChild(r); return r; }
function agHex(g, w, h) { let pts = size2hex(w, h); return agPoly(g, pts); }
function agPoly(g, pts) { let r = gPoly(pts); g.appendChild(r); return r; }
function agRect(g, w, h) { let r = gRect(w, h); g.appendChild(r); return r; }
function agLine(g, x1, y1, x2, y2) { let r = gLine(x1, y1, x2, y2); g.appendChild(r); return r; }
function agG(g) { let g1 = gG(); g.appendChild(g1); return g1; }
//function agSvgg(d) { let svg = gSvg(); agG(svg); d.appendChild(svg); return g; }
function aSvg(dParent) {
	if (!dParent.style.position) dParent.style.position = 'relative';

	let svg1 = gSvg();
	//console.log(svg1)
	svg1.setAttribute('width', '100%');
	svg1.setAttribute('height', '100%');
	let style = 'margin:0;padding:0;position:absolute;top:0px;left:0px;';
	svg1.setAttribute('style', style);
	dParent.appendChild(svg1);

	return svg1;
}
function aSvgg(dParent, originInCenter = true) {
	if (!dParent.style.position) dParent.style.position = 'relative';

	let svg1 = gSvg();
	//console.log(svg1)
	svg1.setAttribute('width', '100%');
	svg1.setAttribute('height', '100%');
	let style = 'margin:0;padding:0;position:absolute;top:0px;left:0px;';
	svg1.setAttribute('style', style);
	dParent.appendChild(svg1);

	let g1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	svg1.appendChild(g1);
	if (originInCenter) { g1.style.transform = "translate(50%, 50%)"; } //works!

	return g1;

}
//endregion

