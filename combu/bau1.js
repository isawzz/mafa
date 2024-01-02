async function natEdgeDetectTitle(k, src, border, idx) {

	let path = `../assets/games/nations/cards/${src}`;
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
	let [w, h] = [img.width, img.height]; console.log('w', w, 'h', h);

	//only consider images in landscape form
	if (h > w) { img.remove(); console.log(`NOT in landscape! ${k} ${src}`); return; }

	//als erstes brauch ich einen canvas!
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });
	ctx.drawImage(img, 0, 0, w, h);
	img.remove();

	let cgoal = '#544744';
	let [ex, ey] = findPoints(ctx, w * .25, w * .9, h * .05, h * .9, '#544744');

	let resy = findEdgesApart(ey, 0, 261, 'y');
	let resx = findEdgesApart(ex, 243, 0, 'x');
	//ok now I did detect an edge finally!!!!

	// let [restx,resty]=[ex.filter(o=>!resx.includes(o)),ey.filter(o=>!resy.includes(o))];
	// restx.map(p => drawPix(ctx, p.x, p.y, 'blue'));
	// resty.map(p => drawPix(ctx, p.x, p.y, 'yellow'));

	resy.map(p => drawPix(ctx, p.x, p.y, 'red'));
	resx.map(p => drawPix(ctx, p.x, p.y, 'green'));


	//mach corrections!
	let toplight = findRectSample(ctx, 20,w,0, 0, '#DBCEBE',4); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('top edge missing',toplight);

	//if top edge is missing then bottom edge will be higher up!
	let left = findLeftEdge(ctx, w, h, '#59544E'); left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	let right = findRightEdge(ctx, w, h, '#59544E'); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	let top,bottom;
	if (toplight) {
		console.log('top:',0)
		bottom = findBottomEdge(ctx, w, h-10, '#59544E'); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));

	}else{
		top = findTopEdge(ctx, w, h, '#59544E'); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		bottom = findBottomEdge(ctx, w, h, '#59544E'); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('top', top.length)
	}
	console.log('left', left.length)
	console.log('right', right.length)
	console.log('bottom', bottom.length)

	return [resx, resy];

}
function findRectSample(ctx, x1, x2, y1, y2, cgoal, sz) {
	let p;
	let minlen = sz;
	cgoal = colorRGB(cgoal, true);
	for (let yStart = y1; yStart <= y2; yStart += minlen) {
		for (let xStart = x1; xStart <= x2; xStart += minlen) {
			let found = true;
			for (let x = xStart; x < xStart + minlen; x++) {
				for (let y = yStart; y < yStart + minlen; y++) {
					//console.log(x,y,cgoal)
					p = isPix(ctx, x, y, cgoal, 20);
					//console.log(p)
					if (!p) { found = false; break; }
				}
				if (!found) break;
			}
			if (found) return true; // { x: xStart, y: y, color: p };
		}
	}
	return false; //null;// { x: null, color: null }

}
function findLeftEdge(ctx, w, h, cgoal) {
	let [ptsy, pts] = findPoints(ctx, 0, w * .1, 0, h, cgoal, 10); //console.log(pts)
	let list = ptsy.filter(o => isLightAfter(ctx, o.x, o.y) && isLightBefore(ctx, o.x, o.y));
	let vfreq = findMostFrequentVal(list, 'x'); console.log('x', vfreq)
	return list.filter(o => o.x == vfreq);
}
function findRightEdge(ctx, w, h, cgoal) {
	let [ptsy, pts] = findPoints(ctx, w * .9, w, 0, h, cgoal, 10); //console.log(pts)
	// //return ptsy;
	// let vfreq = findMostFrequentVal(ptsy,'x'); console.log('x',vfreq)
	let list = ptsy.filter(o => isLightAfter(ctx, o.x, o.y) && isLightBefore(ctx, o.x, o.y));
	let vfreq = findMostFrequentVal(list, 'x'); console.log('x', vfreq)
	return list.filter(o => o.x == vfreq);
}
function findTopEdge(ctx, w, h, cgoal) {
	let [ptsy, pts] = findPoints(ctx, 0, w, 0, h / 5, cgoal, 10); //console.log(pts)
	//return ptsy;
	let list = pts.filter(o => isLightAfterV(ctx, o.x, o.y) && isLightBeforeV(ctx, o.x, o.y));
	let vfreq = findMostFrequentVal(list, 'y'); console.log('y', vfreq)
	return list.filter(o => o.y == vfreq);
}
function findBottomEdge(ctx, w, h, cgoal) {
	let [ptsy, pts] = findPoints(ctx, 0, w, h * .9, h, cgoal, 10); //console.log(pts)
	//return ptsy;
	let list = pts.filter(o => isLightAfterV(ctx, o.x, o.y) && isLightBeforeV(ctx, o.x, o.y));
	let vfreq = findMostFrequentVal(list, 'y'); console.log('y', vfreq)
	return list.filter(o => o.y == vfreq);
}
function findEdgesApart(list, dx, dy, prop) {
	list.map(o => o.nei = findPointAtDistance(o, dx, dy, list, 10))
	//console.log(list)
	list = list.filter(o => o.nei)

	let vfreq = findMostFrequentVal(list, prop); console.log(prop, vfreq)
	let good = list.filter(o => isWithinDelta(o[prop], vfreq, 3));
	let rest = list.filter(o => !isWithinDelta(o[prop], vfreq, 3));
	vfreq = findMostFrequentVal(rest, prop); console.log(prop, vfreq)
	let good2 = list.filter(o => o[prop] == vfreq);
	list = good.concat(good2);
	return list;
}
function findPoints(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
	let p;
	let resy = [], resx = [];
	cgoal = colorRGB(cgoal, true);
	for (let y = y1; y < y2; y++) {
		for (let x = x1; x < x2; x++) {
			p = isPixDark(ctx, x, y, cgoal, delta);
			if (p) {
				let l = isLightBeforeV(ctx, x, y);
				let d = isLightAfterV(ctx, x, y);
				if (l || d) resy.push({ x, y })
				l = isLightBefore(ctx, x, y);
				d = isLightAfter(ctx, x, y);
				if (l || d) resx.push({ x, y })
			}
		}
	}

	return [resx, resy];
}

function findPointAtDistance(pt, dx, dy, list, delta = 0) {
	for (const p1 of list) {
		if (isWithinDelta(Math.abs(pt.x - p1.x), dx, delta) && isWithinDelta(Math.abs(pt.y - p1.y), dy, delta)) return p1;
	}
	return null;
}
function findHorizontal(ctx, x1, x2, y1, y2, cgoal, minlen = 10, delta = 20) {
	let p;
	cgoal = colorRGB(cgoal, true); console.log(cgoal)
	for (let y = y1; y < y2; y++) {
		for (let xStart = x1; xStart < x2; xStart++) {
			let found = true;
			for (let x = xStart; x < xStart + minlen; x++) {
				p = isPix(ctx, x, y, cgoal, delta);
				if (!p) { found = false; break; }
			}
			if (found) return { x: xStart, y: y, color: p };
		}
	}
	return null;// { x: null, color: null }
}


function rest() {
	//544744
	result = findPixels(ctx, 10, w, 0, h, [
		{ c: '#544744', cond: (pt, prev) => isColorBefore(ctx, pt.x, pt.y, '#DDD3CA', 15) }, // && isColorBefore(ctx, pt.x, pt.y, '#D8D0CD',15) },
		{ c: '#544744', cond: condDarkEdgesVertical },
	], 20);

	// result = findPixels(ctx, 10, w, 10, h, [
	// 	{ c: '#A6938D', cond: (pt, prev) => isColorAfter(ctx, pt.x, pt.y, '#FAF6FA',15) }, // && isColorBefore(ctx, pt.x, pt.y, '#D8D0CD',15) },
	// 	{ c: '#A6938D', cond: (pt, prev) => isColorBefore(ctx, pt.x, pt.y, '#FAF6FA',15)},
	// 	//{c:'#FAF6FA',cond:(pt,prev)=>approx(pt.x,arrLast(prev).x,8)},
	// 	// { c: '#a59187', cond: (pt, prev) => approx(pt.x - prev[0].x, 46, 4) }],
	// ], 20);
	console.log('...', result)
	img.remove();
}
function condDarkEdgesVertical(pt, list) {
	let [d, delta] = [261, 4];
	for (const p1 of list) {
		let dist = Math.abs(pt.y, p1.y);
		let ok = isWithinDelta(dist, d, delta);
		if (ok) {
			let [pt1, pt2] = [p1, pt];
			ok &&= isColorBefore(ctx, pt1.x, pt1.y, '#DDD3CA', 15)
			ok &&= isColorAfter(ctx, pt2.x, pt2.y, '#DDD3CA', 15)
			if (ok) return ok;
		}
	}
	return false;
}
function findPixels(ctx, x1, x2, y1, y2, arr, maxdelta) {
	console.log('params', x1, x2, y1, y2)
	console.log('arr', arr)
	let prev = [];
	// let [x, y, c, cond, i] = [x1, y1, 0]; //, arr[0].c, arr[0].cond, 1]; // convertToRgb(arr[0].c), arr[0].cond, 1];
	// console.log('c', c)
	let [x, y, i] = [x1, y1, 0];
	let results = [];
	let MAXX = 100000, cnt = 0;
	let [c, cond] = [arr[i].c, arr[i].cond];
	while (x <= x2 && y <= y2) {
		if (cnt++ > MAXX) { console.log('MAXX!!!!!!!!!!!!!!!'); return null; }
		//console.log('testing',x,y)
		let pi = isPixSim(ctx, x, y, c, maxdelta);
		if (pi) {
			let [p, acc] = [pi.p, pi.acc];
			//console.log('found pixel color', acc, colorHex(p), arr[i].c, x, y)
			//drawPixFrame(ctx,x,y,'red',5)
			//return {x,y};
			let pt = { x, y };
			let res = cond(pt, prev);
			if (res) {
				console.log('cond erfuellt!!!')
				drawPixFrame(ctx, x, y, 'red', 15)
				prev.push(pt);
				results.push({ x: x, y: y, color: p, csim: arr[i].c });
				if (results.length == arr.length) return results;
				//c = arr[i].c; //convertToRgb(arr[i].c);
				//cond = arr[i].cond;
				//console.log('c updated to', i, c); //maxdelta*=2;
				i++; if (i >= arr.length) { console.log('i MAX', i); return null; }
				[c, cond] = [arr[i].c, arr[i].cond];
				x += 30
			}
		}
		x++;
		if (x >= x2) { results = [];[x, y, i] = [x1, y + 1, 0];[c, cond] = [arr[i].c, arr[i].cond]; } //convertToRgb(arr[0].c), arr[0].cond, 1]; }

	}
	return null;
}
function approx(n, goal, delta) { return Math.abs(n - goal) <= delta; }
async function rest() {

	//fuer start suche: #D8BEAF rgb(215,189,174), D5BFB2 rgb(214,192,179), D3BDAF = rgb(208,189,174)
	// let corner2 = findSimPixLineHor(ctx, 5, 90, 5, 80, { r: 215, g: 189, b: 174 }, 10, 10);
	let corner2 = findSimPixLineHor(ctx, 5, 90, 5, 80, '#a18b81', 6, 14);
	if (!corner2) { console.log('no start!!!!'); img.style.display = 'none'; return null; }

	drawPixFrame(ctx, corner2.x, corner2.y, 'green', 7);
	let [x, y1, cgoal] = [corner2.x, corner2.y, { r: 167, g: 158, b: 151 }]; //colorRGB('#a18b81', true)];
	let result;
	for (let y = y1; y < y1 + 10; y++) {
		result = findSimPixXSequence(ctx, x, w, y,
			[{ r: 167, g: 158, b: 151 }, { r: 220, g: 216, b: 213 }, { r: 167, g: 158, b: 151 }],
			[0, 8, 50], 15)
		//console.log('result', result);

		if (result) { result.map(o => drawPixFrame(ctx, o.x, o.y, 'red', 7)); break; }
	}
	img.style.display = 'none';
	return result;
}
function findSimPixXSequence(ctx, x1, x2, y, clist, xmaxlist, maxdelta) {
	clist = convertToRgb(clist)
	let [x, i] = [x1, 0];
	let results = [];
	let prev = null;
	while (x <= x2 && i < clist.length) {
		let p = isPixSim(ctx, x, y, clist[i], maxdelta);
		if (p) {
			let abstand = !prev ? 0 : x - prev.x;
			//console.log('abstand', abstand, xmaxlist[i])
			if (abstand <= xmaxlist[i]) { prev = { x: x, y: y, color: p, csim: clist[i] }; results.push(prev); i++; }
		}
		x++;
	}
	if (results.length == clist.length) return results; else return null;
}
function findSimPixX(ctx, x1, x2, y, cgoal) {
	cgoal = convertToRgb(cgoal)
	for (let x = x1; x < x2; x++) {
		let p = isPixSim(ctx, x, y, cgoal); if (p) return { x: x, color: p };
	}
	return { x: null, color: null }
}
function findSimPixXY(ctx, x1, x2, y1, y2, cgoal) {
	cgoal = convertToRgb(cgoal)
	for (let y = y1; y < y2; y++) {
		for (let x = x1; x < x2; x++) {
			let p = isPixSim(ctx, x, y, cgoal); if (p) return { x: x, y: y, color: p };
		}
	}
	return { x: null, color: null }
}
function findSimPixLineHor(ctx, x1, x2, y1, y2, cgoal, minlen = 10, maxdelta = 20) {
	let p;
	cgoal = convertToRgb(cgoal)
	for (let y = y1; y < y2; y++) {
		for (let xStart = x1; xStart < x2; xStart++) {
			let found = true;
			for (let x = xStart; x < xStart + minlen; x++) {
				p = isPixSim(ctx, x, y, cgoal); if (!p) { found = false; break; }
			}
			if (found) return { x: xStart, y: y, color: p };
		}
	}
	return null;// { x: null, color: null }
}
function convertToRgb() {
	let result = [];
	for (const a of arguments) {
		if (isString(a)) result.push(colorRGB(a.toLowerCase(), true)); else result.push(a);
	}
	if (result.length == 1) return result[0];
	return result;
}






























