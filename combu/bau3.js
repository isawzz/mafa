
function calcBoundingBox(ctx,w,h,type){
	let [cgoal,clight,lighting]=type=='event'?['#6C4F64','#E7BB97',false]:['#59544E','#DBCEBE',true];

	let toplight = findRectSample(ctx, 20, w, 0, 0, clight, 4); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('top edge missing', toplight);
	let bottomlight = findRectSample(ctx, 20, w, h - 5, h - 5, clight, 4, true); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('bottom edge missing', bottomlight);
	let leftlight = findRectSample(ctx, 0, 0, 10, h, clight, 4); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('left edge missing', leftlight);
	let rightlight = findRectSample(ctx, w-5, w-5, 20, h-5, clight, 4, true); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('right edge missing', rightlight);

	let rect={};

	let [yoff1,yoff2,dyblank]=[0,20,lighting?15:0];
	let [xoff1,xoff2,dxblank]=[0,30,lighting?20:0];
	let top, bottom;
	if (toplight) {
		rect.top=0;
		console.log('top:', 0)
		//if top edge is missing then bottom edge will be higher up!
		bottom = findEdgeVert(ctx, h-yoff2-dyblank, h - yoff1-dyblank, w, cgoal, lighting); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.bottom=bottom[0].y; 
		console.log('bottom', bottom[0].y, bottom.length)
	} else if (bottomlight) {
		rect.bottom=h;
		top = findEdgeVert(ctx, yoff1+dyblank, yoff2+dyblank, w, cgoal, lighting); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('top', top[0].y, top.length)
		rect.top=top[0].y;
		console.log('bottom', h);
	} else {
		top = findEdgeVert(ctx, yoff1, yoff2, w, cgoal, lighting); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		bottom = findEdgeVert(ctx, h-yoff2, h - yoff1, w, cgoal, lighting); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		// top = findTopEdge(ctx, w, h, cgoal, 0, lighting); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		// bottom = findBottomEdge(ctx, w, h, cgoal, h, lighting); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.top=top[0].y;
		rect.bottom=bottom[0].y; 
		console.log('top', top[0].y, top.length)
		console.log('bottom', bottom[0].y, bottom.length)
	}

	let left,right;
	if (leftlight) {
		rect.left=0;
		console.log('left:', 0)
		//if top edge is missing then bottom edge will be higher up!
		// right = findRightEdge(ctx, w-10, h, cgoal, w-10, lighting); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		right = findEdgeHor(ctx, w-xoff2-dxblank, w - xoff1-dxblank, h, cgoal, lighting); 
		right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('right', right[0].x, right.length)
		rect.right=right[0].x; 
	} else if (rightlight) {
		//left = findLeftEdge(ctx, w, h, cgoal, 10, lighting); 
		left = findEdgeHor(ctx, xoff1+dxblank, xoff2+dxblank, h, cgoal, lighting); 
		left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('left', left[0].x, left.length)
		rect.left=left[0].x; 
		console.log('right', w);
		rect.right=w; 
	} else {
		// left = findLeftEdge(ctx, w, h, cgoal, 0, lighting); left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		// right = findRightEdge(ctx, w, h, cgoal,w,lighting); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		left = findEdgeHor(ctx, xoff1, xoff2, h, cgoal, lighting); 
		left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		right = findEdgeHor(ctx, w-xoff2, w - xoff1, h, cgoal, lighting); 
		right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('left', left[0].x, left.length)
		console.log('right', right[0].x, right.length)
		rect.left=left[0].x; 
		rect.right=right[0].x; 
	}

	// left = findLeftEdge(ctx, w, h, cgoal); left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	// right = findRightEdge(ctx, w, h, cgoal); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	// console.log('left', left.length)
	// console.log('right', right.length)

	rect.x=rect.left;rect.y=rect.top;rect.w=rect.right-rect.left;rect.h=rect.bottom-rect.top;

	return rect; // [resx, resy];

}

function allDarkPoints(ctx, w, dims) {
	let [y, xmin, top, bot] = [dims.y, dims.xmin, dims.top, dims.bot];
	let xlist = [];
	let n = 243; xmin = 120; //y -= 5;
	for (let x = 0; x < w; x++) { if (isPixDark(ctx, x, y)) { xlist.push(x); } }
	//console.log('list', xlist);
	//xlist.map(x => { drawPix(ctx, x, y, 'red', 2) });
	let diffs = [];
	for (let i = 0; i < xlist.length - 1; i++) {
		if (xlist[i] < xmin) continue;
		// if (isLightBefore(ctx, xlist[i], y)) { console.log('YES!', xlist[i]) } else { console.log('NO', xlist[i]); continue; }
		if (!isLightBefore(ctx, xlist[i], y)) continue;
		for (let j = i + 1; j < xlist.length; j++) {
			let pix = xlist[j];
			// if (isLightAfter(ctx, pix, y)) { console.log('YES!', pix) } else { console.log('NO', pix); continue; }
			if (!isLightAfter(ctx, pix, y)) continue;
			let d = xlist[j] - xlist[i];
			diffs.push({ i: i, j: j, d: d })
			//console.log('d', xlist[i], xlist[j], d)
			if (d >= n - 2 && d <= n + 2) { //} 243){
				//console.log('X BINGO!!!!!!!!!!!!!!!!!!!', xlist[i], xlist[y], y)
				let doben = xlist[i] - xlist[i - 1]; console.log('doben=' + doben)
				let dunten = arrLast(xlist) - xlist[j]; console.log('dunten=' + dunten)

				let test90 = pixTest90(ctx, y, xlist[i] - top, xlist[j] + bot);
				rot = test90 ? 90 : -90;
				xstart = test90 ? xlist[i] - top : xlist[i] - bot;
				xend = test90 ? xlist[j] + bot : xlist[j] + top;

				drawPix(ctx, xlist[i], y, 'green')
				drawPix(ctx, xlist[j], y, 'green')
				return [xstart, xlist[i], xlist[j], xend, xlist, rot]
			}
		}
	}
	console.log('diffs', diffs)
	return [0, 0, w, w, xlist, 0];
}
function calcBoundsY(ctx, x, h, n = 261) {
	let ystart = -1, yend = -1, y, countlines = 0, prevy = [], ymin = 0, hbound = h - 20;
	let isRotated = false;
	let y1, y2;
	let gotit = false;

	for (y = ymin; y < h; y++) {
		if (gotit) {
			let wt = isPixWhiteOrTransparent(ctx, x, y);

			if (wt) return [ystart, y1, y2, y - 1, isRotated, prevy];
		}
		if (isPixDark(ctx, x, y)) {
			if (isDarkLine(ctx, x, y, h, y < h / 2, y > h / 2)) {

				if (gotit) {
					console.log('====>y', y)
					return [ystart, y1, y2, y, isRotated];
				}

				ctx.fillStyle = 'black';
				yother = null;
				for (const py of prevy) {
					let dy = y - py;
					// console.log('dy', dy)
					if (dy > n - 3 && dy < n + 3) {
						gotit = true;
						isRotated = true;
						y1 = yother = py;
						y2 = y;
						console.log('BINGO!!!! zweites middle ding');
						ctx.fillStyle = 'red';
					}
				}
				prevy.push(y);
				// console.log('______', countlines++, y);
				ctx.fillRect(x - 2, y - 2, 5, 5);
				if (yother) {
					ctx.fillRect(x - 2, yother - 2, 5, 5);
					let i1 = prevy.indexOf(y1);
					console.log('i1', i1)
					ystart = i1 > 0 ? prevy[i1 - 1] : 0;
				}

				// if (ystart < 0) ystart = y; else if (y > hbound) { yend = y; break; }
				y += 5;
			}
		}
	}
	return [ystart, y1, y2, h, isRotated, prevy];
}
function drawPix(ctx, x, y, color = 'red', sz = 5) {
	ctx.fillStyle = color;
	ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz)
}
function drawPixFrame(ctx, x, y, color = 'red', sz = 5) {
	ctx.strokeStyle = color;
	ctx.strokeRect(x - sz / 2, y - sz / 2, sz, sz)
}
function findMostFrequentVal(arr,prop,delta=0) {
	if (!Array.isArray(arr) || arr.length === 0) {
		return null; // Return null for invalid input
	}

	let frequencyMap = new Map();

	// Count frequencies of y values
	for (let i = 0; i < arr.length; i++) {
		const val = arr[i][prop];
		for(let v=val-delta;v<=val+delta;v++)	frequencyMap.set(v, (frequencyMap.get(v) || 0) + 1);
	}

	// Find the y value with the maximum frequency
	let mostFrequentY;
	let maxFrequency = 0;

	for (let [y, frequency] of frequencyMap) {
		if (frequency > maxFrequency) {
			mostFrequentY = y;
			maxFrequency = frequency;
		}
	}

	// Return the most frequent y value
	return mostFrequentY;
}
function getPixAvg(arr) {
	let rsum = 0, gsum = 0, bsum = 0, n = arr.length;
	for (const el of arr) {
		rsum += el.r; gsum += el.g; bsum += el.b;
	}
	return { r: rsum / n, g: gsum / n, b: bsum / n };
}
function getPixLineAtX(ctx, x, y1, y2) {
	let res = [];
	for (let y = y1; y <= y2; y++) res.push(getPixRgb(ctx, x, y))
	return res;
}
function getPixHex(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	return colorHex(`rgb(${red},${green},${blue})`);

}
function getPixRgb(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	return { r: red, g: green, b: blue };
	//return colorHex(`rgb(${red},${green},${blue})`);

}
async function imgAsync(dParent, styles, opts) {
	let path = opts.src;
	delete opts.src;
	addKeys({ tag: 'img' }, opts); //if forget

	return new Promise((resolve, reject) => {
		const img = mDom(dParent, styles, opts);
		// const img = new Image();
		img.onload = () => {
			resolve(img);
		};
		img.onerror = (error) => {
			reject(error);
		};
		img.src = path;
	});
}
function imgAsCanvas(img, dParent) {
	dParent = toElem(dParent);
	mClear(dParent);
	let canvas = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
	return canvas;
}
function imgRotate90(dParent, img) {

	let canvas = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
	let ctx = canvas.getContext('2d');
	// ctx.translate(img.height, 0)
	ctx.translate(0, img.width);
	ctx.rotate(-90 * Math.PI / 180);

	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
	ctx.drawImage(img, 0, 0, img.width, img.height);
	return canvas;


}
async function imgToPortrait(src, width, dParent, sendToServer = false, path = null, downloadAtClient = false) { //}, path, viewParent, imgParent, sendToServer, downloadAtClient) {
	if (isdef(mBy('img1'))) mBy('img1').remove();
	let img = mDom(document.body, { position: 'absolute', top: '70vh', h: width }, { tag: 'img', id: 'img1' });
	await loadImageAsync(src, img); //hier ist img loaded!!!
	//return img; 
	dParent = toElem(dParent);
	mClear(dParent);
	let canvas = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
	let ctx = canvas.getContext('2d');
	ctx.translate(0, img.width);
	ctx.rotate(-90 * Math.PI / 180);
	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
	ctx.drawImage(img, 0, 0, img.width, img.height)
	if (downloadAtClient) downloadCanvas(canvas);
	if (sendToServer) {
		let dataUrl = canvas.toDataURL('image/png');
		let o = { image: dataUrl, path: path };
		let resp = await mPostRoute('postImage', o);
		return resp; //console.log('resp', resp);
	}
	return 'image NOT sent to server!'
}
async function imgSaveAsLandscape(src, width, path, viewParent, imgParent, sendToServer, downloadAtClient) {
	if (isdef(mBy('img1'))) mBy('img1').remove();
	let img = mDom(imgParent, { position: 'absolute', top: '100vh', h: width }, { tag: 'img', id: 'img1' });
	await loadImageAsync(src, img); //hier ist img loaded!!!
	mClear(viewParent);
	let canvas = mDom(viewParent, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
	let ctx = canvas.getContext('2d');
	ctx.translate(img.height, 0)
	ctx.rotate(90 * Math.PI / 180);
	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
	ctx.drawImage(img, 0, 0, img.width, img.height)
	if (downloadAtClient) downloadCanvas(canvas);
	if (sendToServer) {
		let dataUrl = canvas.toDataURL('image/png');
		let o = { image: dataUrl, path: path };
		let resp = await mPostRoute('postImage', o);
		return resp; //console.log('resp', resp);
	}
	return 'image NOT sent to server!'
}
async function natCivsToLandscape() {
	async function civSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient) {
		let path = `assets/games/nations/civs/civ_${name}.png`;
		return imgSaveAsLandscape(src, width, path, viewParent, imgParent, sendToServer, downloadAtClient);
	}

	let dbody = document.body; dbody.innerHTML = '';
	let viewParent = mDom(dbody, { bg: 'skyblue', hmin: '100vh' }, { id: 'd1' });
	// let dhidden = mDom(dbody);
	let civlist = ['america', 'arabia', 'china', 'egypt', 'ethiopia', 'greece', 'india', 'japan', 'korea', 'mali', 'mongolia', 'persia', 'poland', 'portugal', 'rome', 'venice', 'vikings'];
	for (const civ of ['vikings']) {
		let src = `../assets/games/nations/civs_old/${civ}.jpg`;
		let width = 800;
		let name = civ;
		let viewParent = viewParent;
		let imgParent = dbody;
		let sendToServer = true;
		let downloadAtClient = false;
		await civSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient);
		// let img = await imgSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient);
		// await onloadCiv(img, src, width, name, viewParent, imgParent, sendToServer, downloadAtClient);

	}
}
function isBetween(n, a, b) { return n >= a && n <= b }
function isDarkLine(ctx, x, y, h, before = true, after = true) {
	let almost1 = false, almost2 = false;
	let d = 3;
	if (before) {
		for (let yy = Math.max(0, y - d); yy < y; yy++) { //Math.min(y+5,h);yy++)	{
			let p = ctx.getImageData(x, yy, 1, 1).data;
			if (p[0] + p[1] + p[2] > 520) almost1 = true;
			// console.log(p[0],p[1],p[2]);
		}
	} else almost1 = true;
	if (after) {
		for (let yy = y + 1; yy < Math.min(y + 5, h); yy++) { //Math.min(y+5,h);yy++)	{
			let p = ctx.getImageData(x, yy, 1, 1).data;
			if (p[0] + p[1] + p[2] > 520) almost2 = true;
			// console.log(p[0],p[1],p[2]);
		}
	} else almost2 = true;
	return almost1 && almost2;
}
function isDarkBar(ctx, x, y, w, before = true, after = true) {
	let almost1 = false, almost2 = false;
	let d = 3;
	if (before) {
		for (let xx = Math.max(0, x - d); xx < x; xx++) { //Math.min(y+5,h);yy++)	{
			let p = ctx.getImageData(xx, y, 1, 1).data;
			if (p[0] + p[1] + p[2] > 520) almost1 = true;
			// console.log(p[0],p[1],p[2]);
		}
	} else almost1 = true;
	if (after) {
		for (let xx = x + 1; xx < Math.min(x + 5, w); xx++) { //Math.min(y+5,h);yy++)	{
			let p = ctx.getImageData(x, xx, 1, 1).data;
			if (p[0] + p[1] + p[2] > 520) almost2 = true;
			// console.log(p[0],p[1],p[2]);
		}
	} else almost2 = true;
	return almost1 && almost2;
}
function isLightAfter(ctx, x, y) {
	for (let p = x + 1; p < x + 4; p++) if (isPixLight(ctx, p, y)) return true;
	return false;
}
function isLightBefore(ctx, x, y) {
	for (let p = x - 4; p < x - 1; p++) if (isPixLight(ctx, p, y)) return true;
	return false;
}
function isLightAfterV(ctx, x, y) {
	for (let p = y + 1; p < y + 4; p++) if (isPixLight(ctx, x, p)) return true;
	return false;
}
function isLightBeforeV(ctx, x, y) {
	for (let p = y - 4; p < y - 1; p++) if (isPixLight(ctx, x, p)) return true;
	return false;
}
function isPix(ctx, x, y, color, delta=10) {
	let rgb = isString(color) ? colorRGB(color, true) : color;
	//console.log('rgb',rgb)
	let p = getPixRgb(ctx, x, y);
	let found = isWithinDelta(p.r, rgb.r, delta) && isWithinDelta(p.g, rgb.g, delta) && isWithinDelta(p.b, rgb.b, delta);
	return found?p:null;
}
function isPixGB(ctx, x, y, color, delta=10) {
	let rgb = isString(color) ? colorRGB(color, true) : color;
	//console.log('rgb',rgb)
	let p = getPixRgb(ctx, x, y);
	let found = isWithinDelta(p.g, rgb.g, delta) && isWithinDelta(p.b, rgb.b, delta);
	return found?p:null;
}
function isPixDark(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	return green < 100 && blue < 100;
}
function isPixLight(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	return red + green + blue > 520;
}
function _isPixSim(ctx, x, y, hexcolor) {
	let p = getPixHex(ctx, x, y);
	return p[1] == hexcolor[1] && p[3] == hexcolor[3] && p[5] == hexcolor[5] ? p : null;
}
function _isPixSim2(ctx, x, y, color, delta = 10) {
	let rgb = isString(color) ? colorRGB(color, true) : color;
	let p = getPixRgb(ctx, x, y);
	return isWithinDelta(p.r, rgb.r, delta) && isWithinDelta(p.g, rgb.g, delta) && isWithinDelta(p.b, rgb.b, delta) ? p : null;
}
function isPixSim(ctx, x, y, color, maxdelta) {
	let deltas = range(Math.max(0, maxdeltas / 2), maxdelta, 4);
	for (const delta of deltas) {
		let rgb = isString(color) ? colorRGB(color, true) : color;
		//console.log('rgb',rgb)
		let p = getPixRgb(ctx, x, y);
		let found = isWithinDelta(p.r, rgb.r, delta) && isWithinDelta(p.g, rgb.g, delta) && isWithinDelta(p.b, rgb.b, delta);
		if (found) return { p, acc: delta };
	}
	return null;
}
function isColorAfter(ctx, x, y, c, maxdelta) {
	for (let p = x + 1; p < x + 4; p++) if (isPixSim(ctx, p, y, c, maxdelta)) return true;
	return false;
}
function isColorBefore(ctx, x, y, c, maxdelta) {
	for (let p = x - 4; p < x - 1; p++) if (isPixSim(ctx, p, y, c, maxdelta)) return true;
	return false;
}
function isPixWhiteOrTransparent(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	//console.log('pix',red,green,blue,red + green + blue > 3*250)
	return red + green + blue > 3 * 250;
}
function isWithinDelta(n, goal, delta) { return isBetween(n, goal - delta, goal + delta) }
function pixShow(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	console.log('pix', x, y, red, green, blue, red + green + blue, isPixDark(ctx, x, y));
	if (isPixDark(ctx, x, y)) {
		drawPix(ctx, x, y);
		return true;
	}
	return false;
}
function pixTest90(ctx, y, x1, x2) {
	let x1ja = false, x2ja = false;
	// for (let x = x1 - 2; x <= x1 + 2; x++) if (isPixDark(ctx, x, y) && isLightAfter(ctx,x,y)) x1ja = true;
	for (let x = x1 - 2; x <= x1 + 2; x++) if (x == 0 || isPixDark(ctx, x, y)) x1ja = true;
	for (let x = x2 - 2; x <= x2 + 2; x++) if (isPixDark(ctx, x, y)) x2ja = true;
	return x1ja && x2ja; // isPixDark(ctx,x1,y) && isPixDark(ctx,x2,y)
}









